# Report 2-4. 테마 상세 피처

## 작업 결과

완료

---

## 만든/수정한 파일 목록

```
features/theme-detail/types.ts                    - 타입 정의
features/theme-detail/mocks.ts                    - 목업 데이터
features/theme-detail/components/ThemeDetailHeader.tsx - 테마 상세 헤더
features/theme-detail/components/NewsSection.tsx  - 뉴스 섹션
features/theme-detail/components/StockDetailTable.tsx  - 종목 테이블
app/theme/[id]/page.tsx                           - 테마 상세 페이지
app/globals.css                                   - Tailwind 다크모드 variant 수정
```

---

## 각 파일 상세 설명

### `features/theme-detail/types.ts`

테마 상세 페이지에서 사용하는 타입들입니다.

```ts
type NewsItem = {
  title: string
  date: string
}

type Signal = '52주 신고가' | '이상 거래량'

type ThemeDetailStock = {
  name: string
  price: number
  changeRate: number
  volume: number
  href: string
  signal?: Signal   // 옵셔널 — 없는 종목도 있음
}

type ThemeDetail = {
  id: string
  name: string
  summary: string
  avgChangeRate: number
  news: NewsItem[]
  stocks: ThemeDetailStock[]
}
```

초기에는 `signals: Signal[]` (배열)로 설계했으나, 종목당 시그널이 최대 1개인 점을 고려해 `signal?: Signal` (단일 옵셔널)로 단순화했다. 불필요한 중첩을 줄이기 위한 결정이다.

---

### `features/theme-detail/mocks.ts`

4개 테마(반도체, 2차전지, 방산, AI·데이터센터)의 상세 목업 데이터. 각 테마당 뉴스 3개, 종목 3~4개.

---

### `features/theme-detail/components/ThemeDetailHeader.tsx`

테마명, 평균 등락률, 요약 텍스트를 보여주는 헤더 컴포넌트.

Props는 서버 타입(`ThemeDetail`) 전체를 받지 않고 실제로 쓰는 필드만 직접 정의했다.

```ts
type Props = {
  name: string
  avgChangeRate: number
  summary: string
}
```

---

### `features/theme-detail/components/NewsSection.tsx`

최근 뉴스 목록을 보여주는 컴포넌트. 제목과 날짜를 좌우로 배치.

Props 타입도 import 없이 인라인으로 정의했다.

```ts
type Props = {
  news: { title: string; date: string }[]
}
```

---

### `features/theme-detail/components/StockDetailTable.tsx`

종목 목록에 시그널 컬럼이 추가된 테마 상세 전용 테이블. 기존 `StockTable`과 별개로 만든 도메인 특화 컴포넌트다.

- 컬럼: 종목명 / 가격 / 등락률 / 거래대금 / 시그널
- 시그널 있는 종목은 Badge로 표시, 없으면 빈칸

---

### `app/theme/[id]/page.tsx`

Next.js 15+에서 `params`가 Promise로 바뀌어 `async/await`으로 처리했다.

```ts
export default async function ThemeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const theme = mockThemeDetails.find((t) => t.id === id);
  if (!theme) notFound();
  ...
}
```

---

### `app/globals.css` — Tailwind 다크모드 variant 수정

**문제:** `dark:hover:` 유틸리티가 다크모드에서 적용되지 않았다.

**원인:** Tailwind v4에서 `dark:` variant는 기본적으로 `prefers-color-scheme` 미디어 쿼리로 동작한다. 우리는 `.dark` 클래스 방식을 사용하므로 별도 설정이 필요했다.

또한 초기에 `:where()`로 설정했는데, `:where()`는 CSS 특이성(specificity)이 0이라 `hover:bg-black/5`에 덮어쓰여 `dark:hover:`가 적용되지 않는 문제가 있었다.

```css
/* 최종 설정 */
@variant dark (&:is(.dark, .dark *));
```

`:is()`는 안의 선택자 특이성을 유지해 `dark:hover:`가 일반 `hover:`보다 높은 우선순위를 갖는다.

---

## 트러블슈팅

### dark:hover: 미적용 문제

1차: `@variant dark (&:where(.dark, .dark *))` 추가 → `dark:` 자체는 동작하나 `hover:`와 충돌
2차: `:where()` → `:is()`로 변경 → 특이성 확보로 해결

---

## 완료 확인

- `npx tsc --noEmit` 타입 에러 없음
- `npm run build` 빌드 성공
- `/theme/[id]` 접속 시 테마 상세 화면 표시
- 없는 id 접속 시 404
- 종목 클릭 → `/stock/[ticker]` 이동 (404 정상)
- localhost:3000 화면 확인
