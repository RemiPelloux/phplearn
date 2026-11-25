import { L, type Txt } from "@/lib/txt";
import { ARRAYS } from "./data-arrays";
import { CLASSES, FUNCTIONS, MATH, OUTPUT, TYPES } from "./data-core";
import { LANGUAGE } from "./data-language";
import { DATES, ERRORS, FILES, JSON, REGEX } from "./data-more";
import { STRINGS } from "./data-strings";
import type { RefCategory, RefEntry } from "./types";

export const REF_CATEGORIES: Array<{ id: RefCategory; title: Txt; blurb: Txt }> = [
  { id: "language", title: L("Language", "Langage"), blurb: L("Keywords and operators: if, match, loops, functions, ??, ?->…", "Mots-clés et opérateurs : if, match, boucles, fonctions, ??, ?->…") },
  { id: "strings", title: L("Strings", "Chaînes"), blurb: L("Search, cut, replace, pad and format text.", "Chercher, couper, remplacer, compléter et formater du texte.") },
  { id: "arrays", title: L("Arrays", "Tableaux"), blurb: L("Lists and dictionaries: map, filter, sort, search, combine.", "Listes et dictionnaires : map, filter, trier, chercher, combiner.") },
  { id: "math", title: L("Math", "Maths"), blurb: L("Rounding, division, min and max, random numbers.", "Arrondis, division, min et max, nombres aléatoires.") },
  { id: "types", title: L("Types and debugging", "Types et débogage"), blurb: L("Inspect and convert values: var_dump, get_debug_type, casts.", "Inspecter et convertir des valeurs : var_dump, get_debug_type, casts.") },
  { id: "output", title: L("Output", "Sortie"), blurb: L("Printing, templates and output buffering.", "Affichage, gabarits et mise en tampon de la sortie.") },
  { id: "functions", title: L("Functions", "Fonctions"), blurb: L("Callables, closures, variadics and first-class callables.", "Callables, closures, variadiques et callables de première classe.") },
  { id: "classes", title: L("Classes and objects", "Classes et objets"), blurb: L("Constructors, interfaces, traits, enums and reflection.", "Constructeurs, interfaces, traits, enums et réflexion.") },
  { id: "dates", title: L("Dates", "Dates"), blurb: L("date(), DateTimeImmutable, intervals and periods.", "date(), DateTimeImmutable, intervalles et périodes.") },
  { id: "json", title: L("JSON", "JSON"), blurb: L("Encode, decode and validate JSON.", "Encoder, décoder et valider du JSON.") },
  { id: "regex", title: L("Regular expressions", "Expressions régulières"), blurb: L("Match, extract, replace and split with patterns.", "Tester, extraire, remplacer et découper avec des motifs.") },
  { id: "files", title: L("Files", "Fichiers"), blurb: L("Read and write files and folders.", "Lire et écrire des fichiers et des dossiers.") },
  { id: "errors", title: L("Errors and exceptions", "Erreurs et exceptions"), blurb: L("Throw, catch, convert and report problems.", "Lever, attraper, convertir et signaler les problèmes.") },
];

export const REFERENCE: RefEntry[] = [...LANGUAGE, ...STRINGS, ...ARRAYS, ...MATH, ...TYPES, ...OUTPUT, ...FUNCTIONS, ...CLASSES, ...DATES, ...JSON, ...REGEX, ...FILES, ...ERRORS];

export const getRefEntry = (name: string) => REFERENCE.find((r) => r.name === name) ?? null;
