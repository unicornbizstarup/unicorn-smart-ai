import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  // Public Landing Page
  index("routes/home.tsx"),

  // Auth Flow
  route("auth/login", "routes/auth.login.tsx"),
  route("auth/register", "routes/auth.register.tsx"),
  route("auth/callback", "routes/auth.callback.tsx"),

  // Member Dashboard & Tools
  route("dashboard", "routes/dashboard.tsx"),
  route("profile", "routes/profile.tsx"),
  route("ai-coach", "routes/ai-coach.tsx"),
  route("dna", "routes/dna.tsx"),
  route("missions", "routes/missions.tsx"),
  route("startup", "routes/startup.tsx"),
  route("products", "routes/products.tsx"),
  route("knowledge", "routes/knowledge.tsx"),
  route("functions", "routes/functions.tsx"),

  // Referral (Affiliate Sales Page)
  route("r/:slug", "routes/referral.$slug.tsx"),

  // Admin Area
  route("admin", "routes/admin.dashboard.tsx"),
  route("admin/products", "routes/admin.products.index.tsx"),
  route("admin/products/new", "routes/admin.products.new.tsx"),
  route("admin/products/:id", "routes/admin.products.edit.tsx"),
  route("admin/categories", "routes/admin.categories.tsx"),
  route("admin/knowledge", "routes/admin.knowledge.tsx"),

  // Standalone API Endpoints
  route("api/auth/login", "routes/api.auth.login.ts"),
  route("api/ai-coach", "routes/api.ai-coach.ts"),
  route("api/contact", "routes/api.contact.ts"),
  route("api/notify", "routes/api.notify.ts"),
  route("api/upload", "routes/api.upload.ts"),
  route("api/referral/track", "routes/api.referral.track.ts"),
  route("api/referral/claim", "routes/api.referral.claim.ts"),
] satisfies RouteConfig;
