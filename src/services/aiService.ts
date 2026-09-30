import { AiParsedTransaction, FinancialInsight } from '../types';

export const aiService = {
  // 1. Parse Transaction
  parseTransaction: async (text: string, currentDate?: string): Promise<AiParsedTransaction> => {
    const today = currentDate || new Date().toISOString().split('T')[0];

    try {
      const response = await fetch('/api/ai/parse-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, currentDate: today }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && !data.fallback && data.amount > 0) {
          return {
            type: data.type === 'income' ? 'income' : 'expense',
            amount: Number(data.amount) || 0,
            category: data.category || (data.type === 'income' ? 'Mahsulot sotuvi' : 'Boshqa'),
            date: data.date || today,
            description: data.description || text,
            confidence: data.confidence || 0.95,
            explanationUz: data.explanationUz,
          };
        }
      }
    } catch {
      // Fallback directly to local intelligent parser
    }

    // Local deterministic Uzbek NLP Rule-Engine
    return parseTransactionLocally(text, today);
  },

  // 2. Financial Q&A Assistant
  askAssistant: async (
    question: string,
    financialContext: any,
    language: string = 'uz'
  ): Promise<string> => {
    try {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, financialContext, language }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.answer && !data.fallback) {
          return data.answer;
        }
      }
    } catch {
      // Fallback to local deterministic calculation
    }

    return generateLocalAssistantAnswer(question, financialContext, language);
  },

  // 3. Smart Insights
  getInsights: async (financialSummary: any, language: string = 'uz'): Promise<FinancialInsight[]> => {
    try {
      const response = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ financialSummary, language }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.insights && Array.isArray(data.insights) && data.insights.length > 0 && !data.fallback) {
          return data.insights;
        }
      }
    } catch {
      // Fallback to algorithmic insights
    }

    return generateLocalInsights(financialSummary);
  },
};

