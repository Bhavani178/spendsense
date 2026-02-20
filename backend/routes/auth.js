const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const router = express.Router();

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ success: false, message: 'Email already registered' });

    const user = await User.create({ name, email, password });
    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, currency: user.currency, monthlyBudget: user.monthlyBudget }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    res.json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, currency: user.currency, monthlyBudget: user.monthlyBudget }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get logged in user
router.get('/me', protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

// Update profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, currency, monthlyBudget } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, currency, monthlyBudget },
      { new: true }
    );
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;