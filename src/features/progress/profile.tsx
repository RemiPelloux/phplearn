"use client";

import { clsx } from "clsx";
import { Accessibility, Flame, Keyboard, Languages, Palette, Play, Star, Target, Trophy, Type, WrapText } from "lucide-react";
import { Avatar, AVATAR_HEX } from "@/components/ui/avatar";
import { Kbd } from "@/components/ui/button";
import { Card, DynamicIcon, ProgressBar, useHydrated } from "@/components/ui/misc";
import { LOCALES, useL, useT, type Locale, type MessageKey } from "@/i18n";
import { DataSection, ProfilesSection } from "./profile-data";
import { useProgress, type Settings } from "./store";
import { ACHIEVEMENTS, AVATAR_COLORS, DAILY_GOALS, dayKey, levelFor, type DailyGoal } from "./rules";

export function Profile() {
  const hydrated = useHydrated();
  if (!hydrated) return <div className="min-h-[60vh]" aria-busy="true" />;
  return <ProfileInner />;
}

/** Longest run of consecutive active days. */
function bestStreak(activity: Record<string, { xp: number }>) {
  const days = Object.keys(activity)
    .filter((k) => activity[k].xp > 0)
    .sort();
  let best = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const k of days) {
    const [y, m, d] = k.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    if (prev) {
      const next = new Date(prev);
      next.setDate(next.getDate() + 1);
      run = dayKey(next) === k ? run + 1 : 1;
    } else run = 1;
    best = Math.max(best, run);
    prev = date;
  }
  return best;
}

