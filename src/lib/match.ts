import type { Complex, DreamHomeProfile } from '../types';

export interface Candidate {
  complex: Complex;
  /** 0~100, 조건에 얼마나 가까운지 (실제 추천 알고리즘이 아니라 단순 가점) */
  score: number;
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

/**
 * 꿈의 집 조건과 단지의 단순 일치 점수.
 * 유형이 다르면 후보에서 제외합니다(null).
 */
export function scoreComplex(profile: DreamHomeProfile, complex: Complex): number | null {
  if (profile.housingType !== complex.type) return null;

  let score = 0;

  // 예산 (30)
  const budget = profile.budgetManwon;
  if (budget <= 0) {
    score += 15;
  } else if (complex.priceManwon <= budget) {
    score += 30;
  } else {
    const over = (complex.priceManwon - budget) / budget;
    score += over <= 0.2 ? 30 * (1 - over / 0.2) : 0;
  }

  // 면적 (20)
  const areaBase = profile.areaM2 > 0 ? profile.areaM2 : complex.areaM2;
  const areaDiff = Math.abs(complex.areaM2 - areaBase) / areaBase;
  score += 20 * clamp(1 - areaDiff / 0.3, 0, 1);

  // 출퇴근 (20)
  const maxCommute = profile.maxCommuteMin;
  if (maxCommute <= 0) {
    score += 10;
  } else if (complex.commuteMin <= maxCommute) {
    score += 20;
  } else {
    const over = (complex.commuteMin - maxCommute) / maxCommute;
    score += over <= 0.5 ? 20 * (1 - over / 0.5) : 0;
  }

  // 생활환경 (20)
  if (profile.amenities.length === 0) {
    score += 14;
  } else {
    const hits = profile.amenities.filter((id) => complex.amenities.includes(id)).length;
    score += 20 * (hits / profile.amenities.length);
  }

  // 반려동물 (10)
  if (!profile.hasPet) {
    score += 10;
  } else {
    score += complex.amenities.includes('park') ? 10 : 4;
  }

  return Math.round(clamp(score, 0, 100));
}

/** 조건에 가까운 후보 상위 n곳. 점수가 45 미만이면 후보로 보지 않습니다. */
export function findCandidates(
  profile: DreamHomeProfile,
  complexes: Complex[],
  limit = 6,
): Candidate[] {
  return complexes
    .map((complex) => ({ complex, score: scoreComplex(profile, complex) }))
    .filter((entry): entry is Candidate => entry.score !== null && entry.score >= 45)
    .sort((a, b) => b.score - a.score || a.complex.priceManwon - b.complex.priceManwon)
    .slice(0, limit);
}

/** 설정 완성도 (0~100): 비어 있는 항목이 적을수록 높습니다. */
export function profileCompletion(profile: DreamHomeProfile): number {
  const checks: boolean[] = [
    profile.budgetManwon > 0,
    profile.areaM2 > 0,
    profile.workplace.trim().length > 0,
    profile.maxCommuteMin > 0,
    profile.amenities.length > 0,
    profile.conditions.length > 0,
    profile.morning.trim().length > 0,
    profile.evening.trim().length > 0,
  ];
  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}
