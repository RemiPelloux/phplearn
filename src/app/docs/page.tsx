import type { Metadata } from "next";
import { AppNav } from "@/components/app-nav";
import { DocsIndex } from "@/features/guide/docs";

export const metadata: Metadata = { title: "Docs" };

export default function DocsPage() {
  return (
    <>
      <AppNav />
      <main>
        <DocsIndex />
      </main>
    </>
  );
}
