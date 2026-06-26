const LINE_MESSAGING_API_URL = "https://api.line.me/v2/bot/message/push";

export async function sendLineNotify(message: string) {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const userId = process.env.LINE_USER_ID;
  if (!token || !userId) {
    console.warn("LINE Messaging API configurations are missing in environment.");
    return;
  }

  try {
    const res = await fetch(LINE_MESSAGING_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        to: userId,
        messages: [
          {
            type: "text",
            text: message,
          },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Failed to send LINE message:", errText);
    }
  } catch (err) {
    console.error("Error calling LINE Messaging API:", err);
  }
}

export async function notifyNewMember(name: string, referredBy?: string) {
  const msg = [
    "🦄 สมาชิกใหม่! Unicorn Academy",
    `👤 ชื่อ: ${name}`,
    referredBy ? `🔗 แนะนำโดย: ${referredBy}` : "",
  ].filter(Boolean).join("\n");
  return sendLineNotify(msg);
}

export async function notifyMissionComplete(name: string, missionTitle: string, points: number) {
  const msg = [
    "🏆 ทำภารกิจสำเร็จ!",
    `👤 ${name}`,
    `📋 ${missionTitle}`,
    `⭐ +${points} คะแนน`,
  ].join("\n");
  return sendLineNotify(msg);
}
