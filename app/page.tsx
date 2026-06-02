"use client";

import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  PlusCircle, 
  Trash2, 
  PieChart, 
  DollarSign, 
  TrendingUp 
} from 'lucide-react';

export default function FinanceTracker() {
  // State management
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');
  const [category, setCategory] = useState('Salary');
  const [budget, setBudget] = useState(5000);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState('5000');

  // Load data from LocalStorage on mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('hackverse_transactions');
    const savedBudget = localStorage.getItem('hackverse_budget');
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    if (savedBudget) {
      setBudget(Number(savedBudget));
      setTempBudget(savedBudget);
    }
  }, []);

  // Sync data to LocalStorage whenever state changes
  const saveToLocalStorage = (newTransactions, newBudget) => {
    localStorage.setItem('hackverse_transactions', JSON.stringify(newTransactions));
    localStorage.setItem('hackverse_budget', newBudget.toString());
  };

  // Calculations
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;
  const budgetRemaining = budget - totalExpense;
  const budgetUsagePercent = Math.min((totalExpense / budget) * 100, 100);

  // Form Handlers
  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!description || !amount || Number(amount) <= 0) return;

    const newTransaction = {
      id: Date.now(),
      description,
      amount: Number(amount),
      type,
      category,
      date: new Date().toLocaleDateString()
    };

    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    saveToLocalStorage(updatedTransactions, budget);

    // Reset fields
    setDescription('');
    setAmount('');
  };

  const handleDeleteTransaction = (id) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    setTransactions(updatedTransactions);
    saveToLocalStorage(updatedTransactions, budget);
  };

  const handleUpdateBudget = (e) => {
    e.preventDefault();
    const numericBudget = Number(tempBudget);
    if (numericBudget >= 0) {
      setBudget(numericBudget);
      setIsEditingBudget(false);
      saveToLocalStorage(transactions, numericBudget);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 mb-8 border-b border-slate-800">
          <div>
            <h1 className="text-3xl font-bold text-emerald-400 flex items-center gap-2">
              <Wallet className="w-8 h-8" /> FinVerse
            </h1>
            <p className="text-slate-400 text-sm mt-1">Smart Corporate Finance & Budget Dashboard</p>
          </div>
          <div className="mt-4 md:mt-0 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 flex items-center gap-4">
            <div>
              <span className="text-xs text-slate-400 block uppercase tracking-wider">Monthly Budget Target</span>
              {isEditingBudget ? (
                <form onSubmit={handleUpdateBudget} className="flex gap-2 mt-1">
                  <input 
                    type="number" 
                    value={tempBudget} 
                    onChange={(e) => setTempBudget(e.target.value)}
                    className="bg-slate-900 text-white border border-emerald-500 rounded px-2 py-0.5 w-24 focus:outline-none"
                    autoFocus
                  />
                  <button type="submit" className="text-xs bg-emerald-500 text-slate-900 px-2 py-0.5 rounded font-bold">Save</button>
                </form>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white">${budget.toLocaleString()}</span>
                  <button onClick={() => setIsEditingBudget(true)} className="text-xs text-emerald-400 hover:underline">Edit</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Metrics Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          
          {/* Balance Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 p-6 rounded-xl border border-slate-700/60 shadow-lg">
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-slate-400">Net Balance</p>
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><DollarSign className="w-5 h-5" /></div>
            </div>
            <p className={`text-2xl font-bold mt-2 ${netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              ${netBalance.toLocaleString()}
            </p>
          </div>

          {/* Income Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 p-6 rounded-xl border border-slate-700/60 shadow-lg">
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-slate-400">Total Income</p>
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><ArrowUpRight className="w-5 h-5" /></div>
            </div>
            <p className="text-2xl font-bold text-emerald-400 mt-2">${totalIncome.toLocaleString()}</p>
          </div>

          {/* Expense Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 p-6 rounded-xl border border-slate-700/60 shadow-lg">
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-slate-400">Total Expenses</p>
              <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400"><ArrowDownRight className="w-5 h-5" /></div>
            </div>
            <p className="text-2xl font-bold text-rose-400 mt-2">${totalExpense.toLocaleString()}</p>
          </div>

          {/* Budget Limit Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 p-6 rounded-xl border border-slate-700/60 shadow-lg">
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-slate-400">Budget Remaining</p>
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400"><TrendingUp className="w-5 h-5" /></div>
            </div>
            <p className={`text-2xl font-bold mt-2 ${budgetRemaining >= 0 ? 'text-amber-400' : 'text-rose-500'}`}>
              ${budgetRemaining.toLocaleString()}
            </p>
            <div className="w-full bg-slate-700 h-2 rounded-full mt-3 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${budgetUsagePercent >= 90 ? 'bg-rose-500' : 'bg-amber-400'}`} 
                style={{ width: `${budgetUsagePercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Main Interface Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Transaction Form */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md h-fit">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
              <PlusCircle className="w-5 h-5 text-emerald-400" /> Log Transaction
            </h2>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Description</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g., Cloud Hosting, Office Rent"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Amount ($)</label>
                  <input 
                    type="number"
                    required
                    min="1"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Type</label>
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-sm"
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-sm"
                >
                  {type === 'income' ? (
                    <>
                      <option value="Salary">Corporate Funding</option>
                      <option value="Freelance">Client Revenue</option>
                      <option value="Investments">Investments</option>
                    </>
                  ) : (
                    <>
                      <option value="Software">Software/SaaS</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Operations">Operations</option>
                      <option value="Salaries">Team Salaries</option>
                    </>
                  )}
                </select>
              </div>

              <button 
                type="submit" 
                className="w-full mt-2 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold py-2.5 px-4 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 shadow"
              >
                Add Ledger Entry
              </button>
            </form>
          </div>

          {/* Right Column: Ledger Log Entries */}
          <div className="lg:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
              <PieChart className="w-5 h-5 text-emerald-400" /> Transaction Ledger
            </h2>
            
            {transactions.length === 0 ? (
              <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-700 rounded-xl">
                <p className="text-sm">No transaction entries captured yet.</p>
                <p className="text-xs mt-1 text-slate-600">Populate the form on the left to review analytics.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700 text-xs text-slate-400 uppercase tracking-wider">
                      <th className="pb-3 font-semibold">Details</th>
                      <th className="pb-3 font-semibold">Category</th>
                      <th className="pb-3 font-semibold">Date</th>
                      <th className="pb-3 font-semibold text-right">Amount</th>
                      <th className="pb-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50 text-sm">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="py-3 font-medium text-white">{transaction.description}</td>
                        <td className="py-3">
                          <span className="bg-slate-900 px-2.5 py-1 rounded-full text-xs font-medium text-slate-300 border border-slate-700">
                            {transaction.category}
                          </span>
                        </td>
                        <td className="py-3 text-slate-400 text-xs">{transaction.date}</td>
                        <td className={`py-3 text-right font-bold ${transaction.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                        </td>
                        <td className="py-3 text-center">
                          <button 
                            onClick={() => handleDeleteTransaction(transaction.id)}
                            className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                            title="Delete entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}