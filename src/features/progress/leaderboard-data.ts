/** Pure stats for the leaderboard: computed from a profile's saved progress. */
import { dayKey, levelFor, streak, type DayActivity } from "./rules";

export interface ProgressLike {
  name?: string;
  avatar?: string;
  xp?: number;
  completed?: Record<string, { at: number; xp: number; stars?: number }>;
  achievements?: Record<string, number>;
  activity?: Record<string, Partial<DayActivity>>;
  runs?: number;
}

export interface ProfileStats {
  id: string;
  name: string;
  avatar: string;
  active: boolean;
  xp: number;
  level: number;
  /** XP earned in the last 7 days (today included). */
  weekXp: number;
  /** XP earned in the 7 days before that. */
  lastWeekXp: number;
  lessons: number;
  stars: number;
  /** Lessons finished with three stars. */
  perfect: number;
  badges: number;
  streak: number;
  longestStreak: number;
  runs: number;
  bestDayXp: number;
  bestDay: string | null;
}

export type Metric = "week" | "xp" | "stars" | "lessons" | "streak";

const xpOn = (activity: ProgressLike["activity"], d: Date) => activity?.[dayKey(d)]?.xp ?? 0;

function sumDays(activity: ProgressLike["activity"], from: number, to: number, today: Date) {
  let n = 0;
  for (let i = from; i < to; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    n += xpOn(activity, d);
  }
  return n;
}

/** Longest run of consecutive days with XP. */
export function longestStreak(activity: ProgressLike["activity"] = {}) {
  const days = Object.keys(activity)
    .filter((k) => (activity[k]?.xp ?? 0) > 0)
    .sort();
  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const k of days) {
    if (prev) {
      const [y, m, d] = prev.split("-").map(Number);
      const next = new Date(y, m - 1, d + 1);
      run = dayKey(next) === k ? run + 1 : 1;
    } else run = 1;
    best = Math.max(best, run);
    prev = k;
  }
  return best;
}

export function statsOf(id: string, active: boolean, s: ProgressLike | null, fallbackName = "", fallbackAvatar = "lane-0", today = new Date()): ProfileStats {
  const p = s ?? {};
  const completed = Object.values(p.completed ?? {});
  const activity = p.activity ?? {};
  let bestDayXp = 0;
  let bestDay: string | null = null;
  for (const [k, v] of Object.entries(activity))
    if ((v?.xp ?? 0) > bestDayXp) {
      bestDayXp = v?.xp ?? 0;
      bestDay = k;
    }
  const xp = p.xp ?? 0;
  return {
    id,
    name: p.name || fallbackName,
    avatar: p.avatar || fallbackAvatar,
    active,
    xp,
    level: levelFor(xp).level,
    weekXp: sumDays(activity, 0, 7, today),
    lastWeekXp: sumDays(activity, 7, 14, today),
    lessons: completed.length,
    stars: completed.reduce((n, c) => n + (c.stars ?? 1), 0),
    perfect: completed.filter((c) => (c.stars ?? 1) === 3).length,
    badges: Object.keys(p.achievements ?? {}).length,
    streak: streak(activity as Record<string, DayActivity>, today),
    longestStreak: longestStreak(activity),
    runs: p.runs ?? 0,
    bestDayXp,
    bestDay,
  };
}

export const metricValue = (s: ProfileStats, m: Metric) =>
  m === "week" ? s.weekXp : m === "xp" ? s.xp : m === "stars" ? s.stars : m === "lessons" ? s.lessons : s.streak;

/** Highest first; ties keep the same rank (1, 2, 2, 4). XP breaks ties on other metrics. */
export function rank(list: ProfileStats[], m: Metric): Array<ProfileStats & { rank: number }> {
  const sorted = [...list].sort((a, b) => metricValue(b, m) - metricValue(a, m) || b.xp - a.xp || a.name.localeCompare(b.name));
  let last = Number.NaN;
  let r = 0;
  return sorted.map((s, i) => {
    const v = metricValue(s, m);
    if (v !== last) {
      r = i + 1;
      last = v;
    }
    return { ...s, rank: r };
  });
}
