import { ui, languages, defaultLang, type Language } from './ui';
import { getCookieValue } from '../utils/cookie';

const supportedLanguages = Object.keys(languages);

export function getLangFromUrl(url: URL): Language {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as Language;
  return defaultLang;
}

export function useTranslations(lang: Language) {
  return function t(key: keyof typeof ui[typeof defaultLang]): string {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

export function getLocalizedPath(path: string, lang: Language): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `/${lang}${cleanPath === '/' ? '' : cleanPath}`;
}

export function getPathWithoutLang(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments[0] in ui) {
    return '/' + segments.slice(1).join('/') || '/';
  }
  return pathname;
}

export function getAlternateLanguageUrl(url: URL, targetLang: Language): string {
  const pathWithoutLang = getPathWithoutLang(url.pathname);
  return getLocalizedPath(pathWithoutLang, targetLang);
}

export function getPreferredLanguage(headers: Headers): Language {
  // 1. Check cookie first (user's saved preference)
  const cookieLang = getCookieValue(headers.get('cookie'), 'preferred-language');
  if (cookieLang && supportedLanguages.includes(cookieLang)) {
    return cookieLang as Language;
  }

  // 2. Check Accept-Language header (browser preference)
  const acceptLanguage = headers.get('accept-language');
  if (acceptLanguage) {
    const browserLangs = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].trim().substring(0, 2).toLowerCase());
    
    for (const browserLang of browserLangs) {
      if (supportedLanguages.includes(browserLang)) {
        return browserLang as Language;
      }
    }
  }

  return defaultLang;
}

export function isValidLanguage(lang: string): lang is Language {
  return supportedLanguages.includes(lang);
}

