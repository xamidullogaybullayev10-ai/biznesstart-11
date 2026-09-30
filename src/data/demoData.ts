import { Business, Debt, AppNotification, Transaction, User } from '../types';

export const demoUser: User = {
  id: 'usr-demo-01',
  name: 'Sardor Rahimiy',
  email: 'sardor@hisobchi.uz',
  avatar: '/src/assets/images/avatar_founder_1790762641924.jpg',
  plan: 'pro',
  createdAt: '2026-08-01',
};

export const demoBusiness: Business = {
  id: 'biz-demo-01',
  userId: 'usr-demo-01',
  name: 'Sardor Eco Trend (Toshkent)',
  type: 'retail',
  currency: 'UZS',
  monthlyRevenueTarget: 25000000,
  monthlyExpenseBudget: 15000000,
  notificationsEnabled: true,
};

// Generates dates relative to today
const getRelativeDate = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const demoTransactions: Transaction[] = [
  // Today
  {
    id: 'tx-001',
    businessId: 'biz-demo-01',
    type: 'income',
    amount: 1500000,
    categoryId: 'cat-savdo',
    categoryName: 'Mahsulot sotuvi',
    description: 'Chilonzor savdo markazidagi do‘kon tushumi',
    date: getRelativeDate(0),
    source: 'ai',
    rawText: 'Bugun 1 million 500 ming so‘mlik mahsulot sotdim',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-002',
    businessId: 'biz-demo-01',
    type: 'expense',
    amount: 250000,
    categoryId: 'cat-reklama',
    categoryName: 'Reklama',
    description: 'Instagram target reklama xarajati',
    date: getRelativeDate(0),
    source: 'ai',
    rawText: 'Bugun 250 ming so‘mga reklama berdim',
    createdAt: new Date().toISOString(),
  },

  // Yesterday
  {
    id: 'tx-003',
    businessId: 'biz-demo-01',
    type: 'income',
    amount: 2850000,
    categoryId: 'cat-savdo',
    categoryName: 'Mahsulot sotuvi',
    description: 'Telegram bot orqali onlayn buyurtmalar to‘lovi',
    date: getRelativeDate(1),
    source: 'manual',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'tx-004',
    businessId: 'biz-demo-01',
    type: 'expense',
    amount: 450000,
    categoryId: 'cat-transport',
    categoryName: 'Transport',
    description: 'Yandex Delivery kuryerlik to‘lovlari (15 ta manzil)',
    date: getRelativeDate(1),
    source: 'ai',
    rawText: 'Kecha yetkazib berishga 450 ming so‘m to‘ladim',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },

  // 3 days ago
  {
    id: 'tx-005',
    businessId: 'biz-demo-01',
    type: 'expense',
    amount: 2800000,
    categoryId: 'cat-mahsulot',
    categoryName: 'Mahsulot',
    description: 'Optom ombordan yangi tovar xaridi',
    date: getRelativeDate(3),
    source: 'manual',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: 'tx-006',
    businessId: 'biz-demo-01',
    type: 'income',
    amount: 3200000,
    categoryId: 'cat-savdo',
    categoryName: 'Mahsulot sotuvi',
    description: 'Katta korporativ buyurtma uchun to‘lov',
    date: getRelativeDate(3),
    source: 'manual',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },

  // 5 days ago
  {
    id: 'tx-007',
    businessId: 'biz-demo-01',
    type: 'expense',
    amount: 3500000,
    categoryId: 'cat-ijara',
    categoryName: 'Ijara',
    description: 'Do‘kon joyi uchun oylik ijara to‘lovi',
    date: getRelativeDate(5),
    source: 'ai',
    rawText: 'Do‘kon ijarasiga 3.5 mln berdim',
    createdAt: new Date(Date.now() - 432000000).toISOString(),
  },
  {
    id: 'tx-008',
    businessId: 'biz-demo-01',
    type: 'income',
    amount: 1900000,
    categoryId: 'cat-xizmat',
    categoryName: 'Xizmat ko‘rsatish',
    description: 'Mijozga individual buyurtma tikish va qadoqlash xizmati',
    date: getRelativeDate(5),
    source: 'manual',
    createdAt: new Date(Date.now() - 432000000).toISOString(),
  },

  // 8 days ago
  {
    id: 'tx-009',
    businessId: 'biz-demo-01',
    type: 'expense',
    amount: 800000,
    categoryId: 'cat-ish-haqi',
    categoryName: 'Ish haqi',
    description: 'Sotuvchi yordamchisiga haftalik avans',
    date: getRelativeDate(8),
    source: 'ai',
    rawText: 'Yordamchi Akmalga 800 ming so‘m ish haqi to‘ladim',
    createdAt: new Date(Date.now() - 691200000).toISOString(),
  },
  {
    id: 'tx-010',
    businessId: 'biz-demo-01',
    type: 'income',
    amount: 1800000,
    categoryId: 'cat-savdo',
    categoryName: 'Mahsulot sotuvi',
    description: 'Ulgurji xaridorga kiyim-kechak partiyasi sotuvi',
    date: getRelativeDate(8),
    source: 'manual',
    createdAt: new Date(Date.now() - 691200000).toISOString(),
  },

  // 12 days ago
  {
    id: 'tx-011',
    businessId: 'biz-demo-01',
    type: 'expense',
    amount: 380000,
    categoryId: 'cat-kommunal',
    categoryName: 'Kommunal',
    description: 'Elektr energiyasi va suv to‘lovi',
    date: getRelativeDate(12),
    source: 'manual',
    createdAt: new Date(Date.now() - 1036800000).toISOString(),
  },
  {
    id: 'tx-012',
    businessId: 'biz-demo-01',
    type: 'income',
    amount: 1200000,
    categoryId: 'cat-savdo',
    categoryName: 'Mahsulot sotuvi',
    description: 'Chakana xaridorlar tushumi',
    date: getRelativeDate(12),
    source: 'manual',
    createdAt: new Date(Date.now() - 1036800000).toISOString(),
  },
];

