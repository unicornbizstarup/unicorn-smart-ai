import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

export function createServerSupabase(request: Request, responseHeaders: Headers = new Headers()) {
  // @ts-ignore
  const cfEnv = (typeof globalThis !== "undefined" ? (globalThis as any).CF_ENV : null) || {};

  const url = cfEnv.VITE_SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://placeholder.supabase.co";

  const anonKey = cfEnv.VITE_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "placeholder-build-key";

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get("Cookie") ?? "");
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options: any }>) {
        cookiesToSet.forEach(({ name, value, options }) => {
          responseHeaders.append(
            "Set-Cookie",
            serializeCookieHeader(name, value, options)
          );
        });
      },
    },
  });
}

export function createServiceSupabase() {
  // @ts-ignore
  const cfEnv = (typeof globalThis !== "undefined" ? (globalThis as any).CF_ENV : null) || {};

  const url = cfEnv.VITE_SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://placeholder.supabase.co";

  const serviceKey = cfEnv.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "placeholder-build-key";

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// 🛡️ Helper to require user session in loaders and actions
export async function requireUser(request: Request, responseHeaders: Headers = new Headers()) {
  const supabase = createServerSupabase(request, responseHeaders);
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    // In React Router, we throw a Response redirect to halt execution and redirect
    const { redirect } = await import("react-router");
    throw redirect("/auth/login", {
      headers: responseHeaders,
    });
  }

  return { user, supabase };
}
