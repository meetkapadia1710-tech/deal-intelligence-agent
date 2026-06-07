import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import { apiPost } from "services/apiClient";
import { chatMsgUserVariants, chatMsgAgentVariants } from "constants/motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function ChatMessage({ msg }) {
  const isUser = msg.role === "user";
  const variants = isUser ? chatMsgUserVariants : chatMsgAgentVariants;

  return (
    <motion.div 
      className={`msg ${isUser ? "msg-user" : "msg-agent"}`}
      variants={variants}
      initial="initial"
      animate="animate"
      layout
    >
      <div className="msg-meta">
        <span className="msg-role" style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
          {isUser ? "Rep" : "Agent"}
        </span>
        {!isUser && msg.memoriesCount !== undefined && (
          <span style={{
            fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 999,
            background: msg.memoriesCount > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.05)',
            color: msg.memoriesCount > 0 ? 'var(--success)' : 'var(--text-muted)'
          }}>
            {msg.memoriesCount > 0 ? `${msg.memoriesCount} memories recalled` : "no prior context"}
          </span>
        )}
      </div>
      <div className="msg-bubble">
        <div className="msg-text markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
}

export default function ChatPanel({ activeDeal, messages, setMessages, onScroll }) {
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
    <div className="chat-container">
      <div className="messages-list" onScroll={onScroll}>
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <ChatMessage key={i} msg={m} />
          ))}
          {loading && (
            <motion.div 
              key="loading-indicator"
              className="msg msg-agent"
              variants={chatMsgAgentVariants}
              initial="initial"
              animate="animate"
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="msg-meta">
                <span className="msg-role" style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Agent</span>
              </div>
              <div className="msg-bubble intelligence-indicator">
                <div className="ai-core">
                  <motion.div 
                    className="ai-orbit"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  />
                  <motion.div 
                    className="ai-orbit"
                    style={{ borderStyle: 'dotted', right: -12, top: -12, left: -12, bottom: -12 }}
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  />
                </div>
                <motion.span 
                  className="ai-thinking-text"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                  Analyzing memory space...
                </motion.span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      <div className="input-area">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', zIndex: 1 }}>
          {quickPrompts.map((p, i) => (
            <motion.button 
              key={p} 
              className="btn-ghost" 
              style={{ padding: '6px 14px', fontSize: 12 }}
              onClick={() => setInput(p)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              {p}
            </motion.button>
          ))}
        </div>
        <div className="input-row">
          <Sparkles size={18} color="var(--accent-color)" />
          <input
            className="chat-input"
            placeholder={`Ask about ${activeDeal.dealName}…`}
            value={input}
            onChange={(e: any) => setInput(e.target.value)}
            onKeyDown={(e: any) => e.key === "Enter" && !e.shiftKey && handleSend()}
          />
          <button
            className="send-btn"
            onClick={handleSend}
            disabled={loading || !input.trim()}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
