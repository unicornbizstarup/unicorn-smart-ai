---
name: unicorn_smart_ai-8stack.skill
description: >
  คู่มือพัฒนาและแก้ไข Unicorn Smart AI บน 8-Stack มาตรฐานของครูเด่น
  (Next.js App Router + TypeScript + Tailwind CSS + Supabase pgvector +
  Cloudflare R2 + Cloudflare Pages + Resend + LINE Notify + Cloudflare Workers + Gemini RAG)

  ใช้ทักษะนี้ทุกครั้งที่:
  - เขียนหรือแก้ไขโค้ดใดๆ ใน Unicorn Smart AI / Unicorn Academy
  - เพิ่ม feature: UBC, AI Coach (RAG), Missions, Profile, Referral Affiliate, Wealth DNA
  - เขียน Route Handler, Server Component, Server Action
  - เชื่อมต่อ Supabase/pgvector, R2, Resend, LINE, Workers, Gemini
  - ตั้ง RLS Policy, pgvector extension, knowledge base
  - Deploy ขึ้น Cloudflare Pages / Workers
  - แก้ bug หรือ refactor โค้ดในโปรเจกต์

  Trigger phrases: "unicorn smart ai", "unicorn academy", "8-stack", "antigravity",
  "ai coach", "น้องยูนิ", "rag knowledge", "referral slug", "wealth dna",
  "admin products", "profile photo", "sale page", "pgvector"
---

# 🦄 Unicorn Smart AI — 8-Stack Developer Skill (v2)

---

## Quick Stack Map

```
Stack #  Service                  บทบาท                         ไฟล์หลัก
──────────────────────────────────────────────────────────────────────────
①       Next.js (App Router)     Full-stack App                 src/app/
②       TypeScript (strict)      Type Safety                    src/types/index.ts
③       Tailwind CSS             Light Theme Design System      tailwind.config.ts / globals.css
④       Supabase + pgvector      DB + Auth + RLS + Vector Search src/lib/supabase*.ts
⑤       Cloudflare R2            Object Storage (images/docs)   src/lib/r2.ts
⑥       Cloudflare Pages         Hosting + CDN (ISR)            next.config.ts
⑦       Resend                   Transactional Email            src/lib/resend.ts
⑧       LINE Notify + CF Workers  Notification + AI/Embed Proxy src/lib/line-notify.ts
                                                                 workers/proxy.ts
```

---

## Complete Folder Structure

```
unicorn-academy-8stack/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    ← Root layout
│   │   ├── globals.css                   ← Light Theme tokens
│   │   ├── page.tsx                      ← Homepage
│   │   ├── middleware.ts                 ← Supabase SSR auth guard
│   │   │
│   │   ├── api/
│   │   │   ├── ai-coach/route.ts         ← POST → RAG search → Workers → Gemini
│   │   │   ├── upload/route.ts           ← POST → R2 presigned URL
│   │   │   ├── notify/route.ts           ← POST → LINE Notify
│   │   │   ├── contact/route.ts          ← POST → Resend + LINE
│   │   │   └── referral/
│   │   │       ├── track/route.ts        ← POST → set HttpOnly cookie
│   │   │       └── claim/route.ts        ← POST → verify + return referrer_id
│   │   │
│   │   ├── auth/
│   │   │   ├── callback/route.ts
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx         ← auto-link referral cookie
│   │   │
│   │   ├── (admin)/admin/
│   │   │   ├── layout.tsx                ← Sidebar nav
│   │   │   ├── page.tsx                  ← Dashboard stats
│   │   │   ├── products/
│   │   │   │   ├── page.tsx              ← Product list (Server)
│   │   │   │   ├── ProductsClient.tsx    ← CRUD table (Client)
│   │   │   │   ├── new/page.tsx          ← Create form
│   │   │   │   ├── [id]/page.tsx         ← Edit form
│   │   │   │   └── actions.ts            ← createProduct/updateProduct/deleteProduct
│   │   │   ├── categories/
│   │   │   │   ├── page.tsx
│   │   │   │   └── actions.ts
│   │   │   └── knowledge/
│   │   │       ├── page.tsx              ← RAG Knowledge Base Admin
│   │   │       ├── KnowledgeClient.tsx
│   │   │       └── actions.ts            ← ingestUrl/ingestText/deleteDocument
│   │   │
│   │   ├── profile/
│   │   │   ├── page.tsx                  ← Profile edit (auth required)
│   │   │   ├── ProfileClient.tsx         ← Form + Photo Upload + AI Bio
│   │   │   └── actions.ts                ← updateProfile/uploadPhoto/generateAIBio
│   │   │
│   │   ├── r/[slug]/
│   │   │   ├── page.tsx                  ← Public Sale Page (SSG + ISR)
│   │   │   └── ReferralLanding.tsx       ← Full landing page component
│   │   │
│   │   ├── dashboard/page.tsx            ← Member dashboard
│   │   ├── ai-coach/page.tsx             ← น้องยูนิ chat (RAG-enhanced)
│   │   ├── startup/page.tsx              ← 5 เริ่มต้น
│   │   ├── products/
│   │   │   ├── page.tsx                  ← Product library (member)
│   │   │   └── ProductsClient.tsx
│   │   ├── knowledge/page.tsx            ← Knowledge library (member)
│   │   ├── functions/page.tsx            ← Function to Function
│   │   ├── dna/page.tsx                  ← Wealth DNA
│   │   └── missions/page.tsx             ← Missions board
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── NavBar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Badge.tsx
│   │   ├── ai-coach/
│   │   │   ├── ChatWindow.tsx
│   │   │   └── MessageBubble.tsx
│   │   └── profile/
│   │       ├── PhotoUploader.tsx         ← 3-slot photo upload → R2
│   │       └── PhonePreview.tsx          ← Live preview mockup
│   │
│   ├── lib/
│   │   ├── supabase.ts                   ← createClient() browser
│   │   ├── supabase-server.ts            ← createServerSupabase() + createServiceSupabase()
│   │   ├── r2.ts                         ← getUploadUrl() + helpers
│   │   ├── rag.ts                        ← embedText() + searchKnowledge() + ingestDocument()
│   │   ├── resend.ts                     ← email templates
│   │   └── line-notify.ts               ← sendLineNotify()
│   │
│   └── types/
│       └── index.ts                      ← All domain types
│
├── workers/
│   └── proxy.ts                          ← /chat /embed /crawl /generate-bio
│
├── supabase/
│   └── schema.sql                        ← Full schema + RLS + pgvector + RPCs
│
├── tailwind.config.ts
├── next.config.ts
└── wrangler.toml
```

