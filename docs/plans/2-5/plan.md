# Plan 2-5. 종목 상세 피처

## 목표

목업 데이터 기반으로 종목 상세 페이지를 구현한다.
실제 API 없이 하드코딩된 목업 데이터로 UI를 완성한다.

---

## 라우트

`/stock/[ticker]` — 종목 상세

---

## 화면 구성

```
[헤더]
  RION  |  ThemeToggle

[페이지 본문] - 세로 스택

  삼성전자                    +2.45%   ← Title level 1 + Badge
  005930                               ← 티커 (text-text-secondary)

  ─────────────────────────────────

  시장 개요                            ← Title level 2
  ┌──────┬──────┬──────┬──────┬──────┬──────┐
  │ KOSPI│KOSDAQ│나스닥│S&P500│ 유가 │  금  │
  │2,543 │  733 │18,230│5,614 │ 82.3 │2,341 │
  │+0.8% │+1.2% │-0.3% │-0.1% │+0.5% │+0.2% │
  └──────┴──────┴──────┴──────┴──────┴──────┘

  ─────────────────────────────────

  수급 현황                            ← Title level 2
  기관    +234억
  외국인  -128억

  ─────────────────────────────────

  주요 시그널                          ← Title level 2
  [52주 신고가]  [이상 거래량]

  ─────────────────────────────────

  뉴스                                 ← Title level 2
  · 삼성전자, 2분기 HBM 출하량 역대 최대 전망   2026.04.07
  · 외국인 8거래일 연속 순매도 전환             2026.04.06
```

---

## 구현할 파일

### 1. `features/stock-detail/types.ts`

```ts
export type Signal = "52주 신고가" | "이상 거래량" | "52주 신저가";

export type MarketIndex = {
  name: string;
  value: number;
  changeRate: number;
};

export type Supply = {
  institution: number; // 기관 순매수 (억, 음수면 순매도)
  foreign: number; // 외국인 순매수 (억, 음수면 순매도)
};

export type StockDetail = {
  ticker: string;
  name: string;
  price: number;
  changeRate: number;
  signals: Signal[];
  supply: Supply;
  marketIndices: MarketIndex[];
  news: { title: string; date: string }[];
};
```

### 2. `features/stock-detail/mocks.ts`

목업 데이터. 종목 4~5개 (테마 상세에서 등장하는 종목 위주).

### 3. `features/stock-detail/components/StockDetailHeader.tsx`

- Title level 1: 종목명
- Badge: 등락률 (up/down/neutral)
- 티커 텍스트 (text-text-secondary)

### 4. `features/stock-detail/components/MarketOverview.tsx`

시장 지표 6개를 가로로 나열.

- KOSPI, KOSDAQ, 나스닥 선물, S&P500 선물, 유가(WTI), 금
- 각 항목: 지표명 / 값 / 등락률(Badge)

### 5. `features/stock-detail/components/SupplySection.tsx`

기관/외국인 순매수 현황.

- 양수면 `+N억` (text-up), 음수면 `-N억` (text-down)

### 6. `features/stock-detail/components/SignalSection.tsx`

주요 시그널을 Badge로 나열.

### 7. `features/stock-detail/components/NewsSection.tsx`

뉴스 목록. 2-4 NewsSection과 동일한 구조.

### 8. `app/stock/[ticker]/page.tsx`

- `params.ticker`로 mockStockDetails에서 종목 조회
- 없는 ticker면 notFound()
- 컴포넌트 세로 렌더

---

## 완료 조건

- `/stock/[ticker]` 접속 시 종목 상세 화면 표시
- 없는 ticker 접속 시 404
- `npx tsc --noEmit` 타입 에러 없음
- `npm run build` 빌드 성공
- localhost:3000 화면 확인
