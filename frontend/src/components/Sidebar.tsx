import React, { useState } from "react";
import { LayoutDashboard, Clock, Lightbulb, BarChart2, Settings, ChevronDown, BarChart } from "lucide-react";
import { Ripple } from "components/ui/Ripple";
import { UserButton } from "@clerk/clerk-react";

export default function Sidebar({ activeNav = "dashboard", onNavigate, onLogout }: any) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { id: "active-deals", label: "Active Deals", icon: <Clock size={18} /> },
    { id: "intelligence", label: "Intelligence", icon: <Lightbulb size={18} /> },
    { id: "settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <aside className="sidebar open" style={{ width: 240, flexShrink: 0, borderRight: 'none', background: '#1e293b', zIndex: 1 }}>
      <div className="sidebar-header" style={{ marginBottom: 32 }}>
        <div className="logo" style={{ marginBottom: 24 }}>
          <div className="logo-icon-container" style={{ background: 'transparent', boxShadow: 'none' }}>
            <BarChart size={24} color="#3b82f6" />
          </div>
          <div className="logo-text-group">
            <span className="logo-text" style={{ color: '#fff', fontSize: 20 }}>Deal<span style={{color: '#3b82f6'}}>AI</span> Agent</span>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <div style={{ padding: '12px', margin: '0 -12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
            <UserButton afterSignOutUrl="/" />
            <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Profile</span>
          </div>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="deal-list" style={{ gap: 8 }}>
          {navItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <div key={item.id} className="deal-btn-wrapper pressable">
                <button
                  className={`deal-btn ${isActive ? "active" : ""}`}
                  onClick={() => onNavigate?.(item.id)}
                  style={isActive ? { background: '#3b82f6', color: '#fff' } : {}}
                >
                  <span className="deal-btn-icon">{item.icon}</span>
                  <span className="deal-btn-name">{item.label}</span>
                  <Ripple />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