---

## Core Rules — อ่านก่อนเขียนโค้ดทุกครั้ง

### 1. Next.js App Router
- App Router เท่านั้น — ห้าม `pages/`
- Server Component เป็น default — `"use client"` เฉพาะ state/event/motion
- Data fetching ใน Server Component โดยตรง
- `generateMetadata()` ทุก public page (SEO + OG image)

### 2. TypeScript — Strict
- ห้าม `any` — ใช้ `unknown` เมื่อไม่แน่ใจ type
- Import types จาก `@/types/index.ts` เสมอ

### 3. Light Theme Design System
```
Primary:    #c0281e (Red) → #e8621a (Orange) → #f5a623 (Amber)
BG:         #f7f4ef (page) / #ffffff (card) / #f4f2ee (input)
Text:       #1a1209 (primary) / #6b5e4a (secondary) / #9a8a72 (muted)
Border:     #e8e2d9 (default) / #d6cfc4 (mid) / #c4bcb0 (strong)
Gold:       #b8924a (accent)
Classes:    .btn-gold .btn-outline .card-base .glass .badge-*
```

### 4. Supabase Client Selection
```typescript
// Browser → createClient() จาก @/lib/supabase
// Server RSC/Route Handler → await createServerSupabase() จาก @/lib/supabase-server
// Admin/bypass RLS → createServiceSupabase() (sync, server-side only)
```

### 5. R2 Upload Pattern
```
Client → POST /api/upload { filename, contentType, folder }
       ← { uploadUrl (presigned PUT), publicUrl, key }
Client → PUT uploadUrl (body: file binary)
Server → UPDATE table SET image_url = publicUrl
```

### 6. RAG Pattern (สำคัญมาก)
```
Admin เพิ่มเอกสาร → Workers /crawl → chunk (500 chars) →
Workers /embed → Gemini text-embedding-004 (768 dims) →
Supabase pgvector knowledge_chunks table

User ถามน้องยูนิ →
  embedText(query) → searchKnowledge() (cosine similarity ≥ 0.65) →
  inject top-5 chunks as context → Workers /chat → Gemini → reply
```

### 7. Referral Affiliate Pattern
```
Slug = clean URL: /r/unicorncoachden
รหัส TH546415 ซ่อนใน HMAC-SHA256 token → HttpOnly Cookie 30 วัน
ตอนสมัคร → POST /api/referral/claim → verify → บันทึก referred_by
```

### 8. LINE + Resend Notification
```typescript
// ทุก event สำคัญ:
await Promise.all([
  sendLineNotify(msg).catch(console.error),
  sendXxxEmail(...).catch(console.error),
]);
// Trigger: สมาชิกใหม่, mission complete, referral conversion, admin action
```

---

## Domain Models

