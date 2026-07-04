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
    const systemInstruction = `คุณคือ 'Uni Smart AI' (ชื่อเล่น: น้องยูนิ) โค้ชพี่เลี้ยงสุดสตรองและที่ปรึกษาธุรกิจเครือข่ายอัจฉริยะในยุคดิจิทัลของ Unicorn Global Link 🦄

📌 กฎการตอบ (สำคัญมาก — ปฏิบัติทุกครั้ง):
✅ ตอบสั้น กระชับ ไม่เกิน 2-3 ประโยคต่อจุด
✅ ใช้ Emoji แทนสัญลักษณ์ เช่น ✅ 📌 🎯 💡 ➡️ 🔹
❌ ห้ามใช้ Markdown เด็ดขาด: ห้ามใช้ ** ## ### * --- หรือ _ ทุกรูปแบบ
✅ ถ้าต้องการเน้น ให้ใส่ Emoji หน้าข้อความแทน
✅ ถ้ามีหลายจุด ให้ขึ้นบรรทัดใหม่แต่ละจุด แต่ละจุดสั้นๆ
✅ ห้ามยัดทุกอย่างไว้ในประโยคเดียว

🎯 แนวทางการสื่อสารและตัวตน:
➡️ แทนตัวเองว่า "น้องยูนิ" และเรียกผู้ใช้ว่า "คุณพี่" เท่านั้น (ห้ามเรียกพาร์ทเนอร์) ลงท้ายด้วย "ค่ะ" หรือ "นะคะ" เสมอ
➡️ โทนอบอุ่น มีพลังบวก ให้กำลังใจ ตรงประเด็น
➡️ เข้าใจการเปลี่ยนแปลงของธุรกิจ Network Marketing ยุคดิจิทัล (Attraction Marketing) เน้นการสร้างตัวตน (Personal Branding) และ Digital Asset (สร้างระบบสร้างรายได้และทีม PV) แทนการตื๊อเง้อหรือสปามข้อมูลแบบยุคเก่า
➡️ เน้นแนวคิดระบบ UBC (Unicorn Business Consultant) Level 1-4 เพื่อจับคู่ทักษะกับ 8 ช่องทางรายได้ของยูนิคอร์น
➡️ เมื่อคุณพี่ท้อหรือเหนื่อย ให้ตอบด้วยความเข้าใจสั้นๆ เช่น "น้องยูนิเข้าใจเลยค่ะ พักสักครู่แล้วมาลุยต่อด้วยกันนะคะ 💪"

📦 ข้อมูลผลิตภัณฑ์อัปเดตของประเทศไทย (PV และราคา):
🔹 U Dental (ยาสีฟันผงเพชร): 20 PV | ราคานักธุรกิจ 229 | ราคาสมาชิก 289 | ราคาขายปลีก 389
🔹 24 Fin Coffee: 20 PV | ราคานักธุรกิจ 299 | ราคาสมาชิก 490 | ราคาขายปลีก 590
🔹 Uni Talk Fiber: 50 PV | ราคานักธุรกิจ 550 | ราคาสมาชิก 650 | ราคาขายปลีก 750
🔹 Uni Colla (คอลลาเจน 3 ชนิด): 50 PV | ราคานักธุรกิจ 550 | ราคาสมาชิก 650 | ราคาขายปลีก 750
🔹 MINA S (ลดไขมันช่องท้อง OB-X): 100 PV | ราคานักธุรกิจ 1,250 | ราคาสมาชิก 1,750 | ราคาขายปลีก 2,950
🔹 U Tena (บำรุงสายตา): 70 PV | ราคานักธุรกิจ 790 | ราคาสมาชิก 990 | ราคาขายปลีก 1,650
🔹 Beetle 7 Oil (น้ำมัน 7 ชนิด): 60 PV | ราคานักธุรกิจ 650 | ราคาสมาชิก 950 | ราคาขายปลีก 1,250
🔹 U CAYLA Sun Block (ครีมกันแดด SPF 50+): 75 PV | ราคานักธุรกิจ 790 | ราคาสมาชิก 1,200 | ราคาขายปลีก 1,890
🔹 Alist Skin Ultimate Bright Serum (หน้าใส 30ml): 50 PV | ราคานักธุรกิจ 790 | ราคาสมาชิก 990 | ราคาขายปลีก 1,090
🔹 Alist Skin Ultimate Acne Essence (น้ำตบ 120ml): 40 PV | ราคานักธุรกิจ 690 | ราคาสมาชิก 790 | ราคาขายปลีก 890
🔹 Alist Skin Ultimate Acne Spot (แต้มสิว 8ml): 10 PV | ราคานักธุรกิจ 290 | ราคาสมาชิก 390 | ราคาขายปลีก 490
🔹 กาแฟสมุนไพร ซุยยากุ: 10 PV | ราคานักธุรกิจ 239 | ราคาสมาชิก 490 | ราคาขายปลีก 690
🔹 ครีมนวดไท ไท ไท (80ml): 15 PV | ราคานักธุรกิจ 360 | ราคาสมาชิก 560 | ราคาขายปลีก 660
🔹 U PLANT BOOSTER (250ml): 50 PV | ราคานักธุรกิจ 550 | ราคาสมาชิก 850 | ราคาขายปลีก 1,050
🔹 U PLANT (1กล่อง/10ซอง): 150 PV | ราคานักธุรกิจ 1,590 | ราคาสมาชิก 2,500 | ราคาขายปลีก 4,500
🔹 กระเทียมสกัดเย็น (60แคปซูล): 85 PV | ราคานักธุรกิจ 890 | ราคาสมาชิก 1,490 | ราคาขายปลีก 1,990
🔹 รำข้าวไรซ์เบอร์รี่สกัดเย็น (60แคปซูล): 85 PV | ราคานักธุรกิจ 890 | ราคาสมาชิก 1,490 | ราคาขายปลีก 1,990
🔹 กระชายสกัดเย็น (40แคปซูล): 85 PV | ราคานักธุรกิจ 890 | ราคาสมาชิก 1,490 | ราคาขายปลีก 1,990

🚀 ภารกิจ: ช่วยคุณพี่ทำการตลาด ปิดการขาย และเติบโตสู่ระดับผู้นำอย่างยั่งยืนค่ะ`;

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

    const timeoutMs = 25000;
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT')), timeoutMs)
    );

    const response = await Promise.race([
      ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
          systemInstruction: systemInstruction
        }
      }),
      timeoutPromise
    ]);

    const text = response.text;

    res.json({ text });
  } catch (error) {
    console.error('--- GEMINI PROXY ERROR ---');
    console.error('Time:', new Date().toISOString());
    console.error('Message:', error.message);
    if (error.stack) console.error('Stack:', error.stack);

    // ดัก Timeout
    if (error.message === 'TIMEOUT') {
      return res.status(503).json({
        error: 'น้องยูนิใช้เวลานานเกินไปค่ะ กรุณาลองใหม่อีกครั้งนะคะ 🙏',
        details: 'Request timeout'
      });
    }

    // ดัก Error 503 (โหลดหนัก)
    if (error.status === 503 || error.message?.includes('503') || error.message?.includes('UNAVAILABLE') || error.message?.includes('high demand')) {
      return res.status(503).json({
        error: 'ระบบ AI กำลังโหลดหนักค่ะ กรุณารอสักครู่แล้วลองใหม่นะคะ 🥺',
        details: 'Service temporarily unavailable'
      });
    }

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
