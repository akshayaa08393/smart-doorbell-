// Top Navigation Bar for SmartGuard
import React, { useState, useEffect } from "react";
import { 
  Shield, 
  Bell, 
  Menu, 
  Wifi, 
  Clock, 
  User, 
  Cpu, 
  CloudCheck,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { formatTime, formatDate } from "../utils/dateTime";
import { isFirebaseActive } from "../services/firebase";

export default function Navbar({ 
  user, 
  unreadCount = 0, 
  onToggleSidebar, 
  onToggleNotifications,
  hardwareMode = "simulation",
  onNavigate
}) {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isFirebase = isFirebaseActive();

  return (
    <header style={{
      height: "70px",
      background: "rgba(13, 21, 39, 0.85)",
      backdropFilter: "blur(14px)",
      borderBottom: "1px solid var(--border-subtle)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      position: "sticky",
      top: 0,
      zIndex: 100
    }}>
      {/* Left: Mobile Toggle & Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button
          onClick={onToggleSidebar}
          className="btn-secondary"
          style={{
            padding: "8px",
            borderRadius: "var(--radius-md)",
            display: "none"
          }}
          id="mobile-menu-btn"
          aria-label="Toggle Sidebar Menu"
        >
          <Menu size={20} />
        </button>

        <div 
          onClick={() => onNavigate && onNavigate("dashboard")}
          style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
        >
          <div style={{
            width: "38px",
            height: "38px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 15px rgba(6, 182, 212, 0.4)"
          }}>
            <Shield size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.25rem",
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "-0.02em"
              }}>
                SmartGuard
              </span>
              <span style={{
                fontSize: "0.65rem",
                background: "rgba(6, 182, 212, 0.15)",
                color: "var(--accent-cyan)",
                border: "1px solid rgba(6, 182, 212, 0.3)",
                padding: "2px 6px",
                borderRadius: "var(--radius-full)",
                fontWeight: 700
              }}>
                DOORBELL
              </span>
            </div>
            <span style={{ fontSize: "0.7rem", color: "var(--text-dim)", display: "block", marginTop: "-2px" }}>
              Intelligent Contactless Monitoring
            </span>
          </div>
        </div>
      </div>

      {/* Middle: Live Clock & System Status Badges */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }} className="nav-center-badges">
        {/* Hardware Status Pill */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid var(--border-subtle)",
          padding: "5px 12px",
          borderRadius: "var(--radius-full)",
          fontSize: "0.78rem"
        }}>
          <Cpu size={14} color="var(--accent-cyan)" />
          <span style={{ color: "var(--text-muted)" }}>HW:</span>
          <span style={{ fontWeight: 600, color: hardwareMode === "simulation" ? "var(--accent-amber)" : "var(--accent-emerald)" }}>
            {hardwareMode === "simulation" ? "Simulation Mode" : "ESP32-CAM"}
          </span>
        </div>

        {/* Firebase Status Pill */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid var(--border-subtle)",
          padding: "5px 12px",
          borderRadius: "var(--radius-full)",
          fontSize: "0.78rem"
        }}>
          <span className={`status-dot ${isFirebase ? "status-dot-green" : "status-dot-amber"}`} />
          <span style={{ color: "var(--text-muted)" }}>Cloud:</span>
          <span style={{ fontWeight: 600, color: isFirebase ? "var(--accent-emerald)" : "#fbbf24" }}>
            {isFirebase ? "Firebase Synced" : "Local Mock Storage"}
          </span>
        </div>

        {/* Live Date/Time */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "var(--text-muted)",
          fontSize: "0.8rem",
          fontFamily: "monospace"
        }}>
          <Clock size={14} color="var(--accent-cyan)" />
          <span>{formatDate(currentDateTime)} • {formatTime(currentDateTime)}</span>
        </div>
      </div>

      {/* Right: Notifications & User Profile */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        {/* Notification Bell */}
        <button
          onClick={onToggleNotifications}
          style={{
            position: "relative",
            width: "40px",
            height: "40px",
            borderRadius: "var(--radius-md)",
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-main)",
            transition: "all 0.2s"
          }}
          aria-label="View Notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span style={{
              position: "absolute",
              top: "-4px",
              right: "-4px",
              background: "var(--accent-red)",
              color: "#ffffff",
              fontSize: "0.7rem",
              fontWeight: 700,
              minWidth: "18px",
              height: "18px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 10px rgba(239, 68, 68, 0.6)"
            }}>
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* User Profile Pill */}
        <div 
          onClick={() => onNavigate && onNavigate("settings")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "5px 12px 5px 6px",
            borderRadius: "var(--radius-full)",
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid var(--border-subtle)",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          <div style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontWeight: 700,
            fontSize: "0.85rem"
          }}>
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : "A"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
            <span style={{ fontSize: "0.825rem", fontWeight: 600, color: "var(--text-main)", lineHeight: 1.2 }}>
              {user?.displayName || "Homeowner"}
            </span>
            <span style={{ fontSize: "0.7rem", color: "var(--accent-cyan)", lineHeight: 1 }}>
              {user?.role || "Resident"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
