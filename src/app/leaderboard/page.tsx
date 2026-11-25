import type { Metadata } from "next";
import { AppNav } from "@/components/app-nav";
import { Leaderboard } from "@/features/progress/leaderboard";

export const metadata: Metadata = { title: "Leaderboard" };

export default function LeaderboardPage() {
  return (
    <>
      <AppNav />
      <main>
        <Leaderboard />
      </main>
    </>
  );
}
