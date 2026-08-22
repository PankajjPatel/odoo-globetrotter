import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ArrowLeft, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import './BudgetScreen.css';

export const BudgetScreen = () => {
  const { id } = useParams();

  // Dummy Data
  const budgetSummary = {
    totalBudget: 5000,
    totalSpent: 3250,
    remaining: 1750,
  };

  const expensesByCategory = [
    { name: 'Flights', value: 1200, color: '#003049' },
    { name: 'Accommodation', value: 1000, color: '#f77f00' },
    { name: 'Food', value: 500, color: '#fcbf49' },
    { name: 'Activities', value: 400, color: '#2a9d8f' },
    { name: 'Transport', value: 150, color: '#e63946' },
  ];

  const expensesByDay = [
    { day: 'Jun 15', spent: 150, budget: 200 },
    { day: 'Jun 16', spent: 300, budget: 200 },
    { day: 'Jun 17', spent: 180, budget: 200 },
    { day: 'Jun 18', spent: 100, budget: 200 },
    { day: 'Jun 19', spent: 250, budget: 200 },
  ];

  return (
    <div className="budget-container container animate-fade-in">
      <div className="budget-header">
        <div>
          <Link to={`/trip/${id}/view`} className="back-link">
            <ArrowLeft size={16} className="mr-1" /> Back to Itinerary
          </Link>
          <h1>Budget Breakdown</h1>
          <p className="text-secondary">Keep track of your expenses for 'Summer in Europe'</p>
        </div>
        <div className="budget-actions">
          <Button variant="primary">Add Expense</Button>
        </div>
      </div>

      <div className="budget-summary-grid">
        <Card className="summary-card glass">
          <div className="summary-icon bg-blue-light text-blue"><DollarSign size={24} /></div>
          <div className="summary-info">
            <span className="summary-label">Total Budget</span>
            <span className="summary-value">₹{budgetSummary.totalBudget}</span>
          </div>
        </Card>
        <Card className="summary-card glass">
          <div className="summary-icon bg-orange-light text-orange"><TrendingUp size={24} /></div>
          <div className="summary-info">
            <span className="summary-label">Total Estimated Cost</span>
            <span className="summary-value">₹{budgetSummary.totalSpent}</span>
          </div>
        </Card>
        <Card className={`summary-card glass ${budgetSummary.remaining < 0 ? 'border-danger' : 'border-success'}`}>
          <div className={`summary-icon ${budgetSummary.remaining < 0 ? 'bg-red-light text-red' : 'bg-green-light text-green'}`}>
            {budgetSummary.remaining < 0 ? <AlertTriangle size={24} /> : <DollarSign size={24} />}
          </div>
          <div className="summary-info">
            <span className="summary-label">Remaining Budget</span>
            <span className={`summary-value ${budgetSummary.remaining < 0 ? 'text-danger' : 'text-success'}`}>
              ₹{budgetSummary.remaining}
            </span>
          </div>
        </Card>
      </div>

      <div className="charts-grid">
        <Card className="chart-card">
          <h3>Expenses by Category</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expensesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="chart-card">
          <h3>Daily Spending vs Budget</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={expensesByDay} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} />
                <Tooltip formatter={(value) => `₹${value}`} cursor={{fill: 'rgba(0,0,0,0.05)'}} />
                <Legend />
                <Bar dataKey="spent" name="Estimated Cost" fill="var(--primary-color)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="budget" name="Daily Budget" fill="var(--border-color)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
