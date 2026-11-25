"use client";

import { clsx } from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ArrowRight, Check, ChevronLeft, Info, Lightbulb, Loader2, Play, RotateCcw, Sparkles, StepBack, StepForward, TriangleAlert, X } from "lucide-react";
import { Rich } from "@/components/rich";
import { Button } from "@/components/ui/button";
import type { CompareStep, DiscoverStep, QuizStep, WatchStep } from "@/features/curriculum/types";
import { CodeEditor } from "@/features/ide/code/code-editor";
import { CompareRunner } from "@/features/ide/compare";
import { Example } from "@/features/ide/example";
import { VarTable } from "@/features/ide/panels";
import { useRunner } from "@/features/ide/use-runner";
import { useProgress } from "@/features/progress/store";
import { QUIZ_XP } from "@/features/progress/rules";
import { useL, usePick } from "@/i18n";
import { LATEST, type RunResult } from "@/php/types";
import { Scene } from "./scenes";

export function FocusCard({
  title,
  children,
  onNext,
  onBack,
  nextLabel,
  nextDisabled,
  nextNudge,
  wide,
}: {
  title: string;
  children: React.ReactNode;
  onNext: () => void;
  onBack?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  nextNudge?: boolean;
  wide?: boolean;
}) {
  const l = useL();
  return (
    <div className="scrollbar-thin h-full overflow-y-auto px-4 py-8 sm:py-12">
      <div className={clsx("mx-auto", wide ? "max-w-4xl" : "max-w-2xl")}>
        <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">{title}</h1>
        <div className="mt-5">{children}</div>
        <div className="mt-8 flex items-center justify-between gap-3 pb-6">
          {onBack ? (
            <Button variant="ghost" onClick={onBack}>
              <ChevronLeft className="size-4" /> {l("Back", "Retour")}
            </Button>
          ) : (
            <span />
          )}
          <Button size="lg" data-nudge={!!nextNudge} onClick={onNext} disabled={nextDisabled}>
            {nextLabel ?? l("Continue", "Continuer")} <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

const CALLOUT = {
  tip: { icon: Lightbulb, cls: "border-ok/30 bg-ok-soft", iconCls: "text-ok", en: "Tip", fr: "Astuce" },
  warn: { icon: TriangleAlert, cls: "border-warn/30 bg-warn-soft", iconCls: "text-warn", en: "Watch out", fr: "Attention" },
  version: { icon: Sparkles, cls: "border-accent/30 bg-accent-soft", iconCls: "text-accent-fg", en: "PHP versions", fr: "Versions de PHP" },
  info: { icon: Info, cls: "border-info/30 bg-info-soft", iconCls: "text-info", en: "Good to know", fr: "Bon à savoir" },
} as const;

export function DiscoverView({ step, onNext, onBack }: { step: DiscoverStep; onNext: () => void; onBack?: () => void }) {
  const pick = usePick();
  const l = useL();
  const examples = [...(step.example ? [step.example] : []), ...(step.examples ?? [])];
  const c = step.callout ? CALLOUT[step.callout.tone] : null;
  return (
    <FocusCard title={pick(step.title)} onNext={onNext} onBack={onBack} nextNudge>
      <div className="space-y-3 text-[15px] leading-relaxed text-fg-2">
        {step.body.map((p) => (
          <p key={p.en}>
            <Rich text={pick(p)} />
          </p>
        ))}
      </div>
      {step.scene && (
        <div className="mt-6">
          <Scene id={step.scene} />
        </div>
      )}
      {examples.map((ex) => (
        <Example key={ex.code} code={ex.code} version={ex.version ?? LATEST} editable className="mt-5" caption={ex.caption ? <Rich text={pick(ex.caption)} /> : undefined} />
      ))}
      {examples.length > 0 && <p className="mt-2 text-xs text-fg-3">{l("You can edit the example and run it again: experiment!", "Tu peux modifier l'exemple et le relancer : expérimente !")}</p>}
      {step.callout && c && (
        <div className={clsx("mt-5 flex gap-3 rounded-lg border p-3.5 text-sm", c.cls)}>
          <c.icon className={clsx("mt-0.5 size-4 shrink-0", c.iconCls)} />
          <div>
            <p className={clsx("text-xs font-semibold", c.iconCls)}>{l(c.en, c.fr)}</p>
            <p className="mt-0.5 text-fg">
              <Rich text={pick(step.callout.text)} />
            </p>
          </div>
        </div>
      )}
    </FocusCard>
  );
}

/** Run a program once with tracing, then let the learner step through it. */
export function WatchView({ step, onNext, onBack }: { step: WatchStep; onNext: () => void; onBack: () => void }) {
  const l = useL();
  const pick = usePick();
  const { run } = useRunner("example");
  const unlock = useProgress((s) => s.unlock);
  const [result, setResult] = useState<RunResult | null>(null);
  const [i, setI] = useState(-1);
  useEffect(() => {
    let alive = true;
    void run({ version: step.version ?? LATEST, files: { "index.php": step.code } }).then((r) => alive && setResult(r));
    return () => {
      alive = false;
    };
  }, [run, step]);
  const steps = result?.steps ?? [];
  const cur = i >= 0 ? steps[i] : null;
  const done = !!result && i >= steps.length - 1;
  const note = cur ? step.notes?.[cur.line] : null;
  const out = cur ? result!.stdout.slice(0, cur.out) : "";
  const lines = step.code.split("\n").length;
  return (
    <FocusCard
      title={pick(step.title)}
      onNext={onNext}
      onBack={onBack}
      nextLabel={done ? l("Your turn", "À toi") : l("Skip ahead", "Passer")}
      nextNudge={done}
      wide
    >
      <p className="text-[15px] text-fg-2">
        <Rich text={pick(step.body)} />
      </p>
      <div className="mt-5 grid overflow-hidden rounded-lg border border-line shadow-[var(--shadow-card)] lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <div className="min-w-0 border-b border-line bg-[var(--editor-bg)] lg:border-r lg:border-b-0" style={{ height: Math.min(440, lines * 23 + 30) }}>
          <CodeEditor value={step.code} lang="php" readOnly compact traceLine={cur?.line ?? null} ariaLabel={l("Program being traced", "Programme suivi pas à pas")} />
        </div>
        <div className="flex min-w-0 flex-col bg-surface">
          <p className="border-b border-line px-3 py-1.5 text-[11px] font-semibold tracking-wide text-fg-3 uppercase">{l("Variables", "Variables")}</p>
          <div className="scrollbar-thin max-h-52 min-h-24 overflow-auto">
            {cur ? (
              <>
                {cur.args && (
                  <>
                    <p className="px-3 pt-1.5 text-[11px] text-fg-3">
                      {l("inside", "dans")} <span className="font-mono">{cur.stack[0]}()</span>
                    </p>
                    <VarTable vars={cur.args} />
                  </>
                )}
                <VarTable vars={cur.globals} changed={cur.changed} empty={l("No variables yet.", "Pas encore de variables.")} />
              </>
            ) : (
              <p className="p-3 text-xs text-fg-3">{result ? l("Press Next step to run the first line.", "Appuie sur Étape suivante pour exécuter la première ligne.") : l("Loading PHP…", "Chargement de PHP…")}</p>
            )}
          </div>
          <p className="border-y border-line px-3 py-1.5 text-[11px] font-semibold tracking-wide text-fg-3 uppercase">{l("Output", "Sortie")}</p>
          <pre className="terminal scrollbar-thin min-h-20 flex-1 overflow-auto bg-term px-3 py-2 font-mono text-[12.5px] whitespace-pre-wrap">
            {out}
            {cur && <span className="caret inline-block h-3.5 w-1.5 translate-y-0.5 bg-[var(--t-text)]" />}
          </pre>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.p key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 min-h-12 text-[15px] text-fg" aria-live="polite">
          {note ? <Rich text={pick(note)} /> : cur ? l(`PHP ran line ${cur.line}.`, `PHP a exécuté la ligne ${cur.line}.`) : l("Watch the arrow in the margin: it shows the line PHP just ran.", "Regarde la flèche dans la marge : elle montre la ligne que PHP vient d'exécuter.")}
        </motion.p>
      </AnimatePresence>
      <div className="mt-2 flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={() => setI((x) => Math.max(-1, x - 1))} disabled={i < 0}>
          <StepBack className="size-4" /> {l("Previous", "Précédente")}
        </Button>
        <Button
          size="sm"
          data-nudge={!!result && !done}
          onClick={() => {
            setI((x) => Math.min(steps.length - 1, x + 1));
            unlock("tracer");
          }}
          disabled={!result || done}
        >
          {result ? <StepForward className="size-3.5" /> : <Loader2 className="size-3.5 animate-spin" />} {l("Next step", "Étape suivante")}
        </Button>
        {done && (
          <Button variant="ghost" size="sm" onClick={() => setI(-1)}>
            <RotateCcw className="size-3.5" /> {l("Replay", "Rejouer")}
          </Button>
        )}
        <span className="ml-auto font-mono text-xs text-fg-3">
          {Math.max(0, i + 1)}/{steps.length || "…"}
        </span>
      </div>
    </FocusCard>
  );
}

/** Predict the output, then run the code to see who's right. */
export function QuizView({ step, onNext, onBack }: { step: QuizStep; onNext: () => void; onBack: () => void }) {
  const l = useL();
  const pick = usePick();
  const awardXp = useProgress((s) => s.awardXp);
  const unlock = useProgress((s) => s.unlock);
  const [picked, setPicked] = useState<number | null>(null);
  const [tries, setTries] = useState(0);
  const correct = picked === step.answer;
  const choose = (i: number) => {
    if (correct) return;
    setPicked(i);
    setTries((t) => t + 1);
    if (i === step.answer && tries === 0) {
      awardXp(QUIZ_XP);
      unlock("quiz-ace");
    }
  };
  const show = (o: string | { en: string; fr: string }) => (typeof o === "string" ? o : pick(o));
  const isCode = (o: string | { en: string; fr: string }) => typeof o === "string";
  return (
    <FocusCard title={pick(step.title)} onNext={onNext} onBack={onBack} nextDisabled={!correct} nextNudge={correct} nextLabel={correct ? l("Continue", "Continuer") : l("Pick an answer", "Choisis une réponse")}>
      <p className="text-[15px] text-fg-2">
        <Rich text={pick(step.question)} />
      </p>
      {step.code && (
        <div className="mt-4 overflow-hidden rounded-lg border border-line bg-[var(--editor-bg)] [--editor-font:13.5px]" style={{ height: step.code.split("\n").length * 23 + 22 }}>
          <CodeEditor value={step.code} lang="php" readOnly compact ariaLabel={l("Quiz code", "Code du quiz")} />
        </div>
      )}
      <ul className="mt-5 grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label={l("Answers", "Réponses")}>
        {step.options.map((o, i) => {
          const state = picked === i ? (i === step.answer ? "right" : "wrong") : correct && i === step.answer ? "right" : null;
          return (
            <li key={i}>
              <button
                role="radio"
                aria-checked={picked === i}
                onClick={() => choose(i)}
                className={clsx(
                  "flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
                  state === "right" ? "border-ok bg-ok-soft" : state === "wrong" ? "border-bad/50 bg-bad-soft" : "border-line bg-elevated shadow-[0_2px_0_var(--edge)] hover:border-line-strong",
                )}
              >
                <span
                  className={clsx(
                    "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2 text-[10px] font-bold",
                    state === "right" ? "border-ok bg-ok text-[var(--on-ok)]" : state === "wrong" ? "border-bad bg-bad text-white" : "border-line-strong text-fg-3",
                  )}
                >
                  {state === "right" ? <Check className="size-3" strokeWidth={3} /> : state === "wrong" ? <X className="size-3" strokeWidth={3} /> : String.fromCharCode(65 + i)}
                </span>
                {isCode(o) ? <code className="font-mono text-[13px] whitespace-pre-wrap text-fg">{show(o)}</code> : <span className="text-sm text-fg"><Rich text={show(o)} /></span>}
              </button>
            </li>
          );
        })}
      </ul>
      <AnimatePresence>
        {picked !== null && (
          <motion.div
            key={correct ? "ok" : "no"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={clsx("mt-4 rounded-lg border p-4 text-sm", correct ? "border-ok/30 bg-ok-soft" : "border-warn/30 bg-warn-soft")}
            role="status"
          >
            <p className={clsx("font-semibold", correct ? "text-ok" : "text-warn")}>
              {correct ? (tries === 1 ? l(`Right on the first try! +${QUIZ_XP} XP`, `Bonne réponse du premier coup ! +${QUIZ_XP} XP`) : l("Right!", "Bonne réponse !")) : l("Not quite. Think again, or run the code below to see.", "Pas tout à fait. Réfléchis encore, ou exécute le code ci-dessous pour voir.")}
            </p>
            {correct && (
              <p className="mt-1 text-fg">
                <Rich text={pick(step.explain)} />
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {step.code && picked !== null && <Example code={step.code} version={step.version ?? LATEST} className="mt-4" caption={l("The real output, from a real PHP interpreter.", "La vraie sortie, d'un vrai interpréteur PHP.")} />}
    </FocusCard>
  );
}

export function CompareView({ step, onNext, onBack }: { step: CompareStep; onNext: () => void; onBack: () => void }) {
  const l = useL();
  const pick = usePick();
  const [done, setDone] = useState(false);
  return (
    <FocusCard title={pick(step.title)} onNext={onNext} onBack={onBack} nextNudge={done} wide>
      <p className="text-[15px] text-fg-2">
        <Rich text={pick(step.body)} />
      </p>
      <div className="mt-4 overflow-hidden rounded-lg border border-line bg-[var(--editor-bg)] [--editor-font:13.5px]" style={{ height: Math.min(360, step.code.split("\n").length * 23 + 22) }}>
        <CodeEditor value={step.code} lang="php" readOnly compact ariaLabel={l("Code to compare", "Code à comparer")} />
      </div>
      <CompareRunner className="mt-4" files={{ "index.php": step.code }} versions={step.versions} onDone={() => setDone(true)} />
      <AnimatePresence>
        {done && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex gap-3 rounded-lg border border-accent/30 bg-accent-soft p-4 text-sm">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-accent-fg" />
            <p className="text-fg">
              <Rich text={pick(step.takeaway)} />
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      {!done && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-fg-3">
          <Play className="size-3" /> {l("Run it to see what changed between versions.", "Exécute-le pour voir ce qui a changé entre les versions.")}
        </p>
      )}
    </FocusCard>
  );
}
