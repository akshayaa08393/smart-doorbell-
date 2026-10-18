// Visitor Detail Modal - Zoomed image, metadata, and hardware diagnostics
import React from "react";
import { 
  X, 
  Calendar, 
  Clock, 
  Camera, 
  Radio, 
  Database, 
  ShieldCheck, 
  Trash2, 
  Download,
  Bookmark
} from "lucide-react";

export default function VisitorModal({ visitor, isOpen, onClose, onDelete, onSaveToggle }) {
  if (!isOpen || !visitor) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(3, 7, 18, 0.88)",
      backdropFilter: "blur(8px)",
      zIndex: 9998,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-xl)",
        width: "100%",
        maxWidth: "760px",
        maxHeight: "92vh",
        boxShadow: "var(--shadow-lg)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        animation: "fadeIn 0.25s ease-out"
      }}>
        {/* Header */}
        <div style={{
          padding: "16px 24px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(255, 255, 255, 0.02)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span className="badge badge-cyan">{visitor.visitorId}</span>
            <h3 style={{ fontSize: "1.1rem", margin: 0, color: "var(--text-main)" }}>
              {visitor.visitorType || "Visitor Detection Record"}
            </h3>
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

        {/* Scrollable Content */}
        <div style={{ padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Large Image with Camera HUD viewfinder */}
          <div className="camera-viewfinder" style={{ height: "340px", position: "relative" }}>
            <div className="camera-corner corner-tl" />
            <div className="camera-corner corner-tr" />
            <div className="camera-corner corner-bl" />
            <div className="camera-corner corner-br" />

            <div className="camera-hud">
              <div>
                <span className="rec-dot" />
                <span>ARCHIVED CAPTURE</span>
              </div>
              <div>{visitor.resolution || "1600x1200 UXGA"} • 30 FPS</div>
            </div>

            <img
              src={visitor.imageUrl}
              alt={`Visitor ${visitor.visitorId}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block"
              }}
            />

            <div style={{
              position: "absolute",
              bottom: "12px",
              left: "14px",
              background: "rgba(0, 0, 0, 0.75)",
              padding: "4px 10px",
              borderRadius: "var(--radius-sm)",
              fontFamily: "monospace",
              fontSize: "0.75rem",
              color: "#38bdf8",
              zIndex: 4
            }}>
              CAM-01 • {visitor.date} {visitor.time}
            </div>
          </div>

          {/* Details Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px"
          }}>
            <div style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "12px 14px"
            }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                <Calendar size={14} /> Date & Time
              </div>
              <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-main)" }}>
                {visitor.date}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--accent-cyan)" }}>
                {visitor.time}
              </div>
            </div>

            <div style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "12px 14px"
            }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                <Radio size={14} /> Detection Trigger
              </div>
              <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--accent-emerald)" }}>
                IR Sensor Triggered
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-dim)" }}>
                Digital Pin 13 (HIGH)
              </div>
            </div>

            <div style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "12px 14px"
            }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                <Camera size={14} /> Camera Hardware
              </div>
              <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-main)" }}>
                {visitor.cameraDevice || "ESP32-CAM (OV2640)"}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-dim)" }}>
                Resolution: {visitor.resolution || "1600x1200"}
              </div>
            </div>

            <div style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "12px 14px"
            }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                <Database size={14} /> Cloud Storage
              </div>
              <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-main)" }}>
                {visitor.storageStatus}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--accent-emerald)" }}>
                Verification ID: #{visitor.id.slice(0, 10)}
              </div>
            </div>
          </div>

          {/* Notes description */}
          <div style={{
            background: "rgba(6, 182, 212, 0.05)",
            border: "1px solid rgba(6, 182, 212, 0.2)",
            borderRadius: "var(--radius-md)",
            padding: "14px 16px"
          }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--accent-cyan)", marginBottom: "4px" }}>
              Event Notes & Confidence
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>
              {visitor.notes || "Contactless visitor detection recorded via infrared sensor beam. Visual frame captured by ESP32-CAM and indexed."}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: "16px 24px",
          borderTop: "1px solid var(--border-subtle)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(255, 255, 255, 0.02)"
        }}>
          {onDelete && (
            <button
              onClick={() => {
                if (window.confirm(`Delete record for ${visitor.visitorId}?`)) {
                  onDelete(visitor.id);
                  onClose();
                }
              }}
              className="btn btn-danger"
              style={{ fontSize: "0.85rem", padding: "8px 14px" }}
            >
              <Trash2 size={16} /> Delete Record
            </button>
          )}

          <div style={{ display: "flex", gap: "10px", marginLeft: "auto" }}>
            <a
              href={visitor.imageUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
              style={{ fontSize: "0.85rem", padding: "8px 14px" }}
            >
              <Download size={16} /> Open Full Image
            </a>
            <button
              onClick={onClose}
              className="btn btn-primary"
              style={{ fontSize: "0.85rem", padding: "8px 16px" }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
