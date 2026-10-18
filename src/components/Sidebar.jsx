// Sidebar Navigation for SmartGuard
import React from "react";
import { 
  LayoutDashboard, 
  Camera, 
  History, 
  Bell, 
  Settings, 
  LogOut, 
  ShieldCheck,
  Radio,
  Wifi,
  X
} from "lucide-react";

export default function Sidebar({ 
  currentTab, 
  onSelectTab, 
  isOpen, 
  onClose, 
  onLogout,
  unreadCount = 0,
  systemStatus = "idle"
}) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "live", label: "Live Visitor", icon: Camera, badge: systemStatus !== "idle" ? "Active" : null },
    { id: "history", label: "Visitor History", icon: History },
    { id: "notifications", label: "Notifications", icon: Bell, count: unreadCount },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.7)",
            zIndex: 140,
            backdropFilter: "blur(4px)"
          }}
          className="mobile-backdrop"
        />
      )}

      <aside 
        className={`sidebar-container ${isOpen ? "sidebar-open" : ""}`}
        style={{
          width: "260px",
          background: "var(--bg-secondary)",
          borderRight: "1px solid var(--border-subtle)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "24px 16px",
          height: "calc(100vh - 70px)",
          position: "sticky",
          top: "70px",
          zIndex: 150,
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        }}
      >
        {/* Navigation Links */}
        <div>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
            padding: "0 8px"
          }}>
            <span style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--text-dim)"
            }}>
              Monitoring Navigation
            </span>
            <button
              onClick={onClose}
              style={{
                display: "none",
                color: "var(--text-muted)",
                padding: "4px"
              }}
              className="sidebar-close-btn"
            >
              <X size={18} />
            </button>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onClose) onClose();
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 14px",
                    borderRadius: "var(--radius-md)",
                    background: isActive 
                      ? "linear-gradient(90deg, rgba(6, 182, 212, 0.15) 0%, rgba(59, 130, 246, 0.08) 100%)" 
                      : "transparent",
                    border: isActive ? "1px solid rgba(6, 182, 212, 0.3)" : "1px solid transparent",
                    color: isActive ? "#ffffff" : "var(--text-muted)",
                    fontWeight: isActive ? 600 : 500,
                    fontSize: "0.9rem",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                      e.currentTarget.style.color = "var(--text-main)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--text-muted)";
                    }
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <Icon size={19} color={isActive ? "var(--accent-cyan)" : "currentColor"} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="badge badge-detecting" style={{ fontSize: "0.65rem", padding: "2px 6px" }}>
                      {item.badge}
                    </span>
                  )}

                  {item.count !== undefined && item.count > 0 && (
                    <span style={{
                      background: "var(--accent-red)",
                      color: "#fff",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      padding: "2px 6px",
                      borderRadius: "var(--radius-full)"
                    }}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Area: Hardware Telemetry Card & Logout */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          
          {/* Live Status Card */}
          <div style={{
            background: "rgba(10, 16, 28, 0.8)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "14px",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="status-dot status-dot-green" />
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-main)" }}>
                  Monitoring Active
                </span>
              </div>
              <ShieldCheck size={16} color="var(--accent-emerald)" />
            </div>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.72rem",
              color: "var(--text-dim)",
              paddingTop: "6px",
              borderTop: "1px solid rgba(255, 255, 255, 0.05)"
            }}>
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Radio size={12} color="var(--accent-cyan)" /> IR Sensor: Ready
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Wifi size={12} color="var(--accent-emerald)" /> -58 dBm
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 14px",
              borderRadius: "var(--radius-md)",
              color: "#f87171",
              fontSize: "0.85rem",
              fontWeight: 500,
              background: "rgba(239, 68, 68, 0.05)",
              border: "1px solid rgba(239, 68, 68, 0.15)",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.05)";
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
