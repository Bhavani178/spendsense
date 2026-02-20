const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:    { type: String, required: true, trim: true },
  amount:   { type: Number, required: true, min: 0.01 },
  type:     { type: String, enum: ['income', 'expense'], required: true },
  category: {
    type: String, required: true,
    enum: [
      'Food & Dining', 'Transportation', 'Housing', 'Entertainment',
      'Healthcare', 'Shopping', 'Education', 'Personal Care',
      'Travel', 'Utilities', 'Salary', 'Freelance', 'Investment', 'Gift', 'Other'
    ]
  },
  date:          { type: Date, default: Date.now },
  notes:         { type: String, maxlength: 500 },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'UPI', 'Other'],
    default: 'Cash'
  }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);