# Deal Intelligence Agent

AI-powered sales memory. Every call, every objection, every stakeholder — recalled instantly.

Built with **Hindsight** (memory layer) + **Groq** (reasoning layer) + **React** + **Node.js**.

---

## What It Does

Salespeople lose context between calls. This agent remembers everything:

- **Log interactions** — type a note after any call or email. Hindsight extracts stakeholders, objections, sentiment, and indexes everything by deal.
- **Chat with memory** — ask "What did the CFO say about pricing?" and the agent recalls the exact context, then Groq generates a personalized response.
- **Reflect** — one-click analysis: objection patterns, stakeholder map, deal health summary, recommended next steps.

---

## Setup

### 1. Clone & install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment

```bash
cd backend
cp .env.example .env
```

Edit `.env` and fill in:

```
HINDSIGHT_API_KEY=your_hindsight_api_key
HINDSIGHT_ORG_ID=your_hindsight_org_id
GROQ_API_KEY=your_groq_api_key
```

**Get your keys:**
- Hindsight: [hindsight.cloud](https://hindsight.cloud) → Settings → API Keys. Use promo code `MEMHACK6` for $50 free credits.
- Groq: [console.groq.com](https://console.groq.com) → API Keys

### 3. Run

In two terminals:

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## Demo Flow (60 seconds)

1. Click **Load Demo Data** → seeds 2 deals (Acme Corp + Globex Industries) with realistic interactions
2. Click **Acme Corp** in the sidebar
3. Ask: *"What did the CFO say about pricing?"*
4. Ask: *"Draft a follow-up email"*
5. Switch to **Reflect** tab → click **Objection Patterns**
6. Show the contrast: agent gives specific, memory-grounded answers vs a generic LLM

---

## Architecture

```
Rep types note
      │
      ▼
POST /api/interactions
      │
      ▼ hindsight.retain(dealId, note)
┌─────────────────────────────────┐
│  Hindsight Memory Bank          │
│  • retain  → store + extract    │
│  • recall  → TEMPR search       │
│  • reflect → pattern synthesis  │
└─────────────────────────────────┘
      │
      ▼ recalled context
POST /api/chat
      │
      ▼ context + question → Groq
    Groq llama3-70b
      │
      ▼
Personalized response
```

**Key insight:** Hindsight remembers. Groq thinks.

---

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/interactions` | Log a new interaction note |
| GET | `/api/interactions/:dealId/context` | Recall all memory for a deal |
| POST | `/api/chat` | Ask a question (recall + Groq) |
| POST | `/api/reflect` | Pattern analysis (Hindsight reflect) |
| GET | `/api/deals` | List all deals in memory |
| POST | `/api/seed` | Seed demo data |

---

## Project Structure

```
deal-intelligence/
├── backend/
│   ├── server.js       # Express API with all routes
│   ├── .env.example    # Environment template
│   └── package.json
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js      # Full React app
        ├── App.css     # Dark industrial UI
        └── index.js
```

---

## Built For

Hindsight Hackathon — Deal Intelligence Agent track.

> "Salespeople lose context between calls. Our Deal Intelligence Agent remembers every call, every objection, and every stakeholder concern — indexed by deal, recalled instantly. Watch how it turns a blank follow-up email into a personalized, context-aware strategy in seconds."
