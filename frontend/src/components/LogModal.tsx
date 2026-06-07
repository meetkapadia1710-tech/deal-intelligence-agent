import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { apiPost } from "services/apiClient";
import { dialogVariants, backdropVariants } from "constants/motion";
import { Ripple } from "components/ui/Ripple";

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
    <motion.div 
      className="modal-overlay" 
      onClick={onClose}
      variants={backdropVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div 
        className="modal" 
        onClick={(e: any) => e.stopPropagation()}
        variants={dialogVariants}
      >
        <div className="modal-header" style={{ marginBottom: 8 }}>
          <div className="modal-icon-container">
            <Plus size={24} color="var(--accent-color)" />
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
            onChange={(e: any) => setStakeholder(e.target.value)}
          />
        </div>
        
        <div className="field-group">
          <label className="field-label">Interaction Note</label>
          <textarea
            className="field-textarea"
            placeholder="e.g. Call with Priya. She raised concerns about implementation timeline and asked for a 20% discount..."
            value={note}
            onChange={(e: any) => setNote(e.target.value)}
            rows={5}
          />
        </div>
        
        <div className="modal-actions" style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 12 }}>
          <button className="btn-ghost pressable" onClick={onClose}>
            Cancel
            <Ripple color="rgba(255,255,255,0.1)" />
          </button>
          <button
            className={`btn-primary pressable ${done ? "btn-success" : ""}`}
            onClick={handleSubmit}
            disabled={loading || done || !note.trim()}
          >
            {done ? "✓ Stored in memory" : loading ? "Storing…" : "Store in Memory"}
            <Ripple />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
