/**
 * Runs every reference example and every version-timeline example on real PHP.
 * Examples must run without a fatal error (or warning) and print something;
 * each `compare` must give different results across its versions.
 */
import { describe, expect, it } from "vitest";
import { runNode } from "@/php/node";
import type { PhpVersion, RunResult } from "@/php/types";
import { REF_CATEGORIES, REFERENCE } from "../data";
import { VERSIONS_TIMELINE } from "@/features/versions/data";

const run = (code: string, version: PhpVersion = "8.5") => runNode({ version, files: { "index.php": code } });
const summary = (r: RunResult) => r.problems.map((p) => `${p.kind}: ${p.message} (line ${p.line})`).join("\n");
const fatal = (r: RunResult) => r.problems.some((p) => p.severity === "error") || r.stopped !== "";

describe("reference", () => {
  it("has unique names and known categories", () => {
    const names = REFERENCE.map((r) => r.name);
    expect(new Set(names).size).toBe(names.length);
    const cats = new Set(REF_CATEGORIES.map((c) => c.id));
    for (const r of REFERENCE) expect(cats.has(r.category), r.name).toBe(true);
    for (const r of REFERENCE) expect(r.summary.en && r.summary.fr, r.name).toBeTruthy();
  });
  it.each(REFERENCE.map((r) => [r.name, r] as const))("%s runs", async (_n, entry) => {
    const r = await run(entry.example, entry.version);
    expect(fatal(r), `${entry.name}:\n${summary(r)}\n${r.stdout}`).toBe(false);
    expect(r.stdout.trim().length, `${entry.name}: prints nothing`).toBeGreaterThan(0);
    // Deprecation notices are allowed only where the example is about them.
    const unexpected = r.problems.filter((p) => !(entry.name === "trigger_error" && p.kind === "Deprecated"));
    expect(unexpected, `${entry.name}:\n${summary(r)}`).toEqual([]);
  });
});

describe("versions timeline", () => {
  it("is ordered and complete", () => {
    expect(VERSIONS_TIMELINE.map((v) => v.version)).toEqual(["7.0", "7.1", "7.2", "7.3", "7.4", "8.0", "8.1", "8.2", "8.3", "8.4", "8.5"]);
    for (const v of VERSIONS_TIMELINE) expect(v.released).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
  const features = VERSIONS_TIMELINE.flatMap((v) => [
    ...v.features.map((f) => [`${v.version} ${f.id}`, v.version, f, false] as const),
    ...(v.breaking ?? []).map((f) => [`${v.version} breaking ${f.id}`, v.version, f, true] as const),
  ]);
  it.each(features)("%s", async (_label, version, f, breaking) => {
    const runnable = ["7.4", "8.0", "8.1", "8.2", "8.3", "8.4", "8.5"].includes(version);
    const target = (runnable ? version : "7.4") as PhpVersion;
    const r = await run(f.after, f.compare ? f.compare[f.compare.length - 1] : target);
    expect(r.stdout.trim().length + r.problems.length, `${f.id}: no output`).toBeGreaterThan(0);
    if (!f.compare && !breaking) expect(fatal(r), `${f.id}:\n${summary(r)}`).toBe(false);
    if (f.before) {
      const b = await run(f.before, f.compare ? f.compare[0] : target);
      expect(b.stdout.trim().length + b.problems.length, `${f.id}: before prints nothing`).toBeGreaterThan(0);
    }
    if (f.compare) {
      const outs = await Promise.all(f.compare.map((v) => run(f.after, v)));
      const shown = outs.map((o) => o.stdout + "|" + o.problems.map((p) => p.kind + p.message).join(","));
      expect(new Set(shown).size, `${f.id}: same result on ${f.compare.join(", ")}:\n${shown[0]}`).toBeGreaterThan(1);
      const last = outs[outs.length - 1];
      if (!breaking) expect(fatal(last), `${f.id} on ${f.compare.at(-1)}:\n${summary(last)}`).toBe(false);
    }
  });
});
