import type { Metadata } from "next";
import { AppNav } from "@/components/app-nav";
import { SetupGuide } from "@/features/setup/setup-guide";

export const metadata: Metadata = { title: "Install PHP" };

export default function Page() {
  return (
    <>
      <AppNav />
      <main>
        <SetupGuide />
      </main>
    </>
  );
}
