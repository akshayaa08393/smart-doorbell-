// Notification Service for SmartGuard Doorbell
import { INITIAL_MOCK_NOTIFICATIONS } from "../data/mockNotifications";

const STORAGE_KEY = "smartguard_notifications";
const AUDIO_ENABLED_KEY = "smartguard_sound_enabled";

class NotificationService {
  constructor() {
    this.notifications = this.loadNotifications();
    this.soundEnabled = localStorage.getItem(AUDIO_ENABLED_KEY) !== "false";
    this.subscribers = new Set();
  }

  loadNotifications() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Failed to load notifications from storage:", e);
    }
    return [...INITIAL_MOCK_NOTIFICATIONS];
  }

  saveNotifications() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.notifications));
    } catch (e) {
      console.warn("Failed to save notifications to storage:", e);
    }
    this.notifySubscribers();
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    callback(this.notifications);
    return () => this.subscribers.delete(callback);
  }

  notifySubscribers() {
    for (const callback of this.subscribers) {
      callback([...this.notifications]);
    }
  }

  getAll() {
    return [...this.notifications];
  }

  getUnreadCount() {
    return this.notifications.filter((n) => !n.read).length;
  }

  markAsRead(notificationId) {
    this.notifications = this.notifications.map((n) =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    this.saveNotifications();
  }

  markAllAsRead() {
    this.notifications = this.notifications.map((n) => ({ ...n, read: true }));
    this.saveNotifications();
  }

  clearAll() {
    this.notifications = [];
    this.saveNotifications();
  }

  /**
   * Synthesize a chime using Web Audio API
   */
  playChime(type = "doorbell") {
    if (!this.soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === "doorbell") {
        // High note (Ding) -> Low note (Dong)
        const now = ctx.currentTime;
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(659.25, now); // E5
        gain1.gain.setValueAtTime(0.3, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.6);

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(523.25, now + 0.35); // C5
        gain2.gain.setValueAtTime(0.3, now + 0.35);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.35);
        osc2.stop(now + 1.2);
      } else {
        // Confirmation beep
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(880, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch (e) {
      // Audio autoplay policy might require user gesture first
      console.debug("Audio play skipped or not allowed yet:", e);
    }
  }

  setSoundEnabled(enabled) {
    this.soundEnabled = enabled;
    localStorage.setItem(AUDIO_ENABLED_KEY, String(enabled));
  }

  isSoundEnabled() {
    return this.soundEnabled;
  }

  createNotification({ title, message, visitorId, type = "visitor", priority = "high" }) {
    const d = new Date();
    const timeFormatted = d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });

    const newNotif = {
      id: `notif_${Date.now()}`,
      title,
      message,
      visitorId,
      timestamp: d.toISOString(),
      timeFormatted,
      read: false,
      type,
      priority
    };

    this.notifications.unshift(newNotif);
    this.saveNotifications();
    this.playChime("doorbell");

    return newNotif;
  }
}

export const notificationService = new NotificationService();
export default notificationService;
