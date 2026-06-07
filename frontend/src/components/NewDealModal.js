import React, { useState } from "react";

export default function NewDealModal({ onClose, onCreate }) {
  const [dealName, setDealName] = useState("");
  const [dealId, setDealId] = useState("");

  function handleCreate() {
    if (!dealName.trim()) return;
    const id =
      dealId.trim() ||
      dealName.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now().toString(36);
    onCreate({ dealId: id, dealName: dealName.trim() });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-icon-container">
            <span className="modal-icon">🚀</span>
          </div>
          <div>
            <h2 className="modal-title">New Deal</h2>
            <p className="modal-sub">Create a new workspace</p>
          </div>
        </div>
        
        <div className="field-group">
          <label className="field-label">Company / Deal Name</label>
          <input
            className="field-input"
            placeholder="e.g. Acme Corp"
            value={dealName}
            onChange={(e) => setDealName(e.target.value)}
            autoFocus
          />
        </div>
        
        <div className="field-group">
          <label className="field-label">Deal ID (optional)</label>
          <input
            className="field-input"
            placeholder="Auto-generated if blank"
            value={dealId}
            onChange={(e) => setDealId(e.target.value)}
          />
        </div>
        
        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleCreate} disabled={!dealName.trim()}>
            Create Deal
          </button>
        </div>
      </div>
    </div>
  );
}
