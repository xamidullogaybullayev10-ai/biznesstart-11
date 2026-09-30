import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb, 
  RefreshCw,
  PieChart as PieIcon,
  BarChart3,
  Calendar
} from 'lucide-react';
import { 
  Transaction, 
  Category, 
  FinancialInsight, 
  Currency, 
  Language, 
  Business,
  Debt 
} from '../types';
import { translations } from '../i18n/translations';
import { aiService } from '../services/aiService';

interface AnalyticsViewProps {
  transactions: Transaction[];
  categories: Category[];
  debts: Debt[];
  business: Business;
  currency: Currency;
  lang: Language;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  transactions,
  categories,
  debts,
  business,
  currency,
  lang,
}) => {
  const t = translations[lang];

  const [insights, setInsights] = useState<FinancialInsight[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonthStr = todayStr.substring(0, 7);

  // Financial calculations
  const totalIncome = transactions
    .filter(t => t.date.startsWith(currentMonthStr) && t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.date.startsWith(currentMonthStr) && t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpense;
  const margin = totalIncome > 0 ? Math.round((netProfit / totalIncome) * 100) : 0;

  // Category Spend distribution
  const categorySpend = categories
    .filter(c => c.type === 'expense')
    .map(cat => {
      const spent = transactions
        .filter(t => t.date.startsWith(currentMonthStr) && t.type === 'expense' && t.categoryName.toLowerCase() === cat.name.toLowerCase())
        .reduce((sum, t) => sum + t.amount, 0);
      const budget = cat.budgetLimit || 3000000;
      const percent = Math.min(100, Math.round((spent / budget) * 100));
      return {
        ...cat,
        spent,
        budget,
        percent,
      };
    })
    .sort((a, b) => b.spent - a.spent);

  // Load smart insights
  useEffect(() => {
    loadInsights();
  }, [transactions.length, debts.length]);

  const loadInsights = async () => {
    setIsRefreshing(true);
    const overdueDebts = debts.filter(d => !d.isPaid && d.dueDate < todayStr);
    const summary = {
      totalIncome,
      totalExpense,
      netProfit,
      margin,
      overdueDebtsCount: overdueDebts.length,
      overdueAmount: overdueDebts.reduce((sum, d) => sum + d.amount, 0),
      topExpenses: categorySpend.slice(0, 3).map(c => ({ name: c.name, spent: c.spent })),
    };

    try {
      const res = await aiService.getInsights(summary, lang);
      setInsights(res);
    } catch {
      // handled inside service
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>{t.insightsTitle}</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              AI Powered
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.insightsSubtitle}
          </p>
        </div>

        <button
          onClick={loadInsights}
          disabled={isRefreshing}
          className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Tahlilni yangilash</span>
        </button>
      </div>

      {/* TOP SMART INSIGHT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((ins) => {
          let badgeColor = 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-900';
          let Icon = TrendingUp;

          if (ins.type === 'warning') {
            badgeColor = 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-900';
            Icon = AlertTriangle;
          } else if (ins.type === 'positive') {
            badgeColor = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900';
            Icon = CheckCircle;
          } else if (ins.type === 'opportunity') {
            badgeColor = 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-900';
            Icon = Lightbulb;
          }

          return (
            <div 
              key={ins.id}
              className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border flex items-center gap-1.5 ${badgeColor}`}>
                    <Icon className="h-3.5 w-3.5" />
                    <span>{t.aiInsightTag}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{ins.date}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                  {ins.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {ins.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* CATEGORY BUDGETS & LIMIT TRACKER */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Toifalar bo‘yicha budjet nazorati
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Belgilangan oylik chegaralar va sarflangan mablag‘
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-500">
            Jami: {totalExpense.toLocaleString('uz-UZ')} {currency}
          </span>
        </div>

        <div className="space-y-4">
          {categorySpend.map((cat) => {
            const isOverBudget = cat.spent > cat.budget;

            return (
              <div key={cat.id} className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span 
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {cat.name}
                    </span>
                    {isOverBudget && (
                      <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded">
                        Budjet oshdi!
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 font-mono tabular-nums text-slate-500 dark:text-slate-400">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {cat.spent.toLocaleString('uz-UZ')}
                    </span>
                    <span>/</span>
                    <span>{cat.budget.toLocaleString('uz-UZ')} {currency}</span>
                    <span className="text-slate-400 w-8 text-right">
                      {cat.percent}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    style={{ 
                      width: `${Math.min(100, cat.percent)}%`,
                      backgroundColor: isOverBudget ? '#ef4444' : cat.color 
                    }}
                    className="h-full rounded-full transition-all duration-300"
                  />
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
