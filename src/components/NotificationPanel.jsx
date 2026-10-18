// Notification Panel dropdown & list view
import React from "react";
import { 
  Bell, 
  CheckCheck, 
  UserCheck, 
  Database, 
  Wifi, 
  Clock, 
  ExternalLink,
  Trash2,
  X
} from "lucide-react";
import { getRelativeTime } from "../utils/dateTime";

export default function NotificationPanel({ 
  notifications = [], 
  onMarkAsRead, 
  onMarkAllAsRead, 
  onClearAll, 
  onViewVisitor, 
  onClose,
  isDropdown = false 
}) {
  const getIcon = (type) => {
    switch (type) {
      case "visitor":
        return <UserCheck size={16} color="var(--accent-cyan)" />;
      case "storage":
        return <Database size={16} color="var(--accent-emerald)" />;
      case "system":
        return <Wifi size={16} color="var(--accent-amber)" />;
      default:
        return <Bell size={16} color="var(--accent-cyan)" />;
    }
  };

  const content = (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      maxHeight: isDropdown ? "460px" : "none"
    }}>
      {/* Header */}
      <div style={{
        padding: "16px 20px",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(255, 255, 255, 0.02)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Bell size={18} color="var(--accent-cyan)" />
          <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700 }}>
            Notifications
          </h4>
          <span className="badge badge-cyan" style={{ fontSize: "0.68rem" }}>
            {notifications.filter((n) => !n.read).length} Unread
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {notifications.length > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="btn btn-secondary"
              style={{ fontSize: "0.75rem", padding: "4px 8px" }}
              title="Mark all as read"
            >
              <CheckCheck size={14} /> Read All
            </button>
          )}

          {isDropdown && onClose && (
            <button
              onClick={onClose}
              style={{ color: "var(--text-muted)", padding: "4px" }}
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Notifications Scroll List */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column"
      }}>
        {notifications.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center" }}>
            <Bell size={32} color="var(--text-dim)" style={{ margin: "0 auto 8px" }} />
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>
              No notifications yet.
            </p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              style={{
                padding: "14px 20px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
                background: notif.read ? "transparent" : "rgba(6, 182, 212, 0.04)",
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                transition: "background 0.2s ease"
              }}
            >
              <div style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: notif.read ? "rgba(255, 255, 255, 0.04)" : "rgba(6, 182, 212, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: "2px"
              }}>
                {getIcon(notif.type)}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                  <span style={{
                    fontSize: "0.85rem",
                    fontWeight: notif.read ? 500 : 700,
                    color: notif.read ? "var(--text-muted)" : "var(--text-main)"
                  }}>
                    {notif.title}
                  </span>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-dim)", whiteSpace: "nowrap" }}>
                    {notif.timeFormatted || getRelativeTime(notif.timestamp)}
                  </span>
                </div>

                <p style={{
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                  margin: "4px 0 8px 0",
                  lineHeight: 1.4
                }}>
                  {notif.message}
                </p>

                {/* Actions row */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {notif.visitorId && onViewVisitor && (
                    <button
                      onClick={() => {
                        onViewVisitor(notif.visitorId);
                        if (onClose) onClose();
                      }}
                      className="btn btn-secondary"
                      style={{ fontSize: "0.72rem", padding: "3px 8px" }}
                    >
                      <ExternalLink size={12} /> View Visitor
                    </button>
                  )}

                  {!notif.read && (
                    <button
                      onClick={() => onMarkAsRead(notif.id)}
                      style={{
                        fontSize: "0.72rem",
                        color: "var(--accent-cyan)",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        cursor: "pointer"
                      }}
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer if dropdown */}
      {isDropdown && (
        <div style={{
          padding: "10px 16px",
          borderTop: "1px solid var(--border-subtle)",
          textAlign: "center",
          background: "rgba(255, 255, 255, 0.02)"
        }}>
          <button
            onClick={() => {
              if (onViewVisitor) onViewVisitor(null, "notifications");
              if (onClose) onClose();
            }}
            style={{ fontSize: "0.8rem", color: "var(--accent-cyan)", fontWeight: 500 }}
          >
            Open All Notifications Page →
          </button>
        </div>
      )}
    </div>
  );

  if (isDropdown) {
    return (
      <div 
        className="glass-card"
        style={{
          position: "absolute",
          top: "65px",
          right: "24px",
          width: "380px",
          maxWidth: "calc(100vw - 32px)",
          zIndex: 1000,
          boxShadow: "var(--shadow-lg)",
          border: "1px solid rgba(6, 182, 212, 0.3)",
          overflow: "hidden"
        }}
      >
        {content}
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ overflow: "hidden" }}>
      {content}
    </div>
  );
}
