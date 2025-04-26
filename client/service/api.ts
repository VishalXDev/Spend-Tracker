import axios from 'axios';
import { Expense, ExpenseFormData } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const getExpenses = async (): Promise<Expense[]> => {
  const response = await axios.get(`${API_URL}/expenses`);
  return response.data;
};

export const createExpense = async (expense: ExpenseFormData): Promise<Expense> => {
  const response = await axios.post(`${API_URL}/expenses`, expense);
  return response.data;
};

export const updateExpense = async (id: string, expense: ExpenseFormData): Promise<Expense> => {
  const response = await axios.put(`${API_URL}/expenses/${id}`, expense);
  return response.data;
};

export const deleteExpense = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/expenses/${id}`);
};
