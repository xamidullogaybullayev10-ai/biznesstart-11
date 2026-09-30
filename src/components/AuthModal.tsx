import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  Building2, 
  Check, 
  Lock, 
  Mail, 
  User as UserIcon,
  Coins
} from 'lucide-react';
import { 
  Language, 
  User, 
  Business, 
  BusinessType, 
  Currency 
} from '../types';
import { translations } from '../i18n/translations';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteAuth: (user: User, business: Business) => void;
  lang: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onCompleteAuth,
  lang,
}) => {
  const t = translations[lang];

  const [mode, setMode] = useState<'login' | 'register' | 'onboarding'>('register');
  const [step, setStep] = useState<number>(1);

  // Auth fields
  const [name, setName] = useState('Anvar Karimov');
  const [email, setEmail] = useState('anvar@biznes.uz');
  const [password, setPassword] = useState('password123');

  // Onboarding fields
  const [bizName, setBizName] = useState('Anvar Savdo Markazi');
  const [bizType, setBizType] = useState<BusinessType>('retail');
  const [bizCurrency, setBizCurrency] = useState<Currency>('UZS');
  const [avgRevenue, setAvgRevenue] = useState<number>(20000000);
  const [selectedCats, setSelectedCats] = useState<string[]>([
    'Mahsulot', 'Reklama', 'Ijara', 'Ish haqi', 'Transport'
  ]);

  if (!isOpen) return null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      // Direct login to current or created user
      const user: User = {
        id: `usr-${Date.now()}`,
        name: name || 'Tadbirkor',
        email: email || 'user@hisobchi.uz',
        plan: 'pro',
        createdAt: new Date().toISOString(),
      };
      const business: Business = {
        id: `biz-${Date.now()}`,
        userId: user.id,
        name: 'Mening Biznesim',
        type: 'retail',
        currency: 'UZS',
        monthlyRevenueTarget: 25000000,
        monthlyExpenseBudget: 15000000,
        notificationsEnabled: true,
      };
      onCompleteAuth(user, business);
      onClose();
    } else {
      // Move to personalized 5-step onboarding wizard
      setMode('onboarding');
      setStep(1);
    }
  };

  const handleGoogleLogin = () => {
    setMode('onboarding');
    setStep(1);
  };

  const handleFinishOnboarding = () => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name || 'Foydalanuvchi',
      email: email || 'user@hisobchi.uz',
      plan: 'pro',
      createdAt: new Date().toISOString(),
    };

    const newBusiness: Business = {
      id: `biz-${Date.now()}`,
      userId: newUser.id,
      name: bizName || 'Mening Biznesim',
      type: bizType,
      currency: bizCurrency,
      monthlyRevenueTarget: avgRevenue,
      monthlyExpenseBudget: Math.round(avgRevenue * 0.6),
      notificationsEnabled: true,
    };

    onCompleteAuth(newUser, newBusiness);
    onClose();
  };

  const toggleCategory = (cat: string) => {
    if (selectedCats.includes(cat)) {
      setSelectedCats(selectedCats.filter(c => c !== cat));
    } else {
      setSelectedCats([...selectedCats, cat]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden dark:border-slate-800 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-sm shadow-emerald-500/30">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-base">
              Hisobchi<span className="text-emerald-600 dark:text-emerald-400">AI</span>
            </span>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {mode !== 'onboarding' ? (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {mode === 'login' ? t.loginTitle : t.registerTitle}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  14 kunlik bepul sinov davri bilan boshlang
                </p>
              </div>

              {/* Google login button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 shadow-sm transition-colors cursor-pointer"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>{t.googleLogin}</span>
              </button>

              <div className="relative my-4 text-center">
                <span className="relative bg-white px-2 text-[11px] text-slate-400 dark:bg-slate-900">
                  {t.orWithEmail}
                </span>
                <div className="absolute inset-0 flex items-center -z-10">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleAuthSubmit} className="space-y-3 text-xs">
                {mode === 'register' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      {t.fullNameLabel}
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {t.emailLabel}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {t.passwordLabel}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-emerald-600 py-3 text-xs font-semibold text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/30 transition-all cursor-pointer mt-2"
                >
                  {mode === 'login' ? t.login : 'Hisob yaratish va sozlash'}
                </button>
              </form>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="text-xs text-emerald-600 hover:underline dark:text-emerald-400 cursor-pointer font-medium"
                >
                  {mode === 'login' ? `${t.noAccount} ${t.register}` : `${t.haveAccount} ${t.login}`}
                </button>
              </div>
            </div>
          ) : (
            // ONBOARDING 5-STEP WIZARD
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Step indicator */}
              <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {step} / 5-qadam
                </span>
                <span className="text-slate-400 text-[11px]">
                  Shaxsiy dashboardni sozlash
                </span>
              </div>

              {/* Step 1: Business Name */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {t.step1BusinessName}
                  </h3>
                  <input
                    type="text"
                    value={bizName}
                    onChange={(e) => setBizName(e.target.value)}
                    placeholder="Masalan: Sardor Eco Trend yoki Toshkent Kantselyariya"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    autoFocus
                  />
                  <button
                    onClick={() => setStep(2)}
                    disabled={!bizName.trim()}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-xs font-semibold text-white hover:bg-emerald-500 cursor-pointer"
                  >
                    <span>{t.btnNext}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Step 2: Business Type */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {t.step2BusinessType}
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { id: 'retail', label: 'Chakana savdo / Do‘kon' },
                      { id: 'services', label: 'Xizmatlar / Frilans' },
                      { id: 'ecommerce', label: 'Onlayn do‘kon' },
                      { id: 'catering', label: 'Umumiy ovqatlanish' },
                      { id: 'production', label: 'Ishlab chiqarish' },
                      { id: 'other', label: 'Boshqa faoliyat' },
                    ].map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setBizType(type.id as any)}
                        className={`p-3 rounded-2xl border text-left cursor-pointer transition-colors ${
                          bizType === type.id
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-semibold'
                            : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setStep(1)}
                      className="w-1/3 rounded-2xl border border-slate-200 py-2.5 text-xs text-slate-600 cursor-pointer"
                    >
                      Orqaga
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="w-2/3 rounded-2xl bg-emerald-600 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500 cursor-pointer"
                    >
                      {t.btnNext}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Currency */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {t.step3Currency}
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'UZS', label: 'UZS (So‘m)', desc: 'Asosiy milliy valyuta' },
                      { id: 'USD', label: 'USD ($)', desc: 'AQSH dollari' },
                      { id: 'EUR', label: 'EUR (€)', desc: 'Yevro valyutasi' },
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setBizCurrency(c.id as any)}
                        className={`p-3 rounded-2xl border text-center cursor-pointer transition-colors ${
                          bizCurrency === c.id
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-bold'
                            : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="font-mono text-sm">{c.label}</div>
                        <div className="text-[10px] text-slate-400 mt-1">{c.desc}</div>
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setStep(2)}
                      className="w-1/3 rounded-2xl border border-slate-200 py-2.5 text-xs text-slate-600 cursor-pointer"
                    >
                      Orqaga
                    </button>
                    <button
                      onClick={() => setStep(4)}
                      className="w-2/3 rounded-2xl bg-emerald-600 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500 cursor-pointer"
                    >
                      {t.btnNext}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Monthly Average Revenue */}
              {step === 4 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {t.step4Revenue}
                  </h3>
                  <div>
                    <input
                      type="number"
                      value={avgRevenue}
                      onChange={(e) => setAvgRevenue(Number(e.target.value))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-base font-mono tabular-nums text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    <p className="text-[11px] text-slate-400 mt-1.5">
                      Bu qiymat oylik hisobotlar va rentabellik prognozlarini aniq chiqarishda qo‘llaniladi.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setStep(3)}
                      className="w-1/3 rounded-2xl border border-slate-200 py-2.5 text-xs text-slate-600 cursor-pointer"
                    >
                      Orqaga
                    </button>
                    <button
                      onClick={() => setStep(5)}
                      className="w-2/3 rounded-2xl bg-emerald-600 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500 cursor-pointer"
                    >
                      {t.btnNext}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5: Main Categories */}
              {step === 5 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {t.step5Categories}
                  </h3>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {[
                      'Mahsulot', 'Reklama', 'Transport', 'Ijara', 'Ish haqi',
                      'Kommunal', 'Internet', 'Soliq', 'Bank komissiyasi', 'Oziq-ovqat'
                    ].map((cat) => {
                      const isSel = selectedCats.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCategory(cat)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
                            isSel
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {cat} {isSel ? '✓' : '+'}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setStep(4)}
                      className="w-1/3 rounded-2xl border border-slate-200 py-2.5 text-xs text-slate-600 cursor-pointer"
                    >
                      Orqaga
                    </button>
                    <button
                      onClick={handleFinishOnboarding}
                      className="w-2/3 rounded-2xl bg-emerald-600 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/30 cursor-pointer"
                    >
                      {t.btnFinish}
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
