export type Language = 'uz' | 'ru' | 'en';
export type Theme = 'light' | 'dark';

export type UserPlan = 'free' | 'pro' | 'business';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: UserPlan;
  createdAt: string;
}

export type BusinessType = 
  | 'retail'        // Chakana savdo / Do'kon
  | 'services'      // Xizmat ko'rsatish / Frilans
  | 'ecommerce'     // Onlayn savdo / Instagram do'kon
  | 'catering'      // Umumiy ovqatlanish / Kafe
  | 'production'    // Ishlab chiqarish
  | 'other';        // Boshqa

export type Currency = 'UZS' | 'USD' | 'EUR';

export interface Business {
  id: string;
  userId: string;
  name: string;
  type: BusinessType;
  currency: Currency;
  monthlyRevenueTarget: number;
  monthlyExpenseBudget: number;
  notificationsEnabled: boolean;
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  businessId: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  categoryName: string;
  description: string;
  date: string; // ISO YYYY-MM-DD
  rawText?: string;
  source: 'ai' | 'manual';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
  budgetLimit?: number;
  isDefault?: boolean;
}

export type DebtType = 'receivable' | 'payable'; // 'receivable' = Menga qarz (They owe me), 'payable' = Men qarzdorman (I owe)

export interface Debt {
  id: string;
  businessId: string;
  contactName: string;
  phone: string;
  amount: number;
  type: DebtType;
  dueDate: string; // YYYY-MM-DD
  notes?: string;
  isPaid: boolean;
  paidAt?: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'warning' | 'success';
}

export interface FinancialInsight {
  id: string;
  title: string;
  description: string;
  type: 'warning' | 'opportunity' | 'positive' | 'trend';
  date: string;
}

export interface AiParsedTransaction {
  type: TransactionType;
  amount: number;
  category: string;
  date: string;
  description: string;
  confidence: number;
  explanationUz?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  calculationBreakdown?: {
    income?: number;
    expense?: number;
    profit?: number;
    details?: string[];
  };
}
