import type { Txt } from "@/lib/txt";

export type DocSection = "app" | "guides" | "cheats";

export interface DocPage {
  slug: string;
  section: DocSection;
  /** lucide icon name */
  icon: string;
  title: Txt;
  lead: Txt;
  /** Markdown subset, see markdown.tsx */
  body: Txt;
  /** The lesson that practises this guide. */
  lesson?: string;
  /** Other lessons on the same topic. */
  more?: string[];
  /** Cheat sheets get a Print button and print-friendly layout. */
  printable?: boolean;
}
