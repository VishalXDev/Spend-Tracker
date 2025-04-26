import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import Dashboard from '../components/Dashboard';
import ErrorAlert from '../components/ErrorAlert';
import { fetchExpenses, createExpense, updateExpense, deleteExpense } from '../service/apiService';
import { Expense, ExpenseFormData } from '../types';
import '../globals.css';

const IndexPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [view, setView] = useState<'dashboard' | 'list'>('dashboard');

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    setLoading(true);
    const response = await fetchExpenses();
    setLoading(false);

    if (response.success && response.data) {
      setExpenses(response.data);
    } else {
      setError(response.error || 'Failed to load expenses');
    }
  };

  const handleAddExpense = useCallback(async (formData: ExpenseFormData) => {
    const response = await createExpense(formData);
    if (response.success && response.data) {
      setExpenses((prevExpenses) => [...prevExpenses, response.data!]);
      setError(null);
    } else {
      setError(response.error || 'Failed to add expense');
    }
  }, []);

  const handleUpdateExpense = useCallback(async (formData: ExpenseFormData) => {
    if (!editingExpense) return;

    const response = await updateExpense(editingExpense._id, formData);

    if (response.success && response.data) {
      setExpenses((prevExpenses) =>
        prevExpenses
          .map((exp) =>
            exp._id === editingExpense._id ? response.data : exp
          )
          .filter((exp): exp is Expense => exp !== undefined)
      );
      setEditingExpense(null);
      setError(null);
    } else {
      setError(response.error || 'Failed to update expense');
    }
  }, [editingExpense]);

  const handleDeleteExpense = useCallback(async (id: string) => {
    const response = await deleteExpense(id);

    if (response.success) {
      setExpenses((prevExpenses) =>
        prevExpenses.filter((exp) => exp._id !== id)
      );
      setError(null);
    } else {
      setError(response.error || 'Failed to delete expense');
    }
  }, []);

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  const handleFormSubmit = (formData: ExpenseFormData) => {
    if (editingExpense) {
      handleUpdateExpense(formData);
    } else {
      handleAddExpense(formData);
    }
  };

  return (
    <Layout title="Expense Tracker - Dashboard">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-indigo-600 text-white p-6 hidden lg:block">
          <h2 className="text-xl font-semibold mb-6">Expense Tracker</h2>
          <nav>
            <ul>
              <li className="mb-4">
                <button
                  onClick={() => setView('dashboard')}
                  className={`w-full text-left px-4 py-2 rounded-md ${view === 'dashboard' ? 'bg-indigo-700' : ''}`}
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setView('list')}
                  className={`w-full text-left px-4 py-2 rounded-md ${view === 'list' ? 'bg-indigo-700' : ''}`}
                >
                  Expense List
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Expense Tracker</h1>
            <div className="space-x-4">
              <button
                onClick={() => setView('dashboard')}
                className={`px-6 py-2 text-sm font-medium rounded-md ${view === 'dashboard' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600'}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-6 py-2 text-sm font-medium rounded-md ${view === 'list' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600'}`}
              >
                Expense List
              </button>
            </div>
          </div>

          {/* Error Alert */}
          {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

          {/* Expense Form */}
          <ExpenseForm
            onSubmit={handleFormSubmit}
            initialData={editingExpense || undefined}
            onCancel={editingExpense ? handleCancelEdit : undefined}
          />

          {/* Loading Indicator */}
          {loading && <div className="loader"></div>}

          {/* Content */}
          <div className="mt-8">
            {view === 'dashboard' ? (
              <Dashboard expenses={expenses} />
            ) : (
              <ExpenseList expenses={expenses} onEdit={handleEdit} onDelete={handleDeleteExpense} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default IndexPage;
