import type { CommuteMode, DreamHomeProfile, HousingType, Label } from '../types';

/** 선택지 정의 — 이름·설명은 한국어/영어 두 벌로 들고 있습니다. */

export const HOUSING_TYPES: { id: HousingType; label: Label; hint: Label }[] = [
  {
    id: 'apartment',
    label: { ko: '아파트', en: 'Apartment' },
    hint: { ko: '단지·관리·생활 인프라가 함께 있는 주거', en: 'A complex with shared management and amenities' },
  },
  {
    id: 'officetel',
    label: { ko: '오피스텔', en: 'Officetel' },
    hint: { ko: '역세권·소형·1~2인 가구에 유리', en: 'Near stations, compact, good for one or two people' },
  },
];

export const COMMUTE_MODES: { id: CommuteMode; label: Label }[] = [
  { id: 'transit', label: { ko: '대중교통', en: 'Transit' } },
  { id: 'car', label: { ko: '자차', en: 'Car' } },
  { id: 'bike', label: { ko: '자전거', en: 'Bicycle' } },
  { id: 'walk', label: { ko: '도보', en: 'Walk' } },
];

export const AMENITIES: { id: string; label: Label }[] = [
  { id: 'subway', label: { ko: '지하철역', en: 'Subway' } },
  { id: 'park', label: { ko: '공원·산책로', en: 'Park' } },
  { id: 'mart', label: { ko: '대형마트', en: 'Supermarket' } },
  { id: 'hospital', label: { ko: '병원', en: 'Hospital' } },
  { id: 'library', label: { ko: '도서관', en: 'Library' } },
  { id: 'cafe', label: { ko: '카페·상권', en: 'Cafés' } },
  { id: 'gym', label: { ko: '운동시설', en: 'Gym' } },
  { id: 'school', label: { ko: '학교·보육', en: 'Schools' } },
];

export const CONDITIONS: { id: string; label: Label }[] = [
  { id: 'light', label: { ko: '채광 좋음', en: 'Good daylight' } },
  { id: 'quiet', label: { ko: '조용함', en: 'Quiet' } },
  { id: 'parking', label: { ko: '주차 편함', en: 'Easy parking' } },
  { id: 'south', label: { ko: '남향', en: 'South-facing' } },
  { id: 'ventilation', label: { ko: '환기 잘 됨', en: 'Good ventilation' } },
  { id: 'security', label: { ko: '보안 좋음', en: 'Good security' } },
  { id: 'elevator', label: { ko: '엘리베이터', en: 'Elevator' } },
  { id: 'storage', label: { ko: '수납 많음', en: 'Storage' } },
];

export const PET_KINDS: { id: string; label: Label }[] = [
  { id: 'cat', label: { ko: '고양이', en: 'Cat' } },
  { id: 'dog', label: { ko: '강아지', en: 'Dog' } },
  { id: 'small', label: { ko: '소동물', en: 'Small pet' } },
  { id: 'bird', label: { ko: '새', en: 'Bird' } },
];

export const ROUTINE_PRESETS: { id: string; label: Label; morning: Label; evening: Label }[] = [
  {
    id: 'quiet',
    label: { ko: '조용한 아침형', en: 'Quiet mornings' },
    morning: {
      ko: '6시 50분에 일어나 창가에서 물 한 잔과 커피, 8시 10분에 집을 나서요.',
      en: 'Up at 6:50, water and coffee by the window, out the door at 8:10.',
    },
    evening: {
      ko: '7시 반쯤 귀가해 간단히 저녁을 먹고, 9시부터 30분은 책을 읽어요.',
      en: 'Home around 7:30, a simple dinner, then 30 minutes of reading from 9.',
    },
  },
  {
    id: 'commute',
    label: { ko: '출퇴근이 짧은 하루', en: 'Short commute' },
    morning: {
      ko: '7시 20분에 일어나 7시 50분에 나서고, 이동은 30분 안쪽으로 끝내고 싶어요.',
      en: 'Up at 7:20, out at 7:50, and I want the trip to stay under 30 minutes.',
    },
    evening: {
      ko: '6시 반에 퇴근해 7시 전에 집에 도착하고, 저녁은 집에서 만들어 먹어요.',
      en: 'Leave at 6:30, home before 7, and cook dinner at home.',
    },
  },
  {
    id: 'pet',
    label: { ko: '반려동물과 산책하는 하루', en: 'Walks with my pet' },
    morning: {
      ko: '7시에 일어나 20분 산책을 하고 아침을 챙겨요.',
      en: 'Up at 7 for a 20-minute walk, then breakfast.',
    },
    evening: {
      ko: '퇴근 후 8시에 40분 산책, 돌아와서 아이와 놀아 주고 10시 반쯤 잠들어요.',
      en: 'After work, a 40-minute walk at 8, play time, and bed around 10:30.',
    },
  },
  {
    id: 'homebody',
    label: { ko: '집에서 보내는 저녁', en: 'Evenings at home' },
    morning: {
      ko: '8시에 일어나 천천히 아침을 먹고 9시에 나서요.',
      en: 'Up at 8, a slow breakfast, out at 9.',
    },
    evening: {
      ko: '7시에 귀가해 저녁을 먹고, 8시부터 2시간은 집에서 영화나 드라마를 봐요.',
      en: 'Home at 7, dinner, then two hours of films or series at home from 8.',
    },
  },
];

export const DEFAULT_PROFILE: DreamHomeProfile = {
  budgetManwon: 90_000,
  housingType: 'apartment',
  areaM2: 59.9,
  workplace: '',
  commuteMode: 'transit',
  maxCommuteMin: 45,
  hasPet: false,
  petKinds: [],
  petCount: 0,
  amenities: ['subway', 'park', 'mart'],
  conditions: ['light', 'quiet'],
  morning: '',
  evening: '',
  savedComplexIds: [],
  updatedAt: '',
};

export function labelOf(list: { id: string; label: Label }[], id: string): Label | undefined {
  return list.find((item) => item.id === id)?.label;
}
