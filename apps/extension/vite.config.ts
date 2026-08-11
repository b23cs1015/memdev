import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react()],

  build: {
    outDir: "dist",
    emptyOutDir: true,

    rollupOptions: {
      input: {
        popup: resolve(rootDir, "popup.html"),

        background: resolve(
          rootDir,
          "src/background/service-worker.ts",
        ),

        content: resolve(
          rootDir,
          "src/content/content-script.ts",
        ),
      },

      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === "background") {
            return "assets/background/service-worker.js";
          }

          if (chunk.name === "content") {
            return "assets/content/content-script.js";
          }

          return "assets/[name].js";
        },

        chunkFileNames: "assets/chunks/[name]-[hash].js",

        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
});