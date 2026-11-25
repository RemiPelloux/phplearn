<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## PHP Learn notes

- PHP runs for real: `src/php/` (see README). The same runner is used in the browser (Web Worker, `@php-wasm/web`) and in Vitest (`@php-wasm/node`). `src/php/prelude.ts` must stay PHP 7.4-compatible.
- Lessons live in `src/features/curriculum/lessons/*.ts`, every learner-facing string as `L(en, fr)`. Run one chapter's real-PHP test with `npx vitest run src/features/curriculum -t <chapter id>`; wrap long Vitest runs in `timeout`.
- Never use Fibers in content: they crash the WebAssembly engine.
- `next.config.ts` aliases `worker_threads` and `@php-wasm/web-5-2` to an empty module and stubs `*.so`/`*.dat` (intl): keep those when upgrading php-wasm.
- Docs prose avoids em and en dashes (a test enforces it).
