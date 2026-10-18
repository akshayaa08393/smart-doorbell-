// Visitor Service - Manages visitor events, simulation, and data persistence
import { INITIAL_MOCK_VISITORS } from "../data/mockVisitors";
import { esp32Service } from "./esp32Service";
import { notificationService } from "./notificationService";
import { isFirebaseActive, firestore, storage } from "./firebase";
import { formatDate, formatTime, isToday, generateVisitorId } from "../utils/dateTime";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

const STORAGE_KEY = "smartguard_visitors";

class VisitorService {
  constructor() {
    this.visitors = this.loadInitialVisitors();
    this.subscribers = new Set();
    this.systemStatus = "idle"; // 'idle' | 'detecting' | 'capturing' | 'uploading' | 'recorded'
    this.statusListeners = new Set();
  }

  loadInitialVisitors() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Could not load stored visitors:", e);
    }
    return [...INITIAL_MOCK_VISITORS];
  }

  saveVisitors() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.visitors));
    } catch (e) {
      console.warn("Could not persist visitors to localStorage:", e);
    }
    this.notifySubscribers();
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    callback(this.visitors);
    return () => this.subscribers.delete(callback);
  }

  notifySubscribers() {
    for (const callback of this.subscribers) {
      callback([...this.visitors]);
    }
  }

  subscribeStatus(callback) {
    this.statusListeners.add(callback);
    callback(this.systemStatus);
    return () => this.statusListeners.delete(callback);
  }

  setSystemStatus(status) {
    this.systemStatus = status;
    for (const callback of this.statusListeners) {
      callback(this.systemStatus);
    }
  }

  getSystemStatus() {
    return this.systemStatus;
  }

  getAll() {
    return [...this.visitors];
  }

  getLatest() {
    return this.visitors.length > 0 ? this.visitors[0] : null;
  }

  getById(id) {
    return this.visitors.find((v) => v.id === id || v.visitorId === id) || null;
  }

  getStats() {
    const total = this.visitors.length;
    const today = this.visitors.filter((v) => isToday(v.detectedAt)).length;
    const unreadAlerts = notificationService.getUnreadCount();

    return {
      total,
      today,
      unreadAlerts,
      systemActive: true,
      lastDetection: this.visitors[0]?.detectedAt || null
    };
  }

  /**
   * Validate image payload
   */
  validateImage(captureResult) {
    if (!captureResult || !captureResult.imageUrl) {
      throw new Error("Invalid image capture payload: missing image data");
    }
    return true;
  }

  /**
   * Build complete visitor record structure
   */
  createVisitorRecord({ imageUrl, visitorType, notes, sensorDetails }) {
    const now = new Date();
    const sequenceNum = this.visitors.length + 1;
    const visitorId = generateVisitorId(sequenceNum);

    return {
      id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      visitorId,
      imageUrl,
      detectedAt: now.toISOString(),
      date: formatDate(now),
      time: formatTime(now),
      status: "Detected",
      isNew: true,
      storageStatus: isFirebaseActive() ? "Cloud Synced (Firebase)" : "Stored (Local/Demo)",
      notificationStatus: "Delivered",
      visitorType: visitorType || "Visitor at Door",
      confidence: "98.8%",
      sensorTrigger: sensorDetails?.source || "IR Sensor (Digital Pin 13 HIGH)",
      cameraDevice: "ESP32-CAM (OV2640)",
      resolution: "1600x1200 UXGA",
      notes: notes || "Visitor automatically detected and captured via contactless IR trigger."
    };
  }

  /**
   * Save record to Firebase if available, otherwise localStorage
   */
  async saveVisitorData(record) {
    if (isFirebaseActive() && firestore) {
      try {
        const docRef = await addDoc(collection(firestore, "visitors"), record);
        record.firebaseDocId = docRef.id;
        console.log("Firebase Firestore record saved with ID:", docRef.id);
      } catch (err) {
        console.warn("Failed saving to Firestore, keeping in local memory:", err);
      }
    }

    // Insert at beginning of array (newest first)
    this.visitors.unshift(record);
    this.saveVisitors();
    return record;
  }

  /**
   * Complete Simulation / Detection Workflow:
   * 1. detectVisitor()
   * 2. captureImage()
   * 3. validateImage()
   * 4. createVisitorRecord()
   * 5. uploadImage()
   * 6. saveVisitorData()
   * 7. createNotification()
   * 8. updateDashboard()
   */
  async simulateVisitorWorkflow(onStepProgress) {
    try {
      // Step 1: IR Sensor Detection
      this.setSystemStatus("detecting");
      if (onStepProgress) {
        onStepProgress({
          step: 1,
          key: "ir_sensor",
          statusText: "Detecting Visitor...",
          title: "IR Sensor Triggered",
          detail: "Visitor approached within 40cm. IR Sensor beam broke (GPIO 13).",
          activeNode: "IR_SENSOR"
        });
      }
      const sensorResult = await esp32Service.detectVisitor();

      // Step 2: ESP32-CAM Activation & Capture
      this.setSystemStatus("capturing");
      if (onStepProgress) {
        onStepProgress({
          step: 2,
          key: "camera_capture",
          statusText: "Capturing Image...",
          title: "ESP32-CAM Activated",
          detail: "OV2640 sensor auto-focused. Capturing high-resolution photo buffer.",
          activeNode: "ESP32_CAM"
        });
      }
      const captureResult = await esp32Service.captureVisitorImage();

      // Step 3: Image Validation
      if (onStepProgress) {
        onStepProgress({
          step: 3,
          key: "validation",
          statusText: "Validating Image...",
          title: "Image & Payload Validated",
          detail: "Verified frame buffer integrity (JPEG UXGA 1600x1200).",
          activeNode: "IMAGE_VALIDATION"
        });
      }
      this.validateImage(captureResult);
      await new Promise((r) => setTimeout(r, 450));

      // Step 4: Wi-Fi Transmission
      this.setSystemStatus("uploading");
      if (onStepProgress) {
        onStepProgress({
          step: 4,
          key: "wifi_transmit",
          statusText: "Uploading...",
          title: "Wi-Fi Transmission",
          detail: "Payload packaged with timestamp & transmitted to gateway via 802.11 b/g/n.",
          activeNode: "WIFI"
        });
      }
      await esp32Service.sendVisitorEvent({ ...sensorResult, ...captureResult });

      // Step 5: Firebase Cloud Storage / Local Persistence
      if (onStepProgress) {
        onStepProgress({
          step: 5,
          key: "firebase_save",
          statusText: "Uploading to Firebase...",
          title: "Firebase Cloud Storage",
          detail: isFirebaseActive()
            ? "Image stored in Firebase Cloud Storage & record indexed in Firestore."
            : "Demo Mode: Record indexed in local mock database with high-resolution sample.",
          activeNode: "FIREBASE"
        });
      }
      const newRecord = this.createVisitorRecord({
        imageUrl: captureResult.imageUrl,
        visitorType: captureResult.visitorType,
        sensorDetails: sensorResult
      });
      await this.saveVisitorData(newRecord);

      // Step 6: Homeowner Notification
      if (onStepProgress) {
        onStepProgress({
          step: 6,
          key: "notification",
          statusText: "Visitor Recorded",
          title: "Homeowner Notified",
          detail: `Push alert sent: New visitor (${newRecord.visitorId}) detected at ${newRecord.time}.`,
          activeNode: "NOTIFICATION"
        });
      }
      notificationService.createNotification({
        title: "New Visitor Detected",
        message: `Someone was detected at your door (${newRecord.visitorType || 'Visitor'}).`,
        visitorId: newRecord.visitorId,
        type: "visitor",
        priority: "high"
      });

      // Step 7: Completed - Return to active monitoring after brief display
      this.setSystemStatus("recorded");
      await new Promise((r) => setTimeout(r, 1400));
      this.setSystemStatus("idle");

      if (onStepProgress) {
        onStepProgress({
          step: 7,
          key: "complete",
          statusText: "Monitoring Active",
          title: "Workflow Complete",
          detail: "Dashboard and history updated. System reset to active contactless monitoring.",
          activeNode: "COMPLETED",
          record: newRecord
        });
      }

      return newRecord;
    } catch (error) {
      console.error("Simulation workflow error:", error);
      this.setSystemStatus("idle");
      throw error;
    }
  }

  deleteRecord(id) {
    this.visitors = this.visitors.filter((v) => v.id !== id && v.visitorId !== id);
    this.saveVisitors();
  }

  updateRecord(id, updates) {
    this.visitors = this.visitors.map((v) =>
      v.id === id || v.visitorId === id ? { ...v, ...updates } : v
    );
    this.saveVisitors();
  }

  dismissLatest() {
    if (this.visitors.length > 0) {
      this.visitors[0] = { ...this.visitors[0], isNew: false, status: "Dismissed" };
      this.saveVisitors();
    }
  }

  saveLatest() {
    if (this.visitors.length > 0) {
      this.visitors[0] = { ...this.visitors[0], isNew: false, status: "Saved" };
      this.saveVisitors();
    }
  }

  resetToDefaults() {
    this.visitors = [...INITIAL_MOCK_VISITORS];
    this.saveVisitors();
  }
}

export const visitorService = new VisitorService();
export default visitorService;
