import { createPagesFunctionHandler } from "@react-router/cloudflare";

// @ts-ignore — generated at build time
import * as build from "../build/server/index.js";

export const onRequest = createPagesFunctionHandler({
  build,
  getLoadContext({ context }) {
    return { cloudflare: context };
  },
});
