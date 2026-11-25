import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
  // Loading a PHP WebAssembly engine takes a few seconds on CI machines.
  test: { include: ["src/**/*.test.ts"], environment: "node", testTimeout: 60_000, hookTimeout: 60_000 },
});
