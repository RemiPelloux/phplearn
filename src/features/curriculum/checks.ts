/**
 * Building blocks for objectives. Checks look at the real result of running
 * the learner's code (output, errors, probes) and, sometimes, at the code itself.
 */
import type { ProbeResult, RunResult } from "@/php/types";
import type { Check, CheckContext, Files } from "./types";

/** Remove comments and string contents so a check doesn't match words inside them. */
export function stripComments(code: string): string {
  let out = "";
  let i = 0;
  while (i < code.length) {
    const two = code.slice(i, i + 2);
    if (two === "/*") {
      const end = code.indexOf("*/", i + 2);
      const chunk = code.slice(i, end < 0 ? code.length : end + 2);
      out += chunk.replace(/[^\n]/g, " ");
      i += chunk.length;
    } else if (two === "//" || code[i] === "#" && code[i + 1] !== "[") {
      const end = code.indexOf("\n", i);
      i = end < 0 ? code.length : end;
    } else if (code[i] === "'" || code[i] === '"') {
      const q = code[i];
      let j = i + 1;
      while (j < code.length && code[j] !== q) j += code[j] === "\\" ? 2 : 1;
      out += code.slice(i, j + 1);
      i = j + 1;
    } else {
      out += code[i++];
    }
  }
  return out;
}

export function makeContext(r: RunResult, files: Files, probes: string[] = []): CheckContext {
  const php = Object.entries(files).filter(([p]) => p.endsWith(".php"));
  return {
    r,
    files,
    code: stripComments(files["index.php"] ?? ""),
    allCode: php.map(([, c]) => stripComments(c)).join("\n"),
    out: r.stdout,
    probe: (expr: string): ProbeResult => {
      const i = probes.indexOf(expr);
      if (i < 0) throw new Error(`Probe "${expr}" is not declared on this step.`);
      return r.probes[i] ?? { ok: false, type: "NotRun", value: "", json: null, printed: "" };
    },
    clean: r.problems.length === 0 && !r.stopped,
    ran: !r.problems.some((p) => p.severity === "error") && !r.stopped,
  };
}

const norm = (s: string) => s.replace(/\r\n/g, "\n").replace(/[ \t]+\n/g, "\n").trim();

/** The output, trimmed, is exactly this. */
export const outputIs = (expected: string): Check => (c) => norm(c.out) === norm(expected);
/** The output contains this text (or matches this pattern). */
export const outputHas = (expected: string | RegExp): Check => (c) => (typeof expected === "string" ? c.out.includes(expected) : expected.test(c.out));
/** The output has these lines, in this order (other lines may be in between). */
export const outputLines = (lines: string[]): Check => (c) => {
  const got = norm(c.out).split("\n").map((l) => l.trim());
  let k = 0;
  for (const l of got) if (k < lines.length && l === lines[k]) k++;
  return k === lines.length;
};
/** index.php uses this construct (comments ignored). */
export const uses = (pattern: RegExp): Check => (c) => pattern.test(c.code);
/** Any PHP file uses this construct. */
export const usesAnywhere = (pattern: RegExp): Check => (c) => pattern.test(c.allCode);
export const avoids = (pattern: RegExp): Check => (c) => !pattern.test(c.code);
/** The script ran without any warning, notice, deprecation or error. */
export const clean: Check = (c) => c.clean;
/** The script ran without a fatal error. */
export const ran: Check = (c) => c.ran;
/** A probe returns exactly this JSON value (compares types too: 5 is not "5"). */
export const probeIs = (expr: string, value: unknown): Check => (c) => {
  const p = c.probe(expr);
  return p.ok && p.json !== null && p.json === JSON.stringify(value);
};
/** A probe returns this readable value (as shown in the Variables panel). */
export const probeShows = (expr: string, shown: string): Check => (c) => {
  const p = c.probe(expr);
  return p.ok && p.value === shown;
};
/** A probe throws this exception class. */
export const probeThrows = (expr: string, kind: string): Check => (c) => {
  const p = c.probe(expr);
  return !p.ok && p.type === kind;
};
/** A global variable ends with this value, e.g. globalIs("total", "int", "42"). */
export const globalIs = (name: string, type: string, value?: string): Check => (c) => {
  const v = c.r.globals[name];
  return !!v && v[0] === type && (value === undefined || v[1] === value);
};
export const definesFunction = (name: string): Check => (c) => c.r.functions.map((f) => f.toLowerCase()).includes(name.toLowerCase());
export const definesClass = (name: string): Check => (c) => c.r.classes.some((k) => k.toLowerCase() === name.toLowerCase() || k.toLowerCase().endsWith("\\" + name.toLowerCase()));
/** There is a problem of this kind (e.g. "TypeError", "Warning"). */
export const hasProblem = (kind: string): Check => (c) => c.r.problems.some((p) => p.kind === kind);
export const all = (...checks: Check[]): Check => (c) => checks.every((k) => k(c));
export const any = (...checks: Check[]): Check => (c) => checks.some((k) => k(c));
export const not = (check: Check): Check => (c) => !check(c);
