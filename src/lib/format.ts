import type { Lang } from '../types';

/** 만원 단위 숫자를 사람이 읽는 금액으로 바꿉니다. */
export function formatManwon(valueManwon: number, lang: Lang): string {
  const value = Math.round(valueManwon);
  const sign = value < 0 ? '-' : '';
  const abs = Math.abs(value);

  if (lang === 'en') {
    return `${sign}₩${(abs * 10_000).toLocaleString('en-US')}`;
  }

  if (abs === 0) return '0원';
  const eok = Math.floor(abs / 10_000);
  const man = abs % 10_000;
  if (eok > 0 && man > 0) return `${sign}${eok}억 ${man.toLocaleString('ko-KR')}만원`;
  if (eok > 0) return `${sign}${eok}억원`;
  return `${sign}${man.toLocaleString('ko-KR')}만원`;
}

/** 8,900만원처럼 짧게 (표 안에서 폭을 아끼고 싶을 때) */
export function formatManwonShort(valueManwon: number, lang: Lang): string {
  const value = Math.round(valueManwon);
  if (lang === 'en') {
    const eok = value / 10_000;
    return `₩${eok % 1 === 0 ? eok.toFixed(0) : eok.toFixed(1)}억`;
  }
  if (Math.abs(value) >= 10_000) {
    const eok = value / 10_000;
    return `${eok % 1 === 0 ? eok.toFixed(0) : eok.toFixed(1)}억`;
  }
  return `${value.toLocaleString('ko-KR')}만`;
}

export function formatPct(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

/** 개월 수를 '3년 4개월' / '3 yr 4 mo'로 */
export function formatDuration(months: number, lang: Lang): string {
  const total = Math.max(0, Math.round(months));
  const years = Math.floor(total / 12);
  const rest = total % 12;
  if (lang === 'en') {
    if (years > 0 && rest > 0) return `${years} yr ${rest} mo`;
    if (years > 0) return `${years} yr`;
    return `${rest} mo`;
  }
  if (years > 0 && rest > 0) return `${years}년 ${rest}개월`;
  if (years > 0) return `${years}년`;
  return `${rest}개월`;
}

export function formatPyeong(areaM2: number): string {
  return (areaM2 / 3.305785).toFixed(1);
}

export function formatDateTime(iso: string, lang: Lang): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(lang === 'ko' ? 'ko-KR' : 'en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function todayIso(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}
