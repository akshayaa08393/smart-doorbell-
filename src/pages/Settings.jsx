// Settings Page for SmartGuard Doorbell
import React, { useState } from "react";
import { 
  User, 
  Cpu, 
  Database, 
  Bell, 
  Volume2, 
  ShieldCheck, 
  LogOut, 
  RotateCcw, 
  Save, 
  Wifi, 
  Camera,
  CheckCircle2,
  AlertTriangle,
  Info
} from "lucide-react";
import { esp32Service } from "../services/esp32Service";
import { getFirebaseStatus } from "../services/firebase";

export default function Settings({
  user,
  onUpdateUser,
  hardwareMode = "simulation",
  onChangeHardwareMode,
  soundEnabled = true,
  onToggleSound,
  onResetData,
  onLogout
}) {
  const [displayName, setDisplayName] = useState(user?.displayName || "Akshaya");
  const [email, setEmail] = useState(user?.email || "homeowner@smartguard.com");
  const [homeAddress, setHomeAddress] = useState(user?.homeAddress || "Residence 402, North Haven");
  const [deviceIp, setDeviceIp] = useState(esp32Service.getDeviceEndpoint());
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fbStatus = getFirebaseStatus();
  const telemetry = esp32Service.getHardwareTelemetry();

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (onUpdateUser) {
      onUpdateUser({ displayName, email, homeAddress });
    }
    esp32Service.setDeviceEndpoint(deviceIp);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }} className="animate-fade-in">
      
      {/* Header */}
      <div>
        <h2 style={{ fontSize: "1.5rem", margin: 0, fontWeight: 800 }}>
          System Configuration & Settings
        </h2>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
          Configure homeowner profile, hardware gateway modes, and cloud telemetry
        </p>
      </div>

      {saveSuccess && (
        <div style={{
          background: "rgba(16, 185, 129, 0.1)",
          border: "1px solid rgba(16, 185, 129, 0.3)",
          color: "#34d399",
          borderRadius: "var(--radius-md)",
          padding: "12px 18px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontSize: "0.875rem"
        }}>
          <CheckCircle2 size={18} /> Settings saved successfully!
        </div>
      )}

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "24px"
      }}>
        {/* Section 1: Hardware Mode Configuration */}
        <div className="glass-card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Cpu size={20} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: "1.1rem", margin: 0 }}>Hardware Integration Mode</h3>
          </div>

          <p style={{ fontSize: "0.825rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.4 }}>
            Select how the system receives infrared sensor triggers and camera captures.
          </p>

          {/* Mode Selector Radio Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <label style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              padding: "14px",
              borderRadius: "var(--radius-md)",
              background: hardwareMode === "simulation" ? "rgba(6, 182, 212, 0.1)" : "rgba(255, 255, 255, 0.02)",
              border: `1px solid ${hardwareMode === "simulation" ? "var(--accent-cyan)" : "var(--border-subtle)"}`,
              cursor: "pointer",
              transition: "all 0.2s"
            }}>
              <input
                type="radio"
                name="hardware_mode"
                value="simulation"
                checked={hardwareMode === "simulation"}
                onChange={() => onChangeHardwareMode("simulation")}
                style={{ marginTop: "3px", accentColor: "var(--accent-cyan)" }}
              />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontWeight: 600, color: "var(--text-main)", fontSize: "0.9rem" }}>
                    Demo / Simulation Mode (Recommended)
                  </span>
                  <span className="badge badge-cyan" style={{ fontSize: "0.65rem" }}>
                    Current Default
                  </span>
                </div>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
                  Simulates IR sensor detection, ESP32-CAM optical capture, and Wi-Fi transmission without physical hardware.
                </p>
              </div>
            </label>

            <label style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              padding: "14px",
              borderRadius: "var(--radius-md)",
              background: hardwareMode === "real_hardware" ? "rgba(16, 185, 129, 0.1)" : "rgba(255, 255, 255, 0.02)",
              border: `1px solid ${hardwareMode === "real_hardware" ? "var(--accent-emerald)" : "var(--border-subtle)"}`,
              cursor: "pointer",
              transition: "all 0.2s"
            }}>
              <input
                type="radio"
                name="hardware_mode"
                value="real_hardware"
                checked={hardwareMode === "real_hardware"}
                onChange={() => onChangeHardwareMode("real_hardware")}
                style={{ marginTop: "3px", accentColor: "var(--accent-emerald)" }}
              />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontWeight: 600, color: "var(--text-main)", fontSize: "0.9rem" }}>
                    Physical ESP32-CAM Hardware Mode
                  </span>
                  <span className="badge badge-active" style={{ fontSize: "0.65rem" }}>
                    Hardware Ready
                  </span>
                </div>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
                  Polls the physical ESP32-CAM web server endpoint over local Wi-Fi for live sensor triggers and captures.
                </p>
              </div>
            </label>
          </div>

          {/* Physical Endpoint IP input */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">ESP32-CAM Local Web Server IP / URL</label>
            <input
              type="text"
              value={deviceIp}
              onChange={(e) => setDeviceIp(e.target.value)}
              className="form-input"
              placeholder="http://192.168.1.145"
            />
            <span style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginTop: "4px" }}>
              Arduino sketch HTTP GET handler: <code>/capture</code> and <code>/status</code>
            </span>
          </div>

          {/* Hardware Diagnostics Specs */}
          <div style={{
            background: "rgba(0, 0, 0, 0.25)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "12px",
            fontSize: "0.78rem",
            color: "var(--text-muted)",
            display: "flex",
            flexDirection: "column",
            gap: "4px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Module Model:</span>
              <span style={{ color: "var(--text-main)", fontWeight: 500 }}>{telemetry.deviceModel}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Camera Sensor:</span>
              <span style={{ color: "var(--text-main)", fontWeight: 500 }}>{telemetry.cameraSensor}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>IR Sensor Pin:</span>
              <span style={{ color: "var(--accent-cyan)", fontWeight: 500 }}>{telemetry.sensorPin}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Core Temp:</span>
              <span style={{ color: "var(--accent-emerald)", fontWeight: 500 }}>{telemetry.coreTemp}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Cloud / Firebase Connection Status */}
        <div className="glass-card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Database size={20} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: "1.1rem", margin: 0 }}>Firebase Cloud Status</h3>
          </div>

          {/* Firebase Status Badge */}
          <div style={{
            background: fbStatus.connected ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
            border: `1px solid ${fbStatus.connected ? "rgba(16, 185, 129, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
            borderRadius: "var(--radius-md)",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            gap: "14px"
          }}>
            <span className={`status-dot ${fbStatus.connected ? "status-dot-green" : "status-dot-amber"}`} style={{ width: "12px", height: "12px" }} />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-main)" }}>
                  Firebase: {fbStatus.connected ? "🟢 Connected" : "🟡 Demo Mode"}
                </span>
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
                {fbStatus.message}
              </p>
            </div>
          </div>

          {/* Audio Chime Notification Toggle */}
          <div style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Volume2 size={20} color={soundEnabled ? "var(--accent-emerald)" : "var(--text-dim)"} />
              <div>
                <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-main)", display: "block" }}>
                  Contactless Chime Sound
                </span>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  Synthesize real audio doorbell chime on visitor arrival
                </span>
              </div>
            </div>

            <button
              onClick={onToggleSound}
              className={`btn ${soundEnabled ? "btn-primary" : "btn-secondary"}`}
              style={{ padding: "6px 14px", fontSize: "0.8rem" }}
            >
              {soundEnabled ? "Sound ON" : "Muted"}
            </button>
          </div>

          {/* Reset Demo Data */}
          <div style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <div>
              <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-main)", display: "block" }}>
                Reset Demo Records
              </span>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                Restore initial sample visitor gallery and clean test data
              </span>
            </div>

            <button
              onClick={() => {
                if (window.confirm("Reset all visitor history back to initial demonstration state?")) {
                  onResetData();
                }
              }}
              className="btn btn-secondary"
              style={{ padding: "6px 14px", fontSize: "0.8rem" }}
            >
              <RotateCcw size={14} /> Reset Data
            </button>
          </div>
        </div>

        {/* Section 3: Profile Settings Form */}
        <div className="glass-card" style={{ padding: "24px", gridColumn: "1 / -1" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <User size={20} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: "1.1rem", margin: 0 }}>Homeowner Profile Information</h3>
          </div>

          <form onSubmit={handleSaveProfile} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Notification Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Doorbell Location Address</label>
              <input
                type="text"
                value={homeAddress}
                onChange={(e) => setHomeAddress(e.target.value)}
                className="form-input"
              />
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", gap: "10px" }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: "10px 20px" }}
              >
                <Save size={16} /> Save Changes
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="btn btn-danger"
                style={{ padding: "10px 16px" }}
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
