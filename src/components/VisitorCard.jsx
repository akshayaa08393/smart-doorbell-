// Latest Visitor Card component for the Dashboard
import React from "react";
import { 
  Calendar, 
  Clock, 
  ShieldAlert, 
  Eye, 
  Check, 
  X, 
  Radio, 
  Camera,
  Sparkles
} from "lucide-react";

export default function VisitorCard({ 
  visitor, 
  onViewDetails, 
  onSave, 
  onDismiss, 
  onSimulate, 
  isSimulating = false 
}) {
  if (!visitor) {
    return (
      <div className="glass-card" style={{ padding: "40px 24px", textAlign: "center" }}>
        <div style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "rgba(6, 182, 212, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
          color: "var(--accent-cyan)"
        }}>
          <Camera size={28} />
        </div>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "8px" }}>No Visitors Detected Yet</h3>
        <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", maxWidth: "420px", margin: "0 auto 20px" }}>
          The contactless IR sensor is monitoring the doorway. Trigger a simulation to test detection and camera capture.
        </p>
        <button
          onClick={onSimulate}
          disabled={isSimulating}
          className="btn btn-simulate"
          style={{ margin: "0 auto" }}
        >
          <Sparkles size={16} /> Simulate Visitor
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ overflow: "hidden" }}>
      {/* Card Header */}
      <div style={{
        padding: "16px 20px",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(255, 255, 255, 0.02)",
        flexWrap: "wrap",
        gap: "10px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span className="status-dot status-dot-green" />
          <h3 style={{ fontSize: "1.1rem", margin: 0, fontWeight: 700 }}>
            LATEST VISITOR
          </h3>
          {visitor.isNew && (
            <span className="badge badge-cyan" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Sparkles size={12} /> New Visitor
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span className="badge badge-active">
            {visitor.status || "Detected"}
          </span>
          <span style={{
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            background: "rgba(255, 255, 255, 0.05)",
            padding: "4px 8px",
            borderRadius: "var(--radius-sm)"
          }}>
            ID: {visitor.visitorId}
          </span>
        </div>
      </div>

      {/* Card Body - Grid Layout */}
      <div style={{
        padding: "20px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "24px",
        alignItems: "center"
      }}>
        {/* Left: Large Visitor Image with Viewfinder */}
        <div className="camera-viewfinder" style={{ height: "280px", position: "relative" }}>
          <div className="camera-corner corner-tl" />
          <div className="camera-corner corner-tr" />
          <div className="camera-corner corner-bl" />
          <div className="camera-corner corner-br" />

          <div className="camera-hud">
            <div>
              <span className="rec-dot" />
              <span>LIVE CAM-01</span>
            </div>
            <div>OV2640 • 1080P</div>
          </div>

          <img
            src={visitor.imageUrl}
            alt="Latest Doorbell Visitor"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block"
            }}
          />

          <div style={{
            position: "absolute",
            bottom: "10px",
            left: "12px",
            background: "rgba(0,0,0,0.75)",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "0.72rem",
            fontFamily: "monospace",
            color: "#38bdf8",
            zIndex: 4
          }}>
            TIMESTAMP: {visitor.time}
          </div>
        </div>

        {/* Right: Visitor Metadata & Quick Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <span style={{ fontSize: "0.78rem", color: "var(--accent-cyan)", fontWeight: 600 }}>
              {visitor.visitorType || "Visitor at Door"}
            </span>
            <h4 style={{ fontSize: "1.35rem", fontWeight: 700, margin: "4px 0 6px 0", color: "var(--text-main)" }}>
              Contactless Detection Alert
            </h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
              {visitor.notes || "Visitor triggered infrared optical barrier. ESP32-CAM woke from sleep and captured high-definition frame buffer."}
            </p>
          </div>

          {/* Details specs */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "12px"
          }}>
            <div>
              <span style={{ fontSize: "0.72rem", color: "var(--text-dim)", display: "flex", alignItems: "center", gap: "4px" }}>
                <Calendar size={12} /> Date
              </span>
              <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text-main)" }}>
                {visitor.date}
              </span>
            </div>

            <div>
              <span style={{ fontSize: "0.72rem", color: "var(--text-dim)", display: "flex", alignItems: "center", gap: "4px" }}>
                <Clock size={12} /> Time
              </span>
              <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--accent-cyan)" }}>
                {visitor.time}
              </span>
            </div>

            <div>
              <span style={{ fontSize: "0.72rem", color: "var(--text-dim)", display: "flex", alignItems: "center", gap: "4px" }}>
                <Radio size={12} /> Sensor
              </span>
              <span style={{ fontSize: "0.82rem", fontWeight: 500, color: "var(--accent-emerald)" }}>
                IR Beam Interrupted
              </span>
            </div>

            <div>
              <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>
                Cloud Status
              </span>
              <span style={{ fontSize: "0.82rem", fontWeight: 500, color: "var(--text-main)" }}>
                {visitor.storageStatus}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginTop: "4px" }}>
            <button
              onClick={() => onViewDetails && onViewDetails(visitor)}
              className="btn btn-primary"
              style={{ flex: 1, minWidth: "140px" }}
            >
              <Eye size={16} /> View Details
            </button>

            {onSave && (
              <button
                onClick={() => onSave(visitor)}
                className="btn btn-secondary"
                title="Save record"
              >
                <Check size={16} /> Save Record
              </button>
            )}

            {onDismiss && (
              <button
                onClick={() => onDismiss(visitor)}
                className="btn btn-secondary"
                title="Dismiss alert"
              >
                <X size={16} /> Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
