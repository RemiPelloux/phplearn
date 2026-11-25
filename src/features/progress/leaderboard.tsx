"use client";

import { clsx } from "clsx";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Award, CalendarDays, Crown, Flame, HardDrive, Medal, Minus, Play, Star, Trophy, UserRoundPlus, Zap } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { LinkButton } from "@/components/ui/button";
import { Card, useHydrated } from "@/components/ui/misc";
import { useL, useT } from "@/i18n";
import type { AvatarColor } from "./rules";
import { rank, statsOf, type Metric, type ProfileStats } from "./leaderboard-data";
import { readAllProgress, switchProfile } from "./profiles";
import { useProgress } from "./store";

export function Leaderboard() {
  const hydrated = useHydrated();
  if (!hydrated) return <div className="min-h-[60vh]" aria-busy="true" />;
  return <LeaderboardInner />;
}

/** Every profile on this browser, ranked. The active one is read live from the store. */
function useProfileStats(): ProfileStats[] {
  const me = useProgress();
  // Rendered only after hydration, so localStorage is available here.
  const [others] = useState<ProfileStats[]>(() =>
    readAllProgress()
      .filter((p) => !p.active)
      .map((p) => statsOf(p.meta.id, false, p.state as never, p.meta.name, p.meta.avatar)),
  );
  return useMemo(() => [statsOf("me", true, me), ...others], [me, others]);
}

