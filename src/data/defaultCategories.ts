import { Category } from '../types';

export const defaultCategories: Category[] = [
  // Expense categories
  { id: 'cat-mahsulot', name: 'Mahsulot', type: 'expense', color: '#3b82f6', icon: 'Package', isDefault: true, budgetLimit: 15000000 },
  { id: 'cat-reklama', name: 'Reklama', type: 'expense', color: '#ec4899', icon: 'Megaphone', isDefault: true, budgetLimit: 3000000 },
  { id: 'cat-transport', name: 'Transport', type: 'expense', color: '#f59e0b', icon: 'Truck', isDefault: true, budgetLimit: 2000000 },
  { id: 'cat-ijara', name: 'Ijara', type: 'expense', color: '#8b5cf6', icon: 'Building2', isDefault: true, budgetLimit: 4000000 },
  { id: 'cat-ish-haqi', name: 'Ish haqi', type: 'expense', color: '#10b981', icon: 'Users', isDefault: true, budgetLimit: 8000000 },
  { id: 'cat-kommunal', name: 'Kommunal', type: 'expense', color: '#06b6d4', icon: 'Zap', isDefault: true, budgetLimit: 1000000 },
  { id: 'cat-internet', name: 'Internet', type: 'expense', color: '#6366f1', icon: 'Wifi', isDefault: true, budgetLimit: 300000 },
  { id: 'cat-soliq', name: 'Soliq', type: 'expense', color: '#ef4444', icon: 'ReceiptText', isDefault: true, budgetLimit: 1500000 },
  { id: 'cat-bank', name: 'Bank komissiyasi', type: 'expense', color: '#64748b', icon: 'CreditCard', isDefault: true, budgetLimit: 500000 },
  { id: 'cat-oziq-ovqat', name: 'Oziq-ovqat', type: 'expense', color: '#14b8a6', icon: 'Utensils', isDefault: true, budgetLimit: 1200000 },
  { id: 'cat-boshqa-exp', name: 'Boshqa', type: 'expense', color: '#94a3b8', icon: 'MoreHorizontal', isDefault: true },

  // Income categories
  { id: 'cat-savdo', name: 'Mahsulot sotuvi', type: 'income', color: '#10b981', icon: 'ShoppingBag', isDefault: true },
  { id: 'cat-xizmat', name: 'Xizmat ko‘rsatish', type: 'income', color: '#0ea5e9', icon: 'Briefcase', isDefault: true },
  { id: 'cat-boshqa-inc', name: 'Boshqa daromad', type: 'income', color: '#8b5cf6', icon: 'Coins', isDefault: true },
];
