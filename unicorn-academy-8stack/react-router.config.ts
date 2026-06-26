import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  // Build the server for Cloudflare Workers (ESM, no Node.js built-ins)
  serverBuildFile: "worker.js",
  serverModuleFormat: "esm",
} satisfies Config;
