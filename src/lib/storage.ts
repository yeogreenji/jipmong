import type { FinancePlan } from '../types';

export const STORAGE_KEYS = {
  profile: 'jipmong.profile.v1',
  finance: 'jipmong.finance.v1',
  savings: 'jipmong.savings.v1',
  diary: 'jipmong.diary.v1',
  contractChecks: 'jipmong.checks.contract.v1',
  visitChecks: 'jipmong.visit.checks.v1',
  visitMemos: 'jipmong.visit.memos.v1',
} as const;

export function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...(JSON.parse(raw) as object) } as T;
  } catch {
    return fallback;
  }
}

export function loadArray<T>(key: string): T[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export function saveJson(key: string, value: unknown): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/** 기본 예시값 — 사용자가 처음 열었을 때 계산기가 비어 보이지 않도록 넣은 값입니다. */
export const DEFAULT_FINANCE: FinancePlan = {
  targetPriceManwon: 90_000,
  currentFundsManwon: 25_000,
  expectedLoanManwon: 50_000,
  extraCostsManwon: 1_350,
  monthlySavingManwon: 200,
  loanRatePct: 4.2,
  loanYears: 30,
};