export const demoDebts: Debt[] = [
  {
    id: 'dbt-001',
    businessId: 'biz-demo-01',
    contactName: 'Jamshid (Mato yetkazuvchi)',
    phone: '+998 90 123 45 67',
    amount: 2400000,
    type: 'payable', // I owe him
    dueDate: getRelativeDate(-5), // in 5 days
    notes: 'Qishki kolleksiya uchun mato qoldig‘i to‘lovi',
    isPaid: false,
    createdAt: getRelativeDate(10),
  },
  {
    id: 'dbt-002',
    businessId: 'biz-demo-01',
    contactName: 'Nodira opa (Chilonzor boutique)',
    phone: '+998 93 987 65 43',
    amount: 1850000,
    type: 'receivable', // She owes me
    dueDate: getRelativeDate(-2), // in 2 days
    notes: 'Realizatsiyaga berilgan 12 dona eko-sumka va liboslar',
    isPaid: false,
    createdAt: getRelativeDate(14),
  },
  {
    id: 'dbt-003',
    businessId: 'biz-demo-01',
    contactName: 'Bobur Mirzo (Samarqand filial)',
    phone: '+998 97 555 44 33',
    amount: 950000,
    type: 'receivable', // He owes me
    dueDate: getRelativeDate(3), // 3 days overdue!
    notes: 'Yetkazib berilgan tovar uchun ikkinchi qism to‘lov',
    isPaid: false,
    createdAt: getRelativeDate(20),
  },
  {
    id: 'dbt-004',
    businessId: 'biz-demo-01',
    contactName: 'Akmal Print (Qadoqlash)',
    phone: '+998 99 333 22 11',
    amount: 600000,
    type: 'payable',
    dueDate: getRelativeDate(-12),
    notes: '500 dona firma qutilari tayyorlash to‘lovi',
    isPaid: true,
    paidAt: getRelativeDate(2),
    createdAt: getRelativeDate(18),
  }
];

export const demoNotifications: AppNotification[] = [
  {
    id: 'notif-001',
    title: 'Bugungi xarajatlar',
    message: 'Bugungi xarajatlaringiz 250,000 so‘m bo‘ldi (Reklama).',
    date: getRelativeDate(0),
    read: false,
    type: 'info',
  },
  {
    id: 'notif-002',
    title: 'Qarzdorlik muddati yaqinlashmoqda',
    message: 'Nodira opa (1,850,000 so‘m) to‘lov muddati 2 kundan keyin tugaydi.',
    date: getRelativeDate(0),
    read: false,
    type: 'warning',
  },
  {
    id: 'notif-003',
    title: 'Haftalik hisobot tayyor',
    message: 'O‘tgan haftadagi sof foydangiz 4,150,000 so‘mni tashkil qildi (+14% o‘sish).',
    date: getRelativeDate(2),
    read: true,
    type: 'success',
  },
];
