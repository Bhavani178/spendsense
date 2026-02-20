const express = require('express');
const Expense = require('../models/Expense');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.use(protect);

// Get all expenses with filters + pagination
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 15, type, category, startDate, endDate, search } = req.query;
    const query = { user: req.user._id };

    if (type) query.type = type;
    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate)   query.date.$lte = new Date(endDate);
    }

    const total = await Expense.countDocuments(query);
    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({ success: true, expenses, total, pages: Math.ceil(total / limit), currentPage: +page });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create expense
router.post('/', async (req, res) => {
  try {
    const expense = await Expense.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, expense });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update expense
router.put('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!expense) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, expense });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete expense
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!expense) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;