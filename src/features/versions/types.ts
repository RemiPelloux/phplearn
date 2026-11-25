import type { Txt } from "@/lib/txt";
import type { PhpVersion } from "@/php/types";

/** A PHP release in the /versions timeline. Only 7.4 → 8.5 can run in the app. */
export interface VersionInfo {
  version: "7.0" | "7.1" | "7.2" | "7.3" | "7.4" | "8.0" | "8.1" | "8.2" | "8.3" | "8.4" | "8.5";
  /** YYYY-MM-DD */
  released: string;
  headline: Txt;
  /** Short paragraph: why this release matters. */
  summary: Txt;
  features: VersionFeature[];
  /** Behaviour changes that can break old code. */
  breaking?: VersionFeature[];
  deprecations?: Txt[];
}

export interface VersionFeature {
  id: string;
  title: Txt;
  body: Txt;
  /** How you had to write it before (optional), a complete program. */
  before?: string;
  /** The new way, a complete program that prints something. */
  after: string;
  /**
   * Runnable versions to compare it on (e.g. ["8.0", "8.1"]): the app runs
   * `after` on each and shows the outputs side by side.
   */
  compare?: PhpVersion[];
}
