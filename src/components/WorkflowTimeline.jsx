// Visual Workflow Pipeline component
// Shows the step-by-step physical-to-cloud visitor workflow required for demonstration

import React from "react";
import { 
  Footprints, 
  Radio, 
  Camera, 
  CheckCircle2, 
  Wifi, 
  Database, 
  BellRing, 
  LayoutDashboard,
  ArrowRight
} from "lucide-react";

export const WORKFLOW_STEPS = [
  { id: "approach", label: "Visitor Approaching", icon: Footprints, desc: "Subject in range" },
  { id: "ir_sensor", label: "IR Sensor Detection", icon: Radio, desc: "GPIO 13 Trigger" },
  { id: "esp32_cam", label: "ESP32-CAM Wake", icon: Camera, desc: "OV2640 Capture" },
  { id: "validation", label: "Payload Validation", icon: CheckCircle2, desc: "Integrity check" },
  { id: "wifi", label: "Wi-Fi Transmission", icon: Wifi, desc: "HTTP / REST Post" },
  { id: "firebase", label: "Firebase Cloud", icon: Database, desc: "Firestore & Storage" },
  { id: "notification", label: "Push Notification", icon: BellRing, desc: "Homeowner Chime" },
  { id: "dashboard", label: "Live Dashboard", icon: LayoutDashboard, desc: "Record Visualized" }
];

export default function WorkflowTimeline({ currentStep = null, isSimulating = false }) {
  const getStepStatus = (index) => {
    if (!isSimulating && currentStep === null) return "idle";
    if (currentStep === null) return "idle";
    if (index < currentStep) return "completed";
    if (index === currentStep) return "active";
    return "pending";
  };

  return (
    <div style={{
      background: "rgba(10, 16, 28, 0.8)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-lg)",
      padding: "20px",
      position: "relative",
      overflow: "hidden"
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "16px",
        flexWrap: "wrap",
        gap: "10px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: isSimulating ? "var(--accent-amber)" : "var(--accent-cyan)",
            boxShadow: isSimulating ? "0 0 10px var(--accent-amber)" : "0 0 10px var(--accent-cyan)"
          }} />
          <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-main)", margin: 0 }}>
            System Workflow Architecture
          </h4>
        </div>
        <span style={{
          fontSize: "0.75rem",
          color: "var(--text-muted)",
          background: "rgba(255, 255, 255, 0.05)",
          padding: "4px 10px",
          borderRadius: "var(--radius-full)",
          border: "1px solid var(--border-subtle)"
        }}>
          {isSimulating ? "⚡ Pipeline Live Executing..." : "Idle / Ready for Trigger"}
        </span>
      </div>

      {/* Steps visual node strip */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
        gap: "10px",
        position: "relative"
      }}>
        {WORKFLOW_STEPS.map((step, idx) => {
          const Icon = step.icon;
          const status = getStepStatus(idx);

          let nodeBg = "rgba(255, 255, 255, 0.03)";
          let borderColor = "var(--border-subtle)";
          let iconColor = "var(--text-dim)";
          let pulseClass = "";

          if (status === "completed") {
            nodeBg = "rgba(16, 185, 129, 0.12)";
            borderColor = "rgba(16, 185, 129, 0.4)";
            iconColor = "var(--accent-emerald)";
          } else if (status === "active") {
            nodeBg = "rgba(6, 182, 212, 0.2)";
            borderColor = "var(--accent-cyan)";
            iconColor = "var(--accent-cyan)";
            pulseClass = "active-node-glow";
          }

          return (
            <div
              key={step.id}
              style={{
                background: nodeBg,
                border: `1px solid ${borderColor}`,
                borderRadius: "var(--radius-md)",
                padding: "12px 10px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transition: "all 0.3s ease",
                position: "relative",
                boxShadow: status === "active" ? "0 0 15px rgba(6, 182, 212, 0.4)" : "none",
                transform: status === "active" ? "scale(1.04)" : "scale(1)"
              }}
            >
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: status === "active" ? "rgba(6, 182, 212, 0.25)" : "rgba(255, 255, 255, 0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "8px",
                color: iconColor
              }}>
                <Icon size={18} />
              </div>
              <span style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: status === "active" ? "#ffffff" : status === "completed" ? "#34d399" : "var(--text-muted)",
                marginBottom: "2px",
                lineHeight: 1.2
              }}>
                {step.label}
              </span>
              <span style={{
                fontSize: "0.68rem",
                color: "var(--text-dim)",
                lineHeight: 1.2
              }}>
                {step.desc}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
