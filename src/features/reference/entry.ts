import { L } from "@/lib/txt";
import type { RefCategory, RefEntry } from "./types";

/** Compact authoring helper for reference entries. */
export function e(
  name: string,
  category: RefCategory,
  signature: string,
  en: string,
  fr: string,
  example: string,
  extra: Partial<Omit<RefEntry, "name" | "category" | "signature" | "summary" | "example">> & { noteEn?: string; noteFr?: string } = {},
): RefEntry {
  const { noteEn, noteFr, ...rest } = extra;
  return {
    name,
    category,
    signature,
    summary: L(en, fr),
    example: example.startsWith("<?php") ? example : `<?php\n${example}`,
    ...(noteEn && noteFr ? { note: L(noteEn, noteFr) } : {}),
    ...rest,
  };
}
