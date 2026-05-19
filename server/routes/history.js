const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const History = require('../models/History');

const router = express.Router();

/**
 * GET /api/history
 * Returns the authenticated user's recent history items.
 */
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const history = await History.find({ userId: req.user.sub })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return res.status(200).json({ history });
  } catch (err) {
    console.error('History fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch history. Please try again.' });
  }
});

/**
 * DELETE /api/history/:id
 * Delete one item from the authenticated user's history.
 */
router.delete('/history/:id', authMiddleware, async (req, res) => {
  try {
    const result = await History.findOneAndDelete({ _id: req.params.id, userId: req.user.sub });
    if (!result) {
      return res.status(404).json({ error: 'History item not found' });
    }
    return res.status(200).json({ message: 'History item deleted' });
  } catch (err) {
    console.error('History delete error:', err);
    return res.status(500).json({ error: 'Failed to delete history item. Please try again.' });
  }
});

module.exports = router;
