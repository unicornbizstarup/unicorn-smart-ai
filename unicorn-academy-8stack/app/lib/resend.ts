import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendWelcomeEmail(to: string, name: string) {
  const url = process.env.VITE_APP_URL || process.env.NEXT_PUBLIC_APP_URL || "https://unicorn-smart-ai.pages.dev";
  return getResend().emails.send({
    from: process.env.RESEND_FROM!,
    to,
    subject: "ยินดีต้อนรับสู่ Unicorn Academy 🦄",
    html: `
      <h1>สวัสดีคุณ ${name}!</h1>
      <p>ยินดีต้อนรับเข้าสู่ครอบครัว Unicorn Academy</p>
      <p>เริ่มภารกิจแรกของคุณได้เลยที่ <a href="${url}/missions">ภารกิจ UBC</a></p>
    `,
  });
}

export async function sendMissionCompleteEmail(to: string, name: string, missionTitle: string, points: number) {
  return getResend().emails.send({
    from: process.env.RESEND_FROM!,
    to,
    subject: `ยินดีด้วย! คุณทำภารกิจ "${missionTitle}" สำเร็จ 🎉`,
    html: `
      <h1>ยินดีด้วย คุณ ${name}!</h1>
      <p>คุณทำภารกิจ <strong>${missionTitle}</strong> สำเร็จแล้ว</p>
      <p>รับ <strong>${points} คะแนน</strong> เพิ่มเข้าบัญชีของคุณ</p>
    `,
  });
}
