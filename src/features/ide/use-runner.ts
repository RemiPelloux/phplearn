"use client";

import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import { onRuntimeStatus, runPhp, runtimeStatus } from "@/php/client";
import type { PhpVersion, RunRequest, RunResult } from "@/php/types";
import { isFatal } from "@/php/types";
import { useProgress, type RunInfo } from "@/features/progress/store";

/** Whether a PHP version is downloaded and ready ("idle" | "loading" | "ready"). */
export function useRuntimeStatus(version: PhpVersion) {
  return useSyncExternalStore(
    (cb) => onRuntimeStatus(cb),
    () => runtimeStatus(version),
    () => "idle",
  );
}

/** Run PHP and record it in the learner's progress. */
export function useRunner(where: RunInfo["where"], { trackFixes = true }: { trackFixes?: boolean } = {}) {
  const [running, setRunning] = useState(false);
  const lastFailed = useRef(false);
  const recordRun = useProgress((s) => s.recordRun);
  const run = useCallback(
    async (req: RunRequest): Promise<RunResult> => {
      setRunning(true);
      try {
        const r = await runPhp(req);
        const ok = !isFatal(r) && r.problems.length === 0;
        recordRun({ where, version: req.version, ok, fixed: trackFixes && lastFailed.current });
        lastFailed.current = r.problems.length > 0 || r.stopped !== "";
        return r;
      } finally {
        setRunning(false);
      }
    },
    [recordRun, where, trackFixes],
  );
  return { run, running };
}
