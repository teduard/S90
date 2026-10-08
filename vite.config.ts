import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import type { VitePWAOptions } from "vite-plugin-pwa";

const base = "/S90/";
const name = "S90";

const pwaOptions: Partial<VitePWAOptions> = {
  mode: "development",
  base: base,
  includeAssets: ["favicon.ico"],
  workbox: {
    clientsClaim: true,
    skipWaiting: true,
    maximumFileSizeToCacheInBytes: 8000000,
  },
  manifest: {
    start_url: `${base}/?mode=standalone`,
    scope: base,
    display: "standalone",
    name: name,
    short_name: name,
    theme_color: "#1f2937",
    icons: [
      {
        src: `${base}assets/android-chrome-192x192.png`,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: `${base}assets/android-chrome-512x512.png`,
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  devOptions: {
    enabled: false,
    type: "module",
    navigateFallback: "index.html",
  },
};

export default defineConfig({
  plugins: [react(), VitePWA(pwaOptions)],
  base: base,
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          webllm: ["@mlc-ai/web-llm"],
          "react-pdf": ["@react-pdf/renderer"],
        },
      },
    },
  },
});
