import React, { useState } from "react";
import { LayoutDashboard, Clock, Lightbulb, BarChart2, Settings, ChevronDown, BarChart } from "lucide-react";
import { Ripple } from "components/ui/Ripple";
import { UserButton } from "@clerk/clerk-react";
import { motion } from "framer-motion";

export default function Sidebar({ activeNav = "dashboard", onNavigate, onLogout }: any) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { id: "active-deals", label: "Active Deals", icon: <Clock size={18} /> },
    { id: "intelligence", label: "Intelligence", icon: <Lightbulb size={18} /> },
  ];

  return (
    <aside className="sidebar" style={{ backgroundColor: '#0f172a', padding: '24px 20px', display: 'flex', flexDirection: 'column', color: '#f8fafc', width: 260, borderRight: '1px solid #1e293b' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40, padding: '0 8px' }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BarChart size={18} color="#fff" />
        </div>
        <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.5px' }}>DealAI Agent</span>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8, padding: '0 8px' }}>Menu</div>
        {navItems.map(item => {
          const isActive = activeNav === item.id;
          return (
            <motion.button
              key={item.id}
              className="pressable"
              onClick={() => onNavigate?.(item.id)}
              onMouseEnter={() => setHoveredNav(item.id)}
              onMouseLeave={() => setHoveredNav(null)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                background: 'transparent',
                border: 'none', color: isActive ? '#fff' : '#94a3b8', fontSize: 14, fontWeight: 500,
                cursor: 'pointer', textAlign: 'left', position: 'relative', outline: 'none'
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  style={{ position: 'absolute', inset: 0, background: 'rgba(59, 130, 246, 0.15)', borderRadius: 8, zIndex: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              {isActive && (
                <motion.div
                  layoutId="activeNavBorder"
                  style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 3, background: '#3b82f6', borderRadius: '0 4px 4px 0', zIndex: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ color: isActive ? '#3b82f6' : 'inherit' }}>{item.icon}</span>
                {item.label}
              </div>
            </motion.button>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid #1e293b' }}>
        <div style={{ padding: '12px', margin: '0 -12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
          <UserButton afterSignOutUrl="/" />
          <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Profile</span>
        </div>
      </div>
    </aside>
  );
}

