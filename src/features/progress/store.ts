"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ALL_LESSONS, CHAPTERS, type Files } from "@/features/curriculum";
import { detectLocale, type Locale } from "@/i18n/locale";
import type { PhpVersion } from "@/php/types";
import { dayKey, emptyDay, FLAWLESS_XP, levelFor, QUEST_XP, questsFor, streak, type AvatarColor, type DailyGoal, type DayActivity } from "./rules";

/** Toasts store message keys, so they show in the learner's current language. */
export interface Toast {
  id: number;
  kind: "xp" | "achievement" | "quest" | "goal";
  /** badge id (achievement) or quest id (quest) */
  subject?: string;
  xp?: number;
}

export interface Settings {
  theme: "dark" | "light";
  motion: "system" | "reduced" | "full";
  showStreak: boolean;
  /** The language shown. Follows the browser until the learner picks one. */
  locale?: Locale;
  /** True once the learner picked a language themselves; false means "match my browser". */
  localeChosen?: boolean;
  dailyGoal: DailyGoal;
  /** Editor font size in px. */
  fontSize: number;
  wordWrap: boolean;
  /** Buttons above the editor for symbols that are hard to type. */
  symbolBar: boolean;
  /** Version the Playground starts with. */
  phpVersion: PhpVersion;
}

/** An in-progress lesson: current step and the code typed at each code step. */
export interface LessonSave {
  step: number;
  files: Record<number, Files>;
  stats?: { mistakes: number; walkthrough: boolean };
}

export interface RunInfo {
  where: "lesson" | "playground" | "example";
  version: PhpVersion;
  ok: boolean;
  /** This run is clean and the previous one in the same editor had an error. */
  fixed: boolean;
}

interface ProgressState {
  name: string;
  onboarded: boolean;
  experience: "new" | "some" | "comfortable" | null;
  avatar: AvatarColor;
  xp: number;
  completed: Record<string, { at: number; xp: number; stars?: number }>;
  achievements: Record<string, number>;
  /** Total runs, and runs per PHP version. */
  runs: number;
  versions: Partial<Record<PhpVersion, number>>;
  activity: Record<string, DayActivity>;
  questsClaimed: Record<string, string[]>;
  saves: Record<string, LessonSave>;
  settings: Settings;
  toasts: Toast[];
  levelUp: number | null;
  holdCelebrations: boolean;
  setHoldCelebrations: (hold: boolean) => void;
  quietToasts: boolean;
  setQuietToasts: (quiet: boolean) => void;

  setName: (name: string) => void;
  setAvatar: (avatar: AvatarColor) => void;
  finishOnboarding: (experience: ProgressState["experience"]) => void;
  recordRun: (info: RunInfo) => void;
  /** Quiz answered right the first time: a few XP. */
  awardXp: (amount: number) => void;
  completeLesson: (lessonId: string, xp: number, boss: boolean, stars: number) => { gained: number; first: boolean; bonus: number; best: number };
  unlock: (id: string) => void;
  saveLesson: (id: string, save: LessonSave) => void;
  clearLesson: (id: string) => void;
  updateSettings: (s: Partial<Settings>) => void;
  /** Use the browser's language, unless the learner picked one. `reset` goes back to following the browser. */
  followBrowserLocale: (reset?: boolean) => void;
  dismissToast: (id: number) => void;
  dismissLevelUp: () => void;
  resetProgress: () => void;
}

let toastId = 1;

