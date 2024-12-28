import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";

export default defineConfig({
  plugins: [svelte({ hot: !process.env.VITEST })],
  test: {
    include: ["tests/unit/**/*.{test,spec,t}.{js,ts}"],
    environment: "happy-dom",
    globals: true,
    setupFiles: ["tests/unit/setup.ts"],
    testTimeout: 10000,
    hookTimeout: 10000,
    teardownTimeout: 10000,
    isolate: false,
    pool: "threads",
    environmentOptions: {
      happyDOM: {
        settings: {
          disableJavaScriptEvaluation: true
        }
      }
    }
  },
  resolve: {
    alias: {
      $env: resolve(__dirname, "./tests/unit/mocks/env"),
      $lib: resolve(__dirname, "./src/lib"),
      "@wagmi-svelte5": resolve(__dirname, "./src/lib/wagmi/index.ts")
    }
  }
});
