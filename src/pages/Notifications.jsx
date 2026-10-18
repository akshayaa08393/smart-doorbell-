// Dedicated Notifications Page
import React from "react";
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  Volume2, 
  VolumeX, 
  Sparkles 
} from "lucide-react";
import NotificationPanel from "../components/NotificationPanel";

export default function Notifications({
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onViewVisitor,
  soundEnabled = true,
  onToggleSound,
  onSimulateNotification
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }} className="animate-fade-in">
      
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", margin: 0, fontWeight: 800 }}>
            Security Notifications
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
            Real-time push events and doorbell ring history
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {/* Sound Mute/Unmute Button */}
          <button
            onClick={onToggleSound}
            className="btn btn-secondary"
            style={{ fontSize: "0.85rem" }}
            title={soundEnabled ? "Audio Chime Enabled" : "Audio Chime Muted"}
          >
            {soundEnabled ? (
              <>
                <Volume2 size={16} color="var(--accent-emerald)" /> Sound: Active
              </>
            ) : (
              <>
                <VolumeX size={16} color="var(--text-dim)" /> Sound: Muted
              </>
            )}
          </button>

          {notifications.length > 0 && (
            <>
              <button
                onClick={onMarkAllAsRead}
                className="btn btn-secondary"
                style={{ fontSize: "0.85rem" }}
              >
                <CheckCheck size={16} /> Mark All as Read
              </button>

              <button
                onClick={onClearAll}
                className="btn btn-secondary"
                style={{ color: "#f87171", fontSize: "0.85rem" }}
              >
                <Trash2 size={16} /> Clear All
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Full Notification Panel */}
      <NotificationPanel
        notifications={notifications}
        onMarkAsRead={onMarkAsRead}
        onMarkAllAsRead={onMarkAllAsRead}
        onClearAll={onClearAll}
        onViewVisitor={onViewVisitor}
        isDropdown={false}
      />
    </div>
  );
}
