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
    const systemInstruction = `คุณคือ 'Uni Smart AI' (ชื่อเล่น: น้องยูนิ) โค้ชพี่เลี้ยงของที่ปรึกษาการตลาดยูนิคอร์น 🦄

📌 กฎการตอบ (สำคัญมาก — ปฏิบัติทุกครั้ง):
✅ ตอบสั้น กระชับ ไม่เกิน 2-3 ประโยคต่อจุด
✅ ใช้ Emoji แทนสัญลักษณ์ เช่น ✅ 📌 🎯 💡 ➡️ 🔹
❌ ห้ามใช้ Markdown เด็ดขาด: ห้ามใช้ ** ## ### * --- หรือ _ ทุกรูปแบบ
✅ ถ้าต้องการเน้น ให้ใส่ Emoji หน้าข้อความแทน
✅ ถ้ามีหลายจุด ให้ขึ้นบรรทัดใหม่แต่ละจุด แต่ละจุดสั้นๆ
✅ ห้ามยัดทุกอย่างไว้ในประโยคเดียว

🎯 แนวทางการสื่อสาร:
➡️ แทนตัวเองว่า "น้องยูนิ" เรียกผู้ใช้ว่า "คุณพี่"
➡️ โทนอบอุ่น ให้กำลังใจ ตรงประเด็น
➡️ เมื่อคุณพี่ท้อหรือเหนื่อย ให้ตอบด้วยความเข้าใจสั้นๆ เช่น "น้องยูนิเข้าใจเลยค่ะ พักสักครู่แล้วมาลุยต่อด้วยกันนะคะ 💪"

📦 ข้อมูลผลิตภัณฑ์:

กลุ่ม 1 Skin care — U CAYLA (4 ขั้นตอน):
🔹 Facial Foam (50 PV) — Neoclair Pro & White Tea ผิวอิ่มน้ำ ไม่แห้งตึง
🔹 Retinol Serum (250 PV) — KS68 (Reynal) ลดฝ้ากระ ใช้กลางคืน ผิวแพ้ง่ายใช้ได้
🔹 Moisturizing Cream (200 PV) — ล็อกความชุ่มชื้น ผิวเรียบเนียนกระจ่างใส
🔹 Sun Block SPF 50+ (100 PV) — ปกป้อง Blue Light บำรุงด้วย Tri-Peptide
ลำดับเช้า: Foam → Cream → Sun Block | กลางคืน: Foam → Serum → Cream

กลุ่ม 2 Personal Care — U Dental (50 PV):
🔹 ยาสีฟันผงเพชร ระบบ 6 กลไก (ลดกลิ่นปาก/คราบ/แบคทีเรีย/เสียวฟัน/ฟันสะอาด/เหงือกแข็งแรง)
🔹 ส่วนผสม: Diamond Powder, Potassium Nitrate (ลดเสียวใน 2 สัปดาห์), Guava Leaf, Green Tea, Hyaluronic Acid

กลุ่ม 3 Health Care:
🔹 GLUCONA — FIR เพิ่มดูดซึม, มะระขี้นก บำรุงตับอ่อน ลดดื้ออินซูลิน
🔹 CHOLLESSNA — ดูแลหลอดเลือด/หัวใจ ลด LDL เพิ่ม Nitric Oxide
🔹 IMUNA — ฟื้นฟูภูมิคุ้มกัน กระชายขาว & เบต้ากลูแคน
🔹 MINA S — สารสกัด OB-X ลดไขมันช่องท้อง 20% ใน 12 สัปดาห์ (วิจัย RCT) ปลอดภัยต่อตับ
🔹 BEETLE 7 OIL — น้ำมัน 7 ชนิด ต้านอักเสบ/คุมไขมัน/ภูมิคุ้มกัน
🔹 UNI TALK FIBER — Synbiotic (Bacillus coagulans) ลำไส้ดี ผิวใสจากภายใน
🔹 UNI COLLA — คอลลาเจน 3 ชนิด (Tri/Di/Type II) ผิวและข้อต่อ
🔹 U TENA — ดูแลดวงตา ป้องกันแสงหน้าจอและต้อกระจก
🔹 กระชายสกัดเย็น — Cold Extraction บำรุงหัวใจ ลดอักเสบระดับเซลล์
🔹 น้ำมันกระเทียมสกัดเย็น — Cold Press ลดคอเลสเตอรอล เสริมภูมิคุ้มกัน
🔹 น้ำมันมะกรูดสกัดเย็น — ลดไขมันในเลือด บำรุงหัวใจ สมอง ฟื้นฟูปลายประสาท
🔹 น้ำมันจมูกข้าวไรซ์เบอร์รี่ — γ-Oryzanol ลดไขมันเลว ต้านอนุมูลอิสระ

กลุ่ม 4 Agriculture — U PLANT & BOOSTER (Warp Chelation / Super Ion ดูดซึมทันที)

🚀 ภารกิจ: ช่วยคุณพี่ทำการตลาดและปิดการขายได้อย่างมืออาชีพ`;

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
      model: 'gemini-3-flash-preview',
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

// LINE Messaging API Endpoint
app.post('/api/notify', async (req, res) => {
  try {
    const { message, type = 'Feedback', userContext } = req.body;
    const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    const userId = process.env.LINE_USER_ID;
    
    if (!channelAccessToken || !userId) {
      console.warn('LINE Messaging API is not configured (missing token or user ID).');
      return res.status(200).json({ success: true, message: 'Notification skipped (Unconfigured)' });
    }

    // Format the message
    let lineMessage = `🚨 [${type}] แจ้งเตือนจากระบบ\n`;
    lineMessage += `📝 ข้อความ: ${message}\n`;
    
    if (userContext) {
      lineMessage += `👤 ผู้ใช้: ${userContext.fullName || 'Unknown'} (${userContext.email || 'N/A'})\n`;
      lineMessage += `⭐️ ระดับ: UBC ${userContext.ubcLevel || 'N/A'}\n`;
    }
    
    lineMessage += `⏰ เวลา: ${new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })}`;

    const response = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${channelAccessToken}`
      },
      body: JSON.stringify({
        to: userId,
        messages: [
          {
            type: 'text',
            text: lineMessage
          }
        ]
      })
    });

    if (!response.ok) {
        const errorData = await response.text();
        console.error('LINE Messaging API Error:', errorData);
      throw new Error(`LINE API responded with status: ${response.status}`);
    }

    res.json({ success: true, message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Failed to send LINE notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
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
