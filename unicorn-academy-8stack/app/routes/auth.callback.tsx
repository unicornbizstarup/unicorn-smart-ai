import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { createServerSupabase } from "@/lib/supabase-server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  const responseHeaders = new Headers();
  if (code) {
    const supabase = createServerSupabase(request, responseHeaders);
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return redirect(`${origin}${next}`, {
        headers: responseHeaders,
      });
    }
  }

  return redirect(`${origin}/auth/login`, {
    headers: responseHeaders,
  });
}
