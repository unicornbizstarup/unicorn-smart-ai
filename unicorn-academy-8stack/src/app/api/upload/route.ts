import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { getUploadUrl } from "@/lib/r2";

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { filename, contentType } = await req.json();
  const ext = filename.split(".").pop();
  const key = `avatars/${user.id}/${Date.now()}.${ext}`;

  const { url, publicUrl } = await getUploadUrl(key, contentType);
  return NextResponse.json({ url, publicUrl });
}
