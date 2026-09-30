import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Sparkles, 
  CreditCard, 
  ShieldCheck, 
  HelpCircle 
} from 'lucide-react';
import { Language, UserPlan } from '../types';
import { translations } from '../i18n/translations';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: UserPlan;
  onSelectPlan: (plan: UserPlan) => void;
  lang: Language;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  currentPlan,
  onSelectPlan,
  lang,
}) => {
  const t = translations[lang];

  const [checkoutPlan, setCheckoutPlan] = useState<UserPlan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'payme' | 'click' | 'uzum'>('payme');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSimulatePayment = () => {
    if (!checkoutPlan) return;
    setPaymentSuccess(true);
    setTimeout(() => {
      onSelectPlan(checkoutPlan);
      setPaymentSuccess(false);
      setCheckoutPlan(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden dark:border-slate-800 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{t.pricingTitle}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                14 kunlik sinov
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.pricingSubtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="p-6">
          {!checkoutPlan ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              
              {/* Free Plan */}
              <div className={`rounded-3xl border p-6 flex flex-col justify-between ${
                currentPlan === 'free' 
                  ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10' 
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{t.planFree}</h3>
                  <p className="text-[11px] text-slate-500 mt-1">{t.planFreeDesc}</p>
                  
                  <div className="mt-4 text-2xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
                    0 <span className="text-xs font-normal text-slate-400">{t.som} / {t.planFreePeriod}</span>
                  </div>

                  <div className="mt-4 space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2">✓ {t.planFreeF1}</div>
                    <div className="flex items-center gap-2">✓ {t.planFreeF2}</div>
                    <div className="flex items-center gap-2">✓ {t.planFreeF3}</div>
                    <div className="flex items-center gap-2">✓ {t.planFreeF4}</div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectPlan('free')}
                  disabled={currentPlan === 'free'}
                  className={`mt-6 w-full rounded-xl py-2.5 text-xs font-semibold cursor-pointer ${
                    currentPlan === 'free'
                      ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-default'
                      : 'border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200'
                  }`}
                >
                  {currentPlan === 'free' ? 'Joriy tarif' : t.planFreeBtn}
                </button>
              </div>

              {/* Pro Plan */}
              <div className={`rounded-3xl border-2 p-6 flex flex-col justify-between relative shadow-lg ${
                currentPlan === 'pro'
                  ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20'
                  : 'border-emerald-500 bg-white dark:bg-slate-900'
              }`}>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-3 py-0.5 text-[10px] font-bold text-white uppercase">
                  {t.planProBadge}
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{t.planPro}</h3>
                  <p className="text-[11px] text-slate-500 mt-1">{t.planProDesc}</p>
                  
                  <div className="mt-4 text-2xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
                    99,000 <span className="text-xs font-normal text-slate-400">{t.som} / {t.planProPeriod}</span>
                  </div>

                  <div className="mt-4 space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs text-slate-700 dark:text-slate-200">
                    <div className="flex items-center gap-2 font-medium">✓ {t.planProF1}</div>
                    <div className="flex items-center gap-2">✓ {t.planProF2}</div>
                    <div className="flex items-center gap-2">✓ {t.planProF3}</div>
                    <div className="flex items-center gap-2">✓ {t.planProF4}</div>
                    <div className="flex items-center gap-2">✓ {t.planProF5}</div>
                  </div>
                </div>

                <button
                  onClick={() => setCheckoutPlan('pro')}
                  className="mt-6 w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/30 cursor-pointer"
                >
                  {currentPlan === 'pro' ? 'Tarifni uzaytirish' : t.planProBtn}
                </button>
              </div>

              {/* Business Plan */}
              <div className={`rounded-3xl border p-6 flex flex-col justify-between ${
                currentPlan === 'business'
                  ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{t.planBusiness}</h3>
                  <p className="text-[11px] text-slate-500 mt-1">{t.planBusinessDesc}</p>
                  
                  <div className="mt-4 text-2xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
                    249,000 <span className="text-xs font-normal text-slate-400">{t.som} / {t.planBusinessPeriod}</span>
                  </div>

                  <div className="mt-4 space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2">✓ {t.planBusinessF1}</div>
                    <div className="flex items-center gap-2">✓ {t.planBusinessF2}</div>
                    <div className="flex items-center gap-2">✓ {t.planBusinessF3}</div>
                    <div className="flex items-center gap-2">✓ {t.planBusinessF4}</div>
                    <div className="flex items-center gap-2">✓ {t.planBusinessF5}</div>
                  </div>
                </div>

                <button
                  onClick={() => setCheckoutPlan('business')}
                  className="mt-6 w-full rounded-xl border border-slate-300 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {currentPlan === 'business' ? 'Joriy tarif' : t.planBusinessBtn}
                </button>
              </div>

            </div>
          ) : (
            // LOCAL PAYMENT FLOW PLACEHOLDER (Payme, Click, Uzum)
            <div className="max-w-md mx-auto space-y-5 animate-in fade-in duration-150">
              <div className="text-center">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Obunani to‘lash — {checkoutPlan.toUpperCase()}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  O‘zbekistondagi milliy to‘lov tizimlari orqali xavfsiz to‘lov
                </p>
              </div>

              {/* Payment systems selector */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'payme', name: 'Payme', badge: '0% komissiya' },
                  { id: 'click', name: 'Click Up', badge: 'Tezkor to‘lov' },
                  { id: 'uzum', name: 'Uzum Bank', badge: 'Keshbek' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPaymentMethod(item.id as any)}
                    className={`p-3 rounded-2xl border text-center cursor-pointer transition-all ${
                      paymentMethod === item.id
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-bold shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-sm font-bold">{item.name}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{item.badge}</div>
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                <div className="flex justify-between text-slate-500">
                  <span>Tanlangan tarif:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 uppercase">{checkoutPlan}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>To‘lov usuli:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 uppercase">{paymentMethod}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>Jami summa:</span>
                  <span className="text-emerald-600 font-mono">
                    {checkoutPlan === 'pro' ? '99,000' : '249,000'} UZS
                  </span>
                </div>
              </div>

              {paymentSuccess ? (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold text-center flex items-center justify-center gap-2">
                  <Check className="h-4 w-4" />
                  <span>To‘lov muvaffaqiyatli qabul qilindi! Tarif faollashtirildi.</span>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setCheckoutPlan(null)}
                    className="w-1/3 rounded-2xl border border-slate-200 py-3 text-xs font-semibold text-slate-600 cursor-pointer"
                  >
                    Orqaga
                  </button>
                  <button
                    onClick={handleSimulatePayment}
                    className="w-2/3 rounded-2xl bg-emerald-600 py-3 text-xs font-semibold text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/30 cursor-pointer"
                  >
                    To‘lovni tasdiqlash
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
