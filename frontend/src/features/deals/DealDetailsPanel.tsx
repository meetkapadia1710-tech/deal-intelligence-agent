import React, { useState, useEffect } from "react";
import { Folder, Clock, User, ArrowLeft, Activity, Zap, RefreshCw } from "lucide-react";
import { apiGet } from "services/apiClient";
import AnalyticsPanel from "features/analytics/AnalyticsPanel";
import MemoryComparePanel from '../dashboard/components/MemoryComparePanel';
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, itemReveal, motionTokens } from "lib/motion";
import { MotionNumber } from "components/ui/MotionNumber";
import { Skeleton } from "components/ui/Skeleton";

type NextAction = {
  priority: number;
  category: string;
  title: string;
  reasoning: string;
  urgency: "High" | "Medium" | "Low";
  timeframe: string;
};

const categoryColors: Record<string, { bg: string; text: string }> = {
  "Objection Handling": { bg: "#fff1f2", text: "#be123c" },
  "Relationship Building": { bg: "#eff6ff", text: "#1d4ed8" },
  "Pricing": { bg: "#f0fdf4", text: "#166534" },
  "Technical": { bg: "#faf5ff", text: "#6b21a8" },
  "Legal": { bg: "#fffbeb", text: "#92400e" },
  "Follow-up": { bg: "#f8fafc", text: "#475569" },
};

const urgencyColor: Record<string, string> = { High: "#ef4444", Medium: "#f59e0b", Low: "#10b981" };

