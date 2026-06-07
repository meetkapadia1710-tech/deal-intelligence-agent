import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { apiGet } from "services/apiClient";
import { staggerContainer, staggerItem } from "constants/motion";

export default function AnalyticsPanel({ dealId, dealName }: any) {
  const [data, setData] = useState({ velocity: [], objections: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await apiGet(`/timeline/${dealId}`);
        const entries = res.entries || [];
        
        // Mocking Velocity Data based on the entries
        const velocity = [
          { name: "Week 1", interactions: Math.floor(Math.random() * 3) + 1 },
          { name: "Week 2", interactions: Math.floor(Math.random() * 4) + 1 },
          { name: "Week 3", interactions: Math.floor(Math.random() * 2) + 1 },
          { name: "Week 4", interactions: entries.length },
        ];

        // Objection Radar Data derived from text analysis of the memories
        const text = entries.map(e => e.text.toLowerCase()).join(" ");
        const objections = [
          { subject: "Pricing", A: (text.match(/price|pricing|discount|cost/g) || []).length * 20 + 20, fullMark: 100 },
          { subject: "Timeline", A: (text.match(/timeline|week|month|urgent/g) || []).length * 20 + 30, fullMark: 100 },
          { subject: "Security", A: (text.match(/security|soc2|dpa|msa|legal/g) || []).length * 20 + 10, fullMark: 100 },
          { subject: "Integration", A: (text.match(/api|integration|sap|salesforce/g) || []).length * 20 + 40, fullMark: 100 },
          { subject: "Competitor", A: (text.match(/competitor|other|vendor/g) || []).length * 20 + 15, fullMark: 100 },
        ];

        setData({ velocity, objections });
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [dealId]);

  if (loading) return <div style={{ padding: 24, color: 'var(--text-muted)' }}>Analyzing deal data...</div>;

  return (
    <motion.div 
      className="analytics-panel"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', width: '100%', maxWidth: 1000 }}
    >
      <motion.div variants={staggerItem} className="card-panel" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 24 }}>Interaction Velocity</h3>
        <div style={{ height: 250, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.velocity}>
              <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, color: '#fff' }} 
              />
              <Bar dataKey="interactions" fill="var(--accent-color)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div variants={staggerItem} className="card-panel" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 24 }}>Objection Radar</h3>
        <div style={{ height: 250, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data.objections}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Objections" dataKey="A" stroke="var(--warning)" fill="var(--warning)" fillOpacity={0.4} />
              <Tooltip 
                contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, color: '#fff' }} 
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
}
