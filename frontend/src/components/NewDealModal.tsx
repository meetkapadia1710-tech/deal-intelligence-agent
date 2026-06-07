import React, { useState } from "react";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import { dialogVariants, backdropVariants } from "constants/motion";
import { Ripple } from "components/ui/Ripple";

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
            <Rocket size={24} color="var(--accent-color)" />
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
            onChange={(e: any) => setDealName(e.target.value)}
            autoFocus
          />
        </div>
        
        <div className="field-group">
          <label className="field-label">Deal ID (optional)</label>
          <input
            className="field-input"
            placeholder="Auto-generated if blank"
            value={dealId}
            onChange={(e: any) => setDealId(e.target.value)}
          />
        </div>
        
        <div className="modal-actions" style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 12 }}>
          <button className="btn-ghost pressable" onClick={onClose}>
            Cancel
            <Ripple color="rgba(255,255,255,0.1)" />
          </button>
          <button className="btn-primary pressable" onClick={handleCreate} disabled={!dealName.trim()}>
            Create Deal
            <Ripple />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
