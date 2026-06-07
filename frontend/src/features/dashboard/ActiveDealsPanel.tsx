import React, { useState, useEffect } from "react";
import { apiGet, apiPost } from "services/apiClient";
import { Folder, ArrowRight, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, itemReveal, cardHover, motionTokens } from "lib/motion";
import { Skeleton } from "components/ui/Skeleton";

export default function ActiveDealsPanel({ onViewDetails }: any) {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newDeal, setNewDeal] = useState({ dealName: "", stakeholder: "", note: "" });

  const fetchDeals = async () => {
    try {
      const res = await apiGet("/deals");
      setDeals(res.deals || []);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleCreateDeal = async () => {
    setCreating(true);
    try {
      const dealId = newDeal.dealName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
      await apiPost("/interactions", {
        dealId,
        dealName: newDeal.dealName,
        stakeholder: newDeal.stakeholder,
        note: newDeal.note
      });
      await fetchDeals();
      setShowCreateModal(false);
      setNewDeal({ dealName: "", stakeholder: "", note: "" });
    } catch(e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  const pipelineStages = ["Discovery", "Qualification", "Proposal", "Negotiation", "Closed Won"];

  return (
    <div style={{ padding: '32px 48px' }}>
      <h1 className="dashboard-title" style={{ marginBottom: 32 }}>Active Deals</h1>
      
      {/* Deal Pipeline Visualization */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Activity size={18} color="#8b5cf6" /> Deal Pipeline Velocity
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, overflowX: 'auto', paddingBottom: 16 }}>
          {pipelineStages.map((stage, i) => (
            <React.Fragment key={stage}>
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, ...motionTokens.springSmooth }}
                style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '16px 24px', borderRadius: 12, minWidth: 160, boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}
              >
                <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500, marginBottom: 8 }}>Stage {i + 1}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>{stage}</div>
                <div style={{ marginTop: 12, height: 4, background: '#f1f5f9', borderRadius: 2, overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }} animate={{ width: `${Math.max(20, 100 - i * 20)}%` }} transition={{ duration: 1, delay: i * 0.1 + 0.3 }}
                    style={{ height: '100%', background: i === 4 ? '#10b981' : '#3b82f6', borderRadius: 2 }}
                  />
                </div>
              </motion.div>
              {i < pipelineStages.length - 1 && (
                <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 + 0.2 }}>
                  <ArrowRight size={20} color="#cbd5e1" />
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#0f172a' }}>All Opportunities</h2>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          style={{ padding: '8px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}
        >
          + Custom Deal
        </motion.button>
      </div>
      
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
          <Skeleton height={140} borderRadius={12} />
          <Skeleton height={140} borderRadius={12} />
          <Skeleton height={140} borderRadius={12} />
        </div>
      ) : deals.length === 0 ? (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#64748b' }}>No active deals found. Seed demo data to start.</motion.p>
      ) : (
        <motion.div 
          variants={staggerContainer} initial="hidden" animate="show"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}
        >
          <AnimatePresence>
            {deals.map(deal => (
              <motion.div 
                key={deal.dealId} 
                layoutId={`deal-${deal.dealId}`}
                variants={itemReveal}
                whileHover={cardHover}
                style={{ 
                  background: '#fff', padding: 24, borderRadius: 12, border: '1px solid #e2e8f0',
                  display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', overflow: 'hidden'
                }}
              >
                <motion.div 
                  initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} 
                  style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: '#3b82f6' }} 
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ padding: 10, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }}>
                    <Folder size={20} color="#3b82f6" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: '#0f172a' }}>{deal.dealName}</h3>
                    <p style={{ fontSize: 13, color: '#64748b', fontFamily: 'var(--font-mono)' }}>{deal.dealId}</p>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  style={{ marginTop: 8, padding: '10px', background: '#f8fafc', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: 8, fontWeight: 500, fontSize: 13, cursor: 'pointer' }}
                  onClick={() => onViewDetails && onViewDetails(deal)}
                >
                  View Details
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Create Custom Deal Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={(e: any) => e.stopPropagation()}
              style={{ background: '#fff', padding: 32, borderRadius: 16, width: '100%', maxWidth: 480, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
            >
              <h2 style={{ fontSize: 20, fontWeight: 600, color: '#0f172a', marginBottom: 24 }}>Create Custom Deal</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Deal Name</label>
                  <input value={newDeal.dealName} onChange={e => setNewDeal({...newDeal, dealName: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14 }} placeholder="e.g. Stark Industries" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Stakeholder</label>
                  <input value={newDeal.stakeholder} onChange={e => setNewDeal({...newDeal, stakeholder: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14 }} placeholder="e.g. Tony Stark (CEO)" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Initial Memory / Note</label>
                  <textarea value={newDeal.note} onChange={e => setNewDeal({...newDeal, note: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, minHeight: 80, resize: 'vertical' }} placeholder="First interaction summary..." />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button onClick={() => setShowCreateModal(false)} style={{ flex: 1, padding: 12, background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button onClick={handleCreateDeal} disabled={creating || !newDeal.dealName || !newDeal.note} style={{ flex: 1, padding: 12, background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: creating || !newDeal.dealName || !newDeal.note ? 'not-allowed' : 'pointer', opacity: creating || !newDeal.dealName || !newDeal.note ? 0.7 : 1 }}>
                  {creating ? "Creating..." : "Create Deal"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
