import React from "react";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ShieldCheck, Zap, Database } from "lucide-react";
import { staggerContainer, itemReveal, motionTokens } from "lib/motion";

export default function LandingPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at top, #0f172a 0%, #020617 100%)",
      color: "#f8fafc",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-sans)",
      overflow: "hidden",
      position: "relative"
    }}>
      {/* Background Orbs */}
      <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "50%", height: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)", filter: "blur(60px)", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "50%", height: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)", filter: "blur(60px)", zIndex: 0 }} />

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        style={{ zIndex: 1, maxWidth: 800, textAlign: "center", padding: 24, display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <motion.div variants={itemReveal} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 100, marginBottom: 32, backdropFilter: "blur(10px)" }}>
          <Sparkles size={16} color="#8b5cf6" />
          <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "#cbd5e1" }}>Next-Gen Intelligence</span>
        </motion.div>

        <motion.h1 variants={itemReveal} style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 24, background: "linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Close Deals Faster with <br /> Autonomous AI Memory
        </motion.h1>

        <motion.p variants={itemReveal} style={{ fontSize: 20, color: "#94a3b8", lineHeight: 1.6, maxWidth: 600, marginBottom: 48 }}>
          DealAI Agent automatically synthesizes your meetings, uncovers hidden risks, and tells you exactly what to do next.
        </motion.p>

        <motion.div variants={itemReveal} style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          <SignUpButton forceRedirectUrl="/">
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(139, 92, 246, 0.4)" }} 
              whileTap={{ scale: 0.95 }}
              style={{ padding: "16px 32px", fontSize: 16, fontWeight: 600, background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", color: "#fff", border: "none", borderRadius: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 14px rgba(0,0,0,0.2)" }}
            >
              Get Started for Free <ArrowRight size={18} />
            </motion.button>
          </SignUpButton>

          <SignInButton forceRedirectUrl="/">
            <motion.button 
              whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.1)" }} 
              whileTap={{ scale: 0.95 }}
              style={{ padding: "16px 32px", fontSize: 16, fontWeight: 600, background: "transparent", color: "#f8fafc", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 12, cursor: "pointer", backdropFilter: "blur(10px)" }}
            >
              Sign In
            </motion.button>
          </SignInButton>
        </motion.div>

        {/* Features Row */}
        <motion.div variants={itemReveal} style={{ display: "flex", gap: 40, marginTop: 80, color: "#64748b", justifyContent: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 500 }}>
            <Database size={18} /> Semantic Memory
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 500 }}>
            <Zap size={18} /> Real-time Synthesis
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 500 }}>
            <ShieldCheck size={18} /> Enterprise Grade
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