export default function DealDetailsPanel({ deal, onBack }: any) {
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextActions, setNextActions] = useState<NextAction[]>([]);
  const [actionsLoading, setActionsLoading] = useState(false);
  const [actionsEmpty, setActionsEmpty] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  useEffect(() => {
    async function fetchTimeline() {
      try {
        const res = await apiGet(`/timeline/${deal.dealId}`);
        setTimeline(res.entries || []);
      } catch (err) {
        console.error("Failed to load timeline", err);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    }
    if (deal) {
      fetchTimeline();
    }
  }, [deal]);

  async function fetchNextActions() {
    setActionsLoading(true);
    setActionsEmpty(false);
    try {
      const res = await apiGet(`/next-action/${deal.dealId}`);
      if (Array.isArray(res)) {
        setNextActions(res);
        setActionsEmpty(res.length === 0);
      } else {
        setNextActions(res.actions || []);
        setActionsEmpty(!!res.empty || (res.actions && res.actions.length === 0));
      }
    } catch (err) {
      console.error("Failed to load next actions", err);
    } finally {
      setActionsLoading(false);
    }
  }

  useEffect(() => {
    if (deal) fetchNextActions();
  }, [deal]);

  if (!deal) return null;

  const probability = deal.probability || 50;
  const isHighProb = probability >= 70;
  const isMedProb = probability >= 40 && probability < 70;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
      transition={motionTokens.springSmooth}
      style={{ padding: '32px 48px' }}
    >
      <motion.button 
        whileHover={{ x: -4 }} whileTap={{ scale: 0.95 }}
        onClick={onBack}
        style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: 24, padding: 0, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}
      >
        <ArrowLeft size={16} /> Back to Opportunities
      </motion.button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <motion.div layoutId={`deal-${deal.dealId}`} style={{ padding: 16, background: '#f1f5f9', borderRadius: 12 }}>
          <Folder size={32} color="#3b82f6" />
        </motion.div>
        <div>
          <h1 className="dashboard-title" style={{ marginBottom: 4 }}>{deal.dealName}</h1>
          <p style={{ color: '#64748b', fontFamily: 'var(--font-mono)' }}>{deal.dealId}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 32 }}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <p style={{ color: '#64748b', fontSize: 13, marginBottom: 8, fontWeight: 500 }}>Pipeline Value</p>
          <p style={{ fontSize: 32, fontWeight: 700, color: '#0f172a' }}>
            $<MotionNumber value={deal.value || 50000} format={(v) => v.toLocaleString()} />
          </p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden' }}>
          <p style={{ color: '#64748b', fontSize: 13, marginBottom: 8, fontWeight: 500 }}>Confidence Meter</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <p style={{ fontSize: 32, fontWeight: 700, color: isHighProb ? '#10b981' : isMedProb ? '#f59e0b' : '#ef4444' }}>
              <MotionNumber value={probability} />%
            </p>
          </div>
          {/* Animated Gauge Background */}
          <div style={{ marginTop: 12, height: 6, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
            <motion.div 
              initial={{ width: 0 }} animate={{ width: `${probability}%` }} 
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{ height: '100%', background: isHighProb ? '#10b981' : isMedProb ? '#f59e0b' : '#ef4444', borderRadius: 3 }}
            />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <p style={{ color: '#64748b', fontSize: 13, marginBottom: 8, fontWeight: 500 }}>Risk Level</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Activity size={24} color={deal.riskLevel === 'High' ? '#ef4444' : '#f59e0b'} />
            <p style={{ fontSize: 24, fontWeight: 600, color: '#0f172a' }}>{deal.riskLevel || 'Medium'}</p>
          </div>
        </motion.div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, marginTop: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#0f172a' }}>Interaction Timeline</h2>
          {!showTimeline && timeline.length > 0 && (
            <span style={{ background: '#f1f5f9', color: '#64748b', fontSize: 12, padding: '2px 8px', borderRadius: 12, fontWeight: 500 }}>
              {timeline.length} entries
            </span>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => setShowTimeline(!showTimeline)}
          style={{ padding: '8px 16px', background: '#3b82f6', color: '#fff', fontWeight: 600, borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
        >
          {showTimeline ? 'Hide Timeline' : 'View Timeline'}
        </motion.button>
      </div>

      <AnimatePresence>
        {showTimeline && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', marginBottom: 32 }}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Skeleton height={100} borderRadius={12} />
                <Skeleton height={100} borderRadius={12} />
                <Skeleton height={100} borderRadius={12} />
              </div>
            ) : timeline.length === 0 ? (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#64748b' }}>No interactions found for this deal.</motion.p>
            ) : (
              <motion.div variants={staggerContainer} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {timeline.map((entry, idx) => (
                  <motion.div variants={itemReveal} key={idx} style={{ background: '#fff', padding: 20, borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: '#64748b', fontSize: 13 }}>
                      <Clock size={14} />
                      <span>{entry.metadata?.timestamp ? new Date(entry.metadata.timestamp).toLocaleDateString() : 'Recent'}</span>
                      {entry.metadata?.stakeholder && (
                        <>
                          <span style={{ margin: '0 8px' }}>|</span>
                          <User size={14} />
                          <span>{entry.metadata.stakeholder}</span>
                        </>
                      )}
                    </div>
                    <p style={{ color: '#334155', lineHeight: 1.5 }}>{entry.text}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {/* Next Best Actions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...motionTokens.springSmooth, delay: 0.3 }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: "#0f172a", display: "flex", alignItems: "center", gap: 8 }}>
                <Zap size={20} color="#3b82f6" /> Next Best Actions
              </h2>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={fetchNextActions}
                disabled={actionsLoading}
                style={{
                  padding: "7px 14px", borderRadius: 8, border: "1px solid #e2e8f0",
                  background: actionsLoading ? "#f8fafc" : "#f1f5f9",
                  color: actionsLoading ? "#94a3b8" : "#475569",
                  fontSize: 12, fontWeight: 600, cursor: actionsLoading ? "default" : "pointer",
                  display: "flex", alignItems: "center", gap: 5,
                }}
              >
                <motion.div
                  animate={actionsLoading ? { rotate: 360 } : { rotate: 0 }}
                  transition={actionsLoading ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}
                >
                  <RefreshCw size={12} />
                </motion.div>
                Refresh
              </motion.button>
            </div>

            {actionsLoading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Skeleton height={80} borderRadius={12} />
                <Skeleton height={80} borderRadius={12} />
                <Skeleton height={80} borderRadius={12} />
              </div>
            ) : actionsEmpty || nextActions.length === 0 ? (
              <p style={{ color: "#64748b", fontSize: 14 }}>
                No interactions found for this deal. Log some interactions to generate AI recommendations.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {nextActions.map((action, idx) => {
                  const colors = categoryColors[action.category] || categoryColors["Follow-up"];
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ ...motionTokens.springSmooth, delay: idx * 0.08 }}
                      style={{
                        display: "flex", gap: 16, padding: 18, borderRadius: 12,
                        border: "1px solid #e2e8f0", background: "#fff",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                      }}
                    >
                      <div style={{
                        width: 32, height: 32, borderRadius: "50%",
                        background: "#0f172a", color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 13, fontWeight: 700, flexShrink: 0,
                      }}>
                        {action.priority}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                          <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: colors.bg, color: colors.text }}>
                            {action.category}
                          </span>
                          <span style={{ fontSize: 11, fontWeight: 600, color: urgencyColor[action.urgency] || "#64748b" }}>
                            ● {action.urgency} priority
                          </span>
                          <span style={{ fontSize: 11, color: "#94a3b8", display: "flex", alignItems: "center", gap: 3 }}>
                            <Clock size={10} /> {action.timeframe}
                          </span>
                        </div>
                        <p style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 4 }}>{action.title}</p>
                        <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{action.reasoning}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

          <MemoryComparePanel />
        </div>

        <div>
          <AnalyticsPanel dealId={deal.dealId} dealName={deal.dealName} inline={true} />
        </div>
      </div>
    </motion.div>
  );
}
