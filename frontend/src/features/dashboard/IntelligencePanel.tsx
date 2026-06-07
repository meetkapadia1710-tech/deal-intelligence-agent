import React from "react";
import { Lightbulb, Database } from "lucide-react";
import { apiPost } from "services/apiClient";

export default function IntelligencePanel() {
  const [seeding, setSeeding] = React.useState(false);
  const [seedDone, setSeedDone] = React.useState(false);

  async function handleSeed() {
    setSeeding(true);
    await apiPost("/seed", {});
    setSeeding(false);
    setSeedDone(true);
    setTimeout(() => setSeedDone(false), 3000);
  }

  return (
    <div style={{ padding: '32px 48px' }}>
      <h1 className="dashboard-title" style={{ marginBottom: 32 }}>Global Intelligence</h1>
      
      <div style={{ 
        background: '#fff', 
        padding: 32, 
        borderRadius: 12, 
        border: '1px solid #e2e8f0',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16
      }}>
        <div style={{ padding: 16, background: '#fef08a', borderRadius: '50%', color: '#ca8a04' }}>
          <Lightbulb size={32} />
        </div>
        <h2 style={{ fontSize: 20, color: '#0f172a' }}>Intelligence Engine</h2>
        <p style={{ color: '#64748b', maxWidth: 400, lineHeight: 1.5 }}>
          The Intelligence Engine continuously monitors your Active Deals to surface risks, sentiment shifts, and actionable insights.
        </p>
        
        <div style={{ marginTop: 24, padding: 24, background: '#f8fafc', borderRadius: 8, width: '100%', maxWidth: 600, border: '1px dashed #cbd5e1' }}>
          <h3 style={{ fontSize: 16, marginBottom: 16, color: '#0f172a' }}>Data Management</h3>
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>Need more insights? Seed the database with demo interactions.</p>
          <button
            onClick={handleSeed}
            disabled={seeding || seedDone}
            style={{
              padding: '10px 20px',
              background: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              margin: '0 auto'
            }}
          >
            <Database size={16} />
            {seedDone ? "Demo data loaded" : seeding ? "Seeding..." : "Load Demo Data"}
          </button>
        </div>
      </div>
    </div>
  );
}
