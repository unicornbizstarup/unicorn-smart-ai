import { sendWelcomeEmail } from "@/lib/resend";
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
    const { name, email, message } = await request.json();

    await Promise.all([
      sendWelcomeEmail(email, name).catch(err => console.error("Send welcome email failed:", err)),
      sendLineNotify(`\n📩 ติดต่อใหม่\n👤 ${name}\n📧 ${email}\n💬 ${message}`).catch(err => console.error("Send line notify failed:", err)),
    ]);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err: any) {
    console.error("api/contact error:", err);
    return new Response(JSON.stringify({ error: err.message || "เกิดข้อผิดพลาดในการบันทึกและแจ้งเตือนติดต่อกลับ" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
