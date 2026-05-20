# Project Report: AI-Powered Study Assistant (StudyChat-AI)

---

## 1. Project Overview

**Project Name:** StudyChat-AI — AI-Powered Study Assistant  
**Type:** Full-Stack Web Application  
**Purpose:** To help students upload their study documents (notes, textbooks, PDFs) and interact with an AI chatbot to get summaries, exam questions, and context-aware answers — all in one platform.

---

## 2. Objectives

- Allow users to **register and log in** securely using JWT-based authentication.
- Enable users to **paste notes** and receive AI-generated summaries instantly.
- Allow users to **upload documents** (PDF, DOCX, TXT) and start an AI-powered Q&A chat session based on the document's content.
- Store and display a **history** of all past summaries and chat sessions.
- Provide a clean, modern dark-themed UI accessible from any browser.

---

## 3. System Architecture

The project follows a **3-tier client-server architecture**:

```
┌─────────────────────────────────────────┐
│           CLIENT (React + Vite)          │
│  - Runs on: http://localhost:5173        │
│  - Pages: Dashboard, StudyChat,          │
│    History, Login, Register              │
└────────────────┬────────────────────────┘
                 │ HTTP (via Vite Proxy /api → :3001)
┌────────────────▼────────────────────────┐
│         SERVER (Node.js + Express)       │
│  - Runs on: http://localhost:3001        │
│  - Routes: /api/auth, /api/summarize,   │
│    /api/upload, /api/chat, /api/history  │
│  - AI: Groq API (llama-3.3-70b model)   │
└────────────────┬────────────────────────┘
                 │ Mongoose ODM
┌────────────────▼────────────────────────┐
│       DATABASE (MongoDB Atlas)           │
│  - Cluster: Tracker (gyarhzp.mongodb)   │
│  - Database: studychat-ai               │
│  - Collections: users, histories        │
└─────────────────────────────────────────┘
```

---

## 4. Technology Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.3.1 | UI component framework |
| React Router DOM | 6.24.0 | Client-side routing |
| Vite | 5.3.3 | Build tool & dev server |
| Tailwind CSS | 3.4.6 | Utility-first CSS styling |
| Axios | 1.7.2 | HTTP client for API calls |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | ≥ 18.x | JavaScript runtime |
| Express | 4.19.2 | Web server framework |
| Mongoose | 7.5.0 | MongoDB ODM |
| bcryptjs | 2.4.3 | Password hashing |
| jsonwebtoken | 9.0.2 | JWT authentication |
| Multer | 1.4.5 | File upload handling |
| pdf-parse | 1.1.1 | PDF text extraction |
| mammoth | 1.12.0 | DOCX text extraction |
| dotenv | 16.4.5 | Environment variable management |
| cors | 2.8.5 | Cross-Origin Resource Sharing |
| nodemon | 3.1.4 | Auto-restart during development |

### AI / External Services
| Service | Purpose |
|---|---|
| **Groq API** (llama-3.3-70b) | AI chat & summarization engine |
| **MongoDB Atlas** | Cloud-hosted database |

---

## 5. Project Folder Structure

```
fsd pro2/
├── client/                   # React frontend
│   ├── src/
│   │   ├── App.jsx           # Root component + routes
│   │   ├── main.jsx          # Entry point
│   │   ├── index.css         # Global styles
│   │   ├── pages/
│   │   │   ├── Login.jsx         # Login form
│   │   │   ├── Register.jsx      # Registration form
│   │   │   ├── Dashboard.jsx     # Note summarizer + recent history
│   │   │   ├── StudyChat.jsx     # Document upload + AI chat
│   │   │   └── History.jsx       # Full history viewer
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Sticky navigation bar
│   │   │   ├── FileUpload.jsx    # Drag-and-drop file uploader
│   │   │   ├── ChatWindow.jsx    # Chat message display
│   │   │   ├── SummaryCard.jsx   # Summary result display
│   │   │   └── Loader.jsx        # Loading spinner
│   │   └── services/
│   │       ├── authService.js    # Login, register, token management
│   │       ├── chatService.js    # File upload + chat API calls
│   │       ├── summaryService.js # Note summarization API calls
│   │       └── historyService.js # History fetch + delete API calls
│   ├── vite.config.js        # Vite + proxy config
│   └── package.json
│
├── server/                   # Express backend
│   ├── server.js             # App entry point + middleware
│   ├── routes/
│   │   ├── auth.js           # Register & login endpoints
│   │   ├── summarize.js      # Note summarization endpoint
│   │   ├── upload.js         # File upload + text extraction
│   │   ├── chat.js           # AI chat endpoint
│   │   └── history.js        # History CRUD endpoints
│   ├── models/               # Mongoose data models
│   ├── middleware/           # JWT auth middleware
│   ├── utils/                # Helper utilities
│   └── .env                  # Environment variables
│
├── package.json              # Root scripts (dev:client, dev:server)
└── vercel.json               # Vercel deployment config
```

