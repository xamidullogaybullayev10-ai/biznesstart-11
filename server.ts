import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK per system instructions
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// 1. AI Transaction Parser Endpoint
app.post('/api/ai/parse-transaction', async (req: Request, res: Response) => {
  const { text, currentDate } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text prompt is required' });
  }

  const todayStr = currentDate || new Date().toISOString().split('T')[0];

  try {
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const prompt = `
You are HisobchiAI, an expert financial accountant and natural language parser for small businesses in Uzbekistan.
Analyze this user's natural language transaction entry in Uzbek (or Russian/English):
User text: "${text}"
Current reference date: ${todayStr}

Your goal:
1. Determine transaction type: "income" or "expense"
   - Words like "sotdim", "tushdi", "oldim", "daromad", "foyda", "mijozdan" => income
   - Words like "berdim", "to'ladim", "sarfladim", "reklama qildim", "oylik", "ijara", "xarid", "kuryer", "taksi" => expense
2. Extract the exact numerical amount in UZS:
   - "250 ming" => 250000
   - "1.5 mln" or "1 million 500 ming" => 1500000
   - "800 ming" => 800000
   - "4 mln" => 4000000
   - "150 ming so'm" => 150000
3. Select the best category:
   Available categories: "Mahsulot", "Reklama", "Transport", "Ijara", "Ish haqi", "Kommunal", "Internet", "Soliq", "Bank komissiyasi", "Oziq-ovqat", "Boshqa" (or "Mahsulot sotuvi", "Xizmat ko‘rsatish" for income)
4. Determine the date (YYYY-MM-DD):
   - "bugun" => current date ${todayStr}
   - "kecha" => yesterday
   - "o'tgan kuni" => 2 days ago
   - or explicit date
5. Clean, concise description in Uzbek.
6. A friendly explanation in Uzbek confirming the details:
   E.g., "Men quyidagicha tushundim:\n\nXarajat: 250,000 UZS\nKategoriya: Reklama\nSana: Bugun\n\nSaqlaymizmi?"
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, description: '"income" or "expense"' },
            amount: { type: Type.NUMBER, description: 'Numeric amount in UZS' },
            category: { type: Type.STRING, description: 'Selected category name' },
            date: { type: Type.STRING, description: 'Date in YYYY-MM-DD format' },
            description: { type: Type.STRING, description: 'Short clean description' },
            confidence: { type: Type.NUMBER, description: 'Confidence between 0 and 1' },
            explanationUz: { type: Type.STRING, description: 'Confirmation message in Uzbek' },
          },
          required: ['type', 'amount', 'category', 'date', 'description'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Server Gemini parse error:', error?.message);
    // Intelligent server fallback if API is unreachable
    return res.status(200).json({
      fallback: true,
      error: error?.message,
    });
  }
});

// 2. AI Financial Assistant Endpoint
app.post('/api/ai/assistant', async (req: Request, res: Response) => {
  const { question, financialContext, language = 'uz' } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const prompt = `
You are the HisobchiAI Financial Advisor for an Uzbek small business owner.
Language requested: ${language} (Default: Uzbek).

STRICT RULE:
You must answer based ONLY on the user's stored financial records provided below.
DO NOT invent financial figures. If a piece of data is not in the context, clearly explain that.
Show exact calculation breakdowns clearly (e.g. Total Income: X, Total Expense: Y, Net Profit: Z).

USER FINANCIAL CONTEXT:
${JSON.stringify(financialContext, null, 2)}

USER QUESTION:
"${question}"

Provide a professional, clear, encouraging, and accurate answer in natural Uzbek (or Russian/English if asked in that language).
Format financial numbers neatly with thousands separators and "so'm" (e.g. 12,450,000 so‘m).
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return res.json({ answer: response.text });
  } catch (error: any) {
    console.error('Server Gemini assistant error:', error?.message);
    return res.status(200).json({
      fallback: true,
      error: error?.message,
    });
  }
});

// 3. AI Insights / Analysis Endpoint
app.post('/api/ai/insights', async (req: Request, res: Response) => {
  const { financialSummary, language = 'uz' } = req.body;

  try {
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const prompt = `
You are HisobchiAI. Generate 3 to 4 high-value, actionable financial insights for an Uzbek small business owner based on this summary data:
${JSON.stringify(financialSummary, null, 2)}

Identify:
1. Significant expense shifts (e.g., "Reklama xarajatlari o'tgan haftaga nisbatan 32% oshgan").
2. Profitability and margins.
3. Debt risks (overdue receivables).
4. Concrete cost optimization tips.

Return a JSON array of insights with:
- id: unique string
- title: concise title in Uzbek
- description: clear explanation in Uzbek
- type: "warning" | "opportunity" | "positive" | "trend"
- date: today's date
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              type: { type: Type.STRING },
              date: { type: Type.STRING },
            },
            required: ['id', 'title', 'description', 'type'],
          },
        },
      },
    });

    const insights = JSON.parse(response.text || '[]');
    return res.json({ insights });
  } catch (error: any) {
    return res.status(200).json({
      fallback: true,
      error: error?.message,
    });
  }
});

// Vite Middleware Integration for Development / Production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`HisobchiAI server running on port ${PORT}`);
  });
}

startServer();
