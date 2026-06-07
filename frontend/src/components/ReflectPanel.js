import React, { useState } from "react";
import { apiPost } from "../api/apiClient";

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
    { key: "summary", label: "Deal Summary", icon: "◎" },
    { key: "objections", label: "Objection Patterns", icon: "⚠" },
    { key: "stakeholders", label: "Stakeholder Map", icon: "◑" },
    { key: "nextSteps", label: "Next Steps", icon: "→" },
  ];

  return (
    <div className="reflect-panel">
      <div className="reflect-header">
        <div className="reflect-icon-container">
          <span className="reflect-header-icon">✨</span>
        </div>
        <div>
          <p className="reflect-title">Memory Analysis</p>
          <p className="reflect-subtitle">Powered by Hindsight Reflect</p>
        </div>
      </div>
      
      <div className="reflect-btns">
        {buttons.map((b) => (
          <button
            key={b.key}
            className={`reflect-btn ${activeBtn === b.key ? "reflect-btn-active" : ""}`}
            onClick={() => runReflect(b.key)}
            disabled={loading}
          >
            <span className="reflect-btn-icon">{b.icon}</span>
            {b.label}
          </button>
        ))}
      </div>
      
      {loading && (
        <div className="reflect-loading">
          <div className="loading-spinner"></div>
          <span>Hindsight is analyzing the entire deal memory...</span>
        </div>
      )}
      
      {reflection && !loading && (
        <div className="reflect-result">
          <pre className="reflect-text">{reflection}</pre>
        </div>
      )}
    </div>
  );
}
