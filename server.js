import express from 'express';
import { GoogleGenAI } from '@google/genai';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

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
    const ai = new GoogleGenAI({ apiKey });

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
             - กลุ่ม 2 Personal Care: 'U Dental' (50 PV) - ยาสีฟันผสมผงเพชร (Design by Specialist)
                * กลไก: ระบบ 6 กลไก (ลดกลิ่นปาก/คราบ/แบคทีเรีย/เสียวฟัน/ฟันสะอาด/เหงือกแข็งแรง)
                * ส่วนประกอบ: Diamond Powder (ขัดฟันเงา), Potassium Nitrate (ลดเสียวฟันเห็นผลใน 2 สัปดาห์), Guava Leaf, Organic Green Tea, Hyaluronic Acid
             - กลุ่ม 3 Health Care: 
                * GLUCONA (Deeze Shot) - นวัตกรรม FIR (Far Infrared) เพิ่มการดูดซึม, มะระขี้นก (อินซูลินธรรมชาติ) บำรุงตับอ่อน ลดภาวะดื้ออินซูลิน
                * CHOLLESSNA (Deeze Shot) - ดูแลหลอดเลือด/หัวใจ, ลด LDL/ไตรกลีเซอไรด์, เพิ่ม Nitric Oxide ให้หลอดเลือดยืดหยุ่น
                * IMUNA (Deeze Shot) - ฟื้นฟูภูมิคุ้มกันเชิงลึก (Immune Restoration), กระชายขาว & เบต้ากลูแคน
                * MINA S (นวัตกรรมเกาหลี) - สารสกัด OB-X (เลม่อนบาล์ม/หม่อน/โกฐจุฬาลัมพา) **ลดไขมันช่องท้องได้ 20% ใน 12 สัปดาห์** (มีวิจัย RCT), ปลอดภัยต่อตับ/ลดไขมันพอกตับ
                * BEETLE 7 OIL - น้ำมัน 7 ชนิด บำรุง 3 ระบบ (ต้านอักเสบ/คุมไขมัน/ภูมิคุ้มกัน), ผสมผักคาวตองลดไซโตไกน์
                * UNI TALK FIBER - นวัตกรรม Synbiotic (Bacillus coagulans) ลำไส้แฮปปี้ ผิวใสจากภายใน
                * UNI COLLA - คอลลาเจน 3 ชนิด (Tri/Di/Type II) บำรุงทั้งผิวและข้อต่อ
                * U TENA - ดูแลดวงตา ปกป้องจากแสงหน้าจอ แสงแดด และอนุมูลอิสระ ลดความเสี่ยงต้อกระจก
                * กระชายสกัดเย็น - นวัตกรรมสกัดเย็น 100% เทคโนโลยี Cold Extraction บำรุงหัวใจ ลดการอักเสบระดับเซลล์
                * น้ำมันกระเทียมสกัดเย็น - เทคโนโลยี Cold Press ลดคอเลสเตอรอล เสริมภูมิคุ้มกัน บรรเทาหวัด
                * น้ำมันมะกรูดสกัดเย็น - ลดไขมันในเลือด บำรุงหัวใจ สมอง และฟื้นฟูปลายประสาท
                * น้ำมันจมูกข้าวไรซ์เบอร์รี่ - สกัดเย็น มี γ-Oryzanol ลดไขมันเลว เพิ่มไขมันดี ต้านอนุมูลอิสระสูงกว่ารำข้าวทั่วไป
             - กลุ่ม 4 Agriculture: 'U PLANT' & 'BOOSTER' - นวัตกรรม Warp Chelation (Super Ion) ดูดซึมทันที
             ... (และกลุ่มอื่นๆ)

          ลำดับการใช้ที่แนะนำ:
          - ตอนเช้า: Foam -> Cream -> Sun Block
          - ตอนกลางคืน: Foam -> Serum -> Cream
          
          ภารกิจ: เป็นทั้งลมใต้ปีกและคลังสมองให้คุณพี่ เพื่อให้ "ทำการตลาดและปิดการขายได้อย่างมืออาชีพและถูกต้องที่สุด" 🚀💎`;

    // 1. Transform messages to Gemini history format (excluding the last message)
    // CRITICAL: Gemini requires the history to START with a 'user' message.
    let history = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Find the index of the first 'user' message and skip everything before it
    const firstUserIndex = history.findIndex(h => h.role === 'user');
    if (firstUserIndex !== -1) {
      history = history.slice(firstUserIndex);
    } else {
      history = []; // If no user message found in history, send empty history
    }

    const lastMessage = messages[messages.length - 1].text;

    // Build contents array: system instruction + history + last message
    const contents = [
      ...history,
      { role: 'user', parts: [{ text: lastMessage }] }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction
      }
    });

    const text = response.text;

    res.json({ text });
  } catch (error) {
    console.error('--- GEMINI PROXY ERROR ---');
    console.error('Time:', new Date().toISOString());
    console.error('Message:', error.message);
    if (error.stack) console.error('Stack:', error.stack);

    // ดัก Error 429 (โควต้าเต็ม / Rate limit)
    if (error.status === 429 || error.status === 'RESOURCE_EXHAUSTED' || error.message?.includes('429') || error.message?.includes('Quota exceeded')) {
      return res.status(429).json({
        error: 'โควต้าการใช้งานผู้ช่วย AI เต็มชั่วคราวค่ะ น้องยูนิต้องขออภัยด้วยนะคะ กรุณาลองใหม่อีกครั้งในภายหลังค่ะ 🥺',
        details: 'Rate Limit Exceeded or Quota Reached'
      });
    }

    res.status(500).json({
      error: 'Failed to communicate with AI Coach',
      details: error.message
    });
  }
});

// Health check & DB connection test
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Uni Smart AI Backend is running'
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
