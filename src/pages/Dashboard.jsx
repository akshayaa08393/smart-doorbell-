// Dashboard Page for SmartGuard
import React from "react";
import { 
  ShieldCheck, 
  Users, 
  CalendarDays, 
  Bell, 
  Sparkles, 
  ArrowRight, 
  Radio, 
  Camera, 
  Wifi, 
  Eye,
  Activity
} from "lucide-react";
import StatusCard from "../components/StatusCard";
import VisitorCard from "../components/VisitorCard";
import VisitorTable from "../components/VisitorTable";
import WorkflowTimeline from "../components/WorkflowTimeline";

export default function Dashboard({
  visitors = [],
  stats,
  systemStatus = "idle",
  activeWorkflowStep = null,
  isSimulating = false,
  onTriggerSimulation,
  onViewVisitorDetails,
  onSaveLatest,
  onDismissLatest,
  onNavigateTab
}) {
  const latestVisitor = visitors.length > 0 ? visitors[0] : null;

  // Format system status label and visual theme
  const getStatusDisplay = () => {
    switch (systemStatus) {
      case "detecting":
        return {
          label: "Detecting Visitor...",
          sub: "IR optical beam triggered",
          accent: "amber",
          pulse: true,
          badge: "IR Triggered"
        };
      case "capturing":
        return {
          label: "Capturing Image...",
          sub: "ESP32-CAM OV2640 active",
          accent: "cyan",
          pulse: true,
          badge: "Camera Active"
        };
      case "uploading":
        return {
          label: "Uploading...",
          sub: "Wi-Fi transmitting to Cloud",
          accent: "cyan",
          pulse: true,
          badge: "Syncing"
        };
      case "recorded":
        return {
          label: "Visitor Recorded",
          sub: "Indexed in Cloud & Notified",
          accent: "emerald",
          pulse: true,
          badge: "Success"
        };
      default:
        return {
          label: "Monitoring Active",
          sub: "Doorway perimeter secure",
          accent: "emerald",
          pulse: true,
          badge: "Online"
        };
    }
  };

  const statusInfo = getStatusDisplay();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }} className="animate-fade-in">
      {/* Top Banner with Quick Simulation Action */}
      <div style={{
        background: "linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(59, 130, 246, 0.08) 100%)",
        border: "1px solid rgba(6, 182, 212, 0.3)",
        borderRadius: "var(--radius-lg)",
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "14px",
            background: "rgba(6, 182, 212, 0.2)",
            border: "1px solid var(--accent-cyan)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent-cyan)",
            boxShadow: "0 0 20px rgba(6, 182, 212, 0.3)"
          }}>
            <Activity size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.25rem", margin: 0, fontWeight: 700, color: "var(--text-main)" }}>
              Contactless Doorbell Monitoring System
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
              IR sensor armed • ESP32-CAM ready • Remote Wi-Fi Gateway linked
            </p>
          </div>
        </div>

        {/* Big Simulate Visitor Button */}
        <button
          onClick={onTriggerSimulation}
          disabled={isSimulating}
          className="btn btn-simulate"
          style={{ padding: "12px 24px", fontSize: "0.95rem" }}
          id="btn-simulate-visitor"
        >
          <Sparkles size={18} />
          {isSimulating ? "Simulating Workflow..." : "Simulate Visitor"}
        </button>
      </div>

      {/* KPI 4 Cards Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "16px"
      }}>
        {/* Card 1: System Status */}
        <StatusCard
          title="System Status"
          value={statusInfo.label}
          subtitle={statusInfo.sub}
          icon={ShieldCheck}
          accent={statusInfo.accent}
          badgeText={statusInfo.badge}
          pulse={statusInfo.pulse}
        />

        {/* Card 2: Total Visitors */}
        <StatusCard
          title="Total Visitors"
          value={stats?.total || 0}
          subtitle="All recorded events"
          icon={Users}
          accent="cyan"
          badgeText="Verified"
          onClick={() => onNavigateTab && onNavigateTab("history")}
        />

        {/* Card 3: Today's Visitors */}
        <StatusCard
          title="Today's Visitors"
          value={stats?.today || 0}
          subtitle="Detections past 24 hrs"
          icon={CalendarDays}
          accent="cyan"
          badgeText="Today"
        />

        {/* Card 4: Notifications */}
        <StatusCard
          title="Notifications"
          value={stats?.unreadAlerts || 0}
          subtitle="Unread security alerts"
          icon={Bell}
          accent={stats?.unreadAlerts > 0 ? "red" : "cyan"}
          badgeText={stats?.unreadAlerts > 0 ? "Action Needed" : "All Caught Up"}
          onClick={() => onNavigateTab && onNavigateTab("notifications")}
        />
      </div>

      {/* Workflow Visual Timeline */}
      <WorkflowTimeline 
        currentStep={activeWorkflowStep} 
        isSimulating={isSimulating} 
      />

      {/* Main Section: Latest Visitor Featured Card */}
      <div>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px"
        }}>
          <h3 style={{ fontSize: "1.15rem", margin: 0, fontWeight: 700 }}>
            Live Feed & Current Event
          </h3>
          {latestVisitor && (
            <button
              onClick={() => onNavigateTab && onNavigateTab("live")}
              style={{
                fontSize: "0.85rem",
                color: "var(--accent-cyan)",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontWeight: 600
              }}
            >
              Open Live Monitor <ArrowRight size={14} />
            </button>
          )}
        </div>

        <VisitorCard
          visitor={latestVisitor}
          onViewDetails={onViewVisitorDetails}
          onSave={onSaveLatest}
          onDismiss={onDismissLatest}
          onSimulate={onTriggerSimulation}
          isSimulating={isSimulating}
        />
      </div>

      {/* Recent Visitors Table / Summary */}
      <div>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px"
        }}>
          <div>
            <h3 style={{ fontSize: "1.15rem", margin: 0, fontWeight: 700 }}>
              Recent Visitor Activity
            </h3>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
              Latest 5 visitor events recorded by contactless sensor
            </span>
          </div>

          <button
            onClick={() => onNavigateTab && onNavigateTab("history")}
            style={{
              fontSize: "0.85rem",
              color: "var(--accent-cyan)",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontWeight: 600
            }}
          >
            View Complete History ({visitors.length}) <ArrowRight size={14} />
          </button>
        </div>

        <VisitorTable
          visitors={visitors}
          onViewDetails={onViewVisitorDetails}
          isCompact={true}
        />
      </div>
    </div>
  );
}
