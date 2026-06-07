import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XCircle, CheckCircle2, ArrowRight, Loader2, RefreshCcw } from "lucide-react";
import { apiPost } from "../api/apiClient";
import { fadeThroughVariants, staggerContainer, staggerItem } from "../theme/motion";
import { Ripple } from "./ui/Ripple";
import ReactMarkdown from "react-markdown";

const BA_EXAMPLES = [
  "What did the CFO say about pricing?",
  "Draft a follow-up email for the key stakeholder",
  "What are the main objections in this deal?",
  "How should I prepare for the next call?",
];

export default function BeforeAfterPanel({ dealId, dealName }) {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleCompare() {
    if (!question.trim() || loading) return;
    setLoading(true);
    setResult(null);
    try {
      const [withMem, noMem] = await Promise.all([
        apiPost("/chat", { dealId, dealName, question }),
        apiPost("/chat-no-memory", { question }),
      ]);
      setResult({ withMem, noMem, question });
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div 
      className="ba-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="ba-intro">
        <p className="ba-intro-title">Before & After Memory</p>
        <p className="ba-intro-sub">
          Ask a question. See the difference between a generic AI and an AI armed with complete deal history.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!result && !loading && (
          <motion.div 
            key="examples"
            className="ba-examples"
            variants={fadeThroughVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <p className="ba-examples-label" style={{ textAlign: 'center', marginBottom: 16 }}>Suggested questions</p>
            <motion.div className="ba-examples-grid" variants={staggerContainer} initial="initial" animate="animate">
              {BA_EXAMPLES.map((e) => (
                <motion.button 
                  key={e} 
                  variants={staggerItem}
                  className="ba-example-btn pressable" 
                  onClick={() => setQuestion(e)}
                >
                  <span style={{ position: 'relative', zIndex: 1 }}>{e}</span>
                  <Ripple color="rgba(255,255,255,0.05)" />
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}

        {loading && (
          <motion.div 
            key="loading"
            className="ba-columns"
            variants={fadeThroughVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="ba-col ba-col-bad">
              <div className="ba-col-header">
                <XCircle size={24} color="var(--error)" />
                <div>
                  <div className="ba-col-label ba-label-bad">Without Memory</div>
                  <div className="ba-col-sub">Generic AI</div>
                </div>
              </div>
              <div className="ba-loading-inner" style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                  <Loader2 size={32} color="var(--error)" />
                </motion.div>
              </div>
            </div>
            <div className="ba-col ba-col-good">
              <div className="ba-col-header">
                <CheckCircle2 size={24} color="var(--success)" />
                <div>
                  <div className="ba-col-label ba-label-good">With Memory</div>
                  <div className="ba-col-sub">Deal Intelligence Agent</div>
                </div>
              </div>
              <div className="ba-loading-inner" style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                  <Loader2 size={32} color="var(--success)" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {result && !loading && (
          <motion.div
            key="results"
            variants={fadeThroughVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="ba-question-row">
              <span className="ba-question-label">Question asked:</span>
              <span className="ba-question-text">"{result.question}"</span>
            </div>
            <div className="ba-columns">
              <div className="ba-col ba-col-bad">
                <div className="ba-col-header">
                  <XCircle size={24} color="var(--error)" />
                  <div>
                    <div className="ba-col-label ba-label-bad">Without Memory</div>
                    <div className="ba-col-sub">Generic AI — no context</div>
                  </div>
                </div>
                <div className="ba-text markdown-body">
                  <ReactMarkdown>{result.noMem.answer}</ReactMarkdown>
                </div>
              </div>
              <div className="ba-col ba-col-good">
                <div className="ba-col-header">
                  <CheckCircle2 size={24} color="var(--success)" />
                  <div>
                    <div className="ba-col-label ba-label-good">With Memory</div>
                    <div className="ba-col-sub">
                      {result.withMem.memoriesCount} memories recalled
                    </div>
                  </div>
                  <span className="ba-mem-badge" style={{ marginLeft: 'auto' }}>
                    {result.withMem.memoriesCount} recalled
                  </span>
                </div>
                <div className="ba-text markdown-body">
                  <ReactMarkdown>{result.withMem.answer}</ReactMarkdown>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="ba-input-area" style={{ marginTop: 40 }}>
        <AnimatePresence>
          {result && (
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="ba-reset-btn pressable"
              onClick={() => { setResult(null); setQuestion(""); }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}
            >
              <RefreshCcw size={14} /> Try another question
            </motion.button>
          )}
        </AnimatePresence>
        
        <div className="ba-input-row">
          <input
            className="ba-input"
            placeholder={`Ask anything about ${dealName}…`}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCompare()}
          />
          <button
            className="ba-submit-btn pressable"
            onClick={handleCompare}
            disabled={!question.trim() || loading}
          >
            Compare 
            <ArrowRight size={16} style={{ marginLeft: 6 }} />
            <Ripple />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
