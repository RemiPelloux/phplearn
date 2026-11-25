"use client";

import { clsx } from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import {
  BookMarked,
  CircleAlert,
  Columns2,
  FileCode2,
  FilePlus2,
  Footprints,
  Loader2,
  Maximize2,
  Minimize2,
  PanelLeft,
  Pencil,
  Play,
  RotateCcw,
  SquareTerminal,
  Trash2,
  TriangleAlert,
  Variable,
  X,
} from "lucide-react";
import { useL } from "@/i18n";
import type { PhpVersion, RunRequest, RunResult } from "@/php/types";
import { PHP_VERSIONS } from "@/php/types";
import { useProgress } from "@/features/progress/store";
import { CodeEditor, type CodeEditorHandle, type CursorInfo, type EditorProblem } from "./code/code-editor";
import { langOf } from "./code/languages";
import { CompareRunner } from "./compare";
import { OutputPanel, ProblemsPanel, TracePanel, VariablesPanel } from "./panels";
import { useRunner, useRuntimeStatus } from "./use-runner";
import { VersionPicker } from "./version-picker";

export type Files = Record<string, string>;
type PanelTab = "output" | "problems" | "trace" | "variables";

export function useMedia(query: string, fallback: boolean) {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => fallback,
  );
}

function usePersistentNumber(key: string, initial: number) {
  const [v, setV] = useState(() => {
    if (typeof window === "undefined") return initial;
    try {
      const s = Number(localStorage.getItem(key));
      return s > 0 ? s : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, String(v));
    } catch {
      /* storage unavailable */
    }
  }, [key, v]);
  return [v, setV] as const;
}

export interface IdeProps {
  files: Files;
  onFilesChange: (files: Files) => void;
  version: PhpVersion;
  onVersionChange: (v: PhpVersion) => void;
  probes?: string[];
  request?: RunRequest["request"];
  /** Called after every run (lessons evaluate their objectives here). */
  onResult?: (r: RunResult, files: Files) => void;
  /** Lets the learner add, rename and delete files. */
  editableTree?: boolean;
  /** Restore the starting code. */
  onReset?: () => void;
  /** A panel shown at the right of the editor (e.g. the cheat sheet). */
  aside?: ReactNode;
  asideLabel?: string;
  where?: "lesson" | "playground" | "example";
  /** Extra controls in the toolbar (left of Run). */
  toolbar?: ReactNode;
  /** Highlight the Run button (the lesson is waiting for a run). */
  nudgeRun?: boolean;
  className?: string;
}

/**
 * A small VS Code: file tabs and explorer, a PHP editor, a Run button with a
 * version picker, and a bottom panel with Output, Problems, Trace and
 * Variables. Everything runs on a real PHP interpreter in a Web Worker.
 */
