import type { Metadata } from "next";
import { AppNav } from "@/components/app-nav";
import { VersionsPage } from "@/features/versions/versions-page";

export const metadata: Metadata = { title: "PHP 7.0 → 8.5" };

export default function Page() {
  return (
    <>
      <AppNav />
      <main>
        <VersionsPage />
      </main>
    </>
  );
}
