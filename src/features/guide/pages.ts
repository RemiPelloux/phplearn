import { APP_PAGES } from "./content/app";
import { CHEAT_PAGES } from "./content/cheats";
import { GUIDE_PAGES } from "./content/guides";
import type { DocPage, DocSection } from "./types";

export const DOC_PAGES: DocPage[] = [...APP_PAGES, ...GUIDE_PAGES, ...CHEAT_PAGES];

export const DOC_SECTIONS: Array<{ id: DocSection; title: { en: string; fr: string }; blurb: { en: string; fr: string } }> = [
  {
    id: "app",
    title: { en: "Using PHP Learn", fr: "Utiliser PHP Learn" },
    blurb: { en: "Lessons, the editor, Run, the Trace, comparing versions, the Playground and your data.", fr: "Les leçons, l'éditeur, Exécuter, la Trace, la comparaison des versions, le bac à sable et tes données." },
  },
  {
    id: "guides",
    title: { en: "Guides", fr: "Guides" },
    blurb: { en: "Every PHP topic of the course, explained in depth, each linked to the lesson that practises it.", fr: "Chaque sujet PHP du cours, expliqué en détail, chacun relié à la leçon qui le pratique." },
  },
  {
    id: "cheats",
    title: { en: "Cheat sheets", fr: "Antisèches" },
    blurb: { en: "One-page summaries to print or keep open next to your editor.", fr: "Des résumés d'une page à imprimer ou à garder à côté de ton éditeur." },
  },
];

export const getDoc = (slug: string) => DOC_PAGES.find((p) => p.slug === slug) ?? null;

export function neighbours(slug: string) {
  const i = DOC_PAGES.findIndex((p) => p.slug === slug);
  return { prev: DOC_PAGES[i - 1] ?? null, next: DOC_PAGES[i + 1] ?? null };
}
