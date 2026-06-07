import React, { useState, useEffect } from "react";
import "./App.css";
import { apiGet, apiPost } from "./api/apiClient";
import Sidebar from "./components/Sidebar";
import ChatPanel from "./components/ChatPanel";
import BeforeAfterPanel from "./components/BeforeAfterPanel";
import TimelinePanel from "./components/TimelinePanel";
import ReflectPanel from "./components/ReflectPanel";
import LogModal from "./components/LogModal";
import NewDealModal from "./components/NewDealModal";

const TABS = [
  { key: "chat", label: "Chat" },
  { key: "before-after", label: "Before & After" },
  { key: "timeline", label: "Timeline" },
  { key: "reflect", label: "Reflect" },
];

export default function App() {
  const [deals, setDeals] = useState([]);
  const [activeDeal, setActiveDeal] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showLog, setShowLog] = useState(false);
  const [showNewDeal, setShowNewDeal] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedDone, setSeedDone] = useState(false);
  const [tab, setTab] = useState("chat");

  useEffect(() => { loadDeals(); }, []);

  async function loadDeals() {
    const res = await apiGet("/deals");
    setDeals(res.deals || []);
  }

  async function handleSeed() {
    setSeeding(true);
    await apiPost("/seed", {});
    setSeeding(false);
    setSeedDone(true);
    await loadDeals();
    setTimeout(() => setSeedDone(false), 3000);
  }

  function handleSelectDeal(deal) {
    setActiveDeal(deal);
    setMessages([{
      role: "agent",
      content: `Deal loaded: ${deal.dealName}\n\nI have full memory of every interaction. Ask anything in Chat — or go to Before & After to see the difference memory makes.`,
      memoryUsed: false,
      memoriesCount: 0,
    }]);
    setTab("chat");
  }

  function handleNewDeal(deal) {
    setDeals((prev) => [...prev, deal]);
    setActiveDeal(deal);
    setMessages([{
      role: "agent",
      content: `New deal created: ${deal.dealName}\n\nNo interactions yet. Click "+ Log Interaction" to start building memory for this deal.`,
      memoryUsed: false,
      memoriesCount: 0,
    }]);
  }

  return (
    <div className="app">
      <Sidebar
        deals={deals}
        activeDeal={activeDeal}
        onSelectDeal={handleSelectDeal}
        onNewDeal={() => setShowNewDeal(true)}
      />

      <main className="main">
        {!activeDeal ? (
          <div className="empty-state">
            <div className="empty-icon-container glow">
              <span className="empty-icon">◈</span>
            </div>
            <h1 className="empty-title">Deal Intelligence Agent</h1>
            <p className="empty-sub">
              AI-powered sales memory. Every call, every objection, every stakeholder — recalled instantly.
            </p>
            <div className="empty-actions">
              <button
                className={`btn-primary btn-lg ${seedDone ? "btn-success" : ""}`}
                onClick={handleSeed}
                disabled={seeding || seedDone}
              >
                {seedDone ? "✓ Demo data loaded" : seeding ? "Seeding…" : "Load Demo Data"}
              </button>
              <button className="btn-ghost btn-lg" onClick={() => setShowNewDeal(true)}>
                Create a Deal
              </button>
            </div>
            <p className="empty-hint">
              Demo data seeds 2 deals with realistic interactions, objections, and stakeholders.
            </p>
          </div>
        ) : (
          <>
            <header className="deal-header">
              <div className="deal-header-left">
                <h1 className="deal-name">{activeDeal.dealName}</h1>
                <span className="deal-id-badge">{activeDeal.dealId}</span>
              </div>
              <div className="deal-header-right">
                <div className="tab-group">
                  {TABS.map((t) => (
                    <button
                      key={t.key}
                      className={`tab-btn ${tab === t.key ? "active" : ""}`}
                      onClick={() => setTab(t.key)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <button className="btn-primary" onClick={() => setShowLog(true)}>
                  <span className="btn-icon">+</span> Log Interaction
                </button>
              </div>
            </header>

            <div className="content-area">
              {tab === "chat" && (
                <ChatPanel
                  activeDeal={activeDeal}
                  messages={messages}
                  setMessages={setMessages}
                />
              )}
              {tab === "before-after" && (
                <div className="panel-container">
                  <BeforeAfterPanel dealId={activeDeal.dealId} dealName={activeDeal.dealName} />
                </div>
              )}
              {tab === "timeline" && (
                <div className="panel-container">
                  <TimelinePanel dealId={activeDeal.dealId} dealName={activeDeal.dealName} />
                </div>
              )}
              {tab === "reflect" && (
                <div className="panel-container">
                  <ReflectPanel dealId={activeDeal.dealId} dealName={activeDeal.dealName} />
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {showLog && (
        <LogModal
          dealId={activeDeal.dealId}
          dealName={activeDeal.dealName}
          onClose={() => setShowLog(false)}
          onLogged={loadDeals}
        />
      )}
      {showNewDeal && (
        <NewDealModal onClose={() => setShowNewDeal(false)} onCreate={handleNewDeal} />
      )}
    </div>
  );
}
