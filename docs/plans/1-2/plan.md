# Plan 1-2. TanStack Query 설치 및 Provider 세팅

## 목표
TanStack Query 설치 후 전체 앱에 적용될 Provider 세팅

---

## 작업 순서

### 1. 패키지 설치
```bash
npm install @tanstack/react-query
```

### 2. QueryClient Provider 세팅
- `lib/query-client.tsx` 생성 — QueryClient 인스턴스 생성
- `app/layout.tsx` 수정 — QueryClientProvider로 감싸기

---

## 완료 조건
- 패키지 설치 완료
- `localhost:3000` 정상 동작 확인
- `npx tsc --noEmit` 타입 에러 없음
