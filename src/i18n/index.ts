"use client";

import { useCallback } from "react";
import { useHydrated } from "@/components/ui/misc";
import { useProgress } from "@/features/progress/store";
import type { Txt } from "@/lib/txt";
import { en, type Messages } from "./messages/en";
import { fr } from "./messages/fr";
import type { Locale } from "./locale";

export { LOCALES, detectLocale, type Locale } from "./locale";

const DICTS: Record<Locale, Messages> = { en, fr };

/** Dotted paths to every string in the dictionary, e.g. "nav.learn". */
type Paths<T, P extends string = ""> = {
  [K in keyof T & string]: T[K] extends string ? `${P}${K}` : T[K] extends readonly string[] ? `${P}${K}` : Paths<T[K], `${P}${K}.`>;
}[keyof T & string];
export type MessageKey = Paths<typeof en>;
export type Vars = Record<string, string | number>;

function lookup(dict: Messages, key: string): unknown {
  let cur: unknown = dict;
  for (const part of key.split(".")) cur = (cur as Record<string, unknown> | undefined)?.[part];
  return cur;
}

export function format(text: string, vars?: Vars) {
  return vars ? text.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m)) : text;
}

export function translate(locale: Locale, key: MessageKey, vars?: Vars): string {
  const v = lookup(DICTS[locale], key) ?? lookup(en, key);
  return typeof v === "string" ? format(v, vars) : key;
}

export function translateList(locale: Locale, key: MessageKey): string[] {
  const v = lookup(DICTS[locale], key) ?? lookup(en, key);
  return Array.isArray(v) ? (v as string[]) : [];
}

/** Before hydration we render English so the static HTML matches; then the saved language takes over. */
export function useLocale(): Locale {
  const hydrated = useHydrated();
  const locale = useProgress((s) => s.settings.locale);
  return hydrated ? (locale ?? "en") : "en";
}

export function useT() {
  const locale = useLocale();
  const t = useCallback((key: MessageKey, vars?: Vars) => translate(locale, key, vars), [locale]);
  const list = useCallback((key: MessageKey) => translateList(locale, key), [locale]);
  return Object.assign(t, { locale, list });
}

export type T = ReturnType<typeof useT>;

/** Inline bilingual text for components: l("English", "Français"). */
export function useL() {
  const locale = useLocale();
  return useCallback((en: string, fr: string) => (locale === "fr" ? fr : en), [locale]);
}

/** Pick the learner's language from a { en, fr } pair. */
export function usePick() {
  const locale = useLocale();
  return useCallback((t: Txt | undefined | null) => (t ? t[locale] : ""), [locale]);
}
