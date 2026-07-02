# Deal Intelligence Agent 🧠

[![RepoGrade](https://repo-grade-web.vercel.app/api/badge/meetkapadia1710-tech/deal-intelligence-agent)](https://repo-grade-web.vercel.app/gh/meetkapadia1710-tech/deal-intelligence-agent)

> **Close Deals Faster with Autonomous AI Memory.**
>
> Deal Intelligence Agent automatically synthesizes your meetings, uncovers hidden risks, and tells you exactly what to do next based on deep historical context, empowering B2B sales teams to retain crucial information and accelerate sales cycles.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-green?logo=nodedotjs)](https://nodejs.org/)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=white)](https://react.dev/)
<!-- Add CI badge once configured, e.g., [![CI Status](https://github.com/meetkapadia1710-tech/deal-intelligence-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/meetkapadia1710-tech/deal-intelligence-agent/actions/workflows/ci.yml) -->

## ✨ Overview

In the fast-paced world of B2B sales, context is king. Sales teams often lose critical information due to high turnover, lengthy sales cycles, and constant context-switching. This leads to missed opportunities and a lack of personalized engagement.

The Deal Intelligence Agent addresses this challenge head-on by providing an AI-powered sales assistant that never forgets. It leverages autonomous AI memory to remember every objection, stakeholder detail, and historical interaction, offering hyper-specific advice and driving deals to close faster. This project was initially developed as a submission for HackBaroda, focusing on solving a tangible business problem with innovative AI memory solutions.

## 🚀 Live Demo

**Experience the platform here:** [https://deal-intelligence-web.onrender.com/](https://deal-intelligence-web.onrender.com/)

> [!WARNING]
> **Cold Boot Delay:** This application is deployed on Render's Free Tier. If the application hasn't been used in the last 15 minutes, the backend server goes to sleep. **It may take up to 60 seconds to wake up** on your first interaction (such as logging in or clicking "Load Demo Data"). Please be patient during the first load!

## 💡 Key Features

*   **Autonomous AI Memory (Hindsight Integration):** Continuously synthesizes and retains facts from sales interactions, providing deep historical context via semantic search.
*   **Intelligent Reasoning Engine (Groq-Powered):** Utilizes `llama-3.3-70b-versatile` to synthesize recalled context at lightning speed, offering actionable insights and recommendations.
*   **Meeting Synthesis & Risk Uncovering:** Automatically processes meeting transcripts to identify key discussion points, uncover hidden risks, and map stakeholder positions.
*   **Actionable Next Steps & Personalized Follow-ups:** Provides precise guidance on what to do next for each deal and drafts personalized follow-up communications based on past interactions.
*   **Memory Comparison Feature:** Visualize the stark difference between AI responses with and without Hindsight memory, demonstrating the value of deep context.
*   **Agent Reasoning Pipeline:** A visual representation of how the AI processes information, recalls memory, and generates its recommendations.
*   **Comprehensive Deal Management:** Track active deals, view interaction history, and manage deal-specific intelligence.
*   **Sales Analytics Dashboard:** Gain insights into objection velocity and other key metrics for individual deals.
*   **Secure User Authentication:** Powered by Clerk for seamless and secure user management.
*   **Demo Data Seeding:** Instantly populate the platform with realistic sales transcripts and deal data to experience its capabilities without manual entry.

## 🏗️ Architecture & Tech Stack

Deal Intelligence Agent is built on a robust, decoupled architecture for optimal performance and scalability:

*   **Memory Layer (Hindsight):**
    *   **Role:** Retains and recalls facts from sales interactions via semantic search.
    *   **Technology:** Hindsight API (Vectorize Hindsight).
*   **Reasoning Layer (Groq):**
    *   **Role:** Synthesizes recalled context to provide actionable insights.
    *   **Technology:** Groq with `llama-3.3-70b-versatile`.
*   **Application Layer:**
    *   **Frontend:** React 18, TypeScript, Tailwind CSS, Zustand (state management), Recharts (data visualization), Clerk Auth (UI integration).
    *   **Backend:** Node.js, Express, TypeScript, Prisma ORM (with SQLite for development/demo), Clerk Auth (API integration).

## 💻 Getting Started (Local Development)

Follow these steps to set up and run the Deal Intelligence Agent on your local machine.

### Prerequisites

Ensure you have the following installed:

*   **Node.js** (v18 or higher)
*   **Vectorize Hindsight API Key:** Obtain one from [https://ui.hindsight.vectorize.io](https://ui.hindsight.vectorize.io)
*   **Groq API Key:** Obtain one from [https://console.groq.com](https://console.groq.com)
*   **Clerk Publishable & Secret Keys:** Obtain these from [https://clerk.com](https://clerk.com)

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/meetkapadia1710-tech/deal-intelligence-agent.git
cd deal-intelligence-agent

# Install Backend dependencies
cd backend
npm install

# Install Frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration

Create `.env` files in both the `backend` and `frontend` directories based on the examples below, filling in your API keys.

**Backend (`backend/.env`):**

```env
HINDSIGHT_API_KEY=your_hindsight_api_key
HINDSIGHT_BASE_URL=https://api.hindsight.vectorize.io
GROQ_API_KEY=your_groq_api_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
DATABASE_URL="file:./prod.db" # Or "file:./dev.db" for development
PORT=3001
```

**Frontend (`frontend/.env`):**

```env
REACT_APP_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
REACT_APP_API_URL=http://localhost:3001
```

### 3. Database Initialization

Navigate to the `backend` directory and initialize your SQLite database using Prisma:

```bash
cd backend
npx prisma db push
```

### 4. Running the Application

Open two separate terminal windows.

**Terminal 1 — Start Backend API:**

```bash
cd backend
npm run dev
```

**Terminal 2 — Start Frontend Application:**

```bash
cd frontend
npm start
```

Once both are running, open your web browser and navigate to `http://localhost:3000`. After logging in, proceed to the "Global Intelligence" dashboard and click **"Load Demo Data"** to seed realistic interactions and experience the agent's capabilities.

## 📡 API Reference

The backend exposes a secure RESTful API, with most endpoints protected by Clerk authentication middleware.

*   `GET /api/deals` - Retrieve all active deals for the authenticated user.
*   `POST /api/interactions` - Log a new interaction (e.g., meeting note, call transcript) into the Hindsight memory bank for a specific deal.
*   `GET /api/interactions/:dealId/context` - Retrieve all raw contextual information stored for a given deal.
*   `POST /api/chat` - Interact with the memory-grounded AI agent, leveraging Groq and Hindsight to get intelligent responses.
*   `POST /api/compare` - Compare AI responses generated with vs. without the contextual memory from Hindsight.
*   `POST /api/reflect` - Trigger a Hindsight reflection report, generating a summary or analysis based on stored memory.
*   `GET /api/analytics/:dealId` - View analytics, such as objection velocity and other deal-specific metrics.
*   `POST /api/seed` - Seed the database and Hindsight memory bank with demo data for quick setup and testing.

## 📁 Project Structure

```
deal-intelligence-agent/
├── .gitignore
├── LICENSE
├── README.md
├── backend/                      # Node.js/Express API (TypeScript)
│   ├── .env.example              # Environment variables template
│   ├── package.json              # Backend dependencies
│   ├── prisma/                   # Prisma ORM setup
│   │   └── schema.prisma         # Database schema (SQLite)
│   ├── src/
│   │   ├── app.ts                # Main Express application setup
│   │   ├── config/               # Configuration files (e.g., API clients)
│   │   ├── controllers/          # API route handlers (auth, chat, deal logic)
│   │   ├── middleware/           # Express middleware (e.g., rate limiting)
│   │   ├── routes/               # API route definitions
│   │   └── services/             # Core business logic (AI, memory, bank services)
│   │       ├── ai.service.ts     # Groq integration for reasoning
│   │       └── memory.service.ts # Hindsight integration for autonomous memory
│   ├── server.ts                 # Entry point for the backend server
│   └── tsconfig.json             # TypeScript configuration for backend
├── frontend/                     # React Application (TypeScript)
│   ├── package.json              # Frontend dependencies
│   ├── public/                   # Public assets
│   ├── src/
│   │   ├── App.tsx               # Main React application component
│   │   ├── app/                  # Application-wide setup (e.g., routing)
│   │   ├── components/           # Reusable UI components
│   │   │   └── ui/               # Generic UI elements (e.g., StreamingText)
│   │   ├── constants/            # Application constants
│   │   ├── features/             # Feature-specific modules
│   │   │   ├── analytics/        # Analytics dashboard
│   │   │   ├── auth/             # Authentication screens
│   │   │   ├── chat/             # AI chat interface
│   │   │   ├── dashboard/        # Main dashboard with intelligence panels
│   │   │   │   └── components/   # Dashboard-specific components (MemoryComparePanel, ReasoningPipeline)
│   │   │   ├── deals/            # Deal details and management
│   │   │   └── landing/          # Landing page
│   │   ├── index.tsx             # React app entry point
│   │   ├── services/             # Frontend API client
│   │   ├── store/                # Zustand global state management
│   │   └── utils/                # Utility functions
│   └── tsconfig.json             # TypeScript configuration for frontend
└── render.yaml                   # Render deployment configuration
```

## 🤝 Contributing

We welcome contributions to the Deal Intelligence Agent! If you have suggestions for improvements, new features, or bug fixes, please feel free to:

1.  **Fork** the repository.
2.  **Create** a new branch (`git checkout -b feature/your-feature-name` or `bugfix/your-bug-fix`).
3.  **Make** your changes.
4.  **Commit** your changes (`git commit -m 'feat: Add new amazing feature'`).
5.  **Push** to your branch (`git push origin feature/your-feature-name`).
6.  **Open** a Pull Request, describing your changes and their benefits.

Please ensure your code adheres to the existing style and conventions.

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.