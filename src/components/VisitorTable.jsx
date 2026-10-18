// Visitor Table & Gallery List for Dashboard and Visitor History
import React, { useState, useMemo } from "react";
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Eye, 
  Trash2, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Camera,
  ExternalLink
} from "lucide-react";

export default function VisitorTable({ 
  visitors = [], 
  onViewDetails, 
  onDeleteRecord,
  isCompact = false 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all"); // 'all' | 'today' | 'yesterday'
  const [sortOrder, setSortOrder] = useState("newest"); // 'newest' | 'oldest'

  // Filter and sort visitors
  const filteredVisitors = useMemo(() => {
    let result = [...visitors];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (v) =>
          v.visitorId.toLowerCase().includes(term) ||
          (v.visitorType && v.visitorType.toLowerCase().includes(term)) ||
          (v.notes && v.notes.toLowerCase().includes(term)) ||
          v.date.toLowerCase().includes(term)
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

    if (isCompact) {
      return result.slice(0, 5);
    }

    return result;
  }, [visitors, searchTerm, dateFilter, sortOrder, isCompact]);

  return (
    <div className="glass-card" style={{ overflow: "hidden" }}>
      {/* Search & Filter Bar (Only if not compact or when requested) */}
      {!isCompact && (
        <div style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          background: "rgba(255, 255, 255, 0.02)"
        }}>
          {/* Search box */}
          <div style={{
            position: "relative",
            flex: "1 1 240px",
            maxWidth: "360px"
          }}>
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
              placeholder="Search by ID, type, date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{
                paddingLeft: "36px",
                paddingTop: "8px",
                paddingBottom: "8px",
                width: "100%",
                fontSize: "0.85rem"
              }}
            />
          </div>

          {/* Filter and Sort controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Filter size={14} color="var(--text-dim)" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="form-input"
                style={{ padding: "6px 12px", fontSize: "0.8rem", cursor: "pointer" }}
              >
                <option value="all">All Dates</option>
                <option value="today">Today Only</option>
                <option value="yesterday">Yesterday</option>
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <ArrowUpDown size={14} color="var(--text-dim)" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="form-input"
                style={{ padding: "6px 12px", fontSize: "0.8rem", cursor: "pointer" }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Visitor List or Table */}
      {filteredVisitors.length === 0 ? (
        <div style={{ padding: "48px 24px", textAlign: "center" }}>
          <div style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.04)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px",
            color: "var(--text-dim)"
          }}>
            <Camera size={24} />
          </div>
          <h4 style={{ fontSize: "1rem", color: "var(--text-main)", marginBottom: "4px" }}>
            No Visitor Records Found
          </h4>
          <p style={{ fontSize: "0.825rem", color: "var(--text-dim)" }}>
            {searchTerm || dateFilter !== "all" 
              ? "Try adjusting your search query or filter." 
              : "Visitors will appear here when the doorbell sensor triggers."}
          </p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
            fontSize: "0.875rem"
          }}>
            <thead>
              <tr style={{
                background: "rgba(255, 255, 255, 0.02)",
                borderBottom: "1px solid var(--border-subtle)",
                color: "var(--text-dim)",
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}>
                <th style={{ padding: "14px 18px" }}>Visitor</th>
                <th style={{ padding: "14px 18px" }}>Visitor ID</th>
                <th style={{ padding: "14px 18px" }}>Date & Time</th>
                <th style={{ padding: "14px 18px" }}>Detection</th>
                <th style={{ padding: "14px 18px" }}>Storage</th>
                <th style={{ padding: "14px 18px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVisitors.map((visitor) => (
                <tr 
                  key={visitor.id}
                  style={{
                    borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
                    transition: "background 0.15s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {/* Thumbnail & Label */}
                  <td style={{ padding: "12px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div 
                        onClick={() => onViewDetails && onViewDetails(visitor)}
                        style={{
                          width: "56px",
                          height: "44px",
                          borderRadius: "var(--radius-sm)",
                          overflow: "hidden",
                          border: "1px solid var(--border-subtle)",
                          cursor: "pointer",
                          position: "relative",
                          flexShrink: 0
                        }}
                      >
                        <img
                          src={visitor.imageUrl}
                          alt={visitor.visitorId}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <div>
                        <span style={{ fontWeight: 600, color: "var(--text-main)", display: "block" }}>
                          {visitor.visitorType || "Visitor"}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                          OV2640 • Contactless IR
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Visitor ID */}
                  <td style={{ padding: "12px 18px" }}>
                    <span className="badge badge-cyan" style={{ fontSize: "0.72rem" }}>
                      {visitor.visitorId}
                    </span>
                  </td>

                  {/* Date & Time */}
                  <td style={{ padding: "12px 18px" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ color: "var(--text-main)", fontWeight: 500, fontSize: "0.825rem" }}>
                        {visitor.date}
                      </span>
                      <span style={{ color: "var(--accent-cyan)", fontSize: "0.75rem" }}>
                        {visitor.time}
                      </span>
                    </div>
                  </td>

                  {/* Detection Status */}
                  <td style={{ padding: "12px 18px" }}>
                    <span className="badge badge-active" style={{ fontSize: "0.7rem" }}>
                      {visitor.status || "Detected"}
                    </span>
                  </td>

                  {/* Storage Status */}
                  <td style={{ padding: "12px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <CheckCircle2 size={14} color="var(--accent-emerald)" />
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        {visitor.storageStatus}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: "12px 18px", textAlign: "right" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                      <button
                        onClick={() => onViewDetails && onViewDetails(visitor)}
                        className="btn btn-secondary"
                        style={{ padding: "6px 10px", fontSize: "0.75rem" }}
                        title="View Full Details"
                      >
                        <Eye size={14} /> Details
                      </button>

                      {onDeleteRecord && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete record for ${visitor.visitorId}?`)) {
                              onDeleteRecord(visitor.id);
                            }
                          }}
                          className="btn btn-secondary"
                          style={{ padding: "6px 8px", color: "var(--text-dim)" }}
                          title="Delete Record"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
