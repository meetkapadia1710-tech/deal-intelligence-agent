import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, Plus, Hexagon, Cpu } from "lucide-react";
import { Ripple } from "./ui/Ripple";

export default function Sidebar({ deals, activeDeal, onSelectDeal, onNewDeal }) {
  return (
    <motion.aside 
      className="sidebar"
      initial={{ width: 72 }}
      animate={{ width: 280 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon-container">
            <Hexagon size={18} color="#fff" />
          </div>
          <motion.div 
            className="logo-text-group"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span className="logo-text">Deal Intel</span>
            <span className="logo-sub">AI Sales Memory</span>
          </motion.div>
        </div>
      </div>

      <div className="sidebar-section">
        <motion.p 
          className="sidebar-label"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          Active Deals
        </motion.p>

        {deals.length === 0 && (
          <p className="sidebar-empty">No deals yet — seed demo data to start</p>
        )}

        <div className="deal-list">
          <AnimatePresence>
            {deals.map((d, i) => {
              const isActive = activeDeal?.dealId === d.dealId;
              return (
                <motion.div
                  key={d.dealId}
                  className="deal-btn-wrapper pressable"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-deal-pill"
                      className="deal-active-pill"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <button
                    className={`deal-btn ${isActive ? "active" : ""}`}
                    onClick={() => onSelectDeal(d)}
                  >
                    <Folder size={18} className="deal-btn-icon" />
                    <motion.span 
                      className="deal-btn-name"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.25 }}
                    >
                      {d.dealName}
                    </motion.span>
                    <Ripple />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <motion.div
          className="deal-btn-wrapper pressable"
          style={{ marginTop: 8 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button className="deal-btn" onClick={onNewDeal} style={{ border: '1px dashed var(--border)' }}>
            <Plus size={18} className="deal-btn-icon" />
            <span className="deal-btn-name">New Deal</span>
            <Ripple />
          </button>
        </motion.div>
      </div>

      <motion.div 
        className="sidebar-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="powered-badge" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 999, border: '1px solid var(--border)' }}>
          <Cpu size={12} color="var(--accent-color)" />
          <p className="powered" style={{ fontSize: 11, color: 'var(--text-muted)' }}>Powered by Hindsight</p>
        </div>
      </motion.div>
    </motion.aside>
  );
}
