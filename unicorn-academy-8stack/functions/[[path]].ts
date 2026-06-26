/**
 * functions/[[path]].ts — Cloudflare Pages Functions SSR handler
 *
 * Serves static assets first (via ASSETS binding),
 * then falls back to React Router SSR.
 *
 * getLoadContext returns undefined so React Router creates
 * a default RouterContextProvider (required in react-router v8.0.1+).
 */
import { createRequestHandler } from "@react-router/cloudflare";

// @ts-ignore — generated at build time
import * as build from "../build/server/worker.js";

const handler = createRequestHandler({
  build,
  getLoadContext() {
    return undefined as any;
  },
});

export const onRequest: PagesFunction = async (context) => {
  // Try to serve static assets first
  try {
    const assetResponse = await context.env.ASSETS.fetch(context.request);
    if (assetResponse.status !== 404) {
      return assetResponse;
    }
  } catch {}

  // Fall through to React Router SSR
  return handler(context);
};
