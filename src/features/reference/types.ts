import type { Txt } from "@/lib/txt";
import type { PhpVersion } from "@/php/types";

export type RefCategory = "language" | "strings" | "arrays" | "math" | "types" | "output" | "functions" | "classes" | "dates" | "json" | "regex" | "files" | "errors";

/** One function or language construct in the /reference page. */
export interface RefEntry {
  /** e.g. "str_contains", "match", "array_map" */
  name: string;
  category: RefCategory;
  /** e.g. "str_contains(string $haystack, string $needle): bool" */
  signature: string;
  summary: Txt;
  /** A complete runnable PHP program (starts with <?php) that prints something meaningful. */
  example: string;
  /** First PHP version that has it, when 7.0 or later (e.g. "8.0"). */
  since?: string;
  /** Run the example on this version (default: latest). */
  version?: PhpVersion;
  /** Gotchas, in one or two sentences. */
  note?: Txt;
  seeAlso?: string[];
}
