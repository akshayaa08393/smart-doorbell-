// Visitor History Page for SmartGuard
import React, { useState, useMemo } from "react";
import { 
  History, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Grid, 
  List, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Eye, 
  Trash2, 
  Download,
  Camera
} from "lucide-react";
import VisitorTable from "../components/VisitorTable";

export default function VisitorHistory({
  visitors = [],
  onViewDetails,
  onDeleteRecord
}) {
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  // Filter & sort
  const filteredVisitors = useMemo(() => {
    let result = [...visitors];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (v) =>
          v.visitorId.toLowerCase().includes(term) ||
          (v.visitorType && v.visitorType.toLowerCase().includes(term)) ||
          v.date.toLowerCase().includes(term) ||
          (v.notes && v.notes.toLowerCase().includes(term))
      );
    }

    if (dateFilter === "today") {
      result = result.filter((v) => {
        const d = new Date(v.detectedAt);
        const today = new Date();
        return (
          d.getDate() === today.getDate() &&
          d.getMonth() === today.getMonth() &&
          d.getFullYear() === today.getFullYear()
        );
      });
    } else if (dateFilter === "yesterday") {
      result = result.filter((v) => {
        const d = new Date(v.detectedAt);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return (
          d.getDate() === yesterday.getDate() &&
          d.getMonth() === yesterday.getMonth() &&
          d.getFullYear() === yesterday.getFullYear()
        );
      });
    }

    if (sortOrder === "oldest") {
      result.sort((a, b) => new Date(a.detectedAt) - new Date(b.detectedAt));
    } else {
      result.sort((a, b) => new Date(b.detectedAt) - new Date(a.detectedAt));
    }

    return result;
  }, [visitors, searchTerm, dateFilter, sortOrder]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }} className="animate-fade-in">
      
      {/* Header & Controls */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", margin: 0, fontWeight: 800 }}>
            Visitor History Records
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
            Archived logs of all contactless doorbell events and captured frames ({visitors.length} total)
          </p>
        </div>

        {/* View Toggle */}
        <div style={{
          display: "flex",
          alignItems: "center",
          background: "rgba(255, 255, 255, 0.04)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-md)",
          padding: "3px"
        }}>
          <button
            onClick={() => setViewMode("grid")}
            style={{
              padding: "6px 12px",
              borderRadius: "var(--radius-sm)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.8rem",
              fontWeight: 600,
              background: viewMode === "grid" ? "var(--accent-cyan)" : "transparent",
              color: viewMode === "grid" ? "#ffffff" : "var(--text-muted)"
            }}
          >
            <Grid size={15} /> Card Grid
          </button>
          <button
            onClick={() => setViewMode("table")}
            style={{
              padding: "6px 12px",
              borderRadius: "var(--radius-sm)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.8rem",
              fontWeight: 600,
              background: viewMode === "table" ? "var(--accent-cyan)" : "transparent",
              color: viewMode === "table" ? "#ffffff" : "var(--text-muted)"
            }}
          >
            <List size={15} /> Table View
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-card" style={{
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "14px"
      }}>
        {/* Search Input */}
        <div style={{ position: "relative", flex: "1 1 240px", maxWidth: "380px" }}>
          <Search 
            size={16} 
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-dim)"
            }} 
          />
          <input
            type="text"
            placeholder="Search visitor records by ID, type, date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: "36px", width: "100%", fontSize: "0.85rem" }}
          />
        </div>

        {/* Filter Dropdowns */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Filter size={14} color="var(--text-dim)" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="form-input"
              style={{ padding: "8px 12px", fontSize: "0.85rem", cursor: "pointer" }}
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <ArrowUpDown size={14} color="var(--text-dim)" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="form-input"
              style={{ padding: "8px 12px", fontSize: "0.85rem", cursor: "pointer" }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main View: Grid or Table */}
      {viewMode === "table" ? (
        <VisitorTable
          visitors={filteredVisitors}
          onViewDetails={onViewDetails}
          onDeleteRecord={onDeleteRecord}
          isCompact={false}
        />
      ) : (
        <>
          {filteredVisitors.length === 0 ? (
            <div className="glass-card" style={{ padding: "60px 24px", textAlign: "center" }}>
              <div style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.04)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px",
                color: "var(--text-dim)"
              }}>
                <Camera size={26} />
              </div>
              <h4 style={{ fontSize: "1.1rem", marginBottom: "4px" }}>No Visitors Match Your Filter</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-dim)" }}>
                Try clearing your search keyword or switching back to "All Dates".
              </p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "20px"
            }}>
              {filteredVisitors.map((visitor) => (
                <div
                  key={visitor.id}
                  className="glass-card"
                  style={{
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s, box-shadow 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "var(--shadow-md)";
                  }}
                >
                  {/* Photo Container with overlay */}
                  <div 
                    onClick={() => onViewDetails(visitor)}
                    className="camera-viewfinder" 
                    style={{ height: "185px", cursor: "pointer", position: "relative" }}
                  >
                    <div className="camera-corner corner-tl" />
                    <div className="camera-corner corner-tr" />
                    <div className="camera-corner corner-bl" />
                    <div className="camera-corner corner-br" />

                    <img
                      src={visitor.imageUrl}
                      alt={visitor.visitorId}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />

                    <div style={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      background: "rgba(0, 0, 0, 0.75)",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      color: "var(--accent-cyan)",
                      zIndex: 3
                    }}>
                      {visitor.visitorId}
                    </div>

                    <div style={{
                      position: "absolute",
                      bottom: "10px",
                      left: "10px",
                      background: "rgba(0, 0, 0, 0.75)",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      fontSize: "0.72rem",
                      fontFamily: "monospace",
                      color: "#ffffff",
                      zIndex: 3
                    }}>
                      {visitor.time}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-main)" }}>
                          {visitor.visitorType || "Visitor Detection"}
                        </span>
                        <span className="badge badge-active" style={{ fontSize: "0.68rem" }}>
                          {visitor.status || "Detected"}
                        </span>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "8px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <Calendar size={13} color="var(--accent-cyan)" />
                          <span>{visitor.date}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <Clock size={13} color="var(--accent-cyan)" />
                          <span>{visitor.time}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <CheckCircle2 size={13} color="var(--accent-emerald)" />
                          <span>Status: Stored ({visitor.storageStatus})</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action buttons */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "16px",
                      paddingTop: "12px",
                      borderTop: "1px solid rgba(255, 255, 255, 0.05)"
                    }}>
                      <button
                        onClick={() => onViewDetails(visitor)}
                        className="btn btn-secondary"
                        style={{ fontSize: "0.78rem", padding: "6px 12px" }}
                      >
                        <Eye size={14} /> View Details
                      </button>

                      {onDeleteRecord && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete record for ${visitor.visitorId}?`)) {
                              onDeleteRecord(visitor.id);
                            }
                          }}
                          className="btn btn-secondary"
                          style={{ color: "var(--text-dim)", padding: "6px 8px" }}
                          title="Delete Record"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
