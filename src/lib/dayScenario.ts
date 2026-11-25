import type { Complex, DreamHomeProfile } from '../types';
import type { FinanceSummary } from './calc';
import type { MessageKey } from '../i18n/ko';
import { AMENITIES, labelOf } from '../data/options';

export type MomentKind = 'scenario' | 'estimate' | 'check';

export interface DayMoment {
  id: string;
  time: string;
  title: string;
  body: string;
  kind: MomentKind;
  /** 임장 체크리스트 항목 id */
  checks?: string[];
}

export interface MonthlyCost {
  loanManwon: number | null;
  feeManwon: number;
  transportManwon: number;
  bufferManwon: number;
  totalManwon: number;
}

interface Translate {
  (key: MessageKey, vars?: Record<string, string | number>): string;
}

const TRANSPORT_COST: Record<DreamHomeProfile['commuteMode'], number> = {
  transit: 8,
  car: 16,
  bike: 3,
  walk: 1,
};

/**
 * 관심 단지의 하루를 시간대별로 만듭니다.
 * 데이터로 확인되지 않는 값은 반드시 kind: 'estimate' 또는 checks(임장 확인)로 표시합니다.
 */
export function buildDay(
  profile: DreamHomeProfile,
  complex: Complex,
  summary: FinanceSummary,
  t: Translate,
  lang: 'ko' | 'en',
): { moments: DayMoment[]; monthly: MonthlyCost } {
  const amenityLabel = (id: string): string | null => {
    const label = labelOf(AMENITIES, id);
    return label ? label[lang] : null;
  };

  const ride = Math.max(0, complex.commuteMin - complex.walkMin);
  const park = complex.amenities.includes('park') ? amenityLabel('park') : null;
  const mart = complex.amenities.includes('mart') ? amenityLabel('mart') : null;

  const moments: DayMoment[] = [
    {
      id: 'morning',
      time: '07:00',
      title: t('daily.morning'),
      body: profile.morning.trim() || t('daily.sc.morningDefault'),
      kind: 'scenario',
      checks: ['light-am-pm', 'light-view'],
    },
    {
      id: 'commute',
      time: '08:20',
      title: t('daily.commute'),
      body: t('daily.sc.commute', {
        station: complex.station,
        walk: complex.walkMin,
        ride,
      }),
      kind: 'estimate',
    },
    {
      id: 'evening-commute',
      time: '19:00',
      title: t('daily.eveningCommute'),
      body: t('daily.sc.eveningCommute', {
        neighborhood: lang === 'en' ? complex.neighborhoodEn : complex.neighborhood,
      }),
      kind: 'scenario',
    },
    {
      id: 'grocery',
      time: '19:40',
      title: t('daily.grocery'),
      body: t('daily.sc.grocery', {
        place: mart ?? t('daily.sc.groceryLocal'),
      }),
      kind: 'scenario',
      checks: ['living-amenity'],
    },
    {
      id: 'walk',
      time: '20:30',
      title: t('daily.walk'),
      body: profile.hasPet
        ? t('daily.sc.walkPet', {
            place: park ?? t('daily.sc.walkLocal'),
            count: Math.max(1, profile.petCount),
          })
        : t('daily.sc.walkNoPet', { place: park ?? t('daily.sc.walkLocal') }),
      kind: 'scenario',
      checks: profile.hasPet ? ['living-pet', 'living-amenity'] : ['living-amenity'],
    },
    {
      id: 'night',
      time: '22:00',
      title: t('daily.night'),
      body: profile.evening.trim() || t('daily.sc.nightDefault'),
      kind: 'scenario',
      checks: ['noise-road', 'noise-between'],
    },
  ];

  const loanManwon = summary.monthlyPaymentManwon === null ? null : Math.round(summary.monthlyPaymentManwon);
  const feeManwon = complex.monthlyFeeManwon;
  const transportManwon = TRANSPORT_COST[profile.commuteMode];
  const bufferManwon = 15;
  const totalManwon = (loanManwon ?? 0) + feeManwon + transportManwon + bufferManwon;

  return {
    moments,
    monthly: { loanManwon, feeManwon, transportManwon, bufferManwon, totalManwon },
  };
}
