import React, { useState } from 'react';
import { Transaction, Category, Currency } from '../types';

interface ChartProps {
  transactions: Transaction[];
  categories: Category[];
  currency: Currency;
}

// 1. Income vs Expense Trend (Dual Line / Area Chart)
export const IncomeExpenseLineChart: React.FC<ChartProps> = ({ transactions, currency }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Group by last 7 days
  const days: { date: string; label: string; income: number; expense: number }[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('uz-UZ', { weekday: 'short', day: 'numeric' });

    const dayIncome = transactions
      .filter(t => t.date === dateStr && t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const dayExpense = transactions
      .filter(t => t.date === dateStr && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    days.push({
      date: dateStr,
      label: dayLabel,
      income: dayIncome,
      expense: dayExpense,
    });
  }

  const maxVal = Math.max(...days.map(d => Math.max(d.income, d.expense)), 1000000);

  const width = 600;
  const height = 220;
  const padX = 40;
  const padY = 30;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;

  const pointsIncome = days.map((d, idx) => {
    const x = padX + (idx / (days.length - 1)) * chartW;
    const y = padY + chartH - (d.income / maxVal) * chartH;
    return { x, y, data: d };
  });

  const pointsExpense = days.map((d, idx) => {
    const x = padX + (idx / (days.length - 1)) * chartW;
    const y = padY + chartH - (d.expense / maxVal) * chartH;
    return { x, y, data: d };
  });

  const pathIncome = pointsIncome.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
  const pathExpense = pointsExpense.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span>Daromad</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            <span>Xarajat</span>
          </div>
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">Oxirgi 7 kun</span>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 overflow-visible">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = padY + chartH * (1 - ratio);
            return (
              <g key={i}>
                <line
                  x1={padX}
                  y1={y}
                  x2={width - padX}
                  y2={y}
                  className="stroke-slate-100 dark:stroke-slate-800"
                  strokeDasharray="4 4"
                />
                <text
                  x={padX - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[9px] fill-slate-400 tabular-nums"
                >
                  {Math.round((maxVal * ratio) / 1000)}k
                </text>
              </g>
            );
          })}

          {/* Lines */}
          <path
            d={pathIncome}
            fill="none"
            className="stroke-emerald-500 dark:stroke-emerald-400"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={pathExpense}
            fill="none"
            className="stroke-rose-500 dark:stroke-rose-400"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Dots */}
          {pointsIncome.map((p, idx) => (
            <g key={`inc-${idx}`} className="cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r={hoverIndex === idx ? 6 : 4}
                className="fill-white stroke-emerald-500 dark:fill-slate-900"
                strokeWidth="2.5"
                onMouseEnter={() => setHoverIndex(idx)}
              />
            </g>
          ))}

          {pointsExpense.map((p, idx) => (
            <g key={`exp-${idx}`} className="cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r={hoverIndex === idx ? 6 : 4}
                className="fill-white stroke-rose-500 dark:fill-slate-900"
                strokeWidth="2.5"
                onMouseEnter={() => setHoverIndex(idx)}
              />
            </g>
          ))}

          {/* X axis labels */}
          {days.map((d, idx) => {
            const x = padX + (idx / (days.length - 1)) * chartW;
            return (
              <text
                key={idx}
                x={x}
                y={height - 6}
                textAnchor="middle"
                className="text-[10px] fill-slate-500 dark:fill-slate-400 font-medium"
              >
                {d.label}
              </text>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoverIndex !== null && (
          <div 
            className="absolute top-0 right-0 rounded-xl bg-slate-900/90 text-white p-2.5 text-xs shadow-xl backdrop-blur-sm pointer-events-none"
          >
            <div className="text-[11px] text-slate-300 font-medium mb-1">
              {days[hoverIndex].label}
            </div>
            <div className="flex items-center gap-2 text-emerald-400 font-mono tabular-nums">
              <span>Daromad:</span>
              <span className="font-bold">+{days[hoverIndex].income.toLocaleString('uz-UZ')} {currency}</span>
            </div>
            <div className="flex items-center gap-2 text-rose-400 font-mono tabular-nums">
              <span>Xarajat:</span>
              <span className="font-bold">-{days[hoverIndex].expense.toLocaleString('uz-UZ')} {currency}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 2. Expense Category Donut / Pie Chart
export const ExpenseCategoryDonutChart: React.FC<ChartProps> = ({ transactions, categories, currency }) => {
  const [hoverCategory, setHoverCategory] = useState<string | null>(null);

  // Filter only expenses
  const expenses = transactions.filter(t => t.type === 'expense');
  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);

  // Group by category
  const categoryMap = new Map<string, number>();
  for (const t of expenses) {
    const current = categoryMap.get(t.categoryName) || 0;
    categoryMap.set(t.categoryName, current + t.amount);
  }

  const categoryList: { name: string; amount: number; percentage: number; color: string }[] = [];
  const palette = ['#3b82f6', '#ec4899', '#f59e0b', '#8b5cf6', '#10b981', '#06b6d4', '#6366f1', '#ef4444', '#64748b', '#14b8a6', '#94a3b8'];

  let idx = 0;
  for (const [name, amount] of categoryMap.entries()) {
    const matched = categories.find(c => c.name.toLowerCase() === name.toLowerCase());
    const color = matched ? matched.color : palette[idx % palette.length];
    const percentage = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
    categoryList.push({ name, amount, percentage, color });
    idx++;
  }

  // Sort descending
  categoryList.sort((a, b) => b.amount - a.amount);

  // SVG Donut calculation
  const size = 180;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let currentOffset = 0;
  const segments = categoryList.map((cat) => {
    const strokeDasharray = `${(cat.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -currentOffset;
    currentOffset += (cat.percentage / 100) * circumference;
    return { ...cat, strokeDasharray, strokeDashoffset };
  });

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
        {/* Donut graphic */}
        <div className="relative flex items-center justify-center">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="currentColor"
              className="text-slate-100 dark:text-slate-800"
              strokeWidth={strokeWidth}
            />
            {/* Colored segments */}
            {segments.map((seg, i) => (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={seg.color}
                strokeWidth={hoverCategory === seg.name ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={seg.strokeDasharray}
                strokeDashoffset={seg.strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoverCategory(seg.name)}
                onMouseLeave={() => setHoverCategory(null)}
              />
            ))}
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Jami xarajat</span>
            <span className="text-sm font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {totalExpense.toLocaleString('uz-UZ')}
            </span>
            <span className="text-[10px] text-slate-400">{currency}</span>
          </div>
        </div>

        {/* Legend list */}
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {categoryList.length === 0 ? (
            <p className="text-xs text-slate-400 py-4">Xarajatlar mavjud emas</p>
          ) : (
            categoryList.map((cat, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoverCategory(cat.name)}
                onMouseLeave={() => setHoverCategory(null)}
                className={`flex items-center justify-between text-xs p-1.5 rounded-lg transition-colors cursor-pointer ${
                  hoverCategory === cat.name ? 'bg-slate-100 dark:bg-slate-800' : ''
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                    {cat.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono tabular-nums text-right shrink-0">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {cat.amount.toLocaleString('uz-UZ')}
                  </span>
                  <span className="text-[10px] text-slate-400 w-9 text-right">
                    {cat.percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// 3. Monthly Net Profit Bar Chart
export const MonthlyProfitBarChart: React.FC<ChartProps> = ({ transactions, currency }) => {
  // Mock last 5 months data synthesized with current month
  const months = ['May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr'];
  const data = [
    { month: months[0], profit: 3400000 },
    { month: months[1], profit: 4100000 },
    { month: months[2], profit: 3850000 },
    { month: months[3], profit: 4800000 },
    {
      month: months[4],
      profit: transactions.reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0),
    },
  ];

  const maxVal = Math.max(...data.map(d => d.profit), 6000000);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Oylar bo‘yicha sof foyda</span>
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
          +18% o‘sish
        </span>
      </div>

      <div className="h-44 flex items-end gap-3 pt-6 pb-2">
        {data.map((item, idx) => {
          const heightPercent = Math.max(10, Math.round((item.profit / maxVal) * 100));
          const isCurrent = idx === data.length - 1;

          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="text-[10px] font-mono tabular-nums text-slate-400 group-hover:text-emerald-600 transition-colors">
                {(item.profit / 1000000).toFixed(1)}M
              </div>

              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl h-28 flex items-end overflow-hidden p-1">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-lg transition-all duration-300 ${
                    isCurrent
                      ? 'bg-gradient-to-t from-emerald-600 to-teal-400 shadow-sm shadow-emerald-500/30'
                      : 'bg-emerald-500/70 hover:bg-emerald-500'
                  }`}
                />
              </div>

              <span className={`text-[11px] font-medium ${
                isCurrent ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400'
              }`}>
                {item.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
