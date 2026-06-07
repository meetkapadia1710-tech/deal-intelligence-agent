import React, { useState, useEffect } from "react";
import { Folder, Clock, User } from "lucide-react";
import { apiGet } from "services/apiClient";
import AnalyticsPanel from "features/analytics/AnalyticsPanel";

export default function DealDetailsPanel({ deal, onBack }: any) {
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTimeline() {
      try {
        const res = await apiGet(`/timeline/${deal.dealId}`);
        setTimeline(res.entries || []);
      } catch (err) {
        console.error("Failed to load timeline", err);
      } finally {
        setLoading(false);
      }
    }
    if (deal) {
      fetchTimeline();
    }
  }, [deal]);

  if (!deal) return null;

  return (
    <div style={{ padding: '32px 48px' }}>
      <button 
        onClick={onBack}
        style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', marginBottom: 24, padding: 0, fontWeight: 500 }}
      >
        &larr; Back to Active Deals
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <div style={{ padding: 16, background: '#f1f5f9', borderRadius: 12 }}>
          <Folder size={32} color="#3b82f6" />
        </div>
        <div>
          <h1 className="dashboard-title" style={{ marginBottom: 4 }}>{deal.dealName}</h1>
          <p style={{ color: '#64748b', fontFamily: 'var(--font-mono)' }}>{deal.dealId}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 32 }}>
        <div style={{ background: '#fff', padding: 20, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#64748b', fontSize: 13, marginBottom: 4 }}>Pipeline Value</p>
          <p style={{ fontSize: 24, fontWeight: 600, color: '#0f172a' }}>${(deal.value || 50000).toLocaleString()}</p>
        </div>
        <div style={{ background: '#fff', padding: 20, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#64748b', fontSize: 13, marginBottom: 4 }}>Probability</p>
          <p style={{ fontSize: 24, fontWeight: 600, color: '#10b981' }}>{deal.probability || 50}%</p>
        </div>
        <div style={{ background: '#fff', padding: 20, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#64748b', fontSize: 13, marginBottom: 4 }}>Risk Level</p>
          <p style={{ fontSize: 24, fontWeight: 600, color: deal.riskLevel === 'High' ? '#ef4444' : '#f59e0b' }}>{deal.riskLevel || 'Medium'}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 32 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#0f172a', marginBottom: 24 }}>Interaction Timeline</h2>
          
          {loading ? (
            <p style={{ color: '#64748b' }}>Loading timeline...</p>
          ) : timeline.length === 0 ? (
            <p style={{ color: '#64748b' }}>No interactions found for this deal.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {timeline.map((entry, idx) => (
                <div key={idx} style={{ background: '#fff', padding: 20, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: '#64748b', fontSize: 13 }}>
                    <Clock size={14} />
                    <span>{new Date(entry.timestamp).toLocaleString()}</span>
                    {entry.metadata?.stakeholder && (
                      <>
                        <span style={{ margin: '0 8px' }}>|</span>
                        <User size={14} />
                        <span>{entry.metadata.stakeholder}</span>
                      </>
                    )}
                  </div>
                  <p style={{ color: '#334155', lineHeight: 1.5 }}>{entry.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <AnalyticsPanel dealId={deal.dealId} dealName={deal.dealName} inline={true} />
        </div>
      </div>
    </div>
  );
}
