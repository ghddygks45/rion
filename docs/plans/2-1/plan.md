# Plan 2-1. 공통 컴포넌트 구현

## 목표

Phase 2 피처 구현에서 공통으로 쓰이는 기본 UI 컴포넌트를 구현한다.
실제 데이터 없이 목업 props로 동작하며, disign.md 기반 스타일을 적용한다.

---

## 구현할 컴포넌트

### 1. `Card` — `components/ui/Card.tsx`

카드 기반 레이아웃의 기본 컨테이너.

- 배경: `bg-surface` (`#141414`)
- 테두리: `border border-border` (`#232323`)
- border-radius: `rounded-lg`
- props: `children`, `className?`

---

### 2. `Button` — `components/ui/Button.tsx`

- variant: `primary` | `secondary`
  - `primary`: 배경 `bg-accent` (`#FF6A00`), 텍스트 흰색
  - `secondary`: 배경 `bg-surface`, 테두리 `border-border`, 텍스트 `text-text`
- props: `variant`, `children`, `onClick?`, `disabled?`, `className?`

---

### 3. `Badge` — `components/ui/Badge.tsx`

상승/하락 등락률 표시용 뱃지.

- variant: `up` | `down` | `neutral`
  - `up`: 텍스트 `text-up` (`#E63B2E`)
  - `down`: 텍스트 `text-down` (`#2F6BFF`)
  - `neutral`: 텍스트 `text-text-secondary`
- props: `variant`, `children`, `className?`

---

### 4. `StockTable` — `components/ui/StockTable.tsx`

종목 목록 테이블. 테마 목록 및 테마 상세에서 공통 사용.

컬럼: 종목명 | 가격 | 등락률 | 거래대금

- 고밀도, 가독성 중심
- 등락률은 Badge 컴포넌트 사용
- props: `stocks: StockRow[]`

```ts
type StockRow = {
  name: string
  price: number
  changeRate: number
  volume: number
}
```

---

## 파일 구조

```
/components
  /ui
    Card.tsx
    Button.tsx
    Badge.tsx
    StockTable.tsx
```

> `/components/ui`는 피처에 종속되지 않는 공용 UI 컴포넌트 폴더

---

## 완료 조건

- 4개 컴포넌트 구현 완료
- `npx tsc --noEmit` 타입 에러 없음
- `npm run build` 빌드 성공
- localhost:3000에서 컴포넌트 확인 (임시 페이지에 렌더링)
