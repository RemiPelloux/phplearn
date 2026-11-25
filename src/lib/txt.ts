/** A learner-facing string in both languages. */
export interface Txt {
  en: string;
  fr: string;
}

/** Write a string once in English and French: L("Hello", "Bonjour"). */
export const L = (en: string, fr: string): Txt => ({ en, fr });
