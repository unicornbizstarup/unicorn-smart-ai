import { createBrowserClient } from "@supabase/ssr";

declare global {
  interface Window {
    ENV: {
      VITE_SUPABASE_URL: string;
      VITE_SUPABASE_ANON_KEY: string;
      [key: string]: string;
    };
  }
}

export function createClient() {
  // Read from window.ENV first (server-injected at runtime), then fall back to bundler env vars
  const url = (typeof window !== "undefined" && window.ENV?.VITE_SUPABASE_URL) ||
    import.meta.env?.VITE_SUPABASE_URL ||
    "https://placeholder.supabase.co";

  const anonKey = (typeof window !== "undefined" && window.ENV?.VITE_SUPABASE_ANON_KEY) ||
    import.meta.env?.VITE_SUPABASE_ANON_KEY ||
    "placeholder-build-key";

  return createBrowserClient(url, anonKey);
}
