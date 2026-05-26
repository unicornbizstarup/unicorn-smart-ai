import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { searchKnowledge, buildRagContext } from "@/lib/rag";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { messages } = await req.json();
    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    // 1. Fetch user's profile to customize the coaching based on Wealth DNA & UBC Level
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, ubc_level, wealth_element")
      .eq("id", user.id)
      .single();

    const name = profile?.full_name || "พาร์ทเนอร์";
    const ubcLevel = profile?.ubc_level || 1;
    const element = profile?.wealth_element || "FIRE";

    // 2. Perform pgvector RAG Search using the last user message
    const lastMsg = messages[messages.length - 1];
    const query = lastMsg.parts?.[0]?.text || lastMsg.content || "";
    
    let ragContext = "";
    try {
      const searchResults = await searchKnowledge(query, 5, 0.60);
      ragContext = buildRagContext(searchResults);
    } catch (ragErr) {
      console.error("RAG search error:", ragErr);
      // Fallback to empty context if vector search fails
    }

    // 3. Build personalized and expert system instruction
    const systemPrompt = `คุณคือ "น้องยูนิ" พี่เลี้ยงและที่ปรึกษาธุรกิจเครือข่ายอัจฉริยะของ Unicorn Academy 🦄
ผู้ใช้ที่คุยกับคุณคือคุณ: "${name}" มีระดับความเชี่ยวชาญ: UBC Level ${ubcLevel} และมีธาตุทางธุรกิจ (Wealth DNA): ${element}

แนวทางและบุคลิกในการโค้ช:
1. เป็นเพื่อนและที่ปรึกษาธุรกิจเชิงบวก (Co-Builder Partner) ร่วมเดินทางสร้างผลลัพธ์ เติบโตและสำเร็จไปพร้อมกัน
2. ใช้หลักการของระบบ 4-5-6 ของ Unicorn และแนวคิดของ ubc_mission_blueprint เพื่อนำทางสมาชิก
3. ใช้การวิเคราะห์เชิงลึก น้ำเสียงเป็นมิตร อบอุ่น สุภาพ แต่มีความเฉียบคมทางธุรกิจสูง
4. ดึงความโดดเด่นของธาตุทางธุรกิจ Wealth DNA ของเขา (${element}) มาเสริมพลังใจและการสร้างตัวตน:
   - FIRE (ธาตุไฟ): ความตื่นเต้น พลังขับเคลื่อน ผู้นำที่ส่งต่อวิสัยทัศน์ และการสร้างแรงบันดาลใจอันทรงพลัง
   - WATER (ธาตุน้ำ): ความยืดหยุ่น การเชื่อมสัมพันธ์อันอบอุ่นลึกซึ้ง ความเห็นอกเห็นใจ และการเอาใส่ใจพาร์ทเนอร์
   - EARTH (ธาตุดิน): ความมั่นคง ระบบระเบียบ ความเป็นมืออาชีพที่น่าเชื่อถือ และความรอบคอบแม่นยำ
   - AIR (ธาตุลม): ความคิดสร้างสรรค์ นวัตกรรม ความรวดเร็ว การใช้สื่อโซเชียลมีเดียและเทคโนโลยีสร้างเครือข่าย

สิ่งที่ต้องมอบให้สมาชิกในทุกคำตอบอย่างสร้างสรรค์:
- ไกด์แนวทางการสื่อสารและให้ "ตัวอย่างคำพูดจริง" (Scripts/Dialogues/Copywriting) ที่สามารถคัดลอก (Copy-Paste) ไปปรับใช้ได้ทันที ไม่ว่าจะเป็นสคริปต์การโทรนัดหมาย การตอบข้อโต้แย้งในสถานการณ์ต่างๆ หรือคำปิดการขายแบบเน้นคุณค่า
- หากหัวข้อสนทนาเกี่ยวข้องกับการสร้างสื่อโปรโมท สไลด์แนะนำตัว หรือรูปภาพอินโฟกราฟิกเพื่อใช้ในทีม ให้เขียนระบุ "ชุดคำสั่ง Prompt อัจฉริยะ" (ภาษาอังกฤษที่ลุ่มลึกและสวยงาม) สำหรับนำไปวางใน ChatGPT/Gemini/Claude (สำหรับการวาดผัง/เจนโครงสร้าง) หรือ Midjourney/DALL-E (สำหรับการวาดภาพ) เพื่อให้เขานำไปใช้สร้างผลงานต่อได้ทันทีเหมือนระบบ https://diprom-flow-kyxg.vercel.app/

${ragContext}`;

    // 4. Format messages for Workers Proxy Chat Endpoint
    const history = messages.slice(0, messages.length - 1).map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      content: m.parts?.[0]?.text || m.content || ""
    }));

    const message = lastMsg.parts?.[0]?.text || lastMsg.content || "";

    // 5. Call Cloudflare Workers Proxy
    const workersUrl = process.env.WORKERS_URL!;
    const res = await fetch(`${workersUrl}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemPrompt,
        history,
        message,
      }),
    });

    if (!res.ok) {
      throw new Error(`Workers proxy failed with status ${res.status}`);
    }

    const { reply } = await res.json() as { reply: string };

    // 6. Return Gemini-compatible candidate format expected by the frontend
    return NextResponse.json({
      candidates: [
        {
          content: {
            parts: [{ text: reply }]
          }
        }
      ]
    });

  } catch (err: any) {
    console.error("ai-coach route error:", err);
    return NextResponse.json({
      candidates: [
        {
          content: {
            parts: [{
              text: `ขออภัยค่ะพาร์ทเนอร์ น้องยูนิมึนงงชั่วคราวเนื่องจาก: ${err.message || "การเชื่อมต่อระบบล้มเหลว"} กรุณาลองส่งคำถามใหม่อีกครั้งนะคะ 🥺`
            }]
          }
        }
      ]
    });
  }
}
