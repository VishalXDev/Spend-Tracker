// client/types/index.ts

export interface Expense {
    _id: string;
    amount: number;
    category: string;
    description: string;
    date: string;
  }
  
  export interface ExpenseFormData {
    amount: number;
    category: string;
    description: string;
    date: string;
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
  }
  