import { NextRequest, NextResponse } from "next/server";
import { sendLineNotify } from "@/lib/line-notify";


export async function POST(req: NextRequest) {
  const { type, payload } = await req.json();

  if (type === "new_member") {
    await sendLineNotify(`\n🦄 สมาชิกใหม่: ${payload.name}\n🔗 แนะนำโดย: ${payload.referredBy ?? "-"}`);
  } else if (type === "mission_complete") {
    await sendLineNotify(`\n🏆 ${payload.name} ทำภารกิจสำเร็จ: ${payload.missionTitle} (+${payload.points}pts)`);
  } else if (type === "report_issue") {
    await sendLineNotify(`\n🚨 แจ้งปัญหาระบบ!\n👤 พาร์ทเนอร์: ${payload.name || "ทั่วไป"}\n📞 ติดต่อกลับ: ${payload.contact || "-"}\n💬 ปัญหา: ${payload.description}`);
  }

  return NextResponse.json({ ok: true });
}
