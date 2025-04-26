import React, { useState, useEffect } from 'react';
import { ExpenseFormData } from '../types';

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => void;
  initialData?: ExpenseFormData;
  onCancel?: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: initialData?.amount || 0,
    category: initialData?.category || '',
    description: initialData?.description || '',
    date: initialData?.date || '',
  });

  const [formErrors, setFormErrors] = useState({
    amount: '',
    category: '',
    date: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Basic form validation on change
    if (name === 'amount' && !value) {
      setFormErrors({ ...formErrors, amount: 'Amount is required' });
    } else if (name === 'category' && !value) {
      setFormErrors({ ...formErrors, category: 'Category is required' });
    } else if (name === 'date' && !value) {
      setFormErrors({ ...formErrors, date: 'Date is required' });
    } else {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount && formData.category && formData.date) {
      onSubmit(formData);
    } else {
      // Basic validation before submission
      if (!formData.amount) setFormErrors((prev) => ({ ...prev, amount: 'Amount is required' }));
      if (!formData.category) setFormErrors((prev) => ({ ...prev, category: 'Category is required' }));
      if (!formData.date) setFormErrors((prev) => ({ ...prev, date: 'Date is required' }));
    }
  };

  // Format the amount to INR currency
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 space-y-6 max-w-lg mx-auto">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
        <input
          id="amount"
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          required
        />
        {formErrors.amount && <p className="text-red-500 text-xs">{formErrors.amount}</p>}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
        <input
          id="category"
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          required
        />
        {formErrors.category && <p className="text-red-500 text-xs">{formErrors.category}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <input
          id="description"
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
        <input
          id="date"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          required
        />
        {formErrors.date && <p className="text-red-500 text-xs">{formErrors.date}</p>}
      </div>

      <div className="flex justify-between items-center">
        <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
          Submit
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-200"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="mt-4">
        {/* Display the formatted amount for INR */}
        <p className="text-lg font-semibold text-gray-900">Amount: {formatAmount(formData.amount)}</p>
      </div>
    </form>
  );
};

export default ExpenseForm;
