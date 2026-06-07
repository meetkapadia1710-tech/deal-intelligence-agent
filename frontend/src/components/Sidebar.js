import React from "react";

export default function Sidebar({ deals, activeDeal, onSelectDeal, onNewDeal }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon-container">
            <span className="logo-icon">◈</span>
          </div>
          <span className="logo-text">Deal Intel</span>
        </div>
        <p className="logo-sub">AI Sales Memory</p>
      </div>
      <div className="sidebar-section">
        <p className="sidebar-label">Active Deals</p>
        {deals.length === 0 && (
          <p className="sidebar-empty">No deals yet — seed demo data to start</p>
        )}
        <div className="deal-list">
          {deals.map((d) => (
            <button
              key={d.dealId}
              className={`deal-btn ${activeDeal?.dealId === d.dealId ? "active" : ""}`}
              onClick={() => onSelectDeal(d)}
            >
              <div className="deal-btn-indicator" />
              <span className="deal-btn-name">{d.dealName}</span>
            </button>
          ))}
        </div>
        <button className="new-deal-btn" onClick={onNewDeal}>
          <span className="new-deal-icon">+</span>
          New Deal
        </button>
      </div>
      <div className="sidebar-footer">
        <div className="powered-badge">
          <div className="powered-icon"></div>
          <p className="powered">Powered by Hindsight + Groq</p>
        </div>
      </div>
    </aside>
  );
}
