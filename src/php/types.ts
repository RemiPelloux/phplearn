/** PHP versions the app can run (all real interpreters compiled to WebAssembly). */
export const PHP_VERSIONS = ["7.4", "8.0", "8.1", "8.2", "8.3", "8.4", "8.5"] as const;
export type PhpVersion = (typeof PHP_VERSIONS)[number];
export const LATEST: PhpVersion = "8.5";

export type Severity = "error" | "warning" | "notice" | "deprecated";

export interface Frame {
  /** Function, e.g. "divide" or "Cart->total" */
  fn: string;
  /** User file (relative), or null for PHP internals */
  file: string | null;
  line: number | null;
}

export interface Problem {
  /** "Warning", "TypeError", "Parse error", "DivisionByZeroError"… */
  kind: string;
  severity: Severity;
  message: string;
  file: string | null;
  line: number | null;
  /** Output length when it happened, to show it at the right place. */
  at: number;
  trace: Frame[];
}

/** [type, readable value] */
export type VarValue = [string, string];

export interface TraceStep {
  file: string;
  line: number;
  /** Innermost call first, e.g. ["add", "main"]; empty at the top level. */
  stack: string[];
  /** Output length after this statement. */
  out: number;
  /** Global variables after this statement (full snapshot, rebuilt from diffs). */
  globals: Record<string, VarValue>;
  /** Names of globals that changed at this step. */
  changed: string[];
  /** Arguments of the current function, and $this. */
  args?: Record<string, VarValue>;
}

export interface ProbeResult {
  ok: boolean;
  /** Type of the value, or the exception class. */
  type: string;
  /** Readable value, or the exception message. */
  value: string;
  /** JSON of scalars and arrays, to compare exactly. */
  json: string | null;
  /** Anything the expression printed. */
  printed: string;
}

export interface RunRequest {
  version: PhpVersion;
  /** Relative paths (e.g. "index.php", "src/User.php") to contents. */
  files: Record<string, string>;
  entry?: string;
  /** PHP expressions evaluated after the script, e.g. "add(2, 3)". */
  probes?: string[];
  /** Simulate a web request: $_GET, $_POST, method. */
  request?: { method?: "GET" | "POST"; query?: Record<string, string>; body?: Record<string, string> };
}

export interface RunResult {
  version: PhpVersion;
  /** e.g. "8.5.12" */
  fullVersion: string;
  stdout: string;
  exitCode: number;
  ms: number;
  problems: Problem[];
  steps: TraceStep[];
  /** Statements executed (may exceed the recorded steps). */
  ticks: number;
  /** "steps" when the step limit stopped an endless loop, "time" on timeout. */
  stopped: "" | "steps" | "time";
  globals: Record<string, VarValue>;
  probes: ProbeResult[];
  functions: string[];
  classes: string[];
  /** Raw stderr from the engine (rarely useful). */
  stderr: string;
  /** The engine failed and must be restarted before the next run. */
  crashed?: boolean;
}

export const isFatal = (r: RunResult) => r.problems.some((p) => p.severity === "error") || r.stopped !== "";
