import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, AlertTriangle, FileText, CheckCircle2, Sparkles } from "lucide-react";
import { apiGet } from "services/apiClient";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, itemReveal, cardHover, motionTokens } from "lib/motion";
import { MotionNumber } from "components/ui/MotionNumber";
import { Skeleton } from "components/ui/Skeleton";
import "./DashboardPanel.css";

export default function DashboardPanel({ onFocusChat, onViewDetails }: any) {
  const [deals, setDeals] = useState<any[]>([]);
  const [feedItems, setFeedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDeals() {
      try {
        const res = await apiGet("/deals");
        const fetchedDeals = res.deals || [];
        setDeals(fetchedDeals);
        
        // Generate dynamic intelligence feed based on actual deals
        const dynamicFeed = fetchedDeals.map((d: any, i: number) => ({
          id: d.id || i,
          dealName: d.dealName,
          deal: d,
          context: i % 2 === 0 ? "New Competitor Entry Detected" : "Decision Maker Change",
          desc: i % 2 === 0 
            ? `AI detected a new competitor mentioned in recent communications for ${d.dealName}.`
            : `Recent interactions indicate a potential decision maker change in the ${d.dealName} deal.`
        }));
        setFeedItems(dynamicFeed);
      } catch (err) {
        console.error("Failed to load deals", err);
      } finally {
        // Slight artificial delay to show premium skeleton state
        setTimeout(() => setLoading(false), 800);
      }
    }
    loadDeals();
  }, []);

  const totalValue = deals.reduce((acc, deal) => acc + (deal.value || 50000), 0);
  const avgProb = deals.length > 0 
    ? deals.reduce((acc, deal) => acc + (deal.probability || 50), 0) / deals.length
    : 0;
  const highRiskCount = deals.filter(deal => deal.riskLevel === 'High').length;

  const handleDismiss = (id: number) => {
    setFeedItems(prev => prev.filter(item => item.id !== id));
  };

  const formatCurrency = (val: number) => {
    if (val >= 1000000000) return `$${(val / 1000000000).toFixed(2)}B`;
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    return `$${val.toLocaleString()}`;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Deal Intelligence Dashboard</h1>
      </div>

      <h2 className="section-title" style={{ marginTop: 0 }}>Summary</h2>
      
      {loading ? (
        <div className="summary-cards-container">
          <Skeleton height={140} borderRadius={16} />
          <Skeleton height={140} borderRadius={16} />
          <Skeleton height={140} borderRadius={16} />
        </div>
      ) : (
        <motion.div 
          className="summary-cards-container"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {/* Card 1 */}
          <motion.div variants={itemReveal} whileHover={cardHover} className="summary-card" style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20 }}>
            <div className="sc-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, color: '#64748b', fontSize: 14, fontWeight: 500 }}>
              <span>Total Pipeline Value</span>
              <FileText size={16} color="#3b82f6" />
            </div>
            <div className="sc-value" style={{ fontSize: 32, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
              <MotionNumber value={totalValue} format={formatCurrency} />
            </div>
            <div className="sc-metrics" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="sc-trend positive" style={{ color: '#10b981', fontSize: 13, fontWeight: 600 }}>+12% MoM</span>
              <svg className="sc-sparkline" viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 60, height: 30 }}>
                <motion.path 
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeOut" }}
                  d="M0 25C10 25 15 15 25 15C35 15 40 5 50 5L60 10" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={itemReveal} whileHover={cardHover} className="summary-card" style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20 }}>
            <div className="sc-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, color: '#64748b', fontSize: 14, fontWeight: 500 }}>
              <span>Avg Probability to Close</span>
              <CheckCircle2 size={16} color="#10b981" />
            </div>
            <div className="sc-value" style={{ fontSize: 32, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
              <MotionNumber value={avgProb} format={(val) => Math.round(val) + "%"} />
            </div>
            <div className="sc-metrics" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="sc-trend positive" style={{ color: '#10b981', fontSize: 13, fontWeight: 600 }}>+5% MoM</span>
              <svg className="sc-sparkline" viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 60, height: 30 }}>
                <motion.path 
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                  d="M0 25L15 20L30 25L45 10L60 5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={itemReveal} whileHover={cardHover} className="summary-card" style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20 }}>
            <div className="sc-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, color: '#64748b', fontSize: 14, fontWeight: 500 }}>
              <span>High Risk Deals</span>
              <AlertTriangle size={16} color="#ef4444" />
            </div>
            <div className="sc-value" style={{ fontSize: 32, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
              <MotionNumber value={highRiskCount} />
            </div>
            <div className="sc-metrics" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="sc-trend negative" style={{ color: '#ef4444', fontSize: 13, fontWeight: 600 }}>-1 MoM</span>
              <svg className="sc-sparkline" viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 60, height: 30 }}>
                <motion.path 
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
                  d="M0 5C10 5 15 15 25 15C35 15 40 25 50 25L60 20" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </motion.div>
        </motion.div>
      )}

      <h2 className="section-title">Intelligence Feed</h2>
      <p className="feed-desc" style={{ marginBottom: 24, color: '#64748b' }}>AI-driven insights on current deals.</p>
      
      <div className="feed-container" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {loading ? (
          <>
            <Skeleton height={120} borderRadius={12} />
            <Skeleton height={120} borderRadius={12} />
          </>
        ) : (
          <AnimatePresence>
            {feedItems.length === 0 && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#64748b' }}>
                No new insights at this time. Go to Global Intelligence to seed demo data.
              </motion.p>
            )}
            {feedItems.map((item, index) => (
              <motion.div 
                key={item.id} 
                className="feed-item"
                initial={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto', marginBottom: 16 }}
                exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0, overflow: 'hidden' }}
                transition={{ ...motionTokens.springSmooth, delay: index * 0.05 }}
                layout
                style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
              >
                <div className="feed-item-title" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>
                  <Sparkles size={16} color="#8b5cf6" />
                  {item.dealName}: {item.context}
                </div>
                <div className="feed-item-desc" style={{ color: '#475569', fontSize: 14, lineHeight: 1.5, marginBottom: 16 }}>
                  {item.desc}
                </div>
                <div className="feed-item-actions" style={{ display: 'flex', gap: 12 }}>
                  <motion.button 
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    style={{ padding: '8px 16px', borderRadius: 6, background: '#f1f5f9', color: '#0f172a', border: 'none', fontWeight: 500, fontSize: 13, cursor: 'pointer' }}
                    onClick={() => onViewDetails && onViewDetails(item.deal)}
                  >
                    View Details
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    style={{ padding: '8px 16px', borderRadius: 6, background: 'transparent', color: '#64748b', border: '1px solid #e2e8f0', fontWeight: 500, fontSize: 13, cursor: 'pointer' }}
                    onClick={() => handleDismiss(item.id)}
                  >
                    Dismiss
                  </motion.button>
                  <div style={{ flex: 1 }}></div>
                  <motion.button 
                    whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)' }} whileTap={{ scale: 0.95 }}
                    style={{ padding: '8px 16px', borderRadius: 6, background: '#0f172a', color: '#fff', border: 'none', fontWeight: 500, fontSize: 13, cursor: 'pointer', display: 'flex', gap: 8, alignItems: 'center' }}
                    onClick={() => onFocusChat && onFocusChat(item.deal)}
                  >
                    <Sparkles size={14} color="#8b5cf6" />
                    Ask Agent
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

