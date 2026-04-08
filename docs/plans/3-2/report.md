# Plan 3-2 Report — 키움 API 데이터 브라우저 연결 테스트

## 구현 완료 일자
2026-04-08

---

## 개요

테마 목록 페이지(`/theme`)에서 목업 데이터 대신 키움 ka90001 실데이터를 표시하도록 연결했다.
TanStack Query의 `useQuery`로 `/api/kiwoom/themes`를 10초마다 호출해 등락률이 자동 갱신된다.

---

## 구현한 파일

### `features/themes/hooks/useThemes.ts`

TanStack Query `useQuery` 훅. 두 가지 역할을 한다.

1. `/api/kiwoom/themes`에 fetch 요청
2. ka90001 응답(`KiwoomThemeGroup`)을 우리 서비스 타입(`Theme`)으로 변환(매핑)

**매핑 내용:**
- `thema_grp_cd` → `id`
- `thema_nm` → `name`
- `flu_rt` (문자열 `"+18.08"`) → `avgChangeRate` (숫자 `18.08`, `parseFloat`으로 변환)
- `summary` → `""` (ka90001에 없는 필드, 빈 문자열로 채움)
- `stocks` → `[]` (ka90002에서 별도 조회 필요, 지금은 빈 배열)

`refetchInterval: 10000` — 10초마다 자동 재요청해서 실시간에 가깝게 데이터 갱신.

### `app/theme/page.tsx`

- 서버 컴포넌트 → 클라이언트 컴포넌트로 변경 (`"use client"` 추가)
- `mockThemes` → `useThemes()` 훅으로 교체
- `isLoading`, `isError` 상태 처리 추가

---

## 주요 결정 사항

### 실시간 갱신 방식
키움 REST API는 요청-응답 방식이라 진짜 실시간(WebSocket)이 아니다.
`refetchInterval: 10000`으로 10초마다 재요청하는 방식으로 대응했다.
WebSocket 지원 여부는 추후 확인 예정.

### 클라이언트 컴포넌트 전환 이유
`useQuery`는 브라우저에서만 실행되는 훅이라 서버 컴포넌트에서 쓸 수 없다.
`"use client"`를 추가해 클라이언트 컴포넌트로 전환했다.

---

## 완료 조건 확인

- [x] `/theme` 접속 시 키움 실데이터 테마 목록 표시
- [x] 10초마다 자동 갱신
- [x] `npx tsc --noEmit` 타입 에러 없음
- [x] `npm run build` 빌드 성공
- [x] localhost:3000 화면 확인
