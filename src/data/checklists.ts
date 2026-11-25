import type { Label, WalkthroughItem } from '../types';

/** 계약·입주 준비 체크리스트 — 그룹별로 화면에서 묶어 보여 줍니다. */
export interface ContractChecklistItem {
  id: string;
  group: 'fund' | 'find' | 'visit' | 'contract' | 'move';
  label: Label;
}

export const CONTRACT_CHECKLIST: ContractChecklistItem[] = [
  {
    id: 'fund-01',
    group: 'fund',
    label: {
      ko: '필요 자기자금(집값 − 대출 + 부대비용)을 다시 계산했다',
      en: 'Rechecked the cash needed (price − loan + costs)',
    },
  },
  {
    id: 'fund-02',
    group: 'fund',
    label: { ko: '대출 가능액을 은행·상담사에게 실제로 확인했다', en: 'Confirmed the real loan limit with a bank' },
  },
  {
    id: 'fund-03',
    group: 'fund',
    label: { ko: '취득세·중개보수·이사 비용을 예산에 넣었다', en: 'Budgeted acquisition tax, fees and moving costs' },
  },
  {
    id: 'fund-04',
    group: 'fund',
    label: { ko: '비상금 6개월치를 건드리지 않기로 정했다', en: 'Decided not to touch six months of emergency savings' },
  },
  {
    id: 'find-01',
    group: 'find',
    label: { ko: '후보 단지 3곳을 같은 기준으로 비교했다', en: 'Compared three candidates on the same basis' },
  },
  {
    id: 'find-02',
    group: 'find',
    label: { ko: '전세가율·거래량으로 환금성을 확인했다', en: 'Checked liquidity via jeonse ratio and trade volume' },
  },
  {
    id: 'find-03',
    group: 'find',
    label: { ko: '실거래가와 매물 호가를 구분해 봤다', en: 'Separated real transactions from listing prices' },
  },
  {
    id: 'visit-01',
    group: 'visit',
    label: { ko: '평일 낮과 밤, 주말에 각각 가 봤다', en: 'Visited on a weekday day, weekday night and weekend' },
  },
  {
    id: 'visit-02',
    group: 'visit',
    label: { ko: '채광·소음·주차를 직접 확인했다', en: 'Checked daylight, noise and parking in person' },
  },
  {
    id: 'visit-03',
    group: 'visit',
    label: { ko: '출퇴근 시간을 실제로 재 봤다', en: 'Timed the actual commute' },
  },
  {
    id: 'contract-01',
    group: 'contract',
    label: { ko: '등기부등본·건축물대장을 확인했다', en: 'Checked the registry and building ledger' },
  },
  {
    id: 'contract-02',
    group: 'contract',
    label: { ko: '특약(대출 불가 시·하자·잔금일)을 정리했다', en: 'Drafted special clauses (loan, defects, balance date)' },
  },
  {
    id: 'contract-03',
    group: 'contract',
    label: { ko: '중개보수와 계약금 조건을 확인했다', en: 'Confirmed brokerage fee and deposit terms' },
  },
  {
    id: 'move-01',
    group: 'move',
    label: { ko: '잔금일·입주일·이사 날짜를 맞췄다', en: 'Aligned balance, move-in and moving dates' },
  },
  {
    id: 'move-02',
    group: 'move',
    label: { ko: '전입신고·확정일자 일정을 정했다', en: 'Planned move-in report and date stamp' },
  },
  {
    id: 'move-03',
    group: 'move',
    label: { ko: '관리비·공과금 이관을 확인했다', en: 'Handled maintenance fee and utility transfers' },
  },
];

export const CONTRACT_GROUP_ORDER: ContractChecklistItem['group'][] = [
  'fund',
  'find',
  'visit',
  'contract',
  'move',
];

/**
 * 개인 임장 체크리스트
 * onsite:true → 데이터로 확인할 수 없어 직접 봐야 하는 항목
 */
export const WALKTHROUGH_ITEMS: WalkthroughItem[] = [
  {
    id: 'light-am-pm',
    group: 'light',
    label: { ko: '오전·오후 채광이 모두 드는지', en: 'Daylight in both morning and afternoon' },
    onsite: true,
  },
  {
    id: 'light-view',
    group: 'light',
    label: { ko: '창밖 전망(건물·산·하늘)과 앞 건물 높이', en: 'View and the height of buildings in front' },
    onsite: true,
  },
  {
    id: 'noise-road',
    group: 'noise',
    label: { ko: '큰길·철길·공사 소음', en: 'Road, rail and construction noise' },
    onsite: true,
  },
  {
    id: 'noise-between',
    group: 'noise',
    label: { ko: '층간소음과 옆집 소리', en: 'Noise between floors and from neighbours' },
    onsite: true,
  },
  {
    id: 'parking-count',
    group: 'parking',
    label: { ko: '세대당 주차 대수와 저녁 주차 상황', en: 'Parking per household and evening availability' },
    onsite: true,
  },
  {
    id: 'living-moisture',
    group: 'living',
    label: { ko: '곰팡이·누수·결로 흔적', en: 'Signs of mould, leaks or condensation' },
    onsite: true,
  },
  {
    id: 'living-smell',
    group: 'living',
    label: { ko: '집 안 냄새와 환기 상태', en: 'Smell and ventilation' },
    onsite: true,
  },
  {
    id: 'living-pet',
    group: 'living',
    label: { ko: '반려동물과 살기 좋은 동선·엘리베이터', en: 'Routes and lifts that suit a pet' },
    onsite: true,
  },
  {
    id: 'living-amenity',
    group: 'living',
    label: { ko: '마트·병원·공원까지 실제 걸어 보기', en: 'Walk to shops, hospital and park yourself' },
    onsite: true,
  },
  {
    id: 'cost-fee',
    group: 'cost',
    label: { ko: '관리비 고지서 실물 확인', en: 'Check an actual maintenance fee bill' },
    onsite: false,
  },
  {
    id: 'cost-repair',
    group: 'cost',
    label: { ko: '수리·교체가 필요한 부분과 비용', en: 'Repairs needed and their cost' },
    onsite: false,
  },
  {
    id: 'cost-lease',
    group: 'cost',
    label: { ko: '전세가율과 보증보험 가능 여부', en: 'Jeonse ratio and deposit insurance eligibility' },
    onsite: false,
  },
];

export const WALKTHROUGH_GROUPS: { id: WalkthroughItem['group']; label: Label }[] = [
  { id: 'light', label: { ko: '빛과 전망', en: 'Light and view' } },
  { id: 'noise', label: { ko: '소음', en: 'Noise' } },
  { id: 'parking', label: { ko: '주차', en: 'Parking' } },
  { id: 'living', label: { ko: '생활', en: 'Living' } },
  { id: 'cost', label: { ko: '비용', en: 'Cost' } },
];
