import { PRELUDE, runnerScript } from "./prelude";
import type { Frame, Problem, ProbeResult, RunRequest, RunResult, TraceStep, VarValue } from "./types";

/** The few php-wasm methods we use (same in the browser and in Node). */
export interface PhpLike {
  mkdir(path: string): void;
  writeFile(path: string, data: string): void;
  readFileAsText(path: string): string;
  fileExists(path: string): boolean;
  unlink(path: string): void;
  rmdir(path: string, options?: { recursive?: boolean }): void;
  run(req: { scriptPath?: string; code?: string; method?: "GET" | "POST"; relativeUri?: string; body?: string; headers?: Record<string, string> }): Promise<{
    text: string;
    exitCode: number;
    errors: string;
  }>;
}

const STRICT = /^(\s*<\?php\b(?:\s|\/\*[\s\S]*?\*\/|\/\/[^\n]*\n|#[^\n]*\n)*declare\s*\(\s*strict_types\s*=\s*[01]\s*\)\s*;)/i;

/**
 * Turn on ticks in a learner's file without moving any line:
 * after `declare(strict_types=1);` when present, otherwise right after `<?php`.
 */
export function instrument(code: string): string {
  const m = STRICT.exec(code);
  if (m) return m[1] + " declare(ticks=1);" + code.slice(m[1].length);
  const open = /^(\s*)<\?php(\s)/i.exec(code);
  if (open) return code.slice(0, open[0].length - open[2].length) + " declare(ticks=1);" + code.slice(open[0].length - open[2].length);
  const short = /^(\s*)<\?php$/i.exec(code);
  if (short) return code + " declare(ticks=1);";
  // Starts with HTML: add a tiny PHP block in front (no output, no new line).
  return "<?php declare(ticks=1); ?>" + code;
}

/** Line (1-based) where instrument() puts `declare(ticks=1)`. */
function lineOfDeclare(code: string): number {
  const m = STRICT.exec(code);
  const upTo = m ? m[1] : (/^\s*<\?php/i.exec(code)?.[0] ?? "");
  return upTo.split("\n").length;
}

interface RawResult {
  version?: string;
  steps?: Array<{ f: string; l: number; s: string[]; o: number; g?: Record<string, VarValue>; r?: string[]; a?: Record<string, VarValue> }>;
  ticks?: number;
  problems?: Array<{ k: string; s: Problem["severity"]; m: string; f: string | null; l: number | null; o: number; t: Array<{ fn: string; f: string | null; l: number | null }> }>;
  globals?: Record<string, VarValue>;
  probes?: Array<{ ok: boolean; t: string; v: string; j?: string | null; p?: string }>;
  functions?: string[];
  classes?: string[];
  stopped?: string;
}

/** Clean up a PHP error message for display: user paths are shown relative. */
export const tidy = (s: string) => s.replace(/\/app\//g, "").replace(/\/internal\/eval\.php/g, "runner");

function parseStderrFatal(stderr: string): Problem | null {
  const m = /PHP (Parse error|Fatal error):\s+([\s\S]*?) in \/app\/([^\s]+) on line (\d+)/.exec(stderr);
  if (!m) return null;
  return { kind: m[1], severity: "error", message: tidy(m[2].trim()), file: m[3], line: Number(m[4]), at: 0, trace: [] };
}

export async function runOn(php: PhpLike, req: RunRequest): Promise<RunResult> {
  const t0 = performance.now();
  const entry = req.entry ?? "index.php";
  // A clean /app for every run.
  try {
    php.rmdir("/app", { recursive: true });
  } catch {
    /* first run */
  }
  try {
    php.unlink("/tmp/__result.json");
  } catch {
    /* none yet */
  }
  php.mkdir("/app");
  php.mkdir("/tmp");
  for (const [path, content] of Object.entries(req.files)) {
    const full = `/app/${path}`;
    const dir = full.slice(0, full.lastIndexOf("/"));
    if (dir !== "/app") php.mkdir(dir);
    php.writeFile(full, path.endsWith(".php") ? instrument(content) : content);
  }
  php.writeFile("/app/__prelude.php", PRELUDE);
  php.writeFile("/app/__run.php", runnerScript(entry, req.probes ?? []));

  const query = req.request?.query ? "?" + new URLSearchParams(req.request.query).toString() : "";
  const method = req.request?.method ?? "GET";
  let text = "";
  let exitCode = 0;
  let stderr = "";
  try {
    const r = await php.run({
      scriptPath: "/app/__run.php",
      relativeUri: `/index.php${query}`,
      method,
      ...(method === "POST" && req.request?.body
        ? { body: new URLSearchParams(req.request.body).toString(), headers: { "content-type": "application/x-www-form-urlencoded" } }
        : {}),
    });
    text = r.text;
    exitCode = r.exitCode;
    stderr = r.errors;
  } catch (e) {
    const resp = (e as { response?: { text: string; exitCode: number; errors: string } }).response;
    if (resp) {
      text = resp.text;
      exitCode = resp.exitCode;
      stderr = resp.errors;
    } else {
      stderr = String(e);
      exitCode = 255;
    }
  }

  let raw: RawResult = {};
  let crashed = false;
  try {
    if (php.fileExists("/tmp/__result.json")) raw = JSON.parse(php.readFileAsText("/tmp/__result.json")) as RawResult;
    else crashed = true;
  } catch {
    raw = {};
    crashed = true;
  }

  // Rebuild full global snapshots from the per-step diffs.
  // The first tick of each file is our own `declare(ticks=1)`: hide it.
  const declLine: Record<string, number> = {};
  for (const [path, content] of Object.entries(req.files)) if (path.endsWith(".php")) declLine[path] = lineOfDeclare(content);
  const seen = new Set<string>();
  const steps: TraceStep[] = [];
  let cur: Record<string, VarValue> = {};
  for (const s of raw.steps ?? []) {
    if (!seen.has(s.f)) {
      seen.add(s.f);
      if (declLine[s.f] === s.l && !s.g) continue;
    }
    if (s.g || s.r) {
      cur = { ...cur, ...(s.g ?? {}) };
      for (const k of s.r ?? []) delete cur[k];
    }
    steps.push({ file: s.f, line: s.l, stack: s.s ?? [], out: s.o ?? 0, globals: cur, changed: Object.keys(s.g ?? {}), args: s.a });
  }

  const problems: Problem[] = (raw.problems ?? []).map((p) => ({
    kind: p.k,
    severity: p.s,
    message: tidy(p.m),
    file: p.f,
    line: p.l,
    at: Math.min(p.o ?? 0, text.length),
    trace: (p.t ?? []).map((f): Frame => ({ fn: f.fn, file: f.f, line: f.l })),
  }));
  if (!problems.some((p) => p.severity === "error") && exitCode === 255) {
    const fatal = parseStderrFatal(stderr);
    if (fatal) problems.push({ ...fatal, at: text.length });
  }
  if (crashed && !problems.some((p) => p.severity === "error")) {
    // The WebAssembly engine itself failed (e.g. Fibers): the caller restarts it.
    problems.push({
      kind: "EngineError",
      severity: "error",
      message: "The in-browser PHP engine crashed while running this script (Fibers are not supported here). It has been restarted.",
      file: null,
      line: null,
      at: text.length,
      trace: [],
    });
  }

  const probes: ProbeResult[] = (req.probes ?? []).map((_, i) => {
    const p = raw.probes?.[i];
    return p ? { ok: p.ok, type: p.t, value: tidy(p.v), json: p.j ?? null, printed: p.p ?? "" } : { ok: false, type: "NotRun", value: "The script stopped before this check could run.", json: null, printed: "" };
  });

  return {
    version: req.version,
    fullVersion: raw.version ?? req.version,
    stdout: text,
    exitCode: problems.some((p) => p.severity === "error") || raw.stopped ? Math.max(exitCode, 255) : exitCode,
    ms: Math.round(performance.now() - t0),
    problems,
    steps,
    ticks: raw.ticks ?? 0,
    stopped: raw.stopped === "steps" ? "steps" : "",
    globals: raw.globals ?? {},
    probes,
    functions: raw.functions ?? [],
    classes: raw.classes ?? [],
    stderr: tidy(stderr),
    crashed,
  };
}
