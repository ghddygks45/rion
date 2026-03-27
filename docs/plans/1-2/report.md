# Report 1-2. TanStack Query 설치 및 Provider 세팅

## 작업 결과
완료

---

## 어떤 작업을 했나

### 1. 패키지 설치

```bash
npm install @tanstack/react-query
```

TanStack Query는 서버에서 데이터를 가져오고(fetch), 캐싱하고, 상태를 관리해주는 라이브러리입니다. 나중에 "버튼 클릭 → 데이터 불러오기 → 화면에 표시"를 구현할 때 핵심으로 사용됩니다.

---

### 2. 생성된 파일

#### `lib/query-client.tsx`

TanStack Query가 동작하려면 `QueryClient`라는 객체가 필요합니다. 이 객체가 데이터 캐싱과 상태 관리를 담당합니다.

이 파일은 두 가지 역할을 합니다:
- `QueryClient` 인스턴스를 생성
- `QueryClientProvider`로 앱 전체를 감싸서 어디서든 TanStack Query를 사용할 수 있게 해주는 `Providers` 컴포넌트 제공

`"use client"` 선언이 있는 이유: `useState`를 사용하기 때문에 클라이언트 컴포넌트로 지정해야 합니다. Next.js에서는 브라우저에서만 동작하는 코드에 이 선언이 필요합니다.

---

### 3. 수정된 파일

#### `app/layout.tsx`

모든 페이지에 공통으로 적용되는 레이아웃 파일입니다. 여기서 `Providers`로 `children`을 감쌌습니다.

```tsx
<body>
  <Providers>{children}</Providers>
</body>
```

이렇게 하면 앱의 모든 페이지에서 TanStack Query를 사용할 수 있습니다.

---

## 완료 확인

- `npx tsc --noEmit` 타입 에러 없음
