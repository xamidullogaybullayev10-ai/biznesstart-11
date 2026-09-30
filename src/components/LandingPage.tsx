import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  CreditCard, 
  FileSpreadsheet, 
  Bot, 
  ShieldCheck, 
  Smartphone, 
  Zap, 
  DollarSign, 
  HelpCircle,
  Play
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface LandingPageProps {
  onStartFree: () => void;
  onViewDemo: () => void;
  lang: Language;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartFree,
  onViewDemo,
  lang,
}) => {
  const t = translations[lang];

  // Interactive prompt tester on landing page
  const [testPrompt, setTestPrompt] = useState('Bugun 250 ming so‘mga reklama berdim');
  const [testResult, setTestResult] = useState<string | null>(
    'Xarajat: 250,000 UZS · Kategoriya: Reklama · Sana: Bugun'
  );

  const handleTestSimulate = (text: string) => {
    setTestPrompt(text);
    if (text.includes('1 million 500')) {
      setTestResult('Daromad: 1,500,000 UZS · Kategoriya: Mahsulot sotuvi · Sana: Bugun');
    } else if (text.includes('800 ming')) {
      setTestResult('Xarajat: 800,000 UZS · Kategoriya: Ish haqi · Sana: Bugun');
    } else {
      setTestResult('Xarajat: 250,000 UZS · Kategoriya: Reklama · Sana: Bugun');
    }
  };

  const featuresList = [
    { icon: Sparkles, title: t.featAiEntry, desc: t.featAiEntryDesc },
    { icon: TrendingUp, title: t.featIncomeTracking, desc: t.featIncomeTrackingDesc },
    { icon: CreditCard, title: t.featExpenseTracking, desc: t.featExpenseTrackingDesc },
    { icon: DollarSign, title: t.featProfitCalc, desc: t.featProfitCalcDesc },
    { icon: FileSpreadsheet, title: t.featMonthlyReports, desc: t.featMonthlyReportsDesc },
    { icon: Zap, title: t.featCategoryAnalytics, desc: t.featCategoryAnalyticsDesc },
    { icon: ShieldCheck, title: t.featDebtTracking, desc: t.featDebtTrackingDesc },
    { icon: Smartphone, title: t.featCashFlow, desc: t.featCashFlowDesc },
    { icon: Bot, title: t.featAiAssistant, desc: t.featAiAssistantDesc },
    { icon: FileSpreadsheet, title: t.featExport, desc: t.featExportDesc },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/80 dark:border-slate-800">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 dark:bg-emerald-500/5 blur-3xl pointer-events-none rounded-full" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            
            {/* Top kicker */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-4 py-1.5 text-xs font-semibold text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300 mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{t.heroBadge}</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white" style={{ textWrap: 'balance' }}>
              {t.heroTitle}
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              {t.heroSubtitle}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onStartFree}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 active:scale-95 transition-all cursor-pointer"
              >
                <span>{t.btnStartFree}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={onViewDemo}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/80 active:scale-95 transition-all cursor-pointer"
              >
                <Play className="h-4 w-4 fill-current opacity-70" />
                <span>{t.btnViewDemo}</span>
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">✓ 14 kunlik bepul sinov</span>
              <span className="flex items-center gap-1">✓ Karta talab qilinmaydi</span>
              <span className="flex items-center gap-1">✓ O‘zbek tilida to‘liq</span>
            </div>
          </div>

          {/* Interactive Live Dashboard Preview Box */}
          <div className="mt-14 max-w-5xl mx-auto rounded-3xl border border-slate-200 bg-slate-900 p-2 sm:p-4 shadow-2xl dark:border-slate-800">
            <div className="rounded-2xl bg-slate-950 p-4 sm:p-6 text-white overflow-hidden">
              
              {/* Window Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs text-slate-400 font-mono">hisobchi.uz/dashboard</span>
                </div>
                <div className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  Jonli hisob-kitob
                </div>
              </div>

              {/* 3 Metric Cards Highlight */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="rounded-2xl bg-slate-900/80 p-4 border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium">{t.heroRevenue}</div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-white mt-1">
                    12,450,000 <span className="text-sm font-normal text-slate-400">UZS</span>
                  </div>
                  <div className="text-[11px] text-emerald-400 mt-1">↑ +24% o‘tgan oyga nisbatan</div>
                </div>

                <div className="rounded-2xl bg-slate-900/80 p-4 border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium">{t.heroExpense}</div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-rose-400 mt-1">
                    7,280,000 <span className="text-sm font-normal text-slate-400">UZS</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">11 ta toifa bo‘yicha</div>
                </div>

                <div className="rounded-2xl bg-emerald-950/40 p-4 border border-emerald-500/30">
                  <div className="text-xs text-emerald-300 font-medium">{t.heroNetProfit}</div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400 mt-1">
                    5,170,000 <span className="text-sm font-normal text-emerald-300/70">UZS</span>
                  </div>
                  <div className="text-[11px] text-emerald-300 mt-1">Sof rentabellik: 41.5%</div>
                </div>
              </div>

              {/* Natural AI Prompt Simulator inside the preview */}
              <div className="rounded-2xl bg-slate-900 p-4 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    AI orqali bir zumda kiritish:
                  </span>
                  <span className="text-[11px] text-slate-400">Namunalarni tanlang</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <button
                    onClick={() => handleTestSimulate('Bugun 250 ming so‘mga reklama berdim')}
                    className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-slate-300"
                  >
                    “250 ming reklama berdim”
                  </button>
                  <button
                    onClick={() => handleTestSimulate('Bugun 1 million 500 ming so‘mlik mahsulot sotdim')}
                    className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-slate-300"
                  >
                    “1.5 mln mahsulot sotdim”
                  </button>
                  <button
                    onClick={() => handleTestSimulate('Usta Akmalga 800 ming ish haqi berdim')}
                    className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-slate-300"
                  >
                    “Akmalga 800 ming ish haqi”
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-xs font-mono text-emerald-300">
                    <span className="text-slate-500">Kiritildi: </span>
                    “{testPrompt}”
                  </div>
                  <div className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/40">
                    {testResult}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 2. MUAMMO (Problem Section) */}
      <section className="py-20 bg-slate-100/60 dark:bg-slate-900/40 border-b border-slate-200/80 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mx-auto text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              {t.problemBadge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
              {t.problemTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="h-10 w-10 rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 flex items-center justify-center font-bold mb-4">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {t.problem1Title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.problem1Desc}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="h-10 w-10 rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 flex items-center justify-center font-bold mb-4">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {t.problem2Title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.problem2Desc}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="h-10 w-10 rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 flex items-center justify-center font-bold mb-4">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {t.problem3Title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.problem3Desc}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-4xl mx-auto">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                04
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {t.problem4Title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.problem4Desc}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                05
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {t.problem5Title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.problem5Desc}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. YECHIM (Solution Showcase with Photo) */}
      <section className="py-20 border-b border-slate-200/80 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {t.solutionBadge}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2 leading-tight">
                {t.solutionTitle}
              </h2>
              <p className="mt-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.solutionDesc}
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Murakkab hisobchilik atamalarisiz</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Oddiy inson tilida tushuntirilgan hisob-kitoblar va kassa tushumlari.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Smartfoningizda doim yoningizda</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Do‘konda, yo‘lda yoki kafeda turib 5 soniyada yangi to‘lovni qayd qiling.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Xavfsiz va shaxsiy</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Moliyaviy ma’lumotlaringiz to‘liq izolyatsiya qilingan va faqat sizga tegishli.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={onStartFree}
                  className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  {t.btnStartFree}
                </button>
              </div>
            </div>

            {/* Visual asset showcasing Uzbek entrepreneur */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
              <img
                src="/src/assets/images/business_owner_uzbek_1790762609550.jpg"
                alt="O‘zbekistonlik tadbirkor HisobchiAI bilan"
                className="w-full h-auto object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                <div className="text-white">
                  <div className="text-xs text-emerald-400 font-semibold mb-1">Amaliy natija:</div>
                  <p className="text-sm font-medium">“HisobchiAI orqali oyiga 3 million so‘m keraksiz xarajatlarni aniqlab, daromadimizni 35% ga oshirdik.”</p>
                  <p className="text-xs text-slate-300 mt-2">— Jamshidbek, Toshkent shahridagi do‘kon egasi</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. IMKONIYATLAR (10 Key Features) */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Imkoniyatlar
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
              {t.featuresTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuresList.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={idx}
                  className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm hover:shadow-md transition-shadow dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. TARIFLAR (Pricing Section) */}
      <section className="py-20 border-b border-slate-200/80 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mx-auto text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {t.pricingTitle}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
              {t.pricingSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
            
            {/* Free Plan */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 flex flex-col justify-between shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.planFree}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.planFreeDesc}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">{t.planFreePrice}</span>
                  <span className="text-xs text-slate-500">/ {t.planFreePeriod}</span>
                </div>

                <div className="mt-6 space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">✓ {t.planFreeF1}</div>
                  <div className="flex items-center gap-2">✓ {t.planFreeF2}</div>
                  <div className="flex items-center gap-2">✓ {t.planFreeF3}</div>
                  <div className="flex items-center gap-2">✓ {t.planFreeF4}</div>
                </div>
              </div>

              <button
                onClick={onStartFree}
                className="mt-8 w-full rounded-xl border border-slate-300 py-3 text-xs font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
              >
                {t.planFreeBtn}
              </button>
            </div>

            {/* Pro Plan (Highlighted) */}
            <div className="relative rounded-3xl border-2 border-emerald-500 bg-white p-8 flex flex-col justify-between shadow-xl dark:bg-slate-900">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-3.5 py-0.5 text-[11px] font-bold text-white uppercase tracking-wider">
                {t.planProBadge}
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.planPro}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.planProDesc}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">{t.planProPrice}</span>
                  <span className="text-xs text-slate-500">/ {t.planProPeriod}</span>
                </div>

                <div className="mt-6 space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2 font-medium">✓ {t.planProF1}</div>
                  <div className="flex items-center gap-2">✓ {t.planProF2}</div>
                  <div className="flex items-center gap-2">✓ {t.planProF3}</div>
                  <div className="flex items-center gap-2">✓ {t.planProF4}</div>
                  <div className="flex items-center gap-2">✓ {t.planProF5}</div>
                </div>
              </div>

              <button
                onClick={onStartFree}
                className="mt-8 w-full rounded-xl bg-emerald-600 py-3 text-xs font-semibold text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-500 cursor-pointer"
              >
                {t.planProBtn}
              </button>
            </div>

            {/* Business Plan */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 flex flex-col justify-between shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.planBusiness}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.planBusinessDesc}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">{t.planBusinessPrice}</span>
                  <span className="text-xs text-slate-500">/ {t.planBusinessPeriod}</span>
                </div>

                <div className="mt-6 space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">✓ {t.planBusinessF1}</div>
                  <div className="flex items-center gap-2">✓ {t.planBusinessF2}</div>
                  <div className="flex items-center gap-2">✓ {t.planBusinessF3}</div>
                  <div className="flex items-center gap-2">✓ {t.planBusinessF4}</div>
                  <div className="flex items-center gap-2">✓ {t.planBusinessF5}</div>
                </div>
              </div>

              <button
                onClick={onStartFree}
                className="mt-8 w-full rounded-xl border border-slate-300 py-3 text-xs font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
              >
                {t.planBusinessBtn}
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 6. REALISTIC TESTIMONIALS */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              O‘zbekistonlik tadbirkorlar ishonchi
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                “Telegramda yozgandek shunchaki ‘bugun 500 ming mahsulot sotdim’ deb yozaman, o‘zi hisoblab boradi. Daftardagi yozuvlardan butunlay qutuldik.”
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center font-bold text-xs text-emerald-700">
                  SH
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Shoxrux Mirzayev</div>
                  <div className="text-[11px] text-slate-400">Onlayn kiyim do‘koni (Toshkent)</div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                “Nasiya daftari eng katta yordamchi bo‘ldi. Qaysi mijozdan qancha pul olishim kerakligi va muddati doim ko‘z oldimda.”
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-teal-100 dark:bg-teal-950 flex items-center justify-center font-bold text-xs text-teal-700">
                  M
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Madina Qosimova</div>
                  <div className="text-[11px] text-slate-400">Pishiriqlar sexi (Samarqand)</div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                “Eng asosiysi oylik sof foydani aniq ko‘rsatadi. Avvallari pulim ko‘pdek tuyulardi, lekin xarajatlar chiqib ketganda foyda kam qolayotganini tushundim.”
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-cyan-100 dark:bg-cyan-950 flex items-center justify-center font-bold text-xs text-cyan-700">
                  A
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Alisher To‘laganov</div>
                  <div className="text-[11px] text-slate-400">Avto ehtiyot qismlar do‘koni (Farg‘ona)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-xs">
              H
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-sm">HisobchiAI</span>
            <span>— O‘zbekistondagi kichik biznes uchun AI moliya platformasi</span>
          </div>

          <div>
            © {new Date().getFullYear()} HisobchiAI. Barcha huquqlar himoyalangan.
          </div>
        </div>
      </footer>

    </div>
  );
};
