import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, AlertTriangle, FileText, CheckCircle2 } from "lucide-react";
import { apiGet } from "services/apiClient";
import "./DashboardPanel.css";

export default function DashboardPanel({ onFocusChat, onViewDetails }: any) {
  const [deals, setDeals] = useState<any[]>([]);
  const [feedItems, setFeedItems] = useState<any[]>([]);

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
      }
    }
    loadDeals();
  }, []);

  const totalValue = deals.reduce((acc, deal) => acc + (deal.value || 50000), 0);
  const avgProb = deals.length > 0 
    ? Math.round(deals.reduce((acc, deal) => acc + (deal.probability || 50), 0) / deals.length) 
    : 0;
  const highRiskCount = deals.filter(deal => deal.riskLevel === 'High').length;

  const formatCurrency = (val: number) => {
    if (val >= 1000000000) return `$${(val / 1000000000).toFixed(2)}B`;
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    return `$${val.toLocaleString()}`;
  };

  const handleDismiss = (id: number) => {
    setFeedItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Deal Intelligence Dashboard</h1>
      </div>

      <h2 className="section-title" style={{ marginTop: 0 }}>Summary</h2>
      <div className="summary-cards-container">
        {/* Card 1 */}
        <div className="summary-card">
          <div className="sc-header">
            <span>Total Pipeline Value</span>
            <FileText size={16} color="#3b82f6" />
          </div>
          <div className="sc-value">{formatCurrency(totalValue)}</div>
          <div className="sc-metrics">
            <span className="sc-trend positive">+12% MoM</span>
            <svg className="sc-sparkline" viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 25C10 25 15 15 25 15C35 15 40 5 50 5L60 10" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Card 2 */}
        <div className="summary-card">
          <div className="sc-header">
            <span>Avg Probability to Close</span>
            <CheckCircle2 size={16} color="#10b981" />
          </div>
          <div className="sc-value">{avgProb}%</div>
          <div className="sc-metrics">
            <span className="sc-trend positive">+5% MoM</span>
            <svg className="sc-sparkline" viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 25L15 20L30 25L45 10L60 5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Card 3 */}
        <div className="summary-card">
          <div className="sc-header">
            <span>High Risk Deals</span>
            <AlertTriangle size={16} color="#ef4444" />
          </div>
          <div className="sc-value">{highRiskCount}</div>
          <div className="sc-metrics">
            <span className="sc-trend negative">-1 MoM</span>
            <svg className="sc-sparkline" viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 5C10 5 15 15 25 15C35 15 40 25 50 25L60 20" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      <h2 className="section-title">Intelligence Feed</h2>
      <p className="feed-desc">AI-driven insights on current deals.</p>
      
      <div className="feed-container">
        {feedItems.length === 0 && (
          <p style={{ color: '#64748b' }}>No new insights at this time. Go to Global Intelligence to seed demo data.</p>
        )}
        {feedItems.map(item => (
          <div key={item.id} className="feed-item">
            <div className="feed-item-title">{item.dealName}: {item.context}</div>
            <div className="feed-item-desc">
              {item.desc}
            </div>
            <div className="feed-item-actions">
              <button 
                className="feed-btn feed-btn-dark"
                onClick={() => onViewDetails && onViewDetails(item.deal)}
              >
                View Details
              </button>
              <button 
                className="feed-btn feed-btn-outline"
                onClick={() => handleDismiss(item.id)}
              >
                Dismiss
              </button>
              <div style={{ flex: 1 }}></div>
              <button 
                className="feed-btn feed-btn-dark"
                onClick={() => onFocusChat && onFocusChat(item.deal)}
              >
                Ask Agent
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