---

## 6. Module Descriptions

### 6.1 Authentication Module

**Files:** `routes/auth.js`, `services/authService.js`, `pages/Login.jsx`, `pages/Register.jsx`

- Users can **Register** with a unique username and password.
- Passwords are **hashed using bcryptjs** (salt rounds: 10) before storage — never stored in plain text.
- On **Login**, the server verifies the password hash and returns a **JWT token** valid for 24 hours.
- The JWT is stored in the browser's `localStorage` and sent in the `Authorization: Bearer <token>` header with every API request.
- The Navbar dynamically shows **Login/Register** for unauthenticated users and **Dashboard/Study Chat/History/Logout** for authenticated users.

### 6.2 Dashboard & Note Summarizer

**Files:** `pages/Dashboard.jsx`, `services/summaryService.js`, `routes/summarize.js`

- The Dashboard is the **main landing page** after login.
- Users paste raw text notes into a textarea and click **"Generate Summary"**.
- The request is sent to `/api/summarize`, which forwards it to the **Groq AI API**.
- The AI generates a concise, structured summary of the notes.
- The result is displayed in a `SummaryCard` component.
- The Dashboard also shows a **"Recent Activity"** panel with the last 3 history items.

### 6.3 Study Chat (Document Q&A)

**Files:** `pages/StudyChat.jsx`, `components/FileUpload.jsx`, `components/ChatWindow.jsx`, `services/chatService.js`, `routes/upload.js`, `routes/chat.js`

This is the **core feature** of the application:

1. Users upload a **PDF, DOCX, or TXT** file using drag-and-drop or file picker.
2. The server extracts the text (`pdf-parse` for PDF, `mammoth` for DOCX, plain read for TXT).
3. The extracted text is sent back to the client as the "document context".
4. The AI **automatically generates a structured summary** of the document upon upload.
5. Users can then **ask any question** about the document in a chat interface.
6. **Quick suggestion chips** are provided: "What are the key topics?", "Give me 5 likely exam questions", etc.
7. The left panel shows the **upload zone** and a **text preview** of the extracted content.
8. The right panel is the **chat window** showing the full conversation history.
9. Users press **Enter** to send messages (Shift+Enter for newline).
10. The AI model used is **llama-3.3-70b via Groq** — described as "Context-aware answers".

### 6.4 History Module

**Files:** `pages/History.jsx`, `services/historyService.js`, `routes/history.js`

- Stores all past **summaries** and **chat sessions** per user.
- History items display: type (Summary / Chat), title, timestamp.
- For summaries: shows the original note text and the generated summary (first 220 chars).
- For chats: shows the last 2 messages of the conversation.
- Users can **delete** individual history items.
- The Dashboard shows the **latest 3 items** as a quick preview.

### 6.5 Navbar Component

**File:** `components/Navbar.jsx`

- **Sticky** navigation bar with glassmorphism effect (`backdrop-filter: blur(12px)`).
- Brand logo: "🧠 AI Notes Summarizer" with a purple-to-blue gradient.
- Active page link highlighted with a purple pill background.
- Logout clears the JWT from localStorage and redirects to `/login`.

---

## 7. API Endpoints

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Register a new user |
| POST | `/api/auth/login` | ❌ | Login and receive JWT token |
| POST | `/api/summarize` | ✅ | Summarize pasted notes using AI |
| POST | `/api/upload` | ✅ | Upload file and extract text |
| POST | `/api/chat` | ✅ | Send a chat message with document context |
| GET | `/api/history` | ✅ | Fetch all history items for user |
| DELETE | `/api/history/:id` | ✅ | Delete a specific history item |
| GET | `/` | ❌ | Server health check |

---

## 8. Database Design (MongoDB)

### Collection: `users`
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Auto-generated unique ID |
| `username` | String | Unique username |
| `passwordHash` | String | bcrypt hashed password |
| `createdAt` | Date | Auto timestamp |

