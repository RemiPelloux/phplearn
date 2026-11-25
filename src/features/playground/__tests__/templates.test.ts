import { describe, expect, it } from "vitest";
import { runNode } from "@/php/node";
import { LATEST } from "@/php/types";
import { TEMPLATES } from "../templates";

describe("playground templates", () => {
  for (const t of TEMPLATES)
    it(`${t.id} runs cleanly`, async () => {
      const r = await runNode({ version: t.version ?? LATEST, files: t.files, request: t.request });
      expect(r.problems, JSON.stringify(r.problems)).toEqual([]);
      expect(r.stdout.length).toBeGreaterThan(0);
    });
});
