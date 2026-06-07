import React, { useState } from "react";
import { apiPost } from "../api/apiClient";

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
    <div className="ba-panel">
      <div className="ba-intro">
        <p className="ba-intro-title">Before & After Memory</p>
        <p className="ba-intro-sub">
          Ask a question. See the difference between a generic AI and an AI armed with complete deal history.
        </p>
      </div>

      {!result && !loading && (
        <div className="ba-examples">
          <p className="ba-examples-label">Suggested questions</p>
          <div className="ba-examples-grid">
            {BA_EXAMPLES.map((e) => (
              <button key={e} className="ba-example-btn" onClick={() => setQuestion(e)}>
                {e}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="ba-columns">
          <div className="ba-col ba-col-bad">
            <div className="ba-col-header">
              <span className="ba-icon-x">✗</span>
              <div>
                <div className="ba-col-label ba-label-bad">Without Memory</div>
                <div className="ba-col-sub">Generic AI</div>
              </div>
            </div>
            <div className="ba-loading-inner">
              <span className="dot" /><span className="dot" /><span className="dot" />
            </div>
          </div>
          <div className="ba-col ba-col-good">
            <div className="ba-col-header">
              <span className="ba-icon-check">✓</span>
              <div>
                <div className="ba-col-label ba-label-good">With Memory</div>
                <div className="ba-col-sub">Deal Intelligence Agent</div>
              </div>
            </div>
            <div className="ba-loading-inner">
              <span className="dot" /><span className="dot" /><span className="dot" />
            </div>
          </div>
        </div>
      )}

      {result && !loading && (
        <>
          <div className="ba-question-row">
            <span className="ba-question-label">Question asked:</span>
            <span className="ba-question-text">"{result.question}"</span>
          </div>
          <div className="ba-columns">
            <div className="ba-col ba-col-bad">
              <div className="ba-col-header">
                <span className="ba-icon-x">✗</span>
                <div>
                  <div className="ba-col-label ba-label-bad">Without Memory</div>
                  <div className="ba-col-sub">Generic AI — no deal context</div>
                </div>
              </div>
              <pre className="ba-text">{result.noMem.answer}</pre>
            </div>
            <div className="ba-col ba-col-good">
              <div className="ba-col-header">
                <span className="ba-icon-check">✓</span>
                <div>
                  <div className="ba-col-label ba-label-good">With Memory</div>
                  <div className="ba-col-sub">
                    {result.withMem.memoriesCount} memories recalled · {dealName}
                  </div>
                </div>
                <span className="ba-mem-badge">{result.withMem.memoriesCount} recalled</span>
              </div>
              <pre className="ba-text">{result.withMem.answer}</pre>
            </div>
          </div>
        </>
      )}

      <div className="ba-input-area">
        {result && (
          <button
            className="ba-reset-btn"
            onClick={() => { setResult(null); setQuestion(""); }}
          >
            ← Try another question
          </button>
        )}
        <div className="ba-input-row">
          <input
            className="ba-input"
            placeholder={`Ask anything about ${dealName}…`}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCompare()}
          />
          <button
            className="ba-submit-btn"
            onClick={handleCompare}
            disabled={!question.trim() || loading}
          >
            Compare 
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: "6px"}}>
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
