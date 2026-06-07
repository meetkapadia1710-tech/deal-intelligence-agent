import React, { useState, useEffect } from "react";
import "../App.css";
import { apiGet } from "services/apiClient";
import Sidebar from "components/Sidebar";
import DashboardPanel from "features/dashboard/DashboardPanel";
import ActiveDealsPanel from "features/dashboard/ActiveDealsPanel";
import LandingPage from "features/landing/LandingPage";
import IntelligencePanel from "features/dashboard/IntelligencePanel";
import SettingsPanel from "features/dashboard/SettingsPanel";
import AnalyticsPanel from "features/analytics/AnalyticsPanel";
import ChatPanel from "features/chat/ChatPanel";
import DealDetailsPanel from "features/deals/DealDetailsPanel";
import { SignedIn, SignedOut, SignIn, useAuth } from "@clerk/clerk-react";
import { setGlobalAuthTokenFn } from "services/apiClient";
import { motion, AnimatePresence } from "framer-motion";
import { pageTransition } from "lib/motion";

export default function App() {
  const { getToken } = useAuth();
  
  useEffect(() => {
    setGlobalAuthTokenFn(() => getToken());
  }, [getToken]);

  const [tab, setTab] = useState("dashboard");
  const [messagesByDeal, setMessagesByDeal] = useState<Record<string, any[]>>({
    global: [{
      role: "agent",
      content: "Hello Alex! I'm your DealAI Agent. How can I help you analyze your pipeline today?"
    }]
  });
  const [activeDeal, setActiveDeal] = useState<any>(null);

  const currentDealId = activeDeal?.dealId || 'global';
  const currentMessages = messagesByDeal[currentDealId] || [];

  const handleSetMessages = (action: any) => {
    setMessagesByDeal(prev => {
      const prevMsgs = prev[currentDealId] || [];
      const updated = typeof action === 'function' ? action(prevMsgs) : action;
      return { ...prev, [currentDealId]: updated };
    });
  };

  return (
    <>
      <SignedOut>
        <LandingPage />
      </SignedOut>
      <SignedIn>
        <div className="app-container">
          {/* Left Sidebar */}
          <Sidebar activeNav={tab} onNavigate={(newTab) => {
            setTab(newTab);
            if (newTab !== "deal-details") setActiveDeal(null);
          }} />

      {/* Main Content Area */}
      <main className="main-content" style={{ flex: 1, backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <AnimatePresence mode="wait">
          {tab === "dashboard" && (
            <motion.div key="dashboard" {...pageTransition} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <DashboardPanel onFocusChat={setActiveDeal} onViewDetails={(deal: any) => { setActiveDeal(deal); setTab("deal-details"); }} />
            </motion.div>
          )}
          {tab === "active-deals" && (
            <motion.div key="active-deals" {...pageTransition} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <ActiveDealsPanel onViewDetails={(deal: any) => { setActiveDeal(deal); setTab("deal-details"); }} />
            </motion.div>
          )}
          {tab === "intelligence" && (
            <motion.div key="intelligence" {...pageTransition} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <IntelligencePanel />
            </motion.div>
          )}
          {tab === "deal-details" && (
            <motion.div key="deal-details" {...pageTransition} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <DealDetailsPanel deal={activeDeal} onBack={() => { setActiveDeal(null); setTab("active-deals"); }} />
            </motion.div>
          )}
          {tab === "settings" && (
            <motion.div key="settings" {...pageTransition} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <SettingsPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Right Sidebar - Chat */}
      <aside className="right-sidebar">
        <ChatPanel 
          messages={currentMessages} 
          setMessages={handleSetMessages} 
          activeDeal={activeDeal || {dealId: 'global', dealName: 'Global Dashboard'}} 
        />
      </aside>
    </div>
    </SignedIn>
    </>
  );
}
