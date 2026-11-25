# CHANGELOG — 집몽 JIPMONG

형식: [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/) · 버전은 `package.json`과 맞춥니다.

## [0.1.0] — 2026-11-26 · 뼈대

담당: 피클(Pickle) · 기준 문서: 마스터 프로젝트 지침 v1.0 PROJECT 03

### 추가

- **프로젝트 기반**: Vite 7 · React 19 · TypeScript 5.9(strict) · Tailwind CSS v4 · lucide-react · Vercel 설정(`vercel.json`, `tsconfig.api.json`)
- **디자인 토큰**: `src/styles/tokens.css` — 크림/모스/살구 팔레트, Pretendard 자체 호스팅(서브셋 Regular·Bold), 카드·배지 공통 클래스
- **다국어 구조**: `src/i18n/ko.ts`(기본) · `en.ts`(같은 키 강제) · `index.tsx`(Provider, localStorage 유지)
- **꿈의 집 설정 탭**: 예산·유형·면적·직장·출퇴근·반려동물·생활환경·희망 조건·아침/저녁 일상 입력, 완성도 %, 조건 일치 후보 단지
- **나의 하루 탭**: 아침·출근·퇴근·장보기·산책·밤 타임라인, 월 주거비 시나리오, 임장 확인 토글, 배지 범례
- **내 집 마련 프로젝트 탭**: 필요 자기자금·부족 자금·진행률·준비 기간·월 원리금·총 이자 실시간 계산, 저축 기록(자기자금 반영), 다이어리, 계약·입주 체크리스트 16항목
- **단지 정보·임장 도구 탭**: 지역·유형 필터, 표(데스크톱)·카드(모바일), 전세가율·전고점, 최대 3곳 비교, 임장 체크리스트 12항목 + 메모, 임장 원정대 준비 중 안내
- **샘플 데이터**: 서울·경기 남부 아파트 13곳·오피스텔 3곳 (모두 `isSample: true`, 이름·가격은 가상)
- **계산 로직**: `src/lib/calc.ts` 순수 함수 — 원리금균등, 필요 자기자금, 준비 기간, 취득비 추정
- **API 자리**: `api/health.ts` — 버전·샘플 모드·실거래가 키 설정 여부만 응답(비밀값 미노출)
- **테스트**: Playwright 데스크톱(1440×900)·모바일(390×844) E2E 10건, 스크린샷 3장
- **정본 문서 7종**: README · PROJECT_SPEC · ROADMAP · BACKLOG · CHANGELOG · TEST_REPORT · .env.example
- **자산 폴더**: `public/assets/{characters,illustrations,backgrounds,icons,fonts}` + 사용 규칙 README

### 표시 원칙

- 상단 샘플 배너, 모든 단지·시세 카드에 `샘플` 배지
- 계산 결과에 `단순 계산` 배지와 고지문(실제 대출 가능액 아님)
- 하루 항목별 `가상 시나리오` / `추정` / `임장 확인` 구분
- 개인 자금·체크리스트는 브라우저 localStorage에만 저장, 서버 전송 없음

### 알려진 한계

- 단지·시세·출퇴근·관리비는 전부 샘플. 실거래가 API 미연동
- 계정·DB·기기 간 동기화 없음
- 임장 원정대 미개방(안전 검증 전)
- 폰트는 한국어 음절+라틴 서브셋(2가중치). 얇은 100~300 굵기는 400으로 표시
