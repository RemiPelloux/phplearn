import type { Txt } from "@/lib/txt";
import type { PhpVersion, ProbeResult, RunResult } from "@/php/types";

export type Tier = "beginner" | "intermediate" | "advanced" | "expert";

/** A project: relative path → contents. The entry file is always index.php. */
export type Files = Record<string, string>;

/** What a check can look at: the last run, and the code that produced it. */
export interface CheckContext {
  r: RunResult;
  files: Files;
  /** index.php without comments, to look for a construct (e.g. `match`). */
  code: string;
  /** All PHP files without comments, joined. */
  allCode: string;
  out: string;
  /** Result of a probe declared on the step (throws if it wasn't declared). */
  probe: (expr: string) => ProbeResult;
  /** No error, warning or notice. */
  clean: boolean;
  /** No fatal error. */
  ran: boolean;
}

export type Check = (c: CheckContext) => boolean;

export interface Objective {
  id: string;
  label: Txt;
  check: Check;
  /** Three-level hints: the idea → the syntax → the full walkthrough. */
  hints: [Txt, Txt, Txt];
}

/** A short code sample, shown read-only with a Run button. */
export interface Example {
  code: string;
  caption?: Txt;
  version?: PhpVersion;
}

export type Callout = { tone: "tip" | "warn" | "version" | "info"; text: Txt };

/** Read: a short explanation, with optional examples you can run. */
export interface DiscoverStep {
  kind: "discover";
  title: Txt;
  /** Paragraphs. Supports `code`, **bold** and *italic*. */
  body: Txt[];
  example?: Example;
  examples?: Example[];
  callout?: Callout;
  scene?: SceneId;
}

/** Watch: run a program step by step and watch the variables change. */
export interface WatchStep {
  kind: "watch";
  title: Txt;
  body: Txt;
  code: string;
  version?: PhpVersion;
  /** Notes shown when execution reaches a line (1-based). */
  notes?: Record<number, Txt>;
}

/** Predict: what does this code print? */
export interface QuizStep {
  kind: "quiz";
  title: Txt;
  question: Txt;
  code?: string;
  version?: PhpVersion;
  /** Options are shown as code when they look like output. */
  options: Array<string | Txt>;
  answer: number;
  explain: Txt;
}

/** Same code, several PHP versions, outputs side by side. */
export interface CompareStep {
  kind: "compare";
  title: Txt;
  body: Txt;
  code: string;
  versions: PhpVersion[];
  /** Shown after the comparison ran. */
  takeaway: Txt;
}

interface CodeStepBase {
  title: Txt;
  body: Txt;
  /** Starting files (index.php at least). */
  files: Files;
  /** A correct solution; the test suite runs it and expects every objective to pass. */
  solution: Files;
  /** PHP expressions evaluated after the script (e.g. "add(2, 3)"), for checks. */
  probes?: string[];
  version?: PhpVersion;
  /** Simulated web request ($_GET / $_POST). */
  request?: { method?: "GET" | "POST"; query?: Record<string, string>; body?: Record<string, string> };
  objectives: Objective[];
  /** Key of a cheat sheet shown next to the editor (see cheats.ts). */
  cheat?: string;
}

/** Try: a guided exercise, usually one or two objectives. */
export interface TryStep extends CodeStepBase {
  kind: "try";
}

/** Challenge: several objectives, on your own, with free hints. */
export interface ChallengeStep extends CodeStepBase {
  kind: "challenge";
}

export interface CelebrateStep {
  kind: "celebrate";
}

export type Step = DiscoverStep | WatchStep | QuizStep | CompareStep | TryStep | ChallengeStep | CelebrateStep;
export type CodeStep = TryStep | ChallengeStep;
export const isCodeStep = (s: Step): s is CodeStep => s.kind === "try" || s.kind === "challenge";

export type SceneId = "request" | "variables" | "types" | "array" | "loop" | "function" | "scope" | "class" | "inheritance" | "exception" | "timeline" | "compile";

export interface Lesson {
  id: string;
  chapterId: string;
  title: Txt;
  tagline: Txt;
  xp: number;
  boss?: boolean;
  /** Short list of the PHP constructs practised (shown on completion), e.g. "echo", "match". */
  syntax: string[];
  steps: Step[];
  /** Plain-language recap shown on completion. */
  recap: Txt[];
  /** Slug of the docs page that explains this topic further. */
  doc?: string;
}

export interface Chapter {
  id: string;
  number: number;
  title: Txt;
  tier: Tier;
  description: Txt;
  lessons: Lesson[];
}
