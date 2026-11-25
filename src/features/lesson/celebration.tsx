"use client";

import { clsx } from "clsx";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, BookOpen, Check, Zap, Map as MapIcon, PartyPopper, RotateCcw, Sparkles, Code2, X } from "lucide-react";
import type { Lesson } from "@/features/curriculum";
import { Rich } from "@/components/rich";
import { useProgress } from "@/features/progress/store";
import { ACHIEVEMENTS, levelFor, starsFor } from "@/features/progress/rules";
import { useL, usePick, useT, type MessageKey } from "@/i18n";
import { Button, LinkButton } from "@/components/ui/button";
import { Confetti } from "@/components/ui/confetti";
import { DynamicIcon, ProgressBar } from "@/components/ui/misc";
import type { RunStats } from "./lesson-player";

type Result = { gained: number; first: boolean; bonus: number; best: number };

export function Celebration({
  lesson,
  next,
  onReplay,
  startedAt,
  stats,
}: {
  lesson: Lesson;
  next: Lesson | null;
  onReplay: () => void;
  startedAt: number;
  stats: RunStats;
}) {
  const t = useT();
  const l = useL();
  const pick = usePick();
  const completeLesson = useProgress((s) => s.completeLesson);
  const clearLesson = useProgress((s) => s.clearLesson);
  const xp = useProgress((s) => s.xp);
  const name = useProgress((s) => s.name);
  const achievements = useProgress((s) => s.achievements);
  const [result, setResult] = useState<Result | null>(null);
  const done = useRef(false);
  const [xpBefore] = useState(() => useProgress.getState().xp);
  const [prevBest] = useState(() => useProgress.getState().completed[lesson.id]?.stars ?? 0);
  const stars = starsFor(stats);

  const setQuietToasts = useProgress((s) => s.setQuietToasts);
  useEffect(() => {
    setQuietToasts(true);
    return () => setQuietToasts(false);
  }, [setQuietToasts]);

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    setResult(completeLesson(lesson.id, lesson.xp, !!lesson.boss, stars));
    clearLesson(lesson.id);
  }, [completeLesson, clearLesson, lesson, stars]);

  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  useEffect(() => {
    if (!result) return;
    const c = animate(count, result.gained, { duration: 1.1, ease: "easeOut", delay: 0.9 });
    return () => c.stop();
  }, [result, count]);

  const lv = levelFor(xp);
  const leveledUp = levelFor(xpBefore).level < lv.level && !!result?.gained;
  const recent = ACHIEVEMENTS.filter((a) => (achievements[a.id] ?? 0) >= startedAt);
  const reasons = [l("Lesson complete", "Leçon terminée"), l("No walkthrough or solution", "Ni solution guidée ni solution"), l("Three failed runs or fewer", "Trois exécutions ratées ou moins")];
  const earned = [true, !stats.walkthrough, stats.mistakes <= 3];
  const titles = t.list("levels");

  return (
    <div className="scrollbar-thin bg-dots h-full overflow-y-auto px-4 py-10">
      <div className="relative mx-auto max-w-xl text-center">
        <Confetti count={stars === 3 ? 56 : 30} />
        <div className="flex items-end justify-center gap-2" role="img" aria-label={l(`${stars} of 3 stars`, `${stars} étoiles sur 3`)}>
          {[1, 2, 3].map((i) => (
            <motion.span
              key={i}
              initial={{ scale: 0, rotate: -40, y: 10 }}
              animate={{ scale: 1, rotate: 0, y: i === 2 ? -10 : 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 13, delay: 0.15 + i * 0.22 }}
            >
              <svg viewBox="0 0 24 24" className={clsx(i === 2 ? "size-20" : "size-16", "drop-shadow-[0_3px_0_rgba(0,0,0,0.12)]", i <= stars ? "text-(color:--star)" : "text-line-strong")}>
                <path
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                  d="M12 2.6l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17l-5.7 3.1 1.2-6.4L2.8 9.3l6.4-.8z"
                />
              </svg>
            </motion.span>
          ))}
        </div>
        <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mt-6 text-3xl font-semibold tracking-tight">
          {name ? l(`Well done, ${name}!`, `Bravo, ${name} !`) : l("Lesson complete!", "Leçon terminée !")}
        </motion.h1>
        <p className="mt-1 text-fg-2">{pick(lesson.title)}</p>
        {stars > prevBest && prevBest > 0 && <p className="mt-2 text-sm font-semibold text-warn">{l("New best!", "Nouveau record !")}</p>}

        <ul className="mx-auto mt-6 flex max-w-md flex-wrap justify-center gap-2">
          {reasons.map((r, i) => (
            <motion.li
              key={r}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.1 }}
              className={clsx("flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs", earned[i] ? "border-[var(--star)]/40 bg-warn-soft text-fg" : "border-line text-fg-3")}
            >
              {earned[i] ? <Check className="size-3.5 text-warn" strokeWidth={3} /> : <X className="size-3.5" />}
              {r}
            </motion.li>
          ))}
        </ul>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-line bg-surface p-4 text-left shadow-[var(--shadow-card)]">
            <p className="text-xs text-fg-3">{l("XP earned", "XP gagnés")}</p>
            <p className="mt-1 flex items-baseline gap-1 text-3xl font-semibold text-warn">
              +<motion.span>{rounded}</motion.span>
              <Zap className="size-5" />
            </p>
            {!!result?.bonus && (
              <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-accent-fg">
                <Sparkles className="size-3.5" /> {l(`+${result.bonus} flawless bonus`, `+${result.bonus} bonus sans faute`)}
              </p>
            )}
            {result && !result.first && <p className="mt-1 text-xs text-fg-3">{l("Replay: XP is only awarded the first time, but practice always counts.", "Rejouée : les XP ne sont donnés que la première fois, mais l'entraînement compte toujours.")}</p>}
          </div>
          <div className="rounded-xl border border-line bg-surface p-4 text-left shadow-[var(--shadow-card)]">
            <p className="text-xs text-fg-3">{t("common.level", { n: lv.level })}</p>
            <p className="mt-1 font-semibold">{titles[lv.level - 1]}</p>
            <ProgressBar value={lv.progress} className="mt-3" label={l("Progress to next level", "Progression vers le niveau suivant")} />
            <p className="mt-1.5 text-[11px] text-fg-3">{l(`${xp - lv.floor} / ${lv.ceil - lv.floor} XP to level ${lv.level + 1}`, `${xp - lv.floor} / ${lv.ceil - lv.floor} XP vers le niveau ${lv.level + 1}`)}</p>
            {leveledUp && (
              <p className="mt-1 flex items-center gap-1 text-xs font-medium text-accent-fg">
                <PartyPopper className="size-3.5" /> {l("Level up!", "Niveau supérieur !")}
              </p>
            )}
          </div>
        </div>

        {recent.length > 0 && (
          <div className="mt-3 rounded-xl border border-line bg-surface p-4 text-left shadow-[var(--shadow-card)]">
            <p className="text-xs text-fg-3">{l("Badges earned in this lesson", "Badges gagnés dans cette leçon")}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {recent.map((a, i) => (
                <motion.li
                  key={a.id}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + i * 0.12, type: "spring", stiffness: 300, damping: 18 }}
                  className="flex items-center gap-2 rounded-lg bg-warn-soft px-3 py-1.5 text-sm"
                >
                  <DynamicIcon name={a.icon} className="size-4 text-warn" /> {t(`badges.${a.id}.title` as MessageKey)}
                </motion.li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-3 rounded-xl border border-line bg-surface p-5 text-left shadow-[var(--shadow-card)]">
          <p className="text-xs font-semibold text-fg-3">{l("What you learned", "Ce que tu as appris")}</p>
          <ul className="mt-3 space-y-2">
            {lesson.recap.map((r) => (
              <li key={r.en} className="flex gap-2 text-sm text-fg-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-ok" />
                <span>
                  <Rich text={pick(r)} />
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs font-semibold text-fg-3">{l("Syntax you practised", "La syntaxe pratiquée")}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {lesson.syntax.map((c) => (
              <code key={c} className="flex items-center gap-1 rounded-lg bg-surface-2 px-2 py-1 font-mono text-xs">
                <Code2 className="size-3 text-accent-fg" />
                {c}
              </code>
            ))}
          </div>
          {lesson.doc && (
            <Link href={`/docs/${lesson.doc}`} className="mt-4 flex items-center gap-1.5 text-xs font-medium text-accent-fg hover:underline">
              <BookOpen className="size-3.5" /> {l("Go further: read the guide", "Pour aller plus loin : lis le guide")}
            </Link>
          )}
        </div>

        <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
          {next ? (
            <LinkButton href={`/learn/${next.id}`} size="lg" data-nudge={true}>
              {l(`Next: ${next.title.en}`, `Suivante : ${next.title.fr}`)} <ArrowRight className="size-4" />
            </LinkButton>
          ) : (
            <LinkButton href="/playground" size="lg">
              {l("Open the Playground", "Ouvrir le bac à sable")} <ArrowRight className="size-4" />
            </LinkButton>
          )}
          <LinkButton href="/learn" variant="secondary" size="lg">
            <MapIcon className="size-4" /> {l("Learning path", "Parcours")}
          </LinkButton>
          <Button variant="ghost" size="lg" onClick={onReplay}>
            <RotateCcw className="size-4" /> {l("Replay", "Rejouer")}
          </Button>
        </div>
      </div>
    </div>
  );
}
