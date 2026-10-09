import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // Server modules import this guard; it only matters inside a client bundle.
      "server-only": fileURLToPath(new URL("./node_modules/server-only/empty.js", import.meta.url)),
    },
  },
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
    // Component tests opt in to jsdom with `// @vitest-environment jsdom`; everything else stays in node.
    setupFiles: ["./src/test/setup.ts"],
    // Only measured with `npm run test:coverage`; plain `npm test` stays fast.
    coverage: {
      provider: "v8",
      include: ["src/**"],
      exclude: ["**/*.test.{ts,tsx}", "src/test/**"],
      reporter: ["text-summary", "json-summary"],
      reportsDirectory: "coverage",
    },
  },
});