const initial = {
  name: "",
  onboarded: false,
  experience: null,
  avatar: "lane-2" as AvatarColor,
  xp: 0,
  completed: {},
  achievements: {},
  runs: 0,
  versions: {},
  activity: {},
  questsClaimed: {},
  saves: {},
  settings: { theme: "light", motion: "system", showStreak: true, dailyGoal: 60, fontSize: 14, wordWrap: false, symbolBar: true, phpVersion: "8.5" } as Settings,
  toasts: [] as Toast[],
  levelUp: null as number | null,
  holdCelebrations: false,
  quietToasts: false,
};

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => {
      const pushToast = (t: Omit<Toast, "id">) => {
        if (!get().quietToasts) set((s) => ({ toasts: [...s.toasts.slice(-3), { ...t, id: toastId++ }] }));
      };

      /** Add XP to totals + today's activity, then evaluate quests. */
      const addXp = (amount: number, mutateDay?: (d: DayActivity) => void) => {
        const key = dayKey();
        const before = get();
        const levelBefore = levelFor(before.xp).level;
        const dayXpBefore = before.activity[key]?.xp ?? 0;
        set((s) => {
          const day = { ...emptyDay(), ...(s.activity[key] ?? {}) };
          day.xp += amount;
          mutateDay?.(day);
          return { xp: s.xp + amount, activity: { ...s.activity, [key]: day } };
        });
        const s = get();
        const day = s.activity[key];
        const claimed = s.questsClaimed[key] ?? [];
        for (const q of questsFor(key)) {
          if (!claimed.includes(q.id) && q.progress(day) >= q.target) {
            set((st) => ({
              xp: st.xp + QUEST_XP,
              activity: { ...st.activity, [key]: { ...st.activity[key], xp: st.activity[key].xp + QUEST_XP } },
              questsClaimed: { ...st.questsClaimed, [key]: [...(st.questsClaimed[key] ?? []), q.id] },
            }));
            pushToast({ kind: "quest", subject: q.id, xp: QUEST_XP });
          }
        }
        const after = get();
        const goal = after.settings.dailyGoal ?? 60;
        if (dayXpBefore < goal && (after.activity[key]?.xp ?? 0) >= goal) {
          pushToast({ kind: "goal", xp: goal });
          unlock("goal-getter");
        }
        if (streak(after.activity) >= 3) unlock("on-fire");
        const levelAfter = levelFor(after.xp).level;
        if (levelAfter > levelBefore) set({ levelUp: levelAfter });
      };

      const unlock = (id: string) => {
        if (get().achievements[id]) return;
        set((s) => ({ achievements: { ...s.achievements, [id]: Date.now() } }));
        pushToast({ kind: "achievement", subject: id });
      };

      return {
        ...initial,
        setName: (name) => set({ name }),
        setAvatar: (avatar) => set({ avatar }),
        finishOnboarding: (experience) => set({ onboarded: true, experience }),
        recordRun: ({ where, version, ok, fixed }) => {
          set((s) => ({ runs: s.runs + 1, versions: { ...s.versions, [version]: (s.versions[version] ?? 0) + 1 } }));
          unlock("first-run");
          if (where === "playground") unlock("sandbox");
          if (fixed && ok) unlock("first-fix");
          if (Object.keys(get().versions).length >= 3) unlock("version-hopper");
          if (get().runs >= 100) unlock("hundred-runs");
          addXp(0, (d) => {
            d.runs += 1;
            if (fixed && ok) d.fixes += 1;
            if (where === "playground") d.playground = true;
          });
        },
        awardXp: (amount) => addXp(amount),
        completeLesson: (lessonId, xp, boss, stars) => {
          const prev = get().completed[lessonId];
          const first = !prev;
          const prevStars = prev ? (prev.stars ?? 1) : 0;
          const best = Math.max(prevStars, stars);
          const bonus = stars === 3 && prevStars < 3 ? FLAWLESS_XP : 0;
          const gained = (first ? xp : 0) + bonus;
          set((s) => ({ completed: { ...s.completed, [lessonId]: { at: prev?.at ?? Date.now(), xp: prev?.xp ?? xp, stars: best } } }));
          if (stars === 3) unlock("flawless");
          addXp(gained, (d) => {
            d.lessons += 1;
          });
          if (boss) unlock("boss");
          const done = (chapterId: string) => CHAPTERS.find((c) => c.id === chapterId)?.lessons.every((l) => get().completed[l.id]) ?? false;
          if (done("basics")) unlock("foundations");
          if (done("oop")) unlock("oop-master");
          if (done("versions")) unlock("modernist");
          const count = ALL_LESSONS.filter((l) => get().completed[l.id]).length;
          if (count >= Math.ceil(ALL_LESSONS.length / 2)) unlock("halfway");
          if (count === ALL_LESSONS.length) unlock("graduate");
          return { gained, first, bonus, best };
        },
        unlock,
        saveLesson: (id, save) => set((s) => ({ saves: { ...s.saves, [id]: save } })),
        clearLesson: (id) =>
          set((s) => {
            const saves = { ...s.saves };
            delete saves[id];
            return { saves };
          }),
        updateSettings: (patch) => {
          const prev = get().settings;
          // Picking a language by hand stops following the browser's.
          const chosen = patch.locale ? { localeChosen: true } : {};
          set((s) => ({ settings: { ...s.settings, ...patch, ...chosen } }));
          if (patch.locale && prev.locale && patch.locale !== prev.locale && get().onboarded) unlock("polyglot");
        },
        followBrowserLocale: (reset) => {
          const s = get().settings;
          if (s.localeChosen && !reset) return;
          const locale = detectLocale();
          if (s.locale !== locale || reset) set((st) => ({ settings: { ...st.settings, locale, localeChosen: false } }));
        },
        dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
        dismissLevelUp: () => set({ levelUp: null }),
        setHoldCelebrations: (holdCelebrations) => set({ holdCelebrations }),
        setQuietToasts: (quietToasts) => set(quietToasts ? { quietToasts, toasts: [] } : { quietToasts }),
        resetProgress: () => set({ ...initial, name: get().name, avatar: get().avatar, onboarded: get().onboarded, experience: get().experience, settings: get().settings }),
      };
    },
    {
      name: "phplearn-progress",
      version: 1,
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<ProgressState>;
        return { ...current, ...p, settings: { ...current.settings, ...p.settings } };
      },
      partialize: (s) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { toasts, levelUp, holdCelebrations, quietToasts, ...rest } = s;
        return rest;
      },
    },
  ),
);
