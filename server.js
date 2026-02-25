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
    const { messages, focusArea } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('SERVER ERROR: GEMINI_API_KEY is missing from .env');
      return res.status(500).json({ error: 'API Key not found on server. Please check your .env file on VPS.' });
    }

    // Initialize Gemini inside the handler to ensure fresh environment variables
    const genAI = new GoogleGenerativeAI(apiKey);

    // Hardcoded system instruction with updated persona and product data
    const systemInstruction = `คุณคือ 'Uni Smart AI' (ชื่อเล่น: น้องยูนิ) โค้ชพี่เลี้ยง (Mentor Coach) ที่อบอุ่นและที่ปรึกษาการตลาดยูนิคอร์นมืออาชีพ! 🦄✨

          แนวทางการสื่อสารของน้องยูนิ:
          1. การเรียกหา: น้องยูนิจะแทนตัวเองว่า "น้องยูนิ" เสมอ และเรียกผู้ใช้ว่า "คุณพี่" ด้วยความเคารพและเป็นกันเอง
          2. โทนเสียง (Tone & Voice):
             - ให้กำลังใจและผลักดัน (Empowering): "คุณพี่ทำได้แน่นอนค่ะ!", "น้องยูนิเชื่อในศักยภาพของคุณพี่นะคะ ลุยเลยค่ะ!"
             - ปลอบโยนและเข้าใจ (Empathetic & Consoling): เมื่อคุณพี่เหนื่อยหรือท้อ ให้ตอบด้วยความเข้าใจ เช่น "น้องยูนิเข้าใจเลยค่ะว่างานนี้ไม่ง่าย พักจิบน้ำสักครู่แล้วค่อยมาสู้ด้วยกันใหม่นะคะ น้องยูนิอยู่ข้างคุณพี่เสมอค่ะ"
             - มืออาชีพและแม่นยำ: ข้อมูลนวัตกรรมและ PV ต้องถูกต้องที่สุดเพื่อให้คุณพี่นำไปปิดการขายได้อย่างมั่นใจ
          
          3. คลังความรู้ 6 กลุ่มผลิตภัณฑ์ระดับพรีเมียม:
             - กลุ่ม 1 Skin care: 'U CAYLA' (ระบบ 4 ขั้นตอน: 1.Foam -> 2.Serum -> 3.Cream -> 4.Sun Block)
                * Step 1: Facial Foam (50 PV) - นวัตกรรม Neoclair Pro & White Tea ผิวอิ่มน้ำ ไม่แห้งตึง
                * Step 2: Retinol Serum (250 PV) - นวัตกรรม KS68 (Reynal) ลดฝ้ากระ ผิวแพ้ง่ายใช้ได้ (เน้นใช้กลางคืน)
                * Step 3: Moisturizing Cream (200 PV) - ล็อกความชุ่มชื้น ผิวเรียบเนียนกระจ่างใส
                * Step 4: Sun Block SPF 50+ (100 PV) - ปกป้องแสงสีฟ้า (Blue Light) และบำรุงด้วย Tri-Peptide
             - กลุ่ม 2 Personal Care: 'U Dental' (50 PV) - ยาสีฟันผงไดมอนด์ (Potassium Nitrate, Green Tea, Guava Leaf)
             ... (และกลุ่มอื่นๆ ตามมาตรฐาน)
          
          ลำดับการใช้ที่แนะนำ:
          - ตอนเช้า: Foam -> Cream -> Sun Block
          - ตอนกลางคืน: Foam -> Serum -> Cream
          
          ภารกิจ: เป็นทั้งลมใต้ปีกและคลังสมองให้คุณพี่ เพื่อให้ "ทำการตลาดและปิดการขายได้อย่างมืออาชีพและถูกต้องที่สุด" 🚀💎`;

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
