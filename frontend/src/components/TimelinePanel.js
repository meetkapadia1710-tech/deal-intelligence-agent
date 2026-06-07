import React, { useState, useEffect } from "react";
import { apiGet } from "../api/apiClient";
import { parseMemoryEntry } from "../utils/utils";

export default function TimelinePanel({ dealId, dealName }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiGet(`/timeline/${dealId}`)
      .then((r) => setEntries(r.entries || []))
      .finally(() => setLoading(false));
  }, [dealId]);

  if (loading) {
    return (
      <div className="timeline-status">
        <span className="spinner" /> Loading deal diary…
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="timeline-status">
        <div className="empty-timeline-icon">📝</div>
        No interactions stored yet. Log some and they'll appear here.
      </div>
    );
  }

  return (
    <div className="timeline-panel">
      <div className="timeline-header">
        <div>
          <p className="timeline-title">Deal Diary</p>
          <p className="timeline-subtitle">Every interaction stored in memory for {dealName}</p>
        </div>
        <span className="timeline-count">{entries.length} memories</span>
      </div>

      <div className="timeline-list">
        {entries.map((entry, i) => {
          const { stakeholder, cleaned, date, type, entities } = parseMemoryEntry(entry);
          return (
            <div key={entry.id || i} className="timeline-item">
              <div className="timeline-spine">
                <div className="timeline-dot" />
                {i < entries.length - 1 && <div className="timeline-line" />}
              </div>
              <div className="timeline-content">
                <div className="timeline-top">
                  {stakeholder && (
                    <span className="timeline-stakeholder">{stakeholder}</span>
                  )}
                  <div className="timeline-tags">
                    <span className={`timeline-type type-${type}`}>{type}</span>
                    {date && <span className="timeline-date">{date}</span>}
                  </div>
                </div>
                <pre className="timeline-text">{cleaned}</pre>
                {entities.length > 0 && (
                  <div className="timeline-entities">
                    {entities.map((e) => (
                      <span key={e} className="entity-tag">{e}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
