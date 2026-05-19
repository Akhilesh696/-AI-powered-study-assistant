# 📚 StudyChat AI

An AI-powered study assistant that lets students upload documents (PDF, DOCX, TXT) and chat with an AI to prepare for exams.

## ✨ Features

- 📄 Upload PDF, DOCX, or TXT study materials
- 🤖 AI-powered document Q&A using Groq (LLaMA 3.3 70B)
- 📝 Automatic note summarization
- 🔐 User authentication (JWT)
- 💬 Persistent chat history

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB (Atlas in production) |
| AI | Groq SDK (LLaMA 3.3 70B) |
| Hosting | Vercel |

## 🚀 Getting Started (Local)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/studychat-ai.git
cd studychat-ai
```

### 2. Set up the Server
```bash
cd server
npm install
cp .env.example .env
# Fill in .env with your real values (see .env.example for guidance)
npm run dev
```

### 3. Set up the Client
```bash
cd client
npm install
cp .env.example .env
# For local dev, VITE_API_URL=http://localhost:3001
npm run dev
```

The app will be available at `http://localhost:5173`

## ☁️ Deploy to Vercel

### Prerequisites
- [Vercel account](https://vercel.com)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free cluster
- [Groq API key](https://console.groq.com)

### Steps

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. Add the following **Environment Variables** in Vercel project settings:

| Variable | Value |
|----------|-------|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A long random string |
| `GROQ_API_KEY` | Your Groq API key |
| `CLIENT_ORIGIN` | Your Vercel deployment URL (e.g. `https://studychat-ai.vercel.app`) |

4. Click **Deploy** ✅

> **Note:** File uploads are limited to **4MB** on Vercel due to serverless function constraints.

## 📁 Project Structure

```
studychat-ai/
├── api/
│   └── index.js          # Vercel serverless entry point
├── client/               # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── vite.config.js
├── server/               # Express backend
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
└── vercel.json           # Vercel deployment config
```

## 📄 License

MIT
