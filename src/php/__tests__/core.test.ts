import { describe, expect, it } from "vitest";
import { instrument } from "../core";
import { runNode } from "../node";

describe("instrument", () => {
  it("keeps strict_types first and lines unchanged", () => {
    const code = "<?php\ndeclare(strict_types=1);\necho 1;";
    const out = instrument(code);
    expect(out).toBe("<?php\ndeclare(strict_types=1); declare(ticks=1);\necho 1;");
    expect(instrument("<?php\necho 1;")).toBe("<?php declare(ticks=1);\necho 1;");
  });
});

describe("runner", () => {
  it("runs code, traces steps and reports problems", async () => {
    const r = await runNode({
      version: "8.5",
      files: { "index.php": `<?php\nfunction add(int $a, int $b): int {\n  $s = $a + $b;\n  return $s;\n}\n$x = add(2, 3);\necho "x = $x\\n";\necho $nope;\n` },
      probes: ["add(10, 5)", "add('a', 1)"],
    });
    expect(r.stdout).toBe("x = 5\n");
    expect(r.fullVersion).toMatch(/^8\.5/);
    expect(r.steps.map((s) => s.line)).toEqual([3, 6, 7, 8]);
    expect(r.steps[0].stack).toEqual(["add"]);
    expect(r.steps[0].args).toEqual({ a: ["int", "2"], b: ["int", "3"] });
    expect(r.steps[1].globals.x).toEqual(["int", "5"]);
    expect(r.problems[0]).toMatchObject({ kind: "Warning", line: 8, severity: "warning" });
    expect(r.problems[0].message).toContain("Undefined variable $nope");
    expect(r.probes[0]).toMatchObject({ ok: true, value: "15", json: "15" });
    expect(r.probes[1]).toMatchObject({ ok: false, type: "TypeError" });
    expect(r.functions).toEqual(["add"]);
  });

  it("shows real version differences", async () => {
    const code = `<?php\nvar_dump(0 == "a");\n`;
    const old = await runNode({ version: "7.4", files: { "index.php": code } });
    const now = await runNode({ version: "8.0", files: { "index.php": code } });
    expect(old.stdout.trim()).toBe("bool(true)");
    expect(now.stdout.trim()).toBe("bool(false)");
  });

  it("reports uncaught exceptions with a stack trace", async () => {
    const r = await runNode({
      version: "8.4",
      files: { "index.php": `<?php\nfunction divide($a, $b) {\n  return intdiv($a, $b);\n}\nfunction run() { return divide(1, 0); }\necho "start\\n";\nrun();\necho "never";` },
    });
    expect(r.stdout).toBe("start\n");
    const p = r.problems[0];
    expect(p.kind).toBe("DivisionByZeroError");
    expect(p.line).toBe(3);
    expect(p.trace.map((f) => f.fn)).toEqual(["intdiv", "divide", "run"]);
    expect(r.exitCode).toBe(255);
  });

  it("reports parse errors and stops endless loops", async () => {
    const parse = await runNode({ version: "8.5", files: { "index.php": `<?php\necho "a"\necho "b";` } });
    expect(parse.problems[0].kind).toBe("ParseError");
    expect(parse.problems[0].line).toBe(3);
    const loop = await runNode({ version: "8.5", files: { "index.php": `<?php\nwhile (true) { $i = 1; }` } });
    expect(loop.stopped).toBe("steps");
  });

  it("supports several files, strict types and web requests", async () => {
    const r = await runNode({
      version: "8.3",
      files: {
        "index.php": `<?php\ndeclare(strict_types=1);\nrequire __DIR__ . '/src/Greeter.php';\n$g = new App\\Greeter();\necho $g->hi($_GET['name'] ?? 'nobody');`,
        "src/Greeter.php": `<?php\nnamespace App;\nclass Greeter {\n  public function hi(string $n): string {\n    $s = "Hi $n";\n    return $s;\n  }\n}`,
      },
      request: { query: { name: "Ada" } },
    });
    expect(r.stdout).toBe("Hi Ada");
    expect(r.classes).toEqual(["App\\Greeter"]);
    expect(r.steps.some((s) => s.file === "src/Greeter.php" && s.stack[0] === "App\\Greeter->hi")).toBe(true);
  });
});
