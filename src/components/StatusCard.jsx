// Reusable KPI card for Dashboard metrics
import React from "react";

export default function StatusCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  accent = "cyan", 
  badgeText, 
  pulse = false,
  onClick
}) {
  const accentStyles = {
    cyan: {
      border: "rgba(6, 182, 212, 0.25)",
      glow: "rgba(6, 182, 212, 0.15)",
      color: "var(--accent-cyan)",
      dotClass: "status-dot-cyan"
    },
    emerald: {
      border: "rgba(16, 185, 129, 0.3)",
      glow: "rgba(16, 185, 129, 0.15)",
      color: "var(--accent-emerald)",
      dotClass: "status-dot-green"
    },
    amber: {
      border: "rgba(245, 158, 11, 0.3)",
      glow: "rgba(245, 158, 11, 0.15)",
      color: "var(--accent-amber)",
      dotClass: "status-dot-amber"
    },
    red: {
      border: "rgba(239, 68, 68, 0.3)",
      glow: "rgba(239, 68, 68, 0.15)",
      color: "var(--accent-red)",
      dotClass: "status-dot-amber"
    }
  };

  const currentTheme = accentStyles[accent] || accentStyles.cyan;

  return (
    <div 
      className="glass-card"
      onClick={onClick}
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderTop: `3px solid ${currentTheme.color}`,
        cursor: onClick ? "pointer" : "default"
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <span style={{
            fontSize: "0.8rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "var(--text-muted)"
          }}>
            {title}
          </span>
          <div style={{
            fontSize: "1.85rem",
            fontWeight: 800,
            fontFamily: "var(--font-heading)",
            color: "var(--text-main)",
            marginTop: "6px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            {pulse && <span className={`status-dot ${currentTheme.dotClass}`} />}
            <span>{value}</span>
          </div>
        </div>

        {Icon && (
          <div style={{
            width: "44px",
            height: "44px",
            borderRadius: "var(--radius-md)",
            background: currentTheme.glow,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: currentTheme.color
          }}>
            <Icon size={22} />
          </div>
        )}
      </div>

      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: "14px",
        paddingTop: "12px",
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
        fontSize: "0.78rem"
      }}>
        <span style={{ color: "var(--text-dim)" }}>
          {subtitle}
        </span>
        {badgeText && (
          <span className={`badge ${accent === "emerald" ? "badge-active" : accent === "amber" ? "badge-detecting" : "badge-cyan"}`} style={{ fontSize: "0.68rem" }}>
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
}
