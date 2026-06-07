import React, { useState } from "react";
import { apiPost } from "../api/apiClient";

export default function LogModal({ dealId, dealName, onClose, onLogged }) {
  const [note, setNote] = useState("");
  const [stakeholder, setStakeholder] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit() {
    if (!note.trim()) return;
    setLoading(true);
    const res = await apiPost("/interactions", { dealId, dealName, note, stakeholder });
    setLoading(false);
    if (res.success) {
      setDone(true);
      setTimeout(() => { onLogged(); onClose(); }, 900);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-icon-container">
            <span className="modal-icon">+</span>
          </div>
          <div>
            <h2 className="modal-title">Log Interaction</h2>
            <p className="modal-sub">{dealName}</p>
          </div>
        </div>
        
        <div className="field-group">
          <label className="field-label">Stakeholder (optional)</label>
          <input
            className="field-input"
            placeholder="e.g. Priya Sharma (CFO)"
            value={stakeholder}
            onChange={(e) => setStakeholder(e.target.value)}
          />
        </div>
        
        <div className="field-group">
          <label className="field-label">Interaction Note</label>
          <textarea
            className="field-textarea"
            placeholder="e.g. Call with Priya. She raised concerns about implementation timeline and asked for a 20% discount..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={5}
          />
        </div>
        
        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className={`btn-primary ${done ? "btn-success" : ""}`}
            onClick={handleSubmit}
            disabled={loading || done || !note.trim()}
          >
            {done ? "✓ Stored in memory" : loading ? "Storing…" : "Store in Memory"}
          </button>
        </div>
      </div>
    </div>
  );
}
