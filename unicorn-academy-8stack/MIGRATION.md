# 🦄 Unicorn Academy — Migration Guide
## จาก Vite + React + Express → Next.js 8-Stack

---

## 8 Stack Pieces

| # | Service | บทบาท | ที่เก็บ |
|---|---|---|---|
| ① | **Next.js (Latest)** | Frontend + Backend App | `src/app/` |
| ② | **TypeScript** | Type Safety ทุกไฟล์ | `src/types/` |
| ③ | **Tailwind CSS** | Design System | `tailwind.config.ts` |
| ④ | **Supabase** | PostgreSQL + Auth + RLS | `src/lib/supabase*.ts` |
| ⑤ | **Cloudflare R2** | Object Storage (Avatars) | `src/lib/r2.ts` |
| ⑥ | **Cloudflare Pages** | Hosting + CDN | `next.config.ts` |
| ⑦ | **Resend** | Transactional Email | `src/lib/resend.ts` |
| ⑧ | **LINE Notify + CF Workers** | Notification + Edge Proxy | `src/lib/line-notify.ts` + `workers/proxy.ts` |

---

## Migration Steps

### Step 1: Setup Database
```bash
# Run SQL in Supabase SQL Editor
supabase_schema.sql
```

### Step 2: Environment Variables
```bash
cp .env.local.example .env.local
# กรอกค่าทั้งหมดใน .env.local
```

### Step 3: Install & Dev
```bash
npm install
npm run dev
```

### Step 4: Deploy Workers
```bash
wrangler secret put GEMINI_API_KEY
npm run workers:deploy
```

### Step 5: Deploy to Cloudflare Pages
```bash
# ใน Cloudflare Pages dashboard:
# Build command: npm run build
# Build output: .next
# Install: @cloudflare/next-on-pages
```

---

## What Changed (เปรียบเทียบ Stack เดิม)

| เดิม (Vite + Express) | ใหม่ (Next.js 8-Stack) |
|---|---|
| Vite + React 19 | **Next.js App Router** (รวม Frontend+Backend) |
| Express `server.js` | **Cloudflare Workers** proxy |
| `localStorage` state | **Supabase SSR** + Server Components |
| ไม่มี Email | **Resend** transactional email |
| ไม่มี Notification | **LINE Notify** webhook |
| ไม่มี File Storage | **Cloudflare R2** 10GB free |
| Deploy ไหน? | **Cloudflare Pages** Edge CDN |

---

## Key File Mapping

| ไฟล์เดิม | ไฟล์ใหม่ |
|---|---|
| `pages/AICoach.tsx` | `src/app/api/ai-coach/route.ts` + component |
| `pages/Dashboard.tsx` | `src/app/dashboard/page.tsx` (Server Component) |
| `pages/Profile.tsx` | `src/app/profile/page.tsx` |
| `pages/ReferralPage.tsx` | `src/app/referral/[slug]/page.tsx` (Dynamic) |
| `pages/WealthDNA.tsx` | `src/app/dna/page.tsx` |
| `server.js` | `workers/proxy.ts` (CF Workers) |
| `lib/supabase.ts` | `src/lib/supabase.ts` + `supabase-server.ts` |

---

*Unicorn Academy 8-Stack — Built with ❤️ by ครูเด่น มาสเตอร์ฟา*
