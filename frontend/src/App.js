import React, { useState, useRef, useEffect } from "react";
import "./App.css";

const API = "";

async function apiPost(path, body) {
  const r = await fetch(`${API}/api${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return r.json();
}

async function apiGet(path) {
  const r = await fetch(`${API}/api${path}`);
  return r.json();
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

function Sidebar({ deals, activeDeal, onSelectDeal, onNewDeal }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">◈</span>
          <span className="logo-text">Deal Intel</span>
        </div>
        <p className="logo-sub">AI Sales Memory</p>
      </div>
      <div className="sidebar-section">
        <p className="sidebar-label">Active Deals</p>
        {deals.length === 0 && (
          <p className="sidebar-empty">No deals yet — seed demo data to start</p>
        )}
        {deals.map((d) => (
          <button
            key={d.dealId}
            className={`deal-btn ${activeDeal?.dealId === d.dealId ? "active" : ""}`}
            onClick={() => onSelectDeal(d)}
          >
            <span className="deal-dot" />
            <span className="deal-btn-name">{d.dealName}</span>
          </button>
        ))}
        <button className="new-deal-btn" onClick={onNewDeal}>+ New Deal</button>
      </div>
      <div className="sidebar-footer">
        <p className="powered">Powered by Hindsight + Groq</p>
      </div>
    </aside>
  );
}

// ── Chat Message ──────────────────────────────────────────────────────────────

function ChatMessage({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`msg ${isUser ? "msg-user" : "msg-agent"}`}>
      <div className="msg-meta">
        <span className="msg-role">{isUser ? "Rep" : "Agent"}</span>
        {!isUser && msg.memoriesCount !== undefined && (
          <span className={`msg-badge ${msg.memoriesCount > 0 ? "badge-mem" : "badge-nomem"}`}>
            {msg.memoriesCount > 0 ? `${msg.memoriesCount} memories recalled` : "no prior context"}
          </span>
        )}
      </div>
      <div className="msg-bubble">
        <pre className="msg-text">{msg.content}</pre>
      </div>
    </div>
  );
}

// ── Compare Message ───────────────────────────────────────────────────────────

function CompareMessage({ msg }) {
  if (msg.role === "user") {
    return (
      <div className="msg msg-user">
        <div className="msg-meta"><span className="msg-role">Rep</span></div>
        <div className="msg-bubble"><pre className="msg-text">{msg.content}</pre></div>
      </div>
    );
  }
  return (
    <div className="compare-msg">
      <div className="compare-col compare-col-bad">
        <div className="compare-col-header">
          <span className="compare-icon-x">✗</span>
          <span className="compare-label-bad">Without Memory</span>
          <span className="compare-sub">Generic AI</span>
        </div>
        <pre className="compare-text">{msg.noMemory}</pre>
      </div>
      <div className="compare-col compare-col-good">
        <div className="compare-col-header">
          <span className="compare-icon-check">✓</span>
          <span className="compare-label-good">With Memory</span>
          <span className="compare-badge">{msg.memoriesCount} memories recalled</span>
        </div>
        <pre className="compare-text">{msg.withMemory}</pre>
      </div>
    </div>
  );
}

// ── Timeline Panel ────────────────────────────────────────────────────────────

function TimelinePanel({ dealId, dealName }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiGet(`/timeline/${dealId}`)
      .then((r) => setEntries(r.entries || []))
      .finally(() => setLoading(false));
  }, [dealId]);

  if (loading) {
    return (
      <div className="timeline-status">
        <span className="spinner" /> Loading deal diary…
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="timeline-status">
        No interactions stored yet. Log some interactions first.
      </div>
    );
  }

  return (
    <div className="timeline-panel">
      <div className="timeline-header">
        <span className="timeline-title">Deal Diary — {dealName}</span>
        <span className="timeline-count">{entries.length} memories stored</span>
      </div>
      <div className="timeline-list">
        {entries.map((entry, i) => (
          <div key={entry.id || i} className="timeline-item">
            <div className="timeline-spine">
              <div className="timeline-dot" />
              {i < entries.length - 1 && <div className="timeline-line" />}
            </div>
            <div className="timeline-content">
              <div className="timeline-meta">
                <span className={`timeline-type type-${entry.type || "world"}`}>
                  {entry.type || "world fact"}
                </span>
                {entry.mentioned_at && (
                  <span className="timeline-date">
                    {new Date(entry.mentioned_at).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
                  </span>
                )}
              </div>
              <pre className="timeline-text">{entry.text}</pre>
              {entry.entities?.length > 0 && (
                <div className="timeline-entities">
                  {entry.entities.map((e) => (
                    <span key={e} className="entity-tag">{e}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Reflect Panel ─────────────────────────────────────────────────────────────

function ReflectPanel({ dealId, dealName }) {
  const [reflection, setReflection] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeBtn, setActiveBtn] = useState(null);

  async function runReflect(promptType) {
    setLoading(true);
    setActiveBtn(promptType);
    setReflection("");
    const prompts = {
      summary: `For the deal "${dealName}", provide: 1) Top objections raised and by whom, 2) All stakeholders and their roles/concerns, 3) Current deal status and risks, 4) Recommended next 3 actions`,
      objections: `What are the top recurring objections raised in the "${dealName}" deal? Who raised them and how many times? What's the best counter-argument for each?`,
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
      <p className="reflect-title">Memory Analysis — Hindsight Reflect</p>
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
          <span className="spinner" /> Hindsight is analyzing deal memory…
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