```typescript
// profiles
Profile {
  id, full_name, display_name, expertise, quote, bio
  avatar_url, photo_urls: string[], photo_captions: string[]
  line_oa_url, line_id, facebook_url, youtube_url, instagram_url
  ai_bio, ai_tags: string[]
  referral_slug (UNIQUE), referred_by (FK → profiles.id)
  referral_clicks, referral_conversions
  ubc_level: 1|2|3|4, wealth_element: EARTH|WATER|AIR|FIRE
  business_points, is_verified
}

// products (Admin CRUD)
Product {
  id, name, description, category_id (FK)
  member_price, retail_price, pv: number
  image_url, ingredients: string[], highlights: string[]
  selling_points: string[], usage_guide
  is_active, is_featured, sort_order
}

// categories
ProductCategory { id, name, slug, banner_url, icon_url, sort_order }

// knowledge base (RAG)
KnowledgeDoc {
  id, title, category: products|reward_plan|promotion|sales_strategy|general
  source_type: pdf|txt|url|docx, source_url, file_size
  status: pending|processing|indexed|error, chunk_count
}
KnowledgeChunk { id, doc_id, content, embedding: vector(768), metadata, chunk_index }

// missions
Mission { id, title, description, category: MINDSET|SKILLSET|TOOLSET, points, sort_order }
UserMission { id, profile_id, mission_id, status: IN_PROGRESS|COMPLETED|VERIFIED }

// ai coach
AICoachMessage { id, profile_id, role: user|model, content, created_at }
```

---

## Development Phases (ลำดับการพัฒนา)

### Phase 1 — Foundation (ทำก่อน)
```
1. supabase/schema.sql          ← schema ทั้งหมด + RLS + pgvector
2. src/lib/supabase.ts          ← browser client
3. src/lib/supabase-server.ts   ← server client + service role
4. src/lib/r2.ts                ← R2 upload helpers
5. src/types/index.ts           ← type definitions ทั้งหมด
6. src/app/globals.css          ← Light Theme design tokens
7. tailwind.config.ts           ← extend colors + fonts
8. src/app/middleware.ts        ← auth guard
9. src/app/layout.tsx           ← root layout + fonts
```

### Phase 2 — Auth
```
10. src/app/auth/login/page.tsx
11. src/app/auth/register/page.tsx  ← + referral cookie claim
12. src/app/auth/callback/route.ts
```

### Phase 3 — Member Core
```
13. src/app/dashboard/page.tsx
14. src/app/profile/page.tsx + ProfileClient.tsx + actions.ts
15. src/components/profile/PhotoUploader.tsx
16. src/app/api/upload/route.ts
17. src/app/api/referral/track/route.ts
18. src/app/api/referral/claim/route.ts
```

### Phase 4 — Sale Page (Referral)
```
19. src/app/r/[slug]/page.tsx
20. src/app/r/[slug]/ReferralLanding.tsx
```

### Phase 5 — AI Coach + RAG
```
21. workers/proxy.ts              ← /chat /embed /crawl /generate-bio
22. src/lib/rag.ts                ← embedText + searchKnowledge + ingestDocument
23. src/app/api/ai-coach/route.ts ← RAG-enhanced
24. src/app/ai-coach/page.tsx
```

### Phase 6 — Admin Panel
```
25. src/app/(admin)/admin/layout.tsx
26. src/app/(admin)/admin/page.tsx
27. src/app/(admin)/admin/products/page.tsx + ProductsClient.tsx + actions.ts
28. src/app/(admin)/admin/products/new/page.tsx
29. src/app/(admin)/admin/products/[id]/page.tsx
30. src/app/(admin)/admin/categories/page.tsx + actions.ts
31. src/app/(admin)/admin/knowledge/page.tsx + KnowledgeClient.tsx + actions.ts
```

### Phase 7 — Member Features
```
32. src/app/startup/page.tsx
33. src/app/products/page.tsx + ProductsClient.tsx
34. src/app/knowledge/page.tsx
35. src/app/functions/page.tsx
36. src/app/dna/page.tsx
37. src/app/missions/page.tsx
```

### Phase 8 — Notifications + Deploy
```
38. src/lib/line-notify.ts
39. src/lib/resend.ts
40. src/app/api/notify/route.ts
41. src/app/api/contact/route.ts
42. wrangler.toml + workers deploy
43. Cloudflare Pages deploy
```

---

## Common Tasks

```
สร้างสินค้าใหม่  → /admin/products/new → ProductForm → actions.createProduct
แก้ไขสินค้า      → /admin/products/[id] → ProductForm → actions.updateProduct
เพิ่ม Knowledge  → /admin/knowledge → KnowledgeClient → ingestUrl/ingestText
ถาม AI Coach     → /ai-coach → POST /api/ai-coach (RAG-enhanced)
ดู Sale Page     → /r/[referral_slug] → ReferralLanding
อัพโหลดรูป      → POST /api/upload → PUT presigned URL → save publicUrl
ส่ง LINE         → import { sendLineNotify } from "@/lib/line-notify"
ส่ง Email        → import { sendXxxEmail } from "@/lib/resend"
Deploy Workers   → cd workers && wrangler deploy
```
