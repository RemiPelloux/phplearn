import type { Metadata } from "next";
import { AppNav } from "@/components/app-nav";
import { ReferencePage } from "@/features/reference/reference-page";

export const metadata: Metadata = { title: "PHP reference" };

export default function Page() {
  return (
    <>
      <AppNav />
      <main>
        <ReferencePage />
      </main>
    </>
  );
}
