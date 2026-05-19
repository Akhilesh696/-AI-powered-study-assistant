const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'development-secret';

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validate presence of required fields
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check for duplicate username
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // Hash password and store new user
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ username, passwordHash });
    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validate presence of required fields
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare provided password against stored hash
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Sign and return JWT
    const token = jwt.sign(
      { sub: user._id.toString(), username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
module.exports.User = User;
