# Report 1-1. Next.js 프로젝트 생성

## 작업 결과
완료

---

## 어떤 작업을 했나

### 1. Next.js 프로젝트 생성

`create-next-app`이라는 Next.js 공식 프로젝트 생성 도구를 사용해 프로젝트를 만들었습니다.
기존에 `rion` 폴더 안에 md 파일들이 있어서 충돌이 발생했고, 임시로 다른 곳에 옮긴 뒤 프로젝트를 생성하고 다시 합쳤습니다.

선택한 옵션:
- TypeScript: 코드에 타입을 지정할 수 있어 버그를 미리 잡아줌
- ESLint: 코드 품질을 자동으로 검사해주는 도구
- Tailwind CSS: 클래스 이름으로 스타일을 바로 적용할 수 있는 CSS 프레임워크
- App Router: Next.js의 최신 라우팅 방식 (폴더 구조가 곧 URL 경로가 됨)
- Turbopack: Next.js의 빠른 빌드 도구 (개발 속도 향상)

---

### 2. 기본 파일 정리

Next.js가 기본으로 만들어주는 예시 화면(로고, 링크 등)을 모두 제거했습니다.

**변경된 파일:**

- `app/page.tsx` → 빈 페이지로 교체
  - 기존: Next.js 로고, 링크 등이 있는 기본 예시 화면
  - 변경 후: 아무것도 없는 빈 페이지 (우리가 직접 만들 준비)

- `app/globals.css` → Tailwind import 1줄만 남김
  - 기존: Next.js가 기본으로 넣은 색상 변수, body 스타일 등이 섞여 있었음
  - 변경 후: `@import "tailwindcss"` 한 줄만 남겨 깔끔하게 시작

- `public/next.svg`, `public/vercel.svg` → 삭제
  - Next.js, Vercel 로고 이미지로 우리 프로젝트에는 불필요

---

### 3. 폴더 구조 생성

CLAUDE.md에 정의된 피처 베이스 구조를 실제로 만들었습니다.

```
rion/
├── app/                        ← Next.js 페이지 및 API (기본 생성됨)
├── features/                   ← 기능별 모듈 (새로 생성)
│   ├── themes/                 ← 오늘의 테마 목록 기능
│   │   ├── components/         ← 이 기능의 UI 컴포넌트
│   │   └── hooks/              ← 이 기능의 데이터 fetching 훅
│   ├── theme-detail/           ← 테마 상세 기능
│   │   ├── components/
│   │   └── hooks/
│   └── stock-detail/           ← 종목 상세 기능
│       ├── components/
│       └── hooks/
├── server/                     ← 서버 전용 로직 (새로 생성)
│   ├── crawlers/               ← 네이버 뉴스 크롤링 코드
│   └── queries/                ← DB 조회 코드
├── lib/                        ← 공용 유틸리티 (새로 생성)
├── prisma/                     ← DB 스키마 (나중에 추가)
└── public/                     ← 정적 파일 (이미지 등)
```

---

### 4. 생성된 주요 파일 설명

| 파일 | 역할 |
|---|---|
| `package.json` | 프로젝트 정보 및 사용 중인 패키지 목록 |
| `next.config.ts` | Next.js 설정 파일 |
| `tsconfig.json` | TypeScript 설정 파일 |
| `eslint.config.mjs` | ESLint(코드 검사) 설정 파일 |
| `postcss.config.mjs` | Tailwind CSS가 동작하기 위한 설정 파일 |
| `app/layout.tsx` | 모든 페이지에 공통으로 적용되는 레이아웃 |
| `app/page.tsx` | 메인 페이지 (`localhost:3000`) |
| `app/globals.css` | 전역 CSS 스타일 |

---

## 트러블슈팅

### 문제 1: 기존 파일 충돌
- 원인: `create-next-app`은 빈 폴더에만 생성 가능한데 md 파일들이 있었음
- 해결: md 파일들을 임시 폴더로 이동 → 프로젝트 생성 → 다시 합침

### 문제 2: npm install 미완료
- 원인: 프로젝트 생성 중 인터랙티브 질문이 발생하면서 설치가 불완전하게 됨
- 해결: 수동으로 `npm install` 실행

### 문제 3: Hydration 에러
- 현상: 브라우저 콘솔에 "A tree hydrated but some attributes didn't match" 경고 발생
- 원인: 브라우저 확장 프로그램(다크모드, 번역기 등)이 React가 로드되기 전에 HTML을 수정해서 서버에서 만든 HTML과 달라지는 현상
- 해결: `app/layout.tsx`의 `<html>` 태그에 `suppressHydrationWarning` 속성 추가
  - 이 속성은 React에게 "이 태그에서 발생하는 불일치는 무시해"라고 알려주는 설정
- 추가: `lang="en"` → `lang="ko"` 변경 (한국어 서비스에 맞게)

---

## 완료 확인

- `localhost:3000` 접속 시 빈 페이지 정상 응답 (HTTP 200) 확인
- 브라우저 콘솔 에러 없음
