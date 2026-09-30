import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Trash2, 
  Edit3, 
  Plus, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Check, 
  X,
  Calendar
} from 'lucide-react';
import { Transaction, Category, Currency, Language } from '../types';
import { translations } from '../i18n/translations';

interface TransactionsViewProps {
  transactions: Transaction[];
  categories: Category[];
  currency: Currency;
  lang: Language;
  onOpenAiModal: () => void;
  onUpdateTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  categories,
  currency,
  lang,
  onOpenAiModal,
  onUpdateTransaction,
  onDeleteTransaction,
}) => {
  const t = translations[lang];

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');

  // Edit Modal State
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  // Filter logic
  const filtered = transactions.filter((tx) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDesc = tx.description.toLowerCase().includes(q);
      const matchCat = tx.categoryName.toLowerCase().includes(q);
      const matchAmount = tx.amount.toString().includes(q);
      if (!matchDesc && !matchCat && !matchAmount) return false;
    }

    // Type filter
    if (typeFilter !== 'all' && tx.type !== typeFilter) return false;

    // Category filter
    if (categoryFilter !== 'all' && tx.categoryName.toLowerCase() !== categoryFilter.toLowerCase()) return false;

    // Date filter
    if (dateFilter === 'today' && tx.date !== todayStr) return false;
    if (dateFilter === 'month') {
      const currentMonth = todayStr.substring(0, 7);
      if (!tx.date.startsWith(currentMonth)) return false;
    }
    if (dateFilter === 'week') {
      const txDate = new Date(tx.date);
      const now = new Date();
      const diffDays = Math.ceil((now.getTime() - txDate.getTime()) / (1000 * 3600 * 24));
      if (diffDays > 7 || diffDays < 0) return false;
    }

    return true;
  });

  // Sort logic
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'date-desc') return b.date.localeCompare(a.date);
    if (sortBy === 'date-asc') return a.date.localeCompare(b.date);
    if (sortBy === 'amount-desc') return b.amount - a.amount;
    if (sortBy === 'amount-asc') return a.amount - b.amount;
    return 0;
  });

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTx) return;
    onUpdateTransaction(editingTx);
    setEditingTx(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.transactionsPageTitle}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Jami: <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono tabular-nums">{filtered.length} ta</span> tranzaksiya
          </p>
        </div>

        <button
          onClick={onOpenAiModal}
          className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-500 active:scale-95 transition-all cursor-pointer"
        >
          <Sparkles className="h-4 w-4" />
          <span>+ {t.addTransaction}</span>
        </button>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-400"
          />
        </div>

        {/* Filter controls row */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Segmented Type Filter (Functional Buttons) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl dark:bg-slate-800">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer ${
                typeFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {t.filterAll}
            </button>
            <button
              onClick={() => setTypeFilter('income')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer ${
                typeFilter === 'income'
                  ? 'bg-white text-emerald-600 shadow-sm dark:bg-slate-900 dark:text-emerald-400 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {t.filterIncome}
            </button>
            <button
              onClick={() => setTypeFilter('expense')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer ${
                typeFilter === 'expense'
                  ? 'bg-white text-rose-600 shadow-sm dark:bg-slate-900 dark:text-rose-400 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {t.filterExpense}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category dropdown */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="all">Barcha toifalar</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>

            {/* Date filter dropdown */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="all">Barcha vaqt</option>
              <option value="today">{t.filterToday}</option>
              <option value="week">{t.filterWeek}</option>
              <option value="month">{t.filterMonth}</option>
            </select>

            {/* Sort selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="date-desc">Sana: Eng yangi</option>
              <option value="date-asc">Sana: Eng eski</option>
              <option value="amount-desc">Summa: Katta → Kichik</option>
              <option value="amount-asc">Summa: Kichik → Katta</option>
            </select>
          </div>

        </div>

      </div>

      {/* TRANSACTIONS LIST / TABLE */}
      <div className="rounded-3xl border border-slate-200/90 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-900">
        
        {sorted.length === 0 ? (
          <div className="py-16 text-center">
            <Filter className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Hech qanday tranzaksiya topilmadi
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Qidiruv yoki filtrlarni o‘zgartirib ko‘ring.
            </p>
          </div>
        ) : (
          <div>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 dark:bg-slate-950 dark:text-slate-400 dark:border-slate-800 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">{t.date}</th>
                    <th className="py-3.5 px-4">{t.type}</th>
                    <th className="py-3.5 px-4">{t.category}</th>
                    <th className="py-3.5 px-4">{t.description}</th>
                    <th className="py-3.5 px-4 text-right">{t.amount}</th>
                    <th className="py-3.5 px-4 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {sorted.map((tx) => (
                    <tr 
                      key={tx.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-mono">
                        {tx.date}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 font-semibold ${
                          tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                        }`}>
                          {tx.type === 'income' ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                          {tx.type === 'income' ? t.income : t.expense}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                        {tx.categoryName}
                      </td>

                      <td className="py-3.5 px-4 text-slate-900 dark:text-white max-w-xs truncate font-medium">
                        {tx.description}
                        {tx.source === 'ai' && (
                          <span className="ml-2 text-[10px] text-emerald-600 dark:text-emerald-400">· AI</span>
                        )}
                      </td>

                      <td className={`py-3.5 px-4 text-right font-mono font-bold text-sm tabular-nums ${
                        tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        {tx.type === 'income' ? '+' : '-'}{tx.amount.toLocaleString('uz-UZ')} {currency}
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => setEditingTx(tx)}
                          className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                          title={t.editTransaction}
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(tx.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title={t.deleteTransaction}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {sorted.map((tx) => (
                <div key={tx.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">{tx.date}</span>
                    <span className={`font-mono font-bold text-sm tabular-nums ${
                      tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'}{tx.amount.toLocaleString('uz-UZ')} {currency}
                    </span>
                  </div>

                  <div className="font-semibold text-sm text-slate-900 dark:text-white">
                    {tx.description}
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{tx.categoryName}</span>
                      <span>·</span>
                      <span className={tx.type === 'income' ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>
                        {tx.type === 'income' ? t.income : t.expense}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setEditingTx(tx)}
                        className="text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(tx.id)}
                        className="text-slate-500 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>

      {/* EDIT MODAL */}
      {editingTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t.editTransaction}
              </h3>
              <button
                onClick={() => setEditingTx(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setEditingTx({ ...editingTx, type: 'income' })}
                  className={`py-2 rounded-xl font-semibold cursor-pointer ${
                    editingTx.type === 'income' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {t.income}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTx({ ...editingTx, type: 'expense' })}
                  className={`py-2 rounded-xl font-semibold cursor-pointer ${
                    editingTx.type === 'expense' ? 'bg-rose-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {t.expense}
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {t.amount} ({currency})
                </label>
                <input
                  type="number"
                  value={editingTx.amount}
                  onChange={(e) => setEditingTx({ ...editingTx, amount: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm font-mono tabular-nums text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {t.category}
                </label>
                <select
                  value={editingTx.categoryName}
                  onChange={(e) => setEditingTx({ ...editingTx, categoryName: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {t.date}
                </label>
                <input
                  type="date"
                  value={editingTx.date}
                  onChange={(e) => setEditingTx({ ...editingTx, date: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {t.description}
                </label>
                <input
                  type="text"
                  value={editingTx.description}
                  onChange={(e) => setEditingTx({ ...editingTx, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingTx(null)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {t.btnCancel}
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-500 shadow-sm cursor-pointer"
                >
                  {t.saved}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 mx-auto mb-3">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Tranzaksiyani o‘chirish
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              {t.confirmDelete}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
              >
                {t.btnCancel}
              </button>
              <button
                onClick={() => {
                  onDeleteTransaction(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-rose-500 shadow-md shadow-rose-600/30 cursor-pointer"
              >
                {t.deleteTransaction}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
