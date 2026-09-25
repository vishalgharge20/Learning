# Personal Learning Space

A modern technical learning application built for developer and QA engineering mastery. It features structured modular curricula, deterministic spaced-repetition recall, interactive scenario-based practice, knowledge assessments, a real-world defect journal, and a context-connected AI mentor.

The initial active specialization is **XR QA** (Virtual, Augmented, and Mixed Reality Quality Assurance), built upon an extensible, subject-agnostic multi-discipline architecture.

---

## 🚀 Key Features

- **Multi-Subject Architecture**:
  - Global Subject Home screen (`/subjects`) displaying active and upcoming tracks.
  - Reusable routing (`/subjects/:subjectId/...`) allowing new technical subjects (Playwright, Python, JavaScript, Unity) to be plugged in seamlessly.
- **XR QA Curriculum (24 Modules)**:
  - From QA Fundamentals and Unity Internals to OpenXR, AR Foundation, Profiling, Shaders, Spatial Audio, and ADB Logcat debugging.
  - Hierarchical structure: **Subject → Modules → Topics → Concepts**.
  - Each concept includes technical explanations, why it matters for QA, target XR examples, production failure cases, common pitfalls, and key takeaways.
- **Deterministic Spaced Recall**:
  - Memory decay calculation based on elapsed time, consecutive correct answers, and difficulty.
  - Active recall flashcard deck with rating feedback (`Again`, `Hard`, `Good`, `Easy`) that recalculates memory retention curves automatically.
- **QA Scenario Practice Mode**:
  - Hands-on investigative scenarios (e.g., room transition frame drops from 72 to 35 FPS, grab interactable physics failures, outdoor plane detection loss).
  - Step-by-step diagnostic guidance, hints, rationales, ADB command overlays, and lead QA model solutions.
- **Knowledge Assessment (Quiz Mode)**:
  - Scenario, multiple choice, and true/false questions targeting frame budgets, bottleneck isolation, lifecycle timing, and tracking degradation.
  - Instant explanations, QA takeaways, and automatic weak concept tagging.
- **Weak Areas & Remediation**:
  - Real-time aggregation of concepts where accuracy is low (&lt;60%), memory retention is decaying, or mistakes have been logged.
- **Real-World Bug Journal**:
  - Tracks physical & digital preconditions, reproduction steps, expected vs. actual results, ADB logcat snippets, root causes, resolutions, and lessons learned.
- **Context-Aware AI Mentor**:
  - Real-time connection to the student's active subject, concept, weak areas, and progress metrics.
  - Quick action chips: *"Explain this topic with an XR bug example"*, *"Give me a tough practice scenario"*, *"What am I forgetting?"*, *"Test me"*.
  - Clean provider abstraction: works out of the box with an intelligent contextual offline mentor, and connects to Gemini or OpenAI when an API key is provided.

---

## 🛠️ Tech Stack

- **Frontend**:
  - React 18
  - Vite 6
  - JavaScript (ESNext)
  - Ant Design 5 (customized with dark developer theme tokens)
  - SCSS (modular design tokens and mixins)
  - React Router v6
- **Backend**:
  - Node.js (v20+)
  - Express
  - JSON-backed persistent data layer with automated seed fallback
  - MongoDB / Mongoose ready model schemas
- **AI Service Abstraction**:
  - Provider interface supporting Contextual Mock, Google Gemini (`gemini-1.5-flash`), and OpenAI.

---

## 📁 Folder Structure

```
personal-learning-space/
├── .env.example              # Environment variables template
├── .gitignore
├── index.html                # Vite HTML shell with typography links
├── package.json              # Unified root scripts & dependencies
├── README.md                 # Full system documentation
├── vite.config.js            # Vite configuration with API reverse proxy
├── server/
│   ├── index.js              # Express API server entry point
│   ├── models/
│   │   └── schemas.js        # MongoDB / Mongoose ready data schema specifications
│   ├── routes/
│   │   ├── subjectRoutes.js  # Subject and curriculum endpoints
│   │   ├── recallRoutes.js   # Spaced repetition endpoints
│   │   ├── practiceRoutes.js # Scenario practice endpoints
│   │   ├── quizRoutes.js     # Quiz endpoints
│   │   ├── bugRoutes.js      # Bug journal CRUD endpoints
│   │   ├── noteRoutes.js     # Knowledge notes CRUD endpoints
│   │   ├── aiRoutes.js       # AI chat and status endpoints
│   │   └── searchRoutes.js   # Global workspace search endpoint
│   ├── services/
│   │   ├── dataStore.js      # Persistent storage & seed manager
│   │   ├── recallService.js  # Spaced repetition decay & interval calculations
│   │   ├── progressService.js# Progress aggregation & weak area analysis
│   │   └── aiService.js      # Multi-provider AI Mentor abstraction
│   └── seed/
│       ├── subjectsData.js   # Seed subjects (XR QA, Playwright, Python, etc.)
│       ├── xrQaCurriculum.js # Complete 24-module XR QA curriculum
│       ├── initialProgressData.js # Seed user progress for Vishal
│       ├── practiceData.js   # QA diagnostic scenarios
│       ├── quizData.js       # Knowledge assessment questions
│       ├── bugsData.js       # Real-world XR defect records
│       └── notesData.js      # Cheat sheets & technical reference notes
└── src/
    ├── main.jsx              # React client entry point
    ├── App.jsx               # Theme configuration & application routes
    ├── api/
    │   └── client.js         # Centralized API client
    ├── context/
    │   ├── SubjectContext.jsx# Global subject state & switching
    │   └── LearningContext.jsx# Progress, weak areas, recall, and search state
    ├── styles/
    │   ├── _variables.scss   # Color tokens, fonts, spacing, shadows
    │   ├── _mixins.scss      # Reusable SCSS layout utilities
    │   └── global.scss       # Global CSS reset & Ant Design overrides
    ├── components/
    │   ├── layout/
    │   │   ├── AppLayout.jsx # Shell layout
    │   │   ├── Sidebar.jsx   # Collapsible sidebar with dynamic badges
    │   │   ├── TopBar.jsx    # Header with search trigger & profile
    │   │   └── SearchModal.jsx# Global quick search modal (Ctrl+K)
    │   └── common/
    │       └── Components.jsx# ProgressBar, StatusBadge, DifficultyTag, MetricCard
    └── pages/
        ├── Home/             # Global Subjects Home
        ├── Dashboard/        # Subject Dashboard (matching approved spec)
        ├── Learn/            # Curriculum Tree & Concept Detail Pages
        ├── Recall/           # Spaced Revision Flashcards
        ├── Practice/         # Scenario Diagnostic Lab
        ├── Quiz/             # Interactive Quiz Assessment
        ├── Bugs/             # XR Defect Journal
        ├── Progress/         # Telemetry & Mastery Analytics
        ├── Knowledge/        # Reference Notes & Cheat Sheets
        ├── AITeacher/        # Context-Aware AI Mentor Chat
        └── NotFound/         # 404 handler
```

