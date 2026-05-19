require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai-notes-summarizer';

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

// Warn on missing required environment variables
if (!process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET environment variable is not set. Authentication will not work correctly.');
}
if (!process.env.GROQ_API_KEY) {
  console.warn('WARNING: GROQ_API_KEY environment variable is not set. Summarization will not work correctly.');
}

// Middleware
const allowedOrigins = [
  process.env.CLIENT_ORIGIN || 'http://localhost:5173',
];
// Allow localhost and any *.vercel.app subdomain in production
const allowedOriginPattern = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$|^https:\/\/[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.vercel\.app$/;
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin) || allowedOriginPattern.test(origin)) {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
// Vercel serverless functions have a ~4.5MB request body limit
app.use(express.json({ limit: '4mb' }));
app.use(express.urlencoded({ extended: true, limit: '4mb' }));

// Routes
app.get('/', (req, res) => {
  res.json({ status: 'AI Notes Summarizer backend is running' });
});
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/summarize'));
app.use('/api', require('./routes/upload'));
app.use('/api', require('./routes/chat'));
app.use('/api', require('./routes/history'));

// 404 handler — must come after all routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler — must be last middleware (4 args)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

if (require.main === module) {
  startServer();
}

module.exports = app;
