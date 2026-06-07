import React from "react";
import { Settings, User, Bell, Shield } from "lucide-react";

export default function SettingsPanel() {
  return (
    <div style={{ padding: '32px 48px' }}>
      <h1 className="dashboard-title" style={{ marginBottom: 32 }}>Settings</h1>
      
      <div style={{ display: 'grid', gap: 24, maxWidth: 800 }}>
        <div style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <User size={20} color="#64748b" />
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#0f172a' }}>Profile</h3>
          </div>
          <p style={{ color: '#475569', fontSize: 14 }}>Alex Chen (alex.chen@example.com)</p>
          <button className="feed-btn feed-btn-outline" style={{ marginTop: 16 }}>Edit Profile</button>
        </div>

        <div style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <Bell size={20} color="#64748b" />
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#0f172a' }}>Notifications</h3>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: '#475569' }}>
            <input type="checkbox" defaultChecked /> Receive email alerts for high risk deals
          </label>
        </div>

        <div style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <Shield size={20} color="#64748b" />
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#0f172a' }}>Security</h3>
          </div>
          <p style={{ color: '#475569', fontSize: 14 }}>Manage API keys and access tokens for the Deal Intelligence Agent.</p>
          <button className="feed-btn feed-btn-outline" style={{ marginTop: 16 }}>Manage Keys</button>
        </div>
      </div>
    </div>
  );
}