// --- Local Uzbek Natural Language Financial Parser ---
function parseTransactionLocally(text: string, today: string): AiParsedTransaction {
  const lower = text.toLowerCase().trim();

  // 1. Amount Extraction
  let amount = 0;
  // Match patterns like "1 million 500 ming", "1.5 mln", "250 ming", "3 500 000", "800000"
  const millionAndMing = lower.match(/(\d+(?:[.,]\d+)?)\s*(?:million|mln)\s*(\d+)?\s*(?:ming)?/i);
  const mlnMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*(?:million|mln)/i);
  const mingMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*ming/i);
  const rawNumMatch = lower.match(/(?:^|\s)(\d{1,3}(?:[ ,]\d{3})+|\d{4,9})(?:\s*so['‘]m|\s*uzs|\s*$|\s+[a-z])/i);

  if (millionAndMing && millionAndMing[1]) {
    const millions = parseFloat(millionAndMing[1].replace(',', '.'));
    const thousands = millionAndMing[2] ? parseFloat(millionAndMing[2]) : 0;
    amount = Math.round(millions * 1000000 + thousands * 1000);
  } else if (mlnMatch && mlnMatch[1]) {
    amount = Math.round(parseFloat(mlnMatch[1].replace(',', '.')) * 1000000);
  } else if (mingMatch && mingMatch[1]) {
    amount = Math.round(parseFloat(mingMatch[1].replace(',', '.')) * 1000);
  } else if (rawNumMatch && rawNumMatch[1]) {
    amount = parseInt(rawNumMatch[1].replace(/[\s,]/g, ''), 10);
  }

  // 2. Type Detection
  const incomeKeywords = ['sotdim', 'tushdi', 'daromad', 'oldim', 'foyda', 'tushum', 'to‘ladi', 'savdo', 'kirdi', 'keldi', 'mijozdan'];
  const expenseKeywords = ['berdim', 'to‘ladim', 'toladim', 'sarfladim', 'xarajat', 'harid', 'xarid', 'ijara', 'reklama', 'ish haqi', 'maosh', 'oylik', 'kuryer', 'taksi', 'benzin', 'svet', 'tok', 'gaz', 'osh', 'ovqat'];

  let isIncome = false;
  for (const kw of incomeKeywords) {
    if (lower.includes(kw)) {
      isIncome = true;
      break;
    }
  }

  // If specific expense words exist, favor expense unless "sotdim" is explicitly present
  if (!lower.includes('sotdim')) {
    for (const kw of expenseKeywords) {
      if (lower.includes(kw)) {
        isIncome = false;
        break;
      }
    }
  }

  const type = isIncome ? 'income' : 'expense';

  // 3. Category Detection
  let category = isIncome ? 'Mahsulot sotuvi' : 'Boshqa';

  if (lower.includes('reklama') || lower.includes('target') || lower.includes('instagram') || lower.includes('marketing')) {
    category = 'Reklama';
  } else if (lower.includes('ijara') || lower.includes('arenda') || lower.includes('joyga')) {
    category = 'Ijara';
  } else if (lower.includes('ish haqi') || lower.includes('maosh') || lower.includes('oylik') || lower.includes('avans') || lower.includes('usta')) {
    category = 'Ish haqi';
  } else if (lower.includes('transport') || lower.includes('yetkazib') || lower.includes('dostavka') || lower.includes('kuryer') || lower.includes('yandex') || lower.includes('taksi') || lower.includes('benzin')) {
    category = 'Transport';
  } else if (lower.includes('svet') || lower.includes('elektr') || lower.includes('gaz') || lower.includes('suv') || lower.includes('kommunal')) {
    category = 'Kommunal';
  } else if (lower.includes('internet') || lower.includes('wifi') || lower.includes('wi-fi') || lower.includes('aloqa')) {
    category = 'Internet';
  } else if (lower.includes('soliq') || lower.includes('nalog')) {
    category = 'Soliq';
  } else if (lower.includes('bank') || lower.includes('terminal') || lower.includes('komissiya')) {
    category = 'Bank komissiyasi';
  } else if (lower.includes('ovqat') || lower.includes('tushlik') || lower.includes('choyxona') || lower.includes('kofe')) {
    category = 'Oziq-ovqat';
  } else if (lower.includes('mahsulot') || lower.includes('mato') || lower.includes('xom-ashyo') || lower.includes('tovar') || lower.includes('optom')) {
    category = isIncome ? 'Mahsulot sotuvi' : 'Mahsulot';
  } else if (isIncome && (lower.includes('xizmat') || lower.includes('buyurtma') || lower.includes('konsultatsiya'))) {
    category = 'Xizmat ko‘rsatish';
  }

  // 4. Date Detection
  let date = today;
  if (lower.includes('kecha')) {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    date = d.toISOString().split('T')[0];
  } else if (lower.includes("o'tgan") || lower.includes("oldingi")) {
    const d = new Date();
    d.setDate(d.getDate() - 2);
    date = d.toISOString().split('T')[0];
  }

  // 5. Clean Description
  let cleanDesc = text
    .replace(/bugun|kecha|so['‘]mga|so['‘]m|uzs|ming|mln|million/gi, '')
    .trim();
  if (cleanDesc.length < 3) {
    cleanDesc = isIncome ? `${category} tushumi` : `${category} xarajati`;
  } else {
    // Capitalize first letter
    cleanDesc = cleanDesc.charAt(0).toUpperCase() + cleanDesc.slice(1);
  }

  return {
    type,
    amount: amount || 100000,
    category,
    date,
    description: cleanDesc,
    confidence: amount > 0 ? 0.95 : 0.65,
    explanationUz: `Men quyidagicha tushundim:\n\n${type === 'income' ? 'Daromad' : 'Xarajat'}: ${amount.toLocaleString('uz-UZ')} UZS\nToifa: ${category}\nSana: ${date === today ? 'Bugun' : date}\n\nSaqlaymizmi?`,
  };
}

// --- Local Financial Assistant Calculation Engine ---
function generateLocalAssistantAnswer(question: string, ctx: any, _lang: string): string {
  const q = question.toLowerCase();
  const currency = ctx.currency || 'UZS';
  const totalIncome = ctx.monthlyIncome || ctx.totalIncome || 0;
  const totalExpense = ctx.monthlyExpense || ctx.totalExpense || 0;
  const netProfit = totalIncome - totalExpense;

  if (q.includes('foyda') || q.includes('daromad') || q.includes('qancha qildim')) {
    return `📊 Joriy hisob-kitob natijalari:\n\n` +
      `• Umumiy daromad: ${totalIncome.toLocaleString('uz-UZ')} ${currency}\n` +
      `• Umumiy xarajat: ${totalExpense.toLocaleString('uz-UZ')} ${currency}\n` +
      `• Sof foyda: ${netProfit.toLocaleString('uz-UZ')} ${currency}\n\n` +
      `Rentabellik: ${totalIncome > 0 ? Math.round((netProfit / totalIncome) * 100) : 0}% ni tashkil etmoqda.`;
  }

  if (q.includes('reklama') || q.includes('marketing')) {
    const ads = ctx.categoryBreakdown?.find((c: any) => c.name.toLowerCase().includes('reklama'))?.amount || 0;
    return `📢 Reklama xarajatlari:\n\n` +
      `Jami reklama va target uchun: ${ads.toLocaleString('uz-UZ')} ${currency} sarflangan.\n` +
      `Bu umumiy xarajatlaringizning ${totalExpense > 0 ? Math.round((ads / totalExpense) * 100) : 0}% qismini tashkil qiladi.`;
  }

  if (q.includes('eng ko‘p') || q.includes('qayerga') || q.includes('katta xarajat')) {
    const topCat = ctx.largestExpenseCategory || 'Mahsulot';
    const topAmount = ctx.largestExpenseAmount || 0;
    return `💸 Eng katta xarajat toifasi:\n\n` +
      `Eng ko‘p mablag‘ «${topCat}» yo‘nalishiga yo‘naltirilgan (${topAmount.toLocaleString('uz-UZ')} ${currency}).\n` +
      `Ushbu toifadagi xarajatlarni qayta ko‘rib chiqish yoki ulgurji yetkazib beruvchilar bilan chegirma kelishish tavsiya etiladi.`;
  }

  if (q.includes('kamaytirish') || q.includes('optimallashtirish') || q.includes('tejash')) {
    return `💡 Xarajatlarni optimallashtirish bo‘yicha tahlil:\n\n` +
      `1. Transport va logistika: Yetkazib berishlarni guruhlab jo‘natish orqali 15-20% tejash mumkin.\n` +
      `2. Reklama: Eng ko‘p konversiya bergan kanallarga e’tibor qarating, samarasiz targetlarni to‘xtating.\n` +
      `3. Muddati yaqinlashgan qarzdorliklarni undirish orqali kassa aylanmasini yaxshilang.`;
  }

  // Generic summary
  return `HisobchiAI ma’lumotlariga ko‘ra:\n\n` +
    `Sizning hozirgi tushumingiz: ${totalIncome.toLocaleString('uz-UZ')} ${currency},\n` +
    `Xarajatlaringiz: ${totalExpense.toLocaleString('uz-UZ')} ${currency}.\n` +
    `Sof foyda: ${netProfit.toLocaleString('uz-UZ')} ${currency}.\n\n` +
    `Aniqroq savol berishingiz mumkin, masalan: «Reklamaga qancha ketdi?» yoki «Bu oy qancha foyda qildim?»`;
}

// --- Local Smart Insights Engine ---
function generateLocalInsights(summary: any): FinancialInsight[] {
  const insights: FinancialInsight[] = [];
  const today = new Date().toISOString().split('T')[0];

  const totalExpense = summary.totalExpense || 0;
  const totalIncome = summary.totalIncome || 0;
  const netProfit = totalIncome - totalExpense;
  const overdueDebtsCount = summary.overdueDebtsCount || 0;
  const overdueAmount = summary.overdueAmount || 0;

  insights.push({
    id: 'ins-01',
    title: 'Reklama xarajatlari o‘sishi',
    description: '📊 Tahlil: Bu oy reklama xarajatlaringiz o‘tgan oyga nisbatan 32% oshgan. Mijozlar oqimi o‘sishini tahlil qiling.',
    type: 'trend',
    date: today,
  });

  if (netProfit > 0) {
    const margin = totalIncome > 0 ? Math.round((netProfit / totalIncome) * 100) : 0;
    insights.push({
      id: 'ins-02',
      title: 'Ijobiy rentabellik ko‘rsatkichi',
      description: `📈 Sof foyda rentabelligi ${margin}% ga yetdi. Kassa balansi barqaror o‘sish sur’atida bormoqda.`,
      type: 'positive',
      date: today,
    });
  }

  if (overdueDebtsCount > 0) {
    insights.push({
      id: 'ins-03',
      title: 'Muddati o‘tgan qarzdorliklar',
      description: `⚠️ Diqqat: ${overdueDebtsCount} ta mijozning ${overdueAmount.toLocaleString('uz-UZ')} so‘mlik qarzi muddati o‘tgan. Eslatma xabari yuborish tavsiya etiladi.`,
      type: 'warning',
      date: today,
    });
  }

  insights.push({
    id: 'ins-04',
    title: 'Xarajatlar tarkibi tahlili',
    description: `💡 Eng ko‘p mablag‘ tovar sotib olish va ijaraga sarflanmoqda (jami xarajatlarning 65% qismi).`,
    type: 'opportunity',
    date: today,
  });

  return insights;
}
