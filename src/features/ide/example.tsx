"use client";

import { clsx } from "clsx";
import { useState } from "react";
import { Copy, ExternalLink, Loader2, Play, Check } from "lucide-react";
import Link from "next/link";
import { useL } from "@/i18n";
import { phpLine } from "@/php/explain";
import { LATEST, type PhpVersion, type RunResult } from "@/php/types";
import { CodeEditor } from "./code/code-editor";
import { useRunner } from "./use-runner";
import { versionColor } from "./version-picker";

/** Open code in the Playground (it reads ?code= once and keeps it). */
export const playgroundHref = (code: string, version?: PhpVersion) =>
  `/playground?code=${encodeURIComponent(code)}${version ? `&v=${version}` : ""}`;

/**
 * A read-only code sample with Run: used in lessons, docs, the reference
 * and the versions timeline. Editable when `editable` is set.
 */
export function Example({
  code,
  version = LATEST,
  caption,
  editable,
  className,
  autoRun,
  runnable = true,
}: {
  code: string;
  /** False for code fragments: highlighted and copyable, without Run. */
  runnable?: boolean;
  version?: PhpVersion;
  caption?: React.ReactNode;
  editable?: boolean;
  className?: string;
  autoRun?: boolean;
}) {
  const l = useL();
  const { run, running } = useRunner("example");
  const [src, setSrc] = useState(code);
  const [result, setResult] = useState<RunResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [started, setStarted] = useState(false);
  const go = async () => setResult(await run({ version, files: { "index.php": src } }));
  if (autoRun && !started) {
    setStarted(true);
    queueMicrotask(go);
  }
  const lines = src.split("\n").length;
  return (
    <figure className={clsx("overflow-hidden rounded-lg border border-line bg-[var(--editor-bg)] shadow-[var(--shadow-card)]", className)}>
      <div className="flex items-center gap-2 border-b border-line bg-[var(--editor-tabbar)] px-2 py-1">
        <span className="flex items-center gap-1.5 px-1 font-mono text-[11px] text-fg-3">
          <span className="size-1.5 rounded-full" style={{ background: versionColor(version) }} aria-hidden />
          {runnable ? `PHP ${version}` : "php"}
        </span>
        <span className="ml-auto flex items-center gap-0.5">
          <button
            onClick={() => {
              void navigator.clipboard?.writeText(src);
              setCopied(true);
              setTimeout(() => setCopied(false), 1200);
            }}
            className="grid size-7 place-items-center rounded text-fg-3 hover:bg-surface-2 hover:text-fg"
            aria-label={l("Copy code", "Copier le code")}
            title={l("Copy", "Copier")}
          >
            {copied ? <Check className="size-3.5 text-ok" /> : <Copy className="size-3.5" />}
          </button>
          <Link
            href={playgroundHref(runnable ? src : `<?php\n${src}`, version)}
            className="grid size-7 place-items-center rounded text-fg-3 hover:bg-surface-2 hover:text-fg"
            aria-label={l("Open in the Playground", "Ouvrir dans le bac à sable")}
            title={l("Open in the Playground", "Ouvrir dans le bac à sable")}
          >
            <ExternalLink className="size-3.5" />
          </Link>
          {runnable && <button
            onClick={go}
            disabled={running}
            className="ml-1 flex h-7 items-center gap-1 rounded-md bg-ok px-2.5 text-xs font-semibold text-[var(--on-ok)] shadow-[0_2px_0_color-mix(in_oklab,var(--ok)_60%,black)] hover:brightness-110 active:translate-y-[2px] active:shadow-none disabled:opacity-70"
          >
            {running ? <Loader2 className="size-3 animate-spin" /> : <Play className="size-3 fill-current" />} {l("Run", "Exécuter")}
          </button>}
        </span>
      </div>
      <div style={{ height: Math.min(26 * 14, lines * 22.5 + 22) }} className="[--editor-font:13px]">
        <CodeEditor value={src} lang={runnable ? "php" : "php-plain"} onChange={editable && runnable ? setSrc : undefined} readOnly={!editable || !runnable} ariaLabel={l("Example code", "Code d'exemple")} compact onRun={runnable ? go : undefined} />
      </div>
      {result && (
        <pre className="terminal scrollbar-thin max-h-60 overflow-auto border-t border-line bg-term px-4 py-2.5 font-mono text-[12.5px] leading-relaxed whitespace-pre-wrap">
          {result.stdout}
          {result.problems.map((p, i) => (
            <span key={i} className={clsx("block", p.severity === "error" ? "text-[var(--t-red)]" : "text-[var(--t-yellow)]")}>
              {phpLine(p)}
            </span>
          ))}
          {!result.stdout && !result.problems.length && <span className="text-[var(--t-muted)] italic">{l("(no output)", "(aucune sortie)")}</span>}
        </pre>
      )}
      {caption && <figcaption className="border-t border-line bg-surface px-3 py-1.5 text-xs text-fg-2">{caption}</figcaption>}
    </figure>
  );
}
