/// <reference lib="webworker" />
/**
 * One Web Worker runs one PHP version. The page can terminate it when a script
 * takes too long, so a runaway loop never freezes the tab.
 */
import { loadWebRuntime } from "@php-wasm/web";
import { PHP } from "@php-wasm/universal";
import { runOn, type PhpLike } from "./core";
import type { PhpVersion, RunRequest } from "./types";

let php: Promise<PHP> | null = null;
let loaded: PhpVersion | null = null;

function instance(version: PhpVersion) {
  if (!php || loaded !== version) {
    loaded = version;
    php = loadWebRuntime(version, { emscriptenOptions: { processId: 1 } } as never).then((id) => new PHP(id));
  }
  return php;
}

self.onmessage = async (e: MessageEvent<{ id: number; type: "load" | "run"; req: RunRequest }>) => {
  const { id, type, req } = e.data;
  try {
    const p = await instance(req.version);
    if (type === "load") {
      self.postMessage({ id, ok: true });
      return;
    }
    const result = await runOn(p as unknown as PhpLike, req);
    // A crashed engine stays broken: drop it so the next run loads a fresh one.
    if (result.crashed) php = null;
    self.postMessage({ id, ok: true, result });
  } catch (err) {
    php = null;
    self.postMessage({ id, ok: false, error: String((err as Error)?.message ?? err) });
  }
};
