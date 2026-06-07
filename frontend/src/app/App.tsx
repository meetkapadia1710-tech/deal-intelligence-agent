import React, { useState, useEffect } from "react";
import "../App.css";
import { apiGet } from "services/apiClient";
import Sidebar from "components/Sidebar";
import DashboardPanel from "features/dashboard/DashboardPanel";
import ActiveDealsPanel from "features/dashboard/ActiveDealsPanel";
import IntelligencePanel from "features/dashboard/IntelligencePanel";
import SettingsPanel from "features/dashboard/SettingsPanel";
import AnalyticsPanel from "features/analytics/AnalyticsPanel";
import ChatPanel from "features/chat/ChatPanel";
import DealDetailsPanel from "features/deals/DealDetailsPanel";
import { SignedIn, SignedOut, SignIn, useAuth } from "@clerk/clerk-react";
import { setGlobalAuthToken } from "services/apiClient";

export default function App() {
  const { getToken } = useAuth();
  
  useEffect(() => {
    getToken().then(token => setGlobalAuthToken(token));
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
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
          <SignIn routing="hash" />
        </div>
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
        {tab === "dashboard" && <DashboardPanel onFocusChat={setActiveDeal} onViewDetails={(deal: any) => { setActiveDeal(deal); setTab("deal-details"); }} />}
        {tab === "active-deals" && <ActiveDealsPanel onViewDetails={(deal: any) => { setActiveDeal(deal); setTab("deal-details"); }} />}
        {tab === "intelligence" && <IntelligencePanel />}
        {tab === "deal-details" && <DealDetailsPanel deal={activeDeal} onBack={() => { setActiveDeal(null); setTab("active-deals"); }} />}
        {tab === "settings" && <SettingsPanel />}
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
