# Plan 1-1. Next.js 프로젝트 생성

## 목표
Next.js + TypeScript + Tailwind + App Router 기반 프로젝트 초기 생성 및 폴더 구조 세팅

---

## 작업 순서

### 1. 프로젝트 생성
```bash
npx create-next-app@latest rion
```

선택 옵션:
- TypeScript → Yes
- ESLint → Yes
- Tailwind CSS → Yes
- `src/` directory → No
- App Router → Yes
- Turbopack → Yes
- import alias → Yes (`@/*`)

---

### 2. 불필요한 기본 파일 제거
- `app/page.tsx` 내용 비우기 (빈 페이지로)
- `app/globals.css` 에서 Tailwind 기본 import 3줄만 남기고 나머지 제거
- `public/` 내 기본 이미지 파일 제거 (vercel.svg, next.svg)

---

### 3. 피처 베이스 폴더 구조 생성
```
/features
  /themes
    /components
    /hooks
  /theme-detail
    /components
    /hooks
  /stock-detail
    /components
    /hooks
/server
  /crawlers
  /queries
/lib
```

---

### 4. 확인
- `npm run dev` 실행 후 localhost:3000 빈 페이지 정상 확인
- 폴더 구조 CLAUDE.md와 일치 여부 확인

---

## 완료 조건
- 프로젝트 생성 완료
- 기본 폴더 구조 생성 완료
- 로컬 실행 정상 확인
