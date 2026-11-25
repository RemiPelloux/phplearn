"use client";

import { clsx } from "clsx";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CircleAlert, Columns2, Loader2, Play, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useL } from "@/i18n";
import { phpLine } from "@/php/explain";
import type { PhpVersion, RunRequest, RunResult } from "@/php/types";
import { useProgress } from "@/features/progress/store";
import { useRunner } from "./use-runner";
import { versionColor } from "./version-picker";

/** What a version printed, as one comparable string. */
export const signature = (r: RunResult) => r.stdout + "\u0000" + r.problems.map((p) => `${p.kind}:${p.message}`).join("|");

/**
 * Run the same project on several PHP versions, one after the other,
 * and show the outputs side by side. Results that differ from the newest
 * version are flagged.
 */
export function CompareRunner({
  files,
  versions,
  probes,
  request,
  autoStart,
  onDone,
  className,
}: {
  files: Record<string, string>;
  versions: PhpVersion[];
  probes?: string[];
  request?: RunRequest["request"];
  autoStart?: boolean;
  onDone?: (results: RunResult[]) => void;
  className?: string;
}) {
  const l = useL();
  // Different versions failing and passing is the point here, not a "fix".
  const { run } = useRunner("example", { trackFixes: false });
  const unlock = useProgress((s) => s.unlock);
  const [results, setResults] = useState<Partial<Record<PhpVersion, RunResult>>>({});
  const [current, setCurrent] = useState<PhpVersion | null>(null);
  const started = useRef(false);
  const go = useCallback(async () => {
    setResults({});
    const all: RunResult[] = [];
    for (const v of versions) {
      setCurrent(v);
      const r = await run({ version: v, files, probes, request });
      all.push(r);
      setResults((x) => ({ ...x, [v]: r }));
    }
    setCurrent(null);
    unlock("comparer");
    onDone?.(all);
  }, [versions, files, probes, request, run, unlock, onDone]);
  useEffect(() => {
    if (autoStart && !started.current) {
      started.current = true;
      void go();
    }
  }, [autoStart, go]);

  const newest = versions[versions.length - 1];
  const ref = results[newest];
  const busy = current !== null;
  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm" onClick={go} disabled={busy} data-nudge={!busy && !Object.keys(results).length}>
          {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Columns2 className="size-3.5" />}
          {busy ? l(`Running on PHP ${current}…`, `Exécution sur PHP ${current}…`) : Object.keys(results).length ? l("Run again", "Relancer") : l(`Run on ${versions.length} versions`, `Exécuter sur ${versions.length} versions`)}
        </Button>
        <p className="text-xs text-fg-3">
          {l("Each version is a real PHP interpreter, downloaded once.", "Chaque version est un vrai interpréteur PHP, téléchargé une fois.")}
        </p>
      </div>
      <div className={clsx("mt-3 grid gap-3", versions.length > 2 ? "sm:grid-cols-2 xl:grid-cols-3" : "sm:grid-cols-2")}>
        {versions.map((v) => {
          const r = results[v];
          const differs = r && ref && v !== newest && signature(r) !== signature(ref);
          return (
            <motion.div
              key={v}
              layout
              className={clsx("flex min-w-0 flex-col overflow-hidden rounded-lg border", differs ? "border-warn/60" : "border-line")}
            >
              <div className="flex items-center gap-2 border-b border-line bg-surface px-3 py-1.5">
                <span className="size-2 rounded-full" style={{ background: versionColor(v) }} aria-hidden />
                <span className="font-mono text-xs font-semibold">PHP {r?.fullVersion ?? v}</span>
                {differs && <span className="rounded-full bg-warn-soft px-1.5 text-[10px] font-semibold text-warn">{l("different", "différent")}</span>}
                {r && <span className="ml-auto text-[10px] text-fg-3">{r.ms} ms</span>}
              </div>
              <pre className="terminal scrollbar-thin max-h-56 min-h-20 flex-1 overflow-auto bg-term px-3 py-2 font-mono text-[12px] leading-relaxed whitespace-pre-wrap">
                {!r ? (
                  <span className="flex items-center gap-1.5 text-[var(--t-muted)]">
                    {current === v ? <Loader2 className="size-3 animate-spin" /> : <Play className="size-3" />}
                    {current === v ? l("running…", "exécution…") : l("waiting", "en attente")}
                  </span>
                ) : (
                  <>
                    {r.stdout}
                    {r.problems.map((p, i) => (
                      <span key={i} className={clsx("mt-1 block", p.severity === "error" ? "text-[var(--t-red)]" : "text-[var(--t-yellow)]")}>
                        {p.severity === "error" ? <CircleAlert className="mr-1 inline size-3" /> : <TriangleAlert className="mr-1 inline size-3" />}
                        {phpLine(p)}
                      </span>
                    ))}
                    {!r.stdout && !r.problems.length && <span className="text-[var(--t-muted)] italic">{l("(no output)", "(aucune sortie)")}</span>}
                  </>
                )}
              </pre>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
