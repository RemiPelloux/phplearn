import type { Metadata } from "next";
import { AppNav } from "@/components/app-nav";
import { Playground } from "@/features/playground/playground";

export const metadata: Metadata = { title: "Playground", description: "Write and run PHP 7.4 to 8.5 in your browser, with several files, a trace and a simulated web request." };

export default function PlaygroundPage() {
  return (
    <div className="flex h-dvh flex-col">
      <AppNav />
      <main className="min-h-0 flex-1 pb-14 lg:pb-0">
        <Playground />
      </main>
    </div>
  );
}
