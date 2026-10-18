// Interactive Simulation Visualizer Modal
// Shows step-by-step progress with serial telemetry logs during "Simulate Visitor"

import React, { useEffect, useState } from "react";
import { 
  X, 
  Terminal, 
  CheckCircle2, 
  Loader2, 
  Radio, 
  Camera, 
  Wifi, 
  Database, 
  BellRing,
  ExternalLink
} from "lucide-react";

export default function WorkflowSimulationModal({ isOpen, onClose, currentStep, logs = [], capturedRecord, onViewDetails }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(3, 7, 18, 0.85)",
      backdropFilter: "blur(8px)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        background: "var(--bg-card)",
        border: "1px solid rgba(6, 182, 212, 0.3)",
        borderRadius: "var(--radius-xl)",
        width: "100%",
        maxWidth: "680px",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(6, 182, 212, 0.2)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        animation: "fadeIn 0.25s ease-out"
      }}>
        {/* Header */}
        <div style={{
          padding: "18px 24px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(255, 255, 255, 0.02)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span className="status-dot status-dot-amber" />
            <div>
              <h3 style={{ fontSize: "1.1rem", margin: 0, color: "var(--text-main)" }}>
                Contactless Doorbell Simulation Engine
              </h3>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>
                Simulating ESP32-CAM + IR Sensor hardware triggers & cloud sync
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              color: "var(--text-muted)",
              padding: "6px",
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center"
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Active Step Indicator */}
          <div style={{
            background: "rgba(10, 16, 28, 0.6)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            gap: "16px"
          }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: currentStep?.step === 7 ? "rgba(16, 185, 129, 0.2)" : "rgba(6, 182, 212, 0.15)",
              border: `1px solid ${currentStep?.step === 7 ? "var(--accent-emerald)" : "var(--accent-cyan)"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: currentStep?.step === 7 ? "var(--accent-emerald)" : "var(--accent-cyan)",
              flexShrink: 0
            }}>
              {currentStep?.step === 7 ? (
                <CheckCircle2 size={26} />
              ) : (
                <Loader2 size={26} className="animate-spin" style={{ animation: "spin 1.5s linear infinite" }} />
              )}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <span className={`badge ${currentStep?.step === 7 ? "badge-active" : "badge-cyan"}`}>
                  Step {currentStep?.step || 1} of 7
                </span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>
                  {currentStep?.statusText || "Initializing..."}
                </span>
              </div>
              <h4 style={{ fontSize: "1.05rem", color: "var(--text-main)", margin: 0, fontWeight: 600 }}>
                {currentStep?.title || "IR Sensor Beam Trigger"}
              </h4>
              <p style={{ fontSize: "0.825rem", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
                {currentStep?.detail || "Processing simulated hardware event..."}
              </p>
            </div>
          </div>

          {/* Captured Image Preview if available */}
          {capturedRecord && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-lg)",
              padding: "12px",
              animation: "fadeIn 0.3s ease-out"
            }}>
              <div style={{
                width: "90px",
                height: "65px",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                border: "1px solid var(--border-subtle)",
                flexShrink: 0
              }}>
                <img
                  src={capturedRecord.imageUrl}
                  alt="Visitor capture"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontWeight: 700, color: "var(--accent-cyan)", fontSize: "0.95rem" }}>
                    {capturedRecord.visitorId}
                  </span>
                  <span className="badge badge-active">Stored & Verified</span>
                </div>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
                  Detected at {capturedRecord.time} • {capturedRecord.date}
                </p>
                <p style={{ fontSize: "0.75rem", color: "var(--accent-emerald)", margin: "2px 0 0 0" }}>
                  ✓ Stored in {capturedRecord.storageStatus}
                </p>
              </div>
              {onViewDetails && (
                <button
                  onClick={() => onViewDetails(capturedRecord)}
                  className="btn btn-secondary"
                  style={{ fontSize: "0.8rem", padding: "6px 12px" }}
                >
                  <ExternalLink size={14} /> View
                </button>
              )}
            </div>
          )}

          {/* Simulated ESP32 Serial / Terminal Logs */}
          <div>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "8px"
            }}>
              <span style={{
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: "monospace"
              }}>
                <Terminal size={14} /> ESP32-CAM UART / Serial Monitor
              </span>
              <span style={{ fontSize: "0.7rem", color: "var(--text-dim)", fontFamily: "monospace" }}>
                Baud: 115200 • COM3 (Simulated)
              </span>
            </div>
            <div style={{
              background: "#050811",
              border: "1px solid rgba(255, 255, 255, 0.07)",
              borderRadius: "var(--radius-md)",
              padding: "12px 14px",
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: "0.75rem",
              color: "#38bdf8",
              maxHeight: "150px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "4px"
            }}>
              {logs.map((log, index) => (
                <div key={index} style={{ opacity: 0.9 }}>
                  <span style={{ color: "#64748b" }}>[{log.time}] </span>
                  <span style={{ color: log.type === "success" ? "#34d399" : log.type === "warning" ? "#fbbf24" : "#38bdf8" }}>
                    {log.text}
                  </span>
                </div>
              ))}
              {logs.length === 0 && (
                <div style={{ color: "#64748b" }}>Awaiting sensor trigger signal...</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: "16px 24px",
          borderTop: "1px solid var(--border-subtle)",
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
          background: "rgba(255, 255, 255, 0.02)"
        }}>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ fontSize: "0.85rem" }}
          >
            {currentStep?.step === 7 ? "Done" : "Run in Background"}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
