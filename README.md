# 집몽 JIPMONG

> 꿈의 집을 그리고, 오늘의 저축으로 다가갑니다.

집몽은 단순한 부동산 검색 앱이 아니라 **꿈꾸는 집과 생활을 발견하고, 실제 내 집 마련까지 함께하는 장기 프로젝트**입니다.
서울 전역과 경기 남부의 아파트·오피스텔을 대상으로, 사용자의 생활 조건과 자금 상황을 중심에 두고 설계했습니다.

이 저장소는 **v0.1 뼈대**입니다. 로렌(ChatGPT)·브리(Claude)가 이어서 디자인·캐릭터·세부 기능을 채울 수 있도록 화면 구조, 디자인 토큰, 번역 키, 샘플 데이터, 계산 로직, 테스트를 미리 분리해 두었습니다.

- 기준 문서: `../MASTER_PROJECT_GUIDELINE_v1.0.md` · 원문 `attachments/2026-11-26/Pasted text-01c3b398a557448b91051b29bb7500f6.txt` (Ⅲ·Ⅴ·Ⅵ, PROJECT 03)
- 상태: **로컬 main 커밋 완료 · GitHub 원격 푸시는 메인(피클)이 처리 · Vercel 배포 전**
- 비용: 추가 개발비 0원 (무료 도구만 사용, 유료 API·호스팅 없음)

---

## 1. 지금 바로 실행하기

```bash
cd projects/jipmong
npm install
npm run dev          # http://localhost:5184
```

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 (5184) |
| `npm run build` | 타입 검사 + 프로덕션 빌드 (`dist/`) |
| `npm run preview` | 빌드 결과 미리보기 (4184) |
| `npm run typecheck` | 화면 코드 + `api/` 서버 코드 타입 검사 |
| `npm run test:e2e` | Playwright — 데스크톱 1440×900 · 모바일 390×844 |
| `npm run check` | 타입 검사 → 빌드 → E2E 전체 |

> 컨테이너에서 Playwright 브라우저가 `libnspr4.so`를 찾지 못하면
> `export LD_LIBRARY_PATH=/workspace/.libs/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH` 후 실행합니다.
> (사용자 PC·Vercel 빌드에는 해당 없음)

---

## 2. 화면 구성 (4탭)

| 탭 | 파일 | 지금 되는 것 |
| --- | --- | --- |
| **꿈의 집 설정** | `src/features/DreamSetup.tsx` | 희망 매매가·유형·면적·직장·출퇴근·반려동물·생활환경·희망 조건·아침/저녁 일상 입력, 완성도 %, 조건 일치 후보 단지(샘플) |
| **이 집에 산다면 나의 하루** | `src/features/DailyLife.tsx` | 관심 단지의 아침→출근→퇴근→장보기→산책→밤 타임라인, 월 주거비 시나리오, 임장 확인 항목 토글 |
| **내 집 마련 프로젝트** | `src/features/ProjectPlan.tsx` | 필요 자기자금·부족 자금·진행률·예상 준비 기간·월 원리금·총 이자 실시간 계산, 저축 기록(자기자금 반영), 다이어리, 계약·입주 체크리스트 |
| **단지 정보 · 임장 도구** | `src/features/ComplexTools.tsx` | 지역·유형 필터, 16개 샘플 단지 표/카드, 전세가율·전고점 비교, 최대 3곳 비교(취득비·월 부담), 개인 임장 체크리스트 + 메모, 임장 원정대 준비 중 안내 |

공통: 한국어/영어 전환(우상단 KO·EN), 해시 라우팅(`#dream` `#daily` `#project` `#complex`), 모바일 하단 탭, 모든 샘플 값에 `샘플` 배지.

---

## 3. 폴더 구조 — 어디를 고치면 되는지

```
projects/jipmong/
├── public/assets/            ★ 그림·배경·캐릭터·폰트 자리 (로렌·브리)
│   ├── characters/           동물 캐릭터 (비어 있음)
│   ├── illustrations/        생활 장면 일러스트 (비어 있음)
│   ├── backgrounds/          화면 배경 (비어 있음)
│   └── fonts/                Pretendard Regular·Bold (자체 호스팅)
├── src/
│   ├── styles/
│   │   ├── tokens.css        ★ 색·폰트·반경·그림자 (로렌이 여기만 고치면 전체 반영)
│   │   └── global.css        기본 문서 스타일
│   ├── i18n/                 ★ ko.ts(기본) · en.ts · index.tsx (번역 키 분리)
│   ├── data/
│   │   ├── complexes.ts      서울·경기 남부 샘플 단지 16곳 (모두 isSample: true)
│   │   ├── options.ts        유형·출퇴근·생활환경·조건·반려동물·하루 프리셋·기본값
│   │   └── checklists.ts     계약·입주 체크리스트, 임장 체크리스트
│   ├── lib/
│   │   ├── calc.ts           ★ 자금 계산 순수 함수 (테스트 대상)
│   │   ├── match.ts          조건 일치 점수·후보 추천·설정 완성도
│   │   ├── dayScenario.ts    하루 타임라인 생성 (실데이터/시나리오 구분)
│   │   ├── format.ts         금액·퍼센트·기간·평 변환
│   │   └── storage.ts        localStorage 키·기본값 (서버 전송 없음)
│   ├── components/ui.tsx     배지·카드·입력·진행바 등 공통 조각
│   ├── features/             탭별 화면 4개
│   ├── App.tsx               헤더·탭·샘플 배너·푸터
│   └── main.tsx              진입점
├── api/health.ts             Vercel Serverless 자리 (실거래가 키 설정 여부만 응답)
├── e2e/                      basic.spec.ts(기능) · shots.spec.ts(스크린샷)
├── docs/screenshots/         결과 스크린샷 3장
├── PROJECT_SPEC.md · ROADMAP.md · BACKLOG.md · CHANGELOG.md · TEST_REPORT.md
└── .env.example
```

