import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { apiGet } from "services/apiClient";
import { staggerContainer, staggerItem } from "constants/motion";

export default function AnalyticsPanel({ dealId, dealName, inline }: any) {
  const [data, setData] = useState({ velocity: [], objections: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        let velocity = [];
        let objections = [];

        if (dealId) {
          const res = await apiGet(`/analytics/${dealId}`);
          velocity = res.velocity || [];
          objections = res.objections || [];
        } else {
          const res = await apiGet(`/analytics/global`);
          velocity = res.velocity || [];
          objections = res.objections || [];
        }

        setData({ velocity, objections });
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [dealId]);

  if (loading) return <div style={{ padding: inline ? 0 : '32px 48px', color: '#64748b' }}>Analyzing deal data...</div>;

  return (
    <motion.div 
      className="analytics-panel"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      style={{ padding: inline ? 0 : '32px 48px', display: 'flex', flexDirection: 'column', gap: inline ? 24 : 32, width: '100%', maxWidth: 1000 }}
    >
      {!inline && (
        <h1 className="dashboard-title">
          {dealName ? `Analytics: ${dealName}` : "Global Pipeline Analytics"}
        </h1>
      )}
      {inline && <h2 style={{ fontSize: 18, fontWeight: 600, color: '#0f172a' }}>Deal Analytics</h2>}
      
      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <motion.div variants={staggerItem} className="card-panel" style={{ padding: 24, background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', marginBottom: 24 }}>Interaction Velocity</h3>
          <div style={{ height: 250, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.velocity}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, color: '#0f172a' }} 
                />
                <Bar dataKey="interactions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

        <motion.div variants={staggerItem} className="card-panel" style={{ padding: 24, background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', marginBottom: 24 }}>Objection Radar</h3>
          <div style={{ height: 250, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data.objections}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Objections" dataKey="A" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
                <Tooltip 
                  contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, color: '#0f172a' }} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
