import React, { useState, useEffect } from "react";
import { Database, Activity, Target, Zap, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { motionTokens } from "lib/motion";

export const ReasoningPipeline = () => {
  const [activeNode, setActiveNode] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const nodes = [
    { id: 'research', label: 'Research', icon: <Database size={18} /> },
    { id: 'analysis', label: 'Analysis', icon: <Activity size={18} /> },
    { id: 'validation', label: 'Validation', icon: <Target size={18} /> },
    { id: 'insight', label: 'Insight Generation', icon: <Zap size={18} /> }
  ];

  return (
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
            <div key={node.id} style={{ display: 'flex', alignItems: 'center', gap: 16, zIndex: 1 }}>
              <motion.div 
                animate={{ 
                  background: isActive ? '#3b82f6' : isPast ? '#10b981' : '#fff',
                  borderColor: isActive || isPast ? 'transparent' : '#e2e8f0',
                  color: isActive || isPast ? '#fff' : '#64748b',
                  scale: isActive ? 1.1 : 1
                }}
                style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {isPast ? <CheckCircle2 size={20} /> : node.icon}
              </motion.div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: isActive || isPast ? '#0f172a' : '#64748b' }}>{node.label}</div>
                <AnimatePresence>
                  {isActive && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}
                    >
                      Processing parameters...
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
