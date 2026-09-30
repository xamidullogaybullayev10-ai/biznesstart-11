import React, { useState } from 'react';
import { 
  Building2, 
  Globe, 
  Coins, 
  Bell, 
  Sliders, 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw, 
  AlertTriangle 
} from 'lucide-react';
import { 
  Business, 
  BusinessType, 
  Currency, 
  Language, 
  Category 
} from '../types';
import { translations } from '../i18n/translations';

interface SettingsViewProps {
  business: Business;
  onUpdateBusiness: (b: Business) => void;
  categories: Category[];
  onAddCategory: (c: Omit<Category, 'id'>) => void;
  currency: Currency;
  lang: Language;
  onLanguageChange: (l: Language) => void;
  onResetDemo: () => void;
  onClearAll: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  business,
  onUpdateBusiness,
  categories,
  onAddCategory,
  currency,
  lang,
  onLanguageChange,
  onResetDemo,
  onClearAll,
}) => {
  const t = translations[lang];

  const [bizName, setBizName] = useState(business.name);
  const [bizType, setBizType] = useState<BusinessType>(business.type);
  const [bizCurrency, setBizCurrency] = useState<Currency>(business.currency);
  const [budgetLimit, setBudgetLimit] = useState<number>(business.monthlyExpenseBudget);
  const [notificationsOn, setNotificationsOn] = useState(business.notificationsEnabled);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New Category State
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState<'income' | 'expense'>('expense');
  const [newCatColor, setNewCatColor] = useState('#3b82f6');
  const [newCatBudget, setNewCatBudget] = useState<number>(2000000);
  const [isAddCatOpen, setIsAddCatOpen] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBusiness({
      ...business,
      name: bizName,
      type: bizType,
      currency: bizCurrency,
      monthlyExpenseBudget: budgetLimit,
      notificationsEnabled: notificationsOn,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    onAddCategory({
      name: newCatName.trim(),
      type: newCatType,
      color: newCatColor,
      icon: 'Tag',
      budgetLimit: newCatBudget,
    });

    setNewCatName('');
    setIsAddCatOpen(false);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-150">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t.settingsTitle}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Kompaniya parametrlari, toifalar va bildirishnomalarni sozlash
        </p>
      </div>

      {/* 1. BUSINESS PROFILE FORM */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 mb-6 flex items-center gap-2">
          <Building2 className="h-4 w-4 text-emerald-600" />
          <span>Biznes parametrlari</span>
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                {t.businessName}
              </label>
              <input
                type="text"
                value={bizName}
                onChange={(e) => setBizName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                {t.businessType}
              </label>
              <select
                value={bizType}
                onChange={(e) => setBizType(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="retail">Chakana savdo / Do‘kon</option>
                <option value="services">Xizmat ko‘rsatish / Frilans</option>
                <option value="ecommerce">Onlayn savdo / Instagram do‘kon</option>
                <option value="catering">Umumiy ovqatlanish / Kafe</option>
                <option value="production">Ishlab chiqarish / Sex</option>
                <option value="other">Boshqa faoliyat</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                {t.currency}
              </label>
              <select
                value={bizCurrency}
                onChange={(e) => setBizCurrency(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
              >
                <option value="UZS">UZS (O‘zbekiston so‘mi)</option>
                <option value="USD">USD ($ AQSH dollari)</option>
                <option value="EUR">EUR (€ Yevro)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                {t.language}
              </label>
              <select
                value={lang}
                onChange={(e) => onLanguageChange(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="uz">O‘zbekcha</option>
                <option value="ru">Русский</option>
                <option value="en">English</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                {t.monthlyBudget} ({currency})
              </label>
              <input
                type="number"
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-mono tabular-nums text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Notifications Toggle */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">Xabarnomalar</div>
              <p className="text-[11px] text-slate-400">Kunlik xarajatlar va qarzdorlik muddatlari haqida eslatmalar</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={notificationsOn} 
                onChange={(e) => setNotificationsOn(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-emerald-600 text-xs font-semibold">
              {saveSuccess ? 'Muvaffaqiyatli saqlandi!' : ''}
            </span>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500 shadow-sm shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>{t.saveSettings}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. CATEGORIES MANAGER */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="h-4 w-4 text-emerald-600" />
              <span>{t.categoriesManager}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Xarajat va daromad toifalarini boshqarish</p>
          </div>

          <button
            onClick={() => setIsAddCatOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{t.addCategory}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {categories.map((c) => (
            <div 
              key={c.id} 
              className="p-3 rounded-2xl border border-slate-100 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-950/40 text-xs space-y-1"
            >
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="font-bold text-slate-900 dark:text-white truncate">{c.name}</span>
              </div>
              <div className="text-[10px] text-slate-400">
                {c.type === 'income' ? 'Daromad toifasi' : 'Xarajat toifasi'}
              </div>
              {c.budgetLimit && (
                <div className="text-[10px] font-mono text-slate-500">
                  Budjet: {(c.budgetLimit / 1000000).toFixed(1)}M {currency}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Modal for adding custom category */}
        {isAddCatOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                {t.addCategory}
              </h3>

              <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    {t.categoryName}
                  </label>
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Masalan: Logistika yoki Xom-ashyo"
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewCatType('expense')}
                    className={`py-2 rounded-xl font-semibold cursor-pointer ${
                      newCatType === 'expense' ? 'bg-rose-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Xarajat
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCatType('income')}
                    className={`py-2 rounded-xl font-semibold cursor-pointer ${
                      newCatType === 'income' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Daromad
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Rang</label>
                    <input
                      type="color"
                      value={newCatColor}
                      onChange={(e) => setNewCatColor(e.target.value)}
                      className="w-full h-9 rounded-xl border border-slate-200 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Oylik limit ({currency})</label>
                    <input
                      type="number"
                      value={newCatBudget}
                      onChange={(e) => setNewCatBudget(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-mono dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddCatOpen(false)}
                    className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    {t.btnCancel}
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-500 shadow-sm cursor-pointer"
                  >
                    Qo‘shish
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>

      {/* 3. DANGER ZONE (Reset / Wipe Data) */}
      <div className="rounded-3xl border border-rose-200 bg-rose-50/40 p-6 dark:border-rose-950 dark:bg-rose-950/20">
        <h3 className="text-sm font-bold text-rose-800 dark:text-rose-400 mb-1 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span>{t.dangerZone}</span>
        </h3>
        <p className="text-xs text-rose-600/80 dark:text-rose-400/70 mb-4">
          Demo ma’lumotlarini qayta tiklash yoki barcha kiritilgan yozuvlarni tozalash.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              if (window.confirm('Demo ma’lumotlarini qayta yuklamoqchimisiz?')) {
                onResetDemo();
              }
            }}
            className="flex items-center gap-2 rounded-xl bg-white border border-rose-300 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 dark:bg-slate-900 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{t.resetDemoData}</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Haqiqatdan ham barcha tranzaksiya va qarzlarni butunlay o‘chirmoqchimisiz?')) {
                onClearAll();
              }
            }}
            className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 shadow-sm cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>{t.clearAllData}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
