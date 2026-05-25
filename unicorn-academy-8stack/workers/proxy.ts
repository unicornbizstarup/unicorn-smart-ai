/**
 * Cloudflare Workers — Secure AI Edge Proxy
 * Proxies requests to Gemini API via CF AI Gateway
 * ③ Stack piece: Edge Proxy for all services
 */

export interface Env {
  GEMINI_API_KEY: string;
  ALLOWED_ORIGIN: string;
}

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // CORS
    const origin = request.headers.get("Origin") ?? "";
    const corsHeaders = {
      "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-api-key",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const body = await request.json();
    const model = (body as { model?: string }).model ?? "gemini-2.0-flash";

    const geminiRes = await fetch(
      `${GEMINI_BASE}/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const data = await geminiRes.json();

    return new Response(JSON.stringify(data), {
      status: geminiRes.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  },
};
