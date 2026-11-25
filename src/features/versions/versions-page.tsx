"use client";

import { clsx } from "clsx";
import { useState } from "react";
import { AlertTriangle, ArrowRight, Columns2, History, Play, Sparkles } from "lucide-react";
import Link from "next/link";
import { Rich } from "@/components/rich";
import { LinkButton } from "@/components/ui/button";
import { CompareRunner } from "@/features/ide/compare";
import { Example } from "@/features/ide/example";
import { useL, usePick } from "@/i18n";
import { PHP_VERSIONS, type PhpVersion } from "@/php/types";
import { VERSIONS_TIMELINE } from "./data";
import type { VersionFeature, VersionInfo } from "./types";

const runnable = (v: string): v is PhpVersion => (PHP_VERSIONS as readonly string[]).includes(v);
const LESSON: Record<string, string> = { "7.4": "php7-recap", "8.0": "php80", "8.1": "php81", "8.2": "php82", "8.3": "php83", "8.4": "php84", "8.5": "php85" };

/** PHP 7.0 → 8.5: what each release added, with code that runs on the real versions. */
export function VersionsPage() {
  const l = useL();
  const pick = usePick();
  const newest = [...VERSIONS_TIMELINE].reverse();
  const [selected, setSelected] = useState(newest[0].version);
  const v = VERSIONS_TIMELINE.find((x) => x.version === selected)!;
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 pb-28 md:pb-16">
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-accent-fg">
            <History className="size-4" /> {l("Ten years of PHP", "Dix ans de PHP")}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">{l("PHP 7.0 → 8.5: what changed", "De PHP 7.0 à 8.5 : ce qui a changé")}</h1>
          <p className="mt-2 max-w-[65ch] text-lg leading-relaxed text-fg-2">
            {l(
              "Every release, its big ideas and the changes that can break old code. From 7.4 on, each example runs on real interpreters, so you can see the difference for yourself.",
              "Chaque version, ses grandes idées et les changements qui peuvent casser du vieux code. À partir de 7.4, chaque exemple tourne sur de vrais interpréteurs : tu vois la différence par toi-même.",
            )}
          </p>
        </div>
        <LinkButton href="/learn/php7-recap" variant="secondary">
          {l("Take the chapter", "Suivre le chapitre")} <ArrowRight className="size-4" />
        </LinkButton>
      </div>

      <ol className="scrollbar-thin mt-8 flex gap-2 overflow-x-auto pb-2" aria-label={l("Releases", "Versions")}>
        {VERSIONS_TIMELINE.map((x, i) => (
          <li key={x.version} className="shrink-0">
            <button
              onClick={() => setSelected(x.version)}
              aria-pressed={x.version === selected}
              className={clsx(
                "relative w-28 rounded-xl border px-3 py-2 text-left transition-colors",
                x.version === selected ? "border-accent bg-accent-soft shadow-[0_3px_0_var(--accent-deep)]" : "border-line bg-elevated shadow-[0_2px_0_var(--edge)] hover:border-line-strong",
              )}
            >
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full" style={{ background: `var(--lane-${i % 6})` }} />
                <span className="font-mono text-sm font-semibold">PHP {x.version}</span>
              </span>
              <span className="mt-0.5 block text-[11px] text-fg-3">{x.released.slice(0, 4)}</span>
              {runnable(x.version) && <span className="absolute top-1.5 right-2 text-[9px] font-semibold tracking-wide text-ok uppercase">{l("run", "exéc.")}</span>}
            </button>
          </li>
        ))}
      </ol>

      <Release v={v} />

      <section className="mt-14" aria-labelledby="all">
        <h2 id="all" className="text-xl font-semibold tracking-tight">
          {l("At a glance", "En un coup d'œil")}
        </h2>
        <div className="scrollbar-thin mt-4 overflow-x-auto rounded-xl border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-2 text-xs text-fg-2">
              <tr>
                <th className="px-3 py-2">{l("Version", "Version")}</th>
                <th className="px-3 py-2">{l("Released", "Sortie")}</th>
                <th className="px-3 py-2">{l("Headline", "En bref")}</th>
                <th className="px-3 py-2">{l("Key features", "Nouveautés clés")}</th>
              </tr>
            </thead>
            <tbody>
              {newest.map((x) => (
                <tr key={x.version} className="border-t border-line align-top">
                  <td className="px-3 py-2">
                    <button onClick={() => (setSelected(x.version), window.scrollTo({ top: 0, behavior: "smooth" }))} className="font-mono font-semibold text-accent-fg hover:underline">
                      {x.version}
                    </button>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-fg-3">{x.released}</td>
                  <td className="px-3 py-2 text-fg">{pick(x.headline)}</td>
                  <td className="px-3 py-2 text-fg-2">{x.features.map((f) => pick(f.title)).join(" · ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Release({ v }: { v: VersionInfo }) {
  const l = useL();
  const pick = usePick();
  const lesson = LESSON[v.version];
  return (
    <section className="mt-6" aria-labelledby="release">
      <div className="rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-card)] sm:p-7">
        <p className="font-mono text-sm text-fg-3">
          PHP {v.version} · {new Date(v.released).toLocaleDateString(l("en", "fr"), { year: "numeric", month: "long", day: "numeric" })}
        </p>
        <h2 id="release" className="mt-1 text-2xl font-semibold tracking-tight">
          {pick(v.headline)}
        </h2>
        <p className="mt-2 max-w-[70ch] leading-relaxed text-fg-2">
          <Rich text={pick(v.summary)} />
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {lesson && (
            <LinkButton href={`/learn/${lesson}`} size="sm">
              <Play className="size-3.5 fill-current" /> {l(`Lesson: PHP ${v.version}`, `Leçon : PHP ${v.version}`)}
            </LinkButton>
          )}
          {!runnable(v.version) && <p className="text-xs text-fg-3">{l("PHP 7.0 to 7.3 can't run in the browser here: examples run on 7.4, which supports all of them.", "PHP 7.0 à 7.3 ne peuvent pas tourner dans le navigateur ici : les exemples s'exécutent sur 7.4, qui les supporte tous.")}</p>}
        </div>
      </div>

      <h3 className="mt-8 flex items-center gap-2 text-lg font-semibold">
        <Sparkles className="size-5 text-accent-fg" /> {l("New features", "Nouveautés")}
      </h3>
      <div className="mt-3 space-y-4">
        {v.features.map((f) => (
          <Feature key={f.id} f={f} release={v.version} />
        ))}
      </div>

      {v.breaking && v.breaking.length > 0 && (
        <>
          <h3 className="mt-10 flex items-center gap-2 text-lg font-semibold">
            <AlertTriangle className="size-5 text-warn" /> {l("Changes that can break old code", "Changements qui peuvent casser du vieux code")}
          </h3>
          <div className="mt-3 space-y-4">
            {v.breaking.map((f) => (
              <Feature key={f.id} f={f} release={v.version} breaking />
            ))}
          </div>
        </>
      )}

      {v.deprecations && v.deprecations.length > 0 && (
        <>
          <h3 className="mt-10 text-lg font-semibold">{l("Deprecated in this release", "Déprécié dans cette version")}</h3>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-fg-2 marker:text-fg-3">
            {v.deprecations.map((d) => (
              <li key={d.en}>
                <Rich text={pick(d)} />
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-fg-3">
            {l("Deprecated means: it still works, PHP warns you, and it will be removed in a future major version.", "Déprécié veut dire : ça marche encore, PHP te prévient, et ce sera supprimé dans une future version majeure.")}{" "}
            <Link href="/docs/guide-versions" className="text-accent-fg underline underline-offset-2">
              {l("Read the guide", "Lire le guide")}
            </Link>
          </p>
        </>
      )}
    </section>
  );
}

function Feature({ f, release, breaking }: { f: VersionFeature; release: string; breaking?: boolean }) {
  const l = useL();
  const pick = usePick();
  const [comparing, setComparing] = useState(false);
  const version: PhpVersion = runnable(release) ? release : "7.4";
  return (
    <article className={clsx("rounded-xl border bg-surface p-4 sm:p-5", breaking ? "border-warn/40" : "border-line")}>
      <h4 className="font-semibold">{pick(f.title)}</h4>
      <p className="mt-1 text-sm leading-relaxed text-fg-2">
        <Rich text={pick(f.body)} />
      </p>
      <div className={clsx("mt-3 grid gap-3", f.before && "lg:grid-cols-2")}>
        {f.before && (
          <div>
            <p className="mb-1 text-[11px] font-semibold tracking-wide text-fg-3 uppercase">{l("Before", "Avant")}</p>
            <Example code={f.before} version={version} editable />
          </div>
        )}
        <div>
          {f.before && <p className="mb-1 text-[11px] font-semibold tracking-wide text-ok uppercase">{l(`With PHP ${release}`, `Avec PHP ${release}`)}</p>}
          <Example code={f.after} version={version} editable />
        </div>
      </div>
      {f.compare && f.compare.length > 1 && (
        <div className="mt-3">
          {comparing ? (
            <CompareRunner files={{ "index.php": f.after }} versions={f.compare} autoStart />
          ) : (
            <button onClick={() => setComparing(true)} className="flex items-center gap-1.5 text-sm font-medium text-accent-fg hover:underline">
              <Columns2 className="size-4" /> {l(`Run it on PHP ${f.compare.join(" and ")}`, `L'exécuter sur PHP ${f.compare.join(" et ")}`)}
            </button>
          )}
        </div>
      )}
    </article>
  );
}
