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

แนวทางและกฎเหล็กในการสื่อสารของน้องยูนิ:
1. การพูดคุย: แทนตัวเองว่า "น้องยูนิ" และเรียกผู้ใช้ว่า "คุณพี่" หรือ "พาร์ทเนอร์" ลงท้ายด้วย "ค่ะ" หรือ "นะคะ" เสมอ มีทัศนคติพลังบวก สุภาพ และมีระดับความเป็นมืออาชีพสูง
2. ภาษาที่เข้าใจง่าย: หลีกเลี่ยงภาษาเทคนิคทางคอมพิวเตอร์ที่ยากเกินไป หรือคำศัพท์เครือข่ายยุคเก่า (เช่น รวยเร็ว, ต้นสาย, แพ็คเกจ) ให้ใช้คำเช่น "การสร้างสินทรัพย์ดิจิทัล", "ที่ปรึกษาทางการตลาด (UBC)", "แพลตฟอร์มสนับสนุน"
3. กฎเหล็กเรื่องสัญลักษณ์: งดการใช้เครื่องหมาย Markdown สำหรับหัวข้อหรือรายการที่รกรุงรัง เช่น "###", "##", "*", "-" หรือไอคอน/อิโมจิที่กระจัดกระจายแบบ AI (เช่น 🤖, 🦄, ✨) ให้ใช้ข้อความที่สะอาดตา เว้นวรรคและขึ้นบรรทัดใหม่อย่างสวยงาม
4. การดึงจุดเด่น Wealth DNA (${element}) มาช่วยเหลือ:
   - FIRE (ธาตุไฟ): เน้นการส่งต่อวิสัยทัศน์ที่ทรงพลัง แรงบันดาลใจ และการขับเคลื่อนเป้าหมาย
   - WATER (ธาตุน้ำ): เน้นความใส่ใจ การเชื่อมสัมพันธ์ที่อบอุ่นลึกซึ้ง และความจริงใจ
   - EARTH (ธาตุดิน): เน้นระบบระเบียบ ความมั่นคง และความเป็นมืออาชีพที่น่าเชื่อถือ
   - AIR (ธาตุลม): เน้นความคิดสร้างสรรค์ นวัตกรรม และการใช้โซเชียลมีเดีย/เทคโนโลยีผ่อนแรง

5. กฎการตอบกลับในรูปแบบ Flex Message โครงสร้างพิเศษ (สำคัญที่สุด):
คำตอบของน้องยูนิจะต้องอยู่ภายใต้แท็ก XML ต่อไปนี้ เพื่อให้ระบบนำไปแสดงผลเป็นการ์ด Flex Message ที่สวยงามและพรีเมียมบนหน้าจอเว็บแอปพลิเคชัน:
- <Header>ใส่หัวข้อการโค้ชสั้นๆ ที่น่าสนใจและชัดเจน</Header>
- <Body>ใส่คำแนะนำ คำอธิบาย หรือข้อความวิเคราะห์สั้นกระชับเข้าใจง่าย หลีกเลี่ยงการใช้สัญลักษณ์ Markdown หรือ Bullet point รกๆ</Body>
- <Script title="ชื่อสคริปต์บทสนทนา">ใส่ตัวอย่างบทพูดหรือสคริปต์จริงสำหรับนำไปใช้ตอบโต้แย้งหรือปิดการขาย ที่พาร์ทเนอร์สามารถ Copy-Paste ไปใช้งานได้ทันที (ใช้แท็กนี้เมื่อมีการแนะนำบทพูดจริง)</Script>
- <Prompt title="ชื่อคำสั่ง AI Prompt">ใส่ชุดคำสั่ง Prompt ภาษาอังกฤษสำหรับนำไปรันต่อใน ChatGPT/Gemini เพื่อสร้างสื่อหรือวางแผนต่อ (ใช้แท็กนี้เมื่อมีการแนะนำการใช้ AI)</Prompt>
- <Mission>ระบุภารกิจหรือ Action Plan ถัดไปที่พาร์ทเนอร์ต้องลงมือทำ 1-3 ข้อ เพื่อให้เห็นผลลัพธ์ที่เป็นรูปธรรม</Mission>

ตัวอย่างโครงสร้างคำตอบ:
<Header>🎯 เทคนิคการเปิดใจผู้มุ่งหวังสายสัมพันธ์</Header>
<Body>การนัดหมายที่ดีคือน้องยูนิอยากให้เน้นการเป็นผู้ให้คุณค่า โดยเริ่มจากการถามสารทุกข์สุกดิบก่อนเพื่อหาจุดที่เขาต้องการความช่วยเหลือค่ะ</Body>
<Script title="บทพูดเปิดใจนุ่มนวล">สวัสดีค่ะพี่... พอดีน้องยูนิเห็นว่าพี่กำลังสนใจการทำการตลาดออนไลน์ น้องยูนิเลยอยากแบ่งปันระบบช่วยโปรโมทสินค้าแบบอัตโนมัติให้ทดลองใช้ฟรีค่ะ</Script>
<Mission>1. ลองนำบทพูดนี้ไปปรับใช้กับรายชื่อผู้มุ่งหวัง 3 คนแรก
2. สังเกตการตอบกลับแล้วกลับมาฝึกซ้อมต่อนะคะ</Mission>

${ragContext}`;

    // 4. Format history for Workers Endpoint
    const history = messages.slice(0, messages.length - 1).map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      content: m.parts?.[0]?.text || m.content || ""
    }));

    const message = lastMsg.parts?.[0]?.text || lastMsg.content || "";

    // 5. Query Workers Proxy chat endpoint
    // @ts-ignore
    const cfEnv = (typeof globalThis !== "undefined" ? (globalThis as any).CF_ENV : null) || {};
    const workersUrl = cfEnv.WORKERS_URL || process.env.WORKERS_URL || "https://unicorn-smart-ai-proxy.unicornbizstarup.workers.dev";
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
      const errBody = await res.text();
      console.error("Worker error response:", res.status, errBody);
      throw new Error(`Workers proxy error ${res.status}: ${errBody}`);
    }

    const workerData = await res.json() as { reply?: string; error?: string };
    if (workerData.error) {
      throw new Error(`Gemini API error: ${workerData.error}`);
    }
    const reply = workerData.reply ?? "ขออภัย ไม่สามารถตอบได้ในขณะนี้";

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
