"use client";

import { clsx } from "clsx";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { CircleAlert, Footprints, Play, SquareTerminal } from "lucide-react";
import { useL } from "@/i18n";

const CODE = [
  ["k", "<?php"],
  ["", ""],
  ["v", '$input = "abc";'],
  ["c", "// PHP 7 and PHP 8 disagree here:"],
  ["f", 'var_dump($input == 0);'],
  ["", ""],
  ["f", 'echo str_contains($input, "b")'],
  ["f", '    ? "found" : "nope";'],
] as const;

/** Frames: typing → run on 8.5 → switch to 7.4 → run again. */
const FRAMES = 5;

const tone = (k: string) => (k === "k" ? "text-[var(--syn-keyword)] font-semibold" : k === "c" ? "text-[var(--syn-comment)] italic" : k === "v" ? "text-[var(--syn-variable)]" : "text-fg");

export function HeroDemo() {
  const l = useL();
  const reduce = useReducedMotion();
  const [frame, setFrame] = useState(reduce ? 2 : 0);
  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setFrame((f) => (f + 1) % FRAMES), 2400);
    return () => clearInterval(t);
  }, [reduce]);
  const version = frame >= 3 ? "7.4" : "8.5";
  const ran = frame === 2 || frame === 4;
  const typed = frame === 0 ? 4 : CODE.length;
  return (
    <div className="relative" aria-hidden>
      <div className="overflow-hidden rounded-2xl border border-line bg-[var(--editor-bg)] shadow-[var(--shadow-lg)]">
        <div className="flex h-10 items-center gap-2 border-b border-line bg-surface px-3">
          <span className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-[var(--lane-0)]/70" />
            <span className="size-2.5 rounded-full bg-[var(--lane-3)]/70" />
            <span className="size-2.5 rounded-full bg-[var(--lane-1)]/70" />
          </span>
          <span className="ml-2 rounded-t-md border-x border-t border-line bg-[var(--editor-bg)] px-3 py-1 font-mono text-[11px] text-fg">index.php</span>
          <span className="ml-auto flex items-center gap-1.5">
            <motion.span
              key={version}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={clsx("rounded-md border px-2 py-0.5 font-mono text-[11px] font-semibold", version === "7.4" ? "border-warn/50 bg-warn-soft text-warn" : "border-line bg-elevated text-fg")}
            >
              PHP {version}
            </motion.span>
            <span className={clsx("flex items-center gap-1 rounded-md bg-ok px-2 py-0.5 text-[11px] font-semibold text-[var(--on-ok)] transition-transform", (frame === 1 || frame === 3) && "scale-95 brightness-110")}>
              <Play className="size-3 fill-current" /> Run
            </span>
          </span>
        </div>
        <div className="grid grid-cols-[2.2rem_1fr] py-3 font-mono text-[13px] leading-[1.7]">
          {CODE.map(([k, text], i) => (
            <div key={i} className="contents">
              <span className={clsx("pr-2 text-right text-fg-3/70 select-none", ran && i === 6 && "text-accent-fg")}>{i + 1}</span>
              <span className={clsx("pr-4 whitespace-pre", tone(k), ran && version === "7.4" && i === 6 && "bg-bad-soft")}>
                {i < typed ? text : ""}
                {i === typed - 1 && frame === 0 && <span className="caret ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 bg-accent-mark" />}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-line bg-surface">
          <div className="flex h-8 items-center gap-4 border-b border-line px-3 text-[10.5px] font-semibold tracking-wide text-fg-3 uppercase">
            <span className="flex items-center gap-1 text-fg">
              <SquareTerminal className="size-3.5" /> {l("Output", "Sortie")}
            </span>
            <span className="flex items-center gap-1">
              <CircleAlert className="size-3.5" /> {l("Problems", "Problèmes")}
              {ran && version === "7.4" && <span className="rounded-full bg-bad px-1.5 text-[9px] text-white">1</span>}
            </span>
            <span className="flex items-center gap-1">
              <Footprints className="size-3.5" /> Trace
            </span>
          </div>
          <div className="terminal min-h-[5.6rem] bg-term px-4 py-2.5 font-mono text-[12.5px] leading-relaxed">
            <AnimatePresence mode="wait">
              {ran ? (
                <motion.div key={version} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {version === "8.5" ? (
                    <>
                      <p>bool(false)</p>
                      <p>found</p>
                      <p className="mt-1 text-[11px] text-[var(--t-muted)]">exit 0 · PHP 8.5.12 · 9 ms</p>
                    </>
                  ) : (
                    <>
                      <p className="text-[var(--t-yellow)]">bool(true)</p>
                      <p className="text-[var(--t-red)]">PHP Fatal error: Uncaught Error: Call to undefined function str_contains()</p>
                      <p className="mt-1 text-[11px] text-[var(--t-muted)]">exit 255 · PHP 7.4.33 · 7 ms</p>
                    </>
                  )}
                </motion.div>
              ) : (
                <motion.p key="wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[var(--t-muted)]">
                  {frame === 3 ? l("Switching to PHP 7.4…", "Passage à PHP 7.4…") : l("Press Run (Ctrl+Enter)…", "Appuie sur Exécuter (Ctrl+Entrée)…")}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <motion.div
        animate={{ opacity: ran ? 1 : 0, y: ran ? 0 : 6 }}
        className="absolute -bottom-5 left-6 max-w-[19rem] rounded-xl border border-line bg-elevated px-3.5 py-2.5 text-[12.5px] leading-snug shadow-[var(--shadow-lg)] sm:-left-6"
      >
        {version === "8.5"
          ? l("Real PHP 8.5: \"abc\" is no longer equal to 0, and str_contains() exists.", "Du vrai PHP 8.5 : \"abc\" n'est plus égal à 0, et str_contains() existe.")
          : l("Same code on real PHP 7.4: a different answer, and a fatal error.", "Le même code sur du vrai PHP 7.4 : une autre réponse, et une erreur fatale.")}
      </motion.div>
    </div>
  );
}
