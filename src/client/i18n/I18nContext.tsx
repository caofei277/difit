import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { en, type TranslationKey } from './en';
import { zh } from './zh';

type SupportedLanguage = 'en' | 'zh';
type NestedKey<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends string
          ? K
          : K extends string
            ? `${K}.${NestedKey<T[K]>}`
            : never
        : never;
    }[keyof T]
  : never;

type TranslationPath = NestedKey<TranslationKey>;

const translations: Record<SupportedLanguage, TranslationKey> = {
  en,
  zh,
};

const STORAGE_KEY = 'difit.language';

function detectBrowserLanguage(): SupportedLanguage {
  if (typeof navigator === 'undefined') return 'en';
  const lang = navigator.language || '';
  if (lang.startsWith('zh')) return 'zh';
  return 'en';
}

function getInitialLanguage(): SupportedLanguage {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'zh') return stored;
  } catch {
    // Ignore localStorage errors
  }
  return detectBrowserLanguage();
}

interface I18nContextValue {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (path: TranslationPath, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function resolveValue(obj: TranslationKey, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  if (typeof current === 'string') return current;
  return path;
}

function interpolate(text: string, vars?: Record<string, string | number>): string {
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (_, key: string) => {
    if (key in vars) return String(vars[key as keyof Record<string, string | number>]);
    return `{${key}}`;
  });
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>(getInitialLanguage);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore
    }
  }, []);

  const t = useCallback(
    (path: TranslationPath, vars?: Record<string, string | number>): string => {
      const raw = resolveValue(translations[language], path);
      return interpolate(raw, vars);
    },
    [language],
  );

  // Set lang attribute on html element for font rendering
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const ctxValue = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return <I18nContext.Provider value={ctxValue}>{children}</I18nContext.Provider>;
}

export function useT(): I18nContextValue['t'] {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useT must be used within I18nProvider');
  return ctx.t;
}

export function useLanguage() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useLanguage must be used within I18nProvider');
  return { language: ctx.language, setLanguage: ctx.setLanguage };
}
