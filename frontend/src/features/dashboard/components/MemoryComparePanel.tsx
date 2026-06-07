import React, { useState } from 'react';
import { apiPost } from '../../../services/apiClient';
import { Brain, Search, Zap, XCircle, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

export default function MemoryComparePanel() {
  const [question, setQuestion] = useState("What are the main objections for this deal?");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ noMemory: string, withMemory: string, memoriesCount: number } | null>(null);
  
  const { activeDeal } = useAppStore();

  const handleCompare = async () => {
    if (!activeDeal) return;
    setLoading(true);
    setResults(null);
    try {
      const res = await apiPost('/compare', {
        dealId: activeDeal.id || activeDeal.dealId,
        dealName: activeDeal.name || activeDeal.dealName,
        question
      });
      if (res.error) throw new Error(res.error);
      setResults(res);
    } catch (err) {
      console.error(err);
      alert("Failed to run comparison: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (!activeDeal) return null;

  return (
    <>
      <style>
        {`
          .memory-markdown p { margin-bottom: 8px; }
          .memory-markdown p:last-child { margin-bottom: 0; }
          .memory-markdown ul, .memory-markdown ol { margin-left: 20px; margin-bottom: 8px; padding-left: 4px; }
          .memory-markdown li { margin-bottom: 4px; }
          .memory-markdown strong { font-weight: 700; color: #0f172a; }
          .memory-markdown em { font-style: italic; }
        `}
      </style>
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', marginTop: 32, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ padding: 8, background: '#e0e7ff', borderRadius: 8, color: '#4f46e5' }}>
              <Brain size={20} />
            </div>
            <div>
              <h3 style={{ fontWeight: 600, color: '#0f172a', margin: 0, fontSize: 16 }}>Hindsight Memory Comparison</h3>
              <p style={{ fontSize: 13, color: '#64748b', margin: '2px 0 0 0' }}>See the difference long-term memory makes</p>
            </div>
          </div>
        </div>

        <div style={{ padding: 24 }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                style={{ width: '100%', padding: '10px 16px 10px 40px', border: '1px solid #e2e8f0', borderRadius: 8, outline: 'none', fontSize: 14, fontFamily: 'inherit' }}
                placeholder="Ask a question about this deal..."
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handleCompare}
              disabled={loading}
              style={{ padding: '0 20px', background: '#4f46e5', color: '#fff', fontWeight: 500, borderRadius: 8, border: 'none', display: 'flex', alignItems: 'center', gap: 8, cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? <Zap size={18} /> : <Zap size={18} />}
              Run Test
            </motion.button>
          </div>

          {results && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div style={{ border: '1px solid #fecaca', background: '#fef2f2', borderRadius: 12, padding: 20, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 4, background: '#f87171' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, color: '#b91c1c' }}>
                  <XCircle size={18} />
                  <h4 style={{ fontWeight: 600, margin: 0, fontSize: 15 }}>Generic AI (No Memory)</h4>
                </div>
                <div className="memory-markdown" style={{ color: '#334155', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                  <ReactMarkdown>{results.noMemory}</ReactMarkdown>
                </div>
              </div>

              <div style={{ border: '1px solid #a7f3d0', background: '#ecfdf5', borderRadius: 12, padding: 20, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 4, background: '#34d399' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, color: '#047857' }}>
                  <CheckCircle2 size={18} />
                  <h4 style={{ fontWeight: 600, margin: 0, fontSize: 15 }}>Hindsight AI (With Memory)</h4>
                  <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 500, background: '#d1fae5', color: '#065f46', padding: '2px 10px', borderRadius: 12 }}>
                    {results.memoriesCount} Memories
                  </span>
                </div>
                <div className="memory-markdown" style={{ color: '#334155', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                  <ReactMarkdown>{results.withMemory}</ReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
