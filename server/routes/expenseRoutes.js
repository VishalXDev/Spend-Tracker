const express = require('express');
const { 
  getExpenses, 
  addExpense, 
  updateExpense, 
  deleteExpense 
} = require('../controller/expenseController');

const router = express.Router();

// GET all expenses
router.get('/', getExpenses);

// POST a new expense
router.post('/', addExpense);

// PUT update an expense
router.put('/:id', updateExpense);

// DELETE an expense
router.delete('/:id', deleteExpense);

module.exports = router;