function ProfileInner() {
  const t = useT();
  const l = useL();
  const p = useProgress();
  const lv = levelFor(p.xp);
  const titles = t.list("levels");
  const starCount = Object.values(p.completed).reduce((n, c) => n + (c.stars ?? 1), 0);
  const stats: Array<[React.ReactNode, string, string]> = [
    [<Trophy key="l" className="size-4 text-accent-fg" />, l("Lessons completed", "Leçons terminées"), String(Object.keys(p.completed).length)],
    [<Star key="s" className="size-4 text-(color:--star)" />, l("Stars collected", "Étoiles gagnées"), String(starCount)],
    [<Play key="c" className="size-4 text-info" />, l("Code runs", "Exécutions"), String(p.runs)],
    [<Flame key="f" className="size-4 text-warn" />, l("Best streak", "Meilleure série"), String(bestStreak(p.activity))],
  ];
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 pt-8 pb-28 md:pb-16">
      <Card className="bg-dots overflow-hidden p-6">
        <div className="flex flex-wrap items-center gap-5">
          <Avatar name={p.name} color={p.avatar} size="xl" />
          <div className="min-w-0 flex-1">
            <label className="text-xs text-fg-3" htmlFor="name">
              {l("Display name", "Nom affiché")}
            </label>
            <input
              id="name"
              value={p.name}
              onChange={(e) => p.setName(e.target.value.slice(0, 30))}
              placeholder={t("common.guest")}
              className="block w-full rounded-md bg-transparent text-2xl font-semibold outline-none placeholder:text-fg-3 focus-visible:bg-surface-2"
            />
            <p className="text-sm text-fg-2">{`${titles[lv.level - 1]} · ${p.xp} XP · ${Object.keys(p.completed).length} ${l("lessons", "leçons")}`}</p>
            <ProgressBar value={lv.progress} className="mt-2 max-w-sm" label={l("Progress to next level", "Progression vers le niveau suivant")} />
            <div className="mt-3 flex flex-wrap items-center gap-1.5" role="radiogroup" aria-label={l("Avatar color", "Couleur de l'avatar")}>
              {AVATAR_COLORS.map((c) => (
                <button
                  key={c}
                  role="radio"
                  aria-checked={p.avatar === c}
                  aria-label={`${l("Avatar color", "Couleur de l'avatar")} ${c.slice(-1)}`}
                  onClick={() => p.setAvatar(c)}
                  className={clsx("size-6 rounded-full ring-offset-2 ring-offset-surface transition-transform hover:scale-110", p.avatar === c && "ring-2 ring-fg")}
                  style={{ background: AVATAR_HEX[c] }}
                />
              ))}
            </div>
          </div>
        </div>
        <p className="mt-5 rounded-lg bg-surface-2 px-3 py-2 text-xs text-fg-3">
          {l("You're learning as a guest. Progress is stored in this browser only.", "Tu apprends en invité. Ta progression est enregistrée dans ce navigateur uniquement.")}{" "}
          <a href="#data" className="text-accent-fg underline underline-offset-2">
            {t.locale === "fr" ? "Voir tes données" : "See your data"}
          </a>
        </p>
      </Card>

      <ProfilesSection />

      <section aria-labelledby="stats">
        <h2 id="stats" className="mb-3 text-lg font-semibold">
          {l("Your stats", "Tes statistiques")}
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map(([icon, label, value]) => (
            <li key={label} className="rounded-xl border border-line bg-surface p-4 shadow-[var(--shadow-card)]">
              {icon}
              <p className="mt-2 text-2xl font-semibold">{value}</p>
              <p className="text-xs text-fg-3">{label}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="ach">
        <h2 id="ach" className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <Trophy className="size-5 text-warn" /> {l("Achievements", "Succès")}
          <span className="text-sm font-normal text-fg-3">
            {Object.keys(p.achievements).length}/{ACHIEVEMENTS.length}
          </span>
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {ACHIEVEMENTS.map((a) => {
            const at = p.achievements[a.id];
            return (
              <li key={a.id} className={clsx("flex items-center gap-3 rounded-xl border p-3", at ? "border-warn/30 bg-warn-soft/50" : "border-line opacity-60")}>
                <span className={clsx("grid size-11 shrink-0 place-items-center rounded-xl", at ? "bg-warn text-[var(--surface)] shadow-[inset_0_-3px_0_rgba(0,0,0,0.2)]" : "bg-surface-2 text-fg-3")}>
                  <DynamicIcon name={a.icon} className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{t(`badges.${a.id}.title` as MessageKey)}</p>
                  <p className="text-xs text-fg-2">{t(`badges.${a.id}.description` as MessageKey)}</p>
                </div>
                {at && <span className="ml-auto shrink-0 text-[11px] text-fg-3">{new Date(at).toLocaleDateString(t.locale)}</span>}
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="settings" className="space-y-3">
        <h2 id="settings" className="text-lg font-semibold">
          {l("Preferences & accessibility", "Préférences et accessibilité")}
        </h2>
        <Card className="divide-y divide-line">
          <Setting icon={<Languages className="size-4" />} title={l("Language", "Langue")} desc={l("Lessons and explanations. PHP code and its messages stay in English, like the real thing.", "Leçons et explications. Le code PHP et ses messages restent en anglais, comme en vrai.")}>
            <Segmented value={t.locale} options={LOCALES.map((l) => [l.id, l.label])} onChange={(v) => p.updateSettings({ locale: v as Locale })} />
          </Setting>
          <Setting icon={<Target className="size-4" />} title={l("Daily goal", "Objectif du jour")} desc={l("How much XP you aim for each day.", "Combien d'XP tu vises chaque jour.")}>
            <Segmented
              value={String(p.settings.dailyGoal ?? 60)}
              options={DAILY_GOALS.map((g) => [String(g), `${g} XP`])}
              onChange={(v) => p.updateSettings({ dailyGoal: Number(v) as DailyGoal })}
            />
          </Setting>
          <Setting icon={<Palette className="size-4" />} title={l("Theme", "Thème")} desc={l("Paper (light) is the default.", "Papier (clair) par défaut.")}>
            <Segmented
              value={p.settings.theme}
              options={[
                ["light", l("Paper", "Papier")],
                ["dark", l("Dark", "Sombre")],
              ]}
              onChange={(v) => p.updateSettings({ theme: v as Settings["theme"] })}
            />
          </Setting>
          <Setting icon={<Accessibility className="size-4" />} title={l("Motion", "Animations")} desc={l("Reduce animations. “System” follows your OS setting.", "Réduire les animations. « Système » suit le réglage de ton OS.")}>
            <Segmented
              value={p.settings.motion}
              options={[
                ["system", l("System", "Système")],
                ["reduced", l("Reduced", "Réduites")],
                ["full", l("Full", "Complètes")],
              ]}
              onChange={(v) => p.updateSettings({ motion: v as Settings["motion"] })}
            />
          </Setting>
          <Setting icon={<Type className="size-4" />} title={l("Editor font size", "Taille du code")} desc={l("Size of the code in every editor.", "Taille du code dans tous les éditeurs.")}>
            <Segmented value={String(p.settings.fontSize)} options={[["13", "S"], ["14", "M"], ["16", "L"], ["18", "XL"]]} onChange={(v) => p.updateSettings({ fontSize: Number(v) })} />
          </Setting>
          <Setting icon={<WrapText className="size-4" />} title={l("Word wrap", "Retour à la ligne")} desc={l("Wrap long lines instead of scrolling sideways.", "Couper les longues lignes au lieu de défiler de côté.")}>
            <Segmented value={p.settings.wordWrap ? "on" : "off"} options={[["on", l("On", "Oui")], ["off", l("Off", "Non")]]} onChange={(v) => p.updateSettings({ wordWrap: v === "on" })} />
          </Setting>
          <Setting icon={<Flame className="size-4" />} title={l("Show streaks", "Afficher les séries")} desc={l("Streaks are optional. Turn them off if they feel like pressure.", "Les séries sont optionnelles. Désactive-les si elles te mettent la pression.")}>
            <Segmented
              value={p.settings.showStreak ? "on" : "off"}
              options={[
                ["on", l("On", "Oui")],
                ["off", l("Off", "Non")],
              ]}
              onChange={(v) => p.updateSettings({ showStreak: v === "on" })}
            />
          </Setting>
        </Card>
        <Card className="p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Keyboard className="size-4" /> {l("Keyboard shortcuts", "Raccourcis clavier")}
          </h3>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            {(
              [
                [["Ctrl", "Enter"], l("Run the code", "Exécuter le code")],
                [["Ctrl", "S"], l("Run (saves are automatic)", "Exécuter (l'enregistrement est automatique)")],
                [["Ctrl", "/"], l("Comment a line", "Commenter une ligne")],
                [["Ctrl", "F"], l("Find in the file", "Chercher dans le fichier")],
                [["Ctrl", "Z"], l("Undo", "Annuler")],
                [["Alt", "↑/↓"], l("Move through the trace", "Avancer dans la trace")],
                [["Tab"], l("Indent / accept a suggestion", "Indenter / accepter une suggestion")],
                [["Esc"], l("Close suggestions", "Fermer les suggestions")],
              ] as const
            ).map(([keys, label]) => (
              <div key={label} className="flex items-center justify-between gap-3 rounded-lg bg-surface-2/60 px-3 py-1.5">
                <dt className="text-fg-2">{label}</dt>
                <dd className="flex gap-1">
                  {keys.map((k) => (
                    <Kbd key={k}>{k}</Kbd>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </Card>
      </section>

      <DataSection />
    </div>
  );
}

function Setting({ icon, title, desc, children }: { icon: React.ReactNode; title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4">
      <span className="grid size-8 place-items-center rounded-lg bg-surface-2 text-fg-2">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-fg-2">{desc}</p>
      </div>
      {children}
    </div>
  );
}

function Segmented({ value, options, onChange }: { value: string; options: Array<[string, string]>; onChange: (v: string) => void }) {
  return (
    <div className="flex rounded-lg bg-surface-2 p-1" role="radiogroup">
      {options.map(([v, label]) => (
        <button
          key={v}
          role="radio"
          aria-checked={value === v}
          onClick={() => onChange(v)}
          className={clsx("rounded-md px-3 py-1 text-xs font-medium transition-colors", value === v ? "bg-elevated text-fg shadow-sm" : "text-fg-3 hover:text-fg")}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
