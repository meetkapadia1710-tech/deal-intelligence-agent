# DealAI Agent 🧠 — HackBaroda Submission

> **Close Deals Faster with Autonomous AI Memory.**
> DealAI Agent automatically synthesizes your meetings, uncovers hidden risks, and tells you exactly what to do next based on deep historical context.

## 🚀 Live Demo

**Experience the platform here:** [https://deal-intelligence-web.onrender.com/](https://deal-intelligence-web.onrender.com/)

> [!WARNING]
> **Cold Boot Delay:** This application is deployed on Render's Free Tier. If the application hasn't been used in the last 15 minutes, the backend server goes to sleep. **It may take up to 60 seconds to wake up** on your first interaction (such as logging in or clicking "Load Demo Data"). Please be patient during the first load!

---

## 🏆 Hackathon Alignment: Why This Matters

This project was explicitly built to address the **HackBaroda** criteria:

### 1. Solving a Real Business Problem
B2B Sales teams lose massive amounts of context between calls. Turnover, long sales cycles, and context-switching mean reps forget exactly what a stakeholder objected to 3 weeks ago. 
**The Solution:** An AI sales assistant that never forgets. It remembers every objection a prospect raised across calls, maps stakeholders, and drafts personalized follow-ups. *This is a tool organizations would readily pay $50/month for.*

### 2. Making Memory the Star (Powered by Hindsight)
Stateless chatbots are useless for long-term sales cycles. DealAI puts **Vectorize Hindsight** at the absolute center of the architecture.
* **Before Memory:** The AI gives generic sales advice ("Be polite, offer a discount").
* **After Memory:** The AI gives hyper-specific advice grounded in historical facts ("Priya Sharma from Procurement previously objected to the 20% markup; address the ROI justification she asked for on Tuesday"). 
* *Check out our "Memory Compare" feature in the app to see the stark Before/After difference!*

### 3. The 60-Second Demo
We built this to show instant value. In less than 60 seconds, a judge can:
1. Log in.
2. Click **"Load Demo Data"** to instantly populate the Hindsight memory bank with realistic sales transcripts.
3. Open the **"Agent Reasoning"** tab to ask a question and instantly see the Hindsight memory recall in action.

---

## 🏗️ Architecture & Tech Stack

At its core, DealAI decouples memory from reasoning for maximum performance and accuracy:

1. **Memory Layer (Hindsight):** Retains facts from sales interactions and recalls them via semantic search.
2. **Reasoning Layer (Groq):** Synthesizes recalled context using `llama-3.3-70b-versatile` to provide actionable insights at lightning speed.
3. **Application Layer:** React 18, Zustand, and Express/Prisma orchestrate the user experience.

- **Frontend:** React 18, TypeScript, Tailwind, Recharts, Clerk Auth
- **Backend:** Node.js, Express, TypeScript, Prisma (SQLite)

---

## 💻 Getting Started (Local Development)

### Prerequisites

- Node.js (v18+)
- [Vectorize Hindsight API Key](https://ui.hindsight.vectorize.io)
- [Groq API Key](https://console.groq.com)
- [Clerk Publishable & Secret Keys](https://clerk.com)

### 1. Installation

```bash
git clone https://github.com/meetkapadia1710-tech/deal-intelligence-agent.git
cd deal-intelligence-agent

# Install Backend & Frontend dependencies
cd backend && npm install
cd ../frontend && npm install
```

### 2. Environment Configuration

**Backend (`backend/.env`):**
```env
HINDSIGHT_API_KEY=your_hindsight_api_key
HINDSIGHT_BASE_URL=https://api.hindsight.vectorize.io
GROQ_API_KEY=your_groq_api_key
CLERK_SECRET_KEY=your_clerk_secret
CLERK_PUBLISHABLE_KEY=your_clerk_publishable
DATABASE_URL="file:./prod.db"
PORT=3001
```

**Frontend (`frontend/.env`):**
```env
REACT_APP_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
REACT_APP_API_URL=http://localhost:3001
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

---

## 📡 API Reference

The backend exposes a RESTful API powered by Express, securely protected by Clerk:

- `GET /api/deals` - Retrieve all active deals
- `POST /api/interactions` - Log a new interaction (note/transcript) into Hindsight
- `GET /api/interactions/:dealId/context` - Retrieve all raw context for a deal
- `POST /api/chat` - Interact with the memory-grounded agent using Groq + Hindsight
- `POST /api/compare` - Compare responses With vs Without Hindsight Memory
- `POST /api/reflect` - Trigger a Hindsight reflection report
- `GET /api/analytics/:dealId` - View objection velocity and analytics
- `POST /api/seed` - Seed demo data into the SQLite database and Hindsight memory bank
