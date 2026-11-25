import type { NextConfig } from "next";

/**
 * STATIC_EXPORT=1 builds a fully static site into `out/` (used for GitHub Pages).
 * BASE_PATH sets the sub-path it is served from, e.g. "/phplearn".
 * PHP runs in the browser (WebAssembly), so the static build is the whole app.
 */
const staticExport = process.env.STATIC_EXPORT === "1";
const basePath = process.env.BASE_PATH || undefined;

const nextConfig: NextConfig = {
  ...(staticExport ? { output: "export" as const, trailingSlash: true, images: { unoptimized: true } } : {}),
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath ?? "" },
  turbopack: {
    resolveAlias: {
      // php-wasm references Node's worker_threads behind a runtime check; the browser never uses it.
      worker_threads: { browser: "./src/php/empty.ts" },
      // PHP 5.2 ships with php-wasm but this app teaches 7.4 → 8.5.
      "@php-wasm/web-5-2": "./src/php/empty.ts",
    },
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
      // The intl extension binaries and ICU data are optional and never loaded here.
      "*.{so,dat}": {
        loaders: [require.resolve("./scripts/empty-loader.cjs")],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
