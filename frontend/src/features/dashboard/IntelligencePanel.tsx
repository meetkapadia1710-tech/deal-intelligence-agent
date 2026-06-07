import React, { useState, useEffect } from "react";
import { Lightbulb, Database, Activity, Target, Zap, CheckCircle2 } from "lucide-react";
import { apiPost } from "services/apiClient";
import { motion, AnimatePresence } from "framer-motion";
import { motionTokens } from "lib/motion";

export default function IntelligencePanel() {
  const [seeding, setSeeding] = useState(false);
  const [seedDone, setSeedDone] = useState(false);
  const [activeNode, setActiveNode] = useState(0);

  useEffect(() => {
    // Loop the AI thinking animation
    const interval = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  async function handleSeed() {
    setSeeding(true);
    await apiPost("/seed", {});
    setSeeding(false);
    setSeedDone(true);
    setTimeout(() => setSeedDone(false), 3000);
  }

  const nodes = [
    { id: 'research', label: 'Research', icon: <Database size={18} /> },
    { id: 'analysis', label: 'Analysis', icon: <Activity size={18} /> },
    { id: 'validation', label: 'Validation', icon: <Target size={18} /> },
    { id: 'insight', label: 'Insight Generation', icon: <Zap size={18} /> }
  ];

  return (
    <div style={{ padding: '32px 48px', display: 'flex', flexDirection: 'column', gap: 32 }}>
      <h1 className="dashboard-title">Market Intelligence Engine</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        {/* Radar Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={motionTokens.springSmooth}
          style={{ background: '#fff', padding: 32, borderRadius: 16, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#0f172a', marginBottom: 32, alignSelf: 'flex-start' }}>Market Signals Radar</h2>
          <div style={{ position: 'relative', width: 240, height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Radar Circles */}
            {[1, 2, 3].map((ring) => (
              <motion.div
                key={`ring-${ring}`}
                style={{
                  position: 'absolute',
                  width: ring * 80,
                  height: ring * 80,
                  borderRadius: '50%',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  boxShadow: ring === 1 ? '0 0 20px rgba(59, 130, 246, 0.1)' : 'none'
                }}
              />
            ))}
            {/* Radar Sweep */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              style={{
                position: 'absolute',
                width: 120,
                height: 120,
                top: 0, left: 120,
                background: 'conic-gradient(from 180deg at 0% 100%, rgba(59, 130, 246, 0) 0deg, rgba(59, 130, 246, 0.4) 90deg)',
                transformOrigin: '0% 100%',
                clipPath: 'polygon(0 100%, 100% 0, 100% 100%)'
              }}
            />
            {/* Dots representing signals */}
            <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }} style={{ position: 'absolute', width: 8, height: 8, background: '#8b5cf6', borderRadius: '50%', top: 60, left: 160, boxShadow: '0 0 10px #8b5cf6' }} />
            <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 2, delay: 1.5 }} style={{ position: 'absolute', width: 10, height: 10, background: '#ef4444', borderRadius: '50%', top: 160, left: 70, boxShadow: '0 0 10px #ef4444' }} />
            <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 2, delay: 2.5 }} style={{ position: 'absolute', width: 6, height: 6, background: '#10b981', borderRadius: '50%', top: 100, left: 100, boxShadow: '0 0 10px #10b981' }} />
          </div>
        </motion.div>

        {/* AI Thinking Graph Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...motionTokens.springSmooth, delay: 0.1 }}
          style={{ background: '#fff', padding: 32, borderRadius: 16, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#0f172a', marginBottom: 32 }}>Agent Reasoning Pipeline</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, flex: 1, position: 'relative' }}>
            {/* SVG Connection Lines */}
            <div style={{ position: 'absolute', left: 24, top: 24, bottom: 24, width: 2, background: '#e2e8f0', zIndex: 0 }}>
              <motion.div
                animate={{ height: `${(activeNode / 3) * 100}%` }}
                transition={motionTokens.springSmooth}
                style={{ width: '100%', background: 'linear-gradient(to bottom, #3b82f6, #8b5cf6)', top: 0, position: 'absolute' }}
              />
            </div>

            {nodes.map((node, i) => {
              const isActive = i === activeNode;
              const isPast = i < activeNode;
              
              return (
                <div key={node.id} style={{ display: 'flex', alignItems: 'center', gap: 16, zIndex: 1, position: 'relative' }}>
                  <motion.div 
                    animate={{ 
                      scale: isActive ? 1.2 : 1,
                      backgroundColor: isActive ? '#3b82f6' : isPast ? '#10b981' : '#f1f5f9',
                      color: isActive || isPast ? '#fff' : '#64748b'
                    }}
                    style={{ width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #fff', boxShadow: isActive ? '0 0 15px rgba(59, 130, 246, 0.4)' : 'none' }}
                  >
                    {isPast ? <CheckCircle2 size={20} /> : node.icon}
                  </motion.div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 15, fontWeight: isActive ? 700 : 500, color: isActive ? '#0f172a' : '#64748b', transition: 'color 0.3s' }}>
                      {node.label}
                    </h3>
                    {isActive && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ fontSize: 13, color: '#3b82f6', marginTop: 4 }}>
                        Processing real-time data streams...
                      </motion.div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
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
