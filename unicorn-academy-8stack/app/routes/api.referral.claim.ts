import type { ActionFunctionArgs } from "react-router";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const cookieHeader = request.headers.get("Cookie") || "";
    const cookies: Record<string, string> = {};
    
    cookieHeader.split(";").forEach(cookie => {
      const parts = cookie.split("=");
      const key = parts[0]?.trim();
      const val = parts.slice(1).join("=").trim();
      if (key) cookies[key] = val;
    });

    const referrerId = cookies["unicorn_referrer"] || null;

    return new Response(JSON.stringify({ referrerId }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Failed to claim referral" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
