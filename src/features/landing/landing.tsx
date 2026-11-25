"use client";

import Link from "next/link";
import { ArrowRight, Award, BookOpen, BookText, CircleAlert, Columns2, Download, Footprints, History, Lightbulb, Star, Target, Zap } from "lucide-react";
import { AppNav } from "@/components/app-nav";
import { LinkButton } from "@/components/ui/button";
import { DynamicIcon } from "@/components/ui/misc";
import { ALL_LESSONS, CHAPTERS, TIER_LABEL } from "@/features/curriculum";
import { ACHIEVEMENTS } from "@/features/progress/rules";
import { HeroDemo } from "@/features/landing/hero-demo";
import { StartButton } from "@/features/landing/start-button";
import { REFERENCE } from "@/features/reference/data";
import { useL, usePick, useT, type MessageKey } from "@/i18n";
import { PHP_VERSIONS } from "@/php/types";

export function Landing() {
  const t = useT();
  const l = useL();
  const pick = usePick();

  // What PHP Learn does, told as a commit history.
  const log = [
    ["a3f9e01", l("Compare one script on PHP 7.4, 8.0, 8.1, 8.2, 8.3, 8.4 and 8.5, side by side", "Comparer un script sur PHP 7.4, 8.0, 8.1, 8.2, 8.3, 8.4 et 8.5, côte à côte")],
    ["7c21b4d", l("Step through every line with the Trace: call stack, variables, output so far", "Avancer ligne par ligne avec la Trace : pile d'appels, variables, sortie jusque-là")],
    ["e98a3c2", l("Explain every error in plain words, with the line and how to fix it", "Expliquer chaque erreur simplement, avec la ligne et comment la corriger")],
    ["41d07f5", l("Check exercises on real behaviour: output, return values, warnings", "Vérifier les exercices sur le vrai comportement : sortie, valeurs de retour, avertissements")],
    ["b5e6a90", l("Add cheat sheets next to the editor, guides and a function reference", "Ajouter des antisèches à côté de l'éditeur, des guides et une référence des fonctions")],
    ["0c4f2e7", l("Initial commit: real PHP in the browser, compiled to WebAssembly", "Commit initial : du vrai PHP dans le navigateur, compilé en WebAssembly")],
  ];
  const steps = [
    ["discover", l("a short explanation and examples you can run and edit", "une courte explication et des exemples à exécuter et modifier")],
    ["watch", l("step through a program and watch the variables change", "avancer dans un programme et regarder les variables changer")],
    ["quiz", l("predict what the code prints, then run it to check", "deviner ce qu'affiche le code, puis l'exécuter pour vérifier")],
    ["try", l("write code in the editor; it's checked on every run", "écrire du code dans l'éditeur ; il est vérifié à chaque exécution")],
    ["challenge", l("reach several objectives on your own; hints are free", "atteindre plusieurs objectifs seul ; les indices sont gratuits")],
    ["celebrate", l("XP, stars, badges, and the next lesson unlocks", "XP, étoiles, badges, et la leçon suivante se débloque")],
  ] as const;
  const ide = [
    [Footprints, l("Trace", "Trace"), l("Every statement PHP ran, in order. Click a step: the editor shows the line, the variables and the output at that moment.", "Chaque instruction exécutée par PHP, dans l'ordre. Clique sur une étape : l'éditeur montre la ligne, les variables et la sortie à ce moment.")],
    [CircleAlert, l("Problems", "Problèmes"), l("Warnings, exceptions and parse errors with the stack trace, what they mean and how to fix them.", "Avertissements, exceptions et erreurs de syntaxe avec la pile d'appels, ce qu'ils veulent dire et comment les corriger.")],
    [Columns2, l("Compare versions", "Comparer les versions"), l("Run your files on seven real interpreters and see exactly where PHP changed.", "Exécute tes fichiers sur sept vrais interpréteurs et vois exactement où PHP a changé.")],
    [Lightbulb, l("Hints & cheat sheets", "Indices et antisèches"), l("Three hint levels per objective, and the syntax of the topic one click away.", "Trois niveaux d'indice par objectif, et la syntaxe du sujet à un clic.")],
  ] as const;
  const game = [
    [Zap, "var(--lane-0)", l("XP & levels", "XP et niveaux"), l("Every lesson earns XP. Climb from Hello Worlder to PHP Artisan.", "Chaque leçon rapporte des XP. Grimpe de Hello Worlder à Artisan PHP.")],
    [Star, "var(--lane-3)", l("Three stars", "Trois étoiles"), l("Solve without the walkthrough and with few failed runs to earn all three, plus a bonus.", "Réussis sans la solution guidée et avec peu d'exécutions ratées pour les trois, plus un bonus.")],
    [Target, "var(--lane-1)", l("Daily quests & goal", "Quêtes et objectif du jour"), l("Three fresh quests every day and a daily XP goal you choose. Streaks are optional.", "Trois nouvelles quêtes chaque jour et un objectif d'XP que tu choisis. Les séries sont optionnelles.")],
    [Award, "var(--lane-2)", l(`${ACHIEVEMENTS.length} badges`, `${ACHIEVEMENTS.length} badges`), l("From “Bug squasher” (fix an error) to “Time traveller” (three PHP versions).", "De « Chasseur de bugs » (corriger une erreur) à « Voyageur temporel » (trois versions de PHP).")],
  ] as const;

  return (
    <>
      <AppNav />
      <main className="pb-24 lg:pb-0">
        <div className="relative overflow-hidden">
          <div aria-hidden className="bg-dots pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_72%_40%,black,transparent)]" />
          <section className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pt-12 pb-20 lg:grid-cols-[1fr_1.12fr] lg:gap-14 lg:pt-20">
            <div>
              <h1 className="text-[2.6rem] leading-[1.03] font-semibold tracking-[-0.03em] text-balance sm:text-[3.5rem] xl:text-[3.9rem]">
                {l("Learn PHP by writing", "Apprends PHP en écrivant")} <span className="text-accent-fg">{l("real PHP", "du vrai PHP")}</span>
                {l(", right in your browser.", ", directement dans ton navigateur.")}
              </h1>
              <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-fg-2">
                {l(
                  "From your first echo to PHP 8.5. Every exercise runs on a real interpreter, every line can be traced step by step, and every error is explained. Then see what changed from PHP 7 to 8.5, side by side.",
                  "De ton premier echo jusqu'à PHP 8.5. Chaque exercice tourne sur un vrai interpréteur, chaque ligne se suit pas à pas, et chaque erreur est expliquée. Puis vois ce qui a changé de PHP 7 à 8.5, côte à côte.",
                )}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <StartButton />
                <LinkButton href="/playground" variant="secondary" size="lg">
                  {l("Open the playground", "Ouvrir le bac à sable")}
                </LinkButton>
              </div>
              <p className="mt-4 text-sm text-fg-3">{l("Free. No account, nothing to install. Progress stays in this browser.", "Gratuit. Pas de compte, rien à installer. Ta progression reste dans ce navigateur.")}</p>
              <div className="mt-10 border-t border-line pt-5">
                <p className="text-xs text-fg-3">{l("Real interpreters, compiled to WebAssembly", "De vrais interpréteurs, compilés en WebAssembly")}</p>
                <ul className="mt-3 flex flex-wrap gap-2 text-sm font-medium text-fg-2">
                  {PHP_VERSIONS.map((v, i) => (
                    <li key={v} className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-0.5 font-mono text-xs">
                      <span className="size-1.5 rounded-full" style={{ background: `var(--lane-${i % 6})` }} />
                      PHP {v}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <HeroDemo />
          </section>
        </div>

        <section className="border-y border-line bg-surface">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">{l("Why it works", "Pourquoi ça marche")}</h2>
              <p className="mt-2 text-fg-2">
                {l(
                  "Code feels like magic until you can see it run. Here, every program shows what PHP executed, line by line, with the values of your variables at each step, and every error comes with an explanation.",
                  "Le code ressemble à de la magie tant qu'on ne le voit pas tourner. Ici, chaque programme montre ce que PHP a exécuté, ligne par ligne, avec la valeur de tes variables à chaque étape, et chaque erreur est accompagnée d'une explication.",
                )}
              </p>
            </div>
            <ol className="font-mono text-[13px] leading-7" aria-label={l("Features", "Fonctionnalités")}>
              {log.map(([hash, msg], i) => (
                <li key={hash} className="flex gap-3">
                  <span className="relative flex w-3 shrink-0 justify-center" aria-hidden>
                    <span className={i === log.length - 1 ? "absolute top-0 h-3.5 w-px bg-line-strong" : "absolute inset-y-0 w-px bg-line-strong"} />
                    <span className="relative mt-[9px] size-2.5 rounded-full border-2 border-accent-mark bg-surface" />
                  </span>
                  <span className="shrink-0 text-warn">{hash}</span>
                  <span className="min-w-0">
                    {i === 0 && (
                      <span className="mr-2 text-fg-3">
                        (<span className="text-info">HEAD</span> -&gt; <span className="text-ok">main</span>)
                      </span>
                    )}
                    <span className="text-fg">{msg}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-semibold tracking-tight">{l("A real editor, with a debugger built in", "Un vrai éditeur, avec un débogueur intégré")}</h2>
          <p className="mt-2 max-w-2xl text-fg-2">
            {l("Syntax colors, autocomplete, several files, and a VS Code-style panel under your code.", "Coloration, autocomplétion, plusieurs fichiers, et un panneau façon VS Code sous ton code.")}
          </p>
          <ul className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {ide.map(([Icon, title, body]) => (
              <li key={title} className="border-t border-line pt-4">
                <Icon className="size-5 text-accent-fg" aria-hidden />
                <p className="mt-2 font-semibold">{title}</p>
                <p className="mt-1 text-sm text-fg-2">{body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto grid max-w-6xl gap-12 border-t border-line px-4 py-16 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">{l("Every lesson, step by step", "Chaque leçon, pas à pas")}</h2>
            <p className="mt-2 text-fg-2">{l("About five to ten minutes each, one idea at a time. Mistakes are expected: errors are explained and hints are free.", "Environ cinq à dix minutes chacune, une idée à la fois. Les erreurs sont normales : elles sont expliquées et les indices sont gratuits.")}</p>
            <dl className="mt-6 divide-y divide-line border-y border-line">
              {steps.map(([k, body]) => (
                <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-3 py-3 text-sm">
                  <dt className="font-mono text-accent-fg">{t(`steps.${k}` as MessageKey).toLowerCase()}</dt>
                  <dd className="text-fg-2">{body}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">{l("The curriculum", "Le programme")}</h2>
            <p className="mt-2 text-fg-2">
              {l(`${ALL_LESSONS.length} lessons in ${CHAPTERS.length} chapters, from your first echo to what's new in PHP 8.5.`, `${ALL_LESSONS.length} leçons en ${CHAPTERS.length} chapitres, de ton premier echo aux nouveautés de PHP 8.5.`)}
            </p>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {CHAPTERS.map((c) => (
                <li key={c.id} className="flex items-center gap-3 py-2.5 text-sm">
                  <span className="w-6 font-mono text-xs text-fg-3">{String(c.number).padStart(2, "0")}</span>
                  <span className="flex-1">{pick(c.title)}</span>
                  <span className="text-xs text-fg-3">{l(`${c.lessons.length} lessons`, `${c.lessons.length} leçons`)}</span>
                  <span className="hidden w-24 text-right text-xs text-fg-3 sm:inline">{pick(TIER_LABEL[c.tier])}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-y border-line bg-surface">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">{l("Learning that feels like a game", "Apprendre comme on joue")}</h2>
              <ul className="mt-6 flex flex-wrap gap-2" aria-label={l("Badges", "Badges")}>
                {ACHIEVEMENTS.slice(0, 8).map((a) => (
                  <li key={a.id} className="flex items-center gap-1.5 rounded-full border border-line bg-elevated py-1 pr-3 pl-1 text-xs font-medium shadow-[var(--shadow-card)]">
                    <span className="grid size-6 place-items-center rounded-full bg-warn-soft text-warn">
                      <DynamicIcon name={a.icon} className="size-3.5" />
                    </span>
                    {t(`badges.${a.id}.title` as MessageKey)}
                  </li>
                ))}
              </ul>
            </div>
            <dl className="divide-y divide-line border-y border-line">
              {game.map(([Icon, color, title, body]) => (
                <div key={title} className="grid grid-cols-[2rem_1fr] gap-x-3 py-4 sm:grid-cols-[2rem_11rem_1fr]">
                  <Icon className="mt-0.5 size-5" style={{ color }} aria-hidden />
                  <dt className="font-semibold">{title}</dt>
                  <dd className="col-start-2 text-sm text-fg-2 sm:col-start-3">{body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14" aria-labelledby="beyond">
          <h2 id="beyond" className="text-2xl font-semibold tracking-tight">
            {l("Everything you need around the lessons", "Tout ce qu'il faut autour des leçons")}
          </h2>
          <ul className="mt-6 grid gap-x-8 gap-y-2 md:grid-cols-2 lg:grid-cols-4">
            {(
              [
                ["/versions", History, l("PHP 7.0 → 8.5", "PHP 7.0 → 8.5"), l("Every release, its new features and breaking changes, with code that runs on the real versions.", "Chaque version, ses nouveautés et ses changements cassants, avec du code qui tourne sur les vraies versions.")],
                ["/reference", BookText, l("Reference", "Référence"), l(`${REFERENCE.length} functions and constructs, each with an example you can run and edit.`, `${REFERENCE.length} fonctions et constructions, chacune avec un exemple à exécuter et modifier.`)],
                ["/docs", BookOpen, l("Docs & cheat sheets", "Docs et antisèches"), l("In-depth guides for every topic, and printable cheat sheets: syntax, functions, OOP, errors, versions.", "Des guides détaillés sur chaque sujet, et des antisèches à imprimer : syntaxe, fonctions, POO, erreurs, versions.")],
                ["/setup", Download, l("Install PHP", "Installer PHP"), l("Copy-paste commands for PHP, Composer and VS Code on macOS, Linux, Windows or Docker.", "Des commandes à copier pour PHP, Composer et VS Code sur macOS, Linux, Windows ou Docker.")],
              ] as const
            ).map(([href, Icon, title, body]) => (
              <li key={href}>
                <Link href={href} className="group flex gap-3 border-t border-line py-4">
                  <Icon className="mt-0.5 size-5 shrink-0 text-accent-fg" aria-hidden />
                  <span>
                    <span className="flex items-center gap-1 font-semibold group-hover:text-accent-fg">
                      {title} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                    <span className="mt-1 block text-sm text-fg-2">{body}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto max-w-6xl px-4 pt-14 pb-20">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">{l("Your first line of PHP is two minutes away.", "Ta première ligne de PHP est à deux minutes.")}</h2>
              <p className="mt-1 max-w-xl text-sm text-fg-2">
                {l("Real interpreters, real errors, real output: what you learn here works the same on any server.", "De vrais interpréteurs, de vraies erreurs, une vraie sortie : ce que tu apprends ici marche pareil sur n'importe quel serveur.")}
              </p>
            </div>
            <StartButton />
          </div>
          <footer className="mt-14 flex flex-wrap items-center justify-between gap-4 text-xs text-fg-3">
            <span>{l("PHP Learn: learn PHP by writing real PHP.", "PHP Learn : apprends PHP en écrivant du vrai PHP.")}</span>
            <span className="flex gap-4">
              <Link href="/reference" className="hover:text-fg-2">
                {t("nav.reference")}
              </Link>
              <Link href="/setup" className="hover:text-fg-2">
                {t("nav.setup")}
              </Link>
              <Link href="/docs" className="hover:text-fg-2">
                {t("nav.docs")}
              </Link>
              <Link href="/profile" className="hover:text-fg-2">
                {l("Settings & accessibility", "Réglages et accessibilité")}
              </Link>
            </span>
          </footer>
        </section>
      </main>
    </>
  );
}