---

## ⚙️ Installation & Running

### Prerequisites
- Node.js `v20` or higher
- npm `v9` or higher

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
Copy `.env.example` to `.env`:
```bash
copy .env.example .env
```
*Note: The application runs fully functional without any external API keys out of the box.*

### 3. Development Mode
Run both the Express backend and the Vite development server concurrently:
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5001/api/health`

### 4. Production Build & Server
To build the optimized static assets and serve them from Express:
```bash
npm run build
npm start
```
- The production app will be accessible at: `http://localhost:5001`

---

## 🧠 How the Learning & Spaced Recall Architecture Works

### Concept Lifecycle States
Each concept progresses through five discrete stages:
1. `not_started`: Fresh concept in the curriculum.
2. `learning`: Currently studying fundamental explanations and examples.
3. `practicing`: Engaging in scenario practice or quizzes.
4. `learned`: Successfully mastered with high confidence and quiz scores.
5. `needs_review`: Flagged automatically by the spaced recall engine when retention decays or mistakes occur.

### Spaced Recall Engine
Retention strength decays over time based on an exponential decay curve:
$$\text{Strength} = \text{InitialStrength} \times 0.5^{(\text{DaysElapsed} / \text{HalfLife})}$$
- **Base Half-Life**: 6 days for Beginner, 4 days for Intermediate, 2.5 days for Advanced.
- **Consecutive Correct Bonus**: Each consecutive correct answer extends the half-life by 2 days.
- **Mistake Penalty**: Each logged mistake reduces retention strength.
- Concepts whose retention drops below 70% or which have the status `needs_review` are scheduled for **Today's Revision**.

---

## 🤖 Future AI Integration (Gemini / OpenAI)

The AI layer in `server/services/aiService.js` uses a clean provider strategy:
```javascript
class AIService {
  initProvider() {
    if (process.env.GEMINI_API_KEY && process.env.AI_PROVIDER === 'gemini') {
      this.provider = new GeminiProvider(process.env.GEMINI_API_KEY);
    } else if (process.env.OPENAI_API_KEY && process.env.AI_PROVIDER === 'openai') {
      this.provider = new OpenAIProvider(process.env.OPENAI_API_KEY);
    } else {
      this.provider = new ContextualMockProvider();
    }
  }
}
```
To enable Gemini:
1. Add your key to `.env`:
   ```env
   GEMINI_API_KEY=AIzaSy...
   AI_PROVIDER=gemini
   ```
2. Restart the server. The UI will seamlessly route questions to Gemini with full curriculum context injected automatically.

---

## 🗄️ Future MongoDB Integration

All entity schemas in `server/models/schemas.js` are designed to map 1:1 to Mongoose schemas.
When attaching MongoDB:
1. Add `mongoose` dependency: `npm install mongoose`
2. Configure `MONGODB_URI` in `.env`.
3. In `server/services/dataStore.js`, swap the in-memory array operations with standard Mongoose model queries (`Subject.find()`, `Concept.findOne()`, etc.). The client and route interfaces require zero changes.

---

## ➕ How to Add a New Subject

Because the architecture is fully decoupled from XR QA:
1. Open `server/seed/subjectsData.js` and add your subject (e.g., `playwright`, `python`):
   ```javascript
   {
     id: 'playwright',
     title: 'Playwright',
     subtitle: 'Modern End-to-End Test Automation',
     status: 'active',
     moduleCount: 12,
     progress: 0
   }
   ```
2. Create your curriculum file `server/seed/playwrightCurriculum.js` structured by modules, topics, and concepts.
3. Register it in `server/services/dataStore.js` under `this.data.curriculums['playwright']`.
4. Navigating to `/subjects/playwright` immediately generates the full dashboard, curriculum tree, practice lab, quizzes, and recall schedule for Playwright!
