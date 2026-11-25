"use client";

import { clsx } from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Accessibility,
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Boxes,
  Braces,
  Bug,
  ChevronDown,
  Code,
  Columns2,
  Database,
  Download,
  Files,
  FlaskConical,
  Footprints,
  Globe,
  GitBranch,
  GraduationCap,
  HardDrive,
  History,
  Lightbulb,
  List,
  Package,
  Play,
  Printer,
  Quote,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  SquareFunction,
  SquareTerminal,
  TriangleAlert,
  Type,
  X,
  type LucideIcon,
} from "lucide-react";
import { getLesson as getLessonDef } from "@/features/curriculum";
import { Button, LinkButton } from "@/components/ui/button";
import { useLocale } from "@/i18n";
import { headingsOf, Markdown, nbsp } from "./markdown";
import { DOC_PAGES, DOC_SECTIONS, getDoc, neighbours } from "./pages";
import type { DocPage } from "./types";

const ICONS: Record<string, LucideIcon> = {
  Accessibility,
  BookOpenCheck,
  Boxes,
  Braces,
  Bug,
  Code,
  Columns2,
  Database,
  Download,
  Files,
  FlaskConical,
  Footprints,
  Globe,
  GitBranch,
  GraduationCap,
  HardDrive,
  History,
  Lightbulb,
  List,
  Package,
  Play,
  Quote,
  Rocket,
  ShieldCheck,
  Sparkles,
  SquareFunction,
  SquareTerminal,
  TriangleAlert,
  Type,
};

const DocIcon = ({ name, className }: { name: string; className?: string }) => {
  const I = ICONS[name] ?? BookOpenCheck;
  return <I className={className} aria-hidden />;
};

function useText() {
  const locale = useLocale();
  return { locale, l: (en: string, fr: string) => (locale === "fr" ? fr : en) };
}

function Sidebar({ current }: { current?: string }) {
  const { locale, l } = useText();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return null;
    return DOC_PAGES.filter((p) => (p.title[locale] + " " + p.lead[locale] + " " + p.body[locale]).toLowerCase().includes(needle));
  }, [q, locale]);
  return (
    <aside className="no-print min-w-0 lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:self-start lg:overflow-y-auto scrollbar-thin">
      <label className="relative block">
        <Search className="pointer-events-none absolute top-2.5 left-3 size-4 text-fg-3" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={l("Search the docs", "Chercher dans la doc")}
          aria-label={l("Search the docs", "Chercher dans la doc")}
          className="w-full rounded-lg border border-line bg-surface py-2 pr-8 pl-9 text-sm outline-none focus:border-accent"
        />
        {q && (
          <button onClick={() => setQ("")} className="absolute top-2 right-2 rounded p-0.5 text-fg-3 hover:text-fg" aria-label={l("Clear search", "Effacer la recherche")}>
            <X className="size-4" />
          </button>
        )}
      </label>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open || !!q}
        aria-controls="docs-nav"
        className="mt-3 flex w-full items-center justify-between rounded-lg border border-line bg-surface px-3 py-2 text-sm font-medium lg:hidden"
      >
        {l("All docs pages", "Toutes les pages de la doc")}
        <ChevronDown className={clsx("size-4 text-fg-3 transition-transform", (open || q) && "rotate-180")} />
      </button>
      <nav id="docs-nav" className={clsx("mt-4 space-y-5 lg:block", open || q ? "block" : "hidden")} aria-label={l("Documentation", "Documentation")}>
        {results ? (
          <div>
            <p className="px-2 text-[11px] font-semibold text-fg-3">{l(`${results.length} results`, `${results.length} résultats`)}</p>
            <ul className="mt-1 space-y-0.5">
              {results.map((p) => (
                <SideLink key={p.slug} page={p} active={p.slug === current} />
              ))}
              {!results.length && <li className="px-2 py-1 text-sm text-fg-3">{l("Nothing matches. Try “array” or “match”.", "Rien ne correspond. Essaie « array » ou « match ».")}</li>}
            </ul>
          </div>
        ) : (
          DOC_SECTIONS.map((s) => (
            <div key={s.id}>
              <p className="px-2 text-[11px] font-semibold text-fg-3">{s.title[locale]}</p>
              <ul className="mt-1 space-y-0.5">
                {DOC_PAGES.filter((p) => p.section === s.id).map((p) => (
                  <SideLink key={p.slug} page={p} active={p.slug === current} />
                ))}
              </ul>
            </div>
          ))
        )}
        <div className="border-t border-line pt-4">
          <ul className="space-y-0.5">
            <li>
              <Link href="/setup" aria-current={pathname.startsWith("/setup") ? "page" : undefined} className="block rounded-lg px-2 py-1.5 text-sm text-fg-2 hover:bg-surface-2 hover:text-fg">
                {l("Install PHP on your computer", "Installer PHP sur ton ordinateur")}
              </Link>
            </li>
            <li>
              <Link href="/reference" className="block rounded-lg px-2 py-1.5 text-sm text-fg-2 hover:bg-surface-2 hover:text-fg">
                {l("Function reference", "Référence des fonctions")}
              </Link>
            </li>
            <li>
              <Link href="/versions" className="block rounded-lg px-2 py-1.5 text-sm text-fg-2 hover:bg-surface-2 hover:text-fg">
                {l("PHP versions, 7.0 → 8.5", "Versions de PHP, 7.0 → 8.5")}
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
}

