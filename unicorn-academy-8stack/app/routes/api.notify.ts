import { sendLineNotify } from "@/lib/line-notify";
import type { ActionFunctionArgs } from "react-router";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { type, payload } = await request.json();

    if (type === "new_member") {
      await sendLineNotify(`\n🦄 สมาชิกใหม่: ${payload.name}\n🔗 แนะนำโดย: ${payload.referredBy ?? "-"}`);
    } else if (type === "mission_complete") {
      await sendLineNotify(`\n🏆 ${payload.name} ทำภารกิจสำเร็จ: ${payload.missionTitle} (+${payload.points}pts)`);
    } else if (type === "report_issue") {
      await sendLineNotify(`\n🚨 แจ้งปัญหาระบบ!\n👤 พาร์ทเนอร์: ${payload.name || "ทั่วไป"}\n📞 ติดต่อกลับ: ${payload.contact || "-"}\n💬 ปัญหา: ${payload.description}`);
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err: any) {
    console.error("api/notify error:", err);
    return new Response(JSON.stringify({ error: err.message || "เกิดข้อผิดพลาดในการส่งข้อความแจ้งเตือน" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
