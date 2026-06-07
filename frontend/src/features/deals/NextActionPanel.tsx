import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { Target, Loader2 } from "lucide-react";
import { apiPost } from "services/apiClient";
import { fadeThroughVariants } from "constants/motion";

export default function NextActionPanel({ dealId, dealName }: { dealId: string, dealName: string }) {
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        const res = await apiPost("/next-action", {
          dealId,
          dealName,
        });

        setAction(res.recommendation);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [dealId]);

  if (loading) {
    return (
      <div className="card-panel" style={{ padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
          <Loader2 size={32} color="var(--accent-color)" />
        </motion.div>
        <span style={{ color: 'var(--text-muted)' }}>Analyzing deal history to determine the best next step...</span>
      </div>
    );
  }

  return (
    <motion.div 
      className="card-panel" 
      style={{ padding: 24, marginTop: 16 }}
      variants={fadeThroughVariants}
      initial="initial"
      animate="animate"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: 8, borderRadius: 8 }}>
          <Target size={24} color="var(--success)" />
        </div>
        <h3 style={{ margin: 0, fontSize: 18, color: 'var(--text-primary)' }}>Recommended Next Action</h3>
      </div>
      
      <div className="markdown-body" style={{ background: 'rgba(0,0,0,0.2)', padding: 20, borderRadius: 12, border: '1px solid var(--border)' }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{action}</ReactMarkdown>
      </div>
    </motion.div>
  );
}
