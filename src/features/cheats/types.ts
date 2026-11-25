import type { Txt } from "@/lib/txt";

/**
 * A one-screen syntax summary. Lessons show one next to the editor
 * (`cheat: "<key>"` on a code step) and /docs prints them all.
 */
export interface CheatSheet {
  key: CheatKey;
  title: Txt;
  intro?: Txt;
  sections: Array<{
    title: Txt;
    /** `code` is PHP shown as written (never translated); `note` explains it. */
    rows: Array<{ code: string; note: Txt }>;
  }>;
}

export const CHEAT_KEYS = [
  "basics", "types", "strings", "control", "loops", "arrays", "array-functions", "functions", "closures",
  "string-functions", "regex", "dates", "json", "oop", "inheritance", "interfaces-traits", "enums",
  "errors", "exceptions", "null-safety", "debugging", "namespaces", "generators", "attributes",
  "web", "security", "pdo", "testing", "php7", "php80", "php81", "php82", "php83", "php84", "php85",
] as const;
export type CheatKey = (typeof CHEAT_KEYS)[number];
