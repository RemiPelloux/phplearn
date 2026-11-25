"use client";

import { clsx } from "clsx";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Hash, Search, Sparkles, X } from "lucide-react";
import { Rich } from "@/components/rich";
import { Example } from "@/features/ide/example";
import { useL, usePick } from "@/i18n";
import { LATEST } from "@/php/types";
import { REF_CATEGORIES, REFERENCE } from "./data";
import type { RefCategory, RefEntry } from "./types";

/** Every function and construct, searchable, each with an example that runs on real PHP. */
export function ReferencePage() {
  const l = useL();
  const pick = usePick();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<RefCategory | "all">("all");
  const [open, setOpen] = useState<string | null>(null);

  // Deep link: /reference#str_contains opens that entry.
  useEffect(() => {
    const fromHash = () => {
      const name = decodeURIComponent(window.location.hash.slice(1));
      if (name && REFERENCE.some((r) => r.name === name)) {
        setOpen(name);
        setTimeout(() => document.getElementById(`ref-${name}`)?.scrollIntoView({ block: "start" }), 50);
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return REFERENCE.filter(
      (r) =>
        (cat === "all" || r.category === cat) &&
        (!needle || r.name.toLowerCase().includes(needle) || r.signature.toLowerCase().includes(needle) || r.summary.en.toLowerCase().includes(needle) || r.summary.fr.toLowerCase().includes(needle)),
    );
  }, [q, cat]);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 pb-28 md:pb-16">
      <h1 className="text-3xl font-semibold tracking-tight">{l("PHP reference", "Référence PHP")}</h1>
      <p className="mt-2 max-w-[65ch] text-lg leading-relaxed text-fg-2">
        {l(
          `${REFERENCE.length} functions and language constructs you'll use every day, each explained in plain words with an example you can run on any PHP version and edit.`,
          `${REFERENCE.length} fonctions et constructions du langage que tu utiliseras tous les jours, chacune expliquée simplement avec un exemple que tu peux exécuter sur n'importe quelle version de PHP et modifier.`,
        )}
      </p>
      <div className="mt-6 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <label className="relative block">
            <Search className="pointer-events-none absolute top-2.5 left-3 size-4 text-fg-3" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={l("Search: str_, array, match…", "Chercher : str_, array, match…")}
              aria-label={l("Search the reference", "Chercher dans la référence")}
              className="w-full rounded-lg border border-line bg-surface py-2 pr-8 pl-9 text-sm outline-none focus:border-accent"
            />
            {q && (
              <button onClick={() => setQ("")} className="absolute top-2 right-2 rounded p-0.5 text-fg-3 hover:text-fg" aria-label={l("Clear search", "Effacer la recherche")}>
                <X className="size-4" />
              </button>
            )}
          </label>
          <nav className="mt-4 flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible" aria-label={l("Categories", "Catégories")}>
            {[{ id: "all" as const, title: { en: "Everything", fr: "Tout" } }, ...REF_CATEGORIES].map((c) => {
              const n = c.id === "all" ? REFERENCE.length : REFERENCE.filter((r) => r.category === c.id).length;
              return (
                <button
                  key={c.id}
                  onClick={() => setCat(c.id)}
                  aria-pressed={cat === c.id}
                  className={clsx(
                    "flex shrink-0 items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 text-left text-sm whitespace-nowrap",
                    cat === c.id ? "bg-accent-soft font-medium text-accent-fg" : "text-fg-2 hover:bg-surface-2 hover:text-fg",
                  )}
                >
                  {pick(c.title)}
                  <span className="text-[11px] text-fg-3 tabular-nums">{n}</span>
                </button>
              );
            })}
          </nav>
        </aside>
        <div className="min-w-0">
          {cat !== "all" && <p className="mb-4 text-sm text-fg-2">{pick(REF_CATEGORIES.find((c) => c.id === cat)?.blurb)}</p>}
          <ul className="divide-y divide-line rounded-xl border border-line bg-surface shadow-[var(--shadow-card)]">
            {list.map((r) => (
              <Entry key={r.name} entry={r} open={open === r.name} onToggle={() => setOpen(open === r.name ? null : r.name)} />
            ))}
            {!list.length && <li className="p-6 text-sm text-fg-3">{l("Nothing matches. Try a shorter word.", "Rien ne correspond. Essaie un mot plus court.")}</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Entry({ entry: r, open, onToggle }: { entry: RefEntry; open: boolean; onToggle: () => void }) {
  const l = useL();
  const pick = usePick();
  return (
    <li id={`ref-${r.name}`} className="scroll-mt-20">
      <button onClick={onToggle} aria-expanded={open} className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-surface-2/50">
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <code className="font-mono text-sm font-semibold text-[var(--syn-function)]">{r.name}</code>
            {r.since && (
              <span className="flex items-center gap-0.5 rounded-full bg-accent-soft px-1.5 py-px font-mono text-[10px] font-semibold text-accent-fg">
                <Sparkles className="size-2.5" /> PHP {r.since}+
              </span>
            )}
          </span>
          <span className="mt-0.5 block text-sm text-fg-2">
            <Rich text={pick(r.summary)} />
          </span>
        </span>
        <ChevronDown className={clsx("mt-1 size-4 shrink-0 text-fg-3 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="px-4 pb-4">
          <pre className="scrollbar-thin overflow-x-auto rounded-md bg-surface-2 px-3 py-2 font-mono text-[12.5px] text-fg">{r.signature}</pre>
          {r.note && (
            <p className="mt-2 rounded-md border border-warn/25 bg-warn-soft px-3 py-2 text-sm text-fg">
              <Rich text={pick(r.note)} />
            </p>
          )}
          <Example code={r.example} version={r.version ?? LATEST} editable className="mt-3" />
          {r.seeAlso && r.seeAlso.length > 0 && (
            <p className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-fg-3">
              {l("See also:", "Voir aussi :")}
              {r.seeAlso.map((s) => (
                <a key={s} href={`#${encodeURIComponent(s)}`} className="flex items-center gap-0.5 rounded bg-surface-2 px-1.5 py-0.5 font-mono text-fg-2 hover:text-accent-fg">
                  <Hash className="size-3" />
                  {s}
                </a>
              ))}
            </p>
          )}
        </div>
      )}
    </li>
  );
}
