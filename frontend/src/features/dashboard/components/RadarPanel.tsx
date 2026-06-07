import React from "react";
import { motion } from "framer-motion";
import { motionTokens } from "lib/motion";

export const RadarPanel = () => {
  return (
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
  );
};
