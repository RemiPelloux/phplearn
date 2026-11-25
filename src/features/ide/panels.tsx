"use client";

import { clsx } from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, ChevronDown, ChevronRight, CircleAlert, Code2, Eye, Info, Lightbulb, Pause, Play, SkipBack, SkipForward, StepBack, StepForward } from "lucide-react";
import { useL, usePick } from "@/i18n";
import { explain, phpLine } from "@/php/explain";
import type { Problem, RunResult, TraceStep, VarValue } from "@/php/types";

const sevIcon = (p: Problem, cls = "size-3.5") =>
  p.severity === "error" ? <CircleAlert className={clsx(cls, "text-bad")} aria-hidden /> : p.severity === "deprecated" ? <Info className={clsx(cls, "text-warn")} aria-hidden /> : <AlertTriangle className={clsx(cls, "text-warn")} aria-hidden />;

/** Stdout with PHP's messages shown where they happened, like a terminal. */
export function OutputPanel({ result, upTo }: { result: RunResult | null; upTo?: number | null }) {
  const l = useL();
  const [html, setHtml] = useState(false);
  if (!result) return <Empty text={l("Press Run (Ctrl+Enter) to execute your code. What it prints shows up here.", "Appuie sur Exécuter (Ctrl+Entrée) pour lancer ton code. Ce qu'il affiche apparaît ici.")} />;
  const out = upTo == null ? result.stdout : result.stdout.slice(0, upTo);
  const looksHtml = /<\/?(p|div|h[1-6]|ul|li|table|form|strong|em|br|a|span|input|label|button)\b/i.test(result.stdout);
  const shown = upTo == null ? result.problems : [];
  // Interleave problems at the output offset where they happened.
  const pieces: Array<{ text: string } | { problem: Problem }> = [];
  let at = 0;
  for (const p of [...shown].sort((a, b) => a.at - b.at)) {
    if (p.at > at) pieces.push({ text: out.slice(at, p.at) });
    pieces.push({ problem: p });
    at = Math.max(at, p.at);
  }
  if (at < out.length) pieces.push({ text: out.slice(at) });
  return (
    <div className="flex h-full min-h-0 flex-col">
      {looksHtml && upTo == null && (
        <div className="flex shrink-0 items-center gap-1 border-b border-white/10 px-3 py-1 text-[11px]">
          <button onClick={() => setHtml(false)} className={clsx("flex items-center gap-1 rounded px-2 py-0.5", !html ? "bg-white/10 text-white" : "text-[var(--t-muted)] hover:text-white")}>
            <Code2 className="size-3" /> {l("Source", "Source")}
          </button>
          <button onClick={() => setHtml(true)} className={clsx("flex items-center gap-1 rounded px-2 py-0.5", html ? "bg-white/10 text-white" : "text-[var(--t-muted)] hover:text-white")}>
            <Eye className="size-3" /> {l("Rendered HTML", "HTML rendu")}
          </button>
        </div>
      )}
      {html && looksHtml && upTo == null ? (
        <iframe title={l("Rendered output", "Sortie rendue")} sandbox="" srcDoc={result.stdout} className="min-h-0 flex-1 bg-white" />
      ) : (
        <pre className="terminal scrollbar-thin min-h-0 flex-1 overflow-auto px-4 py-3 font-mono text-[13px] leading-relaxed whitespace-pre-wrap">
          {pieces.map((p, i) =>
            "text" in p ? (
              <span key={i}>{p.text}</span>
            ) : (
              <span key={i} className={clsx("block", p.problem.severity === "error" ? "text-[var(--t-red)]" : "text-[var(--t-yellow)]")}>
                {(i > 0 && "text" in pieces[i - 1] && !(pieces[i - 1] as { text: string }).text.endsWith("\n") ? "\n" : "") + phpLine(p.problem)}
              </span>
            ),
          )}
          {!out && !shown.length && <span className="text-[var(--t-muted)] italic">{l("(no output)", "(aucune sortie)")}</span>}
          {upTo == null && (
            <span className="mt-3 block border-t border-white/10 pt-2 text-[11px] text-[var(--t-muted)]">
              {result.stopped === "steps"
                ? l(`Stopped after ${result.ticks.toLocaleString()} steps: is there a loop that never ends?`, `Arrêté après ${result.ticks.toLocaleString()} étapes : une boucle ne s'arrête-t-elle jamais ?`)
                : `${l("Process exited with code", "Processus terminé avec le code")} ${result.exitCode}`}{" "}
              · PHP {result.fullVersion} · {result.ms} ms
            </span>
          )}
        </pre>
      )}
    </div>
  );
}

