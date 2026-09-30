import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Sun, 
  Moon, 
  Bell, 
  Globe, 
  Check, 
  LogOut, 
  User as UserIcon,
  HelpCircle,
  Menu,
  X
} from 'lucide-react';
import { Language, Theme, User, AppNotification } from '../types';
import { translations } from '../i18n/translations';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  theme: Theme;
  onThemeToggle: () => void;
  isDemo: boolean;
  onExitDemo: () => void;
  onOpenAiModal: () => void;
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  notifications: AppNotification[];
  onMarkNotificationRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  lang,
  onLanguageChange,
  theme,
  onThemeToggle,
  isDemo,
  onExitDemo,
  onOpenAiModal,
  user,
  onOpenAuth,
  onLogout,
  notifications,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
}) => {
  const t = translations[lang];
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read);

  const navLinks = [
    { id: 'dashboard', label: t.navHome },
    { id: 'transactions', label: t.navTransactions },
    { id: 'analytics', label: t.navAnalytics },
    { id: 'debts', label: t.navDebts },
    { id: 'reports', label: t.navReports },
    { id: 'assistant', label: t.navAiAssistant },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Single text element Brand */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('dashboard')} 
            className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                Hisobchi<span className="text-emerald-600 dark:text-emerald-400">AI</span>
              </span>
            </div>
          </button>

          {isDemo && (
            <div className="hidden sm:flex items-center gap-1.5 pl-2 text-xs text-amber-700 dark:text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="font-medium">{t.demoModeActive}</span>
              <button 
                onClick={onExitDemo}
                className="underline hover:text-amber-800 dark:hover:text-amber-300 ml-1 cursor-pointer"
              >
                ({t.exitDemo})
              </button>
            </div>
          )}
        </div>

        {/* Zone 2: 4-6 Clean Text Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          {navLinks.map((link) => {
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`transition-colors whitespace-nowrap py-1 cursor-pointer border-b-2 text-sm ${
                  isActive 
                    ? 'border-emerald-600 text-emerald-600 font-semibold dark:border-emerald-400 dark:text-emerald-400' 
                    : 'border-transparent hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick AI Add Transaction Button */}
          <button
            onClick={onOpenAiModal}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm shadow-emerald-600/30 hover:bg-emerald-500 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t.addTransaction}</span>
            <span className="sm:hidden font-mono">+ AI</span>
          </button>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Tilni tanlash / Выбрать язык / Language"
              aria-label="Language selection"
            >
              <Globe className="h-4 w-4" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-36 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-800 dark:bg-slate-900 z-50">
                <button
                  onClick={() => { onLanguageChange('uz'); setLangMenuOpen(false); }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-xs font-medium cursor-pointer ${
                    lang === 'uz' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400' : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>O‘zbekcha</span>
                  {lang === 'uz' && <Check className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={() => { onLanguageChange('ru'); setLangMenuOpen(false); }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-xs font-medium cursor-pointer ${
                    lang === 'ru' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400' : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>Русский</span>
                  {lang === 'ru' && <Check className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={() => { onLanguageChange('en'); setLangMenuOpen(false); }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-xs font-medium cursor-pointer ${
                    lang === 'en' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400' : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>English</span>
                  {lang === 'en' && <Check className="h-3.5 w-3.5" />}
                </button>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onThemeToggle}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Mavzu (Yorug‘ / Qorong‘i)"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setNotifMenuOpen(!notifMenuOpen)}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Xabarnomalar"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {notifMenuOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                    {t.notifications}
                  </span>
                  {unreadNotifs.length > 0 && (
                    <button
                      onClick={onMarkAllNotificationsRead}
                      className="text-[11px] text-emerald-600 hover:underline dark:text-emerald-400 cursor-pointer"
                    >
                      Barchasini o‘qilgan qilish
                    </button>
                  )}
                </div>

                <div className="mt-2 space-y-2 max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4 text-center">Xabarnomalar yo‘q</p>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id}
                        onClick={() => onMarkNotificationRead(n.id)}
                        className={`rounded-xl p-2.5 text-xs transition-colors cursor-pointer ${
                          n.read 
                            ? 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400' 
                            : 'bg-emerald-50/70 dark:bg-emerald-950/40 text-slate-800 dark:text-slate-200 border-l-2 border-emerald-500'
                        }`}
                      >
                        <div className="font-semibold">{n.title}</div>
                        <div className="text-[11px] mt-0.5 opacity-90">{n.message}</div>
                        <div className="text-[10px] text-slate-400 mt-1">{n.date}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User profile / Log in */}
          <div className="relative">
            {user ? (
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-xl p-1 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-8 w-8 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 text-xs font-bold">
                    {user.name.charAt(0)}
                  </div>
                )}
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {t.login}
              </button>
            )}

            {userMenuOpen && user && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase">
                    Tarif: {user.plan.toUpperCase()}
                  </span>
                </div>
                <div className="p-1 space-y-1">
                  <button
                    onClick={() => { onNavigate('settings'); setUserMenuOpen(false); }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <UserIcon className="h-3.5 w-3.5" />
                    <span>{t.navSettings}</span>
                  </button>
                  <button
                    onClick={() => { onNavigate('pricing'); setUserMenuOpen(false); }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <HelpCircle className="h-3.5 w-3.5" />
                    <span>{t.navPricing}</span>
                  </button>
                  <button
                    onClick={() => { onLogout(); setUserMenuOpen(false); }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30 cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>{t.logout}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

        </div>
      </div>

      {/* Mobile drawer for quick navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 transition-all">
          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`rounded-xl px-3 py-2 text-left cursor-pointer transition-colors ${
                  currentView === link.id
                    ? 'bg-emerald-50 text-emerald-700 font-semibold dark:bg-emerald-950/60 dark:text-emerald-400'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => {
                onNavigate('pricing');
                setMobileMenuOpen(false);
              }}
              className="rounded-xl px-3 py-2 text-left text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
            >
              {t.navPricing}
            </button>
            <button
              onClick={() => {
                onNavigate('settings');
                setMobileMenuOpen(false);
              }}
              className="rounded-xl px-3 py-2 text-left text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
            >
              {t.navSettings}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
