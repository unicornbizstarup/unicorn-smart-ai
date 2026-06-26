import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./app"),
    },
  },
  ssr: {
    resolve: {
      // Use workerd/edge conditions so react-dom/server uses the
      // Cloudflare Workers-compatible edge build (not the Node.js build
      // that requires async_hooks, stream, etc.)
      conditions: ["workerd", "worker", "browser"],
      externalConditions: ["workerd", "worker"],
    },
  },
});
