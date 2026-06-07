import React, { useState, useEffect } from "react";
import { Zap, Clock, RefreshCw, Folder } from "lucide-react";
import { apiGet } from "services/apiClient";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, itemReveal, motionTokens } from "lib/motion";
import { Skeleton } from "components/ui/Skeleton";

type Action = {
  priority: number;
  category: string;
  title: string;
  reasoning: string;
  urgency: "High" | "Medium" | "Low";
  timeframe: string;
};

type DealActions = {
  loading: boolean;
  actions: Action[];
  error?: string;
  empty?: boolean;
};

const categoryColors: Record<string, { bg: string; text: string }> = {
  "Objection Handling": { bg: "#fff1f2", text: "#be123c" },
  "Relationship Building": { bg: "#eff6ff", text: "#1d4ed8" },
  "Pricing": { bg: "#f0fdf4", text: "#166534" },
  "Technical": { bg: "#faf5ff", text: "#6b21a8" },
  "Legal": { bg: "#fffbeb", text: "#92400e" },
  "Follow-up": { bg: "#f8fafc", text: "#475569" },
};

const urgencyColor: Record<string, string> = {
  High: "#ef4444",
  Medium: "#f59e0b",
  Low: "#10b981",
};

export default function NextActionPanel() {
  const [deals, setDeals] = useState<any[]>([]);
  const [dealsLoading, setDealsLoading] = useState(true);
  const [actionsMap, setActionsMap] = useState<Record<string, DealActions>>({});

  useEffect(() => {
    apiGet("/deals")
      .then(res => setDeals(res.deals || []))
      .finally(() => setDealsLoading(false));
  }, []);

  async function fetchActions(dealId: string) {
    setActionsMap(prev => ({ ...prev, [dealId]: { loading: true, actions: [] } }));
    try {
      const res = await apiGet(`/next-action/${dealId}`);
      setActionsMap(prev => ({
        ...prev,
        [dealId]: { loading: false, actions: res.actions || [], empty: res.empty },
      }));
    } catch (err: any) {
      setActionsMap(prev => ({
        ...prev,
        [dealId]: { loading: false, actions: [], error: err.message },
      }));
    }
  }

  return (
    <div style={{ padding: "32px 48px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <Zap size={28} color="#3b82f6" />
        <h1 className="dashboard-title">Next Best Actions</h1>
      </div>
      <p style={{ color: "#64748b", marginBottom: 32, fontSize: 14 }}>
        AI-powered recommendations based on each deal's history and interactions.
      </p>

      {dealsLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Skeleton height={80} borderRadius={12} />
          <Skeleton height={80} borderRadius={12} />
          <Skeleton height={80} borderRadius={12} />
        </div>
      ) : deals.length === 0 ? (
        <p style={{ color: "#64748b" }}>No deals found. Seed demo data first.</p>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          style={{ display: "flex", flexDirection: "column", gap: 20 }}
        >
          {deals.map(deal => {
            const dealActions = actionsMap[deal.dealId];
            const hasResults = dealActions && !dealActions.loading;

            return (
              <motion.div
                key={deal.dealId}
                variants={itemReveal}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  border: "1px solid #e2e8f0",
                  overflow: "hidden",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                {/* Deal header row */}
                <div
                  style={{
                    padding: "18px 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: hasResults ? "1px solid #f1f5f9" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        padding: 10,
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: 8,
                      }}
                    >
                      <Folder size={18} color="#3b82f6" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>
                        {deal.dealName}
                      </h3>
                      <p
                        style={{
                          fontSize: 12,
                          color: "#94a3b8",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {deal.dealId}
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => fetchActions(deal.dealId)}
                    disabled={dealActions?.loading}
                    style={{
                      padding: "8px 18px",
                      borderRadius: 8,
                      border: "1px solid #e2e8f0",
                      background: dealActions?.loading ? "#f8fafc" : "#0f172a",
                      color: dealActions?.loading ? "#64748b" : "#fff",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: dealActions?.loading ? "default" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      transition: "background 0.2s",
                    }}
                  >
                    {dealActions?.loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      >
                        <RefreshCw size={13} />
                      </motion.div>
                    ) : (
                      <Zap size={13} />
                    )}
                    {dealActions?.loading
                      ? "Analyzing..."
                      : hasResults
                      ? "Refresh"
                      : "Generate Actions"}
                  </motion.button>
                </div>

                {/* Actions list */}
                <AnimatePresence>
                  {hasResults && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={motionTokens.springSmooth}
                    >
                      {dealActions.error ? (
                        <p
                          style={{
                            padding: "16px 24px",
                            color: "#ef4444",
                            fontSize: 13,
                          }}
                        >
                          Failed to generate actions: {dealActions.error}
                        </p>
                      ) : dealActions.empty || dealActions.actions.length === 0 ? (
                        <p
                          style={{
                            padding: "16px 24px",
                            color: "#64748b",
                            fontSize: 13,
                          }}
                        >
                          No deal history found. Log some interactions first.
                        </p>
                      ) : (
                        <div
                          style={{
                            padding: "16px 24px",
                            display: "flex",
                            flexDirection: "column",
                            gap: 12,
                          }}
                        >
                          {dealActions.actions.map((action, idx) => {
                            const colors =
                              categoryColors[action.category] ||
                              categoryColors["Follow-up"];
                            return (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  ...motionTokens.springSmooth,
                                  delay: idx * 0.08,
                                }}
                                style={{
                                  display: "flex",
                                  gap: 16,
                                  padding: 16,
                                  borderRadius: 12,
                                  border: "1px solid #f1f5f9",
                                  background: "#fafafa",
                                }}
                              >
                                {/* Priority circle */}
                                <div
                                  style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: "50%",
                                    background: "#0f172a",
                                    color: "#fff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 13,
                                    fontWeight: 700,
                                    flexShrink: 0,
                                  }}
                                >
                                  {action.priority}
                                </div>

                                <div style={{ flex: 1 }}>
                                  {/* Badges row */}
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 8,
                                      marginBottom: 6,
                                      flexWrap: "wrap",
                                    }}
                                  >
                                    <span
                                      style={{
                                        padding: "2px 8px",
                                        borderRadius: 6,
                                        fontSize: 11,
                                        fontWeight: 600,
                                        background: colors.bg,
                                        color: colors.text,
                                      }}
                                    >
                                      {action.category}
                                    </span>
                                    <span
                                      style={{
                                        fontSize: 11,
                                        fontWeight: 600,
                                        color: urgencyColor[action.urgency] || "#64748b",
                                      }}
                                    >
                                      ● {action.urgency} priority
                                    </span>
                                    <span
                                      style={{
                                        fontSize: 11,
                                        color: "#94a3b8",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 3,
                                      }}
                                    >
                                      <Clock size={10} />
                                      {action.timeframe}
                                    </span>
                                  </div>

                                  <p
                                    style={{
                                      fontSize: 14,
                                      fontWeight: 600,
                                      color: "#0f172a",
                                      marginBottom: 4,
                                    }}
                                  >
                                    {action.title}
                                  </p>
                                  <p
                                    style={{
                                      fontSize: 13,
                                      color: "#64748b",
                                      lineHeight: 1.6,
                                    }}
                                  >
                                    {action.reasoning}
                                  </p>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
