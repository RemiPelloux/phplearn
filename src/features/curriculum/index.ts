import { L } from "@/lib/txt";
import type { Txt } from "@/lib/txt";
import { BASICS } from "./lessons/basics";
import { CONTROL } from "./lessons/control";
import { ARRAYS } from "./lessons/arrays";
import { FUNCTIONS } from "./lessons/functions";
import { TEXT_DATA } from "./lessons/text-data";
import { OOP } from "./lessons/oop";
import { ERRORS } from "./lessons/errors";
import { MODERN } from "./lessons/modern";
import { WEB } from "./lessons/web";
import { VERSIONS } from "./lessons/versions";
import type { Chapter, Lesson, Tier } from "./types";

export * from "./types";

export const CHAPTERS: Chapter[] = [
  {
    id: "basics",
    number: 1,
    title: L("First steps", "Premiers pas"),
    tier: "beginner",
    description: L("Your first script, variables, text and numbers.", "Ton premier script, les variables, le texte et les nombres."),
    lessons: BASICS,
  },
  {
    id: "control",
    number: 2,
    title: L("Decisions and loops", "Décisions et boucles"),
    tier: "beginner",
    description: L("if, comparisons, match and every kind of loop.", "if, comparaisons, match et toutes les boucles."),
    lessons: CONTROL,
  },
  {
    id: "arrays",
    number: 3,
    title: L("Arrays", "Les tableaux"),
    tier: "beginner",
    description: L("Lists, dictionaries and the functions that transform them.", "Listes, dictionnaires et les fonctions qui les transforment."),
    lessons: ARRAYS,
  },
  {
    id: "functions",
    number: 4,
    title: L("Functions", "Les fonctions"),
    tier: "intermediate",
    description: L("Reusable code, types, closures, scope and recursion.", "Du code réutilisable, les types, les closures, la portée et la récursivité."),
    lessons: FUNCTIONS,
  },
  {
    id: "text-data",
    number: 5,
    title: L("Text, dates and data", "Texte, dates et données"),
    tier: "intermediate",
    description: L("String functions, formatting, regular expressions, dates and JSON.", "Fonctions de chaînes, formatage, expressions régulières, dates et JSON."),
    lessons: TEXT_DATA,
  },
  {
    id: "oop",
    number: 6,
    title: L("Objects and classes", "Objets et classes"),
    tier: "advanced",
    description: L("Classes, inheritance, interfaces, traits, enums and immutability.", "Classes, héritage, interfaces, traits, enums et immutabilité."),
    lessons: OOP,
  },
  {
    id: "errors",
    number: 7,
    title: L("Errors and debugging", "Erreurs et débogage"),
    tier: "advanced",
    description: L("Warnings, exceptions, null safety, strict types and reading stack traces.", "Avertissements, exceptions, gestion de null, types stricts et lecture des traces."),
    lessons: ERRORS,
  },
  {
    id: "modern",
    number: 8,
    title: L("Modern PHP", "PHP moderne"),
    tier: "advanced",
    description: L("Namespaces, autoloading, generators, iterators and attributes.", "Namespaces, autoloading, générateurs, itérateurs et attributs."),
    lessons: MODERN,
  },
  {
    id: "web",
    number: 9,
    title: L("PHP for the web", "PHP pour le web"),
    tier: "expert",
    description: L("Requests and forms, security, databases with PDO, and testing.", "Requêtes et formulaires, sécurité, bases de données avec PDO, et tests."),
    lessons: WEB,
  },
  {
    id: "versions",
    number: 10,
    title: L("PHP 7 → 8.5: what changed", "De PHP 7 à 8.5 : ce qui a changé"),
    tier: "expert",
    description: L("Run the same code on every version and learn each release's big ideas.", "Exécute le même code sur chaque version et découvre les grandes idées de chaque sortie."),
    lessons: VERSIONS,
  },
];

export const ALL_LESSONS: Lesson[] = CHAPTERS.flatMap((c) => c.lessons);

export const getLesson = (id: string) => ALL_LESSONS.find((l) => l.id === id) ?? null;
export const chapterOf = (lesson: Lesson) => CHAPTERS.find((c) => c.id === lesson.chapterId)!;

export function nextLesson(id: string): Lesson | null {
  const i = ALL_LESSONS.findIndex((l) => l.id === id);
  return i >= 0 ? (ALL_LESSONS[i + 1] ?? null) : null;
}

export const TIER_LABEL: Record<Tier, Txt> = {
  beginner: L("Beginner", "Débutant"),
  intermediate: L("Intermediate", "Intermédiaire"),
  advanced: L("Advanced", "Avancé"),
  expert: L("Expert", "Expert"),
};

/**
 * A lesson is open when the previous one is done. Experienced learners
 * unlock more chapters from the start.
 */
export function isUnlocked(id: string, completed: Record<string, unknown>, experience: "new" | "some" | "comfortable" | null = "new"): boolean {
  const i = ALL_LESSONS.findIndex((l) => l.id === id);
  if (i <= 0) return true;
  if (experience === "comfortable") return true;
  const lesson = ALL_LESSONS[i];
  const chapter = CHAPTERS.find((c) => c.id === lesson.chapterId)!;
  if (experience === "some" && chapter.number <= 5) return true;
  // The first lesson of a chapter opens when the previous chapter is half done.
  if (chapter.lessons[0]?.id === id) {
    const prev = CHAPTERS[chapter.number - 2];
    return !!prev && prev.lessons.filter((l) => completed[l.id]).length >= Math.ceil(prev.lessons.length / 2);
  }
  return !!completed[ALL_LESSONS[i - 1].id];
}
