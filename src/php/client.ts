"use client";

import type { PhpVersion, RunRequest, RunResult } from "./types";

/** How long a script may run before we stop it. */
export const TIME_LIMIT_MS = 8000;
/** At most this many PHP versions stay loaded (each one uses ~60 MB of memory). */
const MAX_LIVE = 2;

interface Live {
  worker: Worker;
  ready: Promise<void>;
  used: number;
  seq: number;
  pending: Map<number, { resolve: (r: RunResult | null) => void; reject: (e: Error) => void }>;
}

const live = new Map<PhpVersion, Live>();
const listeners = new Set<() => void>();
const status: Record<string, "loading" | "ready"> = {};

export function onRuntimeStatus(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
export const runtimeStatus = (v: PhpVersion) => status[v] ?? "idle";
const emit = () => listeners.forEach((l) => l());

function spawn(version: PhpVersion): Live {
  const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
  const entry: Live = { worker, ready: Promise.resolve(), used: Date.now(), seq: 1, pending: new Map() };
  worker.onmessage = (e: MessageEvent<{ id: number; ok: boolean; result?: RunResult; error?: string }>) => {
    const p = entry.pending.get(e.data.id);
    if (!p) return;
    entry.pending.delete(e.data.id);
    if (e.data.ok) p.resolve(e.data.result ?? null);
    else p.reject(new Error(e.data.error));
  };
  worker.onerror = (e) => {
    for (const p of entry.pending.values()) p.reject(new Error(e.message || "PHP worker crashed"));
    entry.pending.clear();
    drop(version);
  };
  status[version] = "loading";
  emit();
  entry.ready = send(entry, "load", { version, files: {} }).then(() => {
    status[version] = "ready";
    emit();
  });
  entry.ready.catch(() => drop(version));
  return entry;
}

function send(entry: Live, type: "load" | "run", req: RunRequest) {
  const id = entry.seq++;
  return new Promise<RunResult | null>((resolve, reject) => {
    entry.pending.set(id, { resolve, reject });
    entry.worker.postMessage({ id, type, req });
  });
}

function drop(version: PhpVersion) {
  const e = live.get(version);
  if (!e) return;
  e.worker.terminate();
  live.delete(version);
  delete status[version];
  emit();
}

function get(version: PhpVersion): Live {
  let e = live.get(version);
  if (!e) {
    // Keep memory in check: unload the least recently used version.
    while (live.size >= MAX_LIVE) {
      const oldest = [...live.entries()].sort((a, b) => a[1].used - b[1].used)[0];
      drop(oldest[0]);
    }
    e = spawn(version);
    live.set(version, e);
  }
  e.used = Date.now();
  return e;
}

/** Start downloading a version early (e.g. when a lesson opens). */
export function preload(version: PhpVersion) {
  if (typeof window === "undefined") return;
  get(version);
}

/** Run PHP code in a real interpreter of the requested version. */
export async function runPhp(req: RunRequest): Promise<RunResult> {
  const entry = get(req.version);
  await entry.ready;
  const t0 = performance.now();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<null>((resolve) => {
    timer = setTimeout(() => resolve(null), TIME_LIMIT_MS);
  });
  const result = await Promise.race([send(entry, "run", req), timeout]);
  clearTimeout(timer);
  if (result) return result;
  // Too slow (or stuck in a loop): stop the worker; the next run starts a fresh one.
  drop(req.version);
  return {
    version: req.version,
    fullVersion: req.version,
    stdout: "",
    exitCode: 255,
    ms: Math.round(performance.now() - t0),
    problems: [
      {
        kind: "Timeout",
        severity: "error",
        message: `The script ran for more than ${TIME_LIMIT_MS / 1000} seconds and was stopped.`,
        file: null,
        line: null,
        at: 0,
        trace: [],
      },
    ],
    steps: [],
    ticks: 0,
    stopped: "time",
    globals: {},
    probes: (req.probes ?? []).map(() => ({ ok: false, type: "NotRun", value: "The script was stopped.", json: null, printed: "" })),
    functions: [],
    classes: [],
    stderr: "",
  };
}
