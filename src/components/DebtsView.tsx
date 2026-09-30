import React, { useState } from 'react';
import { 
  Plus, 
  AlertCircle, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Send, 
  MessageSquare, 
  X, 
  ArrowUpRight, 
  ArrowDownRight,
  Copy,
  Check
} from 'lucide-react';
import { Debt, Currency, Language, Business } from '../types';
import { translations } from '../i18n/translations';

interface DebtsViewProps {
  debts: Debt[];
  business: Business;
  currency: Currency;
  lang: Language;
  onAddDebt: (debt: Omit<Debt, 'id' | 'createdAt' | 'isPaid'>) => void;
  onToggleDebtPaid: (id: string) => void;
  onDeleteDebt: (id: string) => void;
}

export const DebtsView: React.FC<DebtsViewProps> = ({
  debts,
  business,
  currency,
  lang,
  onAddDebt,
  onToggleDebtPaid,
  onDeleteDebt,
}) => {
  const t = translations[lang];

  const [filterType, setFilterType] = useState<'all' | 'receivable' | 'payable' | 'overdue'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [reminderModalDebt, setReminderModalDebt] = useState<Debt | null>(null);
  const [copiedReminder, setCopiedReminder] = useState(false);

  // Form State
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [amount, setAmount] = useState<number>(0);
  const [debtType, setDebtType] = useState<'receivable' | 'payable'>('receivable');
  const [dueDate, setDueDate] = useState<string>(
    new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  // Calculations
  const activeDebts = debts.filter(d => !d.isPaid);

  const totalReceivable = activeDebts
    .filter(d => d.type === 'receivable')
    .reduce((sum, d) => sum + d.amount, 0);

  const totalPayable = activeDebts
    .filter(d => d.type === 'payable')
    .reduce((sum, d) => sum + d.amount, 0);

  const overdueDebts = activeDebts.filter(d => d.dueDate < todayStr);
  const totalOverdue = overdueDebts.reduce((sum, d) => sum + d.amount, 0);

  const upcomingDebts = activeDebts.filter(d => d.dueDate >= todayStr);

  // Filtered List
  const filteredDebts = debts.filter(d => {
    if (filterType === 'receivable') return d.type === 'receivable';
    if (filterType === 'payable') return d.type === 'payable';
    if (filterType === 'overdue') return !d.isPaid && d.dueDate < todayStr;
    return true;
  });

  const handleCreateDebt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || amount <= 0) return;

    onAddDebt({
      businessId: business.id,
      contactName: contactName.trim(),
      phone: phone.trim(),
      amount,
      type: debtType,
      dueDate,
      notes: notes.trim(),
    });

    // Reset
    setContactName('');
    setPhone('+998 ');
    setAmount(0);
    setNotes('');
    setIsAddModalOpen(false);
  };

  const generateReminderText = (debt: Debt) => {
    return `Assalomu alaykum, hurmatli ${debt.contactName}!\n\n"${business.name}" dan eslatma: Sizning ${debt.amount.toLocaleString('uz-UZ')} ${currency} miqdoridagi to‘lovingiz muddati: ${debt.dueDate}.\nIltimos, hisob-kitobni amalga oshirishingizni so‘raymiz.\n\nSavollar bo‘lsa bog‘laning. Rahmat!`;
  };

  const handleCopyReminder = (debt: Debt) => {
    const text = generateReminderText(debt);
    navigator.clipboard.writeText(text);
    setCopiedReminder(true);
    setTimeout(() => setCopiedReminder(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.debtsPageTitle}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Mijozlar nasiyasi va yetkazib beruvchilarga to‘lovlar nazorati
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-500 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>{t.addDebt}</span>
        </button>
      </div>

      {/* 4 OVERVIEW KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Receivable (Menga qarz) */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{t.totalReceivable}</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="mt-2 text-lg font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
            {totalReceivable.toLocaleString('uz-UZ')}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">{currency} (Kutilmoqda)</div>
        </div>

        {/* Total Payable (Men qarzdorman) */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{t.totalPayable}</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
              <ArrowDownRight className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="mt-2 text-lg font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400">
            {totalPayable.toLocaleString('uz-UZ')}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">{currency} (To‘lanishi kerak)</div>
        </div>

        {/* Overdue Debts */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{t.overdueDebts}</span>
            <AlertCircle className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-2 text-lg font-bold font-mono tabular-nums text-rose-500">
            {totalOverdue.toLocaleString('uz-UZ')}
          </div>
          <div className="text-[10px] text-rose-400 mt-0.5 font-medium">
            {overdueDebts.length} ta kechikkan qarz
          </div>
        </div>

        {/* Upcoming payments */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{t.upcomingPayments}</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {upcomingDebts.length} ta
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Yaqin 14 kun ichida</div>
        </div>

      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl dark:bg-slate-800 w-fit text-xs">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-xl font-medium cursor-pointer transition-colors ${
            filterType === 'all' ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          {t.filterAll} ({debts.length})
        </button>
        <button
          onClick={() => setFilterType('receivable')}
          className={`px-3 py-1.5 rounded-xl font-medium cursor-pointer transition-colors ${
            filterType === 'receivable' ? 'bg-white text-emerald-600 shadow-sm dark:bg-slate-900 dark:text-emerald-400 font-semibold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Menga qarz ({debts.filter(d => d.type === 'receivable' && !d.isPaid).length})
        </button>
        <button
          onClick={() => setFilterType('payable')}
          className={`px-3 py-1.5 rounded-xl font-medium cursor-pointer transition-colors ${
            filterType === 'payable' ? 'bg-white text-rose-600 shadow-sm dark:bg-slate-900 dark:text-rose-400 font-semibold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Men qarzdorman ({debts.filter(d => d.type === 'payable' && !d.isPaid).length})
        </button>
        <button
          onClick={() => setFilterType('overdue')}
          className={`px-3 py-1.5 rounded-xl font-medium cursor-pointer transition-colors ${
            filterType === 'overdue' ? 'bg-white text-amber-600 shadow-sm dark:bg-slate-900 dark:text-amber-400 font-semibold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Muddati o‘tgan ({overdueDebts.length})
        </button>
      </div>

      {/* DEBTS LIST */}
      <div className="rounded-3xl border border-slate-200/90 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-900">
        {filteredDebts.length === 0 ? (
          <div className="py-16 text-center">
            <CheckCircle2 className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Qarzdorlik yozuvlari mavjud emas
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Barcha hisob-kitoblar toza yoki filtrga mos yozuv yo‘q.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredDebts.map((d) => {
              const isOverdue = !d.isPaid && d.dueDate < todayStr;

              return (
                <div 
                  key={d.id} 
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                    d.isPaid ? 'opacity-60 bg-slate-50/50 dark:bg-slate-950/20' : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/30'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        d.type === 'receivable' 
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' 
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                      }`}>
                        {d.type === 'receivable' ? 'Menga qarz' : 'Men qarzdorman'}
                      </span>

                      {d.isPaid ? (
                        <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <Check className="h-3.5 w-3.5" /> To‘langan
                        </span>
                      ) : isOverdue ? (
                        <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                          <AlertCircle className="h-3.5 w-3.5" /> Muddati o‘tgan ({d.dueDate})
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          Muddati: {d.dueDate}
                        </span>
                      )}
                    </div>

                    <div className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{d.contactName}</span>
                      {d.phone && (
                        <a 
                          href={`tel:${d.phone}`} 
                          className="text-xs text-slate-500 hover:text-emerald-600 dark:text-slate-400 flex items-center gap-1"
                        >
                          <Phone className="h-3 w-3" />
                          <span>{d.phone}</span>
                        </a>
                      )}
                    </div>

                    {d.notes && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {d.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <div className={`text-base sm:text-lg font-bold font-mono tabular-nums ${
                        d.type === 'receivable' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        {d.type === 'receivable' ? '+' : '-'}{d.amount.toLocaleString('uz-UZ')} {currency}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Mark Paid Button */}
                      <button
                        onClick={() => onToggleDebtPaid(d.id)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors ${
                          d.isPaid 
                            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300' 
                            : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm'
                        }`}
                      >
                        {d.isPaid ? 'Bekor qilish' : t.markAsPaid}
                      </button>

                      {/* Reminder generator (receivable only) */}
                      {d.type === 'receivable' && !d.isPaid && (
                        <button
                          onClick={() => setReminderModalDebt(d)}
                          className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
                          title="Eslatma xabarini ko‘rish"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </button>
                      )}

                      <button
                        onClick={() => onDeleteDebt(d.id)}
                        className="rounded-xl p-2 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="O‘chirish"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ADD DEBT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t.addDebt}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDebt} className="mt-4 space-y-4 text-xs">
              
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDebtType('receivable')}
                  className={`py-2 rounded-xl font-semibold cursor-pointer ${
                    debtType === 'receivable' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {t.theyOweMe}
                </button>
                <button
                  type="button"
                  onClick={() => setDebtType('payable')}
                  className={`py-2 rounded-xl font-semibold cursor-pointer ${
                    debtType === 'payable' ? 'bg-rose-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {t.iOweThem}
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {t.customerName}
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Masalan: Jamshid (Yetkazib beruvchi)"
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {t.amount} ({currency})
                  </label>
                  <input
                    type="number"
                    value={amount || ''}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="1,500,000"
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-mono tabular-nums text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {t.phone}
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {t.dueDate}
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {t.notes}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Realizatsiyaga berilgan tovarlar yoki buyurtma tafsiloti..."
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {t.btnCancel}
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-500 shadow-sm cursor-pointer"
                >
                  Saqlash
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* REMINDER TEXT MODAL */}
      {reminderModalDebt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Send className="h-4 w-4 text-emerald-600" />
                <span>Qarzdorlik eslatmasi</span>
              </h3>
              <button
                onClick={() => setReminderModalDebt(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Telegram yoki SMS orqali mijozga yuborish uchun tayyor matn:
              </p>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
                {generateReminderText(reminderModalDebt)}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-400">
                  {copiedReminder ? 'Nusxa olindi!' : 'Bir tugma bilan nusxalang'}
                </span>

                <button
                  onClick={() => handleCopyReminder(reminderModalDebt)}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 shadow-sm cursor-pointer"
                >
                  {copiedReminder ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span>{copiedReminder ? 'Nusxalandi' : 'Nusxa olish'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
