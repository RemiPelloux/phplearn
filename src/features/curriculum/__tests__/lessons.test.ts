/**
 * Plays every lesson on real PHP (WebAssembly, the same builds as the browser):
 *  - each code step's solution passes every objective, and its starter files don't;
 *  - quiz answers match what the code really prints;
 *  - examples, watch and compare code run as expected;
 *  - every learner-facing text exists in English and French.
 * Run one chapter with: npx vitest run src/features/curriculum -t "<chapter id>"
 */
import { describe, expect, it } from "vitest";
import { runNode } from "@/php/node";
import { LATEST, type PhpVersion } from "@/php/types";
import { makeContext } from "../checks";
import { CHAPTERS } from "../index";
import { isCodeStep, type Lesson, type Step } from "../types";

const isTxt = (v: unknown): v is { en: string; fr: string } => !!v && typeof v === "object" && !Array.isArray(v) && "en" in v && "fr" in v && Object.keys(v).length === 2;

function texts(value: unknown, path: string, out: Array<[string, { en: string; fr: string }]>) {
  if (isTxt(value)) out.push([path, value]);
  else if (Array.isArray(value)) value.forEach((v, i) => texts(v, `${path}[${i}]`, out));
  else if (value && typeof value === "object") for (const [k, v] of Object.entries(value)) if (typeof v !== "function") texts(v, `${path}.${k}`, out);
  return out;
}

const run = (code: string, version: PhpVersion = LATEST) => runNode({ version, files: { "index.php": code } });
const fatal = (r: Awaited<ReturnType<typeof run>>) => r.problems.some((p) => p.severity === "error") || r.stopped !== "";

async function checkStep(lesson: Lesson, step: Step, i: number) {
  const where = `${lesson.id} step ${i + 1} (${step.kind})`;
  if (isCodeStep(step)) {
    const version = step.version ?? LATEST;
    expect(step.files["index.php"], `${where}: starter index.php`).toBeDefined();
    expect(step.objectives.length, `${where}: objectives`).toBeGreaterThan(0);
    const good = await runNode({ version, files: step.solution, probes: step.probes, request: step.request });
    const ctx = makeContext(good, step.solution, step.probes);
    for (const o of step.objectives) {
      expect(o.check(ctx), `${where}: solution fails "${o.label.en}"\n--- output ---\n${good.stdout}\n--- problems ---\n${JSON.stringify(good.problems, null, 1)}\n--- probes ---\n${JSON.stringify(good.probes)}`).toBe(true);
    }
    const start = await runNode({ version, files: step.files, probes: step.probes, request: step.request });
    const startCtx = makeContext(start, step.files, step.probes);
    expect(
      step.objectives.every((o) => o.check(startCtx)),
      `${where}: the starter code already passes every objective`,
    ).toBe(false);
  }
  if (step.kind === "quiz") {
    expect(step.answer, `${where}: answer index`).toBeLessThan(step.options.length);
    const answer = step.options[step.answer];
    if (step.code && typeof answer === "string") {
      const r = await run(step.code, step.version);
      expect(r.stdout.trim(), `${where}: the quiz answer doesn't match the real output`).toBe(answer.trim());
    }
  }
  if (step.kind === "watch") {
    const r = await run(step.code, step.version);
    expect(fatal(r), `${where}: watch code fails: ${JSON.stringify(r.problems)}`).toBe(false);
    expect(r.steps.length, `${where}: no steps recorded`).toBeGreaterThan(1);
    for (const line of Object.keys(step.notes ?? {}).map(Number)) {
      expect(r.steps.some((s) => s.line === line), `${where}: a note is attached to line ${line}, which never runs as a step`).toBe(true);
    }
  }
  if (step.kind === "discover") {
    for (const ex of [...(step.example ? [step.example] : []), ...(step.examples ?? [])]) {
      const r = await run(ex.code, ex.version);
      expect(r.stdout.length + r.problems.length, `${where}: example prints nothing`).toBeGreaterThan(0);
    }
  }
  if (step.kind === "compare") {
    expect(step.versions.length).toBeGreaterThan(1);
    const outs = await Promise.all(step.versions.map((v) => run(step.code, v)));
    const shown = outs.map((r) => r.stdout + "|" + r.problems.map((p) => p.kind + p.message).join(","));
    expect(new Set(shown).size, `${where}: every version gives the same result, so there's nothing to compare`).toBeGreaterThan(1);
  }
}

describe.each(CHAPTERS.map((c) => [c.id, c] as const))("%s", (_id, chapter) => {
  it("has lessons", () => {
    expect(chapter.lessons.length).toBeGreaterThan(0);
  });
  for (const lesson of chapter.lessons) {
    describe(lesson.id, () => {
      it("is written in English and French", () => {
        for (const [path, t] of texts(lesson, lesson.id, [])) {
          expect(t.en.trim(), `${path}.en is empty`).not.toBe("");
          expect(t.fr.trim(), `${path}.fr is empty`).not.toBe("");
        }
        expect(lesson.chapterId).toBe(chapter.id);
        expect(lesson.steps.at(-1)?.kind).toBe("celebrate");
      });
      it("can be completed on real PHP", async () => {
        for (const [i, step] of lesson.steps.entries()) await checkStep(lesson, step, i);
      }, 60_000);
    });
  }
});

it("lesson ids are unique", () => {
  const ids = CHAPTERS.flatMap((c) => c.lessons.map((l) => l.id));
  expect(new Set(ids).size).toBe(ids.length);
});
