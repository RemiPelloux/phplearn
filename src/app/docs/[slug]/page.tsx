import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { DocArticle } from "@/features/guide/docs";
import { DOC_PAGES, getDoc } from "@/features/guide/pages";

/** Every page is known at build time (required for the static GitHub Pages build). */
export const dynamicParams = false;

export function generateStaticParams() {
  return DOC_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/docs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = getDoc(slug);
  return { title: page?.title.en ?? "Docs", description: page?.lead.en };
}

export default async function DocPage({ params }: PageProps<"/docs/[slug]">) {
  const { slug } = await params;
  if (!getDoc(slug)) notFound();
  return (
    <>
      <AppNav />
      <main>
        <DocArticle slug={slug} />
      </main>
    </>
  );
}
