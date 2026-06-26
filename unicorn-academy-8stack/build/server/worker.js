import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { ServerRouter, UNSAFE_withComponentProps, useLoaderData, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts, Link, useNavigate, useSearchParams, redirect, useLocation, data, useFetcher } from "react-router";
import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import { createServerClient, serializeCookieHeader, parseCookieHeader, createBrowserClient } from "@supabase/ssr";
import { createClient as createClient$1 } from "@supabase/supabase-js";
import { useState, Suspense, useRef, useEffect, useMemo } from "react";
import { ArrowLeft, Lock, EyeOff, Eye, Loader2, LogIn, Sparkles, User, CheckCircle2, UserPlus, ChevronLeft, LayoutDashboard, Layers, Trophy, Camera, Link as Link$1, AlertCircle, HelpCircle, MessageCircle, Tv, Save, Rocket, Shield, GraduationCap, Bot, RefreshCw, Send, Airplay, Waves, Zap, ArrowRight, Calendar, Clock, Lightbulb, ShoppingBag, ChevronRight, Share2, Award, Play, Search, MapPin, Users } from "lucide-react";
import { Resend } from "resend";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
const ABORT_DELAY = 5e3;
async function handleRequest(request, responseStatusCode, responseHeaders, routerContext, _loadContext) {
  const userAgent = request.headers.get("user-agent");
  isbot(userAgent ?? "") ? "onAllReady" : "onShellReady";
  return new Promise(async (resolve, reject) => {
    let status = responseStatusCode;
    let didError = false;
    const stream = await renderToReadableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        signal: AbortSignal.timeout(ABORT_DELAY),
        onError(error) {
          didError = true;
          status = 500;
          console.error(error);
        }
      }
    );
    if (isbot(userAgent ?? "")) {
      await stream.allReady;
    }
    const headers = new Headers(responseHeaders);
    headers.set("Content-Type", "text/html; charset=utf-8");
    resolve(
      new Response(stream, {
        status: didError ? 500 : status,
        headers
      })
    );
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Sarabun:wght@300;400;500;600;700&display=swap"
}];
async function loader$i(_) {
  return {
    ENV: {
      VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
    }
  };
}
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "th",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      className: "min-h-screen bg-bg-page text-text-primary antialiased",
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  const data2 = useLoaderData();
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx(Outlet, {}), (data2 == null ? void 0 : data2.ENV) && /* @__PURE__ */ jsx("script", {
      dangerouslySetInnerHTML: {
        __html: `window.ENV = ${JSON.stringify(data2.ENV)};`
      }
    })]
  });
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "เกิดข้อผิดพลาด!";
  let details = "เกิดข้อผิดพลาดที่ไม่คาดคิดในระบบ";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "ไม่พบหน้าเว็บ (404)" : "ข้อผิดพลาดระบบ";
    details = error.status === 404 ? "ไม่พบหน้าที่คุณกำลังค้นหา กรุณาตรวจสอบ URL อีกครั้ง" : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-24 p-6 max-w-xl mx-auto text-center space-y-6",
    children: [/* @__PURE__ */ jsx("div", {
      className: "text-6xl",
      children: "⚠️"
    }), /* @__PURE__ */ jsx("h1", {
      className: "font-display font-bold text-3xl text-text-primary",
      children: message
    }), /* @__PURE__ */ jsx("p", {
      className: "font-body text-text-secondary",
      children: details
    }), /* @__PURE__ */ jsx("a", {
      href: "/dashboard",
      className: "btn-gold inline-flex mt-4",
      children: "กลับหน้าหลัก"
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links,
  loader: loader$i
}, Symbol.toStringTag, { value: "Module" }));
function createServerSupabase(request, responseHeaders = new Headers()) {
  const url = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-build-key";
  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get("Cookie") ?? "");
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          responseHeaders.append(
            "Set-Cookie",
            serializeCookieHeader(name, value, options)
          );
        });
      }
    }
  });
}
function createServiceSupabase() {
  const url = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-build-key";
  return createClient$1(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}
async function requireUser(request, responseHeaders = new Headers()) {
  const supabase = createServerSupabase(request, responseHeaders);
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    const { redirect: redirect2 } = await import("react-router");
    throw redirect2("/auth/login", {
      headers: responseHeaders
    });
  }
  return { user, supabase };
}
const supabaseServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createServerSupabase,
  createServiceSupabase,
  requireUser
}, Symbol.toStringTag, { value: "Module" }));
function meta$i() {
  return [{
    title: "Unicorn Smart AI — แพลตฟอร์มอัจฉริยะสำหรับ Unicorn Biz Coach"
  }, {
    name: "description",
    content: "สมาร์ทแพลตฟอร์มที่ออกแบบมาเพื่อคุณ ผสานเทคโนโลยี AI และระบบการเรียนรู้สมัยใหม่ เพื่อสร้างผลลัพธ์ที่จับต้องได้จริง"
  }];
}
async function loader$h({
  request
}) {
  const responseHeaders = new Headers();
  const supabase = createServerSupabase(request, responseHeaders);
  const {
    data: {
      user
    }
  } = await supabase.auth.getUser();
  return {
    user
  };
}
const home = UNSAFE_withComponentProps(function HomePage() {
  const {
    user
  } = useLoaderData();
  return /* @__PURE__ */ jsxs("main", {
    className: "min-h-screen relative overflow-hidden bg-bg-page font-body text-text-primary",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none",
      children: [/* @__PURE__ */ jsx("div", {
        className: "absolute top-[-10%] right-[-10%] w-[60%] h-[60%] \n                        bg-brand-gold-light/20 blur-[150px] rounded-full"
      }), /* @__PURE__ */ jsx("div", {
        className: "absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] \n                        bg-brand-gold/5 blur-[120px] rounded-full"
      })]
    }), /* @__PURE__ */ jsx("nav", {
      className: "relative z-20 px-6 py-4 border-b border-border-default/50 bg-white/70 backdrop-blur-md sticky top-0",
      children: /* @__PURE__ */ jsxs("div", {
        className: "max-w-7xl mx-auto flex items-center justify-between",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "flex items-center gap-3",
          children: [/* @__PURE__ */ jsx("div", {
            className: "w-10 h-10 rounded-xl flex items-center justify-center text-white\n                            font-black text-xl flex-shrink-0 shadow-md shadow-brand-gold/10",
            style: {
              background: "linear-gradient(135deg, var(--brand-gold), var(--brand-gold-hover))"
            },
            children: "U"
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsxs("div", {
              className: "font-display font-bold text-lg text-text-primary leading-tight tracking-tight",
              children: ["UNICORN ", /* @__PURE__ */ jsx("span", {
                className: "text-brand-gold font-extrabold",
                children: "SMART AI"
              })]
            }), /* @__PURE__ */ jsx("div", {
              className: "text-[9px] font-bold text-text-muted uppercase tracking-[0.25em] -mt-0.5",
              children: "Premium Innovation"
            })]
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "flex items-center gap-4",
          children: user ? /* @__PURE__ */ jsx(Link, {
            to: "/dashboard",
            className: "btn-gold px-6 text-sm",
            children: "เข้าสู่หน้าควบคุม"
          }) : /* @__PURE__ */ jsxs(Fragment, {
            children: [/* @__PURE__ */ jsx(Link, {
              to: "/auth/login",
              className: "text-text-secondary hover:text-text-primary transition-colors text-sm font-semibold",
              children: "เข้าสู่ระบบ"
            }), /* @__PURE__ */ jsx(Link, {
              to: "/auth/register",
              className: "btn-gold px-6 text-sm",
              children: "สมัครสมาชิก"
            })]
          })
        })]
      })
    }), /* @__PURE__ */ jsx("section", {
      className: "relative z-10 flex flex-col items-center justify-center pt-24 pb-32 px-6",
      children: /* @__PURE__ */ jsxs("div", {
        className: "max-w-5xl w-full text-center space-y-10",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full \n                          bg-white/80 border border-border-default/60 shadow-sm",
          children: [/* @__PURE__ */ jsx("span", {
            className: "flex h-2 w-2 rounded-full bg-brand-gold animate-pulse"
          }), /* @__PURE__ */ jsx("span", {
            className: "text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]",
            children: "Smart Business Platform 2026"
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "space-y-6",
          children: [/* @__PURE__ */ jsxs("h1", {
            className: "font-display font-bold text-5xl md:text-8xl text-text-primary leading-[1.1] tracking-tight",
            children: ["ยกระดับธุรกิจ ", /* @__PURE__ */ jsx("br", {}), /* @__PURE__ */ jsx("span", {
              className: "text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-brand-gold-muted to-brand-gold-hover",
              children: "สู่อนาคตที่เหนือกว่า"
            })]
          }), /* @__PURE__ */ jsxs("p", {
            className: "text-text-secondary text-base md:text-lg max-w-3xl mx-auto leading-relaxed font-light",
            children: ["สมาร์ทแพลตฟอร์มเพื่อ ", /* @__PURE__ */ jsx("span", {
              className: "font-semibold text-brand-gold",
              children: "Unicorn Biz Coach"
            }), " ที่ออกแบบมาเพื่อคุณโดยเฉพาะ ผสานเทคโนโลยีปัญญาประดิษฐ์ AI และระบบการเรียนรู้แบบสมัยใหม่ เพื่อเร่งความสำเร็จให้ธุรกิจของคุณ"]
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "flex justify-center pt-4",
          children: /* @__PURE__ */ jsx(Link, {
            to: user ? "/dashboard" : "/auth/login",
            className: "btn-gold px-14 py-4 text-base rounded-xl shadow-lg shadow-brand-gold/10 hover:scale-[1.03] transition-transform duration-200",
            children: user ? "เข้าสู่แดชบอร์ด" : "เริ่มต้นใช้งานระบบ"
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-24 text-left",
          children: [{
            title: "Eco-system",
            desc: "ระบบนิเวศทางธุรกิจที่ครบวงจรที่สุด เพื่อความมั่นคงและยั่งยืนในระยะยาว",
            icon: "⚡",
            bg: "bg-[#fffcf6] border-brand-gold/10"
          }, {
            title: "Product Strength",
            desc: "นวัตกรรมสินค้าชั้นเลิศที่ตอบโจทย์ความต้องการของผู้บริโภคยุคใหม่",
            icon: "🏆",
            bg: "bg-white"
          }, {
            title: "AI & Digital Tools",
            desc: "เครื่องมืออัจฉริยะและน้องยูนิ AI Coach ที่ช่วยย่อเวลาการเรียนรู้และขยายธุรกิจ",
            icon: "✨",
            bg: "bg-white"
          }, {
            title: "High Reward",
            desc: "แผนรายได้และผลตอบแทนที่คุ้มค่า ออกแบบมาเพื่อความสำเร็จของทุกคน",
            icon: "⭐",
            bg: "bg-white"
          }].map((f, i) => /* @__PURE__ */ jsxs("div", {
            className: `card-premium p-8 group relative ${f.bg}`,
            children: [/* @__PURE__ */ jsx("div", {
              className: "w-12 h-12 rounded-xl bg-bg-hover flex items-center justify-center text-2xl mb-6 group-hover:scale-110 group-hover:bg-brand-gold-light/45 transition-all duration-300",
              children: f.icon
            }), /* @__PURE__ */ jsx("h3", {
              className: "text-base font-bold text-text-primary mb-3 font-display tracking-tight",
              children: f.title
            }), /* @__PURE__ */ jsx("p", {
              className: "text-text-secondary text-sm leading-relaxed font-light",
              children: f.desc
            }), /* @__PURE__ */ jsx("div", {
              className: "absolute bottom-4 right-4 w-1.5 h-1.5 rounded-full bg-brand-gold/0 group-hover:bg-brand-gold/50 transition-all duration-300"
            })]
          }, i))
        })]
      })
    }), /* @__PURE__ */ jsx("footer", {
      className: "relative z-10 py-16 border-t border-border-default/40 bg-white/50 backdrop-blur-sm",
      children: /* @__PURE__ */ jsxs("div", {
        className: "max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "flex items-center gap-2",
          children: [/* @__PURE__ */ jsx("div", {
            className: "w-6 h-6 rounded-md flex items-center justify-center text-white font-black text-xs",
            style: {
              background: "linear-gradient(135deg, var(--brand-gold), var(--brand-gold-hover))"
            },
            children: "U"
          }), /* @__PURE__ */ jsx("span", {
            className: "text-xs font-bold uppercase tracking-widest text-text-secondary",
            children: "Unicorn Academy"
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "text-text-muted text-xs font-medium",
          children: "© 2026 Unicorn Academy. All Rights Reserved."
        })]
      })
    })]
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  loader: loader$h,
  meta: meta$i
}, Symbol.toStringTag, { value: "Module" }));
const __vite_import_meta_env__ = {};
function createClient() {
  var _a, _b;
  const url = typeof window !== "undefined" && ((_a = window.ENV) == null ? void 0 : _a.VITE_SUPABASE_URL) || (__vite_import_meta_env__ == null ? void 0 : __vite_import_meta_env__.VITE_SUPABASE_URL) || "https://placeholder.supabase.co";
  const anonKey = typeof window !== "undefined" && ((_b = window.ENV) == null ? void 0 : _b.VITE_SUPABASE_ANON_KEY) || (__vite_import_meta_env__ == null ? void 0 : __vite_import_meta_env__.VITE_SUPABASE_ANON_KEY) || "placeholder-build-key";
  return createBrowserClient(url, anonKey);
}
function meta$h() {
  return [{
    title: "เข้าสู่ระบบ — Unicorn Academy"
  }, {
    name: "description",
    content: "เข้าสู่ระบบ Unicorn Academy Smart AI Platform"
  }];
}
const auth_login = UNSAFE_withComponentProps(function LoginPage() {
  const navigate = useNavigate();
  const supabase = createClient();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("กรุณากรอก Username และรหัสผ่านให้ครบถ้วน");
      return;
    }
    setIsLoading(true);
    try {
      const safeUsername = username.toLowerCase().replace(/\s+/g, "");
      const fakeEmail = `${safeUsername}@unicorn.systems`;
      const {
        error: authError
      } = await supabase.auth.signInWithPassword({
        email: fakeEmail,
        password
      });
      if (authError) throw authError;
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Username หรือรหัสผ่านไม่ถูกต้อง");
    } finally {
      setIsLoading(false);
    }
  };
  const handleBypass = async () => {
    setError("");
    setIsLoading(true);
    const fakeEmail = "densmartai@gmail.com";
    const testerPassword = "Tester123456!";
    try {
      const {
        error: authError
      } = await supabase.auth.signInWithPassword({
        email: fakeEmail,
        password: testerPassword
      });
      if (authError) throw authError;
      navigate("/dashboard");
    } catch (err) {
      console.error("Bypass error:", err);
      setError(err.message || "ไม่สามารถข้ามการเข้าระบบได้");
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen bg-bg-page flex items-center justify-center p-4 relative overflow-hidden font-body",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "absolute inset-0 z-0 pointer-events-none",
      children: [/* @__PURE__ */ jsx("div", {
        className: "absolute top-1/3 left-1/4 w-80 h-80 bg-brand-gold-light/40 rounded-full blur-[120px]"
      }), /* @__PURE__ */ jsx("div", {
        className: "absolute bottom-1/3 right-1/4 w-60 h-60 bg-brand-gold/10 rounded-full blur-[100px]"
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "relative z-10 w-full max-w-md",
      children: [/* @__PURE__ */ jsxs(Link, {
        to: "/",
        className: "group flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors font-semibold",
        children: [/* @__PURE__ */ jsx(ArrowLeft, {
          size: 16,
          className: "group-hover:-translate-x-1 transition-transform"
        }), /* @__PURE__ */ jsx("span", {
          children: "กลับหน้าแรก"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "glass p-8 md:p-10 shadow-card border-border-default relative overflow-hidden bg-white/95",
        children: [/* @__PURE__ */ jsx("div", {
          className: "absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent"
        }), /* @__PURE__ */ jsxs("div", {
          className: "text-center mb-8",
          children: [/* @__PURE__ */ jsx("div", {
            className: "w-14 h-14 bg-brand-gold rounded-2xl flex items-center justify-center font-display font-black text-2xl mx-auto mb-4 shadow-md text-white select-none",
            children: "🦄"
          }), /* @__PURE__ */ jsx("h1", {
            className: "text-2xl font-bold font-display text-text-primary tracking-tight",
            children: "ยินดีต้อนรับกลับ! 👋"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-xs text-text-muted mt-1.5 font-medium",
            children: "เข้าสู่ระบบเพื่อเริ่มต้นเส้นทางความสำเร็จอัจฉริยะ"
          })]
        }), error && /* @__PURE__ */ jsx("div", {
          className: "bg-red-50 border border-red-200 rounded-xl p-4 mb-6",
          children: /* @__PURE__ */ jsx("p", {
            className: "text-xs text-red-700 font-semibold text-center",
            children: error
          })
        }), /* @__PURE__ */ jsxs("form", {
          onSubmit: handleSubmit,
          className: "space-y-5",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "space-y-2",
            children: [/* @__PURE__ */ jsx("label", {
              className: "block text-[10px] font-black text-text-secondary uppercase tracking-widest",
              children: "Username"
            }), /* @__PURE__ */ jsxs("div", {
              className: "relative",
              children: [/* @__PURE__ */ jsx("div", {
                className: "absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-bold text-sm",
                children: "@"
              }), /* @__PURE__ */ jsx("input", {
                type: "text",
                value: username,
                onChange: (e) => setUsername(e.target.value),
                placeholder: "yourname",
                className: "w-full pl-10 pr-4 py-3.5 bg-bg-input border border-border-default rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-gold-muted focus:ring-1 focus:ring-brand-gold-muted/20 transition-all text-sm font-semibold"
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-2",
            children: [/* @__PURE__ */ jsx("label", {
              className: "block text-[10px] font-black text-text-secondary uppercase tracking-widest",
              children: "รหัสผ่าน"
            }), /* @__PURE__ */ jsxs("div", {
              className: "relative",
              children: [/* @__PURE__ */ jsx(Lock, {
                size: 16,
                className: "absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
              }), /* @__PURE__ */ jsx("input", {
                type: showPassword ? "text" : "password",
                value: password,
                onChange: (e) => setPassword(e.target.value),
                placeholder: "••••••••",
                className: "w-full pl-10 pr-12 py-3.5 bg-bg-input border border-border-default rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-gold-muted focus:ring-1 focus:ring-brand-gold-muted/20 transition-all text-sm font-semibold"
              }), /* @__PURE__ */ jsx("button", {
                type: "button",
                onClick: () => setShowPassword(!showPassword),
                className: "absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors",
                "aria-label": showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน",
                children: showPassword ? /* @__PURE__ */ jsx(EyeOff, {
                  size: 16
                }) : /* @__PURE__ */ jsx(Eye, {
                  size: 16
                })
              })]
            })]
          }), /* @__PURE__ */ jsx("button", {
            type: "submit",
            disabled: isLoading,
            className: "w-full py-4 btn-gold rounded-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm uppercase tracking-wider font-semibold",
            children: isLoading ? /* @__PURE__ */ jsx(Loader2, {
              className: "w-5 h-5 animate-spin text-white"
            }) : /* @__PURE__ */ jsxs(Fragment, {
              children: [/* @__PURE__ */ jsx(LogIn, {
                size: 16
              }), /* @__PURE__ */ jsx("span", {
                children: "เข้าสู่ระบบ"
              })]
            })
          }), /* @__PURE__ */ jsxs("button", {
            type: "button",
            onClick: handleBypass,
            disabled: isLoading,
            className: "w-full py-3 bg-brand-gold-light hover:bg-brand-gold-light/80 text-brand-gold border border-brand-gold-muted font-bold rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-2xs tracking-wide mt-3",
            children: [/* @__PURE__ */ jsx(Sparkles, {
              size: 14,
              className: "text-brand-gold animate-pulse"
            }), /* @__PURE__ */ jsx("span", {
              children: "🚀 ปลดล็อกเข้าทดสอบภายใน (Internal Dev Bypass)"
            })]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex items-center gap-3 my-6",
          children: [/* @__PURE__ */ jsx("div", {
            className: "flex-1 h-px bg-border-default"
          }), /* @__PURE__ */ jsx("span", {
            className: "text-[10px] text-text-muted font-black uppercase tracking-widest",
            children: "หรือ"
          }), /* @__PURE__ */ jsx("div", {
            className: "flex-1 h-px bg-border-default"
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "text-center",
          children: /* @__PURE__ */ jsxs("p", {
            className: "text-xs text-text-secondary font-medium",
            children: ["ยังไม่ได้เป็นสมาชิก?", " ", /* @__PURE__ */ jsxs(Link, {
              to: "/auth/register",
              className: "text-brand-gold font-bold hover:text-brand-gold-hover transition-colors inline-flex items-center gap-1 hover:underline",
              children: [/* @__PURE__ */ jsx(Sparkles, {
                size: 12,
                className: "animate-pulse"
              }), "ลงทะเบียนฟรี"]
            })]
          })
        })]
      })]
    })]
  });
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: auth_login,
  meta: meta$h
}, Symbol.toStringTag, { value: "Module" }));
function meta$g() {
  return [{
    title: "สมัครสมาชิก — Unicorn Academy"
  }, {
    name: "description",
    content: "สมัครสมาชิกใหม่ในระบบ Unicorn Academy"
  }];
}
function RegisterForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const supabase = createClient();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const refSlug = searchParams.get("ref");
  const passwordChecks = [{
    label: "อย่างน้อย 6 ตัวอักษร",
    valid: password.length >= 6
  }, {
    label: "รหัสผ่านสองช่องตรงกัน",
    valid: password === confirmPassword && confirmPassword.length > 0
  }];
  const handleSubmit = async (e) => {
    var _a, _b;
    e.preventDefault();
    setError("");
    if (!fullName || !username || !password || !confirmPassword) {
      setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }
    if (username.length < 3) {
      setError("Username ต้องมีอย่างน้อย 3 ตัวอักษร");
      return;
    }
    if (password.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }
    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง");
      return;
    }
    setIsLoading(true);
    try {
      const cleanUsername = username.toLowerCase().replace(/\s+/g, "");
      const fakeEmail = `${cleanUsername}@unicorn.systems`;
      const {
        data: data2,
        error: signUpError
      } = await supabase.auth.signUp({
        email: fakeEmail,
        password,
        options: {
          data: {
            full_name: fullName,
            username: cleanUsername,
            phone: ""
          }
        }
      });
      if (signUpError) throw signUpError;
      if (data2.user) {
        const {
          error: profileError
        } = await supabase.from("profiles").update({
          referral_slug: cleanUsername
        }).eq("id", data2.user.id);
        if (profileError) {
          console.error("Error setting referral slug:", profileError);
        }
        navigate("/dashboard");
      } else {
        setError("สมัครสมาชิกเสร็จสิ้น กรุณาเช็คกล่องข้อความเพื่อยืนยันตัวตนหรือลองเข้าสู่ระบบ");
      }
    } catch (err) {
      console.error("Register error:", err);
      if (((_a = err.message) == null ? void 0 : _a.includes("already registered")) || ((_b = err.message) == null ? void 0 : _b.includes("already been registered"))) {
        setError("ชื่อผู้ใช้นี้ถูกลงทะเบียนไปแล้ว กรุณาเข้าสู่ระบบแทน");
      } else {
        setError(err.message || "เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen bg-bg-page flex items-center justify-center p-4 relative overflow-hidden font-body",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "absolute inset-0 z-0 pointer-events-none",
      children: [/* @__PURE__ */ jsx("div", {
        className: "absolute top-1/4 right-1/4 w-80 h-80 bg-brand-gold-light/40 rounded-full blur-[120px]"
      }), /* @__PURE__ */ jsx("div", {
        className: "absolute bottom-1/4 left-1/4 w-60 h-60 bg-brand-gold/10 rounded-full blur-[100px]"
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "relative z-10 w-full max-w-md my-8",
      children: [/* @__PURE__ */ jsxs(Link, {
        to: "/",
        className: "group flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors font-semibold",
        children: [/* @__PURE__ */ jsx(ArrowLeft, {
          size: 16,
          className: "group-hover:-translate-x-1 transition-transform"
        }), /* @__PURE__ */ jsx("span", {
          children: "กลับหน้าแรก"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "glass p-8 md:p-10 shadow-card border-border-default relative overflow-hidden bg-white/95",
        children: [/* @__PURE__ */ jsx("div", {
          className: "absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent"
        }), refSlug && /* @__PURE__ */ jsxs("div", {
          className: "bg-brand-gold-light/50 border border-brand-gold-muted text-brand-gold px-4 py-2.5 rounded-xl text-xs font-semibold text-center mb-6 animate-pulse",
          children: ["🤝 ยินดีต้อนรับ! คุณกำลังเข้าร่วมทีมของ ", /* @__PURE__ */ jsxs("strong", {
            children: ["@", refSlug]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "text-center mb-6",
          children: [/* @__PURE__ */ jsx("div", {
            className: "w-14 h-14 bg-brand-gold rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md text-white",
            children: /* @__PURE__ */ jsx(Sparkles, {
              size: 24
            })
          }), /* @__PURE__ */ jsx("h1", {
            className: "text-2xl font-bold font-display text-text-primary tracking-tight",
            children: "เข้าร่วม Unicorn Academy 🦄"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-xs text-text-muted mt-1.5 font-medium",
            children: "ลงทะเบียนสมาชิกใหม่เพื่อเริ่มต้นเส้นทางนักธุรกิจ AI"
          })]
        }), error && /* @__PURE__ */ jsx("div", {
          className: "bg-red-50 border border-red-200 rounded-xl p-4 mb-6",
          children: /* @__PURE__ */ jsx("p", {
            className: "text-xs text-red-700 font-semibold text-center",
            children: error
          })
        }), /* @__PURE__ */ jsxs("form", {
          onSubmit: handleSubmit,
          className: "space-y-4",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "space-y-1.5",
            children: [/* @__PURE__ */ jsx("label", {
              className: "block text-[10px] font-black text-text-secondary uppercase tracking-widest",
              children: "ชื่อ - นามสกุล"
            }), /* @__PURE__ */ jsxs("div", {
              className: "relative",
              children: [/* @__PURE__ */ jsx(User, {
                size: 16,
                className: "absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
              }), /* @__PURE__ */ jsx("input", {
                type: "text",
                value: fullName,
                onChange: (e) => setFullName(e.target.value),
                placeholder: "สมชาย ใจดี",
                className: "w-full pl-10 pr-4 py-3.5 bg-bg-input border border-border-default rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-gold-muted focus:ring-1 focus:ring-brand-gold-muted/20 transition-all text-sm font-semibold"
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-1.5",
            children: [/* @__PURE__ */ jsx("label", {
              className: "block text-[10px] font-black text-text-secondary uppercase tracking-widest",
              children: "Username (สำหรับลิงก์แนะนำ)"
            }), /* @__PURE__ */ jsxs("div", {
              className: "relative",
              children: [/* @__PURE__ */ jsx("div", {
                className: "absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-bold text-sm",
                children: "@"
              }), /* @__PURE__ */ jsx("input", {
                type: "text",
                value: username,
                onChange: (e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, "")),
                placeholder: "yourname",
                className: "w-full pl-10 pr-4 py-3.5 bg-bg-input border border-border-default rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-gold-muted focus:ring-1 focus:ring-brand-gold-muted/20 transition-all text-sm font-semibold"
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-4",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "space-y-1.5",
              children: [/* @__PURE__ */ jsx("label", {
                className: "block text-[10px] font-black text-text-secondary uppercase tracking-widest",
                children: "รหัสผ่าน"
              }), /* @__PURE__ */ jsxs("div", {
                className: "relative",
                children: [/* @__PURE__ */ jsx(Lock, {
                  size: 16,
                  className: "absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                }), /* @__PURE__ */ jsx("input", {
                  type: showPassword ? "text" : "password",
                  value: password,
                  onChange: (e) => setPassword(e.target.value),
                  placeholder: "••••••••",
                  className: "w-full pl-10 pr-12 py-3.5 bg-bg-input border border-border-default rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-gold-muted focus:ring-1 focus:ring-brand-gold-muted/20 transition-all text-sm font-semibold"
                }), /* @__PURE__ */ jsx("button", {
                  type: "button",
                  onClick: () => setShowPassword(!showPassword),
                  className: "absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors",
                  children: showPassword ? /* @__PURE__ */ jsx(EyeOff, {
                    size: 16
                  }) : /* @__PURE__ */ jsx(Eye, {
                    size: 16
                  })
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-1.5",
              children: [/* @__PURE__ */ jsx("label", {
                className: "block text-[10px] font-black text-text-secondary uppercase tracking-widest",
                children: "ยืนยันรหัสผ่าน"
              }), /* @__PURE__ */ jsxs("div", {
                className: "relative",
                children: [/* @__PURE__ */ jsx(Lock, {
                  size: 16,
                  className: "absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                }), /* @__PURE__ */ jsx("input", {
                  type: showPassword ? "text" : "password",
                  value: confirmPassword,
                  onChange: (e) => setConfirmPassword(e.target.value),
                  placeholder: "••••••••",
                  className: "w-full pl-10 pr-4 py-3.5 bg-bg-input border border-border-default rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-gold-muted focus:ring-1 focus:ring-brand-gold-muted/20 transition-all text-sm font-semibold"
                })]
              })]
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "flex gap-4 pt-1 bg-bg-hover p-3.5 rounded-xl border border-border-default",
            children: passwordChecks.map((check, idx) => /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-1.5 text-[10px] font-semibold text-text-secondary",
              children: [/* @__PURE__ */ jsx(CheckCircle2, {
                size: 12,
                className: check.valid ? "text-emerald-600" : "text-text-muted"
              }), /* @__PURE__ */ jsx("span", {
                className: check.valid ? "text-emerald-700 font-bold" : "text-text-muted",
                children: check.label
              })]
            }, idx))
          }), /* @__PURE__ */ jsx("button", {
            type: "submit",
            disabled: isLoading,
            className: "w-full py-4 btn-gold rounded-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm uppercase tracking-wider font-semibold mt-2",
            children: isLoading ? /* @__PURE__ */ jsx(Loader2, {
              className: "w-5 h-5 animate-spin text-white"
            }) : /* @__PURE__ */ jsxs(Fragment, {
              children: [/* @__PURE__ */ jsx(UserPlus, {
                size: 16
              }), /* @__PURE__ */ jsx("span", {
                children: "สมัครสมาชิก"
              })]
            })
          })]
        }), /* @__PURE__ */ jsxs("p", {
          className: "text-center text-xs text-text-secondary mt-6 font-medium",
          children: ["มีบัญชีสมาชิกแล้ว?", " ", /* @__PURE__ */ jsx(Link, {
            to: "/auth/login",
            className: "text-brand-gold font-bold hover:text-brand-gold-hover hover:underline",
            children: "เข้าสู่ระบบที่นี่"
          })]
        })]
      })]
    })]
  });
}
const auth_register = UNSAFE_withComponentProps(function RegisterPage() {
  return /* @__PURE__ */ jsx(Suspense, {
    fallback: /* @__PURE__ */ jsxs("div", {
      className: "min-h-screen bg-bg-page flex items-center justify-center p-4 relative overflow-hidden font-body",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "absolute inset-0 z-0 pointer-events-none",
        children: [/* @__PURE__ */ jsx("div", {
          className: "absolute top-1/4 right-1/4 w-80 h-80 bg-brand-gold-light/40 rounded-full blur-[120px]"
        }), /* @__PURE__ */ jsx("div", {
          className: "absolute bottom-1/4 left-1/4 w-60 h-60 bg-brand-gold/10 rounded-full blur-[100px]"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "relative z-10 text-center",
        children: [/* @__PURE__ */ jsx(Loader2, {
          className: "w-10 h-10 animate-spin text-brand-gold mx-auto mb-4"
        }), /* @__PURE__ */ jsx("p", {
          className: "text-text-secondary text-sm font-semibold",
          children: "กำลังโหลด..."
        })]
      })]
    }),
    children: /* @__PURE__ */ jsx(RegisterForm, {})
  });
});
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: auth_register,
  meta: meta$g
}, Symbol.toStringTag, { value: "Module" }));
async function loader$g({
  request
}) {
  const {
    searchParams,
    origin
  } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const responseHeaders = new Headers();
  if (code) {
    const supabase = createServerSupabase(request, responseHeaders);
    const {
      error
    } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return redirect(`${origin}${next}`, {
        headers: responseHeaders
      });
    }
  }
  return redirect(`${origin}/auth/login`, {
    headers: responseHeaders
  });
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$g
}, Symbol.toStringTag, { value: "Module" }));
function MemberLayout({ children, profile: profile2, title, subtitle, actions }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const isAdmin = (profile2 == null ? void 0 : profile2.id) === "mewjhcheciafyuxkngqn" || (profile2 == null ? void 0 : profile2.is_admin) === true;
  const isDashboardActive = currentPath === "/dashboard";
  const isCoursesActive = ["/startup", "/products", "/knowledge", "/functions", "/missions", "/ubc-program"].some((path) => currentPath.startsWith(path));
  const isAiCoachActive = currentPath.startsWith("/ai-coach");
  const isProfileActive = currentPath.startsWith("/profile") || currentPath.startsWith("/dna");
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-[#f1eeeb] flex items-center justify-center p-0 sm:p-4 font-body", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-[430px] min-h-screen sm:min-h-[850px] sm:max-h-[900px] bg-bg-page shadow-2xl relative flex flex-col pb-20 overflow-x-hidden sm:rounded-[2.5rem] sm:border-[8px] sm:border-slate-800", children: [
    /* @__PURE__ */ jsxs("header", { className: "h-14 bg-white/85 backdrop-blur-md border-b border-border-default flex items-center justify-between px-4 shrink-0 sticky top-0 z-30", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
        !isDashboardActive && /* @__PURE__ */ jsx(
          Link,
          {
            to: "/dashboard",
            "aria-label": "ย้อนกลับ",
            className: "p-1 text-text-secondary hover:text-brand-gold rounded-lg transition-colors flex-shrink-0",
            children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-5 h-5 text-text-secondary" })
          }
        ),
        /* @__PURE__ */ jsx("h1", { className: "font-display font-bold text-text-primary text-sm leading-tight truncate", children: title })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
        isAdmin && /* @__PURE__ */ jsx(
          Link,
          {
            to: "/admin",
            className: "btn-outline !text-[9px] !px-2.5 !py-1 !rounded-full !font-black !uppercase !tracking-tighter transition-all",
            children: "⚙️ Admin"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/profile",
            className: "w-8 h-8 rounded-full bg-bg-hover border border-border-default overflow-hidden active:scale-95 transition-transform",
            children: /* @__PURE__ */ jsx("img", { src: (profile2 == null ? void 0 : profile2.avatar_url) || "https://api.dicebear.com/7.x/avataaars/svg?seed=UnicornPartner", alt: "Avatar", className: "w-full h-full object-cover" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("main", { className: "flex-1 overflow-y-auto p-4 w-full", children: [
      isCoursesActive && /* @__PURE__ */ jsxs("div", { className: "flex bg-white p-1 rounded-xl border border-border-default gap-1 text-center text-[10px] font-bold mb-4 shadow-sm overflow-x-auto scrollbar-hide", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/startup",
            className: `flex-1 py-1.5 px-2 rounded-lg whitespace-nowrap transition-colors ${currentPath.startsWith("/startup") ? "bg-brand-gold-light text-brand-gold" : "text-text-secondary hover:bg-bg-hover"}`,
            children: "5 เริ่มต้น"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/products",
            className: `flex-1 py-1.5 px-2 rounded-lg whitespace-nowrap transition-colors ${currentPath.startsWith("/products") ? "bg-brand-gold-light text-brand-gold" : "text-text-secondary hover:bg-bg-hover"}`,
            children: "สินค้า"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/knowledge",
            className: `flex-1 py-1.5 px-2 rounded-lg whitespace-nowrap transition-colors ${currentPath.startsWith("/knowledge") ? "bg-brand-gold-light text-brand-gold" : "text-text-secondary hover:bg-bg-hover"}`,
            children: "ความรู้"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/functions",
            className: `flex-1 py-1.5 px-2 rounded-lg whitespace-nowrap transition-colors ${currentPath.startsWith("/functions") ? "bg-brand-gold-light text-brand-gold" : "text-text-secondary hover:bg-bg-hover"}`,
            children: "ฟังก์ชัน"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/missions",
            className: `flex-1 py-1.5 px-2 rounded-lg whitespace-nowrap transition-colors ${currentPath.startsWith("/missions") ? "bg-brand-gold-light text-brand-gold" : "text-text-secondary hover:bg-bg-hover"}`,
            children: "ภารกิจ"
          }
        )
      ] }),
      children
    ] }),
    /* @__PURE__ */ jsxs("nav", { className: "bottom-nav", children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/dashboard",
          className: `flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${isDashboardActive ? "text-brand-gold font-bold scale-105" : "text-text-muted hover:text-text-secondary"}`,
          children: [
            /* @__PURE__ */ jsx(LayoutDashboard, { className: "w-5 h-5" }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] tracking-wide", children: "หน้าหลัก" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/startup",
          className: `flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${isCoursesActive ? "text-brand-gold font-bold scale-105" : "text-text-muted hover:text-text-secondary"}`,
          children: [
            /* @__PURE__ */ jsx(Layers, { className: "w-5 h-5" }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] tracking-wide", children: "หลักสูตร" })
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/ai-coach",
          className: `flex flex-col items-center justify-center -translate-y-4 w-14 h-14 bg-gradient-to-tr from-brand-gold to-brand-gold-muted rounded-full shadow-lg text-white active:scale-95 transition-all ${isAiCoachActive ? "ring-4 ring-brand-gold-light scale-110 shadow-xl" : ""}`,
          "aria-label": "แชทกับน้องยูนิ",
          children: /* @__PURE__ */ jsx(Sparkles, { className: "w-6 h-6 animate-pulse" })
        }
      ),
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/profile",
          className: `flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${isProfileActive ? "text-brand-gold font-bold scale-105" : "text-text-muted hover:text-text-secondary"}`,
          children: [
            /* @__PURE__ */ jsx(Trophy, { className: "w-5 h-5" }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] tracking-wide", children: "โปรไฟล์" })
          ]
        }
      )
    ] })
  ] }) });
}
function meta$f() {
  return [{
    title: "แดชบอร์ด — Unicorn Academy"
  }, {
    name: "description",
    content: "แผงควบคุมระบบสมาชิกและการเรียนรู้ Unicorn Academy"
  }];
}
async function loader$f({
  request
}) {
  const responseHeaders = new Headers();
  const {
    user,
    supabase
  } = await requireUser(request, responseHeaders);
  const {
    data: profile2
  } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const {
    data: missions2
  } = await supabase.from("user_missions").select("*, mission:missions(*)").eq("profile_id", user.id).order("started_at", {
    ascending: false
  }).limit(5).returns();
  return {
    profile: profile2,
    missions: missions2
  };
}
const dashboard = UNSAFE_withComponentProps(function DashboardPage() {
  const {
    profile: profile2,
    missions: missions2
  } = useLoaderData();
  const completedMissionsCount = missions2 ? missions2.filter((m) => m.status === "COMPLETED" || m.status === "VERIFIED").length : 0;
  const displayUbcScore = ((profile2 == null ? void 0 : profile2.business_points) ?? 0) > 0 ? profile2 == null ? void 0 : profile2.business_points.toLocaleString() : "0000";
  const displayReferrals = (profile2 == null ? void 0 : profile2.referral_clicks) ?? 0;
  const displayAiSessions = 0;
  const displayMissionsDone = completedMissionsCount > 0 ? completedMissionsCount : 0;
  return /* @__PURE__ */ jsx(MemberLayout, {
    profile: profile2,
    title: "Dashboard",
    subtitle: `— ยินดีต้อนรับคุณ ${(profile2 == null ? void 0 : profile2.display_name) || (profile2 == null ? void 0 : profile2.full_name) || "Partner"} 👋`,
    actions: /* @__PURE__ */ jsxs(Fragment, {
      children: [/* @__PURE__ */ jsx("button", {
        className: "btn-outline !text-[10px] !px-4 !py-2 !rounded-full !font-bold !uppercase transition-all",
        children: "Report"
      }), /* @__PURE__ */ jsx(Link, {
        to: "/missions",
        className: "btn-gold !text-[10px] !px-4 !py-2 !rounded-full !font-bold !uppercase transition-transform",
        children: "+ New Mission"
      })]
    }),
    children: /* @__PURE__ */ jsxs("div", {
      className: "space-y-8 font-body",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "grid grid-cols-2 gap-4",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "card-premium p-4 flex flex-col justify-between group h-28",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center justify-between mb-2",
            children: [/* @__PURE__ */ jsx("div", {
              className: "w-8 h-8 rounded-lg bg-brand-gold-light/40 flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition-transform",
              children: "⚡"
            }), /* @__PURE__ */ jsx("span", {
              className: "text-[9px] font-black text-text-muted uppercase tracking-wider",
              children: "UBC Score"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("div", {
              className: "text-2xl font-display font-black text-text-primary leading-none mb-0.5",
              children: displayUbcScore
            }), /* @__PURE__ */ jsx("div", {
              className: "text-[9px] font-bold text-emerald-600 uppercase tracking-tighter",
              children: "↑ +0 Points"
            })]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "card-premium p-4 flex flex-col justify-between group h-28",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center justify-between mb-2",
            children: [/* @__PURE__ */ jsx("div", {
              className: "w-8 h-8 rounded-lg bg-brand-gold-light/40 flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition-transform",
              children: "👥"
            }), /* @__PURE__ */ jsx("span", {
              className: "text-[9px] font-black text-text-muted uppercase tracking-wider",
              children: "Referrals"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("div", {
              className: "text-2xl font-display font-black text-text-primary leading-none mb-0.5",
              children: displayReferrals.toString().padStart(2, "0")
            }), /* @__PURE__ */ jsx("div", {
              className: "text-[9px] font-bold text-text-muted uppercase tracking-tighter",
              children: "Lifetime Activity"
            })]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "card-premium p-4 flex flex-col justify-between group h-28",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center justify-between mb-2",
            children: [/* @__PURE__ */ jsx("div", {
              className: "w-8 h-8 rounded-lg bg-brand-gold-light/40 flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition-transform",
              children: "✨"
            }), /* @__PURE__ */ jsx("span", {
              className: "text-[9px] font-black text-text-muted uppercase tracking-wider",
              children: "AI Sessions"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("div", {
              className: "text-2xl font-display font-black text-text-primary leading-none mb-0.5",
              children: displayAiSessions.toString().padStart(2, "0")
            }), /* @__PURE__ */ jsx("div", {
              className: "text-[9px] font-bold text-text-muted uppercase tracking-tighter",
              children: "Current Month"
            })]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "card-premium p-4 flex flex-col justify-between group h-28",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center justify-between mb-2",
            children: [/* @__PURE__ */ jsx("div", {
              className: "w-8 h-8 rounded-lg bg-brand-gold-light/40 flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition-transform",
              children: "✅"
            }), /* @__PURE__ */ jsx("span", {
              className: "text-[9px] font-black text-text-muted uppercase tracking-wider",
              children: "Missions"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("div", {
              className: "text-2xl font-display font-black text-text-primary leading-none mb-0.5",
              children: displayMissionsDone.toString().padStart(2, "0")
            }), /* @__PURE__ */ jsx("div", {
              className: "text-[9px] font-bold text-emerald-600 uppercase tracking-tighter",
              children: "Success Pathway"
            })]
          })]
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "grid grid-cols-1 gap-6",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "card-premium p-5",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center justify-between mb-6 pb-3 border-b border-border-default",
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h2", {
                className: "text-md font-bold font-display text-text-primary uppercase tracking-tight",
                children: "Active Missions"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-[10px] text-text-muted font-medium",
                children: "ความคืบหน้าภารกิจของคุณ"
              })]
            }), /* @__PURE__ */ jsx(Link, {
              to: "/missions",
              className: "text-[10px] font-black text-brand-gold hover:underline uppercase tracking-widest",
              children: "View All →"
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "space-y-3",
            children: missions2 && missions2.length > 0 ? missions2.map((um) => {
              var _a, _b, _c, _d;
              return /* @__PURE__ */ jsxs("div", {
                className: "flex items-center justify-between p-3.5 rounded-2xl bg-bg-input border border-border-default hover:border-brand-gold-muted/30 transition-all group",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-3",
                  children: [/* @__PURE__ */ jsx("div", {
                    className: "w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm bg-white border border-border-default",
                    children: ((_a = um.mission) == null ? void 0 : _a.category) === "MINDSET" ? "🧠" : ((_b = um.mission) == null ? void 0 : _b.category) === "SKILLSET" ? "🎯" : "🛠️"
                  }), /* @__PURE__ */ jsxs("div", {
                    children: [/* @__PURE__ */ jsx("div", {
                      className: "text-xs font-semibold text-text-primary line-clamp-1",
                      children: (_c = um.mission) == null ? void 0 : _c.title
                    }), /* @__PURE__ */ jsx("div", {
                      className: "text-[9px] text-text-muted font-bold uppercase tracking-wider mt-0.5",
                      children: (_d = um.mission) == null ? void 0 : _d.category
                    })]
                  })]
                }), /* @__PURE__ */ jsx("span", {
                  className: `px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${um.status === "COMPLETED" ? "bg-emerald-100 text-emerald-800" : um.status === "VERIFIED" ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"}`,
                  children: um.status
                })]
              }, um.id);
            }) : /* @__PURE__ */ jsxs("div", {
              className: "py-8 text-center text-text-muted",
              children: [/* @__PURE__ */ jsx("div", {
                className: "text-3xl mb-3 opacity-20",
                children: "🎯"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-[10px] font-bold uppercase tracking-widest",
                children: "ไม่มีภารกิจที่กำลังดำเนินอยู่"
              }), /* @__PURE__ */ jsx(Link, {
                to: "/missions",
                className: "text-brand-gold text-[10px] font-black uppercase tracking-widest mt-3 inline-block hover:underline",
                children: "+ Start First Mission"
              })]
            })
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "card-premium p-5",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "mb-6 pb-3 border-b border-border-default",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-md font-bold font-display text-text-primary uppercase tracking-tight",
              children: "เครื่องมือและระบบงาน Hub"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-[10px] text-text-muted font-medium",
              children: "Business Operations Hub"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "grid grid-cols-2 gap-3",
            children: [/* @__PURE__ */ jsxs(Link, {
              to: "/startup",
              className: "p-4 rounded-2xl bg-bg-input border border-border-default hover:border-brand-gold-muted/50 hover:bg-white hover:shadow-sm transition-all group",
              children: [/* @__PURE__ */ jsx("div", {
                className: "w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl shadow-sm mb-3 group-hover:scale-110 transition-transform",
                children: "🚀"
              }), /* @__PURE__ */ jsx("div", {
                className: "text-xs font-semibold text-text-primary uppercase tracking-tighter",
                children: "5 เริ่มต้น"
              }), /* @__PURE__ */ jsx("div", {
                className: "text-[9px] text-text-muted font-bold uppercase tracking-widest mt-0.5",
                children: "Start Up"
              })]
            }), /* @__PURE__ */ jsxs(Link, {
              to: "/products",
              className: "p-4 rounded-2xl bg-bg-input border border-border-default hover:border-brand-gold-muted/50 hover:bg-white hover:shadow-sm transition-all group",
              children: [/* @__PURE__ */ jsx("div", {
                className: "w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl shadow-sm mb-3 group-hover:scale-110 transition-transform",
                children: "📦"
              }), /* @__PURE__ */ jsx("div", {
                className: "text-xs font-semibold text-text-primary uppercase tracking-tighter",
                children: "คลังสินค้า"
              }), /* @__PURE__ */ jsx("div", {
                className: "text-[9px] text-text-muted font-bold uppercase tracking-widest mt-0.5",
                children: "Products"
              })]
            }), /* @__PURE__ */ jsxs(Link, {
              to: "/knowledge",
              className: "p-4 rounded-2xl bg-bg-input border border-border-default hover:border-brand-gold-muted/50 hover:bg-white hover:shadow-sm transition-all group",
              children: [/* @__PURE__ */ jsx("div", {
                className: "w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl shadow-sm mb-3 group-hover:scale-110 transition-transform",
                children: "📚"
              }), /* @__PURE__ */ jsx("div", {
                className: "text-xs font-semibold text-text-primary uppercase tracking-tighter",
                children: "คลังความรู้"
              }), /* @__PURE__ */ jsx("div", {
                className: "text-[9px] text-text-muted font-bold uppercase tracking-widest mt-0.5",
                children: "Knowledge"
              })]
            }), /* @__PURE__ */ jsxs(Link, {
              to: "/functions",
              className: "p-4 rounded-2xl bg-bg-input border border-border-default hover:border-brand-gold-muted/50 hover:bg-white hover:shadow-sm transition-all group",
              children: [/* @__PURE__ */ jsx("div", {
                className: "w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl shadow-sm mb-3 group-hover:scale-110 transition-transform",
                children: "📅"
              }), /* @__PURE__ */ jsx("div", {
                className: "text-xs font-semibold text-text-primary tracking-tighter",
                children: "ฟังก์ชั่นระบบ"
              }), /* @__PURE__ */ jsx("div", {
                className: "text-[9px] text-text-muted font-bold uppercase tracking-widest mt-0.5",
                children: "Events"
              })]
            })]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "card-premium p-5",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "mb-6 pb-3 border-b border-border-default",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-md font-bold font-display text-text-primary uppercase tracking-tight",
              children: "Quick Actions"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-[10px] text-text-muted font-medium",
              children: "ทางลัดอัจฉริยะ"
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "grid grid-cols-3 gap-2.5",
            children: [{
              label: "ถามน้องยูนิ",
              icon: "✨",
              href: "/ai-coach"
            }, {
              label: "Referral",
              icon: "🔗",
              href: "/profile"
            }, {
              label: "Name Card",
              icon: "🪪",
              href: "/profile"
            }, {
              label: "Report",
              icon: "📊",
              href: "#"
            }, {
              label: "Mission",
              icon: "🎯",
              href: "/missions"
            }, {
              label: "DNA Quiz",
              icon: "🧬",
              href: "/dna"
            }].map((action2) => /* @__PURE__ */ jsxs(Link, {
              to: action2.href,
              className: "flex flex-col items-center justify-center p-3 rounded-xl bg-bg-input border border-border-default hover:border-brand-gold-muted/40 hover:bg-white hover:shadow-sm transition-all group text-center",
              children: [/* @__PURE__ */ jsx("div", {
                className: "text-xl mb-1.5 group-hover:scale-110 transition-transform",
                children: action2.icon
              }), /* @__PURE__ */ jsx("span", {
                className: "text-[10px] font-bold text-text-secondary uppercase tracking-tighter group-hover:text-brand-gold transition-colors",
                children: action2.label
              })]
            }, action2.label))
          })]
        })]
      })]
    })
  });
});
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: dashboard,
  loader: loader$f,
  meta: meta$f
}, Symbol.toStringTag, { value: "Module" }));
function meta$e() {
  return [{
    title: "จัดการโปรไฟล์และนามบัตรดิจิทัล — Unicorn Academy"
  }, {
    name: "description",
    content: "จัดการข้อมูลส่วนตัว นามบัตรดิจิทัล และลิงก์แนะนำบอกต่อสำหรับพาร์ทเนอร์"
  }];
}
async function loader$e({
  request
}) {
  const responseHeaders = new Headers();
  const {
    user,
    supabase
  } = await requireUser(request, responseHeaders);
  const {
    data: profile2
  } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return {
    profile: profile2,
    user
  };
}
const profile = UNSAFE_withComponentProps(function ProfilePage() {
  const {
    profile: loadedProfile,
    user
  } = useLoaderData();
  const supabase = createClient();
  const fileInputRef = useRef(null);
  const [profile2, setProfile] = useState({
    full_name: (loadedProfile == null ? void 0 : loadedProfile.full_name) || "",
    specialization: (loadedProfile == null ? void 0 : loadedProfile.specialization) || "",
    bio: (loadedProfile == null ? void 0 : loadedProfile.bio) || "",
    line_id: (loadedProfile == null ? void 0 : loadedProfile.line_id) || "",
    line_oa: (loadedProfile == null ? void 0 : loadedProfile.line_oa) || "",
    youtube_url: (loadedProfile == null ? void 0 : loadedProfile.youtube_url) || "",
    referral_slug: (loadedProfile == null ? void 0 : loadedProfile.referral_slug) || "",
    avatar_url: (loadedProfile == null ? void 0 : loadedProfile.avatar_url) || ""
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const handleInputChange = (e) => {
    const {
      name,
      value
    } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  const handleAvatarClick = () => {
    var _a;
    (_a = fileInputRef.current) == null ? void 0 : _a.click();
  };
  const handleFileChange = async (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("รูปภาพต้องมีขนาดไม่เกิน 2MB ครับ");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type
        })
      });
      if (!res.ok) throw new Error("ไม่สามารถขอ URL อัปโหลดได้");
      const {
        url,
        publicUrl
      } = await res.json();
      const uploadRes = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type
        },
        body: file
      });
      if (!uploadRes.ok) throw new Error("การอัปโหลดรูปภาพล้มเหลว");
      setProfile((prev) => ({
        ...prev,
        avatar_url: publicUrl
      }));
      const {
        error: dbError
      } = await supabase.from("profiles").update({
        avatar_url: publicUrl
      }).eq("id", user.id);
      if (dbError) throw dbError;
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2e3);
    } catch (err) {
      console.error("Avatar upload error:", err);
      setError(err.message || "อัปโหลดรูปภาพล้มเหลว กรุณาลองใหม่อีกครั้ง");
    } finally {
      setUploading(false);
    }
  };
  const handleSubmit = async (e) => {
    var _a;
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setError("");
    const cleanSlug = profile2.referral_slug.toLowerCase().replace(/\s+/g, "");
    if (!cleanSlug) {
      setError("ลิงก์แนะนำตัว (Referral Slug) ห้ามว่าง");
      setSaving(false);
      return;
    }
    try {
      const {
        error: updateError
      } = await supabase.from("profiles").update({
        full_name: profile2.full_name,
        specialization: profile2.specialization,
        bio: profile2.bio,
        line_id: profile2.line_id,
        line_oa: profile2.line_oa,
        youtube_url: profile2.youtube_url,
        referral_slug: cleanSlug
      }).eq("id", user.id);
      if (updateError) {
        if ((_a = updateError.message) == null ? void 0 : _a.includes("unique")) {
          throw new Error("ลิงก์แนะนำตัว (Referral Slug) นี้มีผู้อื่นใช้งานแล้ว กรุณาเปลี่ยนชื่อใหม่ครับ");
        }
        throw updateError;
      }
      setProfile((prev) => ({
        ...prev,
        referral_slug: cleanSlug
      }));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3e3);
    } catch (err) {
      console.error("Profile save error:", err);
      setError(err.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsx(MemberLayout, {
    profile: loadedProfile,
    title: "โปรไฟล์และนามบัตรดิจิทัล",
    subtitle: "— จัดการข้อมูลส่วนตัว นามบัตรดิจิทัล และลิงก์สปอนเซอร์แนะนำสำหรับพาร์ทเนอร์",
    children: /* @__PURE__ */ jsxs("div", {
      className: "max-w-4xl mx-auto text-text-primary font-body",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center justify-between mb-6",
        children: [/* @__PURE__ */ jsxs(Link, {
          to: "/dashboard",
          className: "flex items-center gap-2 group text-text-secondary hover:text-brand-gold font-semibold text-xs transition-colors",
          children: [/* @__PURE__ */ jsx(ChevronLeft, {
            size: 16,
            className: "group-hover:-translate-x-0.5 transition-transform"
          }), /* @__PURE__ */ jsx("span", {
            children: "กลับหน้าแดชบอร์ด"
          })]
        }), /* @__PURE__ */ jsx("span", {
          className: "text-brand-gold font-bold tracking-widest text-[10px] uppercase bg-brand-gold-light px-3 py-1 rounded-full border border-border-default",
          children: "Digital Name Card"
        })]
      }), /* @__PURE__ */ jsxs("form", {
        onSubmit: handleSubmit,
        className: "grid md:grid-cols-3 gap-8 items-start",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "md:col-span-1 bg-gradient-to-b from-[#1a1209] to-[#2d2112] border border-border-strong rounded-2xl p-6 flex flex-col items-center text-center space-y-6 shadow-md",
          children: [/* @__PURE__ */ jsx("h3", {
            className: "text-xs font-black text-white/40 uppercase tracking-widest block w-full text-left",
            children: "รูปภาพนามบัตร"
          }), /* @__PURE__ */ jsxs("div", {
            className: "relative group cursor-pointer",
            onClick: handleAvatarClick,
            children: [/* @__PURE__ */ jsxs("div", {
              className: "w-32 h-32 rounded-full overflow-hidden border-2 border-brand-gold-muted group-hover:border-brand-gold relative transition-all duration-300",
              children: [profile2.avatar_url ? /* @__PURE__ */ jsx("img", {
                src: profile2.avatar_url,
                alt: profile2.full_name || "Profile Avatar",
                className: "object-cover w-full h-full"
              }) : /* @__PURE__ */ jsx("div", {
                className: "w-full h-full bg-white/5 flex items-center justify-center text-white/20",
                children: /* @__PURE__ */ jsx(User, {
                  size: 48
                })
              }), /* @__PURE__ */ jsxs("div", {
                className: "absolute inset-0 bg-black/70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                children: [/* @__PURE__ */ jsx(Camera, {
                  size: 24,
                  className: "text-brand-gold animate-pulse"
                }), /* @__PURE__ */ jsx("span", {
                  className: "text-[10px] font-bold text-white/80 mt-1",
                  children: "คลิกเพื่อเปลี่ยน"
                })]
              })]
            }), uploading && /* @__PURE__ */ jsx("div", {
              className: "absolute inset-0 bg-black/80 rounded-full flex items-center justify-center border-2 border-brand-gold",
              children: /* @__PURE__ */ jsx(Loader2, {
                size: 24,
                className: "text-brand-gold animate-spin"
              })
            })]
          }), /* @__PURE__ */ jsx("input", {
            type: "file",
            ref: fileInputRef,
            onChange: handleFileChange,
            accept: "image/*",
            className: "hidden"
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-2 w-full",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-xl font-display text-brand-gold truncate font-bold",
              children: profile2.full_name || "ชื่อผู้ใช้"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-xs text-white/70 italic leading-relaxed",
              children: profile2.bio || `"สโลแกนหรือแนวคิดทางธุรกิจของคุณ"`
            }), profile2.specialization && /* @__PURE__ */ jsxs("span", {
              className: "inline-block px-3 py-1 bg-brand-gold/20 border border-brand-gold-muted rounded-full text-brand-gold text-[10px] font-black uppercase tracking-wider",
              children: ["✨ ", profile2.specialization]
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "pt-4 border-t border-white/10 w-full space-y-3",
            children: /* @__PURE__ */ jsxs("div", {
              className: "text-left",
              children: [/* @__PURE__ */ jsx("span", {
                className: "text-[9px] font-black text-white/40 uppercase tracking-widest block mb-1",
                children: "ลิงก์แนะนำตัวบอกต่อธุรกิจของคุณ"
              }), /* @__PURE__ */ jsxs("div", {
                className: "bg-white/5 p-3 rounded-xl border border-white/10 text-xs text-brand-gold font-semibold break-all flex items-center justify-between",
                children: [/* @__PURE__ */ jsxs("span", {
                  className: "truncate select-all",
                  children: ["/r/", profile2.referral_slug || "your-link"]
                }), /* @__PURE__ */ jsx(Link, {
                  to: `/r/${profile2.referral_slug}`,
                  target: "_blank",
                  className: "text-white/40 hover:text-white transition-colors ml-2 shrink-0",
                  title: "เปิดหน้านามบัตรสาธารณะ",
                  children: /* @__PURE__ */ jsx(Link$1, {
                    size: 14
                  })
                })]
              })]
            })
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "md:col-span-2 space-y-6",
          children: [error && /* @__PURE__ */ jsxs("div", {
            className: "bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3",
            children: [/* @__PURE__ */ jsx(AlertCircle, {
              size: 20,
              className: "text-red-700 shrink-0"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-xs text-red-700 font-semibold",
              children: error
            })]
          }), saveSuccess && /* @__PURE__ */ jsxs("div", {
            className: "bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3",
            children: [/* @__PURE__ */ jsx(CheckCircle2, {
              size: 20,
              className: "text-emerald-700 shrink-0"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-xs text-emerald-700 font-semibold",
              children: "อัปเดตข้อมูลนามบัตรเรียบร้อยแล้วครับ! 🦄✨"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "bg-white border border-border-default rounded-2xl shadow-sm p-6 md:p-8 space-y-6",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "space-y-1",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-display text-brand-gold font-bold",
                children: "แก้ไขรายละเอียดนามบัตรดิจิทัล"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-xs text-text-secondary",
                children: "กรอกข้อมูลส่วนบุคคลและช่องทางการติดต่อของพาร์ทเนอร์"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "grid md:grid-cols-2 gap-5",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "space-y-2 col-span-2",
                children: [/* @__PURE__ */ jsx("label", {
                  className: "text-[10px] font-black text-text-secondary uppercase tracking-widest block",
                  children: "ชื่อ - นามสกุลจริง"
                }), /* @__PURE__ */ jsx("input", {
                  type: "text",
                  name: "full_name",
                  value: profile2.full_name,
                  onChange: handleInputChange,
                  placeholder: "ระบุชื่อและนามสกุลที่ต้องการให้แสดงผล",
                  className: "w-full px-4 py-3 bg-bg-input border border-border-default rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-gold-muted focus:ring-1 focus:ring-brand-gold-muted/20 transition-all text-sm font-semibold"
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-2 col-span-2",
                children: [/* @__PURE__ */ jsxs("label", {
                  className: "text-[10px] font-black text-text-secondary uppercase tracking-widest block flex items-center gap-1.5",
                  children: [/* @__PURE__ */ jsx("span", {
                    children: "ลิงก์แนะนำตัวบอกต่อ (Referral Slug)"
                  }), /* @__PURE__ */ jsx("span", {
                    title: "จะถูกใช้เป็น URL สำหรับแนะนำทีม เช่น domain/r/yourname",
                    className: "cursor-help",
                    children: /* @__PURE__ */ jsx(HelpCircle, {
                      size: 12,
                      className: "text-text-muted"
                    })
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "relative",
                  children: [/* @__PURE__ */ jsx("span", {
                    className: "absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-bold text-sm",
                    children: "/r/"
                  }), /* @__PURE__ */ jsx("input", {
                    type: "text",
                    name: "referral_slug",
                    value: profile2.referral_slug,
                    onChange: handleInputChange,
                    placeholder: "your-unique-slug",
                    className: "w-full pl-10 pr-4 py-3 bg-bg-input border border-border-default rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-gold-muted focus:ring-1 focus:ring-brand-gold-muted/20 transition-all text-sm font-semibold"
                  })]
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-2 col-span-1",
                children: [/* @__PURE__ */ jsx("label", {
                  className: "text-[10px] font-black text-text-secondary uppercase tracking-widest block",
                  children: "ความชื่นชอบ / ความถนัดพิเศษ"
                }), /* @__PURE__ */ jsx("input", {
                  type: "text",
                  name: "specialization",
                  value: profile2.specialization,
                  onChange: handleInputChange,
                  placeholder: "เช่น นักการตลาดออนไลน์, อาหารเสริมสุขภาพ",
                  className: "w-full px-4 py-3 bg-bg-input border border-border-default rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-gold-muted focus:ring-1 focus:ring-brand-gold-muted/20 transition-all text-sm font-semibold"
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-2 col-span-1",
                children: [/* @__PURE__ */ jsx("label", {
                  className: "text-[10px] font-black text-text-secondary uppercase tracking-widest block",
                  children: "สโลแกนดึงดูด (Bio / Quote)"
                }), /* @__PURE__ */ jsx("input", {
                  type: "text",
                  name: "bio",
                  value: profile2.bio,
                  onChange: handleInputChange,
                  placeholder: "คำคม หรือเป้าหมายธุรกิจสั้นๆ ที่สร้างแรงบันดาลใจ",
                  className: "w-full px-4 py-3 bg-bg-input border border-border-default rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-gold-muted focus:ring-1 focus:ring-brand-gold-muted/20 transition-all text-sm font-semibold"
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-2 col-span-1",
                children: [/* @__PURE__ */ jsxs("label", {
                  className: "text-[10px] font-black text-text-secondary uppercase tracking-widest block flex items-center gap-1",
                  children: [/* @__PURE__ */ jsx(MessageCircle, {
                    size: 12,
                    className: "text-emerald-600"
                  }), " LINE ID ส่วนตัว"]
                }), /* @__PURE__ */ jsx("input", {
                  type: "text",
                  name: "line_id",
                  value: profile2.line_id,
                  onChange: handleInputChange,
                  placeholder: "line-id",
                  className: "w-full px-4 py-3 bg-bg-input border border-border-default rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-gold-muted focus:ring-1 focus:ring-brand-gold-muted/20 transition-all text-sm font-semibold"
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-2 col-span-1",
                children: [/* @__PURE__ */ jsxs("label", {
                  className: "text-[10px] font-black text-text-secondary uppercase tracking-widest block flex items-center gap-1",
                  children: [/* @__PURE__ */ jsx(MessageCircle, {
                    size: 12,
                    className: "text-emerald-600"
                  }), " LINE OA ระบบทีม (ถ้ามี)"]
                }), /* @__PURE__ */ jsx("input", {
                  type: "text",
                  name: "line_oa",
                  value: profile2.line_oa,
                  onChange: handleInputChange,
                  placeholder: "@lineoa",
                  className: "w-full px-4 py-3 bg-bg-input border border-border-default rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-gold-muted focus:ring-1 focus:ring-brand-gold-muted/20 transition-all text-sm font-semibold"
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-2 col-span-2",
                children: [/* @__PURE__ */ jsxs("label", {
                  className: "text-[10px] font-black text-text-secondary uppercase tracking-widest block flex items-center gap-1",
                  children: [/* @__PURE__ */ jsx(Tv, {
                    size: 12,
                    className: "text-red-500"
                  }), " ลิงก์ช่อง YouTube / คอนเทนต์วีดีโอของคุณ"]
                }), /* @__PURE__ */ jsx("input", {
                  type: "url",
                  name: "youtube_url",
                  value: profile2.youtube_url,
                  onChange: handleInputChange,
                  placeholder: "https://youtube.com/c/yourchannel",
                  className: "w-full px-4 py-3 bg-bg-input border border-border-default rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-gold-muted focus:ring-1 focus:ring-brand-gold-muted/20 transition-all text-sm font-semibold"
                })]
              })]
            }), /* @__PURE__ */ jsx("button", {
              type: "submit",
              disabled: saving,
              className: "w-full md:w-auto px-8 py-4 btn-gold rounded-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm uppercase tracking-wider ml-auto font-semibold",
              children: saving ? /* @__PURE__ */ jsx(Loader2, {
                className: "w-5 h-5 animate-spin text-white"
              }) : /* @__PURE__ */ jsxs(Fragment, {
                children: [/* @__PURE__ */ jsx(Save, {
                  size: 16
                }), /* @__PURE__ */ jsx("span", {
                  children: "บันทึกข้อมูล"
                })]
              })
            })]
          })]
        })]
      })]
    })
  });
});
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: profile,
  loader: loader$e,
  meta: meta$e
}, Symbol.toStringTag, { value: "Module" }));
const scenariosByArea = {
  STARTUP: [{
    label: "วิธีแชร์ความประทับใจสินค้า",
    message: "วิธีแชร์ความประทับใจสินค้า U4 Innovation ให้น่าสนใจและดึงดูดผู้มุ่งหวัง"
  }, {
    label: "แนะนำ Unicorn Link ให้คนใหม่",
    message: "วิธีแนะนำระบบ Unicorn Link และ One Link ให้กับคนใหม่อย่างมืออาชีพ"
  }, {
    label: "ฝึกการนัดหมายผู้มุ่งหวัง",
    message: "ฝึกพูดเพื่อโทรนัดหมายผู้มุ่งหวังเข้าร่วมการนำเสนอโอกาสทางธุรกิจ"
  }, {
    label: "การสะสม PV ให้ถึงเป้า",
    message: "วิธีการและกลยุทธ์การสะสม PV ให้ถึงเป้าหมายระดับผู้เชี่ยวชาญ"
  }],
  SYSTEM456: [{
    label: "ฝึกพูด 5 Why เพื่อเปิดใจ",
    message: "ช่วยสอนและฝึกพูด '5 Why' เพื่อเปิดใจเปิดทางแก้ไขข้อสงสัยผู้มุ่งหวัง"
  }, {
    label: "ตอบข้อโต้แย้งเรื่องราคา",
    message: "วิธีตอบข้อโต้แย้งอย่างชาญฉลาดและนุ่มนวล เมื่อลูกค้าบอกว่าสินค้าแพงเกินไป"
  }, {
    label: "การทำ STP (เปิดโอกาสธุรกิจ)",
    message: "อธิบายวิธีกระบวนการทำ STP เพื่อเปิดใจคนใหม่ โดยเน้นการเล่าคุณค่ามากกว่าการขายตรง"
  }, {
    label: "เทคนิคการติดตาม (Follow-up)",
    message: "เทคนิคการติดตามผู้มุ่งหวังหลังจากส่งข้อมูลให้ศึกษา โดยไม่ทำให้พวกเขารู้สึกรำคาญ"
  }],
  LEADERSHIP: [{
    label: "วิธีการทำ AAR (After Action)",
    message: "วิธีการทำ AAR (After Action Review) กับทีมงานเพื่อสะท้อนผลลัพธ์และเติบโต"
  }, {
    label: "การทำ 1 on 1 กับทีมงาน",
    message: "วิธีการทำ 1 on 1 เพื่อเคลียร์เป้าหมายและสร้างพลังใจให้กับพาร์ทเนอร์ในทีม"
  }, {
    label: "การโค้ชทีมงานให้มีแรงใจ",
    message: "เทคนิคการโค้ชพาร์ทเนอร์ในระบบเพื่อดึงศักยภาพสูงสุดของพวกเขาออกมา"
  }, {
    label: "จัด House Meeting ให้มีพลัง",
    message: "วิธีการรันกิจกรรมกลุ่ม House Meeting ให้ตื่นเต้นและทรงพลังเพื่อปิดการขายระดับองค์กร"
  }],
  PERSONAL_BRAND: [{
    label: "ร่าง Bio ให้น่าเชื่อถือ",
    message: "ช่วยคิดไอเดียและร่างประวัติ Bio สั้นๆ ให้น่าดึงดูดสำหรับใส่ in นามบัตรดิจิทัล"
  }, {
    label: "คิดคำคม (Quote) ประจำตัว",
    message: "ช่วยแต่งสโลแกนหรือคำคม (Quote) ทางธุรกิจส่วนตัวสไตล์ผู้นำที่หรูหรา"
  }, {
    label: "แนะนำจุดเด่น (Expertise)",
    message: "ช่วยคิดคำโปรยบอกเล่าจุดเด่นและความเชี่ยวชาญพิเศษ (Expertise) ของฉัน"
  }, {
    label: "ร่างโปรไฟล์แบบ 3 ภาษา",
    message: "ช่วยร่างแนะนำตัวฉบับย่อ 3 ภาษา (ไทย/อังกฤษ/พม่า) สำหรับโปรโมทความเป็นมืออาชีพระดับสากล"
  }]
};
const focusOptions = [{
  id: "STARTUP",
  icon: Rocket,
  label: "Start-Up",
  emoji: "🚀"
}, {
  id: "SYSTEM456",
  icon: Shield,
  label: "System 4-5-6",
  emoji: "🔧"
}, {
  id: "LEADERSHIP",
  icon: GraduationCap,
  label: "Leadership",
  emoji: "🏆"
}, {
  id: "PERSONAL_BRAND",
  icon: User,
  label: "Branding",
  emoji: "🌟"
}];
function meta$d() {
  return [{
    title: "น้องยูนิ (AI Coach) — Unicorn Academy"
  }, {
    name: "description",
    content: "คู่ซ้อมตอบข้อโต้แย้ง ฝึกพูด STP และร่างแบรนดิ้งของพาร์ทเนอร์อัจฉริยะ"
  }];
}
async function loader$d({
  request
}) {
  const responseHeaders = new Headers();
  const {
    user,
    supabase
  } = await requireUser(request, responseHeaders);
  const {
    data: profile2
  } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return {
    profile: profile2
  };
}
const aiCoach = UNSAFE_withComponentProps(function AICoachPage() {
  var _a;
  const {
    profile: profile2
  } = useLoaderData();
  const scrollRef = useRef(null);
  const [messages, setMessages] = useState([{
    role: "model",
    content: "สวัสดีค่ะพาร์ทเนอร์! 🦄 น้องยูนิ ยินดีต้อนรับสู่ห้องฝึกฝนอัจฉริยะนะคะ\n\nวันนี้น้องยูนิพร้อมเป็นคู่หูและคู่ซ้อมตอบข้อโต้แย้ง ฝึก STP หรือร่างแบรนดิ้งให้คุณพี่แล้วค่ะ ลองเลือกหัวข้อด้านบน หรือพิมพ์คุยกับน้องยูนิได้เลยนะคะ 😊✨"
  }]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusArea, setFocusArea] = useState("SYSTEM456");
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);
  const currentScenarios = useMemo(() => scenariosByArea[focusArea], [focusArea]);
  const handleSendMessage = async (textToOverride) => {
    var _a2, _b, _c, _d, _e;
    const textToSend = textToOverride || inputText;
    if (!textToSend.trim() || isLoading) return;
    const userMessage = {
      role: "user",
      content: textToSend
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);
    try {
      const formattedHistory = [...messages, userMessage].map((m) => ({
        role: m.role,
        parts: [{
          text: m.content
        }]
      }));
      const res = await fetch("/api/ai-coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: formattedHistory
        })
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server status: ${res.status}`);
      }
      const data2 = await res.json();
      const assistantText = ((_e = (_d = (_c = (_b = (_a2 = data2.candidates) == null ? void 0 : _a2[0]) == null ? void 0 : _b.content) == null ? void 0 : _c.parts) == null ? void 0 : _d[0]) == null ? void 0 : _e.text) || "ขออภัยค่ะน้องยูนิมึนงงเล็กน้อย ไม่สามารถประมวลผลคำตอบได้ กรุณาลองส่งคำถามใหม่อีกครั้งนะคะ";
      const assistantMessage = {
        role: "model",
        content: assistantText
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("AI Coach error:", err);
      const errorMessage = err.message || "เกิดข้อผิดพลาดในการเชื่อมต่อระบบปัญญาประดิษฐ์";
      setMessages((prev) => [...prev, {
        role: "model",
        content: `🆘 ขออภัยค่ะพาร์ทเนอร์ เกิดข้อผิดพลาดดังนี้: ${errorMessage}

กรุณาลองเชื่อมต่อใหม่อีกครั้ง หรือสอบถามทีมสนับสนุนนะคะ`
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleClearChat = () => {
    if (confirm("คุณแน่ใจหรือไม่ที่จะล้างการสนทนาทั้งหมด?")) {
      setMessages([{
        role: "model",
        content: "ล้างห้องแชทเรียบร้อยแล้วค่ะ! 🦄 วันนี้น้องยูนิพร้อมช่วยให้พาร์ทเนอร์เก่งขึ้นแล้วค่ะ ลองพิมพ์คำถามหรือเลือกสถานการณ์ซ้อมได้เลยนะคะ ✨"
      }]);
    }
  };
  return /* @__PURE__ */ jsx(MemberLayout, {
    profile: profile2,
    title: "น้องยูนิ (AI Coach)",
    subtitle: "— คู่ซ้อมตอบข้อโต้แย้ง ฝึกพูด STP และร่างแบรนดิ้งของพาร์ทเนอร์อัจฉริยะ",
    children: /* @__PURE__ */ jsxs("div", {
      className: "flex flex-col h-[calc(100vh-180px)] bg-bg-card border border-border-default rounded-3xl overflow-hidden shadow-md relative font-body",
      children: [/* @__PURE__ */ jsxs("header", {
        className: "px-6 py-4 flex flex-col sm:flex-row items-center justify-between shrink-0 gap-4 border-b border-border-default bg-white relative z-10",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start",
          children: [/* @__PURE__ */ jsxs(Link, {
            to: "/dashboard",
            className: "flex items-center gap-1.5 text-text-secondary hover:text-brand-gold transition-colors font-semibold text-xs",
            children: [/* @__PURE__ */ jsx(ChevronLeft, {
              size: 16
            }), /* @__PURE__ */ jsx("span", {
              children: "แดชบอร์ด"
            })]
          }), /* @__PURE__ */ jsxs("span", {
            className: "text-emerald-700 font-bold text-xs bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full flex items-center gap-1.5 shrink-0 select-none",
            children: [/* @__PURE__ */ jsx("span", {
              className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
            }), "น้องยูนิ ออนไลน์ 24 ชม."]
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "flex bg-bg-input p-1 rounded-xl border border-border-default overflow-x-auto no-scrollbar max-w-full",
          children: focusOptions.map((f) => /* @__PURE__ */ jsxs("button", {
            onClick: () => setFocusArea(f.id),
            className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${focusArea === f.id ? "bg-brand-gold text-white shadow-sm" : "text-text-secondary hover:text-text-primary hover:bg-white/50"}`,
            children: [/* @__PURE__ */ jsx(f.icon, {
              size: 13
            }), /* @__PURE__ */ jsx("span", {
              children: f.label
            })]
          }, f.id))
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex-1 flex flex-col overflow-hidden bg-bg-page/30 relative",
        children: [/* @__PURE__ */ jsxs("div", {
          ref: scrollRef,
          className: "flex-1 overflow-y-auto p-4 md:p-6 space-y-5 custom-scrollbar",
          children: [messages.map((m, idx) => /* @__PURE__ */ jsx("div", {
            className: `flex ${m.role === "user" ? "justify-end" : "justify-start"}`,
            children: /* @__PURE__ */ jsxs("div", {
              className: `flex gap-3 max-w-[85%] ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`,
              children: [/* @__PURE__ */ jsx("div", {
                className: `w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm border ${m.role === "user" ? "bg-brand-gold border-brand-gold text-white" : "bg-white border-border-default text-brand-gold"}`,
                children: m.role === "user" ? /* @__PURE__ */ jsx(User, {
                  size: 16
                }) : /* @__PURE__ */ jsx(Bot, {
                  size: 16
                })
              }), /* @__PURE__ */ jsx("div", {
                className: `rounded-2xl p-4 text-xs md:text-sm leading-relaxed font-medium shadow-sm border ${m.role === "user" ? "bg-brand-gold text-white border-brand-gold rounded-tr-none" : "bg-white text-text-primary border-border-default rounded-tl-none"}`,
                children: /* @__PURE__ */ jsx("p", {
                  className: "whitespace-pre-wrap",
                  children: m.content
                })
              })]
            })
          }, idx)), isLoading && /* @__PURE__ */ jsxs("div", {
            className: "flex justify-start items-center gap-3",
            children: [/* @__PURE__ */ jsx("div", {
              className: "w-9 h-9 rounded-xl bg-white border border-border-default flex items-center justify-center text-brand-gold shadow-sm",
              children: /* @__PURE__ */ jsx(Bot, {
                size: 16
              })
            }), /* @__PURE__ */ jsxs("div", {
              className: "bg-white border border-border-default px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-sm",
              children: [/* @__PURE__ */ jsx("div", {
                className: "w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce"
              }), /* @__PURE__ */ jsx("div", {
                className: "w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce [animation-delay:0.2s]"
              }), /* @__PURE__ */ jsx("div", {
                className: "w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce [animation-delay:0.4s]"
              })]
            })]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "bg-white border-t border-border-default p-3 overflow-x-auto whitespace-nowrap no-scrollbar flex items-center gap-2 shrink-0",
          children: [/* @__PURE__ */ jsxs("span", {
            className: "text-[10px] font-bold text-brand-gold bg-brand-gold-light/40 px-2.5 py-1 rounded-md border border-brand-gold-muted/20 uppercase tracking-wider shrink-0 select-none",
            children: ["สถานการณ์ซ้อม ", (_a = focusOptions.find((f) => f.id === focusArea)) == null ? void 0 : _a.emoji]
          }), currentScenarios.map((s, idx) => /* @__PURE__ */ jsx("button", {
            onClick: () => handleSendMessage(s.message),
            className: "px-3.5 py-1.5 bg-white border border-border-default rounded-full text-xs font-semibold text-text-secondary hover:border-brand-gold hover:bg-brand-gold-light/20 hover:text-brand-gold transition-all duration-200 shadow-sm shrink-0",
            children: s.label
          }, idx))]
        }), /* @__PURE__ */ jsxs("div", {
          className: "p-3 md:p-4 bg-white border-t border-border-default shrink-0 flex items-center gap-3",
          children: [/* @__PURE__ */ jsx("button", {
            onClick: handleClearChat,
            className: "p-3 bg-white border border-border-strong rounded-xl text-text-muted hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all shrink-0",
            title: "ล้างประวัติการสนทนา",
            children: /* @__PURE__ */ jsx(RefreshCw, {
              size: 16
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex-1 bg-bg-input border border-border-strong rounded-xl px-4 py-2 flex items-center gap-3 focus-within:border-brand-gold focus-within:ring-1 focus-within:ring-brand-gold-light/50 transition-all",
            children: [/* @__PURE__ */ jsx("input", {
              type: "text",
              value: inputText,
              onChange: (e) => setInputText(e.target.value),
              onKeyDown: (e) => e.key === "Enter" && handleSendMessage(),
              placeholder: "พิมพ์สิ่งที่ต้องการซ้อมพูด หรือซ้อมตอบข้อโต้แย้ง...",
              className: "flex-1 bg-transparent border-none text-xs md:text-sm font-semibold text-text-primary placeholder-text-muted focus:ring-0 outline-none"
            }), /* @__PURE__ */ jsx("button", {
              onClick: () => handleSendMessage(),
              disabled: !inputText.trim() || isLoading,
              className: `p-2 rounded-lg flex items-center justify-center transition-all ${!inputText.trim() || isLoading ? "text-text-muted cursor-not-allowed bg-transparent" : "bg-brand-gold text-white hover:bg-brand-gold-hover shadow-sm"}`,
              children: /* @__PURE__ */ jsx(Send, {
                size: 14,
                className: "fill-current"
              })
            })]
          })]
        })]
      })]
    })
  });
});
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: aiCoach,
  loader: loader$d,
  meta: meta$d
}, Symbol.toStringTag, { value: "Module" }));
const WEALTH_ELEMENTS = {
  FIRE: {
    name: "ธาตุไฟ (FIRE)",
    archetype: "The Charismatic Leader",
    concept: "รวดเร็ว ร้อนแรง ทรงพลัง",
    description: "คุณคือผู้นำที่กล้าหาญ มีความกระตือรือร้นสูง และมีพลังในการสร้างแรงบันดาลใจให้ผู้อื่น",
    strengths: ["มีความเป็นผู้นำสูง", "กล้าตัดสินใจ", "มีพลังงานเหลือเฟือ", "สื่อสารได้น่าตื่นเต้น"],
    contentIdeas: ["วิดีโอสร้างแรงบันดาลใจแบบ Impact", "คอนเทนต์โชว์ผลลัพธ์ความสำเร็จทันใจ", "Live สดที่เน้นพลังงานและการตัดสินใจ"],
    recommended_products: ["DEEZE SHOT (Energy)", "Unicorn Sky Air", "Unicorn Smart Shapewear"],
    color: "from-red-50 to-orange-50 border-red-100 text-red-950",
    icon: Zap,
    themeColor: "text-red-500",
    badgeColor: "bg-red-100 text-red-700 border-red-200"
  },
  WATER: {
    name: "ธาตุน้ำ (WATER)",
    archetype: "The Empathetic Connector",
    concept: "ลื่นไหล เย็นสบาย ผูกพัน",
    description: "คุณคือยอดนักสร้างสายสัมพันธ์ มีความเห็นอกเห็นใจสูง และสามารถปรับตัวเข้ากับทุกคนได้อย่างยอดเยี่ยม",
    strengths: ["ผู้ฟังที่ดีเยี่ยม", "สร้างความเชื่อมั่นได้สูง", "มีความอดทนสูง", "ปรับตัวเก่ง"],
    contentIdeas: ["Storytelling เล่าเรื่องจากความประทับใจจริง", "คอนเทนต์ดูแลสุขภาพและการดูแลคนรอบตัว", "วิดีโอรีวิวสินค้าที่เน้นความนุ่มนวลและผลลัพธ์เชิงอารมณ์"],
    recommended_products: ["UNI COLLA", "U TENA (Eyes)", "Personal Care Products"],
    color: "from-blue-50 to-sky-50 border-blue-100 text-blue-950",
    icon: Waves,
    themeColor: "text-blue-500",
    badgeColor: "bg-blue-100 text-blue-700 border-blue-200"
  },
  EARTH: {
    name: "ธาตุดิน (EARTH)",
    archetype: "The Reliable Foundation",
    concept: "มั่นคง หนักแน่น จริงใจ",
    description: "คุณคือผู้สร้างรากฐานที่แข็งแกร่ง มีระบบระเบียบสูง และเป็นที่พึ่งพาที่ได้รับความไว้วางใจที่สุด",
    strengths: ["มีความรับผิดชอบสูง", "ทำงานเป็นระบบ", "ละเอียดรอบคอบ", "มีความสม่ำเสมอ"],
    contentIdeas: ["คอนเทนต์เจาะลึกส่วนประกอบสินค้า (Facts)", "การเปรียบเทียบแผนรายได้แบบเป็นตัวเลขชัดเจน", "คู่มือการทำธุรกิจแบบ Step-by-Step"],
    recommended_products: ["BEETLE 7 OIL", "MINA S (Weight)", "Agriculture Products (U PLANT)"],
    color: "from-amber-50 to-yellow-50 border-amber-100 text-amber-950",
    icon: Shield,
    themeColor: "text-amber-600",
    badgeColor: "bg-amber-100 text-amber-700 border-amber-200"
  },
  AIR: {
    name: "ธาตุลม (AIR)",
    archetype: "The Creative Oracle",
    concept: "อิสระ รวดเร็ว ทันสมัย",
    description: "คุณคือนักคิดสร้างสรรค์ มีไอเดียบรรเจิด และก้าวทันเทคโนโลยีเสมอ",
    strengths: ["มีความคิดสร้างสรรค์สูง", "เรียนรู้ไว", "ชอบการติดต่อสื่อสาร", "เก่งเรื่องออนไลน์"],
    contentIdeas: ["วิดีโอสั้น TikTok ที่ทันสมัยและสนุกสนาน", "การใช้ AI ช่วยทำงานให้ดู Smart", "คอนเทนต์แนวไลฟ์สไตล์ (Digital Nomad)"],
    recommended_products: ["24 FIN COFFEE", "Gadgets", "Innovation Products"],
    color: "from-purple-50 to-indigo-50 border-purple-100 text-purple-950",
    icon: Airplay,
    themeColor: "text-purple-600",
    badgeColor: "bg-purple-100 text-purple-700 border-purple-200"
  }
};
function meta$c() {
  return [{
    title: "Wealth DNA (ถอดรหัสความมั่งคั่ง) — Unicorn Academy"
  }, {
    name: "description",
    content: "ถอดรหัสพื้นดวงธาตุเจ้าเรือนเพื่อค้นหา สไตล์การสร้างความมั่งคั่ง ที่ใช่คุณ"
  }];
}
async function loader$c({
  request
}) {
  const responseHeaders = new Headers();
  const {
    user,
    supabase
  } = await requireUser(request, responseHeaders);
  const {
    data: profile2
  } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return {
    profile: profile2,
    userId: user == null ? void 0 : user.id
  };
}
const dna = UNSAFE_withComponentProps(function WealthDNAPage() {
  const {
    profile: profile2,
    userId
  } = useLoaderData();
  const navigate = useNavigate();
  const supabase = createClient();
  const [step, setStep] = useState("intro");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [analyzedElement, setAnalyzedElement] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const handleStart = () => setStep("form");
  const runAnalysis = () => {
    if (!birthDate) return;
    setStep("loading");
    setTimeout(() => {
      const date = new Date(birthDate);
      const dayOfWeek = date.getDay();
      const elements = [
        "FIRE",
        // 0: Sunday (Fire)
        "WATER",
        // 1: Monday (Water)
        "EARTH",
        // 2: Tuesday (Earth)
        "AIR",
        // 3: Wednesday (Air)
        "FIRE",
        // 4: Thursday (Fire)
        "WATER",
        // 5: Friday (Water)
        "EARTH"
        // 6: Saturday (Earth)
      ];
      const element = elements[dayOfWeek % elements.length];
      setAnalyzedElement(element);
      setStep("result");
    }, 2e3);
  };
  const handleSaveToProfile = async () => {
    if (!userId || !analyzedElement) {
      alert("กรุณาเข้าสู่ระบบก่อนเพื่อทำการบันทึกผลลงโปรไฟล์!");
      navigate("/auth/login");
      return;
    }
    setIsSaving(true);
    try {
      const {
        error
      } = await supabase.from("profiles").update({
        wealth_element: analyzedElement
      }).eq("id", userId);
      if (error) throw error;
      setSaveSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Save result error:", err);
      alert(`ไม่สามารถบันทึกได้: ${err.message || "เกิดข้อผิดพลาด"}`);
    } finally {
      setIsSaving(false);
    }
  };
  const elementData = analyzedElement ? WEALTH_ELEMENTS[analyzedElement] : null;
  return /* @__PURE__ */ jsx(MemberLayout, {
    profile: profile2,
    title: "Wealth DNA",
    subtitle: "— ถอดรหัสพื้นดวงธาตุเจ้าเรือนเพื่อค้นหา สไตล์การสร้างความมั่งคั่ง ที่ใช่คุณ",
    children: /* @__PURE__ */ jsxs("div", {
      className: "max-w-4xl mx-auto font-body text-text-primary",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center justify-between mb-6",
        children: [/* @__PURE__ */ jsxs(Link, {
          to: "/dashboard",
          className: "flex items-center gap-1.5 text-text-secondary hover:text-brand-gold font-semibold text-xs transition-colors",
          children: [/* @__PURE__ */ jsx(ChevronLeft, {
            size: 16
          }), /* @__PURE__ */ jsx("span", {
            children: "กลับหน้าแดชบอร์ด"
          })]
        }), /* @__PURE__ */ jsx("span", {
          className: "text-brand-gold font-bold tracking-wider text-[10px] uppercase bg-brand-gold-light/40 px-3 py-1 rounded-full border border-brand-gold-muted/20",
          children: "Unicorn Wealth DNA"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "card-premium p-6 md:p-10 min-h-[480px] flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-white to-bg-page border border-border-default",
        children: [/* @__PURE__ */ jsx("div", {
          className: "absolute top-0 right-0 w-72 h-72 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none"
        }), /* @__PURE__ */ jsx("div", {
          className: "absolute bottom-0 left-0 w-96 h-96 bg-brand-gold/3 rounded-full blur-3xl pointer-events-none"
        }), step === "intro" && /* @__PURE__ */ jsxs("div", {
          className: "max-w-2xl w-full text-center space-y-8 relative z-10",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "relative inline-block",
            children: [/* @__PURE__ */ jsx("div", {
              className: "text-8xl md:text-9xl select-none animate-bounce duration-1000",
              children: "🦄"
            }), /* @__PURE__ */ jsx("div", {
              className: "absolute -top-4 -right-4 animate-pulse",
              children: /* @__PURE__ */ jsx(Sparkles, {
                className: "text-brand-gold w-10 h-10"
              })
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-4",
            children: [/* @__PURE__ */ jsx("div", {
              className: "inline-flex items-center gap-2 px-4 py-1.5 bg-brand-gold-light/50 border border-brand-gold-muted/20 rounded-full text-brand-gold text-xs font-bold tracking-widest uppercase",
              children: "✨ ค้นพบรหัสลับความมั่งคั่งของคุณ"
            }), /* @__PURE__ */ jsx("h1", {
              className: "text-3xl md:text-5xl font-display text-text-primary leading-tight",
              children: "Unicorn Wealth DNA"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-sm md:text-base text-text-secondary max-w-lg mx-auto leading-relaxed",
              children: 'ถอดรหัสพื้นดวง เปิดประตูสู่ความมั่งคั่ง วิเคราะห์ธาตุเจ้าเรือนเพื่อค้นพบ "สไตล์การสร้างรายได้" ที่ทรงพลังที่สุดในแบบคุณ'
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex flex-col items-center gap-3",
            children: [/* @__PURE__ */ jsxs("button", {
              onClick: handleStart,
              className: "w-full sm:w-auto px-10 py-4 bg-brand-gold text-white font-bold text-base rounded-2xl shadow-md hover:bg-brand-gold-hover hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2",
              children: [/* @__PURE__ */ jsx(Sparkles, {
                size: 18
              }), " เริ่มต้นวิเคราะห์ DNA ", /* @__PURE__ */ jsx(ArrowRight, {
                size: 18
              })]
            }), /* @__PURE__ */ jsx("p", {
              className: "text-xs text-text-muted",
              children: "ฟรีสำหรับสมาชิกพาร์ทเนอร์ • ใช้เวลาคำนวณ 1 นาที"
            })]
          })]
        }), step === "form" && /* @__PURE__ */ jsxs("div", {
          className: "max-w-md w-full space-y-6 relative z-10",
          children: [/* @__PURE__ */ jsxs("button", {
            onClick: () => setStep("intro"),
            className: "flex items-center gap-1 text-text-secondary hover:text-brand-gold transition-colors text-sm font-semibold",
            children: [/* @__PURE__ */ jsx(ChevronLeft, {
              size: 16
            }), " กลับหน้าแรก"]
          }), /* @__PURE__ */ jsx("div", {
            className: "bg-white border border-border-default rounded-3xl p-8 shadow-sm",
            children: /* @__PURE__ */ jsxs("div", {
              className: "space-y-6",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "text-center space-y-1.5",
                children: [/* @__PURE__ */ jsx("h2", {
                  className: "text-2xl font-display text-text-primary",
                  children: "กรอกข้อมูลพื้นดวง"
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-text-muted text-xs font-semibold",
                  children: "กรุณากรอกข้อมูลวันเกิดจริงของท่านเพื่อความแม่นยำ"
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-5",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "space-y-2",
                  children: [/* @__PURE__ */ jsx("label", {
                    className: "text-[10px] font-black text-text-secondary uppercase tracking-wider block",
                    children: "วัน/เดือน/ปี เกิด"
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "relative",
                    children: [/* @__PURE__ */ jsx(Calendar, {
                      className: "absolute left-4 top-1/2 -translate-y-1/2 text-text-muted",
                      size: 18
                    }), /* @__PURE__ */ jsx("input", {
                      type: "date",
                      required: true,
                      className: "w-full pl-12 pr-4 py-3.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-bold text-sm text-text-primary",
                      value: birthDate,
                      onChange: (e) => setBirthDate(e.target.value)
                    })]
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "space-y-2",
                  children: [/* @__PURE__ */ jsx("label", {
                    className: "text-[10px] font-black text-text-secondary uppercase tracking-wider block",
                    children: "เวลาเกิด (ถ้าทราบ)"
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "relative",
                    children: [/* @__PURE__ */ jsx(Clock, {
                      className: "absolute left-4 top-1/2 -translate-y-1/2 text-text-muted",
                      size: 18
                    }), /* @__PURE__ */ jsx("input", {
                      type: "time",
                      className: "w-full pl-12 pr-4 py-3.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-bold text-sm text-text-primary",
                      value: birthTime,
                      onChange: (e) => setBirthTime(e.target.value)
                    })]
                  })]
                })]
              }), /* @__PURE__ */ jsx("button", {
                onClick: runAnalysis,
                disabled: !birthDate,
                className: `w-full py-4.5 rounded-xl font-bold text-base transition-all ${birthDate ? "bg-brand-gold text-white hover:bg-brand-gold-hover shadow-sm" : "bg-bg-input text-text-muted cursor-not-allowed border border-border-default"}`,
                children: "วิเคราะห์รหัสความมั่งคั่ง"
              })]
            })
          })]
        }), step === "loading" && /* @__PURE__ */ jsxs("div", {
          className: "text-center space-y-6 relative z-10",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "relative inline-block",
            children: [/* @__PURE__ */ jsx("div", {
              className: "w-24 h-24 border-4 border-brand-gold-light border-t-brand-gold rounded-full animate-spin"
            }), /* @__PURE__ */ jsx(Bot, {
              className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-gold animate-bounce",
              size: 28
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-1",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-lg font-bold text-brand-gold",
              children: "กำลังประมวลผลระบบดวงชะตานักธุรกิจ..."
            }), /* @__PURE__ */ jsx("p", {
              className: "text-text-muted text-xs italic",
              children: "Nong Uni AI Coach is calculating your Wealth DNA"
            })]
          })]
        }), step === "result" && elementData && /* @__PURE__ */ jsxs("div", {
          className: "max-w-3xl w-full space-y-6 relative z-10 py-4",
          children: [/* @__PURE__ */ jsx("div", {
            className: `rounded-3xl p-6 md:p-10 bg-gradient-to-br border shadow-sm relative overflow-hidden ${elementData.color}`,
            children: /* @__PURE__ */ jsxs("div", {
              className: "relative z-10 flex flex-col md:flex-row items-center gap-6",
              children: [/* @__PURE__ */ jsx("div", {
                className: "w-24 h-24 md:w-28 md:h-28 bg-white border border-border-default rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                children: /* @__PURE__ */ jsx(elementData.icon, {
                  className: `w-12 h-12 md:w-16 md:h-16 ${elementData.themeColor}`
                })
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex-1 text-center md:text-left space-y-2",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: `inline-block px-3 py-1 rounded-full font-black text-[10px] tracking-wider uppercase border ${elementData.badgeColor}`,
                  children: ["Archetype: ", elementData.archetype]
                }), /* @__PURE__ */ jsx("h1", {
                  className: "text-3xl md:text-4xl font-display text-text-primary",
                  children: elementData.name
                }), /* @__PURE__ */ jsxs("p", {
                  className: "text-base font-bold text-brand-gold italic",
                  children: ['"', elementData.concept, '"']
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-xs md:text-sm text-text-secondary leading-relaxed",
                  children: elementData.description
                })]
              })]
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "grid md:grid-cols-3 gap-6",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "bg-white border border-border-default p-6 rounded-2xl space-y-4 shadow-sm",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "flex items-center gap-1.5 text-emerald-700 font-bold text-xs uppercase tracking-wider",
                children: [/* @__PURE__ */ jsx(CheckCircle2, {
                  size: 16
                }), " จุดแข็งของคุณ"]
              }), /* @__PURE__ */ jsx("ul", {
                className: "space-y-2.5",
                children: elementData.strengths.map((s, idx) => /* @__PURE__ */ jsxs("li", {
                  className: "flex gap-2 text-xs text-text-secondary leading-relaxed",
                  children: [/* @__PURE__ */ jsx("div", {
                    className: "mt-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0"
                  }), /* @__PURE__ */ jsx("span", {
                    children: s
                  })]
                }, idx))
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "bg-white border border-border-default p-6 rounded-2xl space-y-4 shadow-sm",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "flex items-center gap-1.5 text-indigo-700 font-bold text-xs uppercase tracking-wider",
                children: [/* @__PURE__ */ jsx(Lightbulb, {
                  size: 16
                }), " กลยุทธ์การตลาด"]
              }), /* @__PURE__ */ jsxs("p", {
                className: "text-text-secondary text-xs leading-relaxed bg-bg-input p-3 rounded-xl border border-border-default italic",
                children: ['"', elementData.strengths[0], " โฟกัสแนวคิด ", elementData.concept, '"']
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-1.5",
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-[9px] font-black text-text-muted uppercase tracking-wider",
                  children: "คอนเทนต์ที่เหมาะสม"
                }), elementData.contentIdeas.map((c, idx) => /* @__PURE__ */ jsxs("div", {
                  className: "bg-bg-input p-2 rounded-lg border border-border-muted text-[10px] text-text-secondary font-semibold",
                  children: ["💡 ", c]
                }, idx))]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "bg-white border border-border-default p-6 rounded-2xl space-y-4 shadow-sm",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "flex items-center gap-1.5 text-brand-gold font-bold text-xs uppercase tracking-wider",
                children: [/* @__PURE__ */ jsx(ShoppingBag, {
                  size: 16
                }), " สินค้าตามธาตุ"]
              }), /* @__PURE__ */ jsx("div", {
                className: "space-y-2",
                children: elementData.recommended_products.map((p, idx) => /* @__PURE__ */ jsxs("div", {
                  className: "flex items-center justify-between p-2.5 bg-bg-input rounded-xl border border-border-muted hover:border-brand-gold-muted hover:bg-white transition-all cursor-default",
                  children: [/* @__PURE__ */ jsx("span", {
                    className: "font-semibold text-[11px] text-text-primary",
                    children: p
                  }), /* @__PURE__ */ jsx(ChevronRight, {
                    size: 12,
                    className: "text-brand-gold"
                  })]
                }, idx))
              }), /* @__PURE__ */ jsx(Link, {
                to: "/products",
                className: "w-full text-center block text-[10px] font-bold text-brand-gold hover:underline pt-2 uppercase",
                children: "ดูรายละเอียดสินค้า →"
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex flex-col sm:flex-row gap-4 pt-2",
            children: [/* @__PURE__ */ jsxs("button", {
              onClick: handleSaveToProfile,
              disabled: isSaving || saveSuccess,
              className: `flex-1 py-4 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 group ${saveSuccess ? "bg-emerald-600 text-white cursor-default" : "bg-brand-gold text-white hover:bg-brand-gold-hover hover:scale-[1.01]"}`,
              children: [/* @__PURE__ */ jsx(CheckCircle2, {
                size: 18
              }), /* @__PURE__ */ jsx("span", {
                children: isSaving ? "กำลังบันทึก..." : saveSuccess ? "บันทึกผลดวงสำเร็จแล้ว! 🦄" : "บันทึกข้อมูลธาตุลงในโปรไฟล์"
              }), !saveSuccess && /* @__PURE__ */ jsx(ChevronRight, {
                size: 18,
                className: "group-hover:translate-x-0.5 transition-transform"
              })]
            }), /* @__PURE__ */ jsxs("button", {
              onClick: () => {
                navigator.clipboard.writeText(`ผลดวงนักธุรกิจระดับผู้นำ! ฉันวิเคราะห์ดวงได้ธาตุ "${elementData.name}" แห่งระบบพาร์ทเนอร์อัจฉริยะแล้วนะ ค้นหา Wealth DNA ของคุณฟรีได้ที่นี่!`);
                alert("คัดลอกข้อความแชร์ไปยังคลิปบอร์ดแล้วครับ!");
              },
              className: "px-6 py-4 bg-white border border-border-strong text-text-secondary rounded-xl font-bold text-sm hover:bg-bg-input transition-all flex items-center justify-center gap-2",
              children: [/* @__PURE__ */ jsx(Share2, {
                size: 18
              }), " แชร์ผลลัพธ์"]
            })]
          })]
        })]
      })]
    })
  });
});
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: dna,
  loader: loader$c,
  meta: meta$c
}, Symbol.toStringTag, { value: "Module" }));
const DEFAULT_MISSIONS = [{
  ubc_level: 1,
  title: "ถอดรหัสธุรกิจ: วิสัยทัศน์ แผนรายได้ 8 ช่องทาง และ 5 WHY ส่วนตัว",
  description: "ทำความเข้าใจวิสัยทัศน์บริษัท สินค้า U5 และการทำงานของแผนรายได้ 8 ช่องทาง พร้อมวิเคราะห์เหตุผล 5 WHY ของตนเอง เพื่อสร้างแรงบันดาลใจที่มั่นคงสำหรับการเริ่มต้นธุรกิจ [ปลดล็อค: Retail Bonus ช่องทางที่ 1]",
  category: "MINDSET",
  reward_points: 100
}, {
  ubc_level: 1,
  title: "Product Storytelling & STP สร้างรายได้จากการสนทนาคนแรกได้เลย",
  description: "ฝึกเล่าเรื่องสินค้า U5 ใน 60 วินาที + สร้างสคริปต์บทพูดแนะนำธุรกิจเป็นรายแรกของตนเองด้วยเทคนิค STP (70/30) เพื่อเริ่มทำรายได้จากการขายได้ทันที [ปลดล็อค: Retail Bonus + Fast Start Bonus]",
  category: "SKILLSET",
  reward_points: 150
}, {
  ubc_level: 1,
  title: "เปิดใช้งาน Unicorn Smart AI ครบชุด: นามบัตร แดชบอร์ด และ AI Coach น้องยูนิ",
  description: "ตั้งค่าโปรไฟล์ธุรกิจ สร้างนามบัตรดิจิทัลส่วนตัว ดูสถิติ Dashboard เป็นครั้งแรก และซ้อม 3 Scenario กับ AI Coach น้องยูนิ: ขายสินค้า / แนะนำธุรกิจ / ตอบข้อโต้แย้ง [ปลดล็อค: ทุกช่องทางรายได้]",
  category: "TOOLSET",
  reward_points: 200
}, {
  ubc_level: 2,
  title: "Personal Brand Audit & Wealth DNA สร้างตัวตนที่ AI ลอกไม่ได้",
  description: "วิเคราะห์ Wealth DNA + กำหนด Brand Archetype ที่เป็นเอกลักษณ์ของตัวเอง เขียน Brand Story Before-After-Mission เพื่อเป็นหัวใจ Content ทุกชิ้น (เสียง+หน้า = สิ่งที่ AI ลอกไม่ได้) [ปลดล็อค: Lead Quality สูงขึ้น + Fast Start Bonus]",
  category: "MINDSET",
  reward_points: 200
}, {
  ubc_level: 2,
  title: "TikTok/Reels Content + Lead Funnel + AI เป็นผู้ช่วย ไม่ใช่ตัวแทน",
  description: "สร้าง Video 3 แบบ (ไลฟ์สไตล์ / รีวิวสินค้า / ทำไมถึงยูนิคอร์น) โดยใช้ AI ช่วยวางแผน Caption แต่หน้าตาและเสียงยังเป็นตัวเอง พร้อมตั้ง Lead Funnel: Content → Link → นามบัตร → Close [ปลดล็อค: Retail + Fast Start Bonus ช่องทาง 1-2]",
  category: "SKILLSET",
  reward_points: 250
}, {
  ubc_level: 2,
  title: "Balance Team Builder & One Link System เริ่มสร้างทีมสองสาย",
  description: "วางแผนสร้างทีม 2 สาย (ซ้าย-ขวา) และใช้ One Link ส่วนตัวเชื่อมต่อ Lead แบบที่ปรึกษา 70/30 เพื่อแนะนำคนเข้าธุรกิจอย่างมีคุณภาพ วัดผลการแนะนำ และคำนวณ PV เพื่อปลดล็อค Balance Team Bonus [ปลดล็อค: Balance Team Bonus ช่องทาง 3]",
  category: "TOOLSET",
  reward_points: 300
}, {
  ubc_level: 3,
  title: "Multiplying System: 4-5-6 & Train the Trainer สอน 1 คน = ขยาย 10 เท่า",
  description: "เข้าใจระบบผลประโยชน์แบบ Matching Bonus 5 ชั้น และออกแบบระบบ Train the Trainer เพื่อสอนงานคนให้สอนได้ต่อ พร้อมทำ AAR เชิงกลยุทธ์ทุก 2 สัปดาห์ [ปลดล็อค: Matching Bonus ช่องทาง 4]",
  category: "MINDSET",
  reward_points: 400
}, {
  ubc_level: 3,
  title: "Leadership Coaching และ Data-Driven Analytics วิเคราะห์ทีม",
  description: "ฝึกฝนจิตวิทยาการโค้ชชิ่งผู้นำเพื่อบริหารครองใจองค์กร พร้อมประเมินผลลัพธ์ผ่านระบบ Dashboard Data Analytics ในการวิเคราะห์และคัดกรองพาร์ทเนอร์สร้าง 5 Core Leaders เพื่อขับเคลื่อนธุรกิจร่วมกัน",
  category: "SKILLSET",
  reward_points: 450
}, {
  ubc_level: 3,
  title: "การติดตั้ง Agent AI ส่วนตัวลงบน LINE OA และการซัพพอร์ตระบบแบบ 24 ชั่วโมง",
  description: "เชื่อมต่อผู้ช่วยปัญญาประดิษฐ์ (Uni Agent AI) เข้ากับ Line Official Account ของตนเองเพื่อช่วยเหลือตอบคำถามและสนับสนุนลูกทีมอย่างเป็นระบบตลอดเวลา",
  category: "TOOLSET",
  reward_points: 500
}, {
  ubc_level: 4,
  title: "ระบบ Onboarding 90 วันและการแก้ปัญหาความขัดแย้งในองค์กรใหญ่",
  description: "ออกแบบระบบ Journey Architect ต้อนรับพาร์ทเนอร์ใหม่ 90 วัน พร้อมเรียนรู้จิตวิทยาบริหารและแก้ความขัดแย้งในองค์กรธุรกิจที่เติบโตขึ้น",
  category: "MINDSET",
  reward_points: 800
}, {
  ubc_level: 4,
  title: "การจัด High-Impact Workshops และการสอนระบบบริษัท",
  description: "จัดเวิร์คช็อปและสัมมนาแคมป์เพื่อขับเคลื่อนทีม พร้อมศึกษาการใช้และถ่ายทอดวิธีใช้งานระบบหลังบ้านบริษัท (Platform Admin & Tools) รวมถึงระบบเชื่อมต่ออัตโนมัติ",
  category: "SKILLSET",
  reward_points: 1e3
}, {
  ubc_level: 4,
  title: "Servant Leadership และการวางกลยุทธ์ขยายแบรนด์ระดับสากล",
  description: "ทำหน้าที่ผู้นำรับใช้ (Servant Leadership) ในการสร้างวิสัยทัศน์และการวางแผนกลยุทธ์ระดับสากล (Global Scaling) ร่วมกับบอร์ดบริหาร",
  category: "TOOLSET",
  reward_points: 1200
}];
const LEVEL_SPECIFICATIONS = {
  1: {
    id: 1,
    badge: "UBC 1: FOUNDATION (รากฐาน)",
    role: "UBC — Super Star Elite",
    income: "500 – 15,000 บาท/เดือน",
    desc: "รากฐานการขายและการใช้เครื่องมือดิจิทัลเบื้องต้น มุ่งเน้นการเริ่มต้นและเรียนรู้วิธีการทำงาน",
    highlights: {
      mindset: ["ถอดรหัสธุรกิจ: วิสัยทัศน์ & โมเดล U-LINK U-SHARE U-SUCCESS", "สินค้า U5: เข้าใจคุณค่าจริง ทดลองใช้เอง เปิดความเชื่อเพื่อขายได้จริง", "แผนรายได้ 8 ช่องทาง: คำนวณ Retail Bonus จากการขาย 5-10 กล่อง/สัปดาห์", "5 WHY: วิเคราะห์เหตุผลส่วนตัวเพื่อสร้างแรงบันดาลใจไม่หยุด"],
      skillset: ["Product Storytelling 60 วินาที: เล่าเรื่องสินค้าไม่อ่านสคริปต์ พูดได้เอง", "STP สคริปต์คนแรก: บทพูดเปิดการสนทนาและติดตาม Close Sale (70/30)", "ซ้อม AI Coach น้องยูนิ 5 Scenario: ขาย / แนะนำ / ตอบข้อโต้แย้ง"],
      toolset: ["Unicorn Dashboard: อ่านสถิติ PV / ทีมซ้าย-ขวา / ความก้าวหน้า", "AI Coach น้องยูนิ: ฝึกพูด-ตอบได้ทุกที่ ไม่ต้องเขินใจคนอื่น", "นามบัตรดิจิทัล + ลิงค์ส่วนตัว: สร้าง + แชร์ได้ทันที"]
    }
  },
  2: {
    id: 2,
    badge: "UBC 2: SPECIALIST (ผู้เชี่ยวชาญ)",
    role: "UBC — Marketing Specialist",
    income: "15,000 – 50,000 บาท/เดือน",
    desc: "สร้างตัวตนที่ AI ลอกไม่ได้ + ดึง Lead อัตโนมัติ + เริ่มสร้างทีม ปลดล็อค Balance Team Bonus",
    highlights: {
      mindset: ["Personal Brand Audit & Wealth DNA (เอกลักษณ์ที่ AI ลอกไม่ได้)", "Brand Story Before-After-Mission (เล่าเรื่องจริงของตัวเอง)", "Digital Asset Mindset: Network = สินทรัพย์ดิจิทัลที่แท้จริง"],
      skillset: ["TikTok/Reels (หน้าตัวเอง + AI ช่วยวางแผน ไม่ใช่ตัวแทน)", "Lead Funnel: Content → Link → นามบัตร → Close", "Sponsoring 70/30: แนะนำ 2 คน/เดือน คุณภาพเหนือปริมาณ"],
      toolset: ["One Link Mastery: วัด Click → คำนวณ Fast Start Bonus", "Balance Team Architecture: วางคนซ้าย-ขวา PV สมดุล 60,000/วัน", "Digital Name Card Pro: Video + Link สินค้า + Portfolio ผลลัพธ์"]
    }
  },
  3: {
    id: 3,
    badge: "UBC 3: STRATEGIC (นักกลยุทธ์)",
    role: "UBC — Team Strategist",
    income: "50,000 – 300,000 บาท/เดือน",
    desc: "ทีมงานทำเป็นระบบ + Matching Bonus ลึก 5 ชั้น + Uni-Level Passive Income จากเครือข่ายผู้บริโภค 10-30 ชั้น",
    highlights: {
      mindset: ["Multiplying Mindset: สอน 1 คน = รายได้ Matching 5 ชั้น", "AAR เชิงกลยุทธ์: ประเมินผลทีมทุก 2 สัปดาห์ ปรับแก้เป็นระบบ", "Growth Multiplication: คำนวณ Matching Bonus 5 ชั้น = รายได้ทวีคูณ"],
      skillset: ["Leadership Coaching 1:1 (4 ครั้ง/เดือน วัด: ลูกทีมขึ้น Level)", "Data Analytics: คัดกรอง Active/โค้ช/ปล่อย สร้าง 5 Core Leaders", "Consumer Network: Follow-up สมาชิก U1-U3 สร้าง Uni-Level Bonus"],
      toolset: ["Agent AI LINE OA: ตอบ FAQ อัตโนมัติ 24 ชม. (AI ช่วย ไม่ใช่แทน)", "Dropship System: ลูกทีมสั่งซื้อและรับ Dropship Bonus 10%"]
    }
  },
  4: {
    id: 4,
    badge: "UBC 4: MASTER (ปรมาจารย์)",
    role: "UBC — Master Leader",
    income: "300,000 – 3,000,000+ บาท/เดือน",
    desc: "ระบบทำงานเอง + Global Bonus 6% จากยอดขายทั่วโลก + Travel Reward ระดับ 5 ดาว",
    highlights: {
      mindset: ["Servant Leadership: สร้างวัฒนธรรมองค์กรย่อย (Culture/Values/Mission)", "Conflict Resolution: แก้ความขัดแย้งองค์กรใหญ่ด้วย Structured Dialog", "Journey Architect: Onboarding 30-60-90 วันสำหรับองค์กรตนเอง"],
      skillset: ["High-Impact Workshop (20+ คน 3-4 ชม. วัดผลได้ภายใน 2 สัปดาห์)", "Global Strategy: ขยายทีมข้ามประเทศ AEC + Global Bonus 6%", "AI Workflow Automation: n8n/Make Lead→Onboard→Follow-up"],
      toolset: ["Corporate AI Knowledge Base: องค์กรเรียนรู้เองผ่าน AI", "Unicorn Platform Admin: ดูแล Global Network ระดับสากล", "Travel Reward Target: วางแผนพิชิตรางวัล 5 ดาวไต้มือด้วยทีม"]
    }
  }
};
function meta$b() {
  return [{
    title: "โปรแกรมพัฒนา UBC (กระดานภารกิจ) — Unicorn Academy"
  }, {
    name: "description",
    content: "เส้นทางการเรียนรู้และภารกิจเพื่อก้าวสู่ที่ปรึกษาการตลาดมืออาชีพ"
  }];
}
async function loader$b({
  request
}) {
  const responseHeaders = new Headers();
  const {
    user,
    supabase
  } = await requireUser(request, responseHeaders);
  const {
    data: profile2
  } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const {
    data: dbMissions
  } = await supabase.from("missions").select("*").order("ubc_level", {
    ascending: true
  });
  const {
    data: userMissions
  } = await supabase.from("user_missions").select("*").eq("profile_id", user.id);
  return {
    profile: profile2,
    userId: user.id,
    initialMissions: dbMissions || [],
    initialUserMissions: userMissions || []
  };
}
const missions = UNSAFE_withComponentProps(function MissionsPage() {
  const {
    profile: serverProfile,
    userId,
    initialMissions,
    initialUserMissions
  } = useLoaderData();
  useNavigate();
  const supabase = createClient();
  const [profile2, setProfile] = useState(serverProfile);
  const [missions2, setMissions] = useState([]);
  const [userMissions, setUserMissions] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [processingId, setProcessingId] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});
  useEffect(() => {
    const resolvedMissions = initialMissions.length > 0 ? initialMissions : DEFAULT_MISSIONS.map((m, i) => ({
      ...m,
      id: `default-${i}`
    }));
    setMissions(resolvedMissions);
    setUserMissions(initialUserMissions);
    if (serverProfile) {
      setActiveTab(serverProfile.ubc_level ?? 1);
    }
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ubc_checked_items");
      if (saved) {
        try {
          setCheckedItems(JSON.parse(saved));
        } catch (e) {
          console.error("Error parsing checklist:", e);
        }
      }
    }
  }, [initialMissions, initialUserMissions, serverProfile]);
  const handleStartMission = async (missionId) => {
    if (!userId) return;
    setProcessingId(missionId);
    try {
      const {
        data: data2,
        error
      } = await supabase.from("user_missions").insert({
        profile_id: userId,
        mission_id: missionId,
        status: "IN_PROGRESS"
      }).select().single();
      if (error) throw error;
      setUserMissions((prev) => [...prev, data2]);
    } catch (err) {
      alert(`ไม่สามารถเริ่มภารกิจได้: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };
  const handleCompleteMission = async (missionId, rewardPoints, missionTitle) => {
    if (!userId || !profile2) return;
    setProcessingId(missionId);
    try {
      const {
        data: data2,
        error
      } = await supabase.from("user_missions").update({
        status: "COMPLETED",
        completed_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("profile_id", userId).eq("mission_id", missionId).select().single();
      if (error) throw error;
      const newPoints = (profile2.business_points ?? 0) + rewardPoints;
      const {
        error: profileError
      } = await supabase.from("profiles").update({
        business_points: newPoints
      }).eq("id", userId);
      if (profileError) throw profileError;
      setProfile((prev) => prev ? {
        ...prev,
        business_points: newPoints
      } : null);
      setUserMissions((prev) => prev.map((um) => um.mission_id === missionId ? {
        ...um,
        status: "COMPLETED"
      } : um));
      await fetch("/api/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: "mission_complete",
          payload: {
            name: profile2.display_name || profile2.full_name || "นักธุรกิจยูนิคอร์น",
            missionTitle,
            points: rewardPoints
          }
        })
      }).catch((err) => console.error("Line notify error:", err));
      alert(`🎉 ยินดีด้วยครับ! คุณส่งภารกิจสำเร็จและรับ +${rewardPoints} คะแนนเรียบร้อยแล้ว!`);
    } catch (err) {
      alert(`ไม่สามารถส่งภารกิจได้: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };
  const handleCheckChange = (lvl, pillar, index, isChecked) => {
    const key = `ubc_${lvl}_${pillar}_${index}`;
    const newChecked = {
      ...checkedItems,
      [key]: isChecked
    };
    setCheckedItems(newChecked);
    localStorage.setItem("ubc_checked_items", JSON.stringify(newChecked));
  };
  const currentLevelInfo = LEVEL_SPECIFICATIONS[activeTab];
  const totalMissionsCount = missions2.length || 12;
  const totalCompletedMissionsCount = userMissions.filter((um) => um.status === "COMPLETED" || um.status === "VERIFIED").length;
  const overallProgressPercent = Math.round(totalCompletedMissionsCount / totalMissionsCount * 100);
  const getProgressByLevel = (lvl) => {
    const info = LEVEL_SPECIFICATIONS[lvl];
    const totalItems = info.highlights.mindset.length + info.highlights.skillset.length + info.highlights.toolset.length;
    let checkedCount = 0;
    info.highlights.mindset.forEach((_, idx) => {
      if (checkedItems[`ubc_${lvl}_mindset_${idx}`]) checkedCount++;
    });
    info.highlights.skillset.forEach((_, idx) => {
      if (checkedItems[`ubc_${lvl}_skillset_${idx}`]) checkedCount++;
    });
    info.highlights.toolset.forEach((_, idx) => {
      if (checkedItems[`ubc_${lvl}_toolset_${idx}`]) checkedCount++;
    });
    return totalItems > 0 ? Math.round(checkedCount / totalItems * 100) : 0;
  };
  const currentLvlCheckProgressPercent = getProgressByLevel(activeTab);
  const totalLvlCheckItemsCount = currentLevelInfo.highlights.mindset.length + currentLevelInfo.highlights.skillset.length + currentLevelInfo.highlights.toolset.length;
  const getCheckedCountForActiveTab = () => {
    let count = 0;
    currentLevelInfo.highlights.mindset.forEach((_, idx) => {
      if (checkedItems[`ubc_${activeTab}_mindset_${idx}`]) count++;
    });
    currentLevelInfo.highlights.skillset.forEach((_, idx) => {
      if (checkedItems[`ubc_${activeTab}_skillset_${idx}`]) count++;
    });
    currentLevelInfo.highlights.toolset.forEach((_, idx) => {
      if (checkedItems[`ubc_${activeTab}_toolset_${idx}`]) count++;
    });
    return count;
  };
  const checkedLvlCount = getCheckedCountForActiveTab();
  return /* @__PURE__ */ jsx(MemberLayout, {
    profile: profile2,
    title: "โปรแกรม UBC",
    subtitle: "— เส้นทางการเรียนรู้และโรดแมปการทำภารกิจเพื่อก้าวสู่ที่ปรึกษาการตลาดมืออาชีพ",
    children: /* @__PURE__ */ jsxs("div", {
      className: "max-w-5xl mx-auto space-y-6 font-body text-text-primary",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center justify-between",
        children: [/* @__PURE__ */ jsxs(Link, {
          to: "/dashboard",
          className: "flex items-center gap-1.5 text-text-secondary hover:text-brand-gold font-semibold text-xs transition-colors",
          children: [/* @__PURE__ */ jsx(ChevronLeft, {
            size: 16
          }), /* @__PURE__ */ jsx("span", {
            children: "กลับหน้าแดชบอร์ด"
          })]
        }), /* @__PURE__ */ jsx("div", {
          children: /* @__PURE__ */ jsxs("span", {
            className: "text-brand-gold font-bold text-xs bg-brand-gold-light/40 border border-brand-gold-muted/20 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm",
            children: ["🏆 UBC Point: ", /* @__PURE__ */ jsx("span", {
              className: "font-black",
              children: ((profile2 == null ? void 0 : profile2.business_points) ?? 0).toLocaleString()
            }), " PT"]
          })
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "relative rounded-3xl overflow-hidden shadow-md bg-gradient-to-br from-brand-dark to-[#2c1d0c] text-white",
        children: [/* @__PURE__ */ jsx("div", {
          className: "absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none"
        }), /* @__PURE__ */ jsxs("div", {
          className: "p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "space-y-2 text-center md:text-left",
            children: [/* @__PURE__ */ jsx("div", {
              className: "inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/20 border border-brand-gold/30 text-brand-gold-light rounded-full text-[10px] font-black uppercase tracking-wider",
              children: "🎓 Unicorn Academy"
            }), /* @__PURE__ */ jsx("h1", {
              className: "text-2xl md:text-3xl font-display text-white leading-tight",
              children: "โปรแกรมพัฒนา UBC"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-xs md:text-sm text-gray-300 max-w-xl leading-relaxed",
              children: "เส้นทางการเรียนรู้ที่ปรึกษาการตลาดออนไลน์ครบวงจร 4 ระดับ ประเมินผลลัพธ์การกระทำจริงเพื่อพิชิตเป้าหมายรายได้และตำแหน่งทางธุรกิจ Step-by-Step"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 shrink-0 w-full md:w-auto shadow-inner",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "relative w-16 h-16 flex items-center justify-center shrink-0",
              children: [/* @__PURE__ */ jsxs("svg", {
                className: "w-full h-full transform -rotate-90",
                children: [/* @__PURE__ */ jsx("circle", {
                  cx: "32",
                  cy: "32",
                  r: "28",
                  className: "stroke-white/10 fill-none",
                  strokeWidth: "5"
                }), /* @__PURE__ */ jsx("circle", {
                  cx: "32",
                  cy: "32",
                  r: "28",
                  className: "stroke-brand-gold fill-none transition-all duration-1000 ease-out",
                  strokeWidth: "5",
                  strokeDasharray: "175.9",
                  strokeDashoffset: 175.9 - 175.9 * overallProgressPercent / 100
                })]
              }), /* @__PURE__ */ jsxs("span", {
                className: "absolute text-xs font-black text-white",
                children: [overallProgressPercent, "%"]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("div", {
                className: "text-[9px] text-brand-gold-light font-bold uppercase tracking-wider",
                children: "ความก้าวหน้ารวม"
              }), /* @__PURE__ */ jsxs("div", {
                className: "text-xs font-black text-white mt-0.5",
                children: ["ระดับปัจจุบัน: ", /* @__PURE__ */ jsxs("span", {
                  className: "text-brand-gold",
                  children: ["UBC ", (profile2 == null ? void 0 : profile2.ubc_level) ?? 1]
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "text-[10px] text-gray-400 mt-0.5",
                children: ["สำเร็จ ", totalCompletedMissionsCount, " จาก ", totalMissionsCount, " ภารกิจหลัก"]
              })]
            })]
          })]
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "grid grid-cols-2 md:grid-cols-4 gap-3",
        children: [1, 2, 3, 4].map((lvl) => {
          const lvlProgress = getProgressByLevel(lvl);
          const isActive = activeTab === lvl;
          return /* @__PURE__ */ jsxs("button", {
            onClick: () => setActiveTab(lvl),
            className: `card-base bg-white border rounded-2xl p-4 text-left transition-all relative ${isActive ? "border-brand-gold ring-2 ring-brand-gold-light/40 shadow-sm translate-y-[-1px]" : "border-border-default hover:border-brand-gold-muted hover:bg-bg-input"}`,
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between mb-2",
              children: [/* @__PURE__ */ jsxs("span", {
                className: "text-[9px] font-black text-text-muted uppercase tracking-wider",
                children: ["UBC LEVEL ", lvl]
              }), /* @__PURE__ */ jsx("span", {
                className: `w-2 h-2 rounded-full ${lvlProgress === 100 ? "bg-emerald-500" : lvlProgress > 0 ? "bg-amber-500" : "bg-slate-300"}`
              })]
            }), /* @__PURE__ */ jsx("div", {
              className: "text-xs font-black text-text-primary truncate",
              children: lvl === 1 ? "1. Foundation" : lvl === 2 ? "2. Specialist" : lvl === 3 ? "3. Strategic" : "4. Master"
            }), /* @__PURE__ */ jsxs("div", {
              className: "mt-3 space-y-1",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "flex items-center justify-between text-[9px] text-text-muted font-bold",
                children: [/* @__PURE__ */ jsx("span", {
                  children: "ความสำเร็จ"
                }), /* @__PURE__ */ jsxs("span", {
                  children: [lvlProgress, "%"]
                })]
              }), /* @__PURE__ */ jsx("div", {
                className: "progress-track bg-brand-gold-light/30 h-1 rounded-full overflow-hidden",
                children: /* @__PURE__ */ jsx("div", {
                  className: "progress-fill bg-brand-gold h-full rounded-full transition-all duration-500",
                  style: {
                    width: `${lvlProgress}%`
                  }
                })
              })]
            })]
          }, lvl);
        })
      }), /* @__PURE__ */ jsx("div", {
        className: "card-premium bg-white border border-border-default rounded-3xl p-5 md:p-6 shadow-sm",
        children: /* @__PURE__ */ jsxs("div", {
          className: "flex flex-col lg:flex-row gap-6 justify-between",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "space-y-4 max-w-sm",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "inline-flex gap-2 items-center bg-brand-gold-light/40 border border-brand-gold-muted/20 text-brand-gold px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm",
              children: [/* @__PURE__ */ jsx(Award, {
                size: 14
              }), " ", currentLevelInfo.badge]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("span", {
                className: "text-[10px] text-text-muted uppercase font-bold tracking-wider",
                children: "ตำแหน่งทางธุรกิจ"
              }), /* @__PURE__ */ jsx("h3", {
                className: "text-sm font-bold text-text-primary mt-0.5",
                children: currentLevelInfo.role
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("span", {
                className: "text-[10px] text-text-muted uppercase font-bold tracking-wider",
                children: "เป้าหมายรายได้เฉลี่ย"
              }), /* @__PURE__ */ jsx("h2", {
                className: "text-xl md:text-2xl font-display font-black text-brand-gold mt-0.5",
                children: currentLevelInfo.income
              })]
            }), /* @__PURE__ */ jsx("p", {
              className: "text-xs text-text-secondary leading-relaxed italic",
              children: currentLevelInfo.desc
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex-1 bg-bg-input border border-border-default rounded-2xl p-4 md:p-5 flex flex-col justify-between",
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsxs("div", {
                className: "flex items-center justify-between mb-4 border-b border-border-default pb-2",
                children: [/* @__PURE__ */ jsx("span", {
                  className: "text-[10px] font-black text-text-muted uppercase tracking-wider",
                  children: "เช็คลิสต์หัวข้อเรียนรู้และปฏิบัติ"
                }), /* @__PURE__ */ jsxs("span", {
                  className: "text-[10px] font-bold text-brand-gold bg-brand-gold-light/40 border border-brand-gold-muted/10 px-2 py-0.5 rounded-full",
                  children: ["ผ่านแล้ว ", currentLvlCheckProgressPercent, "% (", checkedLvlCount, "/", totalLvlCheckItemsCount, " ข้อ)"]
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "grid md:grid-cols-3 gap-4",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "space-y-2.5",
                  children: [/* @__PURE__ */ jsx("div", {
                    className: "text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-1",
                    children: "🧠 MINDSET"
                  }), /* @__PURE__ */ jsx("div", {
                    className: "space-y-2",
                    children: currentLevelInfo.highlights.mindset.map((item, idx) => {
                      const key = `ubc_${activeTab}_mindset_${idx}`;
                      const isChecked = !!checkedItems[key];
                      return /* @__PURE__ */ jsxs("label", {
                        className: "flex items-start gap-2 cursor-pointer select-none group",
                        children: [/* @__PURE__ */ jsx("input", {
                          type: "checkbox",
                          checked: isChecked,
                          onChange: (e) => handleCheckChange(activeTab, "mindset", idx, e.target.checked),
                          className: "mt-0.5 w-3.5 h-3.5 text-brand-gold bg-white border-border-strong rounded focus:ring-brand-gold transition-colors cursor-pointer"
                        }), /* @__PURE__ */ jsx("span", {
                          className: `text-xs font-medium leading-snug transition-all ${isChecked ? "text-text-muted line-through italic" : "text-text-secondary group-hover:text-brand-gold"}`,
                          children: item
                        })]
                      }, idx);
                    })
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "space-y-2.5",
                  children: [/* @__PURE__ */ jsx("div", {
                    className: "text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1",
                    children: "🎯 SKILLSET"
                  }), /* @__PURE__ */ jsx("div", {
                    className: "space-y-2",
                    children: currentLevelInfo.highlights.skillset.map((item, idx) => {
                      const key = `ubc_${activeTab}_skillset_${idx}`;
                      const isChecked = !!checkedItems[key];
                      return /* @__PURE__ */ jsxs("label", {
                        className: "flex items-start gap-2 cursor-pointer select-none group",
                        children: [/* @__PURE__ */ jsx("input", {
                          type: "checkbox",
                          checked: isChecked,
                          onChange: (e) => handleCheckChange(activeTab, "skillset", idx, e.target.checked),
                          className: "mt-0.5 w-3.5 h-3.5 text-brand-gold bg-white border-border-strong rounded focus:ring-brand-gold transition-colors cursor-pointer"
                        }), /* @__PURE__ */ jsx("span", {
                          className: `text-xs font-medium leading-snug transition-all ${isChecked ? "text-text-muted line-through italic" : "text-text-secondary group-hover:text-brand-gold"}`,
                          children: item
                        })]
                      }, idx);
                    })
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "space-y-2.5",
                  children: [/* @__PURE__ */ jsx("div", {
                    className: "text-[10px] font-black text-purple-600 uppercase tracking-widest flex items-center gap-1",
                    children: "🛠️ TOOLSET"
                  }), /* @__PURE__ */ jsx("div", {
                    className: "space-y-2",
                    children: currentLevelInfo.highlights.toolset.map((item, idx) => {
                      const key = `ubc_${activeTab}_toolset_${idx}`;
                      const isChecked = !!checkedItems[key];
                      return /* @__PURE__ */ jsxs("label", {
                        className: "flex items-start gap-2 cursor-pointer select-none group",
                        children: [/* @__PURE__ */ jsx("input", {
                          type: "checkbox",
                          checked: isChecked,
                          onChange: (e) => handleCheckChange(activeTab, "toolset", idx, e.target.checked),
                          className: "mt-0.5 w-3.5 h-3.5 text-brand-gold bg-white border-border-strong rounded focus:ring-brand-gold transition-colors cursor-pointer"
                        }), /* @__PURE__ */ jsx("span", {
                          className: `text-xs font-medium leading-snug transition-all ${isChecked ? "text-text-muted line-through italic" : "text-text-secondary group-hover:text-brand-gold"}`,
                          children: item
                        })]
                      }, idx);
                    })
                  })]
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "mt-4 pt-3 border-t border-border-default",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "flex items-center justify-between text-[9px] text-text-muted font-black uppercase tracking-wider mb-1",
                children: [/* @__PURE__ */ jsxs("span", {
                  children: ["ความสำเร็จเช็คลิสต์สะสมความรู้ระดับ ", activeTab]
                }), /* @__PURE__ */ jsxs("span", {
                  className: "text-brand-gold font-bold",
                  children: [currentLvlCheckProgressPercent, "%"]
                })]
              }), /* @__PURE__ */ jsx("div", {
                className: "progress-track bg-brand-gold-light/30 h-1.5 rounded-full overflow-hidden",
                children: /* @__PURE__ */ jsx("div", {
                  className: "progress-fill bg-brand-gold h-full rounded-full transition-all duration-500",
                  style: {
                    width: `${currentLvlCheckProgressPercent}%`
                  }
                })
              })]
            })]
          })]
        })
      }), /* @__PURE__ */ jsxs("div", {
        className: "space-y-4",
        children: [/* @__PURE__ */ jsxs("h3", {
          className: "font-display font-bold text-sm text-text-primary flex items-center gap-2",
          children: [/* @__PURE__ */ jsx("span", {
            children: "📋"
          }), " รายการภารกิจพัฒนาความสำเร็จ (UBC Level ", activeTab, ")"]
        }), /* @__PURE__ */ jsx("div", {
          className: "grid md:grid-cols-3 gap-5",
          children: missions2.filter((m) => m.ubc_level === activeTab).map((m) => {
            const userMission = userMissions.find((um) => um.mission_id === m.id);
            const isCompleted = (userMission == null ? void 0 : userMission.status) === "COMPLETED";
            const isInProgress = (userMission == null ? void 0 : userMission.status) === "IN_PROGRESS";
            const categoryInfo = {
              MINDSET: {
                label: "MINDSET (วิธีคิด)",
                style: "bg-amber-100 text-amber-700 border-amber-200"
              },
              SKILLSET: {
                label: "SKILLSET (ทักษะ)",
                style: "bg-indigo-100 text-indigo-700 border-indigo-200"
              },
              TOOLSET: {
                label: "TOOLSET (เครื่องมือ)",
                style: "bg-purple-100 text-purple-700 border-purple-200"
              }
            };
            return /* @__PURE__ */ jsxs("div", {
              className: `card-base bg-white border rounded-2xl p-5 md:p-6 flex flex-col justify-between gap-6 hover:border-brand-gold-muted hover:bg-bg-input/30 transition-all duration-300 relative shadow-sm ${isCompleted ? "border-emerald-200 bg-emerald-50/10" : "border-border-default"}`,
              children: [/* @__PURE__ */ jsxs("div", {
                className: "space-y-4",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "flex justify-between items-center",
                  children: [/* @__PURE__ */ jsx("span", {
                    className: `px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider border ${categoryInfo[m.category].style}`,
                    children: categoryInfo[m.category].label
                  }), /* @__PURE__ */ jsxs("span", {
                    className: "text-brand-gold text-[10px] font-black tracking-tight bg-brand-gold-light/40 px-2 py-0.5 rounded-md border border-brand-gold-muted/10",
                    children: ["⭐ +", m.reward_points, " PT"]
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "space-y-2",
                  children: [/* @__PURE__ */ jsx("h3", {
                    className: "text-xs md:text-sm font-bold text-text-primary leading-snug",
                    children: m.title
                  }), /* @__PURE__ */ jsx("p", {
                    className: "text-xs text-text-secondary leading-relaxed",
                    children: m.description
                  })]
                })]
              }), /* @__PURE__ */ jsx("div", {
                className: "pt-2 border-t border-border-default",
                children: isCompleted ? /* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-2 text-emerald-700 text-xs font-bold bg-emerald-100 border border-emerald-200 py-2.5 px-4 rounded-xl w-full justify-center",
                  children: [/* @__PURE__ */ jsx(CheckCircle2, {
                    size: 16
                  }), " สำเร็จภารกิจแล้ว"]
                }) : isInProgress ? /* @__PURE__ */ jsxs("button", {
                  onClick: () => handleCompleteMission(m.id, m.reward_points, m.title),
                  disabled: processingId === m.id,
                  className: "w-full bg-brand-gold text-white hover:bg-brand-gold-hover py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm disabled:opacity-50",
                  children: [processingId === m.id ? /* @__PURE__ */ jsx(Loader2, {
                    size: 14,
                    className: "animate-spin"
                  }) : /* @__PURE__ */ jsx(Send, {
                    size: 14
                  }), "ส่งภารกิจเพื่อประเมิน"]
                }) : /* @__PURE__ */ jsxs("button", {
                  onClick: () => handleStartMission(m.id),
                  disabled: processingId === m.id,
                  className: "w-full bg-white border border-border-strong hover:border-brand-gold hover:bg-brand-gold-light/20 py-2.5 rounded-xl text-xs font-bold text-text-secondary hover:text-brand-gold flex items-center justify-center gap-1.5 active:scale-95 transition-all",
                  children: [processingId === m.id ? /* @__PURE__ */ jsx(Loader2, {
                    size: 14,
                    className: "animate-spin"
                  }) : /* @__PURE__ */ jsx(Play, {
                    size: 14,
                    className: "fill-current w-3 h-3 text-text-secondary hover:text-brand-gold"
                  }), "เริ่มทำภารกิจ"]
                })
              })]
            }, m.id);
          })
        })]
      })]
    })
  });
});
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: missions,
  loader: loader$b,
  meta: meta$b
}, Symbol.toStringTag, { value: "Module" }));
const STARTUP_STEPS = [{
  num: 1,
  title: "ศึกษาลิงค์ธุรกิจ",
  sub: "Unicorn Link / Dashboard ส่วนตัวของคุณ",
  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  defaultStatus: "COMPLETED"
}, {
  num: 2,
  title: "เริ่มใช้สินค้าและสะสมยอดขาย",
  sub: "สะสมครบ 2,000 PV เพื่อสิทธิ์ตำแหน่งสูงสุดและสถิตินักธุรกิจพรีเมียม",
  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  defaultStatus: "COMPLETED"
}, {
  num: 3,
  title: "เรียนรู้ระบบ 4-5-6",
  sub: "เข้าร่วมฝึกอบรม Unicorn Academy ทั้งแบบออนไลน์และงานกิจกรรมจริง",
  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  defaultStatus: "TO_DO"
}, {
  num: 4,
  title: "เริ่มใช้งาน Unicorn Smart AI",
  sub: "เปิดใช้งานน้องยูนิ (AI Coach) เพื่อช่วยวางแผนและขยายเครือข่ายธุรกิจ 24 ชั่วโมง",
  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  defaultStatus: "TO_DO"
}, {
  num: 5,
  title: "ก้าวสู่ตำแหน่ง Super Star",
  sub: "สร้างเป้าหมายรายได้ 60,000 บาท/วัน และแผนงานเกษียณที่ใฝ่ฝัน",
  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  defaultStatus: "TO_DO"
}];
function meta$a() {
  return [{
    title: "5 Start-up (เริ่มต้นทำธุรกิจ) — Unicorn Academy"
  }, {
    name: "description",
    content: "ขั้นตอนเริ่มต้นสำหรับนักธุรกิจพาร์ทเนอร์มือใหม่สู่อัจฉริยะระบบงาน"
  }];
}
async function loader$a({
  request
}) {
  const responseHeaders = new Headers();
  const {
    user,
    supabase
  } = await requireUser(request, responseHeaders);
  const {
    data: profile2
  } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return {
    profile: profile2
  };
}
const startup = UNSAFE_withComponentProps(function StartupPage() {
  const {
    profile: profile2
  } = useLoaderData();
  return /* @__PURE__ */ jsx(MemberLayout, {
    profile: profile2,
    title: "5 Start-up",
    subtitle: "ขั้นตอนก้าวแรกสู่ความสำเร็จอย่างเป็นระบบสำหรับนักธุรกิจมือใหม่",
    children: /* @__PURE__ */ jsxs("div", {
      className: "space-y-6 max-w-4xl font-body text-text-primary",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center justify-between",
        children: [/* @__PURE__ */ jsxs(Link, {
          to: "/dashboard",
          className: "flex items-center gap-1.5 text-text-secondary hover:text-brand-gold font-semibold text-xs transition-colors",
          children: [/* @__PURE__ */ jsx(ChevronLeft, {
            size: 16
          }), /* @__PURE__ */ jsx("span", {
            children: "กลับหน้าแดชบอร์ด"
          })]
        }), /* @__PURE__ */ jsx("span", {
          className: "text-brand-gold font-bold tracking-wider text-[10px] uppercase bg-brand-gold-light/40 px-3 py-1 rounded-full border border-brand-gold-muted/20",
          children: "Startup Guides"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "relative bg-gradient-to-br from-brand-dark to-[#2c1d0c] p-6 md:p-8 rounded-3xl text-white overflow-hidden shadow-md",
        children: [/* @__PURE__ */ jsx("div", {
          className: "absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none"
        }), /* @__PURE__ */ jsxs("div", {
          className: "relative z-10 space-y-2.5 max-w-xl",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "inline-flex items-center gap-1.5 bg-brand-gold/20 border border-brand-gold/30 rounded-full px-3 py-0.5 text-[9px] font-bold tracking-wider text-brand-gold-light uppercase",
            children: [/* @__PURE__ */ jsx("span", {
              children: "●"
            }), " BIZ START UP PLATFORM"]
          }), /* @__PURE__ */ jsxs("h2", {
            className: "text-2xl md:text-3xl font-display text-white",
            children: ["5 ", /* @__PURE__ */ jsx("span", {
              className: "text-brand-gold",
              children: "START-UP"
            })]
          }), /* @__PURE__ */ jsx("p", {
            className: "text-gray-300 text-xs md:text-sm leading-relaxed",
            children: "จุดเริ่มต้นที่เป็นระบบและปลอดภัยสำหรับที่ปรึกษาธุรกิจรุ่นใหม่ เคลียร์ภารกิจทีละสเต็ปเพื่อรับรางวัลเกียรติยศและปูรากฐานในการขยายองค์กรอย่างยั่งยืน"
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "absolute top-6 right-6 w-12 h-12 rounded-2xl bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center text-xl shadow-inner select-none pointer-events-none",
          children: "🚀"
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "space-y-4",
        children: STARTUP_STEPS.map((step) => {
          const isDone = step.defaultStatus === "COMPLETED";
          return /* @__PURE__ */ jsxs("div", {
            className: "bg-white border border-border-default rounded-2xl p-5 flex gap-4 items-start shadow-sm hover:border-brand-gold-muted transition-all",
            children: [/* @__PURE__ */ jsx("div", {
              className: `w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${isDone ? "bg-emerald-600 text-white" : "bg-brand-dark text-white"}`,
              children: isDone ? "✓" : step.num
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex-1 min-w-0",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2",
                children: [/* @__PURE__ */ jsxs("div", {
                  children: [/* @__PURE__ */ jsx("h3", {
                    className: "font-bold text-sm text-text-primary",
                    children: step.title
                  }), /* @__PURE__ */ jsx("p", {
                    className: "text-xs text-text-muted mt-0.5",
                    children: step.sub
                  })]
                }), /* @__PURE__ */ jsx("div", {
                  className: "shrink-0 self-start sm:self-center",
                  children: isDone ? /* @__PURE__ */ jsx("span", {
                    className: "bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold rounded-md px-2.5 py-0.5 flex items-center gap-1",
                    children: "✓ COMPLETED"
                  }) : /* @__PURE__ */ jsx("span", {
                    className: "bg-bg-input text-text-muted border border-border-default text-[10px] font-bold rounded-md px-2.5 py-0.5",
                    children: "TO DO"
                  })
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex gap-3 items-center flex-wrap mt-3",
                children: [/* @__PURE__ */ jsxs("button", {
                  className: "bg-brand-dark text-white border-none rounded-lg px-3.5 py-1.5 text-xs font-semibold hover:bg-black transition-colors flex items-center gap-1.5 shadow-sm",
                  children: [/* @__PURE__ */ jsx("span", {
                    children: "▶"
                  }), " ดูวิดีโอสอนงาน"]
                }), /* @__PURE__ */ jsx("button", {
                  className: "text-xs text-text-secondary hover:text-brand-gold font-bold transition-colors flex items-center gap-1",
                  children: "อ่านรายละเอียดภารกิจ →"
                })]
              })]
            })]
          }, step.num);
        })
      }), /* @__PURE__ */ jsxs("div", {
        className: "bg-white border border-border-default rounded-2xl p-5 flex gap-4 items-center shadow-sm",
        children: [/* @__PURE__ */ jsx("div", {
          className: "w-12 h-12 bg-brand-gold-light/40 rounded-2xl flex items-center justify-center text-2xl border border-brand-gold-muted/20 shrink-0 shadow-sm",
          children: "🏆"
        }), /* @__PURE__ */ jsxs("div", {
          className: "text-xs text-text-secondary leading-relaxed",
          children: [/* @__PURE__ */ jsx("strong", {
            className: "text-text-primary text-sm font-bold block mb-0.5",
            children: "รางวัลความพยายามยอดเยี่ยม"
          }), "ทำภารกิจสะสมครบทั้ง 5 ขั้นตอนสำเร็จเพื่อปลดล็อกเข็มกลัดเกียรติยศ", " ", /* @__PURE__ */ jsx("strong", {
            className: "text-brand-gold font-black",
            children: "Virtual Super Star"
          }), " ประดับบนหน้านามบัตรดิจิทัลของคุณและรับคะแนนโบนัสสะสมทันที!"]
        })]
      })]
    })
  });
});
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: startup,
  loader: loader$a,
  meta: meta$a
}, Symbol.toStringTag, { value: "Module" }));
function meta$9() {
  return [{
    title: "คลังสินค้าและนวัตกรรม — Unicorn Academy"
  }, {
    name: "description",
    content: "คลังสินค้าพาร์ทเนอร์และตารางวิเคราะห์คำนวณกำไรสมาชิก"
  }];
}
async function loader$9({
  request
}) {
  const responseHeaders = new Headers();
  const {
    user,
    supabase
  } = await requireUser(request, responseHeaders);
  const {
    data: profile2
  } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const {
    data: categories
  } = await supabase.from("product_categories").select("*").eq("is_active", true).order("sort_order");
  const {
    data: products2
  } = await supabase.from("products").select("*, category:product_categories(id,name,slug)").eq("is_active", true).order("sort_order");
  return {
    profile: profile2,
    categories: categories || [],
    products: products2 || []
  };
}
const products = UNSAFE_withComponentProps(function MemberProductsPage() {
  const {
    profile: profile2,
    categories,
    products: products2
  } = useLoaderData();
  const [selectedCat, setSelectedCat] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDetailsId, setActiveDetailsId] = useState(null);
  const mockProducts = [{
    id: "mock-1",
    category_id: "cat-1",
    name: "DEEZE SHOT GLUCONA",
    description: "อินซูลินธรรมชาติแบบช็อต ดูแลระดับน้ำตาล",
    member_price: 1250,
    retail_price: 1590,
    pv: 300,
    image_url: null,
    ingredients: ["FIR Technology", "Chromium Picolinate", "Gymnema Sylvestre", "Cinnamon Extract"],
    highlights: ["ช่วยกระตุ้นการหลั่งอินซูลินธรรมชาติ", "ลดภาวะดื้ออินซูลิน", "ลดการดูดซึมน้ำตาลเข้าสู่กระแสเลือด"],
    selling_points: ["นวัตกรรม Shot ดูดซึมไวกว่าแบบเม็ด 10 เท่า", "สะดวกไม่ต้องชง", "น้ำตาล 0% รสมิกซ์เบอร์รี่อร่อยทานง่าย"],
    u_selling_msg: "อินซูลินธรรมชาติ ดูดซึมทันทีไม่ต้องชง ลดน้ำตาลสะสม",
    usage_guide: "ทานวันละ 1 ช็อต ก่อนอาหารเช้า 15 นาที",
    package_size: "15 ซอง / กล่อง",
    is_active: true,
    is_featured: true,
    sort_order: 1,
    created_at: "",
    updated_at: ""
  }, {
    id: "mock-2",
    category_id: "cat-1",
    name: "DEEZE SHOT CHOLESSNA",
    description: "ช็อตดูแลหัวใจและหลอดเลือด ลดไขมันเลว LDL",
    member_price: 1250,
    retail_price: 1590,
    pv: 300,
    image_url: null,
    ingredients: ["Red Yeast Rice", "Coenzyme Q10", "Phytosterols", "Garlic Extract"],
    highlights: ["ช่วยบล็อกการสร้างคอเลสเตอรอลในตับ", "ทำความสะอาดหลอดเลือด", "เพิ่มระดับไขมันดี HDL"],
    selling_points: ["นวัตกรรมช็อตเพื่อหัวใจแข็งแรง", "รสชาติดี ปราศจากสารเคมีตกค้าง"],
    u_selling_msg: "ล้างท่อเลือดเคลียร์ไขมันเลว ดูแลหัวใจระดับเซลล์",
    usage_guide: "ทานวันละ 1 ช็อต ก่อนนอน",
    package_size: "15 ซอง / กล่อง",
    is_active: true,
    is_featured: true,
    sort_order: 2,
    created_at: "",
    updated_at: ""
  }, {
    id: "mock-3",
    category_id: "cat-1",
    name: "MINA S",
    description: "นวัตกรรมเบิร์นไขมันช่องท้องและยับยั้งแป้งจากเกาหลี",
    member_price: 890,
    retail_price: 1190,
    pv: 200,
    image_url: null,
    ingredients: ["Garcinia Cambogia", "Green Tea Extract", "L-Carnitine L-Tartrate", "Chitosan"],
    highlights: ["บล็อกการแปลงแป้งและน้ำตาลเป็นไขมันสะสม", "เร่งอัตราการเผาผลาญไขมันช่องท้อง", "คุมหิวอิ่มนาน ปลอดภัย"],
    selling_points: ["นำเข้าจากเกาหลีใต้", "ผสานนวัตกรรมยับยั้งไขมันช่องท้องลึก"],
    u_selling_msg: "เบิร์นไขมันช่องท้องลึก นำเข้าจากเกาหลี คุมหิวอิ่มนาน",
    usage_guide: "ทานวันละ 1-2 แคปซูล ก่อนอาหารกลางวัน 30 นาที",
    package_size: "30 แคปซูล / กล่อง",
    is_active: true,
    is_featured: true,
    sort_order: 3,
    created_at: "",
    updated_at: ""
  }, {
    id: "mock-4",
    category_id: "cat-1",
    name: "U TENA",
    description: "อาหารเสริมดูแลดวงตา ปกป้องแสงสีฟ้าจากหน้าจอมือถือ",
    member_price: 750,
    retail_price: 990,
    pv: 180,
    image_url: null,
    ingredients: ["Lutein & Zeaxanthin", "Bilberry Extract", "Goji Berry", "Vitamin A"],
    highlights: ["ลดอาการตาแห้ง ล้า พร่ามัว จากการมองจอ", "กรองแสงสีฟ้าอันตราย", "ชะลอการเสื่อมของจอประสาทตา"],
    selling_points: ["สูตรเข้มข้น ลูทีน 20mg ตามเกณฑ์สากล", "บำรุงประสาทตาแบบเร่งด่วน"],
    u_selling_msg: "แว่นตาดิจิทัลกินได้ ปกป้องแสงสีฟ้า คืนตาใสสดชื่น",
    usage_guide: "ทานวันละ 1 แคปซูล หลังอาหารเช้า",
    package_size: "30 แคปซูล / กระปุก",
    is_active: true,
    is_featured: false,
    sort_order: 4,
    created_at: "",
    updated_at: ""
  }];
  const displayProducts = products2.length > 0 ? products2 : mockProducts;
  const filteredProducts = useMemo(() => {
    return displayProducts.filter((product) => {
      var _a;
      const matchesCategory = selectedCat === "all" || product.category_id === selectedCat || ((_a = product.category) == null ? void 0 : _a.slug) === selectedCat;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [displayProducts, selectedCat, searchQuery]);
  return /* @__PURE__ */ jsx(MemberLayout, {
    profile: profile2,
    title: "Product Library",
    subtitle: "คลังสินค้าและนวัตกรรมเพื่อสุขภาพความงาม พร้อมตารางวิเคราะห์คำนวณกำไรสมาชิก",
    children: /* @__PURE__ */ jsxs("div", {
      className: "space-y-6 max-w-5xl font-body text-text-primary",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center justify-between",
        children: [/* @__PURE__ */ jsxs(Link, {
          to: "/dashboard",
          className: "flex items-center gap-1.5 text-text-secondary hover:text-brand-gold font-semibold text-xs transition-colors",
          children: [/* @__PURE__ */ jsx(ChevronLeft, {
            size: 16
          }), /* @__PURE__ */ jsx("span", {
            children: "กลับหน้าแดชบอร์ด"
          })]
        }), /* @__PURE__ */ jsx("span", {
          className: "text-brand-gold font-bold tracking-wider text-[10px] uppercase bg-brand-gold-light/40 px-3 py-1 rounded-full border border-brand-gold-muted/20",
          children: "Products Catalog"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "bg-white border border-border-default rounded-3xl p-5 shadow-sm space-y-4",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "relative",
          children: [/* @__PURE__ */ jsx(Search, {
            className: "absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-4.5 h-4.5"
          }), /* @__PURE__ */ jsx("input", {
            className: "w-full pl-11 pr-4 py-3 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-medium text-xs sm:text-sm text-text-primary",
            placeholder: "ค้นหาสินค้า จุดขาย หรือส่วนประกอบสำคัญ...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value)
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "space-y-2",
          children: [/* @__PURE__ */ jsx("div", {
            className: "text-[10px] font-bold text-text-muted uppercase tracking-wider",
            children: "กลุ่มสินค้า"
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex gap-2 overflow-x-auto pb-1.5 no-scrollbar",
            children: [/* @__PURE__ */ jsx("button", {
              onClick: () => setSelectedCat("all"),
              className: `px-4.5 py-1.5 rounded-full text-xs font-bold transition-all border shrink-0 ${selectedCat === "all" ? "bg-brand-gold text-white border-brand-gold shadow-sm" : "bg-white text-text-secondary border-border-strong hover:bg-bg-hover hover:border-brand-gold-muted"}`,
              children: "ทั้งหมด"
            }), categories.map((cat) => /* @__PURE__ */ jsx("button", {
              onClick: () => setSelectedCat(cat.id),
              className: `px-4.5 py-1.5 rounded-full text-xs font-bold transition-all border shrink-0 ${selectedCat === cat.id ? "bg-brand-gold text-white border-brand-gold shadow-sm" : "bg-white text-text-secondary border-border-strong hover:bg-bg-hover hover:border-brand-gold-muted"}`,
              children: cat.name
            }, cat.id)), categories.length === 0 && /* @__PURE__ */ jsxs(Fragment, {
              children: [/* @__PURE__ */ jsx("button", {
                onClick: () => setSelectedCat("cat-1"),
                className: `px-4.5 py-1.5 rounded-full text-xs font-bold transition-all border shrink-0 ${selectedCat === "cat-1" ? "bg-brand-gold text-white border-brand-gold shadow-sm" : "bg-white text-text-secondary border-border-strong hover:bg-bg-hover hover:border-brand-gold-muted"}`,
                children: "Health Care"
              }), /* @__PURE__ */ jsx("button", {
                onClick: () => setSelectedCat("cat-2"),
                className: `px-4.5 py-1.5 rounded-full text-xs font-bold transition-all border shrink-0 ${selectedCat === "cat-2" ? "bg-brand-gold text-white border-brand-gold shadow-sm" : "bg-white text-text-secondary border-border-strong hover:bg-bg-hover hover:border-brand-gold-muted"}`,
                children: "Skin Care"
              })]
            })]
          })]
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-6",
        children: filteredProducts.map((p) => {
          var _a;
          const profit = p.retail_price - p.member_price;
          const showDetails = activeDetailsId === p.id;
          return /* @__PURE__ */ jsxs("div", {
            className: "card-premium bg-white border border-border-default rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-all",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "bg-bg-input h-32 relative flex items-center justify-center border-b border-border-default select-none",
              children: [/* @__PURE__ */ jsx("div", {
                className: "absolute top-4 left-4 bg-brand-gold-light/65 text-brand-gold text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-brand-gold-muted/15",
                children: ((_a = p.category) == null ? void 0 : _a.name) || "HEALTH CARE"
              }), p.image_url ? /* @__PURE__ */ jsx("img", {
                src: p.image_url,
                alt: p.name,
                className: "w-full h-full object-cover"
              }) : /* @__PURE__ */ jsx("div", {
                className: "w-12 h-12 bg-white rounded-xl shadow-sm border border-border-default flex items-center justify-center text-2xl",
                children: p.name.includes("GLUCONA") ? "📄" : p.name.includes("CHOLESSNA") ? "📦" : p.name.includes("MINA S") ? "💊" : "👁️"
              }), /* @__PURE__ */ jsx("div", {
                className: "absolute top-4 right-4 text-[9px] font-bold text-text-muted uppercase tracking-widest",
                children: "PDF Product Kit"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "p-5 space-y-4",
              children: [/* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("h3", {
                  className: "font-bold text-sm text-text-primary leading-snug",
                  children: p.name
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-xs text-text-muted mt-1 leading-relaxed line-clamp-2",
                  children: p.description
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "grid grid-cols-3 gap-2",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "bg-bg-input rounded-xl p-2.5 text-center border border-border-default",
                  children: [/* @__PURE__ */ jsx("div", {
                    className: "text-[9px] text-text-muted font-bold",
                    children: "ราคาสมาชิก"
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "text-xs font-black text-text-primary mt-0.5",
                    children: ["฿", p.member_price.toLocaleString()]
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "bg-bg-input rounded-xl p-2.5 text-center border border-border-default",
                  children: [/* @__PURE__ */ jsx("div", {
                    className: "text-[9px] text-text-muted font-bold",
                    children: "ราคาขายปลีก"
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "text-xs font-black text-text-primary mt-0.5",
                    children: ["฿", p.retail_price.toLocaleString()]
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "bg-brand-gold-light/40 rounded-xl p-2.5 text-center border border-brand-gold-muted/20",
                  children: [/* @__PURE__ */ jsx("div", {
                    className: "text-[9px] text-brand-gold font-bold",
                    children: "กำไรสมาชิก"
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "text-xs font-black text-brand-gold mt-0.5",
                    children: ["฿", profit.toLocaleString()]
                  })]
                })]
              }), showDetails && /* @__PURE__ */ jsxs("div", {
                className: "bg-bg-input rounded-2xl p-4 border border-border-default space-y-3.5 animate-fade-in",
                children: [p.u_selling_msg && /* @__PURE__ */ jsxs("div", {
                  className: "text-xs font-bold text-brand-gold border-l-2 border-brand-gold pl-2.5 italic",
                  children: ['"', p.u_selling_msg, '"']
                }), p.highlights && p.highlights.length > 0 && /* @__PURE__ */ jsxs("div", {
                  children: [/* @__PURE__ */ jsx("div", {
                    className: "text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1",
                    children: "จุดเด่นสำคัญ"
                  }), /* @__PURE__ */ jsx("ul", {
                    className: "list-disc pl-4 text-xs text-text-secondary space-y-0.5",
                    children: p.highlights.map((hl, index) => /* @__PURE__ */ jsx("li", {
                      children: hl
                    }, index))
                  })]
                }), p.ingredients && p.ingredients.length > 0 && /* @__PURE__ */ jsxs("div", {
                  children: [/* @__PURE__ */ jsx("div", {
                    className: "text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1",
                    children: "ส่วนประกอบหลัก"
                  }), /* @__PURE__ */ jsx("div", {
                    className: "flex gap-1.5 flex-wrap",
                    children: p.ingredients.map((ing, index) => /* @__PURE__ */ jsx("span", {
                      className: "bg-white border border-border-strong text-text-secondary text-[10px] font-bold px-2 py-0.5 rounded-md",
                      children: ing
                    }, index))
                  })]
                }), p.usage_guide && /* @__PURE__ */ jsxs("div", {
                  className: "text-[11px] text-text-secondary leading-relaxed pt-1.5 border-t border-border-muted",
                  children: [/* @__PURE__ */ jsx("strong", {
                    className: "text-text-primary font-bold",
                    children: "วิธีรับประทาน:"
                  }), " ", p.usage_guide, " · ", p.package_size]
                })]
              }), /* @__PURE__ */ jsxs("button", {
                onClick: () => setActiveDetailsId(showDetails ? null : p.id),
                className: "w-full bg-brand-dark hover:bg-black text-white text-xs font-bold rounded-xl py-3 flex items-center justify-center gap-1.5 transition-colors shadow-sm",
                children: [/* @__PURE__ */ jsx("span", {
                  children: "⚡"
                }), showDetails ? "ซ่อนรายละเอียดและส่วนประกอบ" : "ดูจุดขายและส่วนประกอบสินค้า"]
              })]
            })]
          }, p.id);
        })
      })]
    })
  });
});
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: products,
  loader: loader$9,
  meta: meta$9
}, Symbol.toStringTag, { value: "Module" }));
const KNOWLEDGE_ITEMS = [{
  id: "k-1",
  title: "สไลด์เปิดโอกาสทางธุรกิจ (STP)",
  description: "ชุดสไลด์นำเสนอธุรกิจฉบับมาตรฐานสำหรับแนะนำพันธมิตร Unicorn",
  category: "teaching",
  categoryLabel: "สื่อการสอน",
  format: "pdf",
  formatLabel: "PDF",
  icon: "📄",
  badgeBg: "bg-red-50 text-red-700 border-red-200",
  url: "#"
}, {
  id: "k-2",
  title: "วิดีโอเจาะลึกระบบแผน 5 รายได้",
  description: "วิดีโอเจาะลึกวิธีการคำนวณและสร้างรายได้ระยะยาวโดย Diamond Master",
  category: "teaching",
  categoryLabel: "สื่อการสอน",
  format: "video",
  formatLabel: "วิดีโอ",
  icon: "🎬",
  badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
  url: "#"
}, {
  id: "k-3",
  title: "แผนยุทธศาสตร์ธุรกิจ 3 ปี Unicorn",
  description: "เอกสารคู่มือแนวทางการวางแผนขยายฐานผู้บริโภคและสร้าง Passive Income",
  category: "docs",
  categoryLabel: "เอกสารการเรียนรู้",
  format: "pdf",
  formatLabel: "PDF",
  icon: "📑",
  badgeBg: "bg-amber-50 text-[#7a4e10] border-amber-200",
  url: "#"
}, {
  id: "k-4",
  title: "คลิปสั้นโปรโมท Social Media Kit",
  description: "คลิปพร้อมใช้งานสำหรับนำไปแชร์ดึงดูดผู้มุ่งหวังบน TikTok / Reels / Shorts",
  category: "marketing",
  categoryLabel: "สื่อการตลาด",
  format: "video",
  formatLabel: "วิดีโอ",
  icon: "📱",
  badgeBg: "bg-green-50 text-green-700 border-green-200",
  url: "#"
}, {
  id: "k-5",
  title: "รีวิวผลลัพธ์จากผู้ใช้จริง MINA S",
  description: "ชุดรูปภาพและประโยคคำอธิบายสำหรับโปรโมตผลิตภัณฑ์ลดไขมันช่องท้อง",
  category: "marketing",
  categoryLabel: "สื่อการตลาด",
  format: "image",
  formatLabel: "รูปภาพ",
  icon: "🖼️",
  badgeBg: "bg-[#f0eeff] text-[#7c3aed] border-[#dbeafe]",
  url: "#"
}, {
  id: "k-6",
  title: "แนวทางการพูด STP (STP Speaking Script)",
  description: "บทพูดสคริปต์ทีละหน้าสำหรับสมาชิกระดับเริ่มต้นฝึกพูดแบ่งปันโอกาส",
  category: "teaching",
  categoryLabel: "สื่อการสอน",
  format: "link",
  formatLabel: "ลิงก์ภายนอก",
  icon: "🔗",
  badgeBg: "bg-teal-50 text-teal-700 border-teal-200",
  url: "#"
}];
function meta$8() {
  return [{
    title: "คลังความรู้และสื่อการตลาด — Unicorn Academy"
  }, {
    name: "description",
    content: "คลังสื่อการสอนและเครื่องมือทางการตลาดเพื่อยกระดับนักธุรกิจมืออาชีพ"
  }];
}
async function loader$8({
  request
}) {
  const responseHeaders = new Headers();
  const {
    user,
    supabase
  } = await requireUser(request, responseHeaders);
  const {
    data: profile2
  } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return {
    profile: profile2
  };
}
const knowledge = UNSAFE_withComponentProps(function MemberKnowledgePage() {
  const {
    profile: profile2
  } = useLoaderData();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFormat, setSelectedFormat] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const filteredItems = useMemo(() => {
    return KNOWLEDGE_ITEMS.filter((item) => {
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      const matchesFormat = selectedFormat === "all" || item.format === selectedFormat;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesFormat && matchesSearch;
    });
  }, [selectedCategory, selectedFormat, searchQuery]);
  return /* @__PURE__ */ jsx(MemberLayout, {
    profile: profile2,
    title: "Knowledge Library",
    subtitle: "คลังสื่อการสอนและเครื่องมือทางการตลาดเพื่อยกระดับนักธุรกิจมืออาชีพ",
    children: /* @__PURE__ */ jsxs("div", {
      className: "space-y-6 max-w-5xl font-body text-text-primary",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center justify-between",
        children: [/* @__PURE__ */ jsxs(Link, {
          to: "/dashboard",
          className: "flex items-center gap-1.5 text-text-secondary hover:text-brand-gold font-semibold text-xs transition-colors",
          children: [/* @__PURE__ */ jsx(ChevronLeft, {
            size: 16
          }), /* @__PURE__ */ jsx("span", {
            children: "กลับหน้าแดชบอร์ด"
          })]
        }), /* @__PURE__ */ jsx("span", {
          className: "text-brand-gold font-bold tracking-wider text-[10px] uppercase bg-brand-gold-light/40 px-3 py-1 rounded-full border border-brand-gold-muted/20",
          children: "Knowledge Catalog"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "bg-white border border-border-default rounded-3xl p-5 shadow-sm space-y-4",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "relative",
          children: [/* @__PURE__ */ jsx(Search, {
            className: "absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-4.5 h-4.5"
          }), /* @__PURE__ */ jsx("input", {
            className: "w-full pl-11 pr-4 py-3 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-medium text-xs sm:text-sm text-text-primary",
            placeholder: "ค้นหาเอกสาร STP สไลด์สอน คลิป หรือสื่อประชาสัมพันธ์...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value)
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "space-y-4 pt-2",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "space-y-1.5",
            children: [/* @__PURE__ */ jsx("div", {
              className: "text-[10px] font-bold text-text-muted uppercase tracking-wider",
              children: "หมวดหมู่เนื้อหา"
            }), /* @__PURE__ */ jsx("div", {
              className: "flex gap-2 overflow-x-auto pb-1.5 no-scrollbar",
              children: [{
                id: "all",
                label: "⊞ ทุกหมวดหมู่"
              }, {
                id: "teaching",
                label: "▶ สื่อการสอน"
              }, {
                id: "docs",
                label: "📋 เอกสารการเรียนรู้"
              }, {
                id: "marketing",
                label: "🛒 สื่อการตลาด"
              }, {
                id: "shorts",
                label: "🎬 คลิปสั้น"
              }].map((cat) => /* @__PURE__ */ jsx("button", {
                onClick: () => setSelectedCategory(cat.id),
                className: `px-4.5 py-1.5 rounded-full text-xs font-bold transition-all border shrink-0 ${selectedCategory === cat.id ? "bg-brand-gold text-white border-brand-gold shadow-sm" : "bg-white text-text-secondary border-border-strong hover:bg-bg-hover hover:border-brand-gold-muted"}`,
                children: cat.label
              }, cat.id))
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-1.5",
            children: [/* @__PURE__ */ jsx("div", {
              className: "text-[10px] font-bold text-text-muted uppercase tracking-wider",
              children: "รูปแบบสื่อ"
            }), /* @__PURE__ */ jsx("div", {
              className: "flex gap-2 overflow-x-auto pb-1.5 no-scrollbar",
              children: [{
                id: "all",
                label: "📁 ทุกรูปแบบ"
              }, {
                id: "pdf",
                label: "📄 PDF"
              }, {
                id: "video",
                label: "🎬 วิดีโอ"
              }, {
                id: "image",
                label: "🖼️ รูปภาพ"
              }, {
                id: "link",
                label: "🔗 ลิงก์"
              }].map((fmt) => /* @__PURE__ */ jsx("button", {
                onClick: () => setSelectedFormat(fmt.id),
                className: `px-4.5 py-1.5 rounded-full text-xs font-bold transition-all border shrink-0 ${selectedFormat === fmt.id ? "bg-brand-dark text-white border-brand-dark shadow-sm" : "bg-white text-text-secondary border-border-strong hover:bg-bg-hover hover:border-brand-gold-muted"}`,
                children: fmt.label
              }, fmt.id))
            })]
          })]
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-6",
        children: [filteredItems.map((item) => /* @__PURE__ */ jsxs("div", {
          className: "card-premium bg-white border border-border-default rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-all",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "bg-bg-input h-28 relative flex items-center justify-center border-b border-border-default select-none",
            children: [/* @__PURE__ */ jsx("span", {
              className: "absolute top-4 right-4 text-[9px] font-black uppercase tracking-widest text-text-muted",
              children: item.formatLabel
            }), /* @__PURE__ */ jsx("div", {
              className: "w-11 h-11 rounded-2xl bg-white border border-border-default shadow-sm flex items-center justify-center text-xl",
              children: item.icon
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "p-5 flex-1 flex flex-col justify-between space-y-4",
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "font-bold text-xs sm:text-sm text-text-primary leading-snug",
                children: item.title
              }), /* @__PURE__ */ jsx("p", {
                className: "text-xs text-text-secondary mt-1.5 leading-relaxed line-clamp-2",
                children: item.description
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between pt-3.5 border-t border-border-default",
              children: [/* @__PURE__ */ jsx("span", {
                className: "text-[10px] font-black text-brand-gold uppercase tracking-wider",
                children: item.categoryLabel
              }), /* @__PURE__ */ jsx("button", {
                onClick: () => alert(`กำลังเปิด/ดาวน์โหลด: ${item.title}`),
                className: "bg-brand-dark hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-xl border-none transition-colors flex items-center gap-1.5 shadow-sm",
                children: item.format === "pdf" ? "⬇ ดาวน์โหลด" : item.format === "video" ? "▶ รับชม" : "📂 เปิดดู"
              })]
            })]
          })]
        }, item.id)), filteredItems.length === 0 && /* @__PURE__ */ jsx("div", {
          className: "col-span-full bg-white border border-border-default rounded-3xl p-12 text-center text-text-muted italic",
          children: "ไม่พบสื่อการสอนหรือเอกสารคู่มือที่ตรงกับการค้นหาของคุณ"
        })]
      })]
    })
  });
});
const route12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: knowledge,
  loader: loader$8,
  meta: meta$8
}, Symbol.toStringTag, { value: "Module" }));
const FUNCTION_EVENTS = [{
  frequency: "DAILY",
  frequencyLabel: "กิจกรรมรายวัน",
  badgeBg: "bg-blue-600 text-white",
  dotColor: "bg-blue-500",
  title: "Morning Call ประเมินแผนรายวัน",
  location: "ZOOM / LINE LIVE",
  audience: "กลุ่มผู้ฝึกสอนและสมาชิกทีมงาน"
}, {
  frequency: "WEEKLY",
  frequencyLabel: "กิจกรรมรายสัปดาห์",
  badgeBg: "bg-amber-500 text-white",
  dotColor: "bg-amber-500",
  title: "Weekly Product & Skill Workshop",
  location: "ZOOM MEETING / ออฟฟิศ",
  audience: "สมาชิกร่วมธุรกิจ 100+ ท่าน"
}, {
  frequency: "MONTHLY",
  frequencyLabel: "กิจกรรมรายเดือน",
  badgeBg: "bg-purple-600 text-white",
  dotColor: "bg-purple-500",
  title: "Monthly Recognition & Success Goal",
  location: "ZOOM / โรงแรมจัดประชุม",
  audience: "ผู้มุ่งหวังและสมาชิก 500+ ท่าน"
}, {
  frequency: "QUARTERLY",
  frequencyLabel: "กิจกรรมรายไตรมาส",
  badgeBg: "bg-brand-dark text-white",
  dotColor: "bg-brand-gold",
  title: "Grand Convention & VIP Seminars",
  location: "หอประชุมใหญ่ภาคกลาง / ต่างประเทศ",
  audience: "ผู้นำและนักธุรกิจระดับสูง 1,000+ ท่าน"
}];
function meta$7() {
  return [{
    title: "Function to Function (ระบบการเคลื่อนคน) — Unicorn Academy"
  }, {
    name: "description",
    content: "ระบบการเคลื่อนและยกระดับผู้คนผ่านงานกิจกรรมของทางบริษัท"
  }];
}
async function loader$7({
  request
}) {
  const responseHeaders = new Headers();
  const {
    user,
    supabase
  } = await requireUser(request, responseHeaders);
  const {
    data: profile2
  } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return {
    profile: profile2
  };
}
const functions = UNSAFE_withComponentProps(function FunctionsPage() {
  const {
    profile: profile2
  } = useLoaderData();
  return /* @__PURE__ */ jsx(MemberLayout, {
    profile: profile2,
    title: "Function to Function",
    subtitle: "ระบบการเคลื่อนและยกระดับผู้คนผ่านงานกิจกรรมรายวัน รายสัปดาห์ รายเดือน และรายไตรมาส",
    children: /* @__PURE__ */ jsxs("div", {
      className: "space-y-6 max-w-5xl font-body text-text-primary",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center justify-between",
        children: [/* @__PURE__ */ jsxs(Link, {
          to: "/dashboard",
          className: "flex items-center gap-1.5 text-text-secondary hover:text-brand-gold font-semibold text-xs transition-colors",
          children: [/* @__PURE__ */ jsx(ChevronLeft, {
            size: 16
          }), /* @__PURE__ */ jsx("span", {
            children: "กลับหน้าแดชบอร์ด"
          })]
        }), /* @__PURE__ */ jsx("span", {
          className: "text-brand-gold font-bold tracking-wider text-[10px] uppercase bg-brand-gold-light/40 px-3 py-1 rounded-full border border-brand-gold-muted/20",
          children: "System Strategy"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "text-center pb-4 max-w-md mx-auto",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "inline-flex items-center gap-1.5 bg-brand-gold-light/40 border border-brand-gold-muted/20 rounded-full px-4 py-1.5 text-[10px] font-black tracking-wider text-brand-gold mb-3 uppercase",
          children: [/* @__PURE__ */ jsx("span", {
            className: "w-1.5 h-1.5 rounded-full bg-brand-gold"
          }), " SYSTEM STRATEGY"]
        }), /* @__PURE__ */ jsxs("h2", {
          className: "text-2xl sm:text-3xl font-display font-bold leading-tight",
          children: ["Function ", /* @__PURE__ */ jsx("span", {
            className: "text-brand-gold font-normal",
            children: "to Function"
          })]
        }), /* @__PURE__ */ jsx("p", {
          className: "text-text-muted text-xs mt-2 leading-relaxed",
          children: "ขับเคลื่อนระบบธุรกิจอย่างเป็นขั้นเป็นตอน ใช้แรงเหวี่ยงจากห้องกิจกรรมเพื่อสร้างนักธุรกิจมืออาชีพที่เติบโตรวดเร็วและยั่งยืน"
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
        children: FUNCTION_EVENTS.map((event) => /* @__PURE__ */ jsxs("div", {
          className: "flex flex-col space-y-3",
          children: [/* @__PURE__ */ jsxs("div", {
            className: `${event.badgeBg} rounded-2xl p-4.5 text-center shadow-sm select-none`,
            children: [/* @__PURE__ */ jsx("span", {
              className: "text-lg font-display font-bold italic tracking-wide block",
              children: event.frequency
            }), /* @__PURE__ */ jsx("span", {
              className: "text-[10px] opacity-90 font-bold block mt-0.5",
              children: event.frequencyLabel
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "bg-white border border-border-default rounded-2xl p-5 flex-1 flex flex-col justify-between space-y-5 shadow-sm hover:border-brand-gold-muted hover:shadow-md transition-all",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "flex gap-2 items-start",
                children: [/* @__PURE__ */ jsx("span", {
                  className: `${event.dotColor} w-2.5 h-2.5 rounded-full mt-1.5 shrink-0`
                }), /* @__PURE__ */ jsx("h3", {
                  className: "font-bold text-xs sm:text-sm text-text-primary leading-snug",
                  children: event.title
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex flex-col gap-2 text-[10px] text-text-muted font-bold",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-1.5",
                  children: [/* @__PURE__ */ jsx(MapPin, {
                    size: 12,
                    className: "text-brand-gold"
                  }), /* @__PURE__ */ jsx("span", {
                    children: event.location
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-1.5",
                  children: [/* @__PURE__ */ jsx(Users, {
                    size: 12,
                    className: "text-brand-gold"
                  }), /* @__PURE__ */ jsx("span", {
                    children: event.audience
                  })]
                })]
              })]
            }), /* @__PURE__ */ jsxs(Link, {
              to: "#",
              className: "text-xs font-bold text-text-secondary hover:text-brand-gold flex items-center gap-1 transition-colors bg-transparent border-none cursor-pointer self-start",
              children: ["ดูตารางเวลาและเข้าร่วม ", /* @__PURE__ */ jsx("span", {
                className: "text-[9px] text-text-muted",
                children: "↗"
              })]
            })]
          })]
        }, event.frequency))
      }), /* @__PURE__ */ jsxs("div", {
        className: "p-6 bg-gradient-to-r from-brand-dark to-[#2c1d0c] rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 text-white shadow-md",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "flex items-center gap-4 text-center sm:text-left",
          children: [/* @__PURE__ */ jsx("span", {
            className: "text-3xl select-none",
            children: "📅"
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("h3", {
              className: "text-sm md:text-base font-bold text-white mb-0.5",
              children: "ปฏิทินกิจกรรมและการฝึกอบรมประจำเดือน"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-[11px] text-gray-300",
              children: "ดูกำหนดการล่วงหน้าเพื่อเตรียมระบบและทำการส่งทีมงานเข้าร่วมห้องเรียน"
            })]
          })]
        }), /* @__PURE__ */ jsx(Link, {
          to: "#",
          className: "bg-brand-gold hover:bg-brand-gold-hover text-white font-bold text-xs rounded-xl px-5 py-2.5 transition-all text-center flex items-center justify-center shrink-0 shadow-sm",
          children: "ดูปฏิทินภาพรวม →"
        })]
      })]
    })
  });
});
const route13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: functions,
  loader: loader$7,
  meta: meta$7
}, Symbol.toStringTag, { value: "Module" }));
function meta$6({
  data: data2
}) {
  const profile2 = data2 == null ? void 0 : data2.profile;
  const name = (profile2 == null ? void 0 : profile2.display_name) || (profile2 == null ? void 0 : profile2.full_name) || "Unicorn Partner";
  return [{
    title: `${name} | Unicorn Academy`
  }, {
    name: "description",
    content: (profile2 == null ? void 0 : profile2.quote) || (profile2 == null ? void 0 : profile2.bio) || "นักธุรกิจยูนิคอร์น — เปิดโอกาสร่วมธุรกิจกับเรา"
  }];
}
async function loader$6({
  params,
  request
}) {
  const {
    slug
  } = params;
  if (!slug) {
    throw new Response("Slug not provided", {
      status: 400
    });
  }
  const headers = new Headers();
  const supabase = createServerSupabase(request, headers);
  const {
    data: profile2
  } = await supabase.from("profiles").select("*").eq("referral_slug", slug).single();
  if (!profile2) {
    throw new Response("Partner not found", {
      status: 404
    });
  }
  const {
    error: rpcError
  } = await supabase.rpc("increment_referral_clicks", {
    profile_id: profile2.id
  });
  if (rpcError) {
    console.error("Increment clicks failed:", rpcError);
  }
  headers.set("Set-Cookie", `unicorn_referrer=${profile2.id}; Path=/; HttpOnly; Max-Age=${30 * 24 * 60 * 60}; SameSite=Lax; Secure`);
  return data({
    profile: profile2,
    slug
  }, {
    headers
  });
}
const referral_$slug = UNSAFE_withComponentProps(function ReferralPage() {
  var _a;
  const {
    profile: profile2,
    slug
  } = useLoaderData();
  const levelLabels = {
    1: "Foundation",
    2: "Specialist",
    3: "Strategic",
    4: "Elite Master"
  };
  const level = profile2.ubc_level ?? 1;
  const displayName = profile2.display_name || profile2.full_name || "Partner";
  const initials = displayName.slice(0, 2).toUpperCase();
  const bioText = profile2.bio || profile2.ai_bio;
  const tags = ((_a = profile2.ai_tags) == null ? void 0 : _a.filter(Boolean)) ?? [];
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen bg-bg-page text-text-primary font-body text-sm leading-relaxed pb-12",
    children: [/* @__PURE__ */ jsx("div", {
      className: "h-1 bg-brand-gold"
    }), /* @__PURE__ */ jsxs("nav", {
      className: "bg-white border-b border-border-default px-6 py-4 flex items-center justify-between shadow-sm relative z-20",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-3",
        children: [/* @__PURE__ */ jsx("div", {
          className: "w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm select-none",
          style: {
            background: "linear-gradient(135deg, var(--brand-dark), var(--brand-gold))"
          },
          children: "U"
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("div", {
            className: "text-xs font-black text-text-primary tracking-wide",
            children: "UNICORN GLOBAL LINK"
          }), /* @__PURE__ */ jsx("div", {
            className: "text-[9px] font-bold text-text-muted uppercase tracking-wider",
            children: "Smart AI Platform"
          })]
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-1.5 text-[10px] text-brand-gold font-bold bg-brand-gold-light/40 border border-brand-gold-muted/15 px-3 py-1 rounded-full shadow-inner",
        children: [/* @__PURE__ */ jsx("span", {
          className: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"
        }), profile2.is_verified ? "Verified Partner" : "Unicorn Partner"]
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "max-w-4xl mx-auto px-4 pt-10 pb-8 text-center relative overflow-hidden",
      children: [/* @__PURE__ */ jsx("div", {
        className: "absolute inset-0 pointer-events-none bg-gradient-to-b from-brand-gold-light/10 to-transparent"
      }), /* @__PURE__ */ jsxs("div", {
        className: "relative inline-block mb-4 z-10 select-none",
        children: [/* @__PURE__ */ jsx("div", {
          className: "w-20 h-20 rounded-2xl overflow-hidden border-2 border-brand-gold mx-auto shadow-md",
          children: profile2.avatar_url ? /* @__PURE__ */ jsx("img", {
            src: profile2.avatar_url,
            alt: displayName,
            className: "object-cover w-full h-full"
          }) : /* @__PURE__ */ jsx("div", {
            className: "w-full h-full flex items-center justify-center text-2xl font-black text-white bg-brand-gold",
            children: initials
          })
        }), profile2.is_verified && /* @__PURE__ */ jsx("div", {
          className: "absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-brand-gold border-2 border-white flex items-center justify-center text-[10px] font-black text-white shadow-sm",
          children: "✓"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "inline-flex items-center gap-1.5 bg-brand-gold-light/50 border border-brand-gold-muted/20 rounded-full px-3.5 py-1 text-[10px] font-black text-brand-gold uppercase tracking-wider mb-3.5 z-10 relative",
        children: ["⭐ UBC ", level, " · ", levelLabels[level]]
      }), /* @__PURE__ */ jsx("h1", {
        className: "text-2xl font-display font-bold text-text-primary leading-tight mb-2 relative z-10",
        children: displayName
      }), profile2.expertise && /* @__PURE__ */ jsx("p", {
        className: "text-xs text-text-muted font-bold tracking-wider mb-4 relative z-10 uppercase",
        children: profile2.expertise
      }), profile2.quote && /* @__PURE__ */ jsxs("div", {
        className: "text-sm text-text-secondary italic leading-relaxed max-w-md mx-auto px-4 relative z-10",
        children: [/* @__PURE__ */ jsx("span", {
          className: "text-brand-gold text-2xl leading-none align-[-0.2em] mr-1 font-display",
          children: "“"
        }), profile2.quote, /* @__PURE__ */ jsx("span", {
          className: "text-brand-gold text-2xl leading-none align-[-0.2em] ml-1 font-display",
          children: "”"
        })]
      })]
    }), profile2.photo_urls && profile2.photo_urls.length > 0 && /* @__PURE__ */ jsx("div", {
      className: "max-w-4xl mx-auto px-4 pb-8",
      children: /* @__PURE__ */ jsx("div", {
        className: "grid grid-cols-3 gap-3",
        children: profile2.photo_urls.slice(0, 3).map((url, idx) => {
          var _a2, _b;
          return /* @__PURE__ */ jsxs("div", {
            className: "rounded-2xl overflow-hidden aspect-[3/4] relative bg-bg-input border border-border-default shadow-sm hover:border-brand-gold-muted transition-all",
            children: [/* @__PURE__ */ jsx("img", {
              src: url,
              alt: ((_a2 = profile2.photo_captions) == null ? void 0 : _a2[idx]) || "",
              className: "object-cover w-full h-full"
            }), /* @__PURE__ */ jsx("div", {
              className: "absolute inset-0 pointer-events-none bg-gradient-to-t from-black/70 via-transparent to-transparent"
            }), ((_b = profile2.photo_captions) == null ? void 0 : _b[idx]) && /* @__PURE__ */ jsx("div", {
              className: "absolute bottom-3 left-3 right-3 text-[10px] font-bold text-white line-clamp-1",
              children: profile2.photo_captions[idx]
            })]
          }, idx);
        })
      })
    }), /* @__PURE__ */ jsx("div", {
      className: "max-w-4xl mx-auto px-4 mb-8",
      children: (bioText || tags.length > 0) && /* @__PURE__ */ jsxs("div", {
        className: "bg-white border border-border-default rounded-3xl shadow-sm overflow-hidden",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "px-5 py-4 border-b border-border-default bg-bg-input flex items-center gap-2",
          children: [/* @__PURE__ */ jsx("span", {
            className: "text-base select-none",
            children: "👤"
          }), /* @__PURE__ */ jsx("span", {
            className: "text-xs font-black text-text-primary uppercase tracking-wider",
            children: "ผู้แนะนำที่ปรึกษาธุรกิจ"
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "p-5 space-y-4",
          children: [/* @__PURE__ */ jsx("div", {
            className: "text-base font-bold text-text-primary",
            children: displayName
          }), profile2.expertise && /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-2 text-xs font-bold text-brand-gold",
            children: [/* @__PURE__ */ jsx("span", {
              className: "inline-block w-4 h-0.5 rounded bg-brand-gold shrink-0"
            }), profile2.expertise]
          }), bioText && /* @__PURE__ */ jsx("p", {
            className: "text-xs sm:text-sm text-text-secondary leading-relaxed whitespace-pre-wrap",
            children: bioText
          }), tags.length > 0 && /* @__PURE__ */ jsx("div", {
            className: "flex flex-wrap gap-1.5 pt-1.5 border-t border-border-muted",
            children: tags.map((tag, idx) => /* @__PURE__ */ jsxs("span", {
              className: "bg-bg-input border border-border-default rounded-lg px-2.5 py-1 text-[10px] font-bold text-text-secondary",
              children: ["#", tag]
            }, idx))
          })]
        })]
      })
    }), /* @__PURE__ */ jsxs("div", {
      className: "max-w-4xl mx-auto px-4 mb-8",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "text-center pb-4 space-y-1",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "inline-flex items-center gap-1.5 bg-brand-gold-light/40 border border-brand-gold-muted/20 rounded-full px-3.5 py-1 text-[9px] font-black text-brand-gold uppercase tracking-widest",
          children: [/* @__PURE__ */ jsx("span", {
            className: "w-1.5 h-1.5 rounded-full bg-brand-gold"
          }), " Smart AI Platform"]
        }), /* @__PURE__ */ jsx("h2", {
          className: "text-xl font-display font-bold text-text-primary",
          children: "ระบบการทำงานอัจฉริยะที่คุณจะได้ใช้"
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "flex gap-3 pb-3 overflow-x-auto no-scrollbar scroll-smooth",
        children: [{
          dot: "#b8924a",
          label: "AI Coach",
          desc: "น้องยูนิช่วยวางแผนและโค้ชชิ่งธุรกิจ 24 ชม."
        }, {
          dot: "#e8621a",
          label: "Wealth DNA",
          desc: "ถอดรหัสศักยภาพและธาตุความมั่งคั่ง"
        }, {
          dot: "#f5a623",
          label: "Missions",
          desc: "ระบบพัฒนาทักษะธุรกิจเป็นขั้นตอนชัดเจน"
        }, {
          dot: "#10b981",
          label: "5 รายได้",
          desc: "สิทธิ์การรับรายได้ 8 ช่องทางที่รวดเร็วและคุ้มค่า"
        }, {
          dot: "#8b5cf6",
          label: "Name Card",
          desc: "นามบัตรดิจิทัลสร้าง Personal Brand ส่วนตัว"
        }].map((f) => /* @__PURE__ */ jsxs("div", {
          className: "bg-white border border-border-default rounded-2xl p-4.5 min-w-[150px] shrink-0 shadow-sm",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-1.5 mb-1.5",
            children: [/* @__PURE__ */ jsx("span", {
              className: "w-2 h-2 rounded-full shrink-0",
              style: {
                background: f.dot
              }
            }), /* @__PURE__ */ jsx("span", {
              className: "text-xs font-black text-text-primary tracking-wide",
              children: f.label
            })]
          }), /* @__PURE__ */ jsx("p", {
            className: "text-[10px] text-text-muted leading-relaxed",
            children: f.desc
          })]
        }, f.label))
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "max-w-4xl mx-auto px-4 mb-8",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "text-center pb-4 space-y-1",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "inline-flex items-center gap-1.5 bg-brand-gold-light/40 border border-brand-gold-muted/20 rounded-full px-3.5 py-1 text-[9px] font-black text-brand-gold uppercase tracking-widest",
          children: [/* @__PURE__ */ jsx("span", {
            className: "w-1.5 h-1.5 rounded-full bg-brand-gold"
          }), " Product Lines"]
        }), /* @__PURE__ */ jsxs("h2", {
          className: "text-xl font-display font-bold text-text-primary",
          children: ["หมวดหมู่ ", /* @__PURE__ */ jsx("span", {
            className: "text-brand-gold",
            children: "ผลิตภัณฑ์นวัตกรรม"
          })]
        }), /* @__PURE__ */ jsx("p", {
          className: "text-xs text-text-muted",
          children: "ครอบคลุมทุกไลฟ์สไตล์ มั่นใจด้วยมาตรฐานระดับสากล"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
        children: [[{
          icon: "🫀",
          label: "Health Care",
          desc: "นวัตกรรมเพื่อสุขภาพ ฟื้นฟูร่างกายและเสริมสร้างภูมิคุ้มกันระดับเซลล์",
          iconBg: "bg-emerald-50 text-emerald-700 border-emerald-100"
        }, {
          icon: "✨",
          label: "Skin Care",
          desc: "นวัตกรรมบำรุงผิวพรรณอย่างล้ำลึก ย้อนวัยและคืนความอ่อนเยาว์อย่างธรรมชาติ",
          iconBg: "bg-pink-50 text-pink-700 border-pink-100"
        }, {
          icon: "🧴",
          label: "Personal Care",
          desc: "ผลิตภัณฑ์ทำความสะอาดและดูแลสุขอนามัยในชีวิตประจำวันเพื่อครอบครัว",
          iconBg: "bg-indigo-50 text-indigo-700 border-indigo-100"
        }, {
          icon: "🌱",
          label: "Agriculture",
          desc: "นวัตกรรมเพื่อเกษตรกรรมออร์แกนิก ปลอดภัยและเพิ่มผลผลิตยั่งยืน (U PLANT)",
          iconBg: "bg-lime-50 text-lime-700 border-lime-100"
        }].map((p) => /* @__PURE__ */ jsxs("div", {
          className: "bg-white border border-border-default rounded-2xl p-4 flex items-start gap-3.5 shadow-sm",
          children: [/* @__PURE__ */ jsx("div", {
            className: `w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 border ${p.iconBg}`,
            children: p.icon
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("div", {
              className: "text-xs font-black text-text-primary mb-0.5",
              children: p.label
            }), /* @__PURE__ */ jsx("div", {
              className: "text-[11px] text-text-secondary leading-relaxed",
              children: p.desc
            })]
          })]
        }, p.label)), /* @__PURE__ */ jsxs("div", {
          className: "sm:col-span-2 bg-white border border-border-default rounded-2xl p-4 flex items-start gap-3.5 shadow-sm",
          children: [/* @__PURE__ */ jsx("div", {
            className: "w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 border bg-brand-gold-light/40 border-brand-gold-muted/20 text-brand-gold",
            children: "💻"
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("div", {
              className: "text-xs font-black text-text-primary mb-0.5",
              children: "Technology & Digital Tools"
            }), /* @__PURE__ */ jsx("div", {
              className: "text-[11px] text-text-secondary leading-relaxed",
              children: "นวัตกรรมเครื่องมืออัจฉริยะ AI Assistant และโปรแกรมพัฒนาธุรกิจส่วนบุคคลระดับสากลเพื่อการเติบโตรวดเร็ว"
            })]
          })]
        })]
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "max-w-4xl mx-auto px-4 mb-8",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "text-center pb-4 space-y-1",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "inline-flex items-center gap-1.5 bg-brand-gold-light/40 border border-brand-gold-muted/20 rounded-full px-3.5 py-1 text-[9px] font-black text-brand-gold uppercase tracking-widest",
          children: [/* @__PURE__ */ jsx("span", {
            className: "w-1.5 h-1.5 rounded-full bg-brand-gold"
          }), " System Strategy"]
        }), /* @__PURE__ */ jsxs("h2", {
          className: "text-xl font-display font-bold text-text-primary",
          children: ["จุดเด่นที่แตกต่างของระบบ ", /* @__PURE__ */ jsx("span", {
            className: "text-brand-gold",
            children: "Unicorn"
          })]
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "grid grid-cols-2 gap-4",
        children: [{
          icon: "⚡",
          label: "Eco-System",
          desc: "ระบบนิเวศทางธุรกิจสมบูรณ์แบบที่สนับสนุนและเติบโตไปด้วยกันทุกสายงาน",
          bg: "bg-brand-gold-light/40 border-brand-gold-muted/20 text-brand-gold"
        }, {
          icon: "🏆",
          label: "Product Strength",
          desc: "วิจัยและคัดสรรสินค้าคุณภาพสูง มีผลลัพธ์ชัดเจนและมีอัตราซื้อซ้ำสูง",
          bg: "bg-purple-50 border-purple-100 text-purple-700"
        }, {
          icon: "✨",
          label: "AI & Digital Tools",
          desc: "เครื่องมือวิเคราะห์ ดึงพาร์ทเนอร์ และวางสตรีมระบบช่วยคุณตลอด 24 ชั่วโมง",
          bg: "bg-brand-gold-light/40 border-brand-gold-muted/20 text-brand-gold"
        }, {
          icon: "⭐",
          label: "High Reward",
          desc: "ผลตอบแทนคุ้มค่าตั้งแต่วันแรกที่สมัคร แผนปันผล 8 ช่องทางที่มั่นคงและโปร่งใส",
          bg: "bg-amber-50 border-amber-100 text-amber-700"
        }].map((a) => /* @__PURE__ */ jsxs("div", {
          className: "bg-white border border-border-default rounded-2xl p-4.5 shadow-sm",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-2.5 mb-2",
            children: [/* @__PURE__ */ jsx("div", {
              className: `w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 border ${a.bg}`,
              children: a.icon
            }), /* @__PURE__ */ jsx("span", {
              className: "text-[10px] font-black text-text-primary uppercase tracking-wider",
              children: a.label
            })]
          }), /* @__PURE__ */ jsx("p", {
            className: "text-[11px] text-text-secondary leading-relaxed",
            children: a.desc
          })]
        }, a.label))
      })]
    }), /* @__PURE__ */ jsx("div", {
      className: "max-w-4xl mx-auto px-4",
      children: /* @__PURE__ */ jsxs("div", {
        className: "rounded-3xl p-6 md:p-10 text-center bg-gradient-to-br from-brand-dark to-[#2c1d0c] text-white border border-brand-gold/30 shadow-md",
        children: [/* @__PURE__ */ jsx("h2", {
          className: "text-lg md:text-xl font-display text-white mb-1.5",
          children: "พร้อมร่วมสร้างความสำเร็จแล้วหรือยัง?"
        }), /* @__PURE__ */ jsx("p", {
          className: "text-xs text-gray-300 mb-6 leading-relaxed max-w-md mx-auto",
          children: "สมัครฟรีวันนี้เพื่อสิทธิ์การใช้เครื่องมือ Smart AI ครบชุด พร้อมรับสิทธิ์ตำแหน่งและการดูแลใกล้ชิดจากผู้แนะนำ"
        }), /* @__PURE__ */ jsxs(Link, {
          to: `/auth/register?ref=${slug}`,
          className: "inline-flex items-center justify-center gap-2 w-full sm:w-auto sm:px-12 py-4 bg-brand-gold hover:bg-brand-gold-hover text-white text-sm font-bold rounded-xl mb-3 shadow-md active:scale-95 transition-all",
          children: [/* @__PURE__ */ jsx("span", {
            children: "→"
          }), " สมัครเป็นที่ปรึกษาร่วมธุรกิจ"]
        }), /* @__PURE__ */ jsxs("p", {
          className: "text-[10px] text-gray-400 flex items-center justify-center gap-1.5 mb-4",
          children: [/* @__PURE__ */ jsx("span", {
            className: "text-emerald-500",
            children: "✓"
          }), " สมัครพาร์ทเนอร์ฟรี — ไม่มีค่าใช้จ่ายรายเดือนหรือแรกเข้า"]
        }), (profile2.line_oa_url || profile2.line_id) && /* @__PURE__ */ jsxs("a", {
          href: profile2.line_oa_url || `https://line.me/ti/p/~${profile2.line_id}`,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "flex items-center gap-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl px-4 py-3 text-xs text-gray-200 text-left transition-colors max-w-md mx-auto",
          children: [/* @__PURE__ */ jsx("span", {
            className: "text-[#06c755] text-lg shrink-0",
            children: "💬"
          }), /* @__PURE__ */ jsxs("span", {
            children: ["ติดต่อผ่าน LINE ของ ", /* @__PURE__ */ jsx("strong", {
              className: "text-white font-bold",
              children: displayName
            }), " โดยตรง — ผูกลิงก์รหัสแนะนำพาร์ทเนอร์อัตโนมัติ"]
          })]
        }), (profile2.facebook_url || profile2.youtube_url || profile2.instagram_url) && /* @__PURE__ */ jsxs("div", {
          className: "flex gap-2.5 mt-4.5 justify-center flex-wrap",
          children: [profile2.facebook_url && /* @__PURE__ */ jsx("a", {
            href: profile2.facebook_url,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "flex items-center gap-1.5 px-3.5 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-300 hover:bg-blue-500/20 rounded-xl text-[10.5px] font-bold transition-all",
            children: "Facebook"
          }), profile2.youtube_url && /* @__PURE__ */ jsx("a", {
            href: profile2.youtube_url,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "flex items-center gap-1.5 px-3.5 py-2 bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 rounded-xl text-[10.5px] font-bold transition-all",
            children: "YouTube"
          }), profile2.instagram_url && /* @__PURE__ */ jsx("a", {
            href: profile2.instagram_url,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "flex items-center gap-1.5 px-3.5 py-2 bg-pink-500/10 border border-pink-500/20 text-pink-300 hover:bg-pink-500/20 rounded-xl text-[10.5px] font-bold transition-all",
            children: "Instagram"
          })]
        })]
      })
    }), /* @__PURE__ */ jsxs("footer", {
      className: "max-w-4xl mx-auto px-4 mt-10 text-center select-none",
      children: [/* @__PURE__ */ jsxs("p", {
        className: "text-[10px] text-text-muted",
        children: ["Powered by ", /* @__PURE__ */ jsx("span", {
          className: "text-brand-gold font-bold",
          children: "Unicorn Academy"
        })]
      }), /* @__PURE__ */ jsxs("p", {
        className: "text-[10px] text-text-muted font-mono mt-0.5",
        children: ["unicornsmartai.cloud/r/", /* @__PURE__ */ jsx("strong", {
          className: "text-brand-gold/80",
          children: slug
        })]
      })]
    })]
  });
});
const route14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: referral_$slug,
  loader: loader$6,
  meta: meta$6
}, Symbol.toStringTag, { value: "Module" }));
const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/products", label: "Products", icon: "📦" },
  { href: "/admin/categories", label: "Categories", icon: "🏷️" },
  { href: "/admin/knowledge", label: "AI Knowledge", icon: "🧠" }
];
function AdminLayout({ children, userEmail }) {
  const location = useLocation();
  const currentPath = location.pathname;
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex bg-bg-page font-body text-text-primary", children: [
    /* @__PURE__ */ jsxs("aside", { className: "w-[240px] bg-white border-r border-border-default flex flex-col justify-between fixed top-0 bottom-0 left-0 z-30 select-none", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "h-1 bg-brand-gold" }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 border-b border-border-default flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm select-none",
              style: { background: "linear-gradient(135deg, var(--brand-dark), var(--brand-gold))" },
              children: "U"
            }
          ),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "font-display font-bold text-sm text-text-primary leading-tight", children: "Unicorn Smart AI" }),
            /* @__PURE__ */ jsx("div", { className: "text-[9px] font-bold text-text-muted uppercase tracking-wider mt-0.5", children: "Admin Panel" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("nav", { className: "p-4 space-y-5", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] font-black text-text-muted uppercase tracking-wider px-3 mb-2", children: "Management" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-1", children: NAV_ITEMS.map(({ href, label, icon }) => {
              const isActive = currentPath === href || href !== "/admin" && currentPath.startsWith(href);
              return /* @__PURE__ */ jsxs(
                Link,
                {
                  to: href,
                  className: `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${isActive ? "bg-brand-gold-light/45 text-brand-gold font-bold" : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"}`,
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "text-base", children: icon }),
                    /* @__PURE__ */ jsx("span", { children: label })
                  ]
                },
                href
              );
            }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] font-black text-text-muted uppercase tracking-wider px-3 mb-2", children: "Views" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxs(
                Link,
                {
                  to: "/dashboard",
                  className: "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-all",
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "text-base", children: "🏠" }),
                    /* @__PURE__ */ jsx("span", { children: "Member Dashboard" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                Link,
                {
                  to: "/products",
                  className: "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-all",
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "text-base", children: "📋" }),
                    /* @__PURE__ */ jsx("span", { children: "Product Library" })
                  ]
                }
              )
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-4 border-t border-border-default bg-bg-input", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 mb-4 px-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-white border border-border-default flex items-center justify-center text-sm shadow-sm", children: "👤" }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] font-bold text-text-primary truncate", children: userEmail }),
            /* @__PURE__ */ jsx("div", { className: "text-[8px] text-text-muted font-bold uppercase tracking-wider mt-0.5", children: "Admin Session" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("form", { action: "/auth/logout", method: "POST", children: /* @__PURE__ */ jsxs(
          "button",
          {
            type: "submit",
            className: "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 transition-all text-left",
            children: [
              /* @__PURE__ */ jsx("span", { className: "text-base", children: "🚪" }),
              /* @__PURE__ */ jsx("span", { children: "Sign Out" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "text-[9px] text-text-muted text-center mt-3 font-semibold", children: "Unicorn Smart AI · Admin" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("main", { className: "flex-1 pl-[240px] min-h-screen flex flex-col", children: [
      /* @__PURE__ */ jsx("div", { className: "h-1 bg-brand-gold" }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 p-6 md:p-8", children })
    ] })
  ] });
}
function meta$5() {
  return [{
    title: "Admin Dashboard — Unicorn Smart AI"
  }];
}
async function loader$5({
  request
}) {
  const responseHeaders = new Headers();
  const {
    user
  } = await requireUser(request, responseHeaders);
  const supabase = createServiceSupabase();
  const [{
    count: productCount
  }, {
    count: categoryCount
  }, {
    count: docCount
  }] = await Promise.all([supabase.from("products").select("*", {
    count: "exact",
    head: true
  }), supabase.from("product_categories").select("*", {
    count: "exact",
    head: true
  }), supabase.from("knowledge_docs").select("*", {
    count: "exact",
    head: true
  })]);
  return {
    userEmail: user.email || "admin@unicorn.com",
    productCount: productCount ?? 0,
    categoryCount: categoryCount ?? 0,
    docCount: docCount ?? 0
  };
}
const admin_dashboard = UNSAFE_withComponentProps(function AdminDashboardPage() {
  const {
    userEmail,
    productCount,
    categoryCount,
    docCount
  } = useLoaderData();
  const stats = [{
    label: "Products (สินค้า)",
    value: productCount,
    href: "/admin/products",
    icon: "📦"
  }, {
    label: "Categories (กลุ่มสินค้า)",
    value: categoryCount,
    href: "/admin/categories",
    icon: "🏷️"
  }, {
    label: "Knowledge Base ( RAG คลังความรู้)",
    value: docCount,
    href: "/admin/knowledge",
    icon: "🧠"
  }];
  return /* @__PURE__ */ jsx(AdminLayout, {
    userEmail,
    children: /* @__PURE__ */ jsxs("div", {
      className: "space-y-6 max-w-5xl font-body text-text-primary",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "mb-8",
        children: [/* @__PURE__ */ jsx("h1", {
          className: "font-display font-bold text-3xl text-text-primary",
          children: "Admin Dashboard"
        }), /* @__PURE__ */ jsx("p", {
          className: "text-text-muted mt-1.5 text-xs sm:text-sm",
          children: "ยินดีต้อนรับสู่ระบบจัดการหลังบ้านระดับแอดมินของ Unicorn Smart AI"
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "grid grid-cols-1 sm:grid-cols-3 gap-6",
        children: stats.map((stat) => /* @__PURE__ */ jsxs(Link, {
          to: stat.href,
          className: "card-premium bg-white border border-border-default rounded-3xl p-6 hover:shadow-md transition-all group flex flex-col justify-between",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center justify-between mb-6",
            children: [/* @__PURE__ */ jsx("span", {
              className: "text-3xl select-none",
              children: stat.icon
            }), /* @__PURE__ */ jsx("span", {
              className: "text-text-muted group-hover:text-brand-gold group-hover:translate-x-0.5 transition-all",
              children: "→"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("div", {
              className: "text-3xl font-display font-black text-text-primary leading-none mb-1",
              children: stat.value.toLocaleString()
            }), /* @__PURE__ */ jsx("div", {
              className: "text-xs text-text-muted font-bold tracking-tight",
              children: stat.label
            })]
          })]
        }, stat.label))
      })]
    })
  });
});
const route15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: admin_dashboard,
  loader: loader$5,
  meta: meta$5
}, Symbol.toStringTag, { value: "Module" }));
function meta$4() {
  return [{
    title: "จัดการสินค้า — Admin"
  }];
}
async function loader$4({
  request
}) {
  const responseHeaders = new Headers();
  const {
    user
  } = await requireUser(request, responseHeaders);
  const supabase = createServiceSupabase();
  const {
    data: products2
  } = await supabase.from("products").select("*, category:product_categories(name)").order("sort_order", {
    ascending: true
  });
  return {
    userEmail: user.email || "admin@unicorn.com",
    products: products2 || []
  };
}
async function action$a({
  request
}) {
  await requireUser(request);
  const formData = await request.formData();
  const id = formData.get("id");
  const isActive = formData.get("isActive") === "true";
  const supabase = createServiceSupabase();
  const {
    error
  } = await supabase.from("products").update({
    is_active: isActive
  }).eq("id", id);
  if (error) {
    return {
      error: error.message
    };
  }
  return {
    success: true
  };
}
const admin_products_index = UNSAFE_withComponentProps(function AdminProductsPage() {
  const {
    userEmail,
    products: products2
  } = useLoaderData();
  const fetcher = useFetcher();
  return /* @__PURE__ */ jsx(AdminLayout, {
    userEmail,
    children: /* @__PURE__ */ jsxs("div", {
      className: "space-y-6 max-w-5xl font-body text-text-primary",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center justify-between mb-6",
        children: [/* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("h1", {
            className: "font-display font-bold text-2xl text-text-primary",
            children: "Products Catalog"
          }), /* @__PURE__ */ jsxs("p", {
            className: "text-xs text-text-muted mt-0.5",
            children: ["มีสินค้าทั้งหมด ", products2.length, " รายการในระบบ"]
          })]
        }), /* @__PURE__ */ jsx(Link, {
          to: "/admin/products/new",
          className: "btn-gold text-xs shadow-sm",
          children: "+ เพิ่มสินค้าใหม่"
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "bg-white border border-border-default rounded-3xl overflow-hidden shadow-sm",
        children: /* @__PURE__ */ jsx("div", {
          className: "overflow-x-auto",
          children: /* @__PURE__ */ jsxs("table", {
            className: "w-full text-xs",
            children: [/* @__PURE__ */ jsx("thead", {
              children: /* @__PURE__ */ jsxs("tr", {
                className: "border-b border-border-default bg-bg-input text-[10px] font-bold text-text-muted uppercase tracking-wider select-none",
                children: [/* @__PURE__ */ jsx("th", {
                  className: "text-left px-5 py-4",
                  children: "ข้อมูลสินค้า"
                }), /* @__PURE__ */ jsx("th", {
                  className: "text-left px-5 py-4",
                  children: "หมวดหมู่"
                }), /* @__PURE__ */ jsx("th", {
                  className: "text-right px-5 py-4",
                  children: "ราคาสมาชิก"
                }), /* @__PURE__ */ jsx("th", {
                  className: "text-right px-5 py-4",
                  children: "ราคาขายปลีก"
                }), /* @__PURE__ */ jsx("th", {
                  className: "text-right px-5 py-4",
                  children: "กำไรสะสม"
                }), /* @__PURE__ */ jsx("th", {
                  className: "text-right px-5 py-4",
                  children: "PV คะแนน"
                }), /* @__PURE__ */ jsx("th", {
                  className: "text-center px-5 py-4",
                  children: "สถานะการแสดง"
                }), /* @__PURE__ */ jsx("th", {
                  className: "text-center px-5 py-4",
                  children: "เครื่องมือ"
                })]
              })
            }), /* @__PURE__ */ jsxs("tbody", {
              className: "divide-y divide-border-muted",
              children: [products2.map((product) => {
                var _a, _b, _c;
                const profit = product.retail_price - product.member_price;
                const isToggling = ((_a = fetcher.formData) == null ? void 0 : _a.get("id")) === product.id;
                const isActive = isToggling ? ((_b = fetcher.formData) == null ? void 0 : _b.get("isActive")) === "true" : product.is_active;
                return /* @__PURE__ */ jsxs("tr", {
                  className: "hover:bg-bg-hover/30 transition-colors",
                  children: [/* @__PURE__ */ jsx("td", {
                    className: "px-5 py-3",
                    children: /* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-3",
                      children: [product.image_url ? /* @__PURE__ */ jsx("img", {
                        src: product.image_url,
                        alt: product.name,
                        className: "w-10 h-10 rounded-xl object-cover shrink-0 border border-border-default shadow-sm"
                      }) : /* @__PURE__ */ jsx("div", {
                        className: "w-10 h-10 rounded-xl bg-bg-input border border-border-default flex items-center justify-center text-xl shrink-0",
                        children: "📦"
                      }), /* @__PURE__ */ jsxs("div", {
                        className: "min-w-0 max-w-[200px]",
                        children: [/* @__PURE__ */ jsx("p", {
                          className: "font-bold text-text-primary truncate",
                          children: product.name
                        }), /* @__PURE__ */ jsx("p", {
                          className: "text-[10px] text-text-muted truncate mt-0.5",
                          children: product.description
                        })]
                      })]
                    })
                  }), /* @__PURE__ */ jsx("td", {
                    className: "px-5 py-3 text-text-secondary font-semibold",
                    children: ((_c = product.category) == null ? void 0 : _c.name) ?? "—"
                  }), /* @__PURE__ */ jsxs("td", {
                    className: "px-5 py-3 text-right text-text-secondary font-bold font-mono",
                    children: ["฿", product.member_price.toLocaleString()]
                  }), /* @__PURE__ */ jsxs("td", {
                    className: "px-5 py-3 text-right text-text-secondary font-bold font-mono",
                    children: ["฿", product.retail_price.toLocaleString()]
                  }), /* @__PURE__ */ jsxs("td", {
                    className: "px-5 py-3 text-right font-black text-brand-gold font-mono",
                    children: ["฿", profit.toLocaleString()]
                  }), /* @__PURE__ */ jsx("td", {
                    className: "px-5 py-3 text-right text-text-secondary font-bold font-mono",
                    children: product.pv
                  }), /* @__PURE__ */ jsx("td", {
                    className: "px-5 py-3 text-center",
                    children: /* @__PURE__ */ jsxs(fetcher.Form, {
                      method: "post",
                      children: [/* @__PURE__ */ jsx("input", {
                        type: "hidden",
                        name: "id",
                        value: product.id
                      }), /* @__PURE__ */ jsx("input", {
                        type: "hidden",
                        name: "isActive",
                        value: isActive ? "false" : "true"
                      }), /* @__PURE__ */ jsx("button", {
                        type: "submit",
                        disabled: isToggling,
                        className: `text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border transition-all ${isActive ? "bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100" : "bg-bg-input border-border-strong text-text-muted hover:bg-white"}`,
                        children: isActive ? "Active" : "Hidden"
                      })]
                    })
                  }), /* @__PURE__ */ jsx("td", {
                    className: "px-5 py-3 text-center",
                    children: /* @__PURE__ */ jsx(Link, {
                      to: `/admin/products/${product.id}`,
                      className: "text-[11px] font-black text-brand-gold hover:text-brand-gold-hover transition-colors",
                      children: "แก้ไข"
                    })
                  })]
                }, product.id);
              }), products2.length === 0 && /* @__PURE__ */ jsx("tr", {
                children: /* @__PURE__ */ jsx("td", {
                  colSpan: 8,
                  className: "px-5 py-12 text-center text-text-muted italic select-none",
                  children: 'ยังไม่มีสินค้าในระบบ — กรุณากด "+ เพิ่มสินค้าใหม่" เพื่อเริ่มต้น'
                })
              })]
            })]
          })
        })
      })]
    })
  });
});
const route16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$a,
  default: admin_products_index,
  loader: loader$4,
  meta: meta$4
}, Symbol.toStringTag, { value: "Module" }));
const EMPTY = {
  category_id: "",
  name: "",
  description: "",
  member_price: 0,
  retail_price: 0,
  pv: 0,
  image_url: "",
  ingredients: [],
  highlights: [],
  selling_points: [],
  u_selling_msg: "",
  usage_guide: "",
  package_size: "",
  is_active: true,
  is_featured: false,
  sort_order: 0
};
function ProductForm({ product, categories, onSave, onDelete, isSubmitting = false }) {
  const [form, setForm] = useState(product ? {
    category_id: product.category_id ?? "",
    name: product.name,
    description: product.description,
    member_price: product.member_price,
    retail_price: product.retail_price,
    pv: product.pv,
    image_url: product.image_url ?? "",
    ingredients: product.ingredients ?? [],
    highlights: product.highlights ?? [],
    selling_points: product.selling_points ?? [],
    u_selling_msg: product.u_selling_msg ?? "",
    usage_guide: product.usage_guide ?? "",
    package_size: product.package_size ?? "",
    is_active: product.is_active,
    is_featured: product.is_featured,
    sort_order: product.sort_order
  } : EMPTY);
  const [imgUploading, setImgUploading] = useState(false);
  const addItem = (key) => setForm((f) => ({ ...f, [key]: [...f[key], ""] }));
  const updateItem = (key, i, v) => setForm((f) => ({ ...f, [key]: f[key].map((x, j) => j === i ? v : x) }));
  const removeItem = (key, i) => setForm((f) => ({ ...f, [key]: f[key].filter((_, j) => j !== i) }));
  async function handleImageUpload(file) {
    setImgUploading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type, folder: "products" })
      });
      const { uploadUrl, publicUrl } = await res.json();
      await fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
      setForm((f) => ({ ...f, image_url: publicUrl }));
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("ไม่สามารถอัปโหลดรูปภาพได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setImgUploading(false);
    }
  }
  const profit = Number(form.retail_price) - Number(form.member_price);
  return /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto space-y-6 pb-12 font-body text-text-primary", children: [
    /* @__PURE__ */ jsx(Section, { title: "ข้อมูลพื้นฐานผลิตภัณฑ์", icon: "📦", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsx(Field, { label: "หมวดหมู่สินค้า", required: true, className: "col-span-2", children: /* @__PURE__ */ jsxs(
        "select",
        {
          className: "w-full px-4 py-2.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-bold text-xs sm:text-sm text-text-primary",
          value: form.category_id,
          onChange: (e) => setForm((f) => ({ ...f, category_id: e.target.value })),
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "-- เลือกหมวดหมู่สินค้า --" }),
            categories.map((c) => /* @__PURE__ */ jsx("option", { value: c.id, children: c.name }, c.id))
          ]
        }
      ) }),
      /* @__PURE__ */ jsx(Field, { label: "ชื่อสินค้า", required: true, className: "col-span-2", children: /* @__PURE__ */ jsx(
        "input",
        {
          className: "w-full px-4 py-2.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-bold text-xs sm:text-sm text-text-primary",
          value: form.name,
          onChange: (e) => setForm((f) => ({ ...f, name: e.target.value })),
          placeholder: "เช่น DEEZE SHOT GLUCONA"
        }
      ) }),
      /* @__PURE__ */ jsx(Field, { label: "คำอธิบายสรุป", required: true, className: "col-span-2", children: /* @__PURE__ */ jsx(
        "textarea",
        {
          className: "w-full px-4 py-2.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-bold text-xs sm:text-sm text-text-primary",
          rows: 2,
          value: form.description,
          onChange: (e) => setForm((f) => ({ ...f, description: e.target.value })),
          placeholder: "เช่น อินซูลินธรรมชาติแบบช็อต ดูแลระดับน้ำตาล"
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsx(Section, { title: "รูปภาพสินค้า", icon: "🖼️", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-4 items-start flex-col sm:flex-row", children: [
      /* @__PURE__ */ jsx("div", { className: "w-28 h-28 rounded-2xl bg-bg-input border border-border-default flex items-center justify-center shrink-0 overflow-hidden shadow-inner", children: form.image_url ? /* @__PURE__ */ jsx("img", { src: form.image_url, alt: form.name, className: "w-full h-full object-cover animate-fade-in" }) : /* @__PURE__ */ jsx("span", { className: "text-3xl select-none", children: "📦" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 w-full space-y-2.5", children: [
        /* @__PURE__ */ jsxs("label", { className: "block w-full border border-dashed border-border-strong rounded-2xl p-6 text-center cursor-pointer hover:border-brand-gold hover:bg-brand-gold-light/20 transition-all select-none", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "file",
              className: "hidden",
              accept: "image/*",
              onChange: (e) => {
                var _a;
                return ((_a = e.target.files) == null ? void 0 : _a[0]) && handleImageUpload(e.target.files[0]);
              }
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-xs text-text-secondary font-bold", children: imgUploading ? "⏳ กำลังอัปโหลดภาพ..." : "คลิกที่นี่เพื่อเลือกอัปโหลดรูปภาพผลิตภัณฑ์" })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            className: "w-full px-4 py-2 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-semibold text-xs text-text-secondary",
            value: form.image_url,
            onChange: (e) => setForm((f) => ({ ...f, image_url: e.target.value })),
            placeholder: "หรือ วาง URL ลิงก์รูปภาพจากภายนอกโดยตรงที่นี่"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs(Section, { title: "ตารางราคาและคะแนน PV", icon: "💰", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsx(Field, { label: "ราคาสมาชิก (฿)", required: true, children: /* @__PURE__ */ jsx(
          "input",
          {
            className: "w-full px-4 py-2.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-bold text-xs sm:text-sm text-text-primary",
            type: "number",
            min: "0",
            step: "0.01",
            value: form.member_price,
            onChange: (e) => setForm((f) => ({ ...f, member_price: +e.target.value }))
          }
        ) }),
        /* @__PURE__ */ jsx(Field, { label: "ราคาขายปลีก (฿)", required: true, children: /* @__PURE__ */ jsx(
          "input",
          {
            className: "w-full px-4 py-2.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-bold text-xs sm:text-sm text-text-primary",
            type: "number",
            min: "0",
            step: "0.01",
            value: form.retail_price,
            onChange: (e) => setForm((f) => ({ ...f, retail_price: +e.target.value }))
          }
        ) }),
        /* @__PURE__ */ jsx(Field, { label: "PV คะแนน", required: true, children: /* @__PURE__ */ jsx(
          "input",
          {
            className: "w-full px-4 py-2.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-bold text-xs sm:text-sm text-text-primary",
            type: "number",
            min: "0",
            step: "0.01",
            value: form.pv,
            onChange: (e) => setForm((f) => ({ ...f, pv: +e.target.value }))
          }
        ) })
      ] }),
      profit > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-4 bg-brand-gold-light/40 border border-brand-gold-muted/20 rounded-xl px-4 py-3 text-xs text-text-secondary", children: [
        "วิเคราะห์กำไรสะสมต่อชิ้น:",
        " ",
        /* @__PURE__ */ jsxs("strong", { className: "text-brand-gold font-black", children: [
          "฿",
          profit.toLocaleString("th-TH", { minimumFractionDigits: 2 })
        ] }),
        " ",
        "(",
        (profit / Number(form.retail_price) * 100).toFixed(1),
        "%)"
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Section, { title: "ข้อมูลคุณลักษณะสินค้าเชิงลึก", icon: "🔬", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsx(Field, { label: "ขนาดบรรจุภัณฑ์", children: /* @__PURE__ */ jsx(
          "input",
          {
            className: "w-full px-4 py-2.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-bold text-xs sm:text-sm text-text-primary",
            value: form.package_size,
            onChange: (e) => setForm((f) => ({ ...f, package_size: e.target.value })),
            placeholder: "เช่น 15 ซอง / กล่อง"
          }
        ) }),
        /* @__PURE__ */ jsx(Field, { label: "วิธีรับประทาน / วิธีใช้งาน", children: /* @__PURE__ */ jsx(
          "input",
          {
            className: "w-full px-4 py-2.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-bold text-xs sm:text-sm text-text-primary",
            value: form.usage_guide,
            onChange: (e) => setForm((f) => ({ ...f, usage_guide: e.target.value })),
            placeholder: "เช่น วันละ 1 ช็อต ก่อนนอน"
          }
        ) })
      ] }),
      /* @__PURE__ */ jsx(
        ArrayField,
        {
          label: "ส่วนประกอบสำคัญ",
          items: form.ingredients,
          onAdd: () => addItem("ingredients"),
          onUpdate: (i, v) => updateItem("ingredients", i, v),
          onRemove: (i) => removeItem("ingredients", i),
          placeholder: "เช่น Red Yeast Rice, Coenzyme Q10"
        }
      ),
      /* @__PURE__ */ jsx(
        ArrayField,
        {
          label: "จุดเด่นผลิตภัณฑ์ / สรรพคุณหลัก",
          items: form.highlights,
          onAdd: () => addItem("highlights"),
          onUpdate: (i, v) => updateItem("highlights", i, v),
          onRemove: (i) => removeItem("highlights", i),
          placeholder: "เช่น ช่วยบล็อกการสร้างคอเลสเตอรอล"
        }
      ),
      /* @__PURE__ */ jsx(
        ArrayField,
        {
          label: "จุดขายทางการตลาด (U-SELLING)",
          items: form.selling_points,
          onAdd: () => addItem("selling_points"),
          onUpdate: (i, v) => updateItem("selling_points", i, v),
          onRemove: (i) => removeItem("selling_points", i),
          placeholder: "เช่น นวัตกรรมช็อตเพื่อหัวใจแข็งแรง"
        }
      ),
      /* @__PURE__ */ jsx(Field, { label: "ข้อความโฆษณา U-SELLING หลัก (แสดงใน Sale Page)", children: /* @__PURE__ */ jsx(
        "input",
        {
          className: "w-full px-4 py-2.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-bold text-xs sm:text-sm text-text-primary",
          value: form.u_selling_msg,
          onChange: (e) => setForm((f) => ({ ...f, u_selling_msg: e.target.value })),
          placeholder: `"ล้างท่อเลือดเคลียร์ไขมันเลว ดูแลหัวใจระดับเซลล์"`
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx(Section, { title: "การจัดลำดับการแสดงผล", icon: "⚙️", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsx(Field, { label: "ลำดับแสดง", children: /* @__PURE__ */ jsx(
        "input",
        {
          className: "w-full px-4 py-2.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-bold text-xs sm:text-sm text-text-primary",
          type: "number",
          min: "0",
          value: form.sort_order,
          onChange: (e) => setForm((f) => ({ ...f, sort_order: +e.target.value }))
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 pt-6", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            id: "is_active",
            className: "w-4.5 h-4.5 accent-brand-gold cursor-pointer",
            checked: form.is_active,
            onChange: (e) => setForm((f) => ({ ...f, is_active: e.target.checked }))
          }
        ),
        /* @__PURE__ */ jsx("label", { htmlFor: "is_active", className: "text-xs text-text-secondary font-bold cursor-pointer select-none", children: "อนุญาตให้แสดงสินค้า" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 pt-6", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            id: "is_featured",
            className: "w-4.5 h-4.5 accent-brand-gold cursor-pointer",
            checked: form.is_featured,
            onChange: (e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))
          }
        ),
        /* @__PURE__ */ jsx("label", { htmlFor: "is_featured", className: "text-xs text-text-secondary font-bold cursor-pointer select-none", children: "สินค้าแนะนำ (Featured)" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => onSave(form),
          disabled: isSubmitting || imgUploading || !form.name || !form.category_id,
          className: "flex-1 btn-gold disabled:opacity-50 text-sm font-bold shadow-sm",
          children: isSubmitting ? "⏳ กำลังบันทึก..." : product ? "💾 บันทึกการแก้ไข" : "➕ สร้างสินค้าใหม่"
        }
      ),
      onDelete && /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => {
            if (confirm("คุณแน่ใจว่าต้องการลบสินค้านี้ใช่หรือไม่?")) onDelete();
          },
          disabled: isSubmitting,
          className: "btn-outline border-red-200 text-red-600 hover:bg-red-50 text-sm font-bold shadow-sm px-6",
          children: "🗑️ ลบสินค้า"
        }
      )
    ] })
  ] });
}
function Section({ title, icon, children }) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-white border border-border-default rounded-3xl overflow-hidden shadow-sm", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-5 py-4 border-b border-border-default bg-bg-input", children: [
      /* @__PURE__ */ jsx("span", { className: "text-base select-none", children: icon }),
      /* @__PURE__ */ jsx("h3", { className: "font-display font-bold text-sm text-text-primary", children: title })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "p-5", children })
  ] });
}
function Field({ label, required, className, children }) {
  return /* @__PURE__ */ jsxs("div", { className, children: [
    /* @__PURE__ */ jsxs("label", { className: "block text-[10px] font-black text-text-muted uppercase tracking-wider mb-2 select-none", children: [
      label,
      required && /* @__PURE__ */ jsx("span", { className: "text-red-500 ml-0.5", children: "*" })
    ] }),
    children
  ] });
}
function ArrayField({ label, items, onAdd, onUpdate, onRemove, placeholder }) {
  return /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-4 border-t border-border-muted", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
      /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black text-text-muted uppercase tracking-wider select-none", children: label }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onAdd,
          type: "button",
          className: "text-[10px] font-black text-brand-gold hover:text-brand-gold-hover transition-colors",
          children: "+ เพิ่มรายการ"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      items.map((item, i) => /* @__PURE__ */ jsxs("div", { className: "flex gap-2 animate-fade-in", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            className: "w-full px-4 py-2 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-semibold text-xs text-text-primary",
            value: item,
            onChange: (e) => onUpdate(i, e.target.value),
            placeholder
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => onRemove(i),
            type: "button",
            className: "w-8 h-8 shrink-0 bg-bg-input border border-border-strong rounded-xl flex items-center justify-center text-text-muted hover:text-red-600 hover:border-red-200 transition-all text-xs",
            children: "✕"
          }
        )
      ] }, i)),
      items.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-xs text-text-muted italic py-1 select-none", children: 'กด "+ เพิ่มรายการ" เพื่อเพิ่มคุณลักษณะผลิตภัณฑ์' })
    ] })
  ] });
}
function meta$3() {
  return [{
    title: "เพิ่มสินค้าใหม่ — Admin"
  }];
}
async function loader$3({
  request
}) {
  const responseHeaders = new Headers();
  const {
    user
  } = await requireUser(request, responseHeaders);
  const supabase = createServiceSupabase();
  const {
    data: categories
  } = await supabase.from("product_categories").select("*").eq("is_active", true).order("sort_order");
  return {
    userEmail: user.email || "admin@unicorn.com",
    categories: categories || []
  };
}
const admin_products_new = UNSAFE_withComponentProps(function AdminNewProductPage() {
  const {
    userEmail,
    categories
  } = useLoaderData();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  async function handleCreate(data2) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/admin/products/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data2)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "เกิดข้อผิดพลาดในการบันทึกสินค้า");
      }
      navigate("/admin/products");
    } catch (err) {
      alert(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setIsSubmitting(false);
    }
  }
  return /* @__PURE__ */ jsx(AdminLayout, {
    userEmail,
    children: /* @__PURE__ */ jsxs("div", {
      className: "space-y-6 max-w-4xl font-body text-text-primary",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-3 mb-6",
        children: [/* @__PURE__ */ jsxs(Link, {
          to: "/admin/products",
          className: "flex items-center gap-1.5 text-text-secondary hover:text-brand-gold font-semibold text-xs transition-colors",
          children: [/* @__PURE__ */ jsx(ChevronLeft, {
            size: 16
          }), /* @__PURE__ */ jsx("span", {
            children: "กลับหน้ารายการสินค้า"
          })]
        }), /* @__PURE__ */ jsx("span", {
          className: "w-1 h-4 bg-brand-gold rounded-full"
        }), /* @__PURE__ */ jsx("h1", {
          className: "font-display font-bold text-xl text-text-primary",
          children: "เพิ่มสินค้าใหม่"
        })]
      }), /* @__PURE__ */ jsx(ProductForm, {
        categories,
        onSave: handleCreate,
        isSubmitting
      })]
    })
  });
});
async function action$9({
  request
}) {
  await requireUser(request);
  const data2 = await request.json();
  const supabase = createServiceSupabase();
  const {
    error
  } = await supabase.from("products").insert({
    category_id: data2.category_id,
    name: data2.name,
    description: data2.description,
    member_price: data2.member_price,
    retail_price: data2.retail_price,
    pv: data2.pv,
    image_url: data2.image_url || null,
    ingredients: data2.ingredients,
    highlights: data2.highlights,
    selling_points: data2.selling_points,
    u_selling_msg: data2.u_selling_msg || null,
    usage_guide: data2.usage_guide || null,
    package_size: data2.package_size || null,
    is_active: data2.is_active,
    is_featured: data2.is_featured,
    sort_order: data2.sort_order
  });
  if (error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 400,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  return {
    success: true
  };
}
const route17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$9,
  default: admin_products_new,
  loader: loader$3,
  meta: meta$3
}, Symbol.toStringTag, { value: "Module" }));
function meta$2() {
  return [{
    title: "แก้ไขสินค้า — Admin"
  }];
}
async function loader$2({
  params,
  request
}) {
  const {
    id
  } = params;
  if (!id) {
    throw new Response("ID not provided", {
      status: 400
    });
  }
  const responseHeaders = new Headers();
  const {
    user
  } = await requireUser(request, responseHeaders);
  const supabase = createServiceSupabase();
  const {
    data: product
  } = await supabase.from("products").select("*").eq("id", id).single();
  if (!product) {
    throw new Response("Product not found", {
      status: 404
    });
  }
  const {
    data: categories
  } = await supabase.from("product_categories").select("*").eq("is_active", true).order("sort_order");
  return {
    userEmail: user.email || "admin@unicorn.com",
    product,
    categories: categories || [],
    productId: id
  };
}
const admin_products_edit = UNSAFE_withComponentProps(function AdminEditProductPage() {
  const {
    userEmail,
    product,
    categories,
    productId
  } = useLoaderData();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  async function handleUpdate(data2) {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/admin/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data2)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "เกิดข้อผิดพลาดในการอัปเดตสินค้า");
      }
      navigate("/admin/products");
    } catch (err) {
      alert(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setIsSubmitting(false);
    }
  }
  async function handleDelete() {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/admin/products/${productId}`, {
        method: "DELETE"
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "เกิดข้อผิดพลาดในการลบสินค้า");
      }
      navigate("/admin/products");
    } catch (err) {
      alert(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setIsSubmitting(false);
    }
  }
  return /* @__PURE__ */ jsx(AdminLayout, {
    userEmail,
    children: /* @__PURE__ */ jsxs("div", {
      className: "space-y-6 max-w-4xl font-body text-text-primary",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-3 mb-6",
        children: [/* @__PURE__ */ jsxs(Link, {
          to: "/admin/products",
          className: "flex items-center gap-1.5 text-text-secondary hover:text-brand-gold font-semibold text-xs transition-colors",
          children: [/* @__PURE__ */ jsx(ChevronLeft, {
            size: 16
          }), /* @__PURE__ */ jsx("span", {
            children: "กลับหน้ารายการสินค้า"
          })]
        }), /* @__PURE__ */ jsx("span", {
          className: "w-1 h-4 bg-brand-gold rounded-full"
        }), /* @__PURE__ */ jsx("h1", {
          className: "font-display font-bold text-xl text-text-primary",
          children: "แก้ไขสินค้า"
        })]
      }), /* @__PURE__ */ jsx(ProductForm, {
        product,
        categories,
        onSave: handleUpdate,
        onDelete: handleDelete,
        isSubmitting
      })]
    })
  });
});
async function action$8({
  request,
  params
}) {
  await requireUser(request);
  const {
    id
  } = params;
  if (!id) {
    return new Response(JSON.stringify({
      error: "ID missing"
    }), {
      status: 400
    });
  }
  const supabase = createServiceSupabase();
  if (request.method === "DELETE") {
    const {
      error
    } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      return new Response(JSON.stringify({
        error: error.message
      }), {
        status: 400
      });
    }
    return {
      success: true
    };
  }
  if (request.method === "PUT") {
    const data2 = await request.json();
    const {
      error
    } = await supabase.from("products").update({
      category_id: data2.category_id,
      name: data2.name,
      description: data2.description,
      member_price: data2.member_price,
      retail_price: data2.retail_price,
      pv: data2.pv,
      image_url: data2.image_url || null,
      ingredients: data2.ingredients,
      highlights: data2.highlights,
      selling_points: data2.selling_points,
      u_selling_msg: data2.u_selling_msg || null,
      usage_guide: data2.usage_guide || null,
      package_size: data2.package_size || null,
      is_active: data2.is_active,
      is_featured: data2.is_featured,
      sort_order: data2.sort_order
    }).eq("id", id);
    if (error) {
      return new Response(JSON.stringify({
        error: error.message
      }), {
        status: 400
      });
    }
    return {
      success: true
    };
  }
  return new Response(JSON.stringify({
    error: "Method not allowed"
  }), {
    status: 405
  });
}
const route18 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$8,
  default: admin_products_edit,
  loader: loader$2,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
function meta$1() {
  return [{
    title: "จัดการหมวดหมู่สินค้า — Admin Panel"
  }];
}
async function loader$1({
  request
}) {
  const responseHeaders = new Headers();
  const {
    user
  } = await requireUser(request, responseHeaders);
  const supabase = createServiceSupabase();
  const {
    data: categories
  } = await supabase.from("product_categories").select("*").order("sort_order", {
    ascending: true
  });
  return {
    userEmail: user.email || "admin@unicorn.com",
    categories: categories || []
  };
}
async function action$7({
  request
}) {
  await requireUser(request);
  const method = request.method;
  const supabase = createServiceSupabase();
  if (method === "DELETE") {
    const data22 = await request.json();
    const {
      error
    } = await supabase.from("product_categories").delete().eq("id", data22.id);
    if (error) {
      return new Response(JSON.stringify({
        error: error.message
      }), {
        status: 400
      });
    }
    return {
      success: true
    };
  }
  const data2 = await request.json();
  if (method === "POST") {
    const {
      error
    } = await supabase.from("product_categories").insert({
      name: data2.name,
      slug: data2.slug,
      sort_order: data2.sort_order,
      is_active: data2.is_active,
      banner_url: data2.banner_url || null,
      icon_url: data2.icon_url || null
    });
    if (error) {
      return new Response(JSON.stringify({
        error: error.message
      }), {
        status: 400
      });
    }
    return {
      success: true
    };
  }
  if (method === "PUT") {
    const {
      error
    } = await supabase.from("product_categories").update({
      name: data2.name,
      slug: data2.slug,
      sort_order: data2.sort_order,
      is_active: data2.is_active,
      banner_url: data2.banner_url || null,
      icon_url: data2.icon_url || null
    }).eq("id", data2.id);
    if (error) {
      return new Response(JSON.stringify({
        error: error.message
      }), {
        status: 400
      });
    }
    return {
      success: true
    };
  }
  return new Response(JSON.stringify({
    error: "Method not allowed"
  }), {
    status: 405
  });
}
const admin_categories = UNSAFE_withComponentProps(function AdminCategoriesPage() {
  const {
    userEmail,
    categories: initialCategories
  } = useLoaderData();
  const navigate = useNavigate();
  const [categories, setCategories] = useState(initialCategories);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [bannerUrl, setBannerUrl] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleNameChange = (val) => {
    setName(val);
    if (!editingId) {
      const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      setSlug(autoSlug);
    }
  };
  const startEdit = (cat) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setSortOrder(cat.sort_order);
    setIsActive(cat.is_active);
    setBannerUrl(cat.banner_url || "");
    setIconUrl(cat.icon_url || "");
    setError("");
  };
  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setSortOrder(0);
    setIsActive(true);
    setBannerUrl("");
    setIconUrl("");
    setError("");
  };
  const handleToggleActive = async (id, currentStatus) => {
    var _a, _b, _c;
    try {
      const res = await fetch("/admin/categories", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id,
          name: ((_a = categories.find((c) => c.id === id)) == null ? void 0 : _a.name) || "",
          slug: ((_b = categories.find((c) => c.id === id)) == null ? void 0 : _b.slug) || "",
          sort_order: ((_c = categories.find((c) => c.id === id)) == null ? void 0 : _c.sort_order) || 0,
          is_active: !currentStatus
        })
      });
      if (!res.ok) throw new Error("บันทึกการเปลี่ยนสถานะล้มเหลว");
      setCategories((prev) => prev.map((c) => c.id === id ? {
        ...c,
        is_active: !currentStatus
      } : c));
    } catch (err) {
      alert(err.message || "ไม่สามารถเปลี่ยนสถานะได้");
    }
  };
  const handleDelete = async (id, catName) => {
    if (!confirm(`คุณแน่ใจหรือไม่ที่จะลบหมวดหมู่ "${catName}"?`)) return;
    try {
      const res = await fetch("/admin/categories", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id
        })
      });
      if (!res.ok) throw new Error("การลบล้มเหลว");
      setCategories((prev) => prev.filter((c) => c.id !== id));
      if (editingId === id) cancelEdit();
    } catch (err) {
      alert(err.message || "เกิดข้อผิดพลาดในการลบ");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !slug) {
      setError("กรุณากรอกชื่อและ Slug ให้ครบถ้วน");
      return;
    }
    setLoading(true);
    setError("");
    const payload = {
      id: editingId || void 0,
      name,
      slug,
      sort_order: Number(sortOrder),
      is_active: isActive,
      banner_url: bannerUrl,
      icon_url: iconUrl
    };
    try {
      const res = await fetch("/admin/categories", {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const data2 = await res.json().catch(() => ({}));
        throw new Error(data2.error || "เกิดข้อผิดพลาดในการบันทึก");
      }
      if (editingId) {
        setCategories((prev) => prev.map((c) => c.id === editingId ? {
          ...c,
          ...payload,
          id: c.id
        } : c));
        cancelEdit();
      } else {
        navigate("/admin/categories", {
          replace: true
        });
        window.location.reload();
      }
    } catch (err) {
      setError(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };
  const filtered = useMemo(() => {
    return categories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.slug.toLowerCase().includes(search.toLowerCase()));
  }, [categories, search]);
  return /* @__PURE__ */ jsx(AdminLayout, {
    userEmail,
    children: /* @__PURE__ */ jsxs("div", {
      className: "space-y-6 max-w-5xl font-body text-text-primary",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "mb-6",
        children: [/* @__PURE__ */ jsx("h1", {
          className: "font-display font-bold text-2xl text-text-primary",
          children: "Product Categories"
        }), /* @__PURE__ */ jsx("p", {
          className: "text-xs text-text-muted mt-1.5",
          children: "จัดการกลุ่มและหมวดหมู่สินค้าสำหรับการแสดงผลในหน้าร้าน สิทธิ์สมาชิก และ RAG AI System"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "grid grid-cols-1 lg:grid-cols-3 gap-6 items-start",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "lg:col-span-2 space-y-4",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center justify-between gap-3",
            children: [/* @__PURE__ */ jsx("input", {
              type: "text",
              placeholder: "ค้นหาหมวดหมู่สินค้า...",
              value: search,
              onChange: (e) => setSearch(e.target.value),
              className: "w-full max-w-sm px-4 py-2.5 bg-white border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-medium text-xs text-text-primary"
            }), /* @__PURE__ */ jsxs("span", {
              className: "text-xs text-text-muted font-bold shrink-0",
              children: ["พบ ", filtered.length, " รายการ"]
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "bg-white border border-border-default rounded-3xl overflow-hidden shadow-sm",
            children: /* @__PURE__ */ jsx("div", {
              className: "overflow-x-auto",
              children: /* @__PURE__ */ jsxs("table", {
                className: "w-full text-xs text-left",
                children: [/* @__PURE__ */ jsx("thead", {
                  children: /* @__PURE__ */ jsxs("tr", {
                    className: "border-b border-border-default bg-bg-input text-[10px] font-bold text-text-muted uppercase tracking-wider select-none",
                    children: [/* @__PURE__ */ jsx("th", {
                      className: "px-5 py-4 text-center w-16",
                      children: "ลำดับ"
                    }), /* @__PURE__ */ jsx("th", {
                      className: "px-5 py-4",
                      children: "ชื่อหมวดหมู่"
                    }), /* @__PURE__ */ jsx("th", {
                      className: "px-5 py-4",
                      children: "Slug Key"
                    }), /* @__PURE__ */ jsx("th", {
                      className: "px-5 py-4 text-center",
                      children: "สถานะการแสดง"
                    }), /* @__PURE__ */ jsx("th", {
                      className: "px-5 py-4 text-right",
                      children: "เครื่องมือจัดการ"
                    })]
                  })
                }), /* @__PURE__ */ jsx("tbody", {
                  className: "divide-y divide-border-muted",
                  children: filtered.length === 0 ? /* @__PURE__ */ jsx("tr", {
                    children: /* @__PURE__ */ jsx("td", {
                      colSpan: 5,
                      className: "px-5 py-8 text-center text-text-muted italic select-none",
                      children: "ไม่พบหมวดหมู่สินค้าในระบบ"
                    })
                  }) : filtered.sort((a, b) => a.sort_order - b.sort_order).map((cat) => /* @__PURE__ */ jsxs("tr", {
                    className: `hover:bg-bg-hover/30 transition-colors ${editingId === cat.id ? "bg-brand-gold-light/20" : ""}`,
                    children: [/* @__PURE__ */ jsx("td", {
                      className: "px-5 py-3 text-center font-bold text-text-secondary font-mono",
                      children: cat.sort_order
                    }), /* @__PURE__ */ jsx("td", {
                      className: "px-5 py-3",
                      children: /* @__PURE__ */ jsxs("div", {
                        className: "font-bold text-text-primary flex items-center gap-2",
                        children: [cat.icon_url ? /* @__PURE__ */ jsx("span", {
                          className: "text-base select-none",
                          children: cat.icon_url
                        }) : /* @__PURE__ */ jsx("span", {
                          className: "text-base select-none",
                          children: "🏷️"
                        }), /* @__PURE__ */ jsx("span", {
                          children: cat.name
                        })]
                      })
                    }), /* @__PURE__ */ jsx("td", {
                      className: "px-5 py-3 font-mono text-[11px] text-text-secondary",
                      children: cat.slug
                    }), /* @__PURE__ */ jsx("td", {
                      className: "px-5 py-3 text-center",
                      children: /* @__PURE__ */ jsx("button", {
                        type: "button",
                        onClick: () => handleToggleActive(cat.id, cat.is_active),
                        className: `text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border transition-all ${cat.is_active ? "bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100" : "bg-bg-input border-border-strong text-text-muted hover:bg-white"}`,
                        children: cat.is_active ? "Active" : "Hidden"
                      })
                    }), /* @__PURE__ */ jsxs("td", {
                      className: "px-5 py-3 text-right space-x-3",
                      children: [/* @__PURE__ */ jsx("button", {
                        type: "button",
                        onClick: () => startEdit(cat),
                        className: "text-xs font-bold text-brand-gold hover:underline",
                        children: "แก้ไข"
                      }), /* @__PURE__ */ jsx("button", {
                        type: "button",
                        onClick: () => handleDelete(cat.id, cat.name),
                        className: "text-xs font-bold text-red-600 hover:underline",
                        children: "ลบ"
                      })]
                    })]
                  }, cat.id))
                })]
              })
            })
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "bg-white border border-border-default rounded-3xl p-5 shadow-sm space-y-4",
          children: [/* @__PURE__ */ jsx("h3", {
            className: "font-display font-bold text-base text-text-primary flex items-center gap-2 select-none",
            children: /* @__PURE__ */ jsx("span", {
              children: editingId ? "✏️ แก้ไขหมวดหมู่" : "➕ เพิ่มหมวดหมู่ใหม่"
            })
          }), error && /* @__PURE__ */ jsxs("div", {
            className: "p-3 bg-red-50 text-red-700 border border-red-100 rounded-xl text-xs font-bold animate-pulse",
            children: ["⚠️ ", error]
          }), /* @__PURE__ */ jsxs("form", {
            onSubmit: handleSubmit,
            className: "space-y-4",
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("label", {
                className: "block text-[10px] font-black text-text-muted uppercase tracking-wider mb-1.5 select-none",
                children: "ชื่อหมวดหมู่"
              }), /* @__PURE__ */ jsx("input", {
                type: "text",
                value: name,
                onChange: (e) => handleNameChange(e.target.value),
                placeholder: "เช่น HEALTH CARE",
                className: "w-full px-4 py-2.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-bold text-xs sm:text-sm text-text-primary",
                required: true
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("label", {
                className: "block text-[10px] font-black text-text-muted uppercase tracking-wider mb-1.5 select-none",
                children: "Slug (URL Key)"
              }), /* @__PURE__ */ jsx("input", {
                type: "text",
                value: slug,
                onChange: (e) => setSlug(e.target.value),
                placeholder: "เช่น health-care",
                className: "w-full px-4 py-2.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-mono text-xs text-text-primary",
                required: true
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "grid grid-cols-2 gap-4",
              children: [/* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("label", {
                  className: "block text-[10px] font-black text-text-muted uppercase tracking-wider mb-1.5 select-none",
                  children: "ลำดับจัดเรียง"
                }), /* @__PURE__ */ jsx("input", {
                  type: "number",
                  value: sortOrder,
                  onChange: (e) => setSortOrder(Number(e.target.value)),
                  className: "w-full px-4 py-2.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-bold text-xs sm:text-sm text-text-primary",
                  min: 0
                })]
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("label", {
                  className: "block text-[10px] font-black text-text-muted uppercase tracking-wider mb-1.5 select-none",
                  children: "ไอคอนแสดงผล"
                }), /* @__PURE__ */ jsx("input", {
                  type: "text",
                  value: iconUrl,
                  onChange: (e) => setIconUrl(e.target.value),
                  placeholder: "เช่น 🫀 หรือ 🧬",
                  className: "w-full px-4 py-2.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-bold text-xs sm:text-sm text-text-primary text-center"
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("label", {
                className: "block text-[10px] font-black text-text-muted uppercase tracking-wider mb-1.5 select-none",
                children: "ลิงก์ภาพแบนเนอร์ (ถ้ามี)"
              }), /* @__PURE__ */ jsx("input", {
                type: "url",
                value: bannerUrl,
                onChange: (e) => setBannerUrl(e.target.value),
                placeholder: "https://...",
                className: "w-full px-4 py-2.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-semibold text-xs text-text-secondary"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2 py-1.5 select-none",
              children: [/* @__PURE__ */ jsx("input", {
                type: "checkbox",
                id: "isActiveCheck",
                checked: isActive,
                onChange: (e) => setIsActive(e.target.checked),
                className: "w-4.5 h-4.5 rounded text-brand-gold focus:ring-brand-gold cursor-pointer"
              }), /* @__PURE__ */ jsx("label", {
                htmlFor: "isActiveCheck",
                className: "text-xs font-bold text-text-secondary cursor-pointer",
                children: "เปิดใช้งานหมวดหมู่ทันที (Active)"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex gap-3 pt-2",
              children: [/* @__PURE__ */ jsx("button", {
                type: "submit",
                disabled: loading,
                className: "flex-1 btn-gold py-2.5 shadow-sm text-xs font-bold",
                children: loading ? "กำลังบันทึก..." : editingId ? "บันทึกการแก้ไข" : "เพิ่มหมวดหมู่ใหม่"
              }), editingId && /* @__PURE__ */ jsx("button", {
                type: "button",
                onClick: cancelEdit,
                className: "btn-outline px-4 text-xs font-bold border-border-strong text-text-secondary hover:bg-bg-hover",
                children: "ยกเลิก"
              })]
            })]
          })]
        })]
      })]
    })
  });
});
const route19 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$7,
  default: admin_categories,
  loader: loader$1,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
const WORKERS_URL = process.env.WORKERS_URL;
async function embedText(text) {
  const res = await fetch(`${WORKERS_URL}/embed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: text.slice(0, 8192) })
    // Gemini limit
  });
  if (!res.ok) throw new Error(`Embed failed: ${res.status}`);
  const { embedding } = await res.json();
  return embedding;
}
async function searchKnowledge(query, matchCount = 5, minScore = 0.65) {
  const { createServiceSupabase: createServiceSupabase2 } = await Promise.resolve().then(() => supabaseServer);
  const supabase = createServiceSupabase2();
  const embedding = await embedText(query);
  const { data: data2, error } = await supabase.rpc("search_knowledge", {
    query_embedding: embedding,
    match_count: matchCount,
    min_score: minScore
  });
  if (error) {
    console.error("searchKnowledge error:", error);
    return [];
  }
  return data2 ?? [];
}
function splitIntoChunks(text, size = 500, overlap = 50) {
  const chunks = [];
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return [];
  let start = 0;
  while (start < clean.length) {
    const end = Math.min(start + size, clean.length);
    let boundary = end;
    if (end < clean.length) {
      const lastSpace = clean.lastIndexOf(" ", end);
      if (lastSpace > start) boundary = lastSpace;
    }
    const chunk = clean.slice(start, boundary).trim();
    if (chunk.length > 20) chunks.push(chunk);
    start = boundary - overlap;
    if (start <= 0 || boundary >= clean.length) break;
  }
  return chunks;
}
async function ingestDocument(docId, text, metadata) {
  const { createServiceSupabase: createServiceSupabase2 } = await Promise.resolve().then(() => supabaseServer);
  const supabase = createServiceSupabase2();
  await supabase.from("knowledge_docs").update({ status: "processing", updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", docId);
  try {
    const chunks = splitIntoChunks(text, 500, 50);
    if (chunks.length === 0) throw new Error("No text content to ingest");
    const BATCH = 5;
    for (let i = 0; i < chunks.length; i += BATCH) {
      const batch = chunks.slice(i, i + BATCH);
      const embeds = await Promise.all(batch.map(embedText));
      const rows = batch.map((content, j) => ({
        doc_id: docId,
        content,
        embedding: embeds[j],
        metadata: { ...metadata, chunk_index: i + j },
        chunk_index: i + j
      }));
      const { error } = await supabase.from("knowledge_chunks").insert(rows);
      if (error) throw new Error(error.message);
    }
    await supabase.from("knowledge_docs").update({
      status: "indexed",
      chunk_count: chunks.length,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", docId);
  } catch (err) {
    await supabase.from("knowledge_docs").update({
      status: "error",
      error_msg: err instanceof Error ? err.message : "Unknown error",
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", docId);
    throw err;
  }
}
function buildRagContext(results) {
  if (results.length === 0) return "";
  return [
    "\n--- ข้อมูลอ้างอิงจากระบบ ---",
    ...results.map((r, i) => `[${i + 1}] ${r.content}`),
    "--- สิ้นสุดข้อมูลอ้างอิง ---\n"
  ].join("\n\n");
}
const CATEGORY_LABELS = {
  products: "สินค้า",
  reward_plan: "แผนรายได้ (UBC)",
  promotion: "โปรโมชั่น",
  sales_strategy: "กลยุทธ์การขาย",
  general: "ข้อมูลทั่วไป"
};
const CATEGORY_COLORS = {
  products: "bg-blue-50 text-blue-700 border-blue-100",
  reward_plan: "bg-purple-50 text-purple-700 border-purple-100",
  promotion: "bg-orange-50 text-orange-700 border-orange-100",
  sales_strategy: "bg-red-50 text-red-700 border-red-100",
  general: "bg-gray-50 text-gray-700 border-gray-100"
};
function meta() {
  return [{
    title: "AI Knowledge Base — Admin Panel"
  }];
}
async function loader({
  request
}) {
  const responseHeaders = new Headers();
  const {
    user
  } = await requireUser(request, responseHeaders);
  const supabase = createServiceSupabase();
  const {
    data: docs
  } = await supabase.from("knowledge_docs").select("*").order("created_at", {
    ascending: false
  });
  return {
    userEmail: user.email || "admin@unicorn.com",
    docs: docs || []
  };
}
async function action$6({
  request
}) {
  await requireUser(request);
  const method = request.method;
  const supabase = createServiceSupabase();
  const workersUrl = process.env.WORKERS_URL;
  if (method === "DELETE") {
    const data22 = await request.json();
    const {
      error
    } = await supabase.from("knowledge_docs").delete().eq("id", data22.id);
    if (error) {
      return new Response(JSON.stringify({
        error: error.message
      }), {
        status: 400
      });
    }
    return {
      success: true
    };
  }
  const data2 = await request.json();
  if (method === "POST") {
    const {
      type,
      category
    } = data2;
    if (type === "url") {
      const {
        url
      } = data2;
      const {
        data: doc,
        error
      } = await supabase.from("knowledge_docs").insert({
        title: url,
        category,
        source_type: "url",
        source_url: url
      }).select().single();
      if (error || !doc) {
        return new Response(JSON.stringify({
          error: (error == null ? void 0 : error.message) || "Failed to create document record"
        }), {
          status: 400
        });
      }
      try {
        const res = await fetch(`${workersUrl}/crawl`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            url
          })
        });
        if (!res.ok) throw new Error(`Crawler returned error: ${res.status}`);
        const {
          text
        } = await res.json();
        if (!text || text.length < 50) throw new Error("Crawled content is too short or empty");
        await ingestDocument(doc.id, text, {
          source_url: url,
          category
        });
      } catch (err) {
        await supabase.from("knowledge_docs").update({
          status: "error",
          error_msg: err.message,
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        }).eq("id", doc.id);
        return new Response(JSON.stringify({
          error: `การประมวลผลล้มเหลว: ${err.message}`
        }), {
          status: 400
        });
      }
      return {
        success: true
      };
    }
    if (type === "text") {
      const {
        title,
        content
      } = data2;
      const {
        data: doc,
        error
      } = await supabase.from("knowledge_docs").insert({
        title,
        category,
        source_type: "txt"
      }).select().single();
      if (error || !doc) {
        return new Response(JSON.stringify({
          error: (error == null ? void 0 : error.message) || "Failed to create document record"
        }), {
          status: 400
        });
      }
      try {
        await ingestDocument(doc.id, content, {
          title,
          category
        });
      } catch (err) {
        return new Response(JSON.stringify({
          error: `การฝัง Vector ล้มเหลว: ${err.message}`
        }), {
          status: 400
        });
      }
      return {
        success: true
      };
    }
  }
  if (method === "PUT") {
    const {
      id
    } = data2;
    await supabase.from("knowledge_chunks").delete().eq("doc_id", id);
    const {
      data: doc
    } = await supabase.from("knowledge_docs").select("*").eq("id", id).single();
    if (!doc) {
      return new Response(JSON.stringify({
        error: "Document record not found"
      }), {
        status: 404
      });
    }
    if (doc.source_url) {
      try {
        const res = await fetch(`${workersUrl}/crawl`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            url: doc.source_url
          })
        });
        if (!res.ok) throw new Error(`Crawler returned error status: ${res.status}`);
        const {
          text
        } = await res.json();
        await ingestDocument(id, text, {
          source_url: doc.source_url,
          category: doc.category
        });
      } catch (err) {
        await supabase.from("knowledge_docs").update({
          status: "error",
          error_msg: err.message,
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        }).eq("id", id);
        return new Response(JSON.stringify({
          error: `Reindex failed: ${err.message}`
        }), {
          status: 400
        });
      }
      return {
        success: true
      };
    } else {
      return new Response(JSON.stringify({
        error: "Re-indexing is only supported for URL-source documents"
      }), {
        status: 400
      });
    }
  }
  return new Response(JSON.stringify({
    error: "Method not allowed"
  }), {
    status: 405
  });
}
const admin_knowledge = UNSAFE_withComponentProps(function AdminKnowledgePage() {
  const {
    userEmail,
    docs: initialDocs
  } = useLoaderData();
  const navigate = useNavigate();
  const [docs, setDocs] = useState(initialDocs);
  const [tab, setTab] = useState("url");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [url, setUrl] = useState("");
  const [urlCategory, setUrlCategory] = useState("general");
  const [title, setTitle] = useState("");
  const [textContent, setTextContent] = useState("");
  const [textCategory, setTextCategory] = useState("general");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;
    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch("/admin/knowledge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: "url",
          url,
          category: urlCategory
        })
      });
      if (!res.ok) {
        const data2 = await res.json().catch(() => ({}));
        throw new Error(data2.error || "เกิดข้อผิดพลาดในการนำเข้า URL");
      }
      setSuccessMsg("นำเข้า URL สำเร็จ ระบบกำลังเริ่มดูดข้อมูลและฝัง Vector ความรู้...");
      setUrl("");
      setTimeout(() => {
        navigate("/admin/knowledge", {
          replace: true
        });
        window.location.reload();
      }, 1500);
    } catch (err) {
      setErrorMsg(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setSubmitting(false);
    }
  };
  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!title || !textContent) return;
    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch("/admin/knowledge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: "text",
          title,
          content: textContent,
          category: textCategory
        })
      });
      if (!res.ok) {
        const data2 = await res.json().catch(() => ({}));
        throw new Error(data2.error || "เกิดข้อผิดพลาดในการวิเคราะห์บทความ");
      }
      setSuccessMsg("นำเข้าบทความสำเร็จ ข้อมูลถูกสับย่อยและฝัง Vector ลงในฐานข้อมูลแล้ว!");
      setTitle("");
      setTextContent("");
      setTimeout(() => {
        navigate("/admin/knowledge", {
          replace: true
        });
        window.location.reload();
      }, 1500);
    } catch (err) {
      setErrorMsg(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setSubmitting(false);
    }
  };
  const handleReindex = async (docId) => {
    if (!confirm("ต้องการสั่งให้ AI สกัดและทำดัชนีความรู้ (Re-index) จากเอกสารนี้ใหม่อีกครั้งใช่หรือไม่?")) return;
    try {
      setDocs((prev) => prev.map((d) => d.id === docId ? {
        ...d,
        status: "processing"
      } : d));
      const res = await fetch("/admin/knowledge", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: docId
        })
      });
      if (!res.ok) {
        const data2 = await res.json().catch(() => ({}));
        throw new Error(data2.error || "เกิดข้อผิดพลาดในการ Re-index");
      }
      alert("สั่ง Re-index สำเร็จ ระบบกำลังประมวลผลข้อมูลใหม่");
      navigate("/admin/knowledge", {
        replace: true
      });
      window.location.reload();
    } catch (err) {
      alert(err.message || "การสั่งประมวลผลล้มเหลว");
      setDocs(initialDocs);
    }
  };
  const handleDelete = async (docId, title2) => {
    if (!confirm(`คุณต้องการลบเอกสารความรู้ "${title2}" และล้าง Vector Chunks ทั้งหมดใช่หรือไม่?`)) return;
    try {
      const res = await fetch("/admin/knowledge", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: docId
        })
      });
      if (!res.ok) {
        const data2 = await res.json().catch(() => ({}));
        throw new Error(data2.error || "เกิดข้อผิดพลาดในการลบ");
      }
      setDocs((prev) => prev.filter((d) => d.id !== docId));
    } catch (err) {
      alert(err.message || "เกิดข้อผิดพลาดในการลบ");
    }
  };
  const filteredDocs = useMemo(() => {
    return docs.filter((d) => {
      const matchesSearch = d.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = filterCategory === "all" || d.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [docs, search, filterCategory]);
  return /* @__PURE__ */ jsx(AdminLayout, {
    userEmail,
    children: /* @__PURE__ */ jsxs("div", {
      className: "space-y-6 max-w-5xl font-body text-text-primary",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "mb-6",
        children: [/* @__PURE__ */ jsx("h1", {
          className: "font-display font-bold text-2xl text-text-primary",
          children: "AI Knowledge Base (RAG)"
        }), /* @__PURE__ */ jsx("p", {
          className: "text-xs text-text-muted mt-1.5",
          children: "จัดการคลังความรู้เชิงลึกของแบรนด์ สินค้า แผนการตลาด และโปรโมชั่น เพื่อเป็นฐานความรู้อ้างอิงสำหรับการตอบคำถามของ AI Coach (น้องยูนิ)"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "grid grid-cols-1 lg:grid-cols-3 gap-6 items-start",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "bg-white border border-border-default rounded-3xl p-5 shadow-sm space-y-4",
          children: [/* @__PURE__ */ jsx("h3", {
            className: "font-display font-bold text-base text-text-primary flex items-center gap-2 select-none",
            children: /* @__PURE__ */ jsx("span", {
              children: "🧠 เพิ่มฐานความรู้ใหม่"
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex bg-bg-input p-1 rounded-xl",
            children: [/* @__PURE__ */ jsx("button", {
              type: "button",
              onClick: () => setTab("url"),
              className: `flex-1 text-xs font-bold py-2 rounded-lg transition-all ${tab === "url" ? "bg-white text-brand-gold shadow-sm" : "text-text-secondary hover:text-text-primary"}`,
              children: "🔗 ดึงจากหน้าเว็บ (URL)"
            }), /* @__PURE__ */ jsx("button", {
              type: "button",
              onClick: () => setTab("text"),
              className: `flex-1 text-xs font-bold py-2 rounded-lg transition-all ${tab === "text" ? "bg-white text-brand-gold shadow-sm" : "text-text-secondary hover:text-text-primary"}`,
              children: "📝 เขียนบทความเอง"
            })]
          }), errorMsg && /* @__PURE__ */ jsxs("div", {
            className: "p-3.5 bg-red-50 text-red-700 border border-red-100 rounded-xl text-xs font-bold animate-pulse",
            children: ["⚠️ ", errorMsg]
          }), successMsg && /* @__PURE__ */ jsxs("div", {
            className: "p-3.5 bg-green-50 text-green-700 border border-green-100 rounded-xl text-xs font-bold",
            children: ["🎉 ", successMsg]
          }), tab === "url" && /* @__PURE__ */ jsxs("form", {
            onSubmit: handleUrlSubmit,
            className: "space-y-4",
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("label", {
                className: "block text-[10px] font-black text-text-muted uppercase tracking-wider mb-1.5 select-none",
                children: "หมวดหมู่ของความรู้"
              }), /* @__PURE__ */ jsx("select", {
                value: urlCategory,
                onChange: (e) => setUrlCategory(e.target.value),
                className: "w-full px-4 py-2.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-bold text-xs sm:text-sm text-text-primary",
                children: Object.entries(CATEGORY_LABELS).map(([key, val]) => /* @__PURE__ */ jsx("option", {
                  value: key,
                  children: val
                }, key))
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("label", {
                className: "block text-[10px] font-black text-text-muted uppercase tracking-wider mb-1.5 select-none",
                children: "ลิงก์หน้าเว็บ (URL)"
              }), /* @__PURE__ */ jsx("input", {
                type: "url",
                value: url,
                onChange: (e) => setUrl(e.target.value),
                placeholder: "https://example.com/product-info",
                className: "w-full px-4 py-2.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-semibold text-xs text-text-primary",
                required: true
              }), /* @__PURE__ */ jsx("span", {
                className: "text-[10px] text-text-muted mt-1.5 block leading-relaxed",
                children: "* ระบบจะดูดเนื้อหาข้อความสำคัญในหน้าเว็บโดยอัตโนมัติ สลัดเป็นย่อยๆ และฝังเวกเตอร์"
              })]
            }), /* @__PURE__ */ jsx("button", {
              type: "submit",
              disabled: submitting,
              className: "w-full btn-gold justify-center py-3 shadow-sm mt-2 text-xs font-bold",
              children: submitting ? "กำลังสแกนลิงก์..." : "⚡ สกัดข้อมูลเว็บ & เรียนรู้"
            })]
          }), tab === "text" && /* @__PURE__ */ jsxs("form", {
            onSubmit: handleTextSubmit,
            className: "space-y-4",
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("label", {
                className: "block text-[10px] font-black text-text-muted uppercase tracking-wider mb-1.5 select-none",
                children: "หมวดหมู่ของความรู้"
              }), /* @__PURE__ */ jsx("select", {
                value: textCategory,
                onChange: (e) => setTextCategory(e.target.value),
                className: "w-full px-4 py-2.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-bold text-xs sm:text-sm text-text-primary",
                children: Object.entries(CATEGORY_LABELS).map(([key, val]) => /* @__PURE__ */ jsx("option", {
                  value: key,
                  children: val
                }, key))
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("label", {
                className: "block text-[10px] font-black text-text-muted uppercase tracking-wider mb-1.5 select-none",
                children: "หัวข้อบทความ / ชื่อความรู้"
              }), /* @__PURE__ */ jsx("input", {
                type: "text",
                value: title,
                onChange: (e) => setTitle(e.target.value),
                placeholder: "เช่น การตอบข้อโต้แย้งเรื่องราคา",
                className: "w-full px-4 py-2.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-bold text-xs sm:text-sm text-text-primary",
                required: true
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("label", {
                className: "block text-[10px] font-black text-text-muted uppercase tracking-wider mb-1.5 select-none",
                children: "เนื้อหาความรู้เชิงลึก (สำหรับ AI)"
              }), /* @__PURE__ */ jsx("textarea", {
                value: textContent,
                onChange: (e) => setTextContent(e.target.value),
                placeholder: "เขียนข้อมูลความรู้ เช่น รายละเอียดการสะสมคะแนน 2,000 PV...",
                className: "w-full px-4 py-2.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-semibold text-xs text-text-primary min-h-[160px]",
                required: true
              })]
            }), /* @__PURE__ */ jsx("button", {
              type: "submit",
              disabled: submitting,
              className: "w-full btn-gold justify-center py-3 shadow-sm text-xs font-bold",
              children: submitting ? "กำลังสับย่อยและประมวลผล..." : "💾 บันทึกและวิเคราะห์ความรู้"
            })]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "lg:col-span-2 space-y-4",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex flex-col sm:flex-row gap-4 items-center justify-between",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex gap-2 w-full sm:w-auto",
              children: [/* @__PURE__ */ jsx("input", {
                type: "text",
                placeholder: "ค้นหาเอกสารความรู้...",
                value: search,
                onChange: (e) => setSearch(e.target.value),
                className: "w-full sm:w-48 px-4 py-2.5 bg-white border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-medium text-xs text-text-primary"
              }), /* @__PURE__ */ jsxs("select", {
                value: filterCategory,
                onChange: (e) => setFilterCategory(e.target.value),
                className: "px-3 py-2 bg-white border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-bold text-xs text-text-secondary",
                children: [/* @__PURE__ */ jsx("option", {
                  value: "all",
                  children: "ทุกหมวดหมู่"
                }), Object.entries(CATEGORY_LABELS).map(([key, val]) => /* @__PURE__ */ jsx("option", {
                  value: key,
                  children: val
                }, key))]
              })]
            }), /* @__PURE__ */ jsxs("span", {
              className: "text-xs font-bold text-text-muted shrink-0 select-none",
              children: ["พบเอกสารทั้งหมด ", filteredDocs.length, " รายการ"]
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "bg-white border border-border-default rounded-3xl overflow-hidden shadow-sm",
            children: /* @__PURE__ */ jsx("div", {
              className: "overflow-x-auto",
              children: /* @__PURE__ */ jsxs("table", {
                className: "w-full text-xs text-left",
                children: [/* @__PURE__ */ jsx("thead", {
                  children: /* @__PURE__ */ jsxs("tr", {
                    className: "border-b border-border-default bg-bg-input text-[10px] font-bold text-text-muted uppercase tracking-wider select-none",
                    children: [/* @__PURE__ */ jsx("th", {
                      className: "px-4 py-4 w-20 text-center",
                      children: "ประเภท"
                    }), /* @__PURE__ */ jsx("th", {
                      className: "px-4 py-4",
                      children: "ชื่อเอกสารความรู้ / แหล่งที่มา"
                    }), /* @__PURE__ */ jsx("th", {
                      className: "px-4 py-4",
                      children: "หมวดหมู่"
                    }), /* @__PURE__ */ jsx("th", {
                      className: "px-4 py-4 text-center",
                      children: "Chunks"
                    }), /* @__PURE__ */ jsx("th", {
                      className: "px-4 py-4 text-center",
                      children: "สถานะ AI"
                    }), /* @__PURE__ */ jsx("th", {
                      className: "px-4 py-4 text-right",
                      children: "เครื่องมือ"
                    })]
                  })
                }), /* @__PURE__ */ jsx("tbody", {
                  className: "divide-y divide-border-muted",
                  children: filteredDocs.length === 0 ? /* @__PURE__ */ jsx("tr", {
                    children: /* @__PURE__ */ jsx("td", {
                      colSpan: 6,
                      className: "px-4 py-8 text-center text-text-muted italic select-none",
                      children: "ยังไม่มีข้อมูลความรู้ในคลังความรู้ RAG"
                    })
                  }) : filteredDocs.sort((a, b) => new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime()).map((doc) => /* @__PURE__ */ jsxs("tr", {
                    className: "hover:bg-bg-hover/30 transition-colors",
                    children: [/* @__PURE__ */ jsx("td", {
                      className: "px-4 py-3 text-center",
                      children: doc.source_type === "url" ? /* @__PURE__ */ jsx("span", {
                        className: "text-[10px] bg-amber-50 text-amber-700 border border-amber-100 rounded px-1.5 py-0.5 font-bold",
                        children: "🔗 เว็บไซต์"
                      }) : /* @__PURE__ */ jsx("span", {
                        className: "text-[10px] bg-blue-50 text-blue-700 border border-blue-100 rounded px-1.5 py-0.5 font-bold",
                        children: "📝 ข้อความ"
                      })
                    }), /* @__PURE__ */ jsxs("td", {
                      className: "px-4 py-3 max-w-[160px] sm:max-w-[200px]",
                      children: [/* @__PURE__ */ jsx("div", {
                        className: "font-bold text-text-primary truncate",
                        title: doc.title,
                        children: doc.title
                      }), doc.source_url && /* @__PURE__ */ jsx("a", {
                        href: doc.source_url,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "text-[9px] text-brand-gold hover:text-brand-gold-hover hover:underline font-mono truncate block mt-0.5",
                        children: "ลิงก์เว็บหลัก ↗"
                      })]
                    }), /* @__PURE__ */ jsx("td", {
                      className: "px-4 py-3",
                      children: /* @__PURE__ */ jsx("span", {
                        className: `text-[9px] border rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider ${CATEGORY_COLORS[doc.category] || CATEGORY_COLORS.general}`,
                        children: CATEGORY_LABELS[doc.category] || "ทั่วไป"
                      })
                    }), /* @__PURE__ */ jsx("td", {
                      className: "px-4 py-3 text-center font-bold text-text-secondary font-mono",
                      children: doc.chunk_count
                    }), /* @__PURE__ */ jsxs("td", {
                      className: "px-4 py-3 text-center",
                      children: [/* @__PURE__ */ jsxs("span", {
                        className: `badge font-black px-2 py-0.5 rounded text-[10px] select-none ${doc.status === "indexed" ? "badge-success" : doc.status === "processing" ? "badge-info animate-pulse" : doc.status === "pending" ? "badge-warning" : "badge-danger"}`,
                        children: [doc.status === "indexed" && "✓ Indexed", doc.status === "processing" && "⚙ Processing", doc.status === "pending" && "⏳ Pending", doc.status === "error" && "⚠️ Error"]
                      }), doc.error_msg && /* @__PURE__ */ jsx("span", {
                        className: "block text-[8px] text-red-600 line-clamp-1 mt-0.5",
                        title: doc.error_msg,
                        children: doc.error_msg
                      })]
                    }), /* @__PURE__ */ jsxs("td", {
                      className: "px-4 py-3 text-right space-x-3",
                      children: [doc.source_type === "url" && /* @__PURE__ */ jsx("button", {
                        type: "button",
                        onClick: () => handleReindex(doc.id),
                        disabled: doc.status === "processing",
                        className: "text-xs font-bold text-brand-gold hover:underline disabled:opacity-50",
                        children: "Re-index"
                      }), /* @__PURE__ */ jsx("button", {
                        type: "button",
                        onClick: () => handleDelete(doc.id, doc.title),
                        className: "text-xs font-bold text-red-600 hover:underline",
                        children: "ลบ"
                      })]
                    })]
                  }, doc.id))
                })]
              })
            })
          })]
        })]
      })]
    })
  });
});
const route20 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$6,
  default: admin_knowledge,
  loader,
  meta
}, Symbol.toStringTag, { value: "Module" }));
async function action$5({
  request
}) {
  var _a, _b, _c, _d;
  if (request.method !== "POST") {
    return new Response(JSON.stringify({
      error: "Method not allowed"
    }), {
      status: 405,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  try {
    const responseHeaders = new Headers();
    const {
      user,
      supabase
    } = await requireUser(request, responseHeaders);
    const {
      messages
    } = await request.json();
    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({
        error: "No messages provided"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    const {
      data: profile2
    } = await supabase.from("profiles").select("full_name, ubc_level, wealth_element").eq("id", user.id).single();
    const name = (profile2 == null ? void 0 : profile2.full_name) || "พาร์ทเนอร์";
    const ubcLevel = (profile2 == null ? void 0 : profile2.ubc_level) || 1;
    const element = (profile2 == null ? void 0 : profile2.wealth_element) || "FIRE";
    const lastMsg = messages[messages.length - 1];
    const query = ((_b = (_a = lastMsg.parts) == null ? void 0 : _a[0]) == null ? void 0 : _b.text) || lastMsg.content || "";
    let ragContext = "";
    try {
      const searchResults = await searchKnowledge(query, 5, 0.6);
      ragContext = buildRagContext(searchResults);
    } catch (ragErr) {
      console.error("RAG search failed in API:", ragErr);
    }
    const systemPrompt = `คุณคือ "น้องยูนิ" พี่เลี้ยงและที่ปรึกษาธุรกิจเครือข่ายอัจฉริยะของ Unicorn Academy 🦄
ผู้ใช้ที่คุยกับคุณคือคุณ: "${name}" มีระดับความเชี่ยวชาญ: UBC Level ${ubcLevel} และมีธาตุทางธุรกิจ (Wealth DNA): ${element}

แนวทางและบุคลิกในการโค้ช:
1. เป็นเพื่อนและที่ปรึกษาธุรกิจเชิงบวก (Co-Builder Partner) ร่วมเดินทางสร้างผลลัพธ์ เติบโตและสำเร็จไปพร้อมกัน
2. ใช้หลักการของระบบ 4-5-6 ของ Unicorn และแนวคิดของ ubc_mission_blueprint เพื่อนำทางสมาชิก
3. ใช้การวิเคราะห์เชิงลึก น้ำเสียงเป็นมิตร อบอุ่น สุภาพ แต่มีความเฉียบคมทางธุรกิจสูง
4. ดึงความโดดเด่นของธาตุทางธุรกิจ Wealth DNA ของเขา (${element}) มาเสริมพลังใจและการสร้างตัวตน:
   - FIRE (ธาตุไฟ): ความตื่นเต้น พลังขับเคลื่อน ผู้นำที่ส่งต่อวิสัยทัศน์ และการสร้างแรงบันดาลใจอันทรงพลัง
   - WATER (ธาตุน้ำ): ความยืดหยุ่น การเชื่อมสัมพันธ์อันอบอุ่นลึกซึ้ง ความเห็นอกเห็นใจ และการเอาใส่ใจพาร์ทเนอร์
   - EARTH (ธาตุดิน): ความมั่นคง ระบบระเบียบ ความเป็นมืออาชีพที่น่าเชื่อถือ และความรอบคอบแม่นยำ
   - AIR (ธาตุลม): ความคิดสร้างสรรค์ นวัตกรรม ความรวดเร็ว การใช้สื่อโซเชีบลมีเดียและเทคโนโลยีสร้างเครือข่าย

สิ่งที่ต้องมอบให้สมาชิกในทุกคำตอบอย่างสร้างสรรค์:
- ไกด์แนวทางการสื่อสารและให้ "ตัวอย่างคำพูดจริง" (Scripts/Dialogues/Copywriting) ที่สามารถคัดลอก (Copy-Paste) ไปปรับใช้ได้ทันที ไม่ว่าจะเป็นสคริปต์การโทรนัดหมาย การตอบข้อโต้แย้งในสถานการณ์ต่างๆ หรือคำปิดการขายแบบเน้นคุณค่า
- หากหัวข้อสนทนาเกี่ยวข้องกับการสร้างสื่อโปรโมท สไลด์แนะนำตัว หรือรูปภาพอินโฟกราฟิกเพื่อใช้ในทีม ให้เขียนระบุ "ชุดคำสั่ง Prompt อัจฉริยะ" (ภาษาอังกฤษที่ลุ่มลึกและสวยงาม) สำหรับนำไปวางใน AI Tools เช่น ChatGPT/Gemini/Midjourney เพื่อให้เขานำไปใช้สร้างผลงานต่อได้ทันที

${ragContext}`;
    const history = messages.slice(0, messages.length - 1).map((m) => {
      var _a2, _b2;
      return {
        role: m.role === "user" ? "user" : "model",
        content: ((_b2 = (_a2 = m.parts) == null ? void 0 : _a2[0]) == null ? void 0 : _b2.text) || m.content || ""
      };
    });
    const message = ((_d = (_c = lastMsg.parts) == null ? void 0 : _c[0]) == null ? void 0 : _d.text) || lastMsg.content || "";
    const workersUrl = process.env.WORKERS_URL || "https://workers-proxy.unicorn.workers.dev";
    const res = await fetch(`${workersUrl}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        systemPrompt,
        history,
        message
      })
    });
    if (!res.ok) {
      throw new Error(`Workers proxy endpoint failed with status ${res.status}`);
    }
    const {
      reply
    } = await res.json();
    return new Response(JSON.stringify({
      candidates: [{
        content: {
          parts: [{
            text: reply
          }]
        }
      }]
    }), {
      headers: {
        "Content-Type": "application/json",
        ...Object.fromEntries(responseHeaders.entries())
      }
    });
  } catch (err) {
    console.error("api/ai-coach error:", err);
    return new Response(JSON.stringify({
      candidates: [{
        content: {
          parts: [{
            text: `ขออภัยค่ะพาร์ทเนอร์ น้องยูนิมึนงงชั่วคราวเนื่องจาก: ${err.message || "การเชื่อมต่อระบบล้มเหลว"} กรุณาลองส่งคำถามใหม่อีกครั้งนะคะ 🥺`
          }]
        }
      }]
    }), {
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}
const route21 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$5
}, Symbol.toStringTag, { value: "Module" }));
function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}
async function sendWelcomeEmail(to, name) {
  const url = process.env.VITE_APP_URL || process.env.NEXT_PUBLIC_APP_URL || "https://unicorn-smart-ai.pages.dev";
  return getResend().emails.send({
    from: process.env.RESEND_FROM,
    to,
    subject: "ยินดีต้อนรับสู่ Unicorn Academy 🦄",
    html: `
      <h1>สวัสดีคุณ ${name}!</h1>
      <p>ยินดีต้อนรับเข้าสู่ครอบครัว Unicorn Academy</p>
      <p>เริ่มภารกิจแรกของคุณได้เลยที่ <a href="${url}/missions">ภารกิจ UBC</a></p>
    `
  });
}
const LINE_MESSAGING_API_URL = "https://api.line.me/v2/bot/message/push";
async function sendLineNotify(message) {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const userId = process.env.LINE_USER_ID;
  if (!token || !userId) {
    console.warn("LINE Messaging API configurations are missing in environment.");
    return;
  }
  try {
    const res = await fetch(LINE_MESSAGING_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        to: userId,
        messages: [
          {
            type: "text",
            text: message
          }
        ]
      })
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error("Failed to send LINE message:", errText);
    }
  } catch (err) {
    console.error("Error calling LINE Messaging API:", err);
  }
}
async function action$4({
  request
}) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({
      error: "Method not allowed"
    }), {
      status: 405,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  try {
    const {
      name,
      email,
      message
    } = await request.json();
    await Promise.all([sendWelcomeEmail(email, name).catch((err) => console.error("Send welcome email failed:", err)), sendLineNotify(`
📩 ติดต่อใหม่
👤 ${name}
📧 ${email}
💬 ${message}`).catch((err) => console.error("Send line notify failed:", err))]);
    return new Response(JSON.stringify({
      ok: true
    }), {
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (err) {
    console.error("api/contact error:", err);
    return new Response(JSON.stringify({
      error: err.message || "เกิดข้อผิดพลาดในการบันทึกและแจ้งเตือนติดต่อกลับ"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}
const route22 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$4
}, Symbol.toStringTag, { value: "Module" }));
async function action$3({
  request
}) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({
      error: "Method not allowed"
    }), {
      status: 405,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  try {
    const {
      type,
      payload
    } = await request.json();
    if (type === "new_member") {
      await sendLineNotify(`
🦄 สมาชิกใหม่: ${payload.name}
🔗 แนะนำโดย: ${payload.referredBy ?? "-"}`);
    } else if (type === "mission_complete") {
      await sendLineNotify(`
🏆 ${payload.name} ทำภารกิจสำเร็จ: ${payload.missionTitle} (+${payload.points}pts)`);
    } else if (type === "report_issue") {
      await sendLineNotify(`
🚨 แจ้งปัญหาระบบ!
👤 พาร์ทเนอร์: ${payload.name || "ทั่วไป"}
📞 ติดต่อกลับ: ${payload.contact || "-"}
💬 ปัญหา: ${payload.description}`);
    }
    return new Response(JSON.stringify({
      ok: true
    }), {
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (err) {
    console.error("api/notify error:", err);
    return new Response(JSON.stringify({
      error: err.message || "เกิดข้อผิดพลาดในการส่งข้อความแจ้งเตือน"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}
const route23 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$3
}, Symbol.toStringTag, { value: "Module" }));
function getR2() {
  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
    }
  });
}
async function getUploadUrl(key, contentType) {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType
  });
  const url = await getSignedUrl(getR2(), command, { expiresIn: 300 });
  return { url, publicUrl: `${process.env.R2_PUBLIC_URL}/${key}` };
}
async function action$2({
  request
}) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({
      error: "Method not allowed"
    }), {
      status: 405,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  try {
    const responseHeaders = new Headers();
    const {
      user
    } = await requireUser(request, responseHeaders);
    const {
      filename,
      contentType,
      folder = "avatars"
    } = await request.json();
    if (!filename || !contentType) {
      return new Response(JSON.stringify({
        error: "Filename and contentType are required"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    const ext = filename.split(".").pop();
    const key = `${folder}/${user.id}/${Date.now()}.${ext}`;
    const {
      url,
      publicUrl
    } = await getUploadUrl(key, contentType);
    return new Response(JSON.stringify({
      uploadUrl: url,
      publicUrl,
      key
    }), {
      headers: {
        "Content-Type": "application/json",
        ...Object.fromEntries(responseHeaders.entries())
      }
    });
  } catch (err) {
    console.error("api/upload error:", err);
    return new Response(JSON.stringify({
      error: err.message || "เกิดข้อผิดพลาดในการอัปโหลด"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}
const route24 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$2
}, Symbol.toStringTag, { value: "Module" }));
async function action$1({
  request
}) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({
      error: "Method not allowed"
    }), {
      status: 405,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  try {
    const {
      referrerId
    } = await request.json();
    if (!referrerId) {
      return new Response(JSON.stringify({
        error: "Referrer ID is required"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    return new Response(JSON.stringify({
      success: true,
      referrerId
    }), {
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": `unicorn_referrer=${referrerId}; Path=/; HttpOnly; Max-Age=${30 * 24 * 60 * 60}; SameSite=Lax; Secure`
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({
      error: err.message || "Failed to track referral"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}
const route25 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1
}, Symbol.toStringTag, { value: "Module" }));
async function action({
  request
}) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({
      error: "Method not allowed"
    }), {
      status: 405,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  try {
    const cookieHeader = request.headers.get("Cookie") || "";
    const cookies = {};
    cookieHeader.split(";").forEach((cookie) => {
      var _a;
      const parts = cookie.split("=");
      const key = (_a = parts[0]) == null ? void 0 : _a.trim();
      const val = parts.slice(1).join("=").trim();
      if (key) cookies[key] = val;
    });
    const referrerId = cookies["unicorn_referrer"] || null;
    return new Response(JSON.stringify({
      referrerId
    }), {
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({
      error: err.message || "Failed to claim referral"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}
const route26 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-DA1MqMBr.js", "imports": ["/assets/jsx-runtime-CS9HHHez.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": true, "module": "/assets/root-Bxd_yLMs.js", "imports": ["/assets/jsx-runtime-CS9HHHez.js", "/assets/lib-D1UVQ_Lx.js"], "css": ["/assets/root-QU3ZAIxw.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/home-DW_j7m4j.js", "imports": ["/assets/jsx-runtime-CS9HHHez.js", "/assets/lib-D1UVQ_Lx.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/auth.login": { "id": "routes/auth.login", "parentId": "root", "path": "auth/login", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/auth.login-i2r_uylg.js", "imports": ["/assets/jsx-runtime-CS9HHHez.js", "/assets/lib-D1UVQ_Lx.js", "/assets/supabase-Bgahf4s8.js", "/assets/lock-tg-j5y1W.js", "/assets/loader-circle-ClugHvzK.js", "/assets/createLucideIcon-DXbFMavo.js", "/assets/sparkles-VBYeQTwZ.js", "/assets/api.ai-coach-CeQpOKCs.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/auth.register": { "id": "routes/auth.register", "parentId": "root", "path": "auth/register", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/auth.register-YugqmBkq.js", "imports": ["/assets/jsx-runtime-CS9HHHez.js", "/assets/lib-D1UVQ_Lx.js", "/assets/supabase-Bgahf4s8.js", "/assets/loader-circle-ClugHvzK.js", "/assets/lock-tg-j5y1W.js", "/assets/sparkles-VBYeQTwZ.js", "/assets/user-CiFcqzNc.js", "/assets/circle-check-dz77gtWt.js", "/assets/createLucideIcon-DXbFMavo.js", "/assets/api.ai-coach-CeQpOKCs.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/auth.callback": { "id": "routes/auth.callback", "parentId": "root", "path": "auth/callback", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": false, "hasErrorBoundary": false, "module": "/assets/auth.callback-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/dashboard": { "id": "routes/dashboard", "parentId": "root", "path": "dashboard", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/dashboard-BLL-gqKO.js", "imports": ["/assets/jsx-runtime-CS9HHHez.js", "/assets/lib-D1UVQ_Lx.js", "/assets/api.ai-coach-CeQpOKCs.js", "/assets/MemberLayout-BH7ZFD7q.js", "/assets/chevron-left-CKKzi769.js", "/assets/createLucideIcon-DXbFMavo.js", "/assets/sparkles-VBYeQTwZ.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/profile": { "id": "routes/profile", "parentId": "root", "path": "profile", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/profile-DnPSZ3Fk.js", "imports": ["/assets/jsx-runtime-CS9HHHez.js", "/assets/lib-D1UVQ_Lx.js", "/assets/supabase-Bgahf4s8.js", "/assets/MemberLayout-BH7ZFD7q.js", "/assets/chevron-left-CKKzi769.js", "/assets/user-CiFcqzNc.js", "/assets/createLucideIcon-DXbFMavo.js", "/assets/loader-circle-ClugHvzK.js", "/assets/circle-check-dz77gtWt.js", "/assets/api.ai-coach-CeQpOKCs.js", "/assets/sparkles-VBYeQTwZ.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/ai-coach": { "id": "routes/ai-coach", "parentId": "root", "path": "ai-coach", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/ai-coach-CpQAxxI5.js", "imports": ["/assets/jsx-runtime-CS9HHHez.js", "/assets/lib-D1UVQ_Lx.js", "/assets/api.ai-coach-CeQpOKCs.js", "/assets/MemberLayout-BH7ZFD7q.js", "/assets/chevron-left-CKKzi769.js", "/assets/createLucideIcon-DXbFMavo.js", "/assets/shield-C6Ik3Uqz.js", "/assets/user-CiFcqzNc.js", "/assets/send-BpXsP_Uv.js", "/assets/sparkles-VBYeQTwZ.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/dna": { "id": "routes/dna", "parentId": "root", "path": "dna", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/dna-9DTqdyKN.js", "imports": ["/assets/jsx-runtime-CS9HHHez.js", "/assets/lib-D1UVQ_Lx.js", "/assets/api.ai-coach-CeQpOKCs.js", "/assets/supabase-Bgahf4s8.js", "/assets/MemberLayout-BH7ZFD7q.js", "/assets/chevron-left-CKKzi769.js", "/assets/createLucideIcon-DXbFMavo.js", "/assets/shield-C6Ik3Uqz.js", "/assets/sparkles-VBYeQTwZ.js", "/assets/circle-check-dz77gtWt.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/missions": { "id": "routes/missions", "parentId": "root", "path": "missions", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/missions-nopRdUP6.js", "imports": ["/assets/jsx-runtime-CS9HHHez.js", "/assets/lib-D1UVQ_Lx.js", "/assets/api.ai-coach-CeQpOKCs.js", "/assets/supabase-Bgahf4s8.js", "/assets/MemberLayout-BH7ZFD7q.js", "/assets/chevron-left-CKKzi769.js", "/assets/createLucideIcon-DXbFMavo.js", "/assets/circle-check-dz77gtWt.js", "/assets/loader-circle-ClugHvzK.js", "/assets/send-BpXsP_Uv.js", "/assets/sparkles-VBYeQTwZ.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/startup": { "id": "routes/startup", "parentId": "root", "path": "startup", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/startup-CsXO-Yhk.js", "imports": ["/assets/jsx-runtime-CS9HHHez.js", "/assets/lib-D1UVQ_Lx.js", "/assets/api.ai-coach-CeQpOKCs.js", "/assets/MemberLayout-BH7ZFD7q.js", "/assets/chevron-left-CKKzi769.js", "/assets/createLucideIcon-DXbFMavo.js", "/assets/sparkles-VBYeQTwZ.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/products": { "id": "routes/products", "parentId": "root", "path": "products", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/products-CRYIrcId.js", "imports": ["/assets/jsx-runtime-CS9HHHez.js", "/assets/lib-D1UVQ_Lx.js", "/assets/api.ai-coach-CeQpOKCs.js", "/assets/MemberLayout-BH7ZFD7q.js", "/assets/chevron-left-CKKzi769.js", "/assets/search-C1mijbOb.js", "/assets/createLucideIcon-DXbFMavo.js", "/assets/sparkles-VBYeQTwZ.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/knowledge": { "id": "routes/knowledge", "parentId": "root", "path": "knowledge", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/knowledge-yHI_zBhL.js", "imports": ["/assets/jsx-runtime-CS9HHHez.js", "/assets/lib-D1UVQ_Lx.js", "/assets/api.ai-coach-CeQpOKCs.js", "/assets/MemberLayout-BH7ZFD7q.js", "/assets/chevron-left-CKKzi769.js", "/assets/search-C1mijbOb.js", "/assets/createLucideIcon-DXbFMavo.js", "/assets/sparkles-VBYeQTwZ.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/functions": { "id": "routes/functions", "parentId": "root", "path": "functions", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/functions-zze1n5uG.js", "imports": ["/assets/jsx-runtime-CS9HHHez.js", "/assets/lib-D1UVQ_Lx.js", "/assets/api.ai-coach-CeQpOKCs.js", "/assets/MemberLayout-BH7ZFD7q.js", "/assets/chevron-left-CKKzi769.js", "/assets/createLucideIcon-DXbFMavo.js", "/assets/sparkles-VBYeQTwZ.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/referral.$slug": { "id": "routes/referral.$slug", "parentId": "root", "path": "r/:slug", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/referral._slug-DSTlGMzw.js", "imports": ["/assets/jsx-runtime-CS9HHHez.js", "/assets/lib-D1UVQ_Lx.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/admin.dashboard": { "id": "routes/admin.dashboard", "parentId": "root", "path": "admin", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/admin.dashboard-Dzq4cQny.js", "imports": ["/assets/jsx-runtime-CS9HHHez.js", "/assets/lib-D1UVQ_Lx.js", "/assets/AdminLayout-DEw3PqKp.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/admin.products.index": { "id": "routes/admin.products.index", "parentId": "root", "path": "admin/products", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/admin.products.index-DJM-9Q4S.js", "imports": ["/assets/jsx-runtime-CS9HHHez.js", "/assets/lib-D1UVQ_Lx.js", "/assets/AdminLayout-DEw3PqKp.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/admin.products.new": { "id": "routes/admin.products.new", "parentId": "root", "path": "admin/products/new", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/admin.products.new-Cs_z3k1L.js", "imports": ["/assets/jsx-runtime-CS9HHHez.js", "/assets/lib-D1UVQ_Lx.js", "/assets/AdminLayout-DEw3PqKp.js", "/assets/ProductForm-Cz_7Fz2b.js", "/assets/chevron-left-CKKzi769.js", "/assets/createLucideIcon-DXbFMavo.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/admin.products.edit": { "id": "routes/admin.products.edit", "parentId": "root", "path": "admin/products/:id", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/admin.products.edit-CKhOpx1x.js", "imports": ["/assets/jsx-runtime-CS9HHHez.js", "/assets/lib-D1UVQ_Lx.js", "/assets/AdminLayout-DEw3PqKp.js", "/assets/ProductForm-Cz_7Fz2b.js", "/assets/chevron-left-CKKzi769.js", "/assets/createLucideIcon-DXbFMavo.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/admin.categories": { "id": "routes/admin.categories", "parentId": "root", "path": "admin/categories", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/admin.categories-CFH2H94f.js", "imports": ["/assets/jsx-runtime-CS9HHHez.js", "/assets/AdminLayout-DEw3PqKp.js", "/assets/lib-D1UVQ_Lx.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/admin.knowledge": { "id": "routes/admin.knowledge", "parentId": "root", "path": "admin/knowledge", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/admin.knowledge-CyTWLtLY.js", "imports": ["/assets/jsx-runtime-CS9HHHez.js", "/assets/AdminLayout-DEw3PqKp.js", "/assets/lib-D1UVQ_Lx.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api.ai-coach": { "id": "routes/api.ai-coach", "parentId": "root", "path": "api/ai-coach", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": false, "hasErrorBoundary": false, "module": "/assets/api.ai-coach-CeQpOKCs.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api.contact": { "id": "routes/api.contact", "parentId": "root", "path": "api/contact", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": false, "hasErrorBoundary": false, "module": "/assets/api.contact-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api.notify": { "id": "routes/api.notify", "parentId": "root", "path": "api/notify", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": false, "hasErrorBoundary": false, "module": "/assets/api.notify-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api.upload": { "id": "routes/api.upload", "parentId": "root", "path": "api/upload", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": false, "hasErrorBoundary": false, "module": "/assets/api.upload-D-72jSv7.js", "imports": ["/assets/api.ai-coach-CeQpOKCs.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api.referral.track": { "id": "routes/api.referral.track", "parentId": "root", "path": "api/referral/track", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": false, "hasErrorBoundary": false, "module": "/assets/api.referral.track-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api.referral.claim": { "id": "routes/api.referral.claim", "parentId": "root", "path": "api/referral/claim", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": false, "hasErrorBoundary": false, "module": "/assets/api.referral.claim-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-c18257e3.js", "version": "c18257e3", "sri": void 0 };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_optimizeDeps": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/auth.login": {
    id: "routes/auth.login",
    parentId: "root",
    path: "auth/login",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/auth.register": {
    id: "routes/auth.register",
    parentId: "root",
    path: "auth/register",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/auth.callback": {
    id: "routes/auth.callback",
    parentId: "root",
    path: "auth/callback",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/dashboard": {
    id: "routes/dashboard",
    parentId: "root",
    path: "dashboard",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/profile": {
    id: "routes/profile",
    parentId: "root",
    path: "profile",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/ai-coach": {
    id: "routes/ai-coach",
    parentId: "root",
    path: "ai-coach",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/dna": {
    id: "routes/dna",
    parentId: "root",
    path: "dna",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/missions": {
    id: "routes/missions",
    parentId: "root",
    path: "missions",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "routes/startup": {
    id: "routes/startup",
    parentId: "root",
    path: "startup",
    index: void 0,
    caseSensitive: void 0,
    module: route10
  },
  "routes/products": {
    id: "routes/products",
    parentId: "root",
    path: "products",
    index: void 0,
    caseSensitive: void 0,
    module: route11
  },
  "routes/knowledge": {
    id: "routes/knowledge",
    parentId: "root",
    path: "knowledge",
    index: void 0,
    caseSensitive: void 0,
    module: route12
  },
  "routes/functions": {
    id: "routes/functions",
    parentId: "root",
    path: "functions",
    index: void 0,
    caseSensitive: void 0,
    module: route13
  },
  "routes/referral.$slug": {
    id: "routes/referral.$slug",
    parentId: "root",
    path: "r/:slug",
    index: void 0,
    caseSensitive: void 0,
    module: route14
  },
  "routes/admin.dashboard": {
    id: "routes/admin.dashboard",
    parentId: "root",
    path: "admin",
    index: void 0,
    caseSensitive: void 0,
    module: route15
  },
  "routes/admin.products.index": {
    id: "routes/admin.products.index",
    parentId: "root",
    path: "admin/products",
    index: void 0,
    caseSensitive: void 0,
    module: route16
  },
  "routes/admin.products.new": {
    id: "routes/admin.products.new",
    parentId: "root",
    path: "admin/products/new",
    index: void 0,
    caseSensitive: void 0,
    module: route17
  },
  "routes/admin.products.edit": {
    id: "routes/admin.products.edit",
    parentId: "root",
    path: "admin/products/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route18
  },
  "routes/admin.categories": {
    id: "routes/admin.categories",
    parentId: "root",
    path: "admin/categories",
    index: void 0,
    caseSensitive: void 0,
    module: route19
  },
  "routes/admin.knowledge": {
    id: "routes/admin.knowledge",
    parentId: "root",
    path: "admin/knowledge",
    index: void 0,
    caseSensitive: void 0,
    module: route20
  },
  "routes/api.ai-coach": {
    id: "routes/api.ai-coach",
    parentId: "root",
    path: "api/ai-coach",
    index: void 0,
    caseSensitive: void 0,
    module: route21
  },
  "routes/api.contact": {
    id: "routes/api.contact",
    parentId: "root",
    path: "api/contact",
    index: void 0,
    caseSensitive: void 0,
    module: route22
  },
  "routes/api.notify": {
    id: "routes/api.notify",
    parentId: "root",
    path: "api/notify",
    index: void 0,
    caseSensitive: void 0,
    module: route23
  },
  "routes/api.upload": {
    id: "routes/api.upload",
    parentId: "root",
    path: "api/upload",
    index: void 0,
    caseSensitive: void 0,
    module: route24
  },
  "routes/api.referral.track": {
    id: "routes/api.referral.track",
    parentId: "root",
    path: "api/referral/track",
    index: void 0,
    caseSensitive: void 0,
    module: route25
  },
  "routes/api.referral.claim": {
    id: "routes/api.referral.claim",
    parentId: "root",
    path: "api/referral/claim",
    index: void 0,
    caseSensitive: void 0,
    module: route26
  }
};
const allowedActionOrigins = false;
export {
  allowedActionOrigins,
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
