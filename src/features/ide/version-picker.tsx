"use client";

import { clsx } from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { useL } from "@/i18n";
import { LATEST, PHP_VERSIONS, type PhpVersion } from "@/php/types";
import { useRuntimeStatus } from "./use-runner";

export const RELEASED: Record<PhpVersion, string> = {
  "7.4": "2019",
  "8.0": "2020",
  "8.1": "2021",
  "8.2": "2022",
  "8.3": "2023",
  "8.4": "2024",
  "8.5": "2025",
};

/** A lane color per version, used in comparisons. */
export const versionColor = (v: PhpVersion) => `var(--lane-${PHP_VERSIONS.indexOf(v) % 6})`;

function StatusDot({ version }: { version: PhpVersion }) {
  const status = useRuntimeStatus(version);
  if (status === "loading") return <Loader2 className="size-3 animate-spin text-fg-3" aria-hidden />;
  return <span className={clsx("size-1.5 rounded-full", status === "ready" ? "bg-ok" : "bg-line-strong")} aria-hidden />;
}

export function VersionPicker({ value, onChange, compact }: { value: PhpVersion; onChange: (v: PhpVersion) => void; compact?: boolean }) {
  const l = useL();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={l(`PHP version: ${value}`, `Version de PHP : ${value}`)}
        className={clsx(
          "flex items-center gap-1.5 rounded-md border border-line bg-elevated font-mono font-semibold text-fg shadow-[0_1px_0_var(--edge)] hover:border-line-strong",
          compact ? "h-7 px-2 text-[11px]" : "h-8 px-2.5 text-xs",
        )}
      >
        <StatusDot version={value} />
        PHP {value}
        <ChevronDown className="size-3.5 text-fg-3" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, transition: { duration: 0.1 } }}
            role="listbox"
            aria-label={l("PHP version", "Version de PHP")}
            className="absolute right-0 z-50 mt-1.5 w-56 overflow-hidden rounded-xl border border-line bg-elevated p-1 shadow-[var(--shadow-lg)]"
          >
            {[...PHP_VERSIONS].reverse().map((v) => (
              <li key={v}>
                <button
                  role="option"
                  aria-selected={v === value}
                  onClick={() => {
                    onChange(v);
                    setOpen(false);
                  }}
                  className={clsx("flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm", v === value ? "bg-accent-soft text-accent-fg" : "hover:bg-surface-2")}
                >
                  <span className="size-2 rounded-full" style={{ background: versionColor(v) }} aria-hidden />
                  <span className="font-mono font-semibold">PHP {v}</span>
                  <span className="text-[11px] text-fg-3">{RELEASED[v]}</span>
                  {v === LATEST && <span className="rounded-full bg-ok-soft px-1.5 text-[10px] font-semibold text-ok">{l("latest", "dernière")}</span>}
                  <span className="ml-auto flex items-center gap-1.5">
                    <StatusDot version={v} />
                    {v === value && <Check className="size-3.5" />}
                  </span>
                </button>
              </li>
            ))}
            <li className="border-t border-line px-2.5 pt-1.5 pb-1 text-[11px] leading-snug text-fg-3">
              {l("Real PHP interpreters. Each one downloads once (about 6–8 MB).", "De vrais interpréteurs PHP. Chacun se télécharge une fois (environ 6 à 8 Mo).")}
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
