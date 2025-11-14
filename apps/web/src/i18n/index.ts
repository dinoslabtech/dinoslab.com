import en from "@/locales/en.json";
import it from "@/locales/it.json";
// import fr from "./fr.json";
import type { TranslationSchema } from "./types";

export const translations: Record<string, TranslationSchema> = {
  en,
  it,
  //   fr,
};

export function getTranslation(locale: keyof typeof translations) {
  return translations[locale] || translations.en;
}
