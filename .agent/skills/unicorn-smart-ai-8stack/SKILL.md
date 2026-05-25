---
name: unicorn_smart_ai-8stack.skill
description: >
  คู่มือพัฒนาและแก้ไข Unicorn Academy บน 8-Stack มาตรฐานของครูเด่น
  (Next.js App Router + TypeScript + Tailwind CSS + Supabase + Cloudflare R2 +
  Cloudflare Pages + Resend + LINE Notify + Cloudflare Workers)

  ใช้ทักษะนี้ทุกครั้งที่:
  - เขียนหรือแก้ไขโค้ดใดๆ ใน Unicorn Academy / Unicorn Smart AI
  - เพิ่ม feature ใหม่ให้ระบบ UBC, AI Coach, Missions, Profile, Referral, Wealth DNA
  - เขียน Route Handler, Server Component, Server Action
  - เชื่อมต่อ Supabase, R2, Resend, LINE, Workers
  - ตั้ง RLS Policy หรือแก้ Supabase schema
  - Deploy ขึ้น Cloudflare Pages / Workers
  - แก้ bug หรือ refactor โค้ดในโปรเจกต์นี้

  Trigger phrases: "แก้ unicorn", "เพิ่ม feature unicorn", "unicorn academy",
  "ai coach", "ubc level", "missions", "referral slug", "wealth dna",
  "นองยูนิ", "น้องยูนิ", "supabase schema unicorn", "workers proxy",
  "8 stack", "8-stack", "kru-den stack", "antigravity stack"
---

# 🦄 Unicorn Academy — 8-Stack Developer Skill

คู่มือนี้ให้ AI Agent ใน Antigravity IDE เข้าใจสถาปัตยกรรม เขียนโค้ดได้ถูก Pattern
และเชื่อมต่อทุก Service ได้อย่างแม่นยำ

---

## Quick Stack Map

```
Stack #  Service                 บทบาท                    ไฟล์หลัก
────────────────────────────────────────────────────────────────────
①       Next.js (latest)        Full-stack App (App Router) src/app/
②       TypeScript              Type Safety ทุกไฟล์         src/types/index.ts
③       Tailwind CSS            Design System               tailwind.config.ts
④       Supabase                DB + Auth + RLS             src/lib/supabase*.ts
⑤       Cloudflare R2           Object Storage              src/lib/r2.ts
⑥       Cloudflare Pages        Hosting + CDN               next.config.ts
⑦       Resend                  Transactional Email         src/lib/resend.ts
⑧       LINE Notify + CF Workers Notification + Edge Proxy  src/lib/line-notify.ts
                                                            workers/proxy.ts
```

---

## Folder Structure (ดูรายละเอียด → `references/01-folder-structure.md`)

```
src/
├── app/
│   ├── layout.tsx              ← Root layout (fonts + metadata)
│   ├── globals.css             ← Design tokens + .glass .btn-gold
│   ├── page.tsx                ← Homepage
│   ├── middleware.ts           ← Auth guard (Supabase SSR)
│   ├── api/
│   │   ├── ai-coach/route.ts   ← POST → CF Workers → Gemini
│   │   ├── upload/route.ts     ← POST → R2 presigned URL
│   │   ├── notify/route.ts     ← POST → LINE Notify
│   │   └── contact/route.ts    ← POST → Resend + LINE
│   ├── auth/callback/route.ts  ← Supabase OAuth callback
│   ├── dashboard/page.tsx      ← Server Component (auth required)
│   ├── profile/page.tsx        ← Edit Digital Name Card
│   ├── dna/page.tsx            ← Wealth DNA calculator
│   ├── missions/page.tsx       ← Gamified mission board
│   ├── referral/[slug]/page.tsx ← Public sales page (dynamic)
│   └── (admin)/admin/          ← Admin dashboard
├── components/
│   ├── layout/                 ← NavBar, Footer
│   ├── sections/               ← Hero, About, Services…
│   ├── ui/                     ← Button, Card, Input, Modal
│   ├── ai-coach/               ← Chat UI (น้องยูนิ)
│   ├── missions/               ← Mission board components
│   └── profile/                ← Digital Name Card components
├── lib/
│   ├── supabase.ts             ← Browser client (@supabase/ssr)
│   ├── supabase-server.ts      ← Server client + Service role
│   ├── r2.ts                   ← R2 presigned upload + public URL
│   ├── resend.ts               ← Email templates
│   └── line-notify.ts          ← LINE push + helper messages
├── types/
│   └── index.ts                ← Domain types (Profile, Mission…)
workers/
└── proxy.ts                    ← CF Workers edge proxy (Gemini)
supabase_schema.sql             ← Full DB schema + RLS
wrangler.toml                   ← CF Workers config
```

