import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // Fallback placeholder prevents build-time throw when env vars are absent.
  // Actual auth calls happen client-side (useEffect) so placeholders are never used at runtime.
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL  ?? "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-build-key"
  );
}
