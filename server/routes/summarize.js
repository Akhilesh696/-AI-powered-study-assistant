const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const geminiUtil = require('../utils/geminiUtil');
const History = require('../models/History');

const router = express.Router();

/**
 * POST /summarize
 * Protected route — requires a valid Bearer JWT.
 * Validates the note field, calls Gemini, and returns the summary.
 */
router.post('/summarize', authMiddleware, async (req, res) => {
  const { note } = req.body;

  // Requirement 4.2: reject empty or whitespace-only notes without calling Gemini
  if (!note || !note.trim()) {
    return res.status(400).json({ error: 'Note cannot be empty' });
  }

  try {
    // Requirement 4.1: call Gemini and return the summary
    const summary = await geminiUtil.summarize(note);

    // Save the generated summary for the user history
    await History.create({
      userId: req.user.sub,
      type: 'summary',
      title: note.slice(0, 60).trim() || 'Quick summary',
      note,
      summary,
    });

    return res.status(200).json({ summary });
  } catch (err) {
    // Requirement 4.3: return 502 with sanitized message on Gemini error
    return res.status(502).json({ error: err.message || 'Failed to generate summary. Please try again.' });
  }
});

module.exports = router;
