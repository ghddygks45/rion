# 세션 회의록 - 2026-03-27

## 참여자
- 사용자 (기획/설계 담당)
- Claude (개발 담당)

---

## 회의 내용

오늘은 RION 프로젝트의 첫 번째 세션으로, 코딩을 시작하기 전 프로젝트 전반의 방향성과 기술 스택, 협업 방식을 정의하는 데 집중했다.

### 프로젝트 문서 정리

기존에 작성된 `product.md`와 `disign.md`가 영어로 되어 있어 한국어로 전면 번역했다. 내용 변경은 없이 언어만 바꿨다.

### 기술 스택 확정

사용자가 프론트엔드 개발자임을 감안해 익숙한 스택을 우선으로 했다. Next.js, TypeScript, Tailwind CSS, TanStack Query를 프론트 기반으로 확정했고, 배포는 Vercel로 결정했다.

백엔드를 별도 서버로 분리할지 논의했으나, MVP 단계에서는 Next.js Route Handlers로 처리하는 것으로 결론 냈다. 이유는 단일 코드베이스 유지와 Vercel 배포 편의성 때문이다.

DB는 Supabase(PostgreSQL) + Prisma 조합으로 결정했다. Vercel과 연동이 간단하고, Prisma와의 궁합이 좋으며, 무료 티어로 시작이 가능하다는 점이 이유였다.

### MVP 범위 조율

초기에는 크론 자동화와 LLM 요약까지 논의했으나, 수요 확인을 먼저 해야 한다는 판단 하에 MVP 범위를 좁히기로 했다. 사용자가 조회 버튼을 클릭하면 그때 네이버 뉴스를 크롤링해서 결과를 보여주는 방식으로 시작한다. LLM, 크론, 실시간 알림은 모두 나중으로 미뤘다.

크롤링만 하면 Vercel 무료 플랜 타임아웃(10초) 안에 충분히 처리 가능하다는 것도 확인했다.

### 아키텍처 결정

폴더 구조를 레이어 베이스와 피처 베이스 중 고민했다. product.md 기준으로 기능이 테마 목록, 테마 상세, 종목 상세, 알림으로 명확히 나뉘어 있어 피처 베이스로 결정했다. 기능 추가/삭제 시 해당 폴더만 건드리면 된다는 점이 핵심 이유였다.

### 협업 방식 정의

사용자가 설계와 판단을 맡고, Claude는 지시받은 코딩만 한다는 원칙을 CLAUDE.md에 명문화했다. 요청 범위를 벗어난 기능 추가, 리팩토링, 주석 추가 등은 하지 않는 것으로 합의했다.

### 개발 순서 확정

`roadmap.md`에 Phase 1~4로 나눠 전체 작업 순서를 정리했다. 주목할 점은 Vercel 배포를 초반에 미리 연결하고, 프론트엔드를 목업 데이터로 먼저 완성한 뒤 백엔드를 붙이는 방식을 택했다는 것이다.

### 로그 시스템 구성

오늘 대화를 계기로 작업 로그 시스템을 만들었다. 날짜별 폴더에 회의록(session.md)과 결정사항(decisions.md)을 남기고, logs.md가 전체 인덱스 역할을 한다. 새 대화창에서 로그를 읽히면 맥락을 복구할 수 있는 구조다.

---

### Plan 1-1 실행 (Next.js 프로젝트 생성)

깃허브 레포(https://github.com/ghddygks45/rion) 연결 후 plan 1-1을 진행했다. `create-next-app`으로 프로젝트를 생성했는데, 기존 md 파일들과 충돌이 발생해 임시 폴더로 이동 후 생성하고 다시 합치는 방식으로 해결했다. 설치 중 패키지가 불완전하게 설치되는 문제가 있어 `npm install`을 수동으로 재실행했다. 브라우저 확장 프로그램으로 인한 Hydration 에러가 발생해 `suppressHydrationWarning` 속성 추가로 해결했다. `lang="en"`도 `lang="ko"`로 수정했다. 피처 베이스 폴더 구조(`/features`, `/server`, `/lib`) 생성을 완료했고, localhost:3000 정상 동작을 확인했다.

---

### Plan 1-2 실행 (TanStack Query 설치 및 Provider 세팅)

`@tanstack/react-query` 패키지를 설치했다. `lib/query-client.tsx`에 QueryClient 인스턴스와 Providers 컴포넌트를 만들고, `app/layout.tsx`에서 전체 앱을 Providers로 감쌌다. 타입 에러 없음 확인 완료.

---

### Plan 1-3 실행 (Tailwind 디자인 토큰 세팅)

Pretendard 폰트 패키지를 설치하고 `next/font/local`로 등록했다. `app/layout.tsx`에서 Geist 폰트를 완전히 제거하고 Pretendard로 교체했다. `app/globals.css`에 Tailwind v4 `@theme` 블록으로 disign.md 기반 색상 토큰 11종을 등록했다. body에 기본 배경색과 텍스트 색도 적용했다. `docs/disign.md` 타이포그래피 항목에 Pretendard 폰트 명시. 타입 에러 없음 확인 완료.

---

## 현재 상태

- plan 1-1 완료
- plan 1-2 완료
- plan 1-3 완료

## 다음 할 일

- plan 1-4: Vercel 배포 연결
