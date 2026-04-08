# Plan 2-5 Report — 종목 상세 피처

## 구현 완료 일자
2026-04-08

---

## 개요

목업 데이터 기반으로 종목 상세 페이지(`/stock/[ticker]`)를 구현했다.
실제 API 없이 하드코딩된 목업 데이터로 UI를 완성했다.

---

## 구현한 파일

### `features/stock-detail/types.ts`
종목 상세 페이지에서 사용하는 타입 정의.
- `Signal` — 주요 시그널 유니온 타입 (`'52주 신고가' | '이상 거래량' | '52주 신저가'`)
- `MarketIndex` — 시장 지표 하나 (이름, 값, 등락률)
- `Supply` — 기관/외국인 순매수 금액 (억 단위, 음수면 순매도)
- `StockDetail` — 종목 상세 전체 데이터 구조

### `features/stock-detail/mocks.ts`
4개 종목의 목업 데이터 (삼성전자, SK하이닉스, LG에너지솔루션, LIG넥스원).
시장 지표 6개(`marketIndices`)는 모든 종목이 동일 데이터를 공유하도록 상수로 분리했다.

### `features/stock-detail/components/StockDetailHeader.tsx`
- 종목명 (Title level 1)
- 등락률 Badge (up/down/neutral)
- 티커 텍스트 (text-text-secondary)

### `features/stock-detail/components/MarketOverview.tsx`
KOSPI, KOSDAQ, 나스닥, S&P500, 유가(WTI), 금 — 시장 지표 6개를 가로로 나열.
각 항목: 지표명 / 값 / 등락률 Badge.

### `features/stock-detail/components/SupplySection.tsx`
기관/외국인 순매수 현황.
양수면 `+N억` (text-up 색상), 음수면 `-N억` (text-down 색상)으로 표시.

### `features/stock-detail/components/SignalSection.tsx`
주요 시그널을 Tag 컴포넌트로 나열.
시그널이 없으면 아무것도 렌더하지 않는다 (`signals.length === 0` → `return null`).

### `features/shared/components/NewsSection.tsx`
뉴스 목록 컴포넌트. **공통 컴포넌트로 분리**했다.

#### 분리한 이유
plan 원안에서는 `features/stock-detail/components/NewsSection.tsx`를 별도 생성하도록 했으나, 구현 과정에서 `features/theme-detail/components/NewsSection.tsx`와 UI/타입이 완전히 동일하다는 것을 확인했다. 피처 간 중복 코드를 만들기보다 `features/shared/`에 공통으로 두기로 결정했다.

서버 연결 시에는 각 피처(theme-detail, stock-detail)에서 각자 API를 호출해 데이터를 넘기면 되므로 공통 컴포넌트 분리가 문제 없다.

### `app/stock/[ticker]/page.tsx`
- `params.ticker`로 `mockStockDetails`에서 종목 조회
- 없는 ticker면 `notFound()` → 404 처리
- MarketOverview → StockDetailHeader → SupplySection → SignalSection → NewsSection 순으로 렌더

---

## 주요 결정 사항

### NewsSection 공통화
`features/shared/components/`라는 피처 간 공유 폴더를 도입했다.
- `components/ui/`는 도메인 무관한 순수 UI (Button, Badge 등)
- `features/shared/`는 도메인 컨텍스트가 있지만 여러 피처에서 공유되는 컴포넌트

뉴스 섹션은 "뉴스 목록을 보여준다"는 도메인 의미가 있으므로 `features/shared/`가 적합하다고 판단했다.

---

## 완료 조건 확인

- [x] `/stock/[ticker]` 접속 시 종목 상세 화면 표시
- [x] 없는 ticker 접속 시 404
- [x] `npx tsc --noEmit` 타입 에러 없음
- [x] `npm run build` 빌드 성공
- [x] localhost:3000 화면 확인
