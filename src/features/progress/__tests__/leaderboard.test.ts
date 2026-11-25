import { describe, expect, it } from "vitest";
import { dayKey } from "../rules";
import { longestStreak, rank, statsOf } from "../leaderboard-data";

const today = new Date(2026, 10, 25);
const ago = (n: number) => dayKey(new Date(2026, 10, 25 - n));

describe("leaderboard stats", () => {
  it("computes weekly XP, stars, streaks and records", () => {
    const s = statsOf("a", true, {
      name: "Ada",
      xp: 300,
      completed: { a: { at: 1, xp: 40, stars: 3 }, b: { at: 1, xp: 50, stars: 2 } },
      activity: { [ago(0)]: { xp: 40 }, [ago(1)]: { xp: 60 }, [ago(2)]: { xp: 10 }, [ago(9)]: { xp: 120 } },
      runs: 12,
    }, "", "lane-0", today);
    expect(s).toMatchObject({ weekXp: 110, lastWeekXp: 120, stars: 5, perfect: 1, lessons: 2, streak: 3, longestStreak: 3, bestDayXp: 120, bestDay: ago(9), level: 3 });
  });

  it("finds the longest streak across months", () => {
    expect(longestStreak({ "2026-10-30": { xp: 5 }, "2026-10-31": { xp: 5 }, "2026-11-01": { xp: 5 }, "2026-11-03": { xp: 5 } })).toBe(3);
  });

  it("ranks with ties and tie-breaks on XP", () => {
    const mk = (id: string, xp: number, lessons: number) => statsOf(id, false, { name: id, xp, completed: Object.fromEntries(Array.from({ length: lessons }, (_, i) => [`l${i}`, { at: 1, xp: 1 }])) }, "", "lane-0", today);
    const r = rank([mk("a", 100, 2), mk("b", 300, 2), mk("c", 50, 5)], "lessons");
    expect(r.map((x) => [x.id, x.rank])).toEqual([["c", 1], ["b", 2], ["a", 2]]);
  });
});
