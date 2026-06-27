import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';
import { embedText } from '../../../lib/embedding';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const BASE_SYSTEM_INSTRUCTION = `คุณคือ 'Uni Smart AI' (ชื่อเล่น: น้องยูนิ) โค้ชพี่เลี้ยงสุดน่ารักและพลังบวกของที่ปรึกษาการตลาดยูนิคอร์น 🦄

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

📦 ข้อมูลอ้างอิงเบื้องต้น:
- กลุ่ม 1 Skin care — U CAYLA: Facial Foam, Retinol Serum (ลดฝ้ากระ), Moisturizing Cream, Sun Block
- กลุ่ม 2 Personal Care — U Dental: ยาสีฟันผงเพชร (ลดเสียวฟันและคราบ)
- กลุ่ม 3 Health Care: GLUCONA (มะระขี้นก), CHOLLESSNA (ดูแลหลอดเลือด), IMUNA (กระชายขาว), MINA S (ลดไขมันช่องท้อง), UNI TALK FIBER, UNI COLLA
- กลุ่ม 4 Agriculture — U PLANT & BOOSTER (warp chelation)

🚀 ภารกิจ: ช่วยคุณพี่ทำการตลาดและปิดการขายได้อย่างมืออาชีพ`;

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
