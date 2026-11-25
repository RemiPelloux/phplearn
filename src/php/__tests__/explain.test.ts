import { expect, it } from "vitest";
import { explain } from "../explain";
import type { Problem } from "../types";

const p = (kind: string, message: string): Problem => ({ kind, severity: "error", message, file: "index.php", line: 3, at: 0, trace: [] });

it("explains common errors in plain words", () => {
  expect(explain(p("ParseError", 'syntax error, unexpected token "echo", expecting "," or ";"'))?.what.en).toContain('it was waiting for "," or ";"');
  expect(explain(p("Warning", "Undefined variable $total"))?.what.en).toContain("$total");
  expect(explain(p("TypeError", 'add(): Argument #1 ($a) must be of type int, string given, called in index.php on line 5'))?.what.en).toContain("must be int");
  expect(explain(p("DivisionByZeroError", "Division by zero"))).not.toBeNull();
  expect(explain(p("LogicException", "Something odd"))?.what.en).toContain("LogicException");
});
