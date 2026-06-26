import type { ActionFunctionArgs } from "react-router";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { referrerId } = await request.json();
    if (!referrerId) {
      return new Response(JSON.stringify({ error: "Referrer ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, referrerId }), {
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": `unicorn_referrer=${referrerId}; Path=/; HttpOnly; Max-Age=${30 * 24 * 60 * 60}; SameSite=Lax; Secure`
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Failed to track referral" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
