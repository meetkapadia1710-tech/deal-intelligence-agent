import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Database, Sparkles, Menu } from "lucide-react";
import "../App.css";
import { apiGet, apiPost } from "services/apiClient";
import Sidebar from "components/Sidebar";
import ChatPanel from "features/chat/ChatPanel";
import BeforeAfterPanel from "features/chat/BeforeAfterPanel";
import TimelinePanel from "features/deals/TimelinePanel";
import ReflectPanel from "features/reflection/ReflectPanel";
import AnalyticsPanel from "features/analytics/AnalyticsPanel";
import NextActionPanel from "features/deals/NextActionPanel";
import LogModal from "components/LogModal";
import NewDealModal from "components/NewDealModal";
import { Ripple } from "components/ui/Ripple";
import { fadeThroughVariants, staggerContainer, staggerItem } from "constants/motion";

const TABS = [
  { key: "chat", label: "Chat" },
  { key: "before-after", label: "Before & After" },
  { key: "timeline", label: "Timeline" },
  { key: "reflect", label: "Reflect" },
  { key: "analytics", label: "Analytics" },
  { key: "next-action", label: "Next Action" },
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
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadDeals();
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    setTab("chat");
  }

  // Handle scrolling for top bar blur
  const handleScroll = (e: any) => {
    setScrolled(e.target.scrollTop > 10);
  };

  return (
    <div className="app-container">
      <Sidebar
        deals={deals}
        activeDeal={activeDeal}
        onSelectDeal={(d) => {
          handleSelectDeal(d);
          if (isMobile) setSidebarOpen(false);
        }}
        onNewDeal={() => {
          setShowNewDeal(true);
          if (isMobile) setSidebarOpen(false);
        }}
        isOpen={sidebarOpen || !isMobile}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="content-area">
        <AnimatePresence mode="wait">
          {!activeDeal ? (
            <motion.div 
              key="empty-state"
              className="empty-state"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
              style={{ flex: 1 }}
            >
              <motion.div variants={staggerItem} className="empty-icon-container glow">
                <Sparkles size={40} color="var(--accent-color)" />
              </motion.div>
              <motion.h1 variants={staggerItem} className="empty-title">Deal Intelligence Agent</motion.h1>
              <motion.p variants={staggerItem} className="empty-sub">
                AI-powered sales memory. Every call, every objection, every stakeholder — recalled instantly.
              </motion.p>
              <motion.div variants={staggerItem} className="empty-actions" style={{ display: 'flex', gap: 16 }}>
                <button
                  className="btn-primary pressable"
                  onClick={handleSeed}
                  disabled={seeding || seedDone}
                >
                  <Database size={18} />
                  {seedDone ? "Demo data loaded" : seeding ? "Seeding…" : "Load Demo Data"}
                  <Ripple />
                </button>
                <button className="btn-ghost pressable" onClick={() => setShowNewDeal(true)}>
                  Create a Deal
                  <Ripple color="rgba(255,255,255,0.1)" />
                </button>
              </motion.div>
              <motion.p variants={staggerItem} className="empty-hint" style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 16 }}>
                Demo data seeds 2 deals with realistic interactions, objections, and stakeholders.
              </motion.p>
            </motion.div>
          ) : (
            <motion.div 
              key="active-deal"
              style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <header className={`deal-header ${scrolled ? 'scrolled' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {isMobile && (
                    <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
                      <Menu size={20} color="var(--text-primary)" />
                    </button>
                  )}
                  <h1 className="deal-name">{activeDeal.dealName}</h1>
                  {!isMobile && (
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: 999, border: '1px solid var(--border)', fontFamily: 'var(--font-mono)' }}>
                      {activeDeal.dealId}
                    </span>
                  )}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                  <div className="tab-group">
                    {TABS.map((t) => {
                      const isActive = tab === t.key;
                      return (
                        <button
                          key={t.key}
                          className={`tab-btn pressable ${isActive ? "active" : ""}`}
                          onClick={() => setTab(t.key)}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="tab-indicator"
                              className="tab-indicator"
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                              style={{ left: 4, right: 4 }}
                            />
                          )}
                          <span style={{ position: 'relative', zIndex: 1 }}>{t.label}</span>
                          <Ripple color={isActive ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)"} />
                        </button>
                      );
                    })}
                  </div>
                  
                  <button className="btn-primary pressable" onClick={() => setShowLog(true)}>
                    <Plus size={18} />
                    {!isMobile && "Log Interaction"}
                    <Ripple />
                  </button>
                </div>
              </header>

              <div className="content-area">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    variants={fadeThroughVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                  >
                    {tab === "chat" && (
                      <ChatPanel
                        activeDeal={activeDeal}
                        messages={messages}
                        setMessages={setMessages}
                        onScroll={handleScroll}
                      />
                    )}
                    {tab === "before-after" && (
                      <div className="panel-container" onScroll={handleScroll}>
                        <BeforeAfterPanel dealId={activeDeal.dealId} dealName={activeDeal.dealName} />
                      </div>
                    )}
                    {tab === "timeline" && (
                      <div className="panel-container" onScroll={handleScroll}>
                        <TimelinePanel dealId={activeDeal.dealId} dealName={activeDeal.dealName} />
                      </div>
                    )}
                    {tab === "reflect" && (
                      <div className="panel-container" onScroll={handleScroll}>
                        <ReflectPanel dealId={activeDeal.dealId} dealName={activeDeal.dealName} />
                      </div>
                    )}
                    {tab === "analytics" && (
                      <div className="panel-container" onScroll={handleScroll}>
                        <AnalyticsPanel dealId={activeDeal.dealId} dealName={activeDeal.dealName} />
                      </div>
                    )}
                    {tab === "next-action" && (
                      <div className="panel-container" onScroll={handleScroll}>
                        <NextActionPanel dealId={activeDeal.dealId} dealName={activeDeal.dealName} />
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showLog && (
          <LogModal
            dealId={activeDeal.dealId}
            dealName={activeDeal.dealName}
            onClose={() => setShowLog(false)}
            onLogged={loadDeals}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showNewDeal && (
          <NewDealModal onClose={() => setShowNewDeal(false)} onCreate={handleNewDeal} />
        )}
      </AnimatePresence>
    </div>
  );
}
