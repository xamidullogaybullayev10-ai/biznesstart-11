import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Sparkles, 
  Clock, 
  Tag, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { 
  Transaction, 
  Category, 
  Debt, 
  Currency, 
  Language, 
  Business 
} from '../types';
import { translations } from '../i18n/translations';
import { 
  IncomeExpenseLineChart, 
  ExpenseCategoryDonutChart, 
  MonthlyProfitBarChart 
} from './FinancialCharts';

interface DashboardViewProps {
  transactions: Transaction[];
  categories: Category[];
  debts: Debt[];
  business: Business;
  currency: Currency;
  lang: Language;
  onOpenAiModal: () => void;
  onNavigate: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  transactions,
  categories,
  debts,
  business,
  currency,
  lang,
  onOpenAiModal,
  onNavigate,
}) => {
  const t = translations[lang];

  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonthStr = todayStr.substring(0, 7); // YYYY-MM

  // KPI Calculations
  const todayIncome = transactions
    .filter(t => t.date === todayStr && t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const todayExpense = transactions
    .filter(t => t.date === todayStr && t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyIncome = transactions
    .filter(t => t.date.startsWith(currentMonthStr) && t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpense = transactions
    .filter(t => t.date.startsWith(currentMonthStr) && t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = monthlyIncome - monthlyExpense;

  // Debts
  const totalReceivable = debts
    .filter(d => !d.isPaid && d.type === 'receivable')
    .reduce((sum, d) => sum + d.amount, 0);

  const totalPayable = debts
    .filter(d => !d.isPaid && d.type === 'payable')
    .reduce((sum, d) => sum + d.amount, 0);

  // Recent 6 transactions
  const recentTransactions = transactions.slice(0, 6);

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      
      {/* Top Banner & Quick Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {business.name || t.dashboardTitle}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Bugungi sana: <span className="font-medium text-slate-700 dark:text-slate-300">{new Date().toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </p>
        </div>

        <button
          onClick={onOpenAiModal}
          className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-xs sm:text-sm font-semibold text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-500 active:scale-95 transition-all cursor-pointer"
        >
          <Sparkles className="h-4 w-4" />
          <span>+ {t.addTransaction}</span>
        </button>
      </div>

      {/* TOP 6 KPI METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* 1. Today's Income */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{t.todayIncome}</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="mt-2 text-lg sm:text-xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
            +{todayIncome.toLocaleString('uz-UZ')}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">{currency}</div>
        </div>

        {/* 2. Today's Expense */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{t.todayExpense}</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
              <ArrowDownRight className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="mt-2 text-lg sm:text-xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400">
            -{todayExpense.toLocaleString('uz-UZ')}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">{currency}</div>
        </div>

        {/* 3. Monthly Income */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{t.monthlyIncome}</span>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-lg sm:text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {monthlyIncome.toLocaleString('uz-UZ')}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">{currency}</div>
        </div>

        {/* 4. Monthly Expenses */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{t.monthlyExpense}</span>
            <TrendingDown className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-2 text-lg sm:text-xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400">
            {monthlyExpense.toLocaleString('uz-UZ')}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">{currency}</div>
        </div>

        {/* 5. Net Profit (Sof foyda) */}
        <div className="col-span-2 sm:col-span-1 rounded-2xl border-2 border-emerald-500/50 bg-emerald-50/40 p-4 shadow-sm dark:border-emerald-500/40 dark:bg-emerald-950/20">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            <span>{t.netProfit}</span>
            <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-2 text-lg sm:text-xl font-bold font-mono tabular-nums text-emerald-700 dark:text-emerald-300">
            {netProfit >= 0 ? '+' : ''}{netProfit.toLocaleString('uz-UZ')}
          </div>
          <div className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 mt-0.5 font-medium">
            Rentabellik: {monthlyIncome > 0 ? Math.round((netProfit / monthlyIncome) * 100) : 0}%
          </div>
        </div>

        {/* 6. Outstanding Debts */}
        <div 
          onClick={() => onNavigate('debts')}
          className="col-span-2 sm:col-span-1 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{t.outstandingDebts}</span>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 flex flex-col text-xs font-mono tabular-nums">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold truncate">
              +{totalReceivable.toLocaleString('uz-UZ')} <span className="text-[10px] font-normal">{t.receivableShort}</span>
            </span>
            <span className="text-rose-500 dark:text-rose-400 font-semibold truncate mt-0.5">
              -{totalPayable.toLocaleString('uz-UZ')} <span className="text-[10px] font-normal">{t.payableShort}</span>
            </span>
          </div>
        </div>

      </div>

      {/* CHARTS ROW 1: Trend line + Category Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Income vs Expense Line Chart (2 Cols) */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.incomeVsExpense}
            </h3>
          </div>
          <IncomeExpenseLineChart
            transactions={transactions}
            categories={categories}
            currency={currency}
          />
        </div>

        {/* Expense Category Donut (1 Col) */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.expenseByCategory}
            </h3>
          </div>
          <ExpenseCategoryDonutChart
            transactions={transactions}
            categories={categories}
            currency={currency}
          />
        </div>

      </div>

      {/* CHARTS ROW 2: Monthly Profit + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Monthly Profit dynamics (1 Col) */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.monthlyProfitDynamics}
            </h3>
          </div>
          <MonthlyProfitBarChart
            transactions={transactions}
            categories={categories}
            currency={currency}
          />
        </div>

        {/* Recent Transactions List (2 Cols) */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.recentTransactions}
            </h3>
            <button
              onClick={() => onNavigate('transactions')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 cursor-pointer"
            >
              {t.viewAll} →
            </button>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {t.noTransactionsYet}
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {t.noTransactionsSub}
              </p>
              <button
                onClick={onOpenAiModal}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                {t.addFirstTransaction}
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentTransactions.map((tx) => (
                <div 
                  key={tx.id}
                  className="py-3 flex items-center justify-between text-xs hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-xl font-bold ${
                      tx.type === 'income'
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'}
                    </div>

                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                        {tx.description}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                        <span>{tx.date}</span>
                        <span>·</span>
                        <span className="font-medium text-slate-600 dark:text-slate-300">{tx.categoryName}</span>
                        {tx.source === 'ai' && (
                          <>
                            <span>·</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">AI</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={`text-right font-mono font-bold text-sm tabular-nums ${
                    tx.type === 'income'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {tx.type === 'income' ? '+' : '-'}{tx.amount.toLocaleString('uz-UZ')} {currency}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
