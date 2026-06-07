import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { HindsightClient } from "@vectorize-io/hindsight-client";
import Groq from "groq-sdk";
import path from "path";
import { fileURLToPath } from "url";
import { clerkMiddleware, requireAuth } from '@clerk/express';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, "../frontend/build")));

const hindsight = new HindsightClient({
  baseUrl: process.env.HINDSIGHT_BASE_URL || "https://api.hindsight.vectorize.io",
  apiKey: process.env.HINDSIGHT_API_KEY,
});

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const BANK_ID = "deal-intelligence-agent";

// In-memory deal registry — populated by /api/seed and /api/interactions
const dealsRegistry = new Map();

async function initBank() {
  try {
    await hindsight.createBank(BANK_ID, {
      reflectMission:
        "I am a sales intelligence assistant. I help reps close deals by remembering every interaction, objection, and stakeholder detail across all calls and meetings.",
      dispositionEmpathy: 4,
      dispositionLiteralism: 3,
      dispositionSkepticism: 2,
    });
    console.log("✅ Memory bank ready:", BANK_ID);
  } catch (err) {
    console.warn("Bank init warning:", err.message);
  }
}

// ── Routes ────────────────────────────────────────────────────────────────────

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", bank: BANK_ID });
});

// Protect all other API routes with Clerk
app.all("/api/*", requireAuth());

