# Plan 2-3. 오늘의 테마 목록 피처

## 목표

목업 데이터 기반으로 오늘의 테마 목록 페이지를 구현한다.
실제 API 없이 하드코딩된 목업 데이터로 UI를 완성한다.

---

## 라우트

`/` (홈) — 오늘의 테마 목록

---

## 화면 구성

```
[헤더]
  RION  |  ThemeToggle

[페이지 본문]
  오늘의 테마           ← Title level 1

  ┌──────────────────────────────────┐
  │ 반도체                    +2.4%  │  ← 섹터명 + 평균 등락률(Badge)
  │ AI 수혜 기대감에 반도체 강세...   │  ← 뉴스 요약 한 줄
  │ ─────────────────────────────── │
  │ 종목명    가격     등락률  거래대금│
  │ 삼성전자  73,400   +2.45%   43억 │
  │ SK하이닉스 189,500 -1.32%   21억 │
  └──────────────────────────────────┘
  (카드 반복)
```

---

## 구현할 파일

### 1. `features/themes/types.ts`

```ts
export type Theme = {
  id: string;
  name: string;
  summary: string;
  avgChangeRate: number;
  stocks: StockRow[];
};
```

### 2. `features/themes/mocks.ts`

목업 데이터. 테마 4개, 각 테마당 종목 3~4개.

### 3. `features/themes/components/ThemeCard.tsx`

테마 카드 컴포넌트.

- 카드 헤더: 섹터명(Title level 2) + 평균 등락률(Badge) — 좌우 배치
- 뉴스 요약 텍스트 (text-text-secondary)
- StockTable로 종목 목록
- 카드 전체 클릭 시 `/theme/[id]`로 이동 (종목 클릭은 `/stock/[ticker]`)

### 4. `components/layout/Header.tsx`

- 좌측: `RION` 텍스트 로고 (brand gold, font-bold)
- 우측: ThemeToggle
- 하단 border-b border-border

### 5. `app/layout.tsx`

Header 추가.

### 6. `app/design/page.tsx` (신규)

기존 `app/page.tsx`에 있던 컴포넌트 테스트 내용을 이 파일로 이동.
`/design` 경로에서 디자인 시스템 컴포넌트를 한눈에 확인할 수 있는 페이지.

### 7. `app/page.tsx`

기존 컴포넌트 테스트 내용을 지우고 실제 페이지로 교체.

- Title level 1: "오늘의 테마"
- mockThemes를 map으로 ThemeCard 렌더링

---

## 완료 조건

- 테마 목록 카드 형태로 표시
- 헤더 표시
- 카드 클릭 → `/theme/[id]` 이동 (404 정상)
- 종목 클릭 → `/stock/[ticker]` 이동 (404 정상)
- `npx tsc --noEmit` 타입 에러 없음
- `npm run build` 빌드 성공
- localhost:3000 화면 확인
