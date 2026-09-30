import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  Mic, 
  MicOff, 
  ArrowRight, 
  Check, 
  Calendar, 
  Tag, 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  Loader2, 
  Edit2 
} from 'lucide-react';
import { 
  Language, 
  Category, 
  Transaction, 
  AiParsedTransaction 
} from '../types';
import { translations } from '../i18n/translations';
import { aiService } from '../services/aiService';

interface AiTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  categories: Category[];
  businessId: string;
  lang: Language;
}

export const AiTransactionModal: React.FC<AiTransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  categories,
  businessId,
  lang,
}) => {
  const t = translations[lang];

  const [inputMode, setInputMode] = useState<'prompt' | 'confirmed' | 'editing'>('prompt');
  const [promptText, setPromptText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [parsedData, setParsedData] = useState<AiParsedTransaction | null>(null);

  // Editable fields
  const [editType, setEditType] = useState<'income' | 'expense'>('expense');
  const [editAmount, setEditAmount] = useState<number>(0);
  const [editCategory, setEditCategory] = useState<string>('Boshqa');
  const [editDate, setEditDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [editDescription, setEditDescription] = useState<string>('');

  const speechRecognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) {
      setPromptText('');
      setParsedData(null);
      setInputMode('prompt');
      setIsLoading(false);
      if (isListening && speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
        setIsListening(false);
      }
    }
  }, [isOpen]);

  // Handle Speech Recognition setup
  const toggleListening = () => {
    if (isListening) {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Brauzeringiz ovozli kiritishni qo‘llab-quvvatlamaydi (Chrome yoki Edge tavsiya etiladi).');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'ru' ? 'ru-RU' : (lang === 'en' ? 'en-US' : 'uz-UZ');
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setPromptText(transcript);
      setIsListening(false);
      // Auto analyze after voice capture
      handleAnalyzeText(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    speechRecognitionRef.current = recognition;
    recognition.start();
  };

  const handleAnalyzeText = async (customText?: string) => {
    const textToAnalyze = customText || promptText;
    if (!textToAnalyze.trim()) return;

    setIsLoading(true);
    try {
      const result = await aiService.parseTransaction(textToAnalyze);
      setParsedData(result);
      setEditType(result.type);
      setEditAmount(result.amount);
      setEditCategory(result.category);
      setEditDate(result.date);
      setEditDescription(result.description);
      setInputMode('confirmed');
    } catch {
      // handled inside service
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveConfirmed = () => {
    if (!editAmount || editAmount <= 0) return;

    // Find category ID or match
    const matchedCat = categories.find(c => c.name.toLowerCase() === editCategory.toLowerCase());
    const categoryId = matchedCat ? matchedCat.id : 'cat-boshqa-exp';

    onSave({
      businessId,
      type: editType,
      amount: editAmount,
      categoryId,
      categoryName: editCategory,
      description: editDescription || promptText || (editType === 'income' ? 'Daromad' : 'Xarajat'),
      date: editDate,
      source: 'ai',
      rawText: promptText,
    });

    onClose();
  };

  if (!isOpen) return null;

  const quickSamples = [
    'Bugun 250 ming so‘mga reklama berdim',
    'Bugun 1 million 500 ming so‘mlik mahsulot sotdim',
    'Usta Akmalga 800 ming ish haqi berdim',
    'Kecha do‘kon ijarasiga 3.5 mln to‘ladim',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-sm shadow-emerald-500/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                {t.aiModalTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tabiiy o‘zbek tilida yozing yoki ayting
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {inputMode === 'prompt' && (
            <div className="space-y-4">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t.aiModalSubtitle}
              </label>

              {/* Text Input with voice trigger */}
              <div className="relative">
                <textarea
                  rows={3}
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAnalyzeText();
                    }
                  }}
                  placeholder={t.aiModalPlaceholder}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 pr-12 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-emerald-400"
                  autoFocus
                />

                <button
                  type="button"
                  onClick={toggleListening}
                  className={`absolute right-3 bottom-3 flex h-10 w-10 items-center justify-center rounded-xl transition-all cursor-pointer ${
                    isListening 
                      ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30' 
                      : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700'
                  }`}
                  title={isListening ? t.stopVoice : t.startVoice}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
              </div>

              {isListening && (
                <div className="flex items-center gap-2 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/40">
                  <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                  <span>{t.listening}</span>
                </div>
              )}

              {/* Quick sample pills */}
              <div>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-2">
                  Tezkor namunalar (bosing):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {quickSamples.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setPromptText(sample);
                        handleAnalyzeText(sample);
                      }}
                      className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400 transition-colors cursor-pointer text-left"
                    >
                      {sample}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {t.btnCancel}
                </button>
                <button
                  type="button"
                  disabled={!promptText.trim() || isLoading}
                  onClick={() => handleAnalyzeText()}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer shadow-sm shadow-emerald-600/30"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{t.detecting}</span>
                    </>
                  ) : (
                    <>
                      <span>{t.btnDetect}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Mode 2: AI Confirmation Card */}
          {(inputMode === 'confirmed' || inputMode === 'editing') && (
            <div className="space-y-5 animate-in fade-in duration-150">
              
              <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                    <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span>AI tushunishi bo‘yicha:</span>
                  </div>
                  {inputMode === 'confirmed' && (
                    <button
                      onClick={() => setInputMode('editing')}
                      className="flex items-center gap-1 text-xs text-emerald-700 hover:underline dark:text-emerald-400 font-medium cursor-pointer"
                    >
                      <Edit2 className="h-3 w-3" />
                      <span>{t.btnEdit}</span>
                    </button>
                  )}
                </div>

                {inputMode === 'confirmed' ? (
                  // Summary view before saving
                  <div className="space-y-2.5 text-sm">
                    <div className="flex items-center justify-between pb-2 border-b border-emerald-100 dark:border-emerald-900/40">
                      <span className="text-slate-500 dark:text-slate-400 text-xs">{t.type}:</span>
                      <span className={`font-semibold flex items-center gap-1 ${
                        editType === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        {editType === 'income' ? (
                          <><TrendingUp className="h-4 w-4" /> {t.income}</>
                        ) : (
                          <><TrendingDown className="h-4 w-4" /> {t.expense}</>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-emerald-100 dark:border-emerald-900/40">
                      <span className="text-slate-500 dark:text-slate-400 text-xs">{t.amount}:</span>
                      <span className="font-bold text-lg font-mono tabular-nums text-slate-900 dark:text-white">
                        {editAmount.toLocaleString('uz-UZ')} UZS
                      </span>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-emerald-100 dark:border-emerald-900/40">
                      <span className="text-slate-500 dark:text-slate-400 text-xs">{t.category}:</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {editCategory}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-emerald-100 dark:border-emerald-900/40">
                      <span className="text-slate-500 dark:text-slate-400 text-xs">{t.date}:</span>
                      <span className="text-slate-700 dark:text-slate-300">
                        {editDate}
                      </span>
                    </div>

                    <div className="flex items-start justify-between">
                      <span className="text-slate-500 dark:text-slate-400 text-xs">{t.description}:</span>
                      <span className="text-slate-800 dark:text-slate-200 font-medium text-right max-w-[280px]">
                        {editDescription}
                      </span>
                    </div>
                  </div>
                ) : (
                  // Editable inline form
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setEditType('income')}
                        className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold cursor-pointer transition-colors ${
                          editType === 'income' 
                            ? 'bg-emerald-600 text-white shadow-sm' 
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <TrendingUp className="h-3.5 w-3.5" />
                        {t.income}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditType('expense')}
                        className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold cursor-pointer transition-colors ${
                          editType === 'expense' 
                            ? 'bg-rose-600 text-white shadow-sm' 
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <TrendingDown className="h-3.5 w-3.5" />
                        {t.expense}
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        {t.amount} (UZS)
                      </label>
                      <input
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm font-mono tabular-nums text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                          {t.category}
                        </label>
                        <select
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                          {t.date}
                        </label>
                        <input
                          type="date"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        {t.description}
                      </label>
                      <input
                        type="text"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setInputMode('prompt')}
                  className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {t.btnCancel}
                </button>
                <button
                  type="button"
                  onClick={handleSaveConfirmed}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/30 active:scale-95 transition-all cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                  <span>{t.btnSave}</span>
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};
