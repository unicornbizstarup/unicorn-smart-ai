// workers/proxy.ts
// ═══════════════════════════════════════════════════════
// Cloudflare Workers — Edge Proxy
// Endpoints: /chat  /embed  /crawl  /generate-bio
// ═══════════════════════════════════════════════════════

export interface Env {
  GEMINI_API_KEY: string;
  ALLOWED_ORIGIN: string;
}

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url    = new URL(request.url);
    const path   = url.pathname;
    const method = request.method;

    // CORS
    const origin = request.headers.get("origin") ?? "";
    const corsHeaders = {
      "Access-Control-Allow-Origin":  env.ALLOWED_ORIGIN || origin,
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
    };
    if (method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    function json(data: unknown, status = 200) {
      return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    try {
      // ── /chat — Gemini generateContent ──
      if (path === "/chat" && method === "POST") {
        const { systemPrompt, history, message } = await request.json() as {
          systemPrompt: string;
          history: Array<{ role: string; content: string }>;
          message: string;
        };

        const contents = [
          ...history.map(h => ({
            role:  h.role === "user" ? "user" : "model",
            parts: [{ text: h.content }],
          })),
          { role: "user", parts: [{ text: message }] },
        ];

        const res = await fetch(
          `${GEMINI_BASE}/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`,
          {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({
              system_instruction: { parts: [{ text: systemPrompt }] },
              contents,
              generationConfig: { maxOutputTokens: 1024, temperature: 0.7 },
            }),
          }
        );
        const data = await res.json() as {
          candidates?: Array<{ content: { parts: Array<{ text: string }> } }>
        };
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "ขออภัย ไม่สามารถตอบได้ในขณะนี้";
        return json({ reply });
      }

      // ── /embed — Gemini text-embedding-004 ──
      if (path === "/embed" && method === "POST") {
        const { text } = await request.json() as { text: string };

        const res = await fetch(
          `${GEMINI_BASE}/models/text-embedding-004:embedContent?key=${env.GEMINI_API_KEY}`,
          {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({
              model:   "models/text-embedding-004",
              content: { parts: [{ text }] },
            }),
          }
        );
        const data = await res.json() as {
          embedding?: { values: number[] }
        };
        if (!data.embedding?.values) {
          return json({ error: "Embedding failed" }, 500);
        }
        return json({ embedding: data.embedding.values });
      }

      // ── /crawl — Fetch and extract text from URL ──
      if (path === "/crawl" && method === "POST") {
        const { url: targetUrl } = await request.json() as { url: string };

        const pageRes = await fetch(targetUrl, {
          headers: {
            "User-Agent": "UnicornBot/1.0 (Knowledge Base Crawler)",
            "Accept":     "text/html,application/xhtml+xml",
          },
          redirect: "follow",
        });

        if (!pageRes.ok) {
          return json({ error: `Failed to fetch: ${pageRes.status}` }, 400);
        }

        const html = await pageRes.text();
        // Strip scripts, styles, and HTML tags
        const text = html
          .replace(/<script[\s\S]*?<\/script>/gi, "")
          .replace(/<style[\s\S]*?<\/style>/gi, "")
          .replace(/<nav[\s\S]*?<\/nav>/gi, "")
          .replace(/<footer[\s\S]*?<\/footer>/gi, "")
          .replace(/<header[\s\S]*?<\/header>/gi, "")
          .replace(/<!--[\s\S]*?-->/g, "")
          .replace(/<[^>]+>/g, " ")
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/\s{2,}/g, " ")
          .trim();

        return json({ text, url: targetUrl });
      }

      // ── /generate-bio — AI-generated professional bio ──
      if (path === "/generate-bio" && method === "POST") {
        const { name, expertise, bio, ubc_level, wealth_element } = await request.json() as {
          name: string; expertise: string; bio: string;
          ubc_level: number; wealth_element: string;
        };

        const prompt = `
สร้าง Professional Bio ภาษาไทยสำหรับที่ปรึกษาธุรกิจ Unicorn:
ชื่อ: ${name}
ความเชี่ยวชาญ: ${expertise || "ธุรกิจเครือข่าย"}
ระดับ UBC: ${ubc_level}
Wealth DNA Element: ${wealth_element}
ข้อมูลเพิ่มเติม: ${bio || ""}

ตอบในรูปแบบ JSON เท่านั้น ไม่มี markdown:
{
  "bio": "2-3 ประโยคที่ดูน่าเชื่อถือและเป็นมืออาชีพ",
  "tags": ["แท็ก1", "แท็ก2", "แท็ก3", "แท็ก4", "แท็ก5"]
}`;

        const res = await fetch(
          `${GEMINI_BASE}/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`,
          {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({
              contents: [{ role: "user", parts: [{ text: prompt }] }],
              generationConfig: {
                maxOutputTokens: 512,
                temperature: 0.8,
                responseMimeType: "application/json",
              },
            }),
          }
        );

        const data = await res.json() as {
          candidates?: Array<{ content: { parts: Array<{ text: string }> } }>
        };
        const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";

        try {
          const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim()) as {
            bio: string; tags: string[]
          };
          return json(parsed);
        } catch {
          return json({ bio: `ผู้เชี่ยวชาญด้าน${expertise} ระดับ UBC ${ubc_level}`, tags: [] });
        }
      }

      // ── /health ──
      if (path === "/health") {
        return json({ status: "ok", timestamp: new Date().toISOString() });
      }

      return json({ error: "Not found" }, 404);

    } catch (err) {
      console.error("Workers error:", err);
      return json({ error: "Internal server error" }, 500);
    }
  },
} satisfies ExportedHandler<Env>;
