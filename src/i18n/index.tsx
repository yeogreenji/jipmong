import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { ko, type MessageKey } from './ko';
import { en } from './en';
import type { Label, Lang } from '../types';

const DICTIONARIES: Record<Lang, Record<MessageKey, string>> = { ko, en };
const STORAGE_KEY = 'jipmong.lang';

interface I18nValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** 화면 문구 */
  t: (key: MessageKey, vars?: Record<string, string | number>) => string;
  /** 데이터에 들어 있는 한국어/영어 라벨 */
  pick: (label: Label) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

function readInitialLang(): Lang {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'ko' || saved === 'en') return saved;
  } catch {
    /* 저장소를 쓸 수 없으면 기본 한국어 */
  }
  return 'ko';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* 무시 */
    }
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);

  const t = useCallback(
    (key: MessageKey, vars?: Record<string, string | number>) => {
      const template = DICTIONARIES[lang][key] ?? ko[key] ?? key;
      if (!vars) return template;
      return template.replace(/\{(\w+)\}/g, (match, name: string) =>
        name in vars ? String(vars[name]) : match,
      );
    },
    [lang],
  );

  const pick = useCallback((label: Label) => label[lang] ?? label.ko, [lang]);

  const value = useMemo<I18nValue>(() => ({ lang, setLang, t, pick }), [lang, setLang, t, pick]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}

export type { MessageKey };