export function Ide({
  files,
  onFilesChange,
  version,
  onVersionChange,
  probes,
  request,
  onResult,
  editableTree,
  onReset,
  aside,
  asideLabel,
  where = "lesson",
  toolbar,
  nudgeRun,
  className,
}: IdeProps) {
  const l = useL();
  const settings = useProgress((s) => s.settings);
  const unlock = useProgress((s) => s.unlock);
  const isWide = useMedia("(min-width: 900px)", true);
  const paths = useMemo(() => Object.keys(files).sort((a, b) => (a === "index.php" ? -1 : b === "index.php" ? 1 : a.localeCompare(b))), [files]);
  const [active, setActive] = useState("index.php");
  const current = files[active] !== undefined ? active : paths[0];
  const [result, setResult] = useState<RunResult | null>(null);
  const [resultFiles, setResultFiles] = useState<Files | null>(null);
  const [tab, setTab] = useState<PanelTab>("output");
  const [traceIndex, setTraceIndex] = useState<number | null>(null);
  const [cursor, setCursor] = useState<CursorInfo | null>(null);
  const [panelH, setPanelH] = usePersistentNumber("phpl-panel-h", 260);
  const [panelMax, setPanelMax] = useState(false);
  const [showTree, setShowTree] = useState(paths.length > 1);
  const [showAside, setShowAside] = useState(false);
  const [comparing, setComparing] = useState(false);
  const [mobileView, setMobileView] = useState<"code" | "panel">("code");
  const editor = useRef<CodeEditorHandle>(null);
  const { run, running } = useRunner(where);
  const status = useRuntimeStatus(version);

  const doRun = useCallback(async () => {
    if (running) return;
    const snapshot = files;
    const r = await run({ version, files: snapshot, probes, request });
    setResult(r);
    setResultFiles(snapshot);
    setTraceIndex(null);
    setTab(r.problems.length ? "problems" : "output");
    if (!isWide) setMobileView("panel");
    onResult?.(r, snapshot);
  }, [running, files, run, version, probes, request, onResult, isWide]);

  // Alt+↑ / Alt+↓ move through the trace from anywhere in the IDE.
  const traceStep = result && traceIndex !== null ? result.steps[traceIndex] : null;
  useEffect(() => {
    if (!result?.steps.length || traceIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (!e.altKey || (e.key !== "ArrowDown" && e.key !== "ArrowUp")) return;
      e.preventDefault();
      setTraceIndex((i) => Math.max(0, Math.min(result.steps.length - 1, (i ?? 0) + (e.key === "ArrowDown" ? 1 : -1))));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [result, traceIndex]);

  const startTrace = (i: number | null) => {
    setTraceIndex(i);
    if (i !== null) unlock("tracer");
    const s = i !== null ? result?.steps[i] : null;
    if (s && s.file !== current && files[s.file] !== undefined) setActive(s.file);
  };

  // Marks in the editor: the traced line, and the problems of the last run (if the code didn't change since).
  const stale = !!resultFiles && resultFiles[current] !== files[current];
  const problems: EditorProblem[] =
    result && !stale && traceIndex === null
      ? result.problems.filter((p) => p.file === current && p.line).map((p) => ({ line: p.line!, severity: p.severity, message: `${p.kind}: ${p.message}` }))
      : [];
  const traceLine = traceStep && traceStep.file === current ? traceStep.line : null;

  const goTo = (file: string, line: number) => {
    if (files[file] !== undefined) setActive(file);
    setTimeout(() => editor.current?.goToLine(line), 30);
    if (!isWide) setMobileView("code");
  };

  const setFile = (path: string, content: string) => onFilesChange({ ...files, [path]: content });
  const addFile = () => {
    const name = window.prompt(l("New file name (e.g. src/User.php)", "Nom du nouveau fichier (par ex. src/User.php)"), "src/Helper.php");
    if (!name) return;
    const clean = name.replace(/^\/+/, "").replace(/\.\.+/g, ".").trim();
    if (!clean || files[clean] !== undefined) return;
    onFilesChange({ ...files, [clean]: clean.endsWith(".php") ? "<?php\n\n" : "" });
    setActive(clean);
    setShowTree(true);
  };
  const renameFile = (p: string) => {
    if (p === "index.php") return;
    const name = window.prompt(l("Rename to", "Renommer en"), p);
    if (!name || name === p || files[name] !== undefined) return;
    const next: Files = {};
    for (const [k, v] of Object.entries(files)) next[k === p ? name : k] = v;
    onFilesChange(next);
    setActive(name);
  };
  const deleteFile = (p: string) => {
    if (p === "index.php") return;
    if (!window.confirm(l(`Delete ${p}?`, `Supprimer ${p} ?`))) return;
    const next = { ...files };
    delete next[p];
    onFilesChange(next);
    setActive("index.php");
  };

  const counts = {
    errors: result?.problems.filter((p) => p.severity === "error").length ?? 0,
    warnings: result?.problems.filter((p) => p.severity !== "error").length ?? 0,
  };

  const tabs: Array<{ id: PanelTab; label: string; icon: ReactNode; badge?: ReactNode }> = [
    { id: "output", label: l("Output", "Sortie"), icon: <SquareTerminal className="size-3.5" /> },
    {
      id: "problems",
      label: l("Problems", "Problèmes"),
      icon: <CircleAlert className="size-3.5" />,
      badge: result?.problems.length ? (
        <span className={clsx("rounded-full px-1.5 text-[10px] font-bold", counts.errors ? "bg-bad text-white" : "bg-warn-soft text-warn")}>{result.problems.length}</span>
      ) : null,
    },
    {
      id: "trace",
      label: l("Trace", "Trace"),
      icon: <Footprints className="size-3.5" />,
      badge: result?.steps.length ? <span className="rounded-full bg-surface-2 px-1.5 text-[10px] font-semibold text-fg-3">{result.steps.length}</span> : null,
    },
    { id: "variables", label: l("Variables", "Variables"), icon: <Variable className="size-3.5" /> },
  ];

  const runButton = (
    <button
      onClick={doRun}
      disabled={running}
      data-nudge={!!nudgeRun && !running}
      title={l("Run (Ctrl+Enter)", "Exécuter (Ctrl+Entrée)")}
      className="flex h-8 items-center gap-1.5 rounded-md bg-ok px-3 text-[13px] font-semibold text-[var(--on-ok)] shadow-[0_2px_0_color-mix(in_oklab,var(--ok)_60%,black)] transition-transform hover:brightness-110 active:translate-y-[2px] active:shadow-none disabled:opacity-70"
    >
      {running ? <Loader2 className="size-3.5 animate-spin" /> : <Play className="size-3.5 fill-current" />}
      {running && status !== "ready" ? l("Loading PHP…", "Chargement de PHP…") : l("Run", "Exécuter")}
    </button>
  );

  const editorArea = (
    <div className="flex min-h-0 flex-1">
      {showTree && (
        <aside className="hidden w-48 shrink-0 flex-col border-r border-line bg-[var(--editor-tabbar)] sm:flex" aria-label={l("Explorer", "Explorateur")}>
          <div className="flex items-center justify-between px-3 pt-2 pb-1 text-[10px] font-semibold tracking-wider text-fg-3 uppercase">
            {l("Explorer", "Explorateur")}
            {editableTree && (
              <button onClick={addFile} className="rounded p-0.5 hover:bg-surface-2 hover:text-fg" aria-label={l("New file", "Nouveau fichier")} title={l("New file", "Nouveau fichier")}>
                <FilePlus2 className="size-3.5" />
              </button>
            )}
          </div>
          <ul className="scrollbar-thin min-h-0 flex-1 overflow-auto pb-2">
            {paths.map((p) => {
              const depth = p.split("/").length - 1;
              return (
                <li key={p} className="group flex items-center">
                  <button
                    onClick={() => setActive(p)}
                    className={clsx("flex min-w-0 flex-1 items-center gap-1.5 py-1 pr-1 text-left font-mono text-[12px]", p === current ? "bg-accent-soft text-fg" : "text-fg-2 hover:bg-surface-2/70")}
                    style={{ paddingLeft: 12 + depth * 10 }}
                    title={p}
                  >
                    <FileCode2 className="size-3.5 shrink-0 text-accent-fg" />
                    <span className="truncate">{depth ? <span className="text-fg-3">{p.split("/").slice(0, -1).join("/")}/</span> : null}{p.split("/").pop()}</span>
                  </button>
                  {editableTree && p !== "index.php" && (
                    <span className="flex opacity-0 group-hover:opacity-100 focus-within:opacity-100">
                      <button onClick={() => renameFile(p)} className="rounded p-1 text-fg-3 hover:text-fg" aria-label={l(`Rename ${p}`, `Renommer ${p}`)}>
                        <Pencil className="size-3" />
                      </button>
                      <button onClick={() => deleteFile(p)} className="rounded p-1 text-fg-3 hover:text-bad" aria-label={l(`Delete ${p}`, `Supprimer ${p}`)}>
                        <Trash2 className="size-3" />
                      </button>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </aside>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="scrollbar-thin flex h-9 shrink-0 items-stretch overflow-x-auto border-b border-line bg-[var(--editor-tabbar)]" role="tablist" aria-label={l("Open files", "Fichiers ouverts")}>
          <button
            onClick={() => setShowTree((s) => !s)}
            className={clsx("hidden w-9 shrink-0 place-items-center border-r border-line text-fg-3 hover:text-fg sm:grid", showTree && "text-accent-fg")}
            aria-label={l("Toggle explorer", "Afficher l'explorateur")}
            aria-pressed={showTree}
            title={l("Explorer", "Explorateur")}
          >
            <PanelLeft className="size-4" />
          </button>
          {paths.map((p) => (
            <button
              key={p}
              role="tab"
              aria-selected={p === current}
              onClick={() => setActive(p)}
              title={p}
              className={clsx(
                "relative flex shrink-0 items-center gap-1.5 border-r border-line px-3 font-mono text-[12.5px]",
                p === current ? "bg-[var(--editor-bg)] text-fg" : "text-fg-3 hover:bg-surface-2/60 hover:text-fg-2",
              )}
            >
              <FileCode2 className="size-3.5 text-accent-fg" aria-hidden />
              {p.split("/").pop()}
              {p === current && <span className="absolute inset-x-0 top-0 h-0.5 bg-accent" />}
            </button>
          ))}
          {editableTree && (
            <button onClick={addFile} className="grid w-9 shrink-0 place-items-center text-fg-3 hover:text-fg" aria-label={l("New file", "Nouveau fichier")} title={l("New file", "Nouveau fichier")}>
              <FilePlus2 className="size-3.5" />
            </button>
          )}
        </div>
        <div className="relative min-h-0 flex-1" style={{ ["--editor-font" as string]: `${settings.fontSize}px` }}>
          <CodeEditor
            key={current}
            ref={editor}
            value={files[current] ?? ""}
            lang={langOf(current).id}
            onChange={(v) => setFile(current, v)}
            onCursor={setCursor}
            onRun={doRun}
            ariaLabel={l(`Code editor: ${current}`, `Éditeur de code : ${current}`)}
            wrap={settings.wordWrap}
            traceLine={traceLine}
            problems={problems}
          />
          {traceStep && (
            <TraceBubble
              text={
                traceStep.stack.length
                  ? l(`Step ${traceIndex! + 1} · line ${traceStep.line} · inside ${traceStep.stack[0]}()`, `Étape ${traceIndex! + 1} · ligne ${traceStep.line} · dans ${traceStep.stack[0]}()`)
                  : l(`Step ${traceIndex! + 1} · line ${traceStep.line}`, `Étape ${traceIndex! + 1} · ligne ${traceStep.line}`)
              }
            />
          )}
        </div>
      </div>
      {aside && showAside && isWide && (
        <aside className="scrollbar-thin w-[300px] shrink-0 overflow-y-auto border-l border-line bg-surface" aria-label={asideLabel}>
          {aside}
        </aside>
      )}
    </div>
  );

  const panel = (
    <div className="flex h-full min-h-0 flex-col bg-surface">
      <div className="flex h-9 shrink-0 items-center gap-0.5 border-b border-line px-1.5" role="tablist" aria-label={l("Results", "Résultats")}>
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => {
              setTab(t.id);
              if (t.id === "trace" && traceIndex === null && result?.steps.length) startTrace(0);
            }}
            className={clsx(
              "relative flex h-full items-center gap-1.5 px-2.5 text-[11.5px] font-semibold tracking-wide uppercase",
              tab === t.id ? "text-fg" : "text-fg-3 hover:text-fg-2",
            )}
          >
            {t.icon}
            {t.label}
            {t.badge}
            {tab === t.id && <motion.span layoutId={`ide-tab-${where}`} className="absolute inset-x-1.5 bottom-0 h-0.5 rounded-full bg-accent" />}
          </button>
        ))}
        <div className="ml-auto flex items-center">
          {isWide && (
            <button
              onClick={() => setPanelMax((m) => !m)}
              className="grid size-7 place-items-center rounded-md text-fg-3 hover:bg-surface-2 hover:text-fg"
              aria-label={panelMax ? l("Restore panel", "Réduire le panneau") : l("Maximize panel", "Agrandir le panneau")}
            >
              {panelMax ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
            </button>
          )}
        </div>
      </div>
      <div className={clsx("min-h-0 flex-1", tab === "output" && "bg-term")} role="tabpanel">
        {tab === "output" && <OutputPanel result={result} upTo={traceStep ? traceStep.out : null} />}
        {tab === "problems" && <ProblemsPanel result={result} onGoTo={goTo} />}
        {tab === "trace" && <TracePanel result={result} index={traceIndex} onIndex={startTrace} />}
        {tab === "variables" && <VariablesPanel result={result} step={traceStep} />}
      </div>
    </div>
  );

  const statusBar = (
    <div className="flex h-6 shrink-0 items-center gap-3 overflow-hidden bg-accent px-3 text-[11px] whitespace-nowrap text-white">
      <span className="flex items-center gap-1 font-semibold">
        {status === "loading" ? <Loader2 className="size-3 animate-spin" /> : <span className={clsx("size-1.5 rounded-full", status === "ready" ? "bg-[#a9d07b]" : "bg-white/50")} />}
        PHP {result && result.version === version ? result.fullVersion : version}
      </span>
      {result && (
        <span className="flex items-center gap-2">
          <span className="flex items-center gap-0.5">
            <CircleAlert className="size-3" /> {counts.errors}
          </span>
          <span className="flex items-center gap-0.5">
            <TriangleAlert className="size-3" /> {counts.warnings}
          </span>
          <span className="hidden sm:inline">
            {result.ms} ms · {l("exit", "code")} {result.exitCode}
          </span>
        </span>
      )}
      {stale && <span className="hidden opacity-80 sm:inline">● {l("edited since last run", "modifié depuis la dernière exécution")}</span>}
      <span className="ml-auto hidden sm:inline">{cursor ? l(`Ln ${cursor.line}, Col ${cursor.col}`, `Ln ${cursor.line}, Col ${cursor.col}`) : ""}</span>
      <span className="hidden md:inline">UTF-8</span>
      <span className="hidden md:inline">{langOf(current).label}</span>
    </div>
  );

  return (
    <div className={clsx("relative flex h-full min-h-0 flex-col bg-[var(--editor-bg)]", className)}>
      <div className="flex h-11 shrink-0 items-center gap-1.5 border-b border-line bg-surface px-2">
        {toolbar}
        <div className="ml-auto flex items-center gap-1.5">
          {onReset && (
            <button onClick={onReset} className="flex h-8 items-center gap-1 rounded-md px-2 text-xs text-fg-2 hover:bg-surface-2 hover:text-fg" title={l("Restore the starting code", "Remettre le code de départ")}>
              <RotateCcw className="size-3.5" /> <span className="hidden lg:inline">{l("Reset", "Réinitialiser")}</span>
            </button>
          )}
          {aside && isWide && (
            <button
              onClick={() => setShowAside((s) => !s)}
              aria-pressed={showAside}
              className={clsx("flex h-8 items-center gap-1 rounded-md px-2 text-xs hover:bg-surface-2", showAside ? "bg-accent-soft text-accent-fg" : "text-fg-2 hover:text-fg")}
            >
              <BookMarked className="size-3.5" /> <span className="hidden lg:inline">{asideLabel}</span>
            </button>
          )}
          <button
            onClick={() => setComparing(true)}
            className="flex h-8 items-center gap-1 rounded-md px-2 text-xs text-fg-2 hover:bg-surface-2 hover:text-fg"
            title={l("Run on every PHP version", "Exécuter sur chaque version de PHP")}
          >
            <Columns2 className="size-3.5" /> <span className="hidden lg:inline">{l("Compare versions", "Comparer les versions")}</span>
          </button>
          <VersionPicker value={version} onChange={onVersionChange} />
          {runButton}
        </div>
      </div>

      {isWide ? (
        <>
          {!panelMax && editorArea}
          {!panelMax && (
            <div
              role="separator"
              aria-orientation="horizontal"
              tabIndex={0}
              aria-label={l("Resize the results panel", "Redimensionner le panneau des résultats")}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp") setPanelH((h) => Math.min(700, h + 20));
                if (e.key === "ArrowDown") setPanelH((h) => Math.max(120, h - 20));
              }}
              onPointerDown={(e) => {
                const startY = e.clientY;
                const startH = panelH;
                const move = (ev: PointerEvent) => setPanelH(Math.min(window.innerHeight - 220, Math.max(120, startH + startY - ev.clientY)));
                const up = () => {
                  window.removeEventListener("pointermove", move);
                  window.removeEventListener("pointerup", up);
                };
                window.addEventListener("pointermove", move);
                window.addEventListener("pointerup", up);
              }}
              onDoubleClick={() => setPanelMax(true)}
              className="relative h-1 shrink-0 cursor-row-resize bg-line/70 transition-colors hover:bg-accent focus-visible:bg-accent"
            >
              <span className="absolute inset-x-0 -top-1.5 -bottom-1.5" />
            </div>
          )}
          <div style={panelMax ? undefined : { height: panelH }} className={panelMax ? "min-h-0 flex-1" : "shrink-0"}>
            {panel}
          </div>
        </>
      ) : (
        <>
          <div className="flex shrink-0 border-b border-line bg-surface text-xs font-semibold">
            {(["code", "panel"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setMobileView(v)}
                aria-pressed={mobileView === v}
                className={clsx("flex flex-1 items-center justify-center gap-1.5 py-2", mobileView === v ? "text-accent-fg shadow-[inset_0_-2px_0_var(--accent)]" : "text-fg-3")}
              >
                {v === "code" ? <FileCode2 className="size-3.5" /> : <SquareTerminal className="size-3.5" />}
                {v === "code" ? l("Code", "Code") : l("Results", "Résultats")}
                {v === "panel" && !!result?.problems.length && <span className="rounded-full bg-bad px-1.5 text-[10px] text-white">{result.problems.length}</span>}
              </button>
            ))}
          </div>
          <div className="flex min-h-0 flex-1 flex-col">{mobileView === "code" ? editorArea : panel}</div>
        </>
      )}
      {statusBar}

      <AnimatePresence>
        {comparing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex flex-col bg-bg/95 backdrop-blur-sm"
            role="dialog"
            aria-modal
            aria-label={l("Compare PHP versions", "Comparer les versions de PHP")}
          >
            <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
              <Columns2 className="size-4 text-accent-fg" />
              <h2 className="text-sm font-semibold">{l("Same code, every PHP version", "Même code, chaque version de PHP")}</h2>
              <button onClick={() => setComparing(false)} className="ml-auto grid size-8 place-items-center rounded-md text-fg-2 hover:bg-surface-2" aria-label={l("Close", "Fermer")}>
                <X className="size-4" />
              </button>
            </div>
            <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto p-4">
              <p className="mb-3 max-w-2xl text-sm text-fg-2">
                {l(
                  "Your current files run on PHP 7.4 through 8.5, one after the other. Cards marked “different” don't match the newest version: that's where the language changed.",
                  "Tes fichiers actuels s'exécutent de PHP 7.4 à 8.5, l'un après l'autre. Les cartes marquées « différent » ne correspondent pas à la version la plus récente : c'est là que le langage a changé.",
                )}
              </p>
              <CompareRunner files={files} versions={[...PHP_VERSIONS]} probes={probes} request={request} autoStart />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TraceBubble({ text }: { text: string }) {
  return (
    <div className="pointer-events-none absolute right-3 bottom-3 z-10 flex items-center gap-1.5 rounded-full border border-line bg-elevated px-3 py-1 text-[11px] font-medium text-fg-2 shadow-[var(--shadow-lg)]">
      <Footprints className="size-3.5 text-accent-fg" />
      {text}
      <span className="hidden text-fg-3 lg:inline">· Alt+↑/↓</span>
    </div>
  );
}
