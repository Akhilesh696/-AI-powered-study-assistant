const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { chat } = require('../utils/geminiUtil');
const History = require('../models/History');

const router = express.Router();

/**
 * POST /api/chat
 * Protected — send a question with document context and conversation history.
 * Body: { context: string, messages: [{ role, content }] }
 */
router.post('/chat', authMiddleware, async (req, res) => {
  const { context, messages } = req.body;

  if (!context || !context.trim()) {
    return res.status(400).json({ error: 'Document context is required.' });
  }

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required.' });
  }

  try {
    const reply = await chat(context, messages);

    await History.create({
      userId: req.user.sub,
      type: 'chat',
      title: messages.find((m) => m.role === 'user')?.content?.slice(0, 60).trim() || 'Chat session',
      context,
      messages,
      response: reply,
    });

    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(502).json({ error: err.message || 'Failed to get a response. Please try again.' });
  }
});

module.exports = router;