### 협업 규칙 (로렌·브리·피클 공통)

1. 작업 전 **현재 브랜치·최신 커밋·`PROJECT_SPEC.md`**를 먼저 확인합니다.
2. `main`은 공개 가능한 완성본만. 작업은 `feat/...` 브랜치에서 합니다.
3. **디자인·캐릭터**: `src/styles/tokens.css`와 `public/assets/`만 건드리면 기능 코드와 충돌하지 않습니다.
4. **문구**: 화면에 한국어를 직접 쓰지 않고 `src/i18n/ko.ts` → `en.ts`에 같은 키를 추가합니다.
5. **기능 삭제 금지**: 기존 승인 기능을 지우거나 다른 콘셉트로 바꾸지 않고, 추가·개선만 합니다(마스터 지침 Ⅲ-10·11).
6. **샘플·가상 표시 유지**: 새 데이터를 넣을 때도 샘플/실데이터/시뮬레이션을 화면에서 구분합니다(Ⅲ-13).

---

## 4. 실제로 작동하는 것 / 샘플 / 아직 없는 것

### ✅ 실제로 작동 (브라우저에서 확인됨)
- 4개 탭 렌더링·전환, 모바일 하단 탭, KO/EN 전환
- 꿈의 집 조건 입력·저장(localStorage)·완성도 계산
- 조건 기반 후보 단지 점수·정렬 (샘플 단지 대상)
- 관심 단지 저장, 하루 타임라인 생성, 임장 항목 체크
- 자금 계산: 필요 자기자금, 부족 자금, 진행률, 준비 기간, 원리금균등 월 납입액, 총 이자 — 입력 즉시 재계산
- 저축 기록 추가/삭제 → 현재 자기자금·진행률 즉시 반영
- 다이어리, 계약·입주 체크리스트, 임장 체크리스트·메모 저장
- 단지 필터·표/카드·3곳 비교(취득비 1.5%/5.0%, 대출 60%·30년·4.2% 가정)

### 🟡 샘플 데이터
- 단지 16곳의 이름·가격·전세가·전고점·거래량·관리비·출퇴근 시간 — **전부 예시값**
- 하루 타임라인의 출퇴근 시간·교통비·관리비 — 샘플/추정
- 취득 비용·월 부담 비교 — 단순 추정

### ⛔ 아직 없음 (다음 단계)
- 국토교통부 실거래가·매물·교통 실데이터 연동 (`api/trades.ts` 자리만 있음, 프런트 미호출)
- 계정·로그인·DB·기기 간 동기화 (지금은 브라우저 저장만)
- 임장 원정대 모집·채팅 (안전 체계 검증 후)
- 자동 가격 추적·알림, 심층 단지 비교, 유료 리포트(수익화)
- 캐릭터·일러스트·배경 이미지 (자산 폴더만 준비)

---

## 5. 배포 (무료)

1. GitHub `yeogreenji/jipmong` 저장소에 `main` 푸시 (메인 피클 담당)
2. Vercel에서 **Add New → Project → Import** 후 프레임워크 `Vite` 자동 인식
3. 환경 변수는 `.env.example` 참고. 실거래가 키(`MOLIT_TRADE_API_KEY`)는 **서버 전용**으로만 넣습니다(프런트 노출 금지).
4. 배포 후 `https://<project>.vercel.app/api/health` 로 상태·샘플 모드 확인

현재 `vercel.json`: 빌드 `npm run build`, 출력 `dist`, `api/**/*.ts` 함수 최대 30초.

---

## 6. 정본 문서

| 문서 | 내용 |
| --- | --- |
| [PROJECT_SPEC.md](PROJECT_SPEC.md) | 승인 기준 기획서 + v0.1 범위·표시 원칙 |
| [ROADMAP.md](ROADMAP.md) | v0.2~v1.0 단계 계획 |
| [BACKLOG.md](BACKLOG.md) | 후속 아이디어·보류 항목 |
| [CHANGELOG.md](CHANGELOG.md) | 버전별 변경 기록 |
| [TEST_REPORT.md](TEST_REPORT.md) | 타입·빌드·E2E 결과와 미해결 오류 |

> 이 저장소의 단지·시세는 실제 정보가 아닙니다. 샘플 데이터를 실제 시세처럼 표시하거나, 실제 이용자·협찬사·리뷰가 있는 것처럼 보이게 하는 변경은 승인 없이 하지 않습니다.
