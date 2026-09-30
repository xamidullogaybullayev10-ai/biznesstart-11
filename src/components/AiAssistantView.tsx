import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Loader2, 
  HelpCircle 
} from 'lucide-react';
import { 
  Transaction, 
  Category, 
  Debt, 
  Currency, 
  Language, 
  Business, 
  ChatMessage 
} from '../types';
import { translations } from '../i18n/translations';
import { aiService } from '../services/aiService';

interface AiAssistantViewProps {
  transactions: Transaction[];
  categories: Category[];
  debts: Debt[];
  business: Business;
  currency: Currency;
  lang: Language;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  transactions,
  categories,
  debts,
  business,
  currency,
  lang,
}) => {
  const t = translations[lang];

  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonthStr = todayStr.substring(0, 7);

  // Financial Context Builder
  const monthlyIncome = transactions
    .filter(t => t.date.startsWith(currentMonthStr) && t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpense = transactions
    .filter(t => t.date.startsWith(currentMonthStr) && t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = monthlyIncome - monthlyExpense;

  const categoryMap = new Map<string, number>();
  for (const tx of transactions.filter(t => t.type === 'expense')) {
    categoryMap.set(tx.categoryName, (categoryMap.get(tx.categoryName) || 0) + tx.amount);
  }

  const categoryBreakdown = Array.from(categoryMap.entries()).map(([name, amount]) => ({
    name,
    amount,
  }));

  const largestCat = categoryBreakdown.sort((a, b) => b.amount - a.amount)[0];

  const financialContext = {
    businessName: business.name,
    currency,
    currentDate: todayStr,
    monthlyIncome,
    monthlyExpense,
    netProfit,
    marginPercent: monthlyIncome > 0 ? Math.round((netProfit / monthlyIncome) * 100) : 0,
    largestExpenseCategory: largestCat ? largestCat.name : 'Boshqa',
    largestExpenseAmount: largestCat ? largestCat.amount : 0,
    categoryBreakdown,
    totalTransactionsCount: transactions.length,
    debtsSummary: {
      receivableOwedToUs: debts.filter(d => !d.isPaid && d.type === 'receivable').reduce((s, d) => s + d.amount, 0),
      payableWeOwe: debts.filter(d => !d.isPaid && d.type === 'payable').reduce((s, d) => s + d.amount, 0),
      overdueCount: debts.filter(d => !d.isPaid && d.dueDate < todayStr).length,
    }
  };

  // Chat message history
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-01',
      role: 'assistant',
      content: `Assalomu alaykum! Men HisobchiAI — sizning biznesingiz shaxsiy moliya yordamchisiman.\n\nMen faqat siz kiritgan moliyaviy ma’lumotlar asosida hisob-kitob qilaman va xulosalar beraman. Menga istalgan savolingizni bering!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuestion, setInputQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  const handleSendQuestion = async (customQ?: string) => {
    const q = customQ || inputQuestion;
    if (!q.trim() || isAsking) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      role: 'user',
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuestion('');
    setIsAsking(true);

    try {
      const answer = await aiService.askAssistant(q, financialContext, lang);
      const botMsg: ChatMessage = {
        id: `msg-${Date.now()}-b`,
        role: 'assistant',
        content: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      // handled
    } finally {
      setIsAsking(false);
    }
  };

  const quickQuestions = [
    t.q1,
    t.q2,
    t.q3,
    t.q4,
    t.q5,
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-150">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-sm shadow-emerald-500/30">
            <Bot className="h-5 w-5" />
          </div>
          <span>{t.aiAssistantTitle}</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {t.aiAssistantSubtitle}
        </p>
      </div>

      {/* CHAT CONTAINER */}
      <div className="rounded-3xl border border-slate-200/90 bg-white shadow-sm flex flex-col h-[520px] overflow-hidden dark:border-slate-800 dark:bg-slate-900">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((m) => {
            const isBot = m.role === 'assistant';

            return (
              <div
                key={m.id}
                className={`flex gap-3 text-xs leading-relaxed ${
                  isBot ? 'justify-start' : 'justify-end'
                }`}
              >
                {isBot && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 mt-0.5">
                    <Sparkles className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`rounded-2xl p-4 max-w-[85%] sm:max-w-xl whitespace-pre-wrap ${
                    isBot
                      ? 'bg-slate-50 text-slate-800 border border-slate-100 dark:bg-slate-950 dark:text-slate-200 dark:border-slate-800'
                      : 'bg-emerald-600 text-white shadow-sm'
                  }`}
                >
                  <p>{m.content}</p>
                  <div className={`text-[10px] mt-2 font-mono ${isBot ? 'text-slate-400' : 'text-emerald-100'}`}>
                    {m.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isAsking && (
            <div className="flex gap-3 text-xs justify-start">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/30">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="rounded-2xl p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center gap-2 text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                <span>Hisob-kitob qilinmoqda...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
            <HelpCircle className="h-3 w-3" />
            <span>{t.suggestedQuestions}</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendQuestion(q)}
                className="whitespace-nowrap rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400 transition-colors cursor-pointer shrink-0"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input Box */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuestion();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder={t.askAiPlaceholder}
              className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-400"
            />

            <button
              type="submit"
              disabled={!inputQuestion.trim() || isAsking}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-sm shadow-emerald-600/30"
              aria-label="Send question"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
