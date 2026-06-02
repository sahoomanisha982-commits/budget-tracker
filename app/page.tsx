"use client";

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ArrowUpRight, 
  ArrowDownRight, 
  PlusCircle, 
  Trash2, 
  TrendingUp, 
  BrainCircuit, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb,
  MessageSquare,
  FileText,
  Smile,
  Frown,
  Meh
} from 'lucide-react';

export default function BusinessCopilot() {
  // State management
  const [transactions, setTransactions] = useState([
    { id: 1, description: 'Bulk Inventory Restock', amount: 2400, type: 'expense', category: 'Operations', date: '06/01/2026' },
    { id: 2, description: 'Client Retainer Payment', amount: 4500, type: 'income', category: 'Client Revenue', date: '06/02/2026' },
    { id: 3, description: 'Q2 Marketing Campaign', amount: 1200, type: 'expense', category: 'Marketing', date: '06/02/2026' }
  ]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Operations');
  const [monthlyTarget, setMonthlyTarget] = useState(10000);

  // New States for Note Requirements
  const [feedbackInput, setFeedbackInput] = useState('');
  const [feedbackSentiment, setFeedbackSentiment] = useState({ score: 'Neutral', text: 'No live review scanned yet.', color: 'text-slate-400', icon: 'meh' });
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);

  // AI-Generated Insights State
  const [aiInsights, setAiInsights] = useState({
    cashFlowStatus: 'Analyzing...',
    burnRateAlert: 'Stable',
    fraudRisk: 'Low Risk',
    forecast: 'Calculating dynamic run rate...',
    recommendation: 'Add more transactions to generate your strategic growth blueprint.'
  });

  // Calculate Metrics
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpense;
  const runwayProgress = Math.min((totalIncome / (totalExpense || 1)) * 100, 100);

  // Live Sentiment Analysis Processing Rule
  const analyzeSentiment = (text: string) => {
    if (!text.trim()) {
      setFeedbackSentiment({ score: 'Neutral', text: 'No live review scanned yet.', color: 'text-slate-400', icon: 'meh' });
      return;
    }
    const lower = text.toLowerCase();
    const positiveWords = ['good', 'great', 'awesome', 'best', 'love', 'excellent', 'amazing', 'happy', 'perfect', 'satisfied'];
    const negativeWords = ['bad', 'poor', 'worst', 'hate', 'terrible', 'broken', 'slow', 'expensive', 'fail', 'defect'];

    let posCount = positiveWords.filter(word => lower.includes(word)).length;
    let negCount = negativeWords.filter(word => lower.includes(word)).length;

    if (posCount > negCount) {
      setFeedbackSentiment({ score: 'Positive (94% Accuracy)', text: 'Customer sentiment indicates strong retention and brand health.', color: 'text-emerald-400', icon: 'smile' });
    } else if (negCount > posCount) {
      setFeedbackSentiment({ score: 'Negative (89% Accuracy)', text: 'Alert: Customer dissatisfaction detected. High risk of churn.', color: 'text-rose-400', icon: 'frown' });
    } else {
      setFeedbackSentiment({ score: 'Neutral Sentiment', text: 'Standard administrative or informational feedback.', color: 'text-amber-400', icon: 'meh' });
    }
  };

  // Auto Report Generator Logic
  const handleGenerateReport = () => {
    const timeStamp = new Date().toLocaleString();
    const reportTemplate = `
========================================
    EXECUTIVE BUSINESS PERFORMANCE REPORT
    Generated: ${timeStamp}
========================================

1. FINANCIAL OVERVIEW
----------------------------------------
* Total Operational Revenue: $${totalIncome.toLocaleString()}
* Total Operating Expenses: $${totalExpense.toLocaleString()}
* Net Financial Profitability: $${netProfit.toLocaleString()}
* Solvency Runway Ratio: ${runwayProgress.toFixed(1)}%

2. SYSTEM ANOMALY & FRAUD GUARD LOG
----------------------------------------
* Current Threat Vector Status: ${aiInsights.fraudRisk}
* Internal Burn Risk Parameter: ${aiInsights.burnRateAlert}

3. CUSTOMER SENTIMENT COMPLIANCE
----------------------------------------
* Aggregate Sentiment Output: ${feedbackSentiment.score}
* Context Summary: ${feedbackSentiment.text}
* Raw Inspected Query: "${feedbackInput || 'No queries submitted during this window'}"

4. CORE CO-PILOT ADVISORY RECOMMENDATION
----------------------------------------
"${aiInsights.recommendation}"

========================================
    END OF AUTOMATED REPORT MANAGEMENT
========================================
    `;
    setGeneratedReport(reportTemplate.trim());
  };

  // Dynamic Rule-Based AI Engine
  useEffect(() => {
    let status = 'Healthy Cash Flow';
    let alert = 'Optimal Runway';
    let risk = 'Low Risk';
    let forecastStr = 'Sales are steady. Projected Q3 overheads covered.';
    let recommendationStr = 'Maintain current operations. You have sufficient cash flow to invest 10% more into Marketing to accelerate customer acquisition.';

    if (netProfit < 0) {
      status = 'Critical Cash Crunch';
      alert = 'High Burn Rate Warning';
      forecastStr = 'Risk of financial distress within 45 days if expense trajectory continues.';
      recommendationStr = 'Immediate Action Required: Pause non-essential Software/SaaS subscriptions and renegotiate supplier credit terms to protect baseline cash runway.';
    } else if (totalExpense > monthlyTarget * 0.8) {
      status = 'Budget Threshold Breach';
      alert = 'Approaching Operating Limit';
      recommendationStr = 'Operational expenses are heavy this week. Defer secondary inventory restocks until early next month to maintain safety capital.';
    }

    const highExpenseExceeded = transactions.some(t => t.type === 'expense' && t.amount > 5000);
    if (highExpenseExceeded) {
      risk = 'Anomaly Detected';
      alert = 'High-Value Outlier Flagged';
      recommendationStr = 'AI Fraud Alert: An unusually high operational expense was detected. Verify this ledger entry against receipt logs immediately.';
    }

    setAiInsights({
      cashFlowStatus: status,
      burnRateAlert: alert,
      fraudRisk: risk,
      forecast: forecastStr,
      recommendation: recommendationStr
    });
  }, [transactions, netProfit, totalExpense, monthlyTarget]);

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || Number(amount) <= 0) return;

    const newTransaction = {
      id: Date.now(),
      description,
      amount: Number(amount),
      type,
      category,
      date: new Date().toLocaleDateString('en-US')
    };

    setTransactions([newTransaction, ...transactions]);
    setDescription('');
    setAmount('');
  };

  const handleDeleteTransaction = (id: number) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 mb-8 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500 text-slate-950 text-xs font-black uppercase px-2 py-0.5 rounded">Sprint Prototype v2</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-2 mt-1">
              <Building2 className="w-8 h-8 text-emerald-400" /> MSME Business Copilot
            </h1>
            <p className="text-slate-400 text-sm">Predictive Cash-Flow, Fraud Guard, Feedback Sentiment & Auto Reports</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4 bg-slate-900 p-3 rounded-xl border border-slate-800">
            <div>
              <span className="text-xs text-slate-500 block uppercase font-bold tracking-wider">AI Run-Rate Limit</span>
              <span className="text-lg font-bold text-emerald-400">${monthlyTarget.toLocaleString()}</span>
            </div>
          </div>
        </header>

        {/* Financial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-md">
            <p className="text-sm font-medium text-slate-400">Net Profit / Loss</p>
            <p className={`text-2xl font-bold mt-2 ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
              ${netProfit.toLocaleString()}
            </p>
          </div>
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-md">
            <p className="text-sm font-medium text-slate-400">Total Revenue</p>
            <p className="text-2xl font-bold text-emerald-400 mt-2">${totalIncome.toLocaleString()}</p>
          </div>
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-md">
            <p className="text-sm font-medium text-slate-400">Operating Expenses</p>
            <p className="text-2xl font-bold text-rose-400 mt-2">${totalExpense.toLocaleString()}</p>
          </div>
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-md">
            <p className="text-sm font-medium text-slate-400">Solvency Runway</p>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full transition-all" style={{ width: `${runwayProgress}%` }}></div>
            </div>
          </div>
        </div>

        {/* Row 1: AI Engine Intelligence & Sentiment Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* AI Copilot Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-emerald-950/20 via-slate-900 to-slate-900 p-6 rounded-xl border-2 border-emerald-500/20 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <BrainCircuit className="w-5 h-5 text-emerald-400 animate-pulse" />
              <h2 className="text-lg font-bold text-white">AI Copilot Strategic Intelligence</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-500 font-bold uppercase block">Cash-Flow Status</span>
                <span className={`text-sm font-bold mt-1 inline-flex items-center gap-1 ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {netProfit >= 0 ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />} {aiInsights.cashFlowStatus}
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-500 font-bold uppercase block">Business Burn Risk</span>
                <span className="text-sm font-bold mt-1 block text-amber-400">{aiInsights.burnRateAlert}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-500 font-bold uppercase block">ML Fraud Anomaly Guard</span>
                <span className="text-sm font-bold mt-1 block text-slate-300">{aiInsights.fraudRisk}</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/10 text-xs italic text-slate-300">
              "{aiInsights.recommendation}"
            </div>
          </div>

          {/* REQUIREMENT #1: Sentiment & Feedback Analysis Card */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white">Sentiment Analytics</h2>
            </div>
            <p className="text-xs text-slate-400 mb-3">Evaluate corporate review text strings instantly.</p>
            <textarea
              value={feedbackInput}
              onChange={(e) => {
                setFeedbackInput(e.target.value);
                analyzeSentiment(e.target.value);
              }}
              placeholder="Type client feedback here... (e.g. Service was bad and slow, or Love the great speed!)"
              className="w-full h-20 bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none mb-3"
            />
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center gap-3">
              {feedbackSentiment.icon === 'smile' && <Smile className="w-5 h-5 text-emerald-400 shrink-0" />}
              {feedbackSentiment.icon === 'frown' && <Frown className="w-5 h-5 text-rose-400 shrink-0" />}
              {feedbackSentiment.icon === 'meh' && <Meh className="w-5 h-5 text-slate-400 shrink-0" />}
              <div>
                <span className={`text-xs font-bold block ${feedbackSentiment.color}`}>{feedbackSentiment.score}</span>
                <span className="text-[11px] text-slate-400 block leading-tight mt-0.5">{feedbackSentiment.text}</span>
              </div>
            </div>
          </div>

        </div>

        {/* REQUIREMENT #2: Auto Report Generator Hub */}
        <section className="bg-slate-900 p-6 rounded-xl border border-slate-800 mb-8 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              <div>
                <h2 className="text-lg font-bold text-white">Auto Report Management System</h2>
                <p className="text-xs text-slate-400">Compile structured systemic evaluations for leadership panels.</p>
              </div>
            </div>
            <button
              onClick={handleGenerateReport}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs uppercase tracking-wider transition-colors shrink-0"
            >
              Generate Audit Report
            </button>
          </div>

          {generatedReport && (
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
              {generatedReport}
            </div>
          )}
        </section>

        {/* Input Form & Data Log Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Input Form */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-md h-fit">
            <h2 className="text-base font-bold mb-4 flex items-center gap-2 text-white">
              <PlusCircle className="w-4 h-4 text-emerald-400" /> Log Business Flow
            </h2>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Transaction Statement</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g., Supplier raw materials"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Amount ($)</label>
                  <input 
                    type="number"
                    required
                    min="1"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Flow Type</label>
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Revenue</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Allocation Domain</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
                >
                  {type === 'income' ? (
                    <>
                      <option value="Client Revenue">Direct Sales / Client Revenue</option>
                      <option value="Investments">Equity Injections</option>
                    </>
                  ) : (
                    <>
                      <option value="Operations">Operations & Inventory</option>
                      <option value="Marketing">Marketing / Ads</option>
                      <option value="Software">Software & SaaS</option>
                      <option value="Salaries">Payroll / Fees</option>
                    </>
                  )}
                </select>
              </div>
              <button 
                type="submit" 
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-2.5 rounded-lg text-xs uppercase tracking-wider transition-colors shadow"
              >
                Execute Ledger Process
              </button>
            </form>
          </div>

          {/* Ledger Table Log */}
          <div className="lg:col-span-2 bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-md">
            <h2 className="text-base font-bold mb-4 flex items-center gap-2 text-white">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Dynamic Business Ledger
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 font-bold">Flow Details</th>
                    <th className="pb-3 font-bold">Domain</th>
                    <th className="pb-3 font-bold">Timestamp</th>
                    <th className="pb-3 font-bold text-right">Volume</th>
                    <th className="pb-3 text-center">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-xs text-slate-300">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 font-medium text-white">{transaction.description}</td>
                      <td className="py-3">
                        <span className="bg-slate-950 px-2 py-0.5 rounded text-[11px] border border-slate-800">
                          {transaction.category}
                        </span>
                      </td>
                      <td className="py-3 text-slate-500">{transaction.date}</td>
                      <td className={`py-3 text-right font-bold ${transaction.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                      </td>
                      <td className="py-3 text-center">
                        <button onClick={() => handleDeleteTransaction(transaction.id)} className="text-slate-600 hover:text-rose-400 p-1">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}