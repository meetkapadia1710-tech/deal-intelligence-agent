# Deal Intelligence Agent

> "Salespeople lose context between calls. Our Deal Intelligence Agent remembers every call, every objection, and every stakeholder — indexed by deal, recalled instantly. Watch how it turns a blank follow-up email into a personalized, context-aware strategy in seconds."

Built for the **Hindsight Hackathon** · [Live Demo](#demo-flow)

---

## The Problem

A sales rep finishes a call with the CFO. She raised a pricing objection and asked for a 20% discount. Two weeks later, the rep sends a generic follow-up email. The deal dies.

**The agent fixes this.** It remembers everything — and uses that memory to help the rep respond with precision.

---

## What It Does

| Without the agent | With the agent |
|---|---|
| Rep forgets what the CFO said about pricing | Agent recalls the exact objection, the discount request, and who raised it |
| Generic follow-up email | Personalized email referencing specific concerns |
| No visibility into deal health | Stakeholder map, objection patterns, next-step recommendations |

### Core features

- **Log interactions** — type a note after any call. Hindsight automatically extracts stakeholders, objections, and sentiment, indexed by deal ID.
- **Chat with memory** — ask "What did the CFO say about pricing?" The agent recalls exact context, then Groq writes a personalized response.
- **⚡ Compare Mode** — side-by-side: Generic AI (no memory) vs Deal Intelligence Agent (with memory). The contrast is the demo.
- **Timeline tab** — a scrollable deal diary showing every stored memory with entity tags and type labels.
- **Reflect tab** — one-click analysis powered directly by Hindsight: objection patterns, stakeholder map, deal health, recommended next steps.

---

## Architecture

```
Rep types note
      │
      ▼
POST /api/interactions
      │
      ▼ hindsight.retain(bankId, note, { tags: [dealId] })
┌─────────────────────────────────────────┐
│         Hindsight Memory Bank           │
│  retain  → extract + store facts        │
│  recall  → TEMPR semantic search        │
│  reflect → reason across observations   │
└─────────────────────────────────────────┘
      │
      ▼ recalled memories (filtered by dealId tag)
POST /api/chat  ──→  Groq llama-3.3-70b-versatile
      │
      ▼
Personalized, memory-grounded response
```

**Hindsight = memory layer. Groq = reasoning layer.**

---

## Stack

| Layer | Technology |
|---|---|
| Memory | [Hindsight](https://hindsight.vectorize.io) — retain, recall, reflect |
| LLM | [Groq](https://console.groq.com) — llama-3.3-70b-versatile |
| Backend | Node.js + Express (ESM) |
| Frontend | React 18 |

---

## Setup

### 1. Clone & install

```bash
git clone https://github.com/YOUR_USERNAME/deal-intelligence-agent.git
cd deal-intelligence-agent

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2. Configure environment

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```
HINDSIGHT_API_KEY=your_hindsight_api_key
HINDSIGHT_BASE_URL=https://api.hindsight.vectorize.io
GROQ_API_KEY=your_groq_api_key
PORT=3001
```

**Get your keys:**
- **Hindsight:** Sign up at [ui.hindsight.vectorize.io](https://ui.hindsight.vectorize.io) → Connect → Create API Key. Use promo code `MEMHACK6` for $50 free credits.
- **Groq:** [console.groq.com](https://console.groq.com) → API Keys (free tier available)

### 3. Run

Start backend first, then frontend:

```bash
# Terminal 1 — Backend (wait for "✅ Memory bank ready")
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## Demo Flow (60 seconds)

**Setup before the demo** (do this once — data persists in Hindsight):
1. Open the app → click **Load Demo Data**
2. This seeds 6 realistic interactions across 2 deals (Acme Corp + Globex Industries)

**Live demo script:**

| Time | Action |
|---|---|
| 0:00 | "Sales reps lose context between calls. Watch what happens." |
| 0:05 | Click **Acme Corp** in the sidebar |
| 0:10 | Click **Timeline** tab — "Here's everything the agent remembered about this deal." |
| 0:20 | Click **Chat** tab — ask: *"What did the CFO say about pricing?"* |
| 0:30 | Enable **⚡ Compare** — ask the same question — show side-by-side |
| 0:45 | Click **Reflect** → **Objection Patterns** — Hindsight reasons across all memories |
| 0:55 | "Without memory: generic template. With Hindsight: personal and strategic." |

---

## API Routes

| Method | Route | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/interactions` | Log a new interaction note |
| GET | `/api/interactions/:dealId/context` | Recall all memory for a deal |
| POST | `/api/chat` | Ask a question (recall + Groq) |
| POST | `/api/compare` | Side-by-side: no-memory vs with-memory |
| POST | `/api/reflect` | Pattern analysis (Hindsight reflect) |
| GET | `/api/timeline/:dealId` | All stored memories for a deal |
| GET | `/api/deals` | List tracked deals |
| POST | `/api/seed` | Seed demo data |

---

## Project Structure

```
deal-intelligence-agent/
├── backend/
│   ├── server.js        # Express API — all routes
│   ├── .env.example     # Environment template (keys not included)
│   └── package.json
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js       # Full React app — chat, compare, timeline, reflect
        ├── App.css      # Dark UI
        └── index.js
```