// POST /api/interactions — log a new interaction note
// Body: { dealId, dealName, note, stakeholder? }
app.post("/api/interactions", async (req, res) => {
  const { dealId, dealName, note, stakeholder } = req.body;
  if (!dealId || !note) {
    return res.status(400).json({ error: "dealId and note are required" });
  }

  try {
    const enrichedNote = `[Deal: ${dealName || dealId}] [DealID: ${dealId}]${
      stakeholder ? ` [Stakeholder: ${stakeholder}]` : ""
    } ${note}`;

    await hindsight.retain(BANK_ID, enrichedNote, {
      metadata: {
        dealId,
        dealName: dealName || dealId,
        ...(stakeholder && { stakeholder }),
        timestamp: new Date().toISOString(),
      },
      tags: [dealId],
    });

    if (!dealsRegistry.has(dealId)) {
      dealsRegistry.set(dealId, { dealId, dealName: dealName || dealId });
    }

    res.json({ success: true, message: "Interaction stored in memory" });
  } catch (err) {
    console.error("retain error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/interactions/:dealId/context — recall all memory for a deal
app.get("/api/interactions/:dealId/context", async (req, res) => {
  const { dealId } = req.params;
  const { query } = req.query;

  try {
    const memories = await hindsight.recall(
      BANK_ID,
      query || `deal interactions objections stakeholders`,
      { tags: [dealId], tagsMatch: "all_strict" }
    );
    res.json({ dealId, memories: memories.results });
  } catch (err) {
    console.error("recall error:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/chat — recall + Groq to answer rep's question
// Body: { dealId, dealName, question }
app.post("/api/chat", async (req, res) => {
  const { dealId, dealName, question } = req.body;
  if (!dealId || !question) {
    return res.status(400).json({ error: "dealId and question are required" });
  }

  try {
    const memories = await hindsight.recall(BANK_ID, question, {
      tags: [dealId],
      tagsMatch: "all_strict",
      budget: "mid",
    });

    const memoryText =
      memories.results?.map((m) => m.text).join("\n---\n") ||
      "No prior interactions found for this deal.";

    const hasMemory = (memories.results?.length || 0) > 0;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are an expert sales coach helping a sales rep close deals.
You have access to the full history of a deal called "${dealName || dealId}".
Be specific, direct, and actionable. Always reference specific details from memory when available.
Format responses clearly — use bullet points for lists, bold for key names.`,
        },
        {
          role: "user",
          content: `Deal history for "${dealName || dealId}":\n${memoryText}\n\nRep's question: ${question}\n\nProvide a specific, actionable response based on the deal history above.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    res.json({
      answer: completion.choices[0]?.message?.content || "No response generated.",
      memoryUsed: hasMemory,
      memoriesCount: memories.results?.length || 0,
      dealId,
    });
  } catch (err) {
    console.error("chat error:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/chat-no-memory — Groq only, zero deal context (for Before/After comparison)
// Body: { question }
app.post("/api/chat-no-memory", async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: "question is required" });
  }
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a generic sales assistant. You have no knowledge of any specific deals, customers, or past conversations. Answer using general sales knowledge only.",
        },
        { role: "user", content: question },
      ],
      temperature: 0.7,
      max_tokens: 400,
    });
    res.json({
      answer: completion.choices[0]?.message?.content || "No response.",
      memoryUsed: false,
      memoriesCount: 0,
    });
  } catch (err) {
    console.error("chat-no-memory error:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reflect — Hindsight reflect for pattern analysis
// Body: { dealId, dealName, prompt }
app.post("/api/reflect", async (req, res) => {
  const { dealId, dealName, prompt } = req.body;
  if (!dealId) {
    return res.status(400).json({ error: "dealId is required" });
  }

  try {
    const reflectPrompt =
      prompt ||
      `For the deal "${dealName || dealId}", summarize:
1. Top objections raised and by whom
2. Key stakeholders and their concerns
3. Current deal status and risks
4. Recommended next actions`;

    const result = await hindsight.reflect(BANK_ID, reflectPrompt, {
      tags: [dealId],
      tagsMatch: "all_strict",
      budget: "mid",
    });

    res.json({ reflection: result.text, dealId });
  } catch (err) {
    console.error("reflect error:", err);
    res.status(500).json({ error: err.message });
  }
});
// POST /api/next-action
app.post("/api/next-action", async (req, res) => {
  const { dealId, dealName } = req.body;

  if (!dealId) {
    return res.status(400).json({ error: "dealId is required" });
  }

  try {
    const memories = await hindsight.recall(
      BANK_ID,
      "objections stakeholders risks next steps",
      {
        tags: [dealId],
        tagsMatch: "all_strict",
        budget: "high",
      }
    );

    const memoryText =
      memories.results?.map((m) => m.text).join("\n---\n") ||
      "No deal history available.";

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are a world-class enterprise sales coach.

Analyze the deal history and provide:

1. Recommended Next Action
2. Why it matters
3. Priority (High/Medium/Low)

Be concise and actionable.
`,
        },
        {
          role: "user",
          content: `
Deal: ${dealName}

History:
${memoryText}
`,
        },
      ],
      temperature: 0.3,
      max_tokens: 300,
    });

    res.json({
      recommendation:
        completion.choices[0]?.message?.content ||
        "No recommendation generated.",
    });
  } catch (err) {
    console.error("next-action error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/deals — list all deals tracked in memory
app.get("/api/deals", (req, res) => {
  res.json({ deals: Array.from(dealsRegistry.values()) });
});

// POST /api/seed — seed fake demo data
app.post("/api/seed", async (req, res) => {
  const seedData = [
    {
      dealId: "acme-001",
      dealName: "Acme Corp",
      stakeholder: "Priya Sharma (CFO)",
      note: "Had a call with Priya Sharma (CFO). She is worried about implementation timeline — wants deployment within 6 weeks. Also pushed back hard on pricing, requesting a 20% discount. Sentiment was cautious but interested.",
    },
    {
      dealId: "acme-001",
      dealName: "Acme Corp",
      stakeholder: "Raj Mehta (CTO)",
      note: "Call with Raj Mehta (CTO). Technical concerns about API integration with their legacy SAP system. Wants a sandbox environment to test before signing. Positive about the product itself — said it was the best solution they had seen.",
    },
    {
      dealId: "acme-001",
      dealName: "Acme Corp",
      stakeholder: "Priya Sharma (CFO)",
      note: "Follow-up email from Priya. She reiterated the 20% discount request and added that the board needs ROI justification before approving. Budget is locked at $80k annually — our list price is $95k.",
    },
    {
      dealId: "acme-001",
      dealName: "Acme Corp",
      stakeholder: "Neha Kapoor (Procurement)",
      note: "Intro call with Neha Kapoor from procurement. She handles all vendor contracts. Needs MSA, DPA, and SOC2 report before they can proceed. Said legal review takes 3 weeks minimum.",
    },
    {
      dealId: "globex-002",
      dealName: "Globex Industries",
      stakeholder: "David Chen (VP Sales)",
      note: "Discovery call with David Chen (VP Sales). Pain point is their team losing deal context when reps change accounts. Very excited about memory features. No budget concerns raised. Wants to see a live demo with their own data.",
    },
    {
      dealId: "globex-002",
      dealName: "Globex Industries",
      stakeholder: "David Chen (VP Sales)",
      note: "Demo session with David. Went very well — he showed it to his team live. One concern: can the system integrate with Salesforce CRM. Timeline is Q3 this year. Likely to close if Salesforce integration is confirmed.",
    },
  ];

  try {
    for (const item of seedData) {
      const enrichedNote = `[Deal: ${item.dealName}] [DealID: ${item.dealId}] [Stakeholder: ${item.stakeholder}] ${item.note}`;
      await hindsight.retain(BANK_ID, enrichedNote, {
        metadata: {
          dealId: item.dealId,
          dealName: item.dealName,
          stakeholder: item.stakeholder,
          timestamp: new Date().toISOString(),
        },
        tags: [item.dealId],
      });

      if (!dealsRegistry.has(item.dealId)) {
        dealsRegistry.set(item.dealId, {
          dealId: item.dealId,
          dealName: item.dealName,
        });
      }
    }

    res.json({
      success: true,
      seeded: seedData.length,
      message: `${seedData.length} interactions seeded across 2 deals`,
    });
  } catch (err) {
    console.error("seed error:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/compare — no-memory vs with-memory side by side
// Body: { dealId, dealName, question }
app.post("/api/compare", async (req, res) => {
  const { dealId, dealName, question } = req.body;
  if (!dealId || !question) {
    return res.status(400).json({ error: "dealId and question are required" });
  }

  try {
    const [noMemCompletion, memories] = await Promise.all([
      groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are a generic sales assistant. You have no knowledge of any specific deals, customers, or past interactions." },
          { role: "user", content: question },
        ],
        temperature: 0.7,
        max_tokens: 350,
      }),
      hindsight.recall(BANK_ID, question, {
        tags: [dealId],
        tagsMatch: "all_strict",
        budget: "mid",
      }),
    ]);

    const memoryText =
      memories.results?.map((m) => m.text).join("\n---\n") ||
      "No prior interactions found.";

    const withMemCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are an expert sales coach for the deal "${dealName || dealId}". You have full memory of every past interaction. Always reference specific names, numbers, and facts from the deal history.`,
        },
        {
          role: "user",
          content: `Deal history:\n${memoryText}\n\nQuestion: ${question}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 350,
    });

    res.json({
      noMemory: noMemCompletion.choices[0]?.message?.content || "No response.",
      withMemory: withMemCompletion.choices[0]?.message?.content || "No response.",
      memoriesCount: memories.results?.length || 0,
    });
  } catch (err) {
    console.error("compare error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/timeline/:dealId — all stored memories for a deal (deal diary)
app.get("/api/timeline/:dealId", async (req, res) => {
  const { dealId } = req.params;
  try {
    const memories = await hindsight.recall(
      BANK_ID,
      "interaction call email meeting stakeholder objection timeline",
      { tags: [dealId], tagsMatch: "all_strict", budget: "high" }
    );
    res.json({ dealId, entries: memories.results || [] });
  } catch (err) {
    console.error("timeline error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Catch-all to serve the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

// ── Start ─────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, async () => {
  console.log(`🚀 Deal Intelligence API running on http://localhost:${PORT}`);
  await initBank();
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\n❌ Port ${PORT} is already in use.\n   Run this in PowerShell to free it:\n   Stop-Process -Id (Get-NetTCPConnection -LocalPort ${PORT} | Select -First 1 -Expand OwningProcess) -Force\n`);
    process.exit(1);
  }
});

process.on("SIGINT", () => { server.close(); process.exit(0); });
process.on("SIGTERM", () => { server.close(); process.exit(0); });