export function ProblemsPanel({ result, onGoTo }: { result: RunResult | null; onGoTo: (file: string, line: number) => void }) {
  const l = useL();
  if (!result) return <Empty text={l("Errors, warnings and deprecations from the last run appear here, with what they mean.", "Les erreurs, avertissements et dépréciations de la dernière exécution apparaissent ici, avec leur explication.")} />;
  if (!result.problems.length)
    return <Empty tone="ok" text={l("No problems: the last run had no error, warning or deprecation.", "Aucun problème : la dernière exécution n'a eu ni erreur, ni avertissement, ni dépréciation.")} />;
  return (
    <ul className="scrollbar-thin h-full divide-y divide-line overflow-auto">
      {result.problems.map((p, i) => (
        <ProblemItem key={i} p={p} onGoTo={onGoTo} defaultOpen={i === 0} />
      ))}
    </ul>
  );
}

function ProblemItem({ p, onGoTo, defaultOpen }: { p: Problem; onGoTo: (file: string, line: number) => void; defaultOpen: boolean }) {
  const l = useL();
  const pick = usePick();
  const [open, setOpen] = useState(defaultOpen);
  const ex = explain(p);
  return (
    <li className="px-3 py-2 text-[13px]">
      <div className="flex items-start gap-2">
        <button onClick={() => setOpen((o) => !o)} className="mt-0.5 text-fg-3 hover:text-fg" aria-expanded={open} aria-label={l("Details", "Détails")}>
          {open ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
        </button>
        <span className="mt-0.5">{sevIcon(p)}</span>
        <div className="min-w-0 flex-1">
          <p className="break-words">
            <span className={clsx("font-semibold", p.severity === "error" ? "text-bad" : "text-warn")}>{p.kind}</span>
            <span className="text-fg">: {p.message}</span>
          </p>
          {p.file && p.line && (
            <button onClick={() => onGoTo(p.file!, p.line!)} className="font-mono text-[11px] text-accent-fg hover:underline">
              {p.file}:{p.line}
            </button>
          )}
        </div>
      </div>
      {open && (
        <div className="mt-2 ml-9 space-y-2">
          {ex && (
            <div className="rounded-md border border-line bg-surface-2/60 p-2.5 text-[12.5px] leading-relaxed">
              <p className="text-fg">
                <span className="font-semibold">{l("What it means: ", "Ce que ça veut dire : ")}</span>
                <InlineCode text={pick(ex.what)} />
              </p>
              <p className="mt-1 flex gap-1.5 text-fg-2">
                <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-warn" />
                <span>
                  <InlineCode text={pick(ex.fix)} />
                </span>
              </p>
            </div>
          )}
          {p.trace.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-fg-3">{l("Stack trace (most recent call first)", "Pile d'appels (appel le plus récent en premier)")}</p>
              <ol className="mt-1 space-y-0.5 font-mono text-[11.5px]">
                {p.trace.map((f, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-fg-3">#{i}</span>
                    {f.file && f.line ? (
                      <button onClick={() => onGoTo(f.file!, f.line!)} className="text-accent-fg hover:underline">
                        {f.file}({f.line})
                      </button>
                    ) : (
                      <span className="text-fg-3">[internal]</span>
                    )}
                    <span className="text-fg">{f.fn}()</span>
                  </li>
                ))}
                <li className="flex gap-2">
                  <span className="text-fg-3">#{p.trace.length}</span>
                  <span className="text-fg-3">{"{main}"}</span>
                </li>
              </ol>
            </div>
          )}
        </div>
      )}
    </li>
  );
}

/** Renders `code` spans inside explanation text. */
export function InlineCode({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((s, i) =>
        s.startsWith("`") && s.endsWith("`") ? (
          <code key={i} className="rounded bg-surface-2 px-1 font-mono text-[0.92em] text-fg">
            {s.slice(1, -1)}
          </code>
        ) : (
          <span key={i}>{s}</span>
        ),
      )}
    </>
  );
}

