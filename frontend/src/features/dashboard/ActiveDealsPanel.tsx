import React, { useState, useEffect } from "react";
import { apiGet } from "services/apiClient";
import { Folder } from "lucide-react";

export default function ActiveDealsPanel({ onViewDetails }: any) {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDeals() {
      try {
        const res = await apiGet("/deals");
        setDeals(res.deals || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDeals();
  }, []);

  return (
    <div style={{ padding: '32px 48px' }}>
      <h1 className="dashboard-title" style={{ marginBottom: 32 }}>Active Deals</h1>
      
      {loading ? (
        <p style={{ color: '#64748b' }}>Loading deals...</p>
      ) : deals.length === 0 ? (
        <p style={{ color: '#64748b' }}>No active deals found. Seed demo data to start.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
          {deals.map(deal => (
            <div key={deal.dealId} style={{ 
              background: '#fff', 
              padding: 24, 
              borderRadius: 12, 
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ padding: 10, background: '#f1f5f9', borderRadius: 8 }}>
                  <Folder size={20} color="#3b82f6" />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#0f172a' }}>{deal.dealName}</h3>
                  <p style={{ fontSize: 13, color: '#64748b', fontFamily: 'var(--font-mono)' }}>{deal.dealId}</p>
                </div>
              </div>
              <button 
                className="feed-btn feed-btn-outline" 
                style={{ marginTop: 8 }}
                onClick={() => onViewDetails && onViewDetails(deal)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
