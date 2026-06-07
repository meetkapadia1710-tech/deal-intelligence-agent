import React, { useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
import { apiPost } from "services/apiClient";

export default function AuthScreen({ onLogin }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await apiPost("/auth/login", { email, password });
      if (res.success) {
        onLogin();
      } else {
        setError(res.message || "Invalid credentials");
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect to authentication server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ background: '#fff', padding: 48, borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)', width: '100%', maxWidth: 440 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 40 }}>
          <div style={{ background: '#eff6ff', padding: 12, borderRadius: 12 }}>
            <BarChart size={32} color="#3b82f6" />
          </div>
          <span style={{ fontSize: 24, fontWeight: 700, color: '#0f172a' }}>Deal<span style={{color: '#3b82f6'}}>AI</span> Agent</span>
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 600, color: '#0f172a', marginBottom: 8, textAlign: 'center' }}>Welcome back</h2>
        <p style={{ color: '#64748b', textAlign: 'center', marginBottom: 32 }}>Enter your credentials to access your workspace</p>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', padding: '12px 16px', borderRadius: 8, fontSize: 14, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#334155', marginBottom: 8 }}>Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="alex.chen@example.com"
                style={{ width: '100%', padding: '12px 16px 12px 40px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none' }}
                required
                disabled={loading}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#334155', marginBottom: 8 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '12px 16px 12px 40px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none' }}
                required
                disabled={loading}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            style={{ 
              background: loading ? '#94a3b8' : '#3b82f6', color: '#fff', padding: '14px', borderRadius: 8, border: 'none', 
              fontSize: 15, fontWeight: 600, marginTop: 12, cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e: any) => !loading && (e.target.style.background = '#2563eb')}
            onMouseLeave={(e: any) => !loading && (e.target.style.background = '#3b82f6')}
          >
            {loading ? "Signing in..." : "Sign In"} {!loading && <ArrowRight size={18} />}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
