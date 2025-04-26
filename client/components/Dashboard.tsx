import React, { useEffect, useState } from 'react';
import { Expense } from '../types';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface DashboardProps {
  expenses: Expense[];
}

interface CategoryTotal {
  [key: string]: number;
}

interface MonthlyData {
  [key: string]: {
    total: number;
    count: number;
  };
}

const Dashboard: React.FC<DashboardProps> = ({ expenses }) => {
  const [categoryTotals, setCategoryTotals] = useState<CategoryTotal>({});
  const [monthlyData, setMonthlyData] = useState<MonthlyData>({});
  const [topExpenses, setTopExpenses] = useState<Expense[]>([]);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    // Filter expenses based on selected timeframe
    const now = new Date();
    const filteredExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      if (timeframe === 'week') {
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(now.getDate() - 7);
        return expenseDate >= oneWeekAgo;
      } else if (timeframe === 'month') {
        const oneMonthAgo = new Date(now);
        oneMonthAgo.setMonth(now.getMonth() - 1);
        return expenseDate >= oneMonthAgo;
      } else if (timeframe === 'year') {
        const oneYearAgo = new Date(now);
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        return expenseDate >= oneYearAgo;
      }
      return true;
    });

    // Calculate category totals
    const catTotals: CategoryTotal = {};
    filteredExpenses.forEach(expense => {
      const { category, amount } = expense;
      catTotals[category] = (catTotals[category] || 0) + amount;
    });
    setCategoryTotals(catTotals);

    // Calculate monthly data (for both totals and average expenses)
    const monthData: MonthlyData = {};
    filteredExpenses.forEach(expense => {
      const date = new Date(expense.date);
      let key: string;
      
      if (timeframe === 'week') {
        // For week view, use day of week
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        key = dayNames[date.getDay()];
      } else if (timeframe === 'month') {
        // For month view, use day of month
        key = date.getDate().toString();
      } else {
        // For year view, use month name
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        key = monthNames[date.getMonth()];
      }
      
      if (!monthData[key]) {
        monthData[key] = { total: 0, count: 0 };
      }
      monthData[key].total += expense.amount;
      monthData[key].count += 1;
    });
    setMonthlyData(monthData);

    // Get top 5 expenses
    const sorted = [...filteredExpenses].sort((a, b) => b.amount - a.amount);
    setTopExpenses(sorted.slice(0, 5));
  }, [expenses, timeframe]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate total expenses
  const totalAmount = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
  
  // Calculate average daily expense
  const avgDailyExpense = (() => {
    if (Object.keys(monthlyData).length === 0) return 0;
    const totalDays = Object.values(monthlyData).reduce((sum, data) => sum + data.count, 0);
    return totalAmount / (totalDays || 1);
  })();

  const chartColors = [
    '#4F46E5', '#7C3AED', '#EC4899', '#F97316', '#10B981',
    '#06B6D4', '#8B5CF6', '#3B82F6', '#EF4444', '#F59E0B',
  ];

  const doughnutChartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: chartColors,
        borderColor: 'white',
        borderWidth: 2,
        hoverOffset: 4
      }
    ]
  };

  const getBarChartData = () => {
    let sortedKeys: string[] = [];
    
    if (timeframe === 'week') {
      const dayOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      sortedKeys = dayOrder.filter(day => Object.keys(monthlyData).includes(day));
    } else if (timeframe === 'month') {
      sortedKeys = Object.keys(monthlyData).sort((a, b) => parseInt(a) - parseInt(b));
    } else {
      const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      sortedKeys = monthOrder.filter(month => Object.keys(monthlyData).includes(month));
    }

    return {
      labels: sortedKeys,
      datasets: [
        {
          label: 'Total Expenses',
          data: sortedKeys.map(key => monthlyData[key].total),
          backgroundColor: '#4F46E5',
          borderColor: '#4338CA',
          borderWidth: 1,
        }
      ]
    };
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}ly Expenses`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (tickValue: string | number) {
            return `₹${tickValue}`;
          }
        }
      }
    }
  };

  const doughnutChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Expenses by Category',
      },
    },
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Time Frame Selector */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="flex items-center mb-4 justify-between">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Dashboard</h2>
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setTimeframe('week')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${timeframe === 'week' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
            >
              Week
            </button>
            <button
              type="button"
              onClick={() => setTimeframe('month')}
              className={`px-4 py-2 text-sm font-medium ${timeframe === 'month' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
            >
              Month
            </button>
            <button
              type="button"
              onClick={() => setTimeframe('year')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${timeframe === 'year' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
            >
              Year
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="text-lg font-semibold text-gray-700 dark:text-white">Total Expenses</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(totalAmount)}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="text-lg font-semibold text-gray-700 dark:text-white">Avg Daily Expense</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(avgDailyExpense)}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="text-lg font-semibold text-gray-700 dark:text-white">Categories</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{Object.keys(categoryTotals).length}</div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <Bar data={getBarChartData()} options={barChartOptions} />
      </div>

      {/* Doughnut Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
      </div>

      {/* Top Expenses */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Top 5 Expenses</h3>
        <table className="min-w-full mt-4">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Category</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Description</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Amount</th>
            </tr>
          </thead>
          <tbody>
            {topExpenses.length > 0 ? (
              topExpenses.map((expense, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{formatDate(expense.date)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{expense.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{expense.description}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">{formatCurrency(expense.amount)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">No top expenses found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
