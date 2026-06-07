import React, { useState } from "react";
import { Lightbulb, Database, Activity, Target, Zap, CheckCircle2 } from "lucide-react";
import { apiPost } from "services/apiClient";
import { motion, AnimatePresence } from "framer-motion";
import { motionTokens } from "lib/motion";
import { RadarPanel } from "./components/RadarPanel";
import { ReasoningPipeline } from "./components/ReasoningPipeline";

export default function IntelligencePanel() {
  const [seeding, setSeeding] = useState(false);
  const [seedDone, setSeedDone] = useState(false);

  async function handleSeed() {
    setSeeding(true);
    try {
      const res = await apiPost("/seed", {});
      if (res.error) throw new Error(res.error);
      setSeedDone(true);
      setTimeout(() => setSeedDone(false), 3000);
    } catch (err) {
      console.error("Seed failed:", err);
      alert("Failed to seed data. Please ensure the backend is running.");
    } finally {
      setSeeding(false);
    }
  }

  return (
    <div style={{ padding: '32px 48px', display: 'flex', flexDirection: 'column', gap: 32 }}>
      <h1 className="dashboard-title">Market Intelligence Engine</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <RadarPanel />
        <ReasoningPipeline />
      </div>

      {/* Database Mgt Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...motionTokens.springSmooth, delay: 0.2 }}
        style={{ background: '#fff', padding: 32, borderRadius: 16, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Database size={18} color="#3b82f6" /> System Data Store
          </h3>
          <p style={{ color: '#64748b', fontSize: 14 }}>Seed the database with demo deals and synthetic interactions to test intelligence features.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={handleSeed}
          disabled={seeding || seedDone}
          style={{ padding: '12px 24px', background: seedDone ? '#10b981' : '#0f172a', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        >
          {seedDone ? <CheckCircle2 size={18} /> : <Database size={18} />}
          {seedDone ? "Data Loaded" : seeding ? "Synthesizing..." : "Seed Demo Data"}
        </motion.button>
      </motion.div>
    </div>
  );
}