const typeTone = (t: string) =>
  t === "int" || t === "float"
    ? "text-[var(--syn-number)]"
    : t === "string"
      ? "text-[var(--syn-string)]"
      : t === "bool" || t === "null"
        ? "text-[var(--syn-keyword)]"
        : t === "array"
          ? "text-[var(--syn-property)]"
          : "text-[var(--syn-type)]";

export function VarTable({ vars, changed = [], empty }: { vars: Record<string, VarValue>; changed?: string[]; empty?: string }) {
  const names = Object.keys(vars);
  if (!names.length) return <p className="px-3 py-2 text-xs text-fg-3 italic">{empty}</p>;
  return (
    <table className="w-full text-left font-mono text-[12.5px]">
      <tbody>
        {names.map((n) => (
          <tr key={n} className={clsx("border-b border-line/60 align-top", changed.includes(n) && "bg-accent-soft")}>
            <td className="w-0 py-1 pr-3 pl-3 whitespace-nowrap text-[var(--syn-variable)]">${n}</td>
            <td className={clsx("w-0 py-1 pr-3 text-[11px] whitespace-nowrap", typeTone(vars[n][0]))}>{vars[n][0]}</td>
            <td className="py-1 pr-3 break-all text-fg">{vars[n][1]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function VariablesPanel({ result, step }: { result: RunResult | null; step: TraceStep | null }) {
  const l = useL();
  if (!result) return <Empty text={l("After a run, every global variable and its final value is listed here, with its type.", "Après une exécution, chaque variable globale et sa valeur finale sont listées ici, avec leur type.")} />;
  const vars = step ? step.globals : result.globals;
  return (
    <div className="scrollbar-thin h-full overflow-auto">
      <p className="sticky top-0 z-[1] border-b border-line bg-surface px-3 py-1.5 text-[11px] text-fg-3">
        {step
          ? l(`Variables at step ${result.steps.indexOf(step) + 1} (line ${step.line}). Highlighted: changed by this step.`, `Variables à l'étape ${result.steps.indexOf(step) + 1} (ligne ${step.line}). Surlignées : modifiées à cette étape.`)
          : l("Global variables at the end of the script.", "Variables globales à la fin du script.")}
      </p>
      {step?.args && (
        <>
          <p className="px-3 pt-2 pb-1 text-[11px] font-semibold text-fg-3">
            {l("Inside", "Dans")} <span className="font-mono text-fg-2">{step.stack[0]}()</span>
          </p>
          <VarTable vars={step.args} />
          <p className="px-3 pt-3 pb-1 text-[11px] font-semibold text-fg-3">{l("Globals", "Globales")}</p>
        </>
      )}
      <VarTable vars={vars} changed={step?.changed} empty={l("No global variables.", "Aucune variable globale.")} />
    </div>
  );
}

/** The execution trace: every statement PHP ran, in order. */
export function TracePanel({
  result,
  index,
  onIndex,
}: {
  result: RunResult | null;
  index: number | null;
  onIndex: (i: number | null) => void;
}) {
  const l = useL();
  const [playing, setPlaying] = useState(false);
  const listRef = useRef<HTMLOListElement>(null);
  const steps = useMemo(() => result?.steps ?? [], [result]);
  const cur = index ?? -1;
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      if (cur >= steps.length - 1) setPlaying(false);
      else onIndex(cur + 1);
    }, 550);
    return () => clearInterval(t);
  }, [playing, cur, steps.length, onIndex]);
  useEffect(() => {
    listRef.current?.querySelector(`[data-i="${cur}"]`)?.scrollIntoView({ block: "nearest" });
  }, [cur]);
  const visible = useMemo(() => {
    // Keep the DOM light on long traces: show a window around the current step.
    const from = Math.max(0, cur - 150);
    return steps.slice(from, from + 400).map((s, k) => ({ s, i: from + k }));
  }, [steps, cur]);

  if (!result) return <Empty text={l("Run your code, then step through it here line by line: the editor highlights each line as PHP executes it.", "Exécute ton code, puis avance ici ligne par ligne : l'éditeur surligne chaque ligne au moment où PHP l'exécute.")} />;
  if (!steps.length) return <Empty text={l("No steps were recorded (the script stopped before running any statement).", "Aucune étape enregistrée (le script s'est arrêté avant d'exécuter une instruction).")} />;
  const go = (i: number) => onIndex(Math.max(0, Math.min(steps.length - 1, i)));
  const btn = "grid size-7 place-items-center rounded-md text-fg-2 hover:bg-surface-2 hover:text-fg disabled:opacity-30 pointer-coarse:size-9";
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 flex-wrap items-center gap-1 border-b border-line px-2 py-1">
        <button className={btn} onClick={() => go(0)} disabled={cur <= 0} aria-label={l("First step", "Première étape")} title={l("First step", "Première étape")}>
          <SkipBack className="size-3.5" />
        </button>
        <button className={btn} onClick={() => go(cur - 1)} disabled={cur <= 0} aria-label={l("Previous step (↑)", "Étape précédente (↑)")} title={l("Previous step (↑)", "Étape précédente (↑)")}>
          <StepBack className="size-3.5" />
        </button>
        <button
          className={clsx(btn, "w-auto gap-1 px-2 text-xs font-semibold text-accent-fg")}
          onClick={() => {
            if (cur >= steps.length - 1) go(0);
            setPlaying((p) => !p);
          }}
          aria-label={playing ? l("Pause", "Pause") : l("Play", "Lecture")}
        >
          {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5 fill-current" />}
          {playing ? l("Pause", "Pause") : l("Play", "Lecture")}
        </button>
        <button className={btn} onClick={() => go(cur + 1)} disabled={cur >= steps.length - 1} aria-label={l("Next step (↓)", "Étape suivante (↓)")} title={l("Next step (↓)", "Étape suivante (↓)")}>
          <StepForward className="size-3.5" />
        </button>
        <button className={btn} onClick={() => go(steps.length - 1)} disabled={cur >= steps.length - 1} aria-label={l("Last step", "Dernière étape")} title={l("Last step", "Dernière étape")}>
          <SkipForward className="size-3.5" />
        </button>
        <input
          type="range"
          min={0}
          max={steps.length - 1}
          value={Math.max(0, cur)}
          onChange={(e) => go(Number(e.target.value))}
          className="mx-2 min-w-20 flex-1 accent-[var(--accent-mark)]"
          aria-label={l("Trace position", "Position dans la trace")}
        />
        <span className="font-mono text-[11px] text-fg-3 tabular-nums">
          {cur + 1}/{steps.length}
          {result.ticks > steps.length && ` (${l("of", "sur")} ${result.ticks.toLocaleString()})`}
        </span>
        {index !== null && (
          <button onClick={() => onIndex(null)} className="ml-1 rounded-md px-2 py-0.5 text-[11px] text-fg-3 hover:bg-surface-2 hover:text-fg">
            {l("Exit trace", "Quitter la trace")}
          </button>
        )}
      </div>
      <ol ref={listRef} className="scrollbar-thin min-h-0 flex-1 overflow-auto font-mono text-[12px]">
        {visible.map(({ s, i }) => (
          <li key={i} data-i={i}>
            <button
              onClick={() => go(i)}
              className={clsx("flex w-full items-baseline gap-2 border-b border-line/50 px-3 py-0.5 text-left", i === cur ? "bg-accent-soft" : "hover:bg-surface-2/70")}
            >
              <span className="w-10 shrink-0 text-right text-fg-3 tabular-nums">{i + 1}</span>
              <span className="w-28 shrink-0 truncate text-accent-fg">
                {s.file}:{s.line}
              </span>
              <span className="w-36 shrink-0 truncate text-fg-2" title={s.stack.join(" ← ")}>
                {s.stack.length ? s.stack.map((f) => f + "()").join(" ← ") : "{main}"}
              </span>
              <span className="min-w-0 truncate text-fg-3">
                {s.changed.map((n) => `$${n} = ${s.globals[n]?.[1]}`).join("  ")}
                {!s.changed.length && s.args ? Object.entries(s.args).map(([k, v]) => `$${k} = ${v[1]}`).join("  ") : ""}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function Empty({ text, tone }: { text: string; tone?: "ok" }) {
  return <p className={clsx("p-4 text-[13px] leading-relaxed", tone === "ok" ? "text-ok" : "text-fg-3")}>{text}</p>;
}
