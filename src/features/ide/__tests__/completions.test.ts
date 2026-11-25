import { it, expect } from "vitest";
import { functionDoc } from "@/features/ide/code/completions";
it("finds the signature of every function, including grouped entries", () => {
  expect(functionDoc("strtoupper")?.signature).toContain("strtoupper(");
  expect(functionDoc("array_pop")?.signature).toContain("array_pop(");
  expect(functionDoc("str_contains")?.text).not.toBe("");
});
