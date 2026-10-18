// Live Visitor Page - Dedicated monitor for current visitor event
import React from "react";
import { 
  ShieldCheck, 
  Radio, 
  Calendar, 
  Clock, 
  Database, 
  CheckCircle2, 
  Camera, 
  Eye, 
  Check, 
  X, 
  Sparkles,
  Wifi,
  Cpu
} from "lucide-react";

export default function LiveVisitor({
  latestVisitor,
  systemStatus = "idle",
  isSimulating = false,
  onTriggerSimulation,
  onViewImage,
  onSaveRecord,
  onDismissRecord
}) {
  const isVisitorDetected = Boolean(latestVisitor && latestVisitor.status !== "Dismissed");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }} className="animate-fade-in">
      
      {/* Header Bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "14px"
      }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", margin: 0, fontWeight: 800 }}>
            Live Visitor Stream & Detection
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
            Real-time optical monitoring from contactless doorbell gateway
          </p>
        </div>

        {/* Trigger Simulation Button */}
        <button
          onClick={onTriggerSimulation}
          disabled={isSimulating}
          className="btn btn-simulate"
          style={{ padding: "10px 20px" }}
        >
          <Sparkles size={16} />
          {isSimulating ? "Simulating Trigger..." : "Simulate Visitor Detection"}
        </button>
      </div>

      {/* Dual Status Bar */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "16px"
      }}>
        {/* Status 1: System Status */}
        <div className="glass-card" style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              System Status
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
              <span className="status-dot status-dot-green" />
              <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)" }}>
                🟢 Monitoring Active
              </span>
            </div>
          </div>
          <ShieldCheck size={28} color="var(--accent-emerald)" />
        </div>

        {/* Status 2: Visitor Detection */}
        <div className="glass-card" style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Visitor Detection
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
              {isVisitorDetected ? (
                <>
                  <span className="status-dot status-dot-green" />
                  <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--accent-emerald)" }}>
                    🟢 Visitor Detected
                  </span>
                </>
              ) : (
                <>
                  <span className="status-dot status-dot-cyan" />
                  <span style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-muted)" }}>
                    ⚪ Perimeter Clear
                  </span>
                </>
              )}
            </div>
          </div>
          <Radio size={28} color={isVisitorDetected ? "var(--accent-emerald)" : "var(--accent-cyan)"} />
        </div>
      </div>

      {/* Main Live Display Card */}
      {latestVisitor ? (
        <div className="glass-card" style={{ overflow: "hidden" }}>
          <div style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(255, 255, 255, 0.02)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span className="badge badge-active">Live Capture</span>
              <span style={{ fontWeight: 700, color: "var(--accent-cyan)", fontSize: "0.95rem" }}>
                {latestVisitor.visitorId}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.8rem", color: "var(--text-dim)" }}>
              <span>OV2640 Lens</span>
              <span>•</span>
              <span>1600x1200 UXGA</span>
            </div>
          </div>

          <div style={{
            padding: "24px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "28px"
          }}>
            {/* Large Visitor Image Viewfinder */}
            <div className="camera-viewfinder" style={{ height: "360px", position: "relative" }}>
              <div className="camera-corner corner-tl" />
              <div className="camera-corner corner-tr" />
              <div className="camera-corner corner-bl" />
              <div className="camera-corner corner-br" />

              <div className="camera-hud">
                <div>
                  <span className="rec-dot" />
                  <span>DOORSTEP CAMERA • LIVE</span>
                </div>
                <div>ISO 200 • 30 FPS</div>
              </div>

              <img
                src={latestVisitor.imageUrl}
                alt="Captured Visitor"
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
                background: "rgba(0,0,0,0.8)",
                padding: "6px 12px",
                borderRadius: "var(--radius-sm)",
                fontFamily: "monospace",
                fontSize: "0.78rem",
                color: "#38bdf8",
                zIndex: 4
              }}>
                DETECTED: {latestVisitor.date} • {latestVisitor.time}
              </div>
            </div>

            {/* Details Panel */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "20px" }}>
              <div>
                <span className="badge badge-cyan" style={{ marginBottom: "8px" }}>
                  {latestVisitor.visitorType || "Visitor Detection"}
                </span>
                <h3 style={{ fontSize: "1.35rem", fontWeight: 700, margin: "6px 0", color: "var(--text-main)" }}>
                  Contactless IR Visitor Event
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                  {latestVisitor.notes || "The infrared optical sensor detected an approaching person without physical touch. ESP32-CAM frame buffer was transmitted and saved."}
                </p>
              </div>

              {/* Key Details Grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "16px"
              }}>
                <div>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-dim)", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Clock size={12} /> Detection Time
                  </span>
                  <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--accent-cyan)" }}>
                    {latestVisitor.time}
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-dim)", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Calendar size={12} /> Date
                  </span>
                  <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-main)" }}>
                    {latestVisitor.date}
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>
                    Visitor ID
                  </span>
                  <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-main)" }}>
                    {latestVisitor.visitorId}
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>
                    Image Status
                  </span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--accent-emerald)" }}>
                    Captured & Validated
                  </span>
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>
                    Storage Status
                  </span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)", display: "flex", alignItems: "center", gap: "6px" }}>
                    <CheckCircle2 size={14} color="var(--accent-emerald)" />
                    {latestVisitor.storageStatus}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <button
                  onClick={() => onViewImage(latestVisitor)}
                  className="btn btn-primary"
                  style={{ flex: 1, minWidth: "130px" }}
                >
                  <Eye size={16} /> View Image
                </button>

                <button
                  onClick={() => onSaveRecord(latestVisitor)}
                  className="btn btn-secondary"
                  style={{ flex: 1, minWidth: "130px" }}
                >
                  <Check size={16} /> Save Record
                </button>

                <button
                  onClick={() => onDismissRecord(latestVisitor)}
                  className="btn btn-secondary"
                  style={{ color: "#f87171" }}
                >
                  <X size={16} /> Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: "60px 24px", textAlign: "center" }}>
          <div style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "rgba(6, 182, 212, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            color: "var(--accent-cyan)"
          }}>
            <Camera size={30} />
          </div>
          <h3 style={{ fontSize: "1.25rem", marginBottom: "8px" }}>No Active Visitor Detected</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", maxWidth: "440px", margin: "0 auto 24px" }}>
            The doorstep IR optical sensor is currently scanning. Click below to simulate a visitor approaching.
          </p>
          <button
            onClick={onTriggerSimulation}
            disabled={isSimulating}
            className="btn btn-simulate"
          >
            <Sparkles size={16} /> Simulate Visitor
          </button>
        </div>
      )}
    </div>
  );
}
