import { 
  User, 
  Business, 
  Transaction, 
  Category, 
  Debt, 
  AppNotification 
} from '../types';
import { demoUser, demoBusiness, demoTransactions, demoDebts, demoNotifications } from '../data/demoData';
import { defaultCategories } from '../data/defaultCategories';

const STORAGE_KEYS = {
  USER: 'hisobchi_current_user',
  BUSINESS: 'hisobchi_current_business',
  TRANSACTIONS: 'hisobchi_transactions',
  CATEGORIES: 'hisobchi_categories',
  DEBTS: 'hisobchi_debts',
  NOTIFICATIONS: 'hisobchi_notifications',
  IS_DEMO: 'hisobchi_is_demo_mode',
  LANGUAGE: 'hisobchi_language',
  THEME: 'hisobchi_theme',
};

export const storageService = {
  // Initialization
  initStorage: () => {
    if (!localStorage.getItem(STORAGE_KEYS.IS_DEMO)) {
      // Default to demo mode on fresh visit so visitors immediately see the populated dashboard
      localStorage.setItem(STORAGE_KEYS.IS_DEMO, 'true');
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(demoUser));
      localStorage.setItem(STORAGE_KEYS.BUSINESS, JSON.stringify(demoBusiness));
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(demoTransactions));
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(defaultCategories));
      localStorage.setItem(STORAGE_KEYS.DEBTS, JSON.stringify(demoDebts));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(demoNotifications));
    }
  },

  // Demo status
  isDemoMode: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.IS_DEMO) === 'true';
  },

  setDemoMode: (isDemo: boolean) => {
    localStorage.setItem(STORAGE_KEYS.IS_DEMO, isDemo ? 'true' : 'false');
  },

  resetToDemo: () => {
    localStorage.setItem(STORAGE_KEYS.IS_DEMO, 'true');
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(demoUser));
    localStorage.setItem(STORAGE_KEYS.BUSINESS, JSON.stringify(demoBusiness));
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(demoTransactions));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(defaultCategories));
    localStorage.setItem(STORAGE_KEYS.DEBTS, JSON.stringify(demoDebts));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(demoNotifications));
  },

  // User
  getUser: (): User | null => {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) return demoUser;
    try {
      return JSON.parse(raw);
    } catch {
      return demoUser;
    }
  },

  setUser: (user: User | null) => {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.USER);
    } else {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }
  },

  // Business
  getBusiness: (): Business => {
    const raw = localStorage.getItem(STORAGE_KEYS.BUSINESS);
    if (!raw) return demoBusiness;
    try {
      return JSON.parse(raw);
    } catch {
      return demoBusiness;
    }
  },

  updateBusiness: (business: Business) => {
    localStorage.setItem(STORAGE_KEYS.BUSINESS, JSON.stringify(business));
  },

  // Transactions
  getTransactions: (): Transaction[] => {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!raw) return demoTransactions;
    try {
      return JSON.parse(raw);
    } catch {
      return demoTransactions;
    }
  },

  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>): Transaction => {
    const list = storageService.getTransactions();
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    list.unshift(newTx);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(list));
    return newTx;
  },

  updateTransaction: (updated: Transaction): Transaction[] => {
    const list = storageService.getTransactions().map(tx => tx.id === updated.id ? updated : tx);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(list));
    return list;
  },

  deleteTransaction: (id: string): Transaction[] => {
    const list = storageService.getTransactions().filter(tx => tx.id !== id);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(list));
    return list;
  },

  // Categories
  getCategories: (): Category[] => {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!raw) return defaultCategories;
    try {
      return JSON.parse(raw);
    } catch {
      return defaultCategories;
    }
  },

  addCategory: (category: Omit<Category, 'id'>): Category => {
    const list = storageService.getCategories();
    const newCat: Category = {
      ...category,
      id: `cat-${Date.now()}`,
    };
    list.push(newCat);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(list));
    return newCat;
  },

  // Debts
  getDebts: (): Debt[] => {
    const raw = localStorage.getItem(STORAGE_KEYS.DEBTS);
    if (!raw) return demoDebts;
    try {
      return JSON.parse(raw);
    } catch {
      return demoDebts;
    }
  },

  addDebt: (debt: Omit<Debt, 'id' | 'createdAt' | 'isPaid'>): Debt => {
    const list = storageService.getDebts();
    const newDebt: Debt = {
      ...debt,
      id: `dbt-${Date.now()}`,
      isPaid: false,
      createdAt: new Date().toISOString(),
    };
    list.unshift(newDebt);
    localStorage.setItem(STORAGE_KEYS.DEBTS, JSON.stringify(list));
    return newDebt;
  },

  toggleDebtPaid: (id: string): Debt[] => {
    const list = storageService.getDebts().map(d => {
      if (d.id === id) {
        const nextPaid = !d.isPaid;
        return {
          ...d,
          isPaid: nextPaid,
          paidAt: nextPaid ? new Date().toISOString() : undefined,
        };
      }
      return d;
    });
    localStorage.setItem(STORAGE_KEYS.DEBTS, JSON.stringify(list));
    return list;
  },

  deleteDebt: (id: string): Debt[] => {
    const list = storageService.getDebts().filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEYS.DEBTS, JSON.stringify(list));
    return list;
  },

  // Notifications
  getNotifications: (): AppNotification[] => {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) return demoNotifications;
    try {
      return JSON.parse(raw);
    } catch {
      return demoNotifications;
    }
  },

  markNotificationAsRead: (id: string): AppNotification[] => {
    const list = storageService.getNotifications().map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
    return list;
  },

  markAllNotificationsAsRead: (): AppNotification[] => {
    const list = storageService.getNotifications().map(n => ({ ...n, read: true }));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
    return list;
  },

  clearAllData: () => {
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.DEBTS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.DEBTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
  }
};
