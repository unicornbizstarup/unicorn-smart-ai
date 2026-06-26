import { createServerSupabase, requireUser } from "@/lib/supabase-server";
import { searchKnowledge, buildRagContext } from "@/lib/rag";
import type { ActionFunctionArgs } from "react-router";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const responseHeaders = new Headers();
    const { user, supabase } = await requireUser(request, responseHeaders);

    const { messages } = await request.json();
    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: "No messages provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 1. Fetch user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, ubc_level, wealth_element")
      .eq("id", user.id)
      .single();

    const name = profile?.full_name || "พาร์ทเนอร์";
    const ubcLevel = profile?.ubc_level || 1;
    const element = profile?.wealth_element || "FIRE";

    // 2. Vector similarity search (RAG)
    const lastMsg = messages[messages.length - 1];
    const query = lastMsg.parts?.[0]?.text || lastMsg.content || "";
    
    let ragContext = "";
    try {
      const searchResults = await searchKnowledge(query, 5, 0.60);
      ragContext = buildRagContext(searchResults);
    } catch (ragErr) {
      console.error("RAG search failed in API:", ragErr);
    }

    // 3. Build AI System Instruction
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
   - AIR (ธาตุลม): ความคิดสร้างสรรค์ นวัตกรรม ความรวดเร็ว การใช้สื่อโซเชีบลมีเดียและเทคโนโลยีสร้างเครือข่าย

สิ่งที่ต้องมอบให้สมาชิกในทุกคำตอบอย่างสร้างสรรค์:
- ไกด์แนวทางการสื่อสารและให้ "ตัวอย่างคำพูดจริง" (Scripts/Dialogues/Copywriting) ที่สามารถคัดลอก (Copy-Paste) ไปปรับใช้ได้ทันที ไม่ว่าจะเป็นสคริปต์การโทรนัดหมาย การตอบข้อโต้แย้งในสถานการณ์ต่างๆ หรือคำปิดการขายแบบเน้นคุณค่า
- หากหัวข้อสนทนาเกี่ยวข้องกับการสร้างสื่อโปรโมท สไลด์แนะนำตัว หรือรูปภาพอินโฟกราฟิกเพื่อใช้ในทีม ให้เขียนระบุ "ชุดคำสั่ง Prompt อัจฉริยะ" (ภาษาอังกฤษที่ลุ่มลึกและสวยงาม) สำหรับนำไปวางใน AI Tools เช่น ChatGPT/Gemini/Midjourney เพื่อให้เขานำไปใช้สร้างผลงานต่อได้ทันที

${ragContext}`;

    // 4. Format history for Workers Endpoint
    const history = messages.slice(0, messages.length - 1).map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      content: m.parts?.[0]?.text || m.content || ""
    }));

    const message = lastMsg.parts?.[0]?.text || lastMsg.content || "";

    // 5. Query Workers Proxy chat endpoint
    const workersUrl = process.env.WORKERS_URL || "https://workers-proxy.unicorn.workers.dev";
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
      throw new Error(`Workers proxy endpoint failed with status ${res.status}`);
    }

    const { reply } = await res.json() as { reply: string };

    return new Response(JSON.stringify({
      candidates: [
        {
          content: {
            parts: [{ text: reply }]
          }
        }
      ]
    }), {
      headers: { 
        "Content-Type": "application/json",
        ...Object.fromEntries(responseHeaders.entries())
      }
    });

  } catch (err: any) {
    console.error("api/ai-coach error:", err);
    return new Response(JSON.stringify({
      candidates: [
        {
          content: {
            parts: [{
              text: `ขออภัยค่ะพาร์ทเนอร์ น้องยูนิมึนงงชั่วคราวเนื่องจาก: ${err.message || "การเชื่อมต่อระบบล้มเหลว"} กรุณาลองส่งคำถามใหม่อีกครั้งนะคะ 🥺`
            }]
          }
        }
      ]
    }), {
      headers: { "Content-Type": "application/json" }
    });
  }
}
