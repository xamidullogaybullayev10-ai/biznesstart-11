import React from 'react';
import { 
  Home, 
  CreditCard, 
  TrendingUp, 
  Bot, 
  Settings, 
  Plus 
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface MobileNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAiModal: () => void;
  lang: Language;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentView,
  onNavigate,
  onOpenAiModal,
  lang,
}) => {
  const t = translations[lang];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 lg:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {/* 1. Bosh sahifa */}
        <button
          onClick={() => onNavigate('dashboard')}
          className={`flex flex-col items-center justify-center flex-1 py-1 min-h-[44px] cursor-pointer transition-colors ${
            currentView === 'dashboard'
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
          aria-label={t.navHome}
        >
          <Home className="h-5 w-5" />
          <span className="text-[10px] mt-1 truncate">{t.navHome}</span>
        </button>

        {/* 2. Tranzaksiyalar */}
        <button
          onClick={() => onNavigate('transactions')}
          className={`flex flex-col items-center justify-center flex-1 py-1 min-h-[44px] cursor-pointer transition-colors ${
            currentView === 'transactions'
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
          aria-label={t.navTransactions}
        >
          <CreditCard className="h-5 w-5" />
          <span className="text-[10px] mt-1 truncate">{t.navTransactions}</span>
        </button>

        {/* Center: Primary Quick Add Button */}
        <div className="flex flex-col items-center justify-center px-1">
          <button
            onClick={onOpenAiModal}
            className="flex items-center justify-center w-12 h-12 -mt-5 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/40 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            aria-label="Add transaction"
            title="Tranzaksiya qo‘shish"
          >
            <Plus className="h-6 w-6 stroke-[2.5]" />
          </button>
          <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
            + AI
          </span>
        </div>

        {/* 4. Tahlil */}
        <button
          onClick={() => onNavigate('analytics')}
          className={`flex flex-col items-center justify-center flex-1 py-1 min-h-[44px] cursor-pointer transition-colors ${
            currentView === 'analytics'
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
          aria-label={t.navAnalytics}
        >
          <TrendingUp className="h-5 w-5" />
          <span className="text-[10px] mt-1 truncate">{t.navAnalytics}</span>
        </button>

        {/* 5. AI Assistant */}
        <button
          onClick={() => onNavigate('assistant')}
          className={`flex flex-col items-center justify-center flex-1 py-1 min-h-[44px] cursor-pointer transition-colors ${
            currentView === 'assistant'
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
          aria-label={t.navAiAssistant}
        >
          <Bot className="h-5 w-5" />
          <span className="text-[10px] mt-1 truncate">{t.navAiAssistant}</span>
        </button>

        {/* 6. Sozlamalar */}
        <button
          onClick={() => onNavigate('settings')}
          className={`flex flex-col items-center justify-center flex-1 py-1 min-h-[44px] cursor-pointer transition-colors ${
            currentView === 'settings'
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
          aria-label={t.navSettings}
        >
          <Settings className="h-5 w-5" />
          <span className="text-[10px] mt-1 truncate">{t.navSettings}</span>
        </button>
      </div>
    </nav>
  );
};