// ── Log Modal ─────────────────────────────────────────────────────────────────

function LogModal({ dealId, dealName, onClose, onLogged }) {
  const [note, setNote] = useState("");
  const [stakeholder, setStakeholder] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit() {
    if (!note.trim()) return;
    setLoading(true);
    const res = await apiPost("/interactions", { dealId, dealName, note, stakeholder });
    setLoading(false);
    if (res.success) {
      setDone(true);
      setTimeout(() => { onLogged(); onClose(); }, 900);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Log Interaction</h2>
          <p className="modal-sub">{dealName}</p>
        </div>
        <label className="field-label">Stakeholder (optional)</label>
        <input
          className="field-input"
          placeholder="e.g. Priya Sharma (CFO)"
          value={stakeholder}
          onChange={(e) => setStakeholder(e.target.value)}
        />
        <label className="field-label">Interaction Note</label>
        <textarea
          className="field-textarea"
          placeholder="e.g. Call with Priya. She raised concerns about implementation timeline and asked for a 20% discount..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={5}
        />
        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className={`btn-primary ${done ? "btn-success" : ""}`}
            onClick={handleSubmit}
            disabled={loading || done}
          >
            {done ? "✓ Stored in memory" : loading ? "Storing…" : "Store in Memory"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── New Deal Modal ────────────────────────────────────────────────────────────

function NewDealModal({ onClose, onCreate }) {
  const [dealName, setDealName] = useState("");
  const [dealId, setDealId] = useState("");

  function handleCreate() {
    if (!dealName.trim()) return;
    const id = dealId.trim() || dealName.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now().toString(36);
    onCreate({ dealId: id, dealName: dealName.trim() });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header"><h2 className="modal-title">New Deal</h2></div>
        <label className="field-label">Company / Deal Name</label>
        <input
          className="field-input"
          placeholder="e.g. Acme Corp"
          value={dealName}
          onChange={(e) => setDealName(e.target.value)}
          autoFocus
        />
        <label className="field-label">Deal ID (optional)</label>
        <input
          className="field-input"
          placeholder="Auto-generated if blank"
          value={dealId}
          onChange={(e) => setDealId(e.target.value)}
        />
        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleCreate} disabled={!dealName.trim()}>
            Create Deal
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────

export default function App() {
  const [deals, setDeals] = useState([]);
  const [activeDeal, setActiveDeal] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [showNewDeal, setShowNewDeal] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedDone, setSeedDone] = useState(false);
  const [tab, setTab] = useState("chat");
  const [compareMode, setCompareMode] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { loadDeals(); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

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

  async function handleSend() {
    if (!input.trim() || !activeDeal || loading) return;
    const question = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setLoading(true);

    if (compareMode) {
      const res = await apiPost("/compare", {
        dealId: activeDeal.dealId,
        dealName: activeDeal.dealName,
        question,
      });
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "compare",
          noMemory: res.noMemory || res.error,
          withMemory: res.withMemory || res.error,
          memoriesCount: res.memoriesCount || 0,
        },
      ]);
    } else {
      const res = await apiPost("/chat", {
        dealId: activeDeal.dealId,
        dealName: activeDeal.dealName,
        question,
      });
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          content: res.answer || res.error || "Something went wrong.",
          memoryUsed: res.memoryUsed,
          memoriesCount: res.memoriesCount,
        },
      ]);
    }
  }

  function handleSelectDeal(deal) {
    setActiveDeal(deal);
    setMessages([{
      role: "agent",
      content: `Deal loaded: ${deal.dealName}\n\nI have full memory of every interaction. Ask anything — or enable ⚡ Compare Mode to show judges the difference memory makes.`,
      memoryUsed: false,
      memoriesCount: 0,
    }]);
    setTab("chat");
    setCompareMode(false);
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

  const quickPrompts = [
    "What did the CFO say about pricing?",
    "Draft a follow-up email",
    "Prepare me for the next call",
    "Who are the key decision makers?",
  ];

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
            <div className="empty-icon">◈</div>
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
              Demo data includes 2 deals (Acme Corp + Globex Industries) with realistic interactions, objections, and stakeholders.
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
                  {[
                    { key: "chat", label: "Chat" },
                    { key: "timeline", label: "Timeline" },
                    { key: "reflect", label: "Reflect" },
                  ].map((t) => (
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
                  + Log Interaction
                </button>
              </div>
            </header>

            {tab === "chat" && (
              <div className="chat-area">
                <div className="messages">
                  {messages.map((m, i) =>
                    m.role === "compare"
                      ? <CompareMessage key={i} msg={m} />
                      : <ChatMessage key={i} msg={m} />
                  )}
                  {loading && (
                    <div className="msg msg-agent">
                      <div className="msg-meta"><span className="msg-role">Agent</span></div>
                      <div className="msg-bubble msg-loading">
                        <span className="dot" /><span className="dot" /><span className="dot" />
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                <div className="input-bar">
                  <div className="input-bar-top">
                    <div className="quick-prompts">
                      {quickPrompts.map((p) => (
                        <button key={p} className="quick-btn" onClick={() => setInput(p)}>{p}</button>
                      ))}
                    </div>
                    <button
                      className={`compare-toggle ${compareMode ? "compare-toggle-on" : ""}`}
                      onClick={() => setCompareMode(!compareMode)}
                      title="Show side-by-side: Generic AI vs Deal Intelligence Agent"
                    >
                      ⚡ {compareMode ? "Compare ON" : "Compare"}
                    </button>
                  </div>
                  {compareMode && (
                    <div className="compare-hint">
                      Compare mode: each answer shows Generic AI (no memory) vs Deal Intel Agent (with memory)
                    </div>
                  )}
                  <div className="input-row">
                    <input
                      className={`chat-input ${compareMode ? "chat-input-compare" : ""}`}
                      placeholder={
                        compareMode
                          ? `Ask to compare — e.g. "What did the CFO say about pricing?"`
                          : `Ask about ${activeDeal.dealName}…`
                      }
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                    />
                    <button
                      className="send-btn"
                      onClick={handleSend}
                      disabled={loading || !input.trim()}
                    >
                      ↑
                    </button>
                  </div>
                </div>
              </div>
            )}

            {tab === "timeline" && (
              <div className="reflect-area">
                <TimelinePanel dealId={activeDeal.dealId} dealName={activeDeal.dealName} />
              </div>
            )}

            {tab === "reflect" && (
              <div className="reflect-area">
                <ReflectPanel dealId={activeDeal.dealId} dealName={activeDeal.dealName} />
              </div>
            )}
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
