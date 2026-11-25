/**
 * 집몽(JIPMONG) 공통 타입
 *
 * 이 파일은 화면·데이터·계산이 함께 쓰는 약속입니다.
 * 새 필드를 추가할 때는 PROJECT_SPEC.md의 승인 범위와 BACKLOG.md를 먼저 확인하세요.
 */

export type Lang = 'ko' | 'en';

/** 한국어·영어 두 벌을 함께 들고 다니는 데이터 라벨 */
export interface Label {
  ko: string;
  en: string;
}

export type HousingType = 'apartment' | 'officetel';
export type CommuteMode = 'transit' | 'car' | 'bike' | 'walk';

/** 사용자가 설정하는 '꿈의 집' 조건 */
export interface DreamHomeProfile {
  budgetManwon: number;
  housingType: HousingType;
  /** 전용면적 ㎡ */
  areaM2: number;
  workplace: string;
  commuteMode: CommuteMode;
  maxCommuteMin: number;
  hasPet: boolean;
  petKinds: string[];
  petCount: number;
  /** 생활환경 선호 (지하철·공원·마트·병원 등 id 목록) */
  amenities: string[];
  /** 희망 조건 (채광·조용함·주차 등 id 목록) */
  conditions: string[];
  morning: string;
  evening: string;
  /** 관심 단지 id */
  savedComplexIds: string[];
  updatedAt: string;
}

/** 단지 정보 — 현재는 전부 샘플 데이터입니다. */
export interface Complex {
  id: string;
  name: string;
  nameEn: string;
  type: HousingType;
  /** 예: '서울 강동구' */
  district: string;
  districtEn: string;
  neighborhood: string;
  neighborhoodEn: string;
  builtYear: number;
  households: number;
  areaM2: number;
  /** 최근 매매 실거래가(샘플) — 만원 단위 */
  priceManwon: number;
  /** 전세 실거래가(샘플) — 만원 단위 */
  jeonseManwon: number;
  /** 전고점(샘플) — 만원 단위 */
  peakPriceManwon: number;
  /** 월 관리비(샘플) — 만원 단위 */
  monthlyFeeManwon: number;
  /** 최근 90일 거래 건수(샘플) */
  tradeCount90d: number;
  station: string;
  line: string;
  walkMin: number;
  /** 직장까지 예상 이동 시간(샘플 추정) — 분 */
  commuteMin: number;
  amenities: string[];
  /** 샘플 데이터임을 코드 레벨에서도 보장합니다. */
  isSample: true;
}

/** 내 집 마련 계산기 입력값 */
export interface FinancePlan {
  targetPriceManwon: number;
  currentFundsManwon: number;
  expectedLoanManwon: number;
  extraCostsManwon: number;
  monthlySavingManwon: number;
  loanRatePct: number;
  loanYears: number;
}

/** 저축 기록 한 건 */
export interface SavingsRecord {
  id: string;
  /** YYYY-MM-DD */
  date: string;
  amountManwon: number;
  memo: string;
}

/** 구매 준비 다이어리 한 건 */
export interface DiaryEntry {
  id: string;
  date: string;
  title: string;
  memo: string;
}

/** 임장 체크리스트 항목 */
export interface WalkthroughItem {
  id: string;
  group: 'light' | 'noise' | 'parking' | 'living' | 'cost';
  label: Label;
  /** 임장에서 직접 확인할 항목이면 true */
  onsite: boolean;
}

export type TabId = 'dream' | 'daily' | 'project' | 'complex';
