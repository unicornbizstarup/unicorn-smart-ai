/**
 * build/client/functions/[[path]].ts — Cloudflare Pages Functions SSR handler
 * Generated automatically at build time.
 */
import { createRequestHandler } from "@react-router/cloudflare";
// @ts-ignore — resolved from build/client/server-bundle.js
import * as build from "../server-bundle.js";

const handler = createRequestHandler({
  build,
  getLoadContext() {
    return undefined as any;
  },
});

export const onRequest: PagesFunction = async (context) => {
  const method = context.request.method;

  // Try to serve static assets first (Only for GET and HEAD requests)
  if (method === "GET" || method === "HEAD") {
    try {
      const assetResponse = await context.env.ASSETS.fetch(context.request);
      if (assetResponse.status !== 404) {
        return assetResponse;
      }
    } catch {}
  }

  // Set global CF_ENV for Supabase Server Client
  // @ts-ignore
  globalThis.CF_ENV = context.env;

  // Fall through to React Router SSR / API Action
  return handler(context);
};