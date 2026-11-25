"use client";

import { clsx } from "clsx";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronLeft, ChevronRight, Circle, Eye, Lightbulb, Lock, RotateCcw, Swords, Target, Zap } from "lucide-react";
import { Rich } from "@/components/rich";
import { Button } from "@/components/ui/button";
import { ProgressBar, useHydrated } from "@/components/ui/misc";
import { chapterOf, getLesson, isUnlocked, nextLesson, type Files, type Lesson, type Step } from "@/features/curriculum";
import { makeContext } from "@/features/curriculum/checks";
import type { CodeStep } from "@/features/curriculum/types";
import { cheatFor } from "@/features/cheats/cheats";
import { CheatPanel } from "@/features/cheats/cheat-panel";
import { Ide, useMedia } from "@/features/ide/ide";
import { preload } from "@/php/client";
import { useProgress } from "@/features/progress/store";
import { useL, usePick, useT, type MessageKey } from "@/i18n";
import { LATEST, type PhpVersion, type RunResult } from "@/php/types";
import { Celebration } from "./celebration";
import { CompareView, DiscoverView, QuizView, WatchView } from "./step-views";

/** How the learner is doing in this run of the lesson (drives the stars). */
export interface RunStats {
  mistakes: number;
  walkthrough: boolean;
}

export function LessonPlayer({ lessonId }: { lessonId: string }) {
  const hydrated = useHydrated();
  const lesson = getLesson(lessonId);
  const l = useL();
  if (!lesson) return <p className="p-8">{l("Lesson not found.", "Leçon introuvable.")}</p>;
  if (!hydrated) return <div className="h-dvh" aria-busy="true" />;
  return <LockGate lesson={lesson} />;
}

function LockGate({ lesson }: { lesson: Lesson }) {
  const l = useL();
  const pick = usePick();
  const completed = useProgress((s) => s.completed);
  const experience = useProgress((s) => s.experience);
  if (!isUnlocked(lesson.id, completed, experience))
    return (
      <div className="grid h-dvh place-items-center p-6 text-center">
        <div>
          <Lock className="mx-auto size-8 text-fg-3" />
          <h1 className="mt-4 text-xl font-semibold">{l(`“${pick(lesson.title)}” is locked`, `« ${pick(lesson.title)} » est verrouillée`)}</h1>
          <p className="mt-2 text-sm text-fg-2">{l("Finish the previous lesson to unlock it. Each one builds on the last.", "Termine la leçon précédente pour la débloquer. Chacune s'appuie sur la précédente.")}</p>
          <Link href="/learn" className="mt-6 inline-block text-sm text-accent-fg underline underline-offset-4">
            {l("Back to your learning path", "Retour à ton parcours")}
          </Link>
        </div>
      </div>
    );
  return <LessonRuntime key={lesson.id} lesson={lesson} />;
}

const stepVersion = (s: Step): PhpVersion => ("version" in s && s.version ? s.version : LATEST);

function LessonRuntime({ lesson }: { lesson: Lesson }) {
  const t = useT();
  const l = useL();
  const pick = usePick();
  const save = useProgress.getState().saves[lesson.id];
  const saveLesson = useProgress((s) => s.saveLesson);
  const clearLesson = useProgress((s) => s.clearLesson);
  const setHold = useProgress((s) => s.setHoldCelebrations);
  const [step, setStep] = useState(() => Math.min(save?.step ?? 0, lesson.steps.length - 1));
  const [files, setFiles] = useState<Record<number, Files>>(() => save?.files ?? {});
  const [stats, setStats] = useState<RunStats>(() => save?.stats ?? { mistakes: 0, walkthrough: false });
  const [openedAt] = useState(() => Date.now());
  const current = lesson.steps[step];

  useEffect(() => {
    // Start downloading PHP right away, so the first Run is fast.
    const versions = new Set(lesson.steps.map(stepVersion));
    for (const v of versions) preload(v);
  }, [lesson]);

  useEffect(() => {
    if (current.kind === "celebrate") return;
    saveLesson(lesson.id, { step, files, stats });
  }, [step, files, stats, lesson.id, current.kind, saveLesson]);

  useEffect(() => {
    setHold(current.kind !== "celebrate");
    return () => setHold(false);
  }, [current.kind, setHold]);

  const goto = (i: number) => setStep(Math.max(0, Math.min(lesson.steps.length - 1, i)));
  const restart = () => {
    clearLesson(lesson.id);
    setFiles({});
    setStats({ mistakes: 0, walkthrough: false });
    goto(0);
  };

  const chapter = chapterOf(lesson);
  const next = nextLesson(lesson.id);
  const stepName = (k: Step["kind"]) => t(`steps.${k}` as MessageKey);

  const header = (
    <header className="relative flex h-14 shrink-0 items-center gap-3 border-b border-line bg-bg px-3 sm:px-4">
      <Link href="/learn" className="flex items-center gap-1 rounded-lg p-1.5 text-fg-2 hover:bg-surface-2 hover:text-fg" aria-label={l("Back to your learning path", "Retour à ton parcours")}>
        <ArrowLeft className="size-4" />
      </Link>
      <div className="min-w-0">
        <p className="truncate text-[11px] text-fg-3">{l(`Chapter ${chapter.number} · ${chapter.title.en}`, `Chapitre ${chapter.number} · ${chapter.title.fr}`)}</p>
        <p className="flex items-center gap-1.5 truncate text-sm font-semibold">
          {lesson.boss && <Swords className="size-3.5 text-warn" aria-label={l("Boss challenge", "Défi boss")} />}
          {pick(lesson.title)}
        </p>
      </div>
      <p className="mx-auto hidden shrink-0 items-center gap-2 text-xs text-fg-2 md:flex xl:hidden" aria-live="polite">
        <span className="font-semibold text-accent-fg">{stepName(current.kind)}</span>
        <span className="text-fg-3 tabular-nums">
          {step + 1}/{lesson.steps.length}
        </span>
      </p>
      <nav className="mx-auto hidden items-center gap-1 xl:flex" aria-label={l("Lesson steps", "Étapes de la leçon")}>
        {lesson.steps.map((s, i) => (
          <button
            key={i}
            onClick={() => i <= step && goto(i)}
            disabled={i > step}
            aria-current={i === step ? "step" : undefined}
            className={clsx(
              "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
              i === step ? "bg-accent-soft text-accent-fg" : i < step ? "text-ok hover:bg-surface-2" : "text-fg-3",
            )}
          >
            {i < step ? <Check className="size-3" /> : <Circle className={clsx("size-2", i === step && "fill-current")} />}
            {stepName(s.kind)}
          </button>
        ))}
      </nav>
      <div className="ml-auto flex shrink-0 items-center gap-2 md:ml-0">
        <span className="hidden items-center gap-1 rounded-full bg-warn-soft px-2 py-0.5 text-xs font-semibold whitespace-nowrap text-warn sm:flex">
          <Zap className="size-3.5" /> {lesson.xp} XP
        </span>
        <Button variant="ghost" size="sm" onClick={restart} title={l("Restart lesson", "Recommencer la leçon")}>
          <RotateCcw className="size-3.5" /> <span className="hidden sm:inline">{l("Restart", "Recommencer")}</span>
        </Button>
      </div>
      <div className="absolute inset-x-0 top-14 md:hidden">
        <ProgressBar value={step / (lesson.steps.length - 1)} className="h-0.5 rounded-none" label={l("Lesson progress", "Progression de la leçon")} />
      </div>
    </header>
  );

  const isCode = current.kind === "try" || current.kind === "challenge";
  return (
    <div className="relative flex h-dvh flex-col">
      {header}
      <div className="min-h-0 flex-1">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }} className="h-full">
            {current.kind === "discover" && <DiscoverView step={current} onNext={() => goto(step + 1)} onBack={step > 0 ? () => goto(step - 1) : undefined} />}
            {current.kind === "watch" && <WatchView step={current} onNext={() => goto(step + 1)} onBack={() => goto(step - 1)} />}
            {current.kind === "quiz" && <QuizView step={current} onNext={() => goto(step + 1)} onBack={() => goto(step - 1)} />}
            {current.kind === "compare" && <CompareView step={current} onNext={() => goto(step + 1)} onBack={() => goto(step - 1)} />}
            {isCode && (
              <CodeStepView
                lesson={lesson}
                step={current as CodeStep}
                index={step}
                files={files[step] ?? (current as CodeStep).files}
                onFiles={(f) => setFiles((x) => ({ ...x, [step]: f }))}
                onReset={() =>
                  setFiles((x) => {
                    const n = { ...x };
                    delete n[step];
                    return n;
                  })
                }
                onMistake={() => setStats((s) => ({ ...s, mistakes: s.mistakes + 1 }))}
                onWalkthrough={() => setStats((s) => (s.walkthrough ? s : { ...s, walkthrough: true }))}
                onNext={() => goto(step + 1)}
                onBack={step > 0 ? () => goto(step - 1) : undefined}
              />
            )}
            {current.kind === "celebrate" && <Celebration lesson={lesson} next={next} onReplay={restart} startedAt={openedAt} stats={stats} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/** A try or challenge step: the guide on the left, the IDE on the right. */
function CodeStepView({
  lesson,
  step,
  index,
  files,
  onFiles,
  onReset,
  onMistake,
  onWalkthrough,
  onNext,
  onBack,
}: {
  lesson: Lesson;
  step: CodeStep;
  index: number;
  files: Files;
  onFiles: (f: Files) => void;
  onReset: () => void;
  onMistake: () => void;
  onWalkthrough: () => void;
  onNext: () => void;
  onBack?: () => void;
}) {
  const l = useL();
  const pick = usePick();
  const name = useProgress((s) => s.name);
  const isDesktop = useMedia("(min-width: 1100px)", true);
  const [version, setVersion] = useState<PhpVersion>(step.version ?? LATEST);
  const [results, setResults] = useState<boolean[] | null>(null);
  const [lastRun, setLastRun] = useState<RunResult | null>(null);
  const [hintLevel, setHintLevel] = useState<Record<string, number>>({});
  const [showSolution, setShowSolution] = useState(false);
  const [mobileGuide, setMobileGuide] = useState(true);
  const sheet = step.cheat ? cheatFor(step.cheat) : null;

  const onResult = useCallback(
    (r: RunResult, f: Files) => {
      const ctx = makeContext(r, f, step.probes);
      const res = step.objectives.map((o) => {
        try {
          return o.check(ctx);
        } catch {
          return false;
        }
      });
      setResults(res);
      setLastRun(r);
      if (r.problems.some((p) => p.severity === "error") || r.stopped) onMistake();
    },
    [step, onMistake],
  );

  const allDone = !!results && results.every(Boolean);
  const firstOpen = step.objectives.find((_, i) => !results?.[i]);
  const level = firstOpen ? (hintLevel[firstOpen.id] ?? 0) : 0;
  const hintNames = [l("Idea", "Idée"), l("Syntax", "Syntaxe"), l("Walkthrough", "Solution guidée")];
  const challenge = step.kind === "challenge";

  const guide = (
    <div className="flex min-h-full flex-col p-5">
      <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
        {challenge && (lesson.boss ? <Swords className="size-5 text-warn" /> : <Target className="size-5 text-accent-fg" />)}
        {pick(step.title)}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-fg-2">
        <Rich text={pick(step.body)} />
      </p>
      {step.request && (
        <p className="mt-3 rounded-md border border-info/30 bg-info-soft px-3 py-2 font-mono text-[11.5px] text-fg-2">
          {step.request.method ?? "GET"} /index.php{step.request.query ? "?" + new URLSearchParams(step.request.query).toString() : ""}
          {step.request.body && <span className="block text-fg-3">body: {new URLSearchParams(step.request.body).toString()}</span>}
        </p>
      )}
      <ul className="mt-4 space-y-2" aria-label={l("Objectives", "Objectifs")}>
        {step.objectives.map((o, i) => {
          const ok = !!results?.[i];
          return (
            <motion.li
              key={o.id}
              layout
              className={clsx("flex items-start gap-3 rounded-md border px-3 py-2.5 text-sm transition-colors", ok ? "border-ok/30 bg-ok-soft" : results ? "border-bad/20 bg-surface-2/50" : "border-line bg-surface-2/50")}
            >
              <span className={clsx("mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2", ok ? "border-ok bg-ok text-[var(--on-ok)]" : "border-line-strong")}>
                {ok && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 20 }}>
                    <Check className="size-3" strokeWidth={3.5} />
                  </motion.span>
                )}
              </span>
              <span className={ok ? "text-fg" : "text-fg-2"}>
                <Rich text={pick(o.label)} />
                <span className="sr-only">{ok ? l(" (done)", " (fait)") : l(" (not done yet)", " (pas encore fait)")}</span>
              </span>
            </motion.li>
          );
        })}
      </ul>
      {!results && <p className="mt-2 text-xs text-fg-3">{l("Objectives are checked each time you press Run.", "Les objectifs sont vérifiés à chaque fois que tu appuies sur Exécuter.")}</p>}
      {results && !allDone && lastRun && (lastRun.problems.length > 0 || lastRun.stopped) && (
        <p className="mt-3 rounded-md bg-accent-soft p-3 text-sm text-fg" role="status">
          {lastRun.problems.some((p) => p.severity === "error")
            ? l("PHP stopped with an error: open the Problems tab to see what it means and where.", "PHP s'est arrêté sur une erreur : ouvre l'onglet Problèmes pour voir ce qu'elle veut dire et où.")
            : l("The code ran, but PHP reported something: check the Problems tab.", "Le code a tourné, mais PHP a signalé quelque chose : regarde l'onglet Problèmes.")}
        </p>
      )}

      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="mt-5 rounded-lg border border-ok/30 bg-ok-soft p-4"
            role="status"
          >
            <p className="flex items-center gap-2 text-sm font-semibold text-ok">
              <span className="grid size-5 place-items-center rounded-full bg-ok text-[var(--on-ok)]">
                <Check className="size-3.5" strokeWidth={3} />
              </span>
              {name ? l(`Nice, ${name}!`, `Bien joué, ${name} !`) : l("Nice!", "Bien joué !")}
            </p>
            <p className="mt-1.5 text-sm text-fg">
              {l("Every objective passes. Have a look at the Trace tab to see how PHP ran it, then continue.", "Tous les objectifs passent. Jette un œil à l'onglet Trace pour voir comment PHP l'a exécuté, puis continue.")}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {firstOpen && (
        <div className="mt-4">
          {level > 0 && (
            <div className="space-y-2">
              {firstOpen.hints.slice(0, level).map((h, i) => (
                <motion.p key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="rounded-md border border-warn/25 bg-warn-soft p-3 text-sm text-fg">
                  <span className="mb-0.5 block text-[11px] font-semibold text-warn">{hintNames[i]}</span>
                  <Rich text={pick(h)} />
                </motion.p>
              ))}
            </div>
          )}
          {level < 3 && (
            <button
              onClick={() => {
                setHintLevel((h) => ({ ...h, [firstOpen.id]: level + 1 }));
                if (level + 1 >= 3) onWalkthrough();
              }}
              className="mt-2 flex items-center gap-1.5 text-sm text-fg-2 hover:text-fg"
            >
              <Lightbulb className="size-4 text-warn" />
              {level === 0 ? l("Need a hint?", "Besoin d'un indice ?") : l(`Show the ${hintNames[level].toLowerCase()}`, `Voir : ${hintNames[level].toLowerCase()}`)}
            </button>
          )}
          <p className="mt-1 text-[11px] text-fg-3">{l("Hints never cost XP. Solving without the walkthrough or the solution earns a star.", "Les indices ne coûtent pas d'XP. Réussir sans la solution guidée ni la solution rapporte une étoile.")}</p>
        </div>
      )}
      {!allDone && (
        <div className="mt-3">
          {showSolution ? (
            <div className="rounded-md border border-line bg-surface-2/60 p-3">
              <p className="text-[11px] font-semibold text-fg-3">{l("One possible solution", "Une solution possible")}</p>
              {Object.entries(step.solution).map(([p, code]) => (
                <div key={p} className="mt-2">
                  {Object.keys(step.solution).length > 1 && <p className="font-mono text-[11px] text-accent-fg">{p}</p>}
                  <pre className="scrollbar-thin mt-1 max-h-56 overflow-auto rounded bg-[var(--editor-bg)] p-2 font-mono text-[11.5px] leading-relaxed">{code}</pre>
                </div>
              ))}
              <Button size="sm" variant="secondary" className="mt-2" onClick={() => onFiles({ ...files, ...step.solution })}>
                {l("Use it in the editor", "L'utiliser dans l'éditeur")}
              </Button>
            </div>
          ) : (
            <button
              onClick={() => {
                setShowSolution(true);
                onWalkthrough();
              }}
              className="flex items-center gap-1.5 text-xs text-fg-3 hover:text-fg-2"
            >
              <Eye className="size-3.5" /> {l("Show a solution", "Voir une solution")}
            </button>
          )}
        </div>
      )}

      {lesson.doc && (
        <Link href={`/docs/${lesson.doc}`} target="_blank" className="mt-4 flex items-center gap-1.5 text-xs text-fg-3 hover:text-accent-fg">
          <BookOpen className="size-3.5" /> {l("Read the guide on this topic", "Lire le guide sur ce sujet")}
        </Link>
      )}

      <div className="mt-auto pt-6">
        <Button
          size="lg"
          data-nudge={allDone}
          variant={allDone ? (challenge ? "ok" : "primary") : "secondary"}
          className="w-full disabled:text-fg-3 disabled:opacity-100 disabled:shadow-none"
          disabled={!allDone}
          onClick={onNext}
        >
          {allDone ? (
            <>
              {l("Continue", "Continuer")} <ChevronRight className="size-4" />
            </>
          ) : (
            l(`${results?.filter(Boolean).length ?? 0}/${step.objectives.length} objectives`, `${results?.filter(Boolean).length ?? 0}/${step.objectives.length} objectifs`)
          )}
        </Button>
        {onBack && (
          <button onClick={onBack} className="mt-3 text-xs text-fg-3 hover:text-fg-2">
            {l("← Previous step", "← Étape précédente")}
          </button>
        )}
      </div>
    </div>
  );

  const ide = (
    <Ide
      files={files}
      onFilesChange={onFiles}
      version={version}
      onVersionChange={setVersion}
      probes={step.probes}
      request={step.request}
      onResult={onResult}
      onReset={onReset}
      aside={sheet ? <CheatPanel sheet={sheet} /> : undefined}
      asideLabel={l("Cheat sheet", "Antisèche")}
      where="lesson"
      nudgeRun={!results}
      editableTree={Object.keys(step.files).length > 1}
      toolbar={
        !isDesktop ? (
          <button onClick={() => setMobileGuide(true)} className="flex h-8 items-center gap-1 rounded-md px-2 text-xs font-medium text-accent-fg hover:bg-accent-soft">
            <ChevronLeft className="size-3.5" /> {l("Instructions", "Consignes")}
          </button>
        ) : (
          <span className="px-1 text-xs text-fg-3">{l(`Step ${index + 1} of ${lesson.steps.length}`, `Étape ${index + 1} sur ${lesson.steps.length}`)}</span>
        )
      }
    />
  );

  if (isDesktop)
    return (
      <div className="flex h-full min-h-0">
        <aside className="scrollbar-thin w-[min(400px,32vw)] shrink-0 overflow-y-auto border-r border-line bg-surface">{guide}</aside>
        <main className="min-w-0 flex-1">{ide}</main>
      </div>
    );
  // Smaller screens: the instructions and the IDE take turns.
  return mobileGuide ? (
    <div className="scrollbar-thin h-full overflow-y-auto bg-surface">
      {guide}
      <div className="sticky bottom-0 border-t border-line bg-surface p-3">
        <Button size="lg" className="w-full" data-nudge={!results} onClick={() => setMobileGuide(false)}>
          {l("Open the editor", "Ouvrir l'éditeur")} <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  ) : (
    <div className="flex h-full flex-col">
      <button
        onClick={() => setMobileGuide(true)}
        className={clsx("flex items-center gap-2 border-b border-line px-4 py-2 text-left text-xs", allDone ? "bg-ok-soft text-ok" : "bg-surface text-fg-2")}
      >
        {allDone ? <Check className="size-3.5" /> : <Target className="size-3.5 text-accent-fg" />}
        <span className="truncate">{allDone ? l("All objectives done: tap to continue", "Tous les objectifs sont faits : touche pour continuer") : firstOpen ? pick(firstOpen.label) : pick(step.title)}</span>
      </button>
      <div className="min-h-0 flex-1">{ide}</div>
    </div>
  );
}

export function useStepNav() {
  return useMemo(() => ({}), []);
}