### Collection: `histories`
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Auto-generated unique ID |
| `userId` | ObjectId | Reference to the user |
| `type` | String | `"summary"` or `"chat"` |
| `title` | String | Auto-generated title |
| `note` | String | Original note text (for summaries) |
| `summary` | String | AI-generated summary (for summaries) |
| `messages` | Array | Full chat conversation (for chats) |
| `createdAt` | Date | Timestamp of creation |

---

## 9. Security Features

| Feature | Implementation |
|---|---|
| Password hashing | bcryptjs with 10 salt rounds |
| Authentication | JWT tokens, 24-hour expiry |
| Protected routes | Bearer token in Authorization header |
| CORS protection | Whitelist: localhost + *.vercel.app |
| Request size limit | 4MB JSON body limit |
| Env variable safety | `.env` file (not committed to Git) |
| Duplicate prevention | Unique username check on registration |

---

## 10. Key Features Summary

| # | Feature | Description |
|---|---|---|
| 1 | User Registration & Login | Secure auth with JWT |
| 2 | Note Summarizer | Paste text → get AI summary |
| 3 | Document Upload | PDF, DOCX, TXT support |
| 4 | AI Study Chat | Q&A conversation with document context |
| 5 | Auto Summary on Upload | Document is summarized automatically when uploaded |
| 6 | Quick Question Chips | Pre-built exam-focused question shortcuts |
| 7 | History Tracking | All summaries and chats saved and viewable |
| 8 | History Deletion | Users can delete individual history items |
| 9 | Recent Activity Dashboard | Latest 3 items shown on Dashboard |
| 10 | Responsive Dark UI | Gradient dark theme, glassmorphism navbar |

---

## 11. UI Design

- **Color Scheme:** Dark theme — deep navy/purple gradients (`#0f0c1a → #1a1028 → #0f172a`)
- **Accent Color:** Purple (`#7c3aed`, `#a78bfa`) and Blue (`#60a5fa`)
- **Typography:** System font stack, gradient text for headings
- **Navbar:** Glassmorphism with `backdrop-filter: blur(12px)`, sticky positioned
- **Cards:** Rounded corners (`border-radius: 16–20px`), semi-transparent backgrounds
- **Animations:** Bounce animation for typing indicator, hover transitions on buttons

---

## 12. How to Run the Project

### Prerequisites
- Node.js ≥ 18.x
- npm

### Steps

```bash
# 1. Start the backend server (port 3001)
npm run dev:server

# 2. Start the frontend client (port 5173)
npm run dev:client

# 3. Open in browser
http://localhost:5173
```

### Environment Variables (server/.env)
```
JWT_SECRET=notesappsecretkey
GROQ_API_KEY=<your_groq_api_key>
PORT=3001
MONGO_URI=<your_mongodb_atlas_uri>
CLIENT_ORIGIN=http://localhost:5173
```

---

## 13. Deployment

The project is configured for **Vercel** deployment (via `vercel.json`):
- Frontend is built with `npm run build` in the `client/` directory.
- Backend API runs as Vercel serverless functions.
- CORS is configured to allow all `*.vercel.app` subdomains.

---

## 14. Known Issues / Observations

> [!WARNING]
> **MongoDB Connectivity Issue Detected**  
> During testing, the following error was observed in server logs:  
> `MongoServerSelectionError: getaddrinfo ENOTFOUND ac-50amgmu-shard-00-01.gyarhzp.mongodb.net`  
> This means the MongoDB Atlas cluster **cannot be reached from the current network**.  
> **Possible causes:**  
> - Your IP address is not whitelisted in MongoDB Atlas Network Access settings.  
> - No internet connection or DNS resolution failure.  
> **Fix:** Go to MongoDB Atlas → Network Access → Add IP Address → Add your current IP or use `0.0.0.0/0` for development.

---

## 15. Conclusion

StudyChat-AI is a well-structured, full-stack AI-powered study assistant that demonstrates effective use of modern web technologies. It combines:
- A **React + Vite** frontend for a fast, responsive user experience.
- An **Express + Node.js** backend for secure API management.
- **MongoDB Atlas** for cloud-based persistent data storage.
- **Groq's LLaMA 3.3-70B** AI model for intelligent, context-aware responses.

The application solves a real student problem — making studying more efficient by allowing document-based AI conversations and automated summarization — and is designed for both local development and cloud deployment on Vercel.
