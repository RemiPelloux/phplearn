"use client";

import { ArrowRight } from "lucide-react";
import { ALL_LESSONS } from "@/features/curriculum";
import { useProgress } from "@/features/progress/store";
import { LinkButton } from "@/components/ui/button";
import { useHydrated } from "@/components/ui/misc";
import { useL, usePick } from "@/i18n";

/** Newcomers go through the welcome tour first; returning learners continue where they left off. */
export function StartButton() {
  const l = useL();
  const pick = usePick();
  const hydrated = useHydrated();
  const completed = useProgress((s) => s.completed);
  const onboarded = useProgress((s) => s.onboarded);
  const started = hydrated && Object.keys(completed).length > 0;
  const next = ALL_LESSONS.find((x) => !completed[x.id]) ?? ALL_LESSONS[0];
  const href = !hydrated || !onboarded ? "/welcome" : `/learn/${(started ? next : ALL_LESSONS[0]).id}`;
  return (
    <LinkButton href={href} size="lg" className="group">
      {started ? l(`Continue: ${pick(next.title)}`, `Continuer : ${pick(next.title)}`) : l("Start learning", "Commencer")}
      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
    </LinkButton>
  );
}
