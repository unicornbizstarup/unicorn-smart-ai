import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 🛡️ Safety Guard: If Supabase env vars are missing, bypass to prevent infinite recursive loop (522 error)
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("⚠️ Warning: Supabase environment variables are missing! Skipping auth check in middleware.");
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (all) => {
          all.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          all.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  try {
    const { data: { user } } = await supabase.auth.getUser();

    const protectedPaths = ["/dashboard", "/profile", "/missions", "/ai-coach", "/admin"];
    const isProtected = protectedPaths.some((p) => request.nextUrl.pathname.startsWith(p));

    if (isProtected && !user) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  } catch (err) {
    console.error("Middleware auth check error:", err);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
