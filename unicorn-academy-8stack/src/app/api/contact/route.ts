import { NextRequest, NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/resend";
import { sendLineNotify } from "@/lib/line-notify";


export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();

  await Promise.all([
    sendWelcomeEmail(email, name),
    sendLineNotify(`\n📩 ติดต่อใหม่\n👤 ${name}\n📧 ${email}\n💬 ${message}`),
  ]);

  return NextResponse.json({ ok: true });
}