---

## Core Rules — อ่านก่อนเขียนโค้ดทุกครั้ง

### 1. Next.js App Router
- ใช้ **App Router เท่านั้น** — ห้าม `pages/` directory
- Server Components เป็น default — ใส่ `"use client"` เฉพาะเมื่อต้องการ
  state/event handler
- Data fetching ใน Server Component โดยตรง — ไม่ต้องผ่าน API route
- `generateMetadata()` ทุก dynamic page เพื่อ SEO

### 2. TypeScript — Strict Mode
- ทุกไฟล์ต้องมี type ครบ — ห้าม `any`
- Import types จาก `@/types/index.ts` เสมอ
- ใช้ `unknown` แทน `any` เมื่อ type ไม่แน่ใจ

### 3. Tailwind CSS
- ใช้ design tokens ที่กำหนดใน `globals.css`:
  `.glass`, `.glass-gold`, `.btn-gold`, `.btn-outline`
- Color palette: `brand-gold` (#c9a96e), `brand-dark` (#080604)
- Font: `font-display` (Playfair Display), `font-body` (Sarabun)

### 4. Supabase — สำคัญมาก
- **Browser** → `createClient()` จาก `src/lib/supabase.ts`
- **Server / RSC / Route Handler** → `createServerSupabase()` จาก `src/lib/supabase-server.ts`
- **Admin / Service Role** → `createServiceSupabase()` (ไม่มี RLS)
- ทุกตารางใหม่ต้อง **เปิด RLS + เขียน Policy** เสมอ
- ดูรายละเอียด schema → `references/02-supabase.md`

### 5. Cloudflare R2 — File Upload
- ห้าม upload ตรงจาก browser → ต้องขอ presigned URL ผ่าน `/api/upload`
- ใช้ `getUploadUrl(key, contentType)` จาก `src/lib/r2.ts`
- Public URL pattern: `${R2_PUBLIC_URL}/${key}`

### 6. Cloudflare Workers — AI Proxy
- **ห้าม** call Gemini API จาก browser หรือ Next.js โดยตรง
- ทุก AI request ต้องผ่าน `workers/proxy.ts` เสมอ
- Route Handler `/api/ai-coach/route.ts` → Workers → Gemini
- ดูรายละเอียด → `references/03-workers.md`

### 7. Resend — Email
- ใช้ functions จาก `src/lib/resend.ts` เท่านั้น
- Trigger: สมัครใหม่, ทำภารกิจสำเร็จ, admin แจ้งเตือน

### 8. LINE Notify — Push Notification
- ใช้ `sendLineNotify(message)` จาก `src/lib/line-notify.ts`
- Trigger ทุก event สำคัญ: สมาชิกใหม่, mission complete, error

---

## Domain Models (สรุป — รายละเอียดใน `@/types/index.ts`)

```typescript
Profile       ← ข้อมูลสมาชิก (ubc_level 1-4, wealth_element, referral_slug)
Mission       ← ภารกิจ (category: MINDSET | SKILLSET | TOOLSET)
UserMission   ← สถานะภารกิจ (IN_PROGRESS | COMPLETED | VERIFIED)
AICoachMessage ← ประวัติแชทน้องยูนิ
UBCLevel      ← 1 | 2 | 3 | 4
WealthElement ← EARTH | WATER | AIR | FIRE
```

---

## Feature Implementation Guide

เมื่อต้องเพิ่ม/แก้ feature ให้เปิด reference ที่เกี่ยวข้อง:

| Feature | Reference File |
|---|---|
| Supabase schema, RLS, query pattern | `references/02-supabase.md` |
| Cloudflare Workers / AI proxy | `references/03-workers.md` |
| Environment variables ทั้งหมด | `references/04-env-and-deploy.md` |
| Design system, component patterns | `references/05-design-system.md` |

---

## Common Tasks — Quick Reference

```
เพิ่มตารางใหม่ใน DB   → อ่าน references/02-supabase.md → เขียน SQL + RLS
เพิ่ม API Route        → src/app/api/[name]/route.ts + auth check
เพิ่ม Page             → src/app/[name]/page.tsx (Server Component)
เพิ่ม Client Component → "use client" + ไฟล์แยก ไม่ใส่ใน page.tsx
อัพโหลดรูป            → POST /api/upload → PUT presigned URL → save publicUrl
ส่ง email             → import { sendXxxEmail } from "@/lib/resend"
ส่ง LINE              → import { sendLineNotify } from "@/lib/line-notify"
แก้ Workers           → workers/proxy.ts → wrangler deploy
```
