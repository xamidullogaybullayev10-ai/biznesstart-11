import React, { useState } from 'react';
import { 
  FileDown, 
  Printer, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Tag, 
  Check, 
  Share2 
} from 'lucide-react';
import { Transaction, Category, Currency, Language, Business } from '../types';
import { translations } from '../i18n/translations';

interface ReportsViewProps {
  transactions: Transaction[];
  categories: Category[];
  business: Business;
  currency: Currency;
  lang: Language;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  transactions,
  categories,
  business,
  currency,
  lang,
}) => {
  const t = translations[lang];

  const todayStr = new Date().toISOString().split('T')[0];
  const [reportPeriod, setReportPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('monthly');

  // Custom date range
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(todayStr);

  // Filter transactions based on selected period
  const filtered = transactions.filter((tx) => {
    if (reportPeriod === 'daily') {
      return tx.date === todayStr;
    }
    if (reportPeriod === 'weekly') {
      const txDate = new Date(tx.date);
      const now = new Date();
      const diff = Math.ceil((now.getTime() - txDate.getTime()) / (1000 * 3600 * 24));
      return diff <= 7 && diff >= 0;
    }
    if (reportPeriod === 'monthly') {
      const curMonth = todayStr.substring(0, 7);
      return tx.date.startsWith(curMonth);
    }
    if (reportPeriod === 'custom') {
      return tx.date >= startDate && tx.date <= endDate;
    }
    return true;
  });

  const totalIncome = filtered
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filtered
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpense;
  const marginPercent = totalIncome > 0 ? Math.round((netProfit / totalIncome) * 100) : 0;

  // Largest expense
  const expenses = filtered.filter(t => t.type === 'expense');
  const largestExpenseTx = expenses.sort((a, b) => b.amount - a.amount)[0];

  // Most profitable / highest income category
  const incomeCategoryMap = new Map<string, number>();
  for (const tx of filtered.filter(t => t.type === 'income')) {
    incomeCategoryMap.set(tx.categoryName, (incomeCategoryMap.get(tx.categoryName) || 0) + tx.amount);
  }
  const topIncomeCat = Array.from(incomeCategoryMap.entries()).sort((a, b) => b[1] - a[1])[0];

  // Excel / CSV Export
  const exportToExcelCsv = () => {
    // Generate CSV with UTF-8 BOM (\uFEFF) so Excel renders Uzbek / Cyrillic letters without encoding issues
    let csvContent = '\uFEFF';
    csvContent += `"${business.name} - Moliyaviy Hisobot"\n`;
    csvContent += `"Hisobot davri":;"${reportPeriod.toUpperCase()}"\n`;
    csvContent += `"Jami daromad":;"${totalIncome} ${currency}"\n`;
    csvContent += `"Jami xarajat":;"${totalExpense} ${currency}"\n`;
    csvContent += `"Sof foyda":;"${netProfit} ${currency}"\n\n`;

    csvContent += `"Sana";"Turi";"Toifa";"Tavsif";"Summa (${currency})"\n`;

    filtered.forEach(tx => {
      const typeLabel = tx.type === 'income' ? 'Daromad' : 'Xarajat';
      const cleanDesc = tx.description.replace(/"/g, '""');
      csvContent += `"${tx.date}";"${typeLabel}";"${tx.categoryName}";"${cleanDesc}";"${tx.amount}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Hisobot_${business.name.replace(/\s+/g, '_')}_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Header with Export actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.reportsTitle}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Daromad, xarajat va foyda tahlili bo‘yicha to‘liq rasmiy hisobot
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportToExcelCsv}
            className="flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <FileDown className="h-4 w-4 text-emerald-600" />
            <span>{t.downloadExcel}</span>
          </button>

          <button
            onClick={handlePrintPdf}
            className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-500 transition-all cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>{t.downloadPdf}</span>
          </button>
        </div>
      </div>

      {/* PERIOD SELECTOR TABS */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl dark:bg-slate-800">
          <button
            onClick={() => setReportPeriod('daily')}
            className={`px-3 py-1.5 rounded-xl font-medium cursor-pointer transition-colors ${
              reportPeriod === 'daily' ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {t.dailyReport}
          </button>
          <button
            onClick={() => setReportPeriod('weekly')}
            className={`px-3 py-1.5 rounded-xl font-medium cursor-pointer transition-colors ${
              reportPeriod === 'weekly' ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {t.weeklyReport}
          </button>
          <button
            onClick={() => setReportPeriod('monthly')}
            className={`px-3 py-1.5 rounded-xl font-medium cursor-pointer transition-colors ${
              reportPeriod === 'monthly' ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {t.monthlyReport}
          </button>
          <button
            onClick={() => setReportPeriod('custom')}
            className={`px-3 py-1.5 rounded-xl font-medium cursor-pointer transition-colors ${
              reportPeriod === 'custom' ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {t.customPeriod}
          </button>
        </div>

        {reportPeriod === 'custom' && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
            />
            <span className="text-slate-400">—</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
        )}
      </div>

      {/* SUMMARY KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Jami tushum</div>
          <div className="mt-2 text-xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
            +{totalIncome.toLocaleString('uz-UZ')} {currency}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Jami xarajat</div>
          <div className="mt-2 text-xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400">
            -{totalExpense.toLocaleString('uz-UZ')} {currency}
          </div>
        </div>

        <div className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/30 p-4 dark:border-emerald-500/40 dark:bg-emerald-950/20">
          <div className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold">{t.netProfit}</div>
          <div className="mt-2 text-xl font-bold font-mono tabular-nums text-emerald-700 dark:text-emerald-300">
            {netProfit >= 0 ? '+' : ''}{netProfit.toLocaleString('uz-UZ')} {currency}
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">Rentabellik: {marginPercent}%</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.largestExpense}</div>
          <div className="mt-2 text-sm font-bold text-slate-900 dark:text-white truncate">
            {largestExpenseTx ? largestExpenseTx.description : 'Mavjud emas'}
          </div>
          <div className="text-xs font-mono font-bold text-rose-500 mt-0.5">
            {largestExpenseTx ? `-${largestExpenseTx.amount.toLocaleString('uz-UZ')} ${currency}` : '-'}
          </div>
        </div>
      </div>

      {/* FORMAL FINANCIAL STATEMENT TABLE (PRINTABLE) */}
      <div id="printable-report" className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
        
        {/* Statement Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {business.name} — Moliyaviy Hisobot
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Davr: <span className="font-semibold">{reportPeriod.toUpperCase()}</span> ({filtered.length} ta yozuv)
            </p>
          </div>
          <div className="text-right text-xs text-slate-400 font-mono">
            Chiqarilgan sana: {todayStr}
          </div>
        </div>

        {/* Detailed Transactions List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 dark:bg-slate-950 dark:text-slate-400 dark:border-slate-800 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-3">Sana</th>
                <th className="py-3 px-3">Turi</th>
                <th className="py-3 px-3">Toifa</th>
                <th className="py-3 px-3">Tavsif</th>
                <th className="py-3 px-3 text-right">Summa ({currency})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-mono text-slate-500">{tx.date}</td>
                  <td className="py-2.5 px-3">
                    <span className={tx.type === 'income' ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>
                      {tx.type === 'income' ? 'Daromad' : 'Xarajat'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300">{tx.categoryName}</td>
                  <td className="py-2.5 px-3 text-slate-900 dark:text-white">{tx.description}</td>
                  <td className={`py-2.5 px-3 text-right font-mono font-bold tabular-nums ${
                    tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {tx.type === 'income' ? '+' : '-'}{tx.amount.toLocaleString('uz-UZ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Statement Footer Totals */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-end items-end gap-2 text-xs">
          <div className="w-full sm:w-64 space-y-1.5 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Umumiy daromad:</span>
              <span className="font-mono font-bold text-emerald-600">+{totalIncome.toLocaleString('uz-UZ')} {currency}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Umumiy xarajat:</span>
              <span className="font-mono font-bold text-rose-600">-{totalExpense.toLocaleString('uz-UZ')} {currency}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-800">
              <span>Sof foyda:</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400">{netProfit.toLocaleString('uz-UZ')} {currency}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