function LeaderboardInner() {
  const l = useL();
  const t = useT();
  const titles = t.list("levels");
  const all = useProfileStats();
  const [metric, setMetric] = useState<Metric>("week");
  const ranked = rank(all, metric);
  const me = all.find((s) => s.active)!;
  const myRank = ranked.find((s) => s.active)!.rank;
  const alone = all.length === 1;

  const metrics: Array<[Metric, string, React.ReactNode]> = [
    ["week", l("This week", "Cette semaine"), <CalendarDays key="w" className="size-3.5" />],
    ["xp", l("All-time XP", "XP au total"), <Zap key="x" className="size-3.5" />],
    ["stars", l("Stars", "Étoiles"), <Star key="s" className="size-3.5" />],
    ["lessons", l("Lessons", "Leçons"), <Trophy key="l" className="size-3.5" />],
    ["streak", l("Streak", "Série"), <Flame key="f" className="size-3.5" />],
  ];
  const unit = (s: ProfileStats) =>
    metric === "week"
      ? `${s.weekXp} XP`
      : metric === "xp"
        ? `${s.xp} XP`
        : metric === "stars"
          ? `${s.stars} ★`
          : metric === "lessons"
            ? l(`${s.lessons} lessons`, `${s.lessons} leçons`)
            : l(`${s.streak} days`, `${s.streak} jours`);

  const podium = ranked.slice(0, 3);
  const order = podium.length === 3 ? [podium[1], podium[0], podium[2]] : podium;

  return (
    <div className="mx-auto max-w-5xl px-4 pt-8 pb-28 md:pb-16">
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-accent-fg">
            <Trophy className="size-4" /> {l("Leaderboard", "Classement")}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            {alone ? l("You vs. you", "Toi contre toi") : l(`You're #${myRank} on this device`, `Tu es n°${myRank} sur cet appareil`)}
          </h1>
          <p className="mt-2 max-w-[62ch] text-fg-2">
            {l(
              "Everyone who learns on this browser, each with their own profile, ranked. Scores never leave this device: there's no account and no server.",
              "Tous ceux qui apprennent sur ce navigateur, chacun avec son profil, classés. Les scores ne quittent jamais cet appareil : pas de compte, pas de serveur.",
            )}
          </p>
        </div>
        <LinkButton href="/profile#profiles" variant="secondary">
          <UserRoundPlus className="size-4" /> {l("Add a player", "Ajouter un joueur")}
        </LinkButton>
      </div>

      <div className="scrollbar-thin mt-6 flex gap-1 overflow-x-auto rounded-xl bg-surface-2 p-1" role="radiogroup" aria-label={l("Rank by", "Classer par")}>
        {metrics.map(([id, label, icon]) => (
          <button
            key={id}
            role="radio"
            aria-checked={metric === id}
            onClick={() => setMetric(id)}
            className={clsx("flex flex-1 shrink-0 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap", metric === id ? "bg-elevated text-fg shadow-sm" : "text-fg-3 hover:text-fg")}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {!alone && (
        <div className="mt-8 flex items-end justify-center gap-3 sm:gap-6" aria-label={l("Podium", "Podium")}>
          {order.map((s) => {
            const height = s.rank === 1 ? "h-28" : s.rank === 2 ? "h-20" : "h-14";
            const tone = s.rank === 1 ? "var(--star)" : s.rank === 2 ? "#a8b0bd" : "#c98a54";
            return (
              <motion.div key={s.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex w-28 flex-col items-center text-center sm:w-36">
                {s.rank === 1 && <Crown className="mb-1 size-6" style={{ color: tone }} aria-hidden />}
                <Avatar name={s.name} color={s.avatar as AvatarColor} size={s.rank === 1 ? "xl" : "lg"} className={clsx(s.active && "ring-4 ring-accent-soft")} />
                <p className="mt-2 max-w-full truncate text-sm font-semibold">
                  {s.name || l("Guest", "Invité")}
                  {s.active && <span className="text-accent-fg"> ({l("you", "toi")})</span>}
                </p>
                <p className="text-xs text-fg-3">{unit(s)}</p>
                <div className={clsx("mt-2 grid w-full place-items-center rounded-t-xl border border-b-0 border-line bg-surface font-mono text-2xl font-bold shadow-[var(--shadow-card)]", height)} style={{ color: tone }}>
                  {s.rank}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <Card className={clsx("overflow-hidden", alone ? "mt-6" : "")}>
        <ol>
          {ranked.map((s) => (
            <motion.li key={s.id} layout className={clsx("flex items-center gap-3 border-b border-line px-4 py-3 last:border-b-0", s.active && "bg-accent-soft/60")}>
              <span className="grid w-8 shrink-0 place-items-center font-mono text-sm font-bold text-fg-2">
                {s.rank <= 3 && !alone ? <Medal className="size-5" style={{ color: s.rank === 1 ? "var(--star)" : s.rank === 2 ? "#a8b0bd" : "#c98a54" }} aria-label={`#${s.rank}`} /> : `#${s.rank}`}
              </span>
              <Avatar name={s.name} color={s.avatar as AvatarColor} size="md" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">
                  {s.name || l("Guest", "Invité")}
                  {s.active && <span className="ml-1.5 rounded-full bg-accent px-1.5 py-px text-[10px] font-bold text-white uppercase">{l("you", "toi")}</span>}
                </p>
                <p className="truncate text-xs text-fg-3">
                  {l(`Level ${s.level}`, `Niveau ${s.level}`)} · {titles[s.level - 1]} · {l(`${s.lessons} lessons`, `${s.lessons} leçons`)} · {s.badges} badges
                </p>
              </div>
              <span className="shrink-0 text-right">
                <span className="block font-semibold tabular-nums">{unit(s)}</span>
                {metric === "week" && <Trend now={s.weekXp} before={s.lastWeekXp} />}
              </span>
              {!s.active && (
                <button
                  onClick={() => switchProfile(s.id, "/leaderboard")}
                  className="hidden shrink-0 rounded-md px-2 py-1 text-xs text-fg-3 hover:bg-surface-2 hover:text-fg sm:block"
                  title={l("Switch to this profile", "Passer à ce profil")}
                >
                  {l("Switch", "Changer")}
                </button>
              )}
            </motion.li>
          ))}
        </ol>
        {alone && (
          <div className="flex flex-wrap items-center gap-3 border-t border-line bg-surface-2/50 px-4 py-4 text-sm text-fg-2">
            <UserRoundPlus className="size-5 shrink-0 text-accent-fg" />
            <p className="min-w-0 flex-1">
              {l(
                "Learning with a friend, a sibling or a class on this computer? Give each person a profile and race each other here.",
                "Tu apprends avec un ami, un frère, une sœur ou une classe sur cet ordinateur ? Donne un profil à chacun et faites la course ici.",
              )}
            </p>
            <LinkButton href="/profile#profiles" size="sm">
              {l("Add a profile", "Ajouter un profil")}
            </LinkButton>
          </div>
        )}
      </Card>

      <section className="mt-10" aria-labelledby="records">
        <h2 id="records" className="flex items-center gap-2 text-lg font-semibold">
          <Award className="size-5 text-warn" /> {l("Your records", "Tes records")}
        </h2>
        <p className="mt-1 text-sm text-fg-2">{l("The only opponent who's always there: last week's you.", "Le seul adversaire toujours présent : toi, la semaine dernière.")}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Record
            icon={<CalendarDays className="size-4 text-accent-fg" />}
            label={l("This week vs last week", "Cette semaine vs la précédente")}
            value={`${me.weekXp} XP`}
            extra={<Trend now={me.weekXp} before={me.lastWeekXp} long />}
          />
          <Record
            icon={<Zap className="size-4 text-warn" />}
            label={l("Best day", "Meilleure journée")}
            value={`${me.bestDayXp} XP`}
            extra={me.bestDay ? <span className="text-xs text-fg-3">{new Date(me.bestDay + "T12:00:00").toLocaleDateString(t.locale, { day: "numeric", month: "long", year: "numeric" })}</span> : null}
          />
          <Record
            icon={<Flame className="size-4 text-warn" />}
            label={l("Longest streak", "Plus longue série")}
            value={l(`${me.longestStreak} days`, `${me.longestStreak} jours`)}
            extra={<span className="text-xs text-fg-3">{l(`Current: ${me.streak}`, `En cours : ${me.streak}`)}</span>}
          />
          <Record
            icon={<Star className="size-4 text-(color:--star)" />}
            label={l("Flawless lessons", "Leçons sans faute")}
            value={String(me.perfect)}
            extra={<span className="text-xs text-fg-3">{l(`${me.runs} code runs in total`, `${me.runs} exécutions au total`)}</span>}
          />
        </div>
        {me.lessons === 0 && (
          <div className="mt-6">
            <LinkButton href="/learn">
              <Play className="size-4 fill-current" /> {l("Start a lesson to get on the board", "Commence une leçon pour entrer au classement")}
            </LinkButton>
          </div>
        )}
        <p className="mt-6 flex items-center gap-1.5 text-xs text-fg-3">
          <HardDrive className="size-3.5" /> {l("Stored in this browser only. Back up or move a profile from the Profile page.", "Enregistré dans ce navigateur uniquement. Sauvegarde ou déplace un profil depuis la page Profil.")}
        </p>
      </section>
    </div>
  );
}

function Record({ icon, label, value, extra }: { icon: React.ReactNode; label: string; value: string; extra?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4 shadow-[var(--shadow-card)]">
      <p className="flex items-center gap-1.5 text-xs text-fg-3">
        {icon} {label}
      </p>
      <p className="mt-1.5 text-2xl font-semibold tabular-nums">{value}</p>
      {extra && <div className="mt-0.5">{extra}</div>}
    </div>
  );
}

function Trend({ now, before, long }: { now: number; before: number; long?: boolean }) {
  const l = useL();
  const diff = now - before;
  const Icon = diff > 0 ? ArrowUpRight : diff < 0 ? ArrowDownRight : Minus;
  return (
    <span className={clsx("flex items-center justify-end gap-0.5 text-[11px] font-medium", diff > 0 ? "text-ok" : diff < 0 ? "text-bad" : "text-fg-3", long && "justify-start text-xs")}>
      <Icon className="size-3.5" />
      {diff === 0 ? l("same as last week", "comme la semaine dernière") : long ? l(`${Math.abs(diff)} XP ${diff > 0 ? "more" : "less"} than last week`, `${Math.abs(diff)} XP de ${diff > 0 ? "plus" : "moins"} que la semaine dernière`) : `${diff > 0 ? "+" : "−"}${Math.abs(diff)}`}
    </span>
  );
}
