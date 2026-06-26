import { createServerSupabase, requireUser } from "@/lib/supabase-server";
import { getUploadUrl } from "@/lib/r2";
import type { ActionFunctionArgs } from "react-router";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const responseHeaders = new Headers();
    const { user } = await requireUser(request, responseHeaders);

    const { filename, contentType, folder = "avatars" } = await request.json();
    if (!filename || !contentType) {
      return new Response(JSON.stringify({ error: "Filename and contentType are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const ext = filename.split(".").pop();
    const key = `${folder}/${user.id}/${Date.now()}.${ext}`;

    const { url, publicUrl } = await getUploadUrl(key, contentType);

    return new Response(JSON.stringify({ uploadUrl: url, publicUrl, key }), {
      headers: {
        "Content-Type": "application/json",
        ...Object.fromEntries(responseHeaders.entries())
      }
    });

  } catch (err: any) {
    console.error("api/upload error:", err);
    return new Response(JSON.stringify({ error: err.message || "เกิดข้อผิดพลาดในการอัปโหลด" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
