const express = require('express');
const Expense = require('../models/Expense');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.use(protect);

router.get('/summary', async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth   = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const monthlyData = await Expense.aggregate([
      { $match: { user: req.user._id, date: { $gte: startOfMonth, $lte: endOfMonth } } },
      { $group: { _id: '$type', total: { $sum: '$amount' } } }
    ]);

    const totalIncome  = monthlyData.find(d => d._id === 'income')?.total  || 0;
    const totalExpense = monthlyData.find(d => d._id === 'expense')?.total || 0;

    const categoryBreakdown = await Expense.aggregate([
      { $match: { user: req.user._id, type: 'expense', date: { $gte: startOfMonth, $lte: endOfMonth } } },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const monthlyTrend = await Expense.aggregate([
      { $match: { user: req.user._id, date: { $gte: sixMonthsAgo } } },
      { $group: { _id: { year: { $year: '$date' }, month: { $month: '$date' }, type: '$type' }, total: { $sum: '$amount' } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const recentTransactions = await Expense.find({ user: req.user._id }).sort({ date: -1 }).limit(5);

    res.json({
      success: true,
      summary: {
        totalIncome,
        totalExpense,
        netBalance: totalIncome - totalExpense,
        savingsRate: totalIncome > 0 ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1) : 0
      },
      categoryBreakdown,
      monthlyTrend,
      recentTransactions
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;