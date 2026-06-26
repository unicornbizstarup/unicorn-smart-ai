/**
 * worker-entry.ts — Cloudflare Pages _worker.js (Advanced Mode)
 *
 * Uses createRequestHandler directly to avoid the immutable-headers bug
 * in createPagesFunctionHandler (which calls request.headers.delete()).
 *
 * Import ORDER matters in ESM:
 * 1. polyfill.ts  — sets globalThis.MessageChannel FIRST
 * 2. server build — React 19 finds MessageChannel already set
 * 3. cloudflare   — handler setup
 */

// ① Polyfill must be FIRST import
import "./polyfill";

// ② React Router server bundle
// @ts-ignore - server bundle generated at build time
import * as build from "./build/server/worker.js";

// ③ Cloudflare handler (use createRequestHandler, NOT createPagesFunctionHandler)
import { createRequestHandler } from "@react-router/cloudflare";

const handler = createRequestHandler({
  build,
  getLoadContext({ context }) {
    return { cloudflare: context };
  },
});

export default {
  async fetch(
    request: Request,
    env: Record<string, any>,
    ctx: ExecutionContext
  ): Promise<Response> {
    // Serve static assets first (CSS, JS, images)
    try {
      const assetResponse = await (env as any).ASSETS.fetch(
        new Request(request.url, request)
      );
      if (assetResponse.status >= 200 && assetResponse.status < 400) {
        return assetResponse;
      }
    } catch {}

    // Fall through to React Router SSR
    const cloudflareCtx = {
      request,
      env,
      waitUntil: ctx.waitUntil.bind(ctx),
      passThroughOnException: ctx.passThroughOnException.bind(ctx),
      cf: (request as any).cf,
      caches,
    };

    return handler(cloudflareCtx);
  },
};
