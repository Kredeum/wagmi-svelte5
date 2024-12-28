import { defineConfig } from "vitest/config";
import { sveltekit } from "@sveltejs/kit/vite";

import deploymentsJson from "./deployments.json";

export default defineConfig({
  plugins: [sveltekit()],
  server: { open: true },
  define: {
    __DEPLOYMENTS_JSON__: deploymentsJson,
    "process.env.NODE_ENV": '"development"'
  }
});
