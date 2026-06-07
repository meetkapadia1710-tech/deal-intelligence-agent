import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MoreHorizontal } from "lucide-react";
import { apiPost } from "services/apiClient";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function ChatMessage({ msg }) {
  const isUser = msg.role === "user";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: isUser ? 'flex-start' : 'flex-start' }}>
      <span className="rs-msg-name">{isUser ? "Alex" : "Agent"}</span>
      <div className={`rs-bubble ${isUser ? 'rs-bubble-user' : 'rs-bubble-agent'}`}>
        <div className="markdown-body" style={{ fontSize: 13, lineHeight: 1.4 }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export default function ChatPanel({ messages, setMessages, activeDeal }: any) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend(queryOverride?: string) {
    const question = typeof queryOverride === 'string' ? queryOverride : input.trim();
    if (!question || loading) return;
    
    if (typeof queryOverride !== 'string') {
      setInput("");
    }

    setMessages((prev: any[]) => [...prev, { role: "user", content: question }]);
    setLoading(true);

    const dealIdToUse = activeDeal ? activeDeal.dealId : "global";
    const dealNameToUse = activeDeal ? activeDeal.dealName : "Global Dashboard";

    const res = await apiPost("/chat", {
      dealId: dealIdToUse,
      dealName: dealNameToUse,
      question,
    });
    setLoading(false);
    setMessages((prev: any[]) => [
      ...prev,
      {
        role: "agent",
        content: res.answer || res.error || "Something went wrong.",
      },
    ]);
  }

  const [showChatMenu, setShowChatMenu] = useState(false);

  const suggestions = activeDeal && activeDeal.dealId !== 'global'
    ? [
        `Summarize recent interactions for ${activeDeal.dealName}`,
        `Draft a follow-up email for ${activeDeal.dealName}`,
        `What are the main objections for ${activeDeal.dealName}?`
      ]
    : [
        "Summarize recent objections across all deals",
        "Which deals are at high risk?",
        "What is our total pipeline value?"
      ];

  return (
    <>
      <div className="rs-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="rs-title">AI Agent Chat</span>
        <div style={{ position: 'relative' }}>
          <MoreHorizontal size={20} color="#64748b" style={{cursor: 'pointer'}} onClick={() => setShowChatMenu(!showChatMenu)} />
          {showChatMenu && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              marginTop: 4,
              padding: 8,
              zIndex: 10,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              minWidth: 150
            }}>
              <button 
                style={{ width: '100%', textAlign: 'left', padding: '8px 12px', background: 'none', border: 'none', color: '#0f172a', fontSize: 13, borderRadius: 4, cursor: 'pointer' }}
                onMouseEnter={(e: any) => e.target.style.background = '#f1f5f9'}
                onMouseLeave={(e: any) => e.target.style.background = 'none'}
                onClick={() => { setMessages([]); setShowChatMenu(false); }}
              >
                Clear Chat
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="rs-messages">
        {messages.length === 0 && (
          <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 13, color: '#64748b', textAlign: 'center', marginBottom: 8 }}>
              Ask anything about your deals, or try:
            </div>
            {suggestions.map((q, i) => (
              <button 
                key={i}
                onClick={() => handleSend(q)}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  padding: '10px 14px',
                  borderRadius: 8,
                  fontSize: 13,
                  color: '#3b82f6',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontWeight: 500
                }}
                onMouseEnter={(e: any) => { e.target.style.background = '#eff6ff'; e.target.style.borderColor = '#bfdbfe'; }}
                onMouseLeave={(e: any) => { e.target.style.background = '#f8fafc'; e.target.style.borderColor = '#e2e8f0'; }}
              >
                {q}
              </button>
            ))}
          </div>
        )}
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <ChatMessage key={i} msg={m} />
          ))}
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span className="rs-msg-name">Agent</span>
              <div className="rs-bubble rs-bubble-agent" style={{ opacity: 0.8 }}>
                Thinking...
              </div>
            </div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      <div className="rs-input-area">
        <div className="rs-input-box">
          <input
            placeholder="Ask the AI Agent..."
            value={input}
            onChange={(e: any) => setInput(e.target.value)}
            onKeyDown={(e: any) => e.key === "Enter" && !e.shiftKey && handleSend()}
          />
          <button className="rs-input-btn" onClick={() => handleSend()} disabled={loading || !input.trim()}>
            <Send size={16} />
          </button>
        </div>
      </div>
    </>
  );
}

