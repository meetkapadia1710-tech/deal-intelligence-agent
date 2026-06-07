import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Loader2 } from "lucide-react";
import { apiGet } from "../api/apiClient";
import { parseMemoryEntry } from "../utils/utils";
import { staggerContainer, staggerItem } from "../theme/motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16, color: 'var(--text-muted)' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
          <Loader2 size={32} />
        </motion.div>
        Reconstructing Deal Diary...
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16, color: 'var(--text-muted)' }}>
        <FileText size={48} opacity={0.5} />
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
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-color)', background: 'var(--accent-surface)', padding: '6px 12px', borderRadius: 999 }}>
          {entries.length} memories
        </span>
      </div>

      <motion.div 
        className="timeline-list"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        style={{ position: 'relative' }}
      >
        {/* Animated SVG Spine */}
        <svg className="timeline-svg" preserveAspectRatio="none" viewBox="0 0 2 100" style={{ height: 'calc(100% - 40px)' }}>
          <defs>
            <linearGradient id="timeline-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent-color)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <motion.path 
            d="M 1 0 L 1 100" 
            vectorEffect="non-scaling-stroke" 
            stroke="url(#timeline-grad)" 
            strokeWidth="2" 
            initial={{ pathLength: 0 }} 
            animate={{ pathLength: 1 }} 
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }} 
          />
        </svg>

        {entries.map((entry, i) => {
          const { stakeholder, cleaned, date, type, entities } = parseMemoryEntry(entry);
          return (
            <motion.div 
              key={entry.id || i} 
              className="timeline-item"
              variants={staggerItem}
            >
              <div className="timeline-spine">
                <div className="timeline-node" />
              </div>
              <div className="timeline-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  {stakeholder && (
                    <span style={{ fontSize: 15, fontWeight: 600 }}>{stakeholder}</span>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, padding: '4px 10px', borderRadius: 999, background: type === 'observation' ? 'rgba(59, 130, 246, 0.15)' : 'var(--accent-surface)', color: type === 'observation' ? '#60a5fa' : 'var(--accent-hover)' }}>
                      {type}
                    </span>
                    {date && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{date}</span>}
                  </div>
                </div>
                <div className="markdown-body" style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{cleaned}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
