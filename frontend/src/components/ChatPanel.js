import React, { useState, useRef, useEffect } from "react";
import { apiPost } from "../api/apiClient";

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

export default function ChatPanel({ activeDeal, messages, setMessages }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend() {
    if (!input.trim() || !activeDeal || loading) return;
    const question = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setLoading(true);

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

  const quickPrompts = [
    "What did the CFO say about pricing?",
    "Draft a follow-up email",
    "Prepare me for the next call",
    "Who are the key decision makers?",
  ];

  return (
    <div className="chat-area">
      <div className="messages">
        {messages.map((m, i) => (
          <ChatMessage key={i} msg={m} />
        ))}
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
        <div className="quick-prompts">
          {quickPrompts.map((p) => (
            <button key={p} className="quick-btn" onClick={() => setInput(p)}>
              {p}
            </button>
          ))}
        </div>
        <div className="input-row">
          <input
            className="chat-input"
            placeholder={`Ask about ${activeDeal.dealName}…`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          />
          <button
            className="send-btn"
            onClick={handleSend}
            disabled={loading || !input.trim()}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5"></line>
              <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
