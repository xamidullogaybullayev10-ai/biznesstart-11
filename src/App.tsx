import React, { useState, useEffect } from 'react';
import { 
  Language, 
  Theme, 
  User, 
  Business, 
  Transaction, 
  Category, 
  Debt, 
  AppNotification, 
  UserPlan 
} from './types';
import { storageService } from './services/storageService';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { TransactionsView } from './components/TransactionsView';
import { DebtsView } from './components/DebtsView';
import { AnalyticsView } from './components/AnalyticsView';
import { AiAssistantView } from './components/AiAssistantView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { AiTransactionModal } from './components/AiTransactionModal';
import { AuthModal } from './components/AuthModal';
import { PricingModal } from './components/PricingModal';

export default function App() {
  // Initialize storage
  useEffect(() => {
    storageService.initStorage();
  }, []);

  // Theme & Language
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('hisobchi_theme');
    return (saved as Theme) || 'light';
  });

  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('hisobchi_language');
    return (saved as Language) || 'uz';
  });

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('hisobchi_theme', theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('hisobchi_language', newLang);
  };

  // State Management
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [isDemo, setIsDemo] = useState<boolean>(() => storageService.isDemoMode());
  const [user, setUser] = useState<User | null>(() => storageService.getUser());
  const [business, setBusiness] = useState<Business>(() => storageService.getBusiness());
  const [transactions, setTransactions] = useState<Transaction[]>(() => storageService.getTransactions());
  const [categories, setCategories] = useState<Category[]>(() => storageService.getCategories());
  const [debts, setDebts] = useState<Debt[]>(() => storageService.getDebts());
  const [notifications, setNotifications] = useState<AppNotification[]>(() => storageService.getNotifications());

  // Modals
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  // Sync state whenever view changes or on init
  const refreshAllState = () => {
    setUser(storageService.getUser());
    setBusiness(storageService.getBusiness());
    setTransactions(storageService.getTransactions());
    setCategories(storageService.getCategories());
    setDebts(storageService.getDebts());
    setNotifications(storageService.getNotifications());
    setIsDemo(storageService.isDemoMode());
  };

  // Handlers
  const handleSaveTransaction = (newTx: Omit<Transaction, 'id' | 'createdAt'>) => {
    const saved = storageService.addTransaction(newTx);
    setTransactions(prev => [saved, ...prev]);

    // Optional notification on add
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Yangi tranzaksiya kiritildi',
      message: `${newTx.description}: ${newTx.type === 'income' ? '+' : '-'}${newTx.amount.toLocaleString('uz-UZ')} ${business.currency}`,
      date: new Date().toISOString().split('T')[0],
      read: false,
      type: newTx.type === 'income' ? 'success' : 'info',
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const handleUpdateTransaction = (tx: Transaction) => {
    const updated = storageService.updateTransaction(tx);
    setTransactions(updated);
  };

  const handleDeleteTransaction = (id: string) => {
    const updated = storageService.deleteTransaction(id);
    setTransactions(updated);
  };

  const handleAddDebt = (debt: Omit<Debt, 'id' | 'createdAt' | 'isPaid'>) => {
    const saved = storageService.addDebt(debt);
    setDebts(prev => [saved, ...prev]);
  };

  const handleToggleDebtPaid = (id: string) => {
    const updated = storageService.toggleDebtPaid(id);
    setDebts(updated);
  };

  const handleDeleteDebt = (id: string) => {
    const updated = storageService.deleteDebt(id);
    setDebts(updated);
  };

  const handleAddCategory = (cat: Omit<Category, 'id'>) => {
    const saved = storageService.addCategory(cat);
    setCategories(prev => [...prev, saved]);
  };

  const handleUpdateBusiness = (b: Business) => {
    storageService.updateBusiness(b);
    setBusiness(b);
  };

  const handleCompleteAuth = (newUser: User, newBusiness: Business) => {
    storageService.setUser(newUser);
    storageService.updateBusiness(newBusiness);
    storageService.setDemoMode(false);
    setUser(newUser);
    setBusiness(newBusiness);
    setIsDemo(false);
    setCurrentView('dashboard');
  };

  const handleExitDemo = () => {
    storageService.setDemoMode(false);
    setIsDemo(false);
    setIsAuthModalOpen(true);
  };

  const handleResetDemo = () => {
    storageService.resetToDemo();
    refreshAllState();
  };

  const handleClearAll = () => {
    storageService.clearAllData();
    refreshAllState();
  };

  const handleLogout = () => {
    storageService.setUser(null);
    setUser(null);
    setCurrentView('landing');
  };

  const handleSelectPlan = (plan: UserPlan) => {
    if (user) {
      const updatedUser = { ...user, plan };
      storageService.setUser(updatedUser);
      setUser(updatedUser);
    }
  };

  const handleMarkNotificationRead = (id: string) => {
    const updated = storageService.markNotificationAsRead(id);
    setNotifications(updated);
  };

  const handleMarkAllNotificationsRead = () => {
    const updated = storageService.markAllNotificationsAsRead();
    setNotifications(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors">
      
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(v) => {
          if (v === 'pricing') {
            setIsPricingModalOpen(true);
          } else {
            setCurrentView(v);
          }
        }}
        lang={lang}
        onLanguageChange={handleLanguageChange}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        isDemo={isDemo}
        onExitDemo={handleExitDemo}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-20 lg:pb-12">
        {currentView === 'landing' ? (
          <LandingPage
            onStartFree={() => setIsAuthModalOpen(true)}
            onViewDemo={() => {
              storageService.setDemoMode(true);
              setIsDemo(true);
              refreshAllState();
              setCurrentView('dashboard');
            }}
            lang={lang}
          />
        ) : (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
            {currentView === 'dashboard' && (
              <DashboardView
                transactions={transactions}
                categories={categories}
                debts={debts}
                business={business}
                currency={business.currency}
                lang={lang}
                onOpenAiModal={() => setIsAiModalOpen(true)}
                onNavigate={setCurrentView}
              />
            )}

            {currentView === 'transactions' && (
              <TransactionsView
                transactions={transactions}
                categories={categories}
                currency={business.currency}
                lang={lang}
                onOpenAiModal={() => setIsAiModalOpen(true)}
                onUpdateTransaction={handleUpdateTransaction}
                onDeleteTransaction={handleDeleteTransaction}
              />
            )}

            {currentView === 'debts' && (
              <DebtsView
                debts={debts}
                business={business}
                currency={business.currency}
                lang={lang}
                onAddDebt={handleAddDebt}
                onToggleDebtPaid={handleToggleDebtPaid}
                onDeleteDebt={handleDeleteDebt}
              />
            )}

            {currentView === 'analytics' && (
              <AnalyticsView
                transactions={transactions}
                categories={categories}
                debts={debts}
                business={business}
                currency={business.currency}
                lang={lang}
              />
            )}

            {currentView === 'assistant' && (
              <AiAssistantView
                transactions={transactions}
                categories={categories}
                debts={debts}
                business={business}
                currency={business.currency}
                lang={lang}
              />
            )}

            {currentView === 'reports' && (
              <ReportsView
                transactions={transactions}
                categories={categories}
                business={business}
                currency={business.currency}
                lang={lang}
              />
            )}

            {currentView === 'settings' && (
              <SettingsView
                business={business}
                onUpdateBusiness={handleUpdateBusiness}
                categories={categories}
                onAddCategory={handleAddCategory}
                currency={business.currency}
                lang={lang}
                onLanguageChange={handleLanguageChange}
                onResetDemo={handleResetDemo}
                onClearAll={handleClearAll}
              />
            )}
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation (Shown on smartphones) */}
      <MobileNav
        currentView={currentView}
        onNavigate={(v) => {
          if (v === 'pricing') {
            setIsPricingModalOpen(true);
          } else {
            setCurrentView(v);
          }
        }}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        lang={lang}
      />

      {/* AI Transaction Entry Modal */}
      <AiTransactionModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onSave={handleSaveTransaction}
        categories={categories}
        businessId={business.id}
        lang={lang}
      />

      {/* Auth & Onboarding Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onCompleteAuth={handleCompleteAuth}
        lang={lang}
      />

      {/* Pricing Modal */}
      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        currentPlan={user ? user.plan : 'pro'}
        onSelectPlan={handleSelectPlan}
        lang={lang}
      />

    </div>
  );
}
