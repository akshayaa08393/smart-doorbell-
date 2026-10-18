import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

// Services
import { authService, DEFAULT_DEMO_USER } from "./services/authService";
import { visitorService } from "./services/visitorService";
import { notificationService } from "./services/notificationService";
import { esp32Service } from "./services/esp32Service";
import { formatTime } from "./utils/dateTime";

// Components
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import VisitorModal from "./components/VisitorModal";
import WorkflowSimulationModal from "./components/WorkflowSimulationModal";
import NotificationPanel from "./components/NotificationPanel";
import Toast from "./components/Toast";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import LiveVisitor from "./pages/LiveVisitor";
import VisitorHistory from "./pages/VisitorHistory";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [authView, setAuthView] = useState("login"); // 'login' | 'register'

  // Navigation & UI State
  const [currentTab, setCurrentTab] = useState("dashboard"); // 'dashboard' | 'live' | 'history' | 'notifications' | 'settings'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);

  // Core Data State
  const [visitors, setVisitors] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [systemStatus, setSystemStatus] = useState("idle");
  const [hardwareMode, setHardwareMode] = useState(esp32Service.getHardwareMode());
  const [soundEnabled, setSoundEnabled] = useState(notificationService.isSoundEnabled());

  // Simulation & Modal State
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationModalOpen, setSimulationModalOpen] = useState(false);
  const [simulationStepInfo, setSimulationStepInfo] = useState(null);
  const [simulationLogs, setSimulationLogs] = useState([]);
  const [capturedRecord, setCapturedRecord] = useState(null);
  const [selectedVisitor, setSelectedVisitor] = useState(null);

  // Toast State
  const [toast, setToast] = useState(null);

  // Subscribe to service changes
  useEffect(() => {
    const unsubAuth = authService.subscribe(setCurrentUser);
    const unsubVisitors = visitorService.subscribe(setVisitors);
    const unsubNotifs = notificationService.subscribe(setNotifications);
    const unsubStatus = visitorService.subscribeStatus(setSystemStatus);

    return () => {
      unsubAuth();
      unsubVisitors();
      unsubNotifs();
      unsubStatus();
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const stats = visitorService.getStats();

  // Show Toast Helper
  const showToast = useCallback((type, title, message) => {
    setToast({ type, title, message });
  }, []);

  // Workflow Simulation Execution
  const handleTriggerSimulation = async () => {
    if (isSimulating) return;

    setIsSimulating(true);
    setSimulationModalOpen(true);
    setCapturedRecord(null);
    setSimulationLogs([]);

    const addLog = (text, type = "info") => {
      const now = formatTime(new Date());
      setSimulationLogs((prev) => [...prev, { time: now, text, type }]);
    };

    addLog("System initialized. Awaiting contactless trigger...", "info");

    try {
      const newRecord = await visitorService.simulateVisitorWorkflow((stepData) => {
        setSimulationStepInfo(stepData);

        if (stepData.step === 1) {
          addLog("[IR_SENSOR] Contactless proximity detection on GPIO 13. Subject in range.", "warning");
        } else if (stepData.step === 2) {
          addLog("[OV2640] ESP32-CAM waking from sleep. Auto-exposure locked. Frame buffer captured.", "info");
        } else if (stepData.step === 3) {
          addLog("[VALIDATION] Checking payload integrity. 1600x1200 JPEG frame OK.", "info");
        } else if (stepData.step === 4) {
          addLog("[WIFI] Transmitting multipart event to cloud endpoint over 802.11b/g/n...", "info");
        } else if (stepData.step === 5) {
          addLog("[STORAGE] Image binary written. Firestore collection /visitors indexed.", "success");
        } else if (stepData.step === 6) {
          addLog(`[NOTIFICATION] Doorbell chime triggered. Push alert dispatched (${stepData.statusText}).`, "success");
        } else if (stepData.step === 7) {
          addLog("✓ [COMPLETED] Visitor record active. Contactless monitoring resumed.", "success");
        }
      });

      setCapturedRecord(newRecord);
      showToast(
        "visitor",
        "New Visitor Detected!",
        `${newRecord.visitorId} (${newRecord.visitorType}) recorded at ${newRecord.time}`
      );
    } catch (err) {
      console.error("Simulation run error:", err);
      addLog(`[ERROR] Simulation halted: ${err.message}`, "warning");
      showToast("warning", "Simulation Alert", "Simulation completed with mock fallback.");
    } finally {
      setIsSimulating(false);
    }
  };

  // View Visitor Details Modal
  const handleViewVisitorDetails = (visitor) => {
    setSelectedVisitor(visitor);
  };

  // Save Record
  const handleSaveRecord = (visitor) => {
    visitorService.updateRecord(visitor.id, { isNew: false, status: "Saved" });
    showToast("success", "Record Saved", `Visitor ${visitor.visitorId} saved to your archives.`);
    if (selectedVisitor?.id === visitor.id) {
      setSelectedVisitor((prev) => ({ ...prev, isNew: false, status: "Saved" }));
    }
  };

  // Dismiss Record
  const handleDismissRecord = (visitor) => {
    visitorService.updateRecord(visitor.id, { isNew: false, status: "Dismissed" });
    showToast("info", "Alert Dismissed", `Visitor ${visitor.visitorId} marked as dismissed.`);
    if (selectedVisitor?.id === visitor.id) {
      setSelectedVisitor((prev) => ({ ...prev, isNew: false, status: "Dismissed" }));
    }
  };

  // Delete Record
  const handleDeleteRecord = (id) => {
    visitorService.deleteRecord(id);
    showToast("info", "Record Deleted", "Visitor entry removed from records.");
  };

  // Notification actions
  const handleMarkAsRead = (id) => {
    notificationService.markAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead();
    showToast("success", "Notifications Cleared", "All notifications marked as read.");
  };

  const handleClearAllNotifications = () => {
    notificationService.clearAll();
    showToast("info", "Cleared", "All notification history removed.");
  };

  const handleToggleSound = () => {
    const nextVal = !soundEnabled;
    notificationService.setSoundEnabled(nextVal);
    setSoundEnabled(nextVal);
    if (nextVal) {
      notificationService.playChime("doorbell");
      showToast("success", "Doorbell Audio", "Doorbell chime enabled.");
    } else {
      showToast("info", "Doorbell Audio", "Doorbell chime muted.");
    }
  };

  const handleChangeHardwareMode = (mode) => {
    esp32Service.setHardwareMode(mode);
    setHardwareMode(mode);
    showToast("info", "Hardware Mode Changed", `Switched to ${mode === "simulation" ? "Demo / Simulation" : "Physical ESP32-CAM"} Mode.`);
  };

  const handleResetData = () => {
    visitorService.resetToDefaults();
    showToast("success", "Data Reset", "Sample visitor history restored to default.");
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setAuthView("login");
    showToast("info", "Signed Out", "You have been signed out.");
  };

  // Shortcut for notification to open a visitor
  const handleNotificationViewVisitor = (visitorId, targetTab) => {
    if (targetTab) {
      setCurrentTab(targetTab);
      return;
    }
    if (visitorId) {
      const found = visitorService.getById(visitorId);
      if (found) {
        setSelectedVisitor(found);
      } else {
        setCurrentTab("history");
      }
    }
  };

  // Render Login/Register if not authenticated
  if (!currentUser) {
    if (authView === "register") {
      return (
        <Register
          onRegisterSuccess={(user) => {
            setCurrentUser(user);
            showToast("success", "Account Created", `Welcome, ${user.displayName}!`);
          }}
          onNavigateLogin={() => setAuthView("login")}
        />
      );
    }
    return (
      <Login
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          showToast("success", "Login Successful", `Welcome back, ${user.displayName}!`);
        }}
        onNavigateRegister={() => setAuthView("register")}
      />
    );
  }

  // Active Main Page View
  const renderTabContent = () => {
    switch (currentTab) {
      case "dashboard":
        return (
          <Dashboard
            visitors={visitors}
            stats={stats}
            systemStatus={systemStatus}
            activeWorkflowStep={simulationStepInfo?.step}
            isSimulating={isSimulating}
            onTriggerSimulation={handleTriggerSimulation}
            onViewVisitorDetails={handleViewVisitorDetails}
            onSaveLatest={() => visitors.length > 0 && handleSaveRecord(visitors[0])}
            onDismissLatest={() => visitors.length > 0 && handleDismissRecord(visitors[0])}
            onNavigateTab={setCurrentTab}
          />
        );
      case "live":
        return (
          <LiveVisitor
            latestVisitor={visitors[0] || null}
            systemStatus={systemStatus}
            isSimulating={isSimulating}
            onTriggerSimulation={handleTriggerSimulation}
            onViewImage={handleViewVisitorDetails}
            onSaveRecord={handleSaveRecord}
            onDismissRecord={handleDismissRecord}
          />
        );
      case "history":
        return (
          <VisitorHistory
            visitors={visitors}
            onViewDetails={handleViewVisitorDetails}
            onDeleteRecord={handleDeleteRecord}
          />
        );
      case "notifications":
        return (
          <Notifications
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onClearAll={handleClearAllNotifications}
            onViewVisitor={handleNotificationViewVisitor}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
          />
        );
      case "settings":
        return (
          <Settings
            user={currentUser}
            onUpdateUser={(updated) => {
              authService.setCurrentUser({ ...currentUser, ...updated });
              showToast("success", "Profile Updated", "Your profile details have been updated.");
            }}
            hardwareMode={hardwareMode}
            onChangeHardwareMode={handleChangeHardwareMode}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            onResetData={handleResetData}
            onLogout={handleLogout}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-root">
      {/* Top Navigation */}
      <Navbar
        user={currentUser}
        unreadCount={unreadCount}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onToggleNotifications={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
        hardwareMode={hardwareMode}
        onNavigate={setCurrentTab}
      />

      {/* Notifications Dropdown */}
      {isNotifDropdownOpen && (
        <NotificationPanel
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onClearAll={handleClearAllNotifications}
          onViewVisitor={handleNotificationViewVisitor}
          onClose={() => setIsNotifDropdownOpen(false)}
          isDropdown={true}
        />
      )}

      {/* Main Body */}
      <div className="app-main-layout">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onLogout={handleLogout}
          unreadCount={unreadCount}
          systemStatus={systemStatus}
        />

        <main className="content-viewport">
          {renderTabContent()}
        </main>
      </div>

      {/* Visitor Detail Modal */}
      <VisitorModal
        visitor={selectedVisitor}
        isOpen={Boolean(selectedVisitor)}
        onClose={() => setSelectedVisitor(null)}
        onDelete={handleDeleteRecord}
        onSaveToggle={handleSaveRecord}
      />

      {/* Live Hardware Simulation Progress Modal */}
      <WorkflowSimulationModal
        isOpen={simulationModalOpen}
        onClose={() => setSimulationModalOpen(false)}
        currentStep={simulationStepInfo}
        logs={simulationLogs}
        capturedRecord={capturedRecord}
        onViewDetails={(rec) => {
          setSimulationModalOpen(false);
          handleViewVisitorDetails(rec);
        }}
      />

      {/* Toast Alert */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
