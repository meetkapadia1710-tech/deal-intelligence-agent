# DealAI Agent 🧠

> Close Deals Faster with Autonomous AI Memory. DealAI Agent automatically synthesizes your meetings, uncovers hidden risks, and tells you exactly what to do next.

## Overview

DealAI Agent is a next-generation Deal Intelligence Platform designed to solve a critical problem in sales: losing context between calls. 

Powered by **Vectorize Hindsight** for infinite semantic memory and **Groq** for instantaneous reasoning, the platform automatically tracks interactions, maps stakeholders, uncovers objection patterns, and recommends optimal next actions to move deals forward.

## Key Features

- **Global Intelligence Dashboard:** Gain a high-level view of your pipeline value, average close probability, and high-risk deals, complete with a dynamic AI-driven intelligence feed.
- **Active Deal Tracking:** Track individual deals, risks, and next actions.
- **Semantic Deal Memory:** Log interactions (notes, call transcripts) and allow the Hindsight agent to automatically extract facts, stakeholders, and objections.
- **Agentic Chat:** Ask the agent questions about any deal ("What did the CFO say about pricing?") and receive answers instantly grounded in your specific deal context.
- **Automated Reflection:** Instantly generate objection pattern reports, stakeholder maps, and health analyses across all historical interactions.

## Architecture

At its core, DealAI decouples memory from reasoning for maximum performance and accuracy:

1. **Memory Layer (Hindsight):** Retains facts from sales interactions and recalls them via semantic search.
2. **Reasoning Layer (Groq):** Synthesizes recalled context using `llama-3.3-70b-versatile` to provide actionable insights.
3. **Application Layer:** React 18, Zustand, and Express/Prisma orchestrate the user experience.

## Tech Stack

- **Frontend:** React 18, TypeScript, Zustand, Framer Motion, Recharts, Clerk Auth
- **Backend:** Node.js, Express, TypeScript, Prisma (SQLite)
- **AI Services:** Hindsight (Memory Bank), Groq (LLM Inference)

## Getting Started

### Prerequisites

- Node.js (v18+)
- [Vectorize Hindsight API Key](https://ui.hindsight.vectorize.io)
- [Groq API Key](https://console.groq.com)
- [Clerk Publishable & Secret Keys](https://clerk.com)

### 1. Installation

```bash
git clone https://github.com/meetkapadia1710-tech/deal-intelligence-agent.git
cd deal-intelligence-agent

# Install Backend dependencies
cd backend && npm install

# Install Frontend dependencies
cd ../frontend && npm install
```

### 2. Environment Configuration

**Backend (`backend/.env`):**
```env
HINDSIGHT_API_KEY=your_hindsight_api_key
HINDSIGHT_BASE_URL=https://api.hindsight.vectorize.io
GROQ_API_KEY=your_groq_api_key
DATABASE_URL="file:./dev.db"
PORT=3001
```

**Frontend (`frontend/.env`):**
```env
REACT_APP_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### 3. Database Initialization

```bash
cd backend
npx prisma db push
```

### 4. Running the Application

```bash
# Terminal 1 — Start Backend API
cd backend
npm run dev

# Terminal 2 — Start Frontend Application
cd frontend
npm start
```

Navigate to `http://localhost:3000`. 

*Note: Once logged in, navigate to Global Intelligence and click "Load Demo Data" to seed realistic interactions.*

## API Reference

The backend exposes a RESTful API powered by Express:

- `GET /api/deals` - Retrieve all active deals
- `POST /api/interactions` - Log a new interaction (note/transcript)
- `GET /api/interactions/:dealId/context` - Retrieve all raw context for a deal
- `POST /api/chat` - Interact with the memory-grounded agent
- `POST /api/reflect` - Trigger a Hindsight reflection report
- `GET /api/timeline/:dealId` - View chronological deal history
- `GET /api/next-action/:dealId` - Synthesize the next best action
- `POST /api/seed` - Seed demo data into the SQLite database and Hindsight memory bank
