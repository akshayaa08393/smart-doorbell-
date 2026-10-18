// Toast notification popups
import React, { useEffect } from "react";
import { CheckCircle2, AlertTriangle, Info, X, Bell } from "lucide-react";

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const iconMap = {
    success: <CheckCircle2 size={18} color="var(--accent-emerald)" />,
    warning: <AlertTriangle size={18} color="var(--accent-amber)" />,
    visitor: <Bell size={18} color="var(--accent-cyan)" />,
    info: <Info size={18} color="var(--accent-cyan)" />
  };

  return (
    <div style={{
      position: "fixed",
      bottom: "24px",
      right: "24px",
      zIndex: 99999,
      background: "var(--bg-card)",
      border: "1px solid rgba(6, 182, 212, 0.4)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.7), 0 0 20px rgba(6, 182, 212, 0.25)",
      padding: "14px 18px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      maxWidth: "380px",
      animation: "fadeIn 0.25s ease-out"
    }}>
      <div style={{
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        background: "rgba(6, 182, 212, 0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0
      }}>
        {iconMap[toast.type] || iconMap.info}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <h5 style={{ fontSize: "0.88rem", fontWeight: 700, margin: 0, color: "var(--text-main)" }}>
          {toast.title}
        </h5>
        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: "2px 0 0 0", lineHeight: 1.3 }}>
          {toast.message}
        </p>
      </div>

      <button
        onClick={onClose}
        style={{
          color: "var(--text-dim)",
          padding: "4px",
          display: "flex",
          alignItems: "center"
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
