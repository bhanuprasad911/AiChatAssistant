

```markdown
# AI-Powered Support Assistant 🤖

A full-stack, unified support assistant built with the MERN pattern. This application serves both the React frontend and the Node.js backend from a single Express server on port `5000`.

---

## 🛠️ Tech Stack
- **Frontend:** React.js, Axios, Vite
- **Backend:** Node.js, Express (serving static files)
- **Database:** SQLite (better-sqlite3)
- **AI:** Google Generative AI (Gemini 2.5/3 series)

---

## 📂 Project Architecture



The project uses a monorepo structure where the backend serves as the primary entry point:
- **`backend/`**: Node.js server, SQLite database, and API controllers.
- **`frontend/`**: React source code and the production `dist` folder.
- **Root**: Orchestration scripts to manage both environments.

---

## 📦 Installation & Setup

### 1. Prerequisites
- Node.js (v20+)
- Gemini API Key from Google AI Studio

### 2. Environment Configuration
Create a `.env` file inside the **`backend/`** folder:
```env
GEMINI_API_KEY=your_actual_api_key
PORT=5000

```

### 3. One-Time Dependency Install

From the **Project Root**, install all necessary libraries for both layers:

```bash
npm run install-all

```

---

## 🏃 Running the Application

To build the frontend and launch the unified server in one go, run the following command from the **Project Root**:

```bash
npm run deploy

```

Once the build finishes, access the application at: **[http://localhost:5000]**

---

## 📝 API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/chat` | AI interaction strictly limited to `docs.json` content. |
| `GET` | `/api/conversations/:sessionId` | Fetches historical messages for a specific session. |
| `GET` | `/api/sessions` | Lists all active session IDs stored in SQLite. |

---

## ⚠️ Important Implementation Details

* **Unified Hosting:** The backend uses `express.static` to point to `../frontend/dist`.
* **Catch-All Routing:** A `(.*)` regex route ensures that React Router works correctly during page refreshes.
* **RAG Implementation:** The AI prompt includes a "strict knowledge" instruction to avoid hallucinations and only use data from the local JSON file.
* **Database:** SQLite provides lightweight, file-based persistence for conversation history.

```

---

### Final Verification of your Root `package.json`
To make sure the README instructions work perfectly, ensure your root `package.json` looks exactly like this:

```json
{
  "name": "ai-support-assistant-root",
  "version": "1.0.0",
  "scripts": {
    "install-all": "npm install && cd backend && npm install && cd ../frontend && npm install",
    "deploy": "cd frontend && npm run build && cd ../backend && npm start"
  }
}

```
