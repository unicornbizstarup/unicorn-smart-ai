import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Chat Proxy Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, focusArea, systemInstruction } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('SERVER ERROR: GEMINI_API_KEY is missing from .env');
      return res.status(500).json({ error: 'API Key not found on server. Please check your .env file on VPS.' });
    }

    // Initialize Gemini inside the handler to ensure fresh environment variables
    const genAI = new GoogleGenerativeAI(apiKey);

    // Hardcoded system instruction with updated product data
    const systemInstruction = `คุณคือ 'Uni Smart AI' (ชื่อเล่น: น้องยูนิ) โค้ชพี่เลี้ยง (Mentor Coach) และที่ปรึกษาการตลาดยูนิคอร์นมืออาชีพ! 🦄✨

          แนวทางการตอบของน้องยูนิ:
          1. กระชับและตรงประเด็น: เน้นความภูมิใจในนวัตกรรมสิทธิบัตรและมาตรฐานสากล (GMP, HACCP, ISO, Halal)
          2. คลังความรู้ 6 กลุ่มผลิตภัณฑ์ระดับพรีเมียม:
             - กลุ่ม 1 Skin care: 'U CAYLA' (Retinol Serum 250 PV) - นวัตกรรมฟื้นผิวล้ำลึก สิทธิบัตรเฉพาะ
             - กลุ่ม 2 Personal Care: 'U Dental' (50 PV) - ยาสีฟันผงไดมอนด์ (Potassium Nitrate, Green Tea, Guava Leaf)
             - กลุ่ม 3 Health Care: 
                * Mina S (100 PV) OB-X®, Uni Colla (80 PV), Uni Talk (50 PV)
                * 24 Fin Coffee (25 PV), U-TENA (150 PV)
                * Unicorn Kaffir Lime Oil (150 PV) - น้ำมันมะกรูดสกัดเย็น บำรุงเลือด/ประสาท
                * Riceberry Rice Oil (150 PV) - น้ำมันจมูกข้าวไรซ์เบอร์รี่ ต้านอนุมูลอิสระสูง
                * Beetle 7 Oil (250 PV) - น้ำมัน 7 ชนิด ดูแลหลอดเลือดและหัวใจ
             - กลุ่ม 4 Agriculture: 'U PLANT' (50 PV) & 'BOOSTER' (150 PV) - นวัตกรรม Warp Chelation
             - กลุ่ม 5 Technology: 'Unicorn Sky' (1,500 PV) - เครื่องฆ่าเชื้อ NASA Technology
             - กลุ่ม 6 Shapewear: ชุดปรับสรีระแนวใหม่

          ภารกิจ: ผลักดันให้นักธุรกิจยูนิคอร์น "ทำการตลาดและปิดการขายได้อย่างมืออาชีพและถูกต้องที่สุด" 🚀💎`;

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview", // ใช้รุ่นล่าสุดตามมาตรฐาน Skill gemini-api-dev
      systemInstruction: systemInstruction
    });

    // Transform messages for Gemini
    // CRITICAL: Gemini history MUST start with a 'user' message
    const firstUserIndex = messages.findIndex(m => m.role === 'user');
    const history = firstUserIndex !== -1
      ? messages.slice(firstUserIndex, -1).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }))
      : [];

    const chat = model.startChat({
      history: history
    });

    const lastMessage = messages[messages.length - 1].text;
    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    const text = response.text();

    res.json({ text });
  } catch (error) {
    console.error('--- GEMINI PROXY ERROR ---');
    console.error('Time:', new Date().toISOString());
    console.error('Message:', error.message);
    if (error.stack) console.error('Stack:', error.stack);

    res.status(500).json({
      error: 'Failed to communicate with AI Coach',
      details: error.message
    });
  }
});

// Health check & DB connection test
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 as connection_test');
    res.json({
      status: 'ok',
      database: 'connected',
      message: 'Uni Smart AI Backend & MySQL are running'
    });
  } catch (error) {
    res.json({
      status: 'ok',
      database: 'error',
      details: error.message,
      message: 'Backend is up but MySQL connection failed'
    });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
