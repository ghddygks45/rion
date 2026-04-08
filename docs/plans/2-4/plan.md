# Plan 2-4. 테마 상세 피처

## 목표

목업 데이터 기반으로 테마 상세 페이지를 구현한다.
실제 API 없이 하드코딩된 목업 데이터로 UI를 완성한다.

---

## 라우트

`/theme/[id]` — 테마 상세

---

## 화면 구성

```
[헤더]
  RION  |  ThemeToggle

[페이지 본문] - 세로 스택

  반도체                      +2.41%   ← Title level 1 + Badge
  AI 수혜 기대감에 메모리 반도체...     ← 요약 텍스트

  ─────────────────────────────────

  최근 뉴스                            ← Title level 2
  · 삼성전자, 2분기 HBM 출하량 역대 최대 전망   2026.04.07
  · SK하이닉스, 엔비디아향 HBM3E 공급 확대     2026.04.06
  · 한미반도체 "TC본더 수주 잔고 1조 돌파"     2026.04.05

  ─────────────────────────────────

  종목 목록                            ← Title level 2
  종목명      가격      등락률  거래대금  시그널
  삼성전자    73,400    +2.45%   43억   [52주 신고가]
  SK하이닉스  189,500   +3.12%   21억   [이상 거래량]
  한미반도체   94,200   +1.67%    9억
```

---

## 구현할 파일

### 1. `features/theme-detail/types.ts`

```ts
export type NewsItem = {
  title: string
  date: string
}

export type Signal = '52주 신고가' | '이상 거래량'

export type ThemeDetailStock = {
  name: string
  price: number
  changeRate: number
  volume: number
  href: string
  signals: Signal[]
}

export type ThemeDetail = {
  id: string
  name: string
  summary: string
  avgChangeRate: number
  news: NewsItem[]
  stocks: ThemeDetailStock[]
}
```

### 2. `features/theme-detail/mocks.ts`

목업 데이터. 2-3에서 만든 4개 테마(반도체, 2차전지, 방산, AI·데이터센터) 각각에 대한 상세 데이터.
각 테마당 뉴스 3개, 종목 3~4개 (signals 포함).

### 3. `features/theme-detail/components/ThemeDetailHeader.tsx`

- Title level 1: 테마명
- Badge: 평균 등락률 (up/down/neutral)
- 요약 텍스트 (text-text-secondary)

### 4. `features/theme-detail/components/NewsSection.tsx`

- Title level 2: "최근 뉴스"
- 뉴스 목록: 제목 + 날짜, 세로 나열

### 5. `features/theme-detail/components/StockSignalTable.tsx`

기존 StockTable과 별개로 시그널 컬럼이 추가된 테마 상세 전용 테이블.

- 컬럼: 종목명 / 가격 / 등락률 / 거래대금 / 시그널
- 시그널: Badge로 표시 (없으면 빈칸)
- 종목 클릭 → `/stock/[ticker]`로 이동

### 6. `app/theme/[id]/page.tsx`

- `params.id`로 mockThemeDetails에서 해당 테마 조회
- 없는 id면 notFound() 호출
- ThemeDetailHeader → NewsSection → StockSignalTable 순으로 렌더

---

## 완료 조건

- `/theme/[id]` 접속 시 테마 상세 화면 표시
- 없는 id 접속 시 404
- 종목 클릭 → `/stock/[ticker]` 이동 (404 정상)
- `npx tsc --noEmit` 타입 에러 없음
- `npm run build` 빌드 성공
- localhost:3000 화면 확인
