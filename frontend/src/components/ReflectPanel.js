import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, FileText, AlertTriangle, Users, ArrowRight, Loader2 } from "lucide-react";
import { apiPost } from "../api/apiClient";
import { fadeThroughVariants } from "../theme/motion";
import { Ripple } from "./ui/Ripple";

export default function ReflectPanel({ dealId, dealName }) {
  const [reflection, setReflection] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeBtn, setActiveBtn] = useState(null);

  async function runReflect(promptType) {
    setLoading(true);
    setActiveBtn(promptType);
    setReflection("");
    const prompts = {
      summary: `For the deal "${dealName}", provide: 1) Top objections raised and by whom, 2) All stakeholders and their roles/concerns, 3) Current deal status and risks, 4) Recommended next 3 actions`,
      objections: `What are the top recurring objections raised in the "${dealName}" deal? Who raised them and how many times? What is the best counter-argument for each?`,
      stakeholders: `List all stakeholders mentioned in the "${dealName}" deal. For each person: their name, role, main concern, and sentiment toward the deal.`,
      nextSteps: `Based on the full deal history for "${dealName}", what are the 3 most important next steps the sales rep should take right now to move this deal forward?`,
    };
    const res = await apiPost("/reflect", { dealId, dealName, prompt: prompts[promptType] });
    setLoading(false);
    setReflection(res.reflection || res.error || "No reflection returned.");
  }

  const buttons = [
    { key: "summary", label: "Deal Summary", icon: FileText },
    { key: "objections", label: "Objection Patterns", icon: AlertTriangle },
    { key: "stakeholders", label: "Stakeholder Map", icon: Users },
    { key: "nextSteps", label: "Next Steps", icon: ArrowRight },
  ];

  return (
    <div className="card-panel">
      <div className="reflect-header" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles size={24} color="var(--warning)" />
        </div>
        <div>
          <p className="card-title" style={{ marginBottom: 4 }}>Memory Analysis</p>
          <p className="card-subtitle" style={{ color: 'var(--warning)', fontWeight: 500, marginBottom: 0 }}>Powered by Hindsight Reflect</p>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 32 }}>
        {buttons.map((b) => {
          const Icon = b.icon;
          const isActive = activeBtn === b.key;
          return (
            <button
              key={b.key}
              className="pressable"
              style={{
                background: isActive ? 'var(--warning-bg)' : 'rgba(0, 0, 0, 0.2)',
                border: `1px solid ${isActive ? 'var(--warning)' : 'var(--border)'}`,
                color: isActive ? 'var(--warning)' : 'var(--text-secondary)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                fontFamily: 'var(--font-sans)',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                textAlign: 'left'
              }}
              onClick={() => runReflect(b.key)}
              disabled={loading}
            >
              <Icon size={18} />
              <span style={{ position: 'relative', zIndex: 1 }}>{b.label}</span>
              <Ripple color={isActive ? "rgba(245, 158, 11, 0.2)" : "rgba(255,255,255,0.05)"} />
            </button>
          );
        })}
      </div>
      
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div 
            key="loading"
            variants={fadeThroughVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '40px 0', color: 'var(--text-muted)', fontSize: 14 }}
          >
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
              <Loader2 size={32} color="var(--warning)" />
            </motion.div>
            <span>Hindsight is analyzing the entire deal memory...</span>
          </motion.div>
        )}
        
        {reflection && !loading && (
          <motion.div 
            key="reflection"
            variants={fadeThroughVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 24, marginTop: 24 }}
          >
            <pre style={{ fontFamily: 'var(--font-sans)', fontSize: 15, lineHeight: 1.8, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
              {reflection}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
