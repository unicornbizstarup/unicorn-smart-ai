import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';
import { embedText } from '../../../lib/embedding';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const BASE_SYSTEM_INSTRUCTION = `คุณคือ 'Uni Smart AI' (ชื่อเล่น: น้องยูนิ) โค้ชพี่เลี้ยงสุดสตรองและที่ปรึกษาธุรกิจเครือข่ายอัจฉริยะในยุคดิจิทัลของ Unicorn Global Link 🦄

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

export async function POST(request: NextRequest) {
  try {
    const { messages, category } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages history is required' }, { status: 400 });
    }

    const lastUserMessage = messages[messages.length - 1];
    if (!lastUserMessage || !lastUserMessage.content) {
      return NextResponse.json({ error: 'Last user message cannot be empty' }, { status: 400 });
    }

    const userQuery = lastUserMessage.content;

    // 1. Search Knowledge Base (RAG)
    let ragContext = '';
    try {
      const embedding = await embedText(userQuery);
      
      const candidateLimit = category && category !== 'all' ? 15 : 5;
      const { data: searchResults } = await supabase.rpc('search_knowledge', {
        query_embedding: embedding,
        match_count: candidateLimit,
        min_score: 0.65 // Score threshold for similarity
      });

      let finalResults = searchResults || [];
      if (category && category !== 'all') {
        finalResults = finalResults.filter((r: any) => {
          const docCategory = r.metadata?.category || 'general';
          return docCategory === category;
        });
      }
      
      const topResults = finalResults.slice(0, 5);

      if (topResults.length > 0) {
        const referenceText = topResults
          .map((r: any, i: number) => `[อ้างอิง ${i + 1}] ${r.content}`)
          .join('\n\n');
        
        ragContext = `\n\n📌 ข้อมูลอ้างอิงจากคลังความรู้ที่เกี่ยวข้อง (กรุณาตอบคำถามโดยยึดตามข้อมูลนี้เป็นสำคัญ):
${referenceText}
---
*หมายเหตุ: หากคุณพี่ถามนอกเหนือจากหัวข้อในคลังความรู้ หรือไม่มีในอ้างอิง ให้ตอบอย่างมีอัธยาศัยและแนะนำด้วยความจริงใจได้เลยค่ะ*`;
      }
    } catch (searchErr) {
      console.error('RAG Search failed, fallback to direct chat:', searchErr);
    }

    // 2. Initialize Gemini API
    const apiKey = process.env.GEMINI_API_KEY || process.env.GERMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key is not configured' }, { status: 500 });
    }
    const ai = new GoogleGenAI({ apiKey });

    // 3. Format History & Build Contents
    // Gemini history requires alternate role patterns ('user' vs 'model') starting with 'user'
    let history = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'user' || msg.role === 'client' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const firstUserIndex = history.findIndex(h => h.role === 'user');
    if (firstUserIndex !== -1) {
      history = history.slice(firstUserIndex);
    } else {
      history = [];
    }

    // Append RAG context instructions to the base system prompt
    const systemInstruction = BASE_SYSTEM_INSTRUCTION + ragContext;

    const contents = [
      ...history,
      { role: 'user', parts: [{ text: userQuery }] }
    ];

    // 4. Generate Content
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const responseText = response.text || 'น้องยูนิไม่เข้าใจคำถามเลยค่ะ รบกวนถามอีกครั้งนะคะ 🥺';

    return NextResponse.json({
      success: true,
      response: responseText
    });
  } catch (err: any) {
    console.error('AI Chat Route Error:', err);
    return NextResponse.json({
      error: err?.message || 'Internal server error during chat'
    }, { status: 500 });
  }
}
