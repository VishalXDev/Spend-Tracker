import { Expense, ExpenseFormData, ApiResponse } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const fetchExpenses = async (): Promise<ApiResponse<Expense[]>> => {
  try {
    const response = await fetch(`${API_URL}/expenses`);
    const data: ApiResponse<Expense[]> = await response.json(); // Specify the expected response type here
    return data;
  } catch (error) {
    // Ensure that `error` is not of type `any`
    console.error(error);
    return {
      success: false,
      error: 'Failed to fetch expenses. Please try again later.'
    };
  }
};

export const createExpense = async (expenseData: ExpenseFormData): Promise<ApiResponse<Expense>> => {
  try {
    const response = await fetch(`${API_URL}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expenseData),
    });
    const data: ApiResponse<Expense> = await response.json(); // Specify the expected response type here
    return data;
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: 'Failed to create expense. Please try again later.'
    };
  }
};

export const updateExpense = async (id: string, expenseData: ExpenseFormData): Promise<ApiResponse<Expense>> => {
  try {
    const response = await fetch(`${API_URL}/expenses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expenseData),
    });
    const data: ApiResponse<Expense> = await response.json(); // Specify the expected response type here
    return data;
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: 'Failed to update expense. Please try again later.'
    };
  }
};

export const deleteExpense = async (id: string): Promise<ApiResponse<{ message: string }>> => {
  try {
    const response = await fetch(`${API_URL}/expenses/${id}`, {
      method: 'DELETE',
    });
    const data: ApiResponse<{ message: string }> = await response.json(); // Specify the expected response type here
    return data;
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: 'Failed to delete expense. Please try again later.'
    };
  }
};
