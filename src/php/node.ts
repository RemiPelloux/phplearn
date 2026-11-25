/** Node runner for tests: the same PHP interpreters as the browser, loaded with @php-wasm/node. */
import { loadNodeRuntime } from "@php-wasm/node";
import { PHP } from "@php-wasm/universal";
import { runOn, type PhpLike } from "./core";
import type { PhpVersion, RunRequest, RunResult } from "./types";

const cache = new Map<PhpVersion, Promise<PHP>>();

function instance(version: PhpVersion) {
  let p = cache.get(version);
  if (!p) {
    p = loadNodeRuntime(version, { emscriptenOptions: { processId: 1 } }).then((id) => new PHP(id));
    cache.set(version, p);
  }
  return p;
}

export async function runNode(req: RunRequest): Promise<RunResult> {
  const php = await instance(req.version);
  const r = await runOn(php as unknown as PhpLike, req);
  if (r.crashed) cache.delete(req.version);
  return r;
}
