import { expect, it } from "vitest";
import { runNode } from "../node";

it("recovers after the engine crashes (Fibers)", async () => {
  const crash = await runNode({ version: "8.5", files: { "index.php": `<?php\n$f = new Fiber(function () { $x = Fiber::suspend(1); echo "got $x"; });\n$v = $f->start();\n$f->resume(2);\n` } });
  expect(crash.crashed).toBe(true);
  expect(crash.problems[0].kind).toBe("EngineError");
  const after = await runNode({ version: "8.5", files: { "index.php": `<?php echo "alive";` } });
  expect(after.stdout).toBe("alive");
});
