# Plan 3-2. 키움 API 데이터 브라우저 연결 테스트 (테마 목록 실데이터)

## 목표

테마 목록 페이지(`/theme`)에서 목업 데이터 대신 키움 ka90001 실데이터를 표시한다.
TanStack Query의 `useQuery`로 `/api/kiwoom/themes`를 호출하고, 화면에 렌더링한다.

---

## 현재 상태

- `/theme` 페이지는 `mockThemes` 목업 데이터를 사용 중
- `GET /api/kiwoom/themes` Route Handler는 이미 구현됨 (plan 3-1)

---

## ka90001 응답 → Theme 타입 매핑

ka90001이 주는 데이터와 기존 Theme 타입을 비교하면:

| Theme 필드 | ka90001 필드 | 비고 |
|---|---|---|
| id | thema_grp_cd | 그대로 사용 |
| name | thema_nm | 그대로 사용 |
| avgChangeRate | flu_rt | `"+18.08"` → `18.08` 숫자 변환 필요 |
| summary | 없음 | 일단 빈 문자열 |
| stocks | 없음 | ka90002 필요, 일단 빈 배열 |

---

## 구현할 파일

### 1. `features/themes/hooks/useThemes.ts`

TanStack Query로 `/api/kiwoom/themes`를 호출하는 훅.
ka90001 응답을 Theme 타입으로 변환(매핑)하는 로직 포함.

```ts
export function useThemes() {
  return useQuery({
    queryKey: ['themes'],
    queryFn: async () => {
      const res = await fetch('/api/kiwoom/themes')
      const data: Ka90001Response = await res.json()
      return data.thema_grp.map((item) => ({
        id: item.thema_grp_cd,
        name: item.thema_nm,
        avgChangeRate: parseFloat(item.flu_rt),
        summary: '',
        stocks: [],
      }))
    },
  })
}
```

### 2. `app/theme/page.tsx` 수정

- `mockThemes` → `useThemes()` 훅으로 교체
- 로딩/에러 상태 처리 추가
- 서버 컴포넌트 → 클라이언트 컴포넌트로 변경 (`'use client'` 추가)

---

## 완료 조건

- `/theme` 접속 시 키움 실데이터 테마 목록 표시
- `npx tsc --noEmit` 타입 에러 없음
- `npm run build` 빌드 성공
- localhost:3000 화면 확인
