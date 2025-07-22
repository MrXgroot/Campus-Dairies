// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

// Optional: used for inline web workers

export default defineConfig({
  plugins: [react(), tailwindcss(), wasm(), topLevelAwait()],
  optimizeDeps: {
    exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util"], // 🛑 Prevent prebundling ffmpeg deps
  },

  worker: {
    format: "es",
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-[hash].js`,
      },
    },
  },
});
