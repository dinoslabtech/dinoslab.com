import { locales } from "astro-i18n-aut";
import { languages, defaultLocale, showDefaultLang } from "./ui";

export async function loadTranslations(locale: string) {
  const mod = await import(`./locales/${locale}.json`);
  return mod.default;
}

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split("/");
  if (lang in languages) return lang as keyof typeof languages;
  return defaultLocale;
}

export function useTranslatedPath(lang: keyof typeof locales) {
  return function translatePath(path: string, l: string = lang) {
    return !showDefaultLang && l === defaultLocale ? path : `/${l}${path}`;
  };
}
