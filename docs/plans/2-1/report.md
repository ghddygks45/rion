# Report 2-1. 공통 컴포넌트 구현

## 작업 결과
완료

---

## 만든 파일 목록

```
components/ui/
  Card.tsx
  Button.tsx
  Badge.tsx
  Title.tsx
  StockTable.tsx
```

---

## 각 파일 설명

### `Card.tsx`

카드 기반 레이아웃의 기본 컨테이너입니다.
`title` prop을 넘기면 상단에 헤더 영역이 생기고 컨텐츠 영역과 구분됩니다.
내부적으로 `Title` 컴포넌트(level 2)를 사용합니다.

---

### `Button.tsx`

- `primary`: 액센트 색상(`#FF6A00`) 배경, 주요 액션용
- `secondary`: 서피스 배경 + 테두리, 보조 액션용
- `disabled` 상태에서 투명도 낮아지고 `cursor-not-allowed` 적용

---

### `Badge.tsx`

등락률 등 짧은 상태 값 표시용 인라인 뱃지.

- `up`: 상승 (`#E63B2E`)
- `down`: 하락 (`#2F6BFF`)
- `neutral`: 보합 (보조 텍스트)

---

### `Title.tsx`

앱 전반에서 쓰이는 공통 타이틀 컴포넌트. `level` prop(1~3)으로 계층 조절.

- Level 1: 페이지 타이틀 (`text-xl font-bold`)
- Level 2: 섹션/카드 헤더 (`text-base font-semibold`)
- Level 3: 보조 라벨 (`text-sm font-medium text-text-secondary`)

---

### `StockTable.tsx`

종목 목록 테이블. 테마 목록, 테마 상세 등 여러 피처에서 공통 사용.

- `title` prop 있으면 카드 헤더 포함, 없으면 테이블만 렌더링
- 컬럼 너비 `table-fixed`로 고정 (종목명 40% / 가격 22% / 등락률 18% / 거래대금 20%)
- 등락률은 `Badge` 컴포넌트로 색상 처리
- `href` 있으면 행 클릭 시 해당 URL로 이동 (`<Link absolute inset-0` 방식)
- 양끝 셀 `pl-4` / `pr-4`로 내부 여백 처리 (tr에 padding 불가한 HTML 스펙 때문)

---

## 완료 확인

- `npx tsc --noEmit` 타입 에러 없음
- `npm run build` 빌드 성공
