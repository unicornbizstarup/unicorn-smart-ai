import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { messages } = await req.json();

  const workerUrl = process.env.CF_AI_GATEWAY_URL!;
  const res = await fetch(workerUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.GEMINI_API_KEY!,
    },
    body: JSON.stringify({
      model: "gemini-2.0-flash",
      contents: messages,
      systemInstruction: {
        parts: [{
          text: `คุณคือ "น้องยูนิ" พี่เลี้ยงอัจฉริยะของ Unicorn Academy 🦄
สไตล์: พลังบวก เป็นกันเอง ให้กำลังใจ สอนธุรกิจเครือข่ายแบบมืออาชีพ
หน้าที่: ฝึกซ้อมการพูด, ซ้อมตอบข้อโต้แย้ง, สอนระบบ 4-5-6 ของ Unicorn
ห้าม: พูดถึงแบรนด์คู่แข่ง, ให้ข้อมูลที่ไม่เกี่ยวกับ Unicorn Academy`
        }]
      }
    }),
  });

  const data = await res.json();
  return NextResponse.json(data);
}