function SideLink({ page, active }: { page: DocPage; active: boolean }) {
  const { locale } = useText();
  return (
    <li>
      <Link
        href={`/docs/${page.slug}`}
        aria-current={active ? "page" : undefined}
        className={clsx("flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm", active ? "bg-accent-soft font-medium text-accent-fg" : "text-fg-2 hover:bg-surface-2 hover:text-fg")}
      >
        <DocIcon name={page.icon} className="size-4 shrink-0 opacity-70" />
        <span className="truncate">{page.title[locale]}</span>
      </Link>
    </li>
  );
}

export function DocsIndex() {
  const { locale, l } = useText();
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-10 pb-28 lg:grid-cols-[240px_minmax(0,1fr)] lg:pb-16">
      <Sidebar />
      <div className="min-w-0">
        <h1 className="text-3xl font-semibold tracking-tight text-balance">{l("Documentation", "Documentation")}</h1>
        <p className="mt-2 max-w-[62ch] text-lg leading-relaxed text-fg-2">
          {l(
            "How to use every part of the app, in-depth guides on every PHP topic in the course, and cheat sheets to print or keep open next to your editor.",
            "Comment utiliser chaque partie de l'appli, des guides détaillés sur chaque sujet PHP du cours, et des antisèches à imprimer ou à garder ouvertes à côté de ton éditeur.",
          )}
        </p>
        <Link href="/docs/start" className="group mt-6 flex max-w-xl items-center gap-4 rounded-xl border border-line bg-elevated p-4 shadow-[var(--shadow-card)] hover:border-line-strong">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent text-white">
            <Rocket className="size-5" />
          </span>
          <span className="min-w-0">
            <span className="block font-semibold">{getDoc("start")!.title[locale]}</span>
            <span className="block text-sm text-fg-2">{getDoc("start")!.lead[locale]}</span>
          </span>
          <ArrowRight className="ml-auto size-4 shrink-0 text-fg-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
        {DOC_SECTIONS.map((s) => (
          <section key={s.id} className="mt-12" aria-labelledby={`sec-${s.id}`}>
            <h2 id={`sec-${s.id}`} className="text-xl font-semibold tracking-tight">
              {s.title[locale]}
            </h2>
            <p className="mt-1 text-sm text-fg-2">{s.blurb[locale]}</p>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {DOC_PAGES.filter((p) => p.section === s.id && p.slug !== "start").map((p) => (
                <li key={p.slug}>
                  <Link href={`/docs/${p.slug}`} className="group flex items-start gap-3 py-3 hover:bg-surface/60">
                    <DocIcon name={p.icon} className="mt-0.5 size-4 shrink-0 text-accent-fg" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold group-hover:text-accent-fg">{p.title[locale]}</span>
                      <span className="block text-sm text-fg-2">{p.lead[locale]}</span>
                    </span>
                    <ArrowRight className="mt-1 size-4 shrink-0 text-fg-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

export function DocArticle({ slug }: { slug: string }) {
  const { locale, l } = useText();
  const page = getDoc(slug)!;
  const { prev, next } = neighbours(slug);
  const body = page.body[locale];
  const headings = headingsOf(body).filter((h) => h.level === 2);
  const lesson = page.lesson ? getLessonDef(page.lesson) : null;
  const section = DOC_SECTIONS.find((s) => s.id === page.section)!;
  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-8 pb-28 lg:grid-cols-[240px_minmax(0,1fr)] lg:pb-16 xl:grid-cols-[240px_minmax(0,1fr)_200px]">
      <Sidebar current={slug} />
      <article className="min-w-0">
        <nav className="no-print text-sm text-fg-3" aria-label={l("Breadcrumb", "Fil d'Ariane")}>
          <Link href="/docs" className="hover:text-fg">
            Docs
          </Link>{" "}
          / <span>{section.title[locale]}</span>
        </nav>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{nbsp(page.title[locale])}</h1>
        <p className="mt-3 max-w-[62ch] text-lg leading-relaxed text-fg-2">{nbsp(page.lead[locale])}</p>
        {(lesson || page.printable) && (
          <div className="no-print mt-5 flex flex-wrap gap-2">
            {lesson && (
              <LinkButton href={`/learn/${lesson.id}`} size="sm">
                <Play className="size-3.5 fill-current" /> {l(`Practise it: ${lesson.title.en}`, `S'entraîner : ${lesson.title.fr}`)}
              </LinkButton>
            )}
            {page.printable && (
              <Button variant="secondary" size="sm" onClick={() => window.print()}>
                <Printer className="size-4" /> {l("Print", "Imprimer")}
              </Button>
            )}
          </div>
        )}
        {page.more && page.more.length > 0 && (
          <div className="no-print mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm">
            <span className="text-fg-3">{l("More practice:", "Pour aller plus loin :")}</span>
            {page.more.map((id) => {
              const more = getLessonDef(id);
              return more ? (
                <Link key={id} href={`/learn/${id}`} className="font-medium text-accent-fg underline decoration-accent/40 underline-offset-[3px] hover:decoration-accent">
                  {more.title[locale]}
                </Link>
              ) : null;
            })}
          </div>
        )}
        <div className="mt-8 border-t border-line pt-8">
          <Markdown source={body} copyLabel={l("Copy", "Copier")} copiedLabel={l("Copied", "Copié")} />
        </div>
        <nav className="no-print mt-14 grid gap-3 border-t border-line pt-6 sm:grid-cols-2" aria-label={l("More pages", "Autres pages")}>
          {prev ? (
            <Link href={`/docs/${prev.slug}`} className="group rounded-xl border border-line p-4 hover:border-line-strong">
              <span className="flex items-center gap-1 text-xs text-fg-3">
                <ArrowLeft className="size-3.5" /> {l("Previous", "Précédent")}
              </span>
              <span className="mt-1 block font-medium group-hover:text-accent-fg">{prev.title[locale]}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`/docs/${next.slug}`} className="group rounded-xl border border-line p-4 text-right hover:border-line-strong">
              <span className="flex items-center justify-end gap-1 text-xs text-fg-3">
                {l("Next", "Suivant")} <ArrowRight className="size-3.5" />
              </span>
              <span className="mt-1 block font-medium group-hover:text-accent-fg">{next.title[locale]}</span>
            </Link>
          )}
        </nav>
      </article>
      {headings.length > 1 && (
        <aside className="no-print hidden xl:block">
          <div className="sticky top-20">
            <p className="text-[11px] font-semibold text-fg-3">{l("On this page", "Sur cette page")}</p>
            <ul className="mt-2 space-y-1.5 border-l border-line">
              {headings.map((h) => (
                <li key={h.id}>
                  <a href={`#${h.id}`} className="-ml-px block border-l border-transparent pl-3 text-sm text-fg-2 hover:border-accent hover:text-fg">
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      )}
    </div>
  );
}
