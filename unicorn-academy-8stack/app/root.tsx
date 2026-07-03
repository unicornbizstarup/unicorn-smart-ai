import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";
import type { LoaderFunctionArgs } from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

export function meta() {
  return [
    { title: "Unicorn Smart AI | สถาบันสอนธุรกิจและนวัตกรรม" },
    { name: "description", content: "Unicorn Smart AI - สถาบันพัฒนาศักยภาพทางธุรกิจและเทคโนโลยี AI เพื่อก้าวสู่การเป็นนักธุรกิจยุคใหม่" },
  ];
}

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&family=Sarabun:wght@300;400;500;600;700&display=swap",
  },
  {
    rel: "icon",
    type: "image/x-icon",
    href: "/favicon.ico",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: "/favicon-32x32.png",
  },
  {
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: "/apple-touch-icon.png",
  },
];

export async function loader(_: LoaderFunctionArgs) {
  // Read from process.env (Cloudflare Workers [vars] bindings via nodejs_compat)
  return {
    ENV: {
      VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    },
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-bg-page text-text-primary antialiased">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <Outlet />
      {data?.ENV && (
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)};`,
          }}
        />
      )}
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "เกิดข้อผิดพลาด!";
  let details = "เกิดข้อผิดพลาดที่ไม่คาดคิดในระบบ";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "ไม่พบหน้าเว็บ (404)" : "ข้อผิดพลาดระบบ";
    details =
      error.status === 404
        ? "ไม่พบหน้าที่คุณกำลังค้นหา กรุณาตรวจสอบ URL อีกครั้ง"
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-24 p-6 max-w-xl mx-auto text-center space-y-6">
      <div className="text-6xl">⚠️</div>
      <h1 className="font-display font-bold text-3xl text-text-primary">{message}</h1>
      <p className="font-body text-text-secondary">{details}</p>
      <a href="/dashboard" className="btn-gold inline-flex mt-4">กลับหน้าหลัก</a>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto bg-white border border-border-default rounded-xl text-left text-xs font-mono mt-8">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
