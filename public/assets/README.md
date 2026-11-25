# public/assets — 그림·배경·폰트 자리

로렌·브리가 만든 이미지를 **이 폴더에만 넣으면** 코드 수정 없이 화면에서 쓸 수 있게 만든 공간입니다.
파일 경로는 항상 `/assets/...` 로 시작합니다(빌드하면 그대로 복사됩니다).

```
public/assets/
├── characters/      집몽 마스코트·동물 캐릭터 (SVG 또는 PNG, 투명 배경 권장)
├── illustrations/   꿈의 집·생활 장면 일러스트 (아침/출퇴근/산책/장보기 등)
├── backgrounds/     화면 배경 (하늘·골목·거실 등, 16:9 또는 3:4)
├── icons/           직접 그린 아이콘 (lucide-react로 부족할 때만)
└── fonts/           Pretendard-Regular.woff2 · Pretendard-Bold.woff2
```

## 규칙

1. **파일 이름은 영문 소문자·하이픈**: `morning-window.svg`, `cat-mascot-happy.png`
2. **저작권**: 직접 그리거나 상업적 사용이 허락된 자산만. 기존 게임·브랜드 캐릭터를 복제하지 않습니다(마스터 지침 Ⅲ-8·9).
3. **용량**: 한 장 500KB 이하 권장. 배경은 WebP/AVIF를 쓰면 더 가볍습니다.
4. **문구는 그림 안에 굽지 않기**: 글자는 `src/i18n/`에서 관리해야 영어·한국어 전환이 됩니다.
5. **샘플·가상 이미지 표시**: 실제 단지 사진이 아닌 그림을 실제 매물 사진처럼 쓰지 않습니다.

## 폰트

현재 Pretendard Regular(400)·Bold(700)를 한국어 음절 + 라틴 문자로 서브셋해 넣어 두었습니다
(SIL Open Font License 1.1, 출처: https://github.com/orioncactus/pretendard).
다른 서체로 바꾸려면 `src/styles/tokens.css`의 `--font-sans`와 `@font-face` 두 곳만 고치면 됩니다.

## 아직 비어 있는 파일

`characters/`, `illustrations/`, `backgrounds/` 는 v0.1에서 비어 있습니다.
화면은 지금 아이콘과 색으로만 구성되어 있고, 그림이 추가되면 `src/features/`에서 `<img src="/assets/...">`로 연결합니다.
