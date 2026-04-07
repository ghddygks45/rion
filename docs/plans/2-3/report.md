# Report 2-3. 오늘의 테마 목록 피처

## 작업 결과

완료

---

## 만든/수정한 파일 목록

```
features/themes/types.ts                  - 테마 타입 정의
features/themes/mocks.ts                  - 목업 데이터
features/themes/components/ThemeCard.tsx  - 테마 카드 컴포넌트
components/layout/Header.tsx              - 헤더 컴포넌트
components/ui/StockTable.tsx              - hover 색상 수정
app/layout.tsx                            - Header 추가
app/design/page.tsx                       - 디자인 시스템 확인 페이지 (신규)
app/page.tsx                              - 실제 테마 목록 페이지로 교체
```

---

## 각 파일 상세 설명

### `features/themes/types.ts`

테마 데이터의 타입을 정의하는 파일입니다.

```ts
export type Theme = {
  id: string          // 테마 고유 식별자 (예: 'semiconductor')
  name: string        // 테마 이름 (예: '반도체')
  summary: string     // 뉴스 요약 한 줄
  avgChangeRate: number // 테마 평균 등락률
  stocks: StockRow[]  // 테마에 속한 종목 목록
}
```

`StockRow`는 기존에 만들어둔 `components/ui/StockTable`에서 가져옵니다. 타입을 한 곳에서 관리해 중복 정의를 막습니다.

---

### `features/themes/mocks.ts`

실제 API 없이 UI를 개발하기 위한 하드코딩 목업 데이터입니다. 테마 4개(반도체, 2차전지, 방산, AI·데이터센터), 각 테마당 종목 3~4개로 구성했습니다.

실제 API가 생기면 이 파일을 API 호출로 교체하면 됩니다.

---

### `features/themes/components/ThemeCard.tsx`

테마 하나를 카드 형태로 보여주는 컴포넌트입니다.

**구성:**
- 카드 상단: 테마 이름(Title level 2) + 평균 등락률(Badge) 좌우 배치
- 카드 중단: 뉴스 요약 텍스트 (text-text-secondary)
- 카드 하단: StockTable로 종목 목록

**클릭 동작:**
- 카드 상단(헤더+요약) 클릭 → `/theme/[id]`로 이동
- 종목 행 클릭 → `/stock/[ticker]`로 이동 (StockTable 내부에서 처리)

**등락률 표시:**
```ts
const variant = avgChangeRate > 0 ? 'up' : avgChangeRate < 0 ? 'down' : 'neutral'
const sign = avgChangeRate > 0 ? '+' : ''
```
양수면 `+` 부호를 붙이고 Badge를 빨간색(up)으로, 음수면 파란색(down)으로 표시합니다.

---

### `components/layout/Header.tsx`

모든 페이지 상단에 고정되는 헤더입니다.

- 좌측: `RION` 텍스트 로고 — 브랜드 골드색(`text-primary`), 클릭 시 홈(`/`)으로 이동
- 우측: ThemeToggle 버튼
- 하단 border로 본문과 구분

---

### `components/ui/StockTable.tsx`

hover 색상을 다크/라이트 모드 모두 자연스럽게 보이도록 수정했습니다.

```ts
// 변경 전
"hover:bg-white/3"

// 변경 후
"hover:bg-black/5 dark:hover:bg-white/20"
```

---

### `app/layout.tsx`

기존 `ThemeProvider` 안에 `Header`를 추가했습니다. layout에 넣으면 모든 페이지에 자동으로 헤더가 붙습니다.

```tsx
<ThemeProvider>
  <Header />
  {children}
</ThemeProvider>
```

---

### `app/design/page.tsx`

기존 `app/page.tsx`에 있던 컴포넌트 테스트 코드를 이 파일로 이동했습니다. `/design` 경로에서 Card, Button, Badge, Title, StockTable 등 디자인 시스템 컴포넌트를 한눈에 확인할 수 있습니다.

---

### `app/page.tsx`

기존 컴포넌트 테스트 내용을 지우고 실제 홈 페이지로 교체했습니다.

- `mockThemes`를 map으로 순회해 `ThemeCard`를 렌더링
- 반응형 그리드 레이아웃: 1열(모바일) → 2열(태블릿) → 3열(데스크탑)

---

## 완료 확인

- `npx tsc --noEmit` 타입 에러 없음
- `npm run build` 빌드 성공
- 테마 목록 카드 형태로 표시
- 헤더 표시
- 카드 클릭 → `/theme/[id]` 이동 (404 정상)
- 종목 클릭 → `/stock/[ticker]` 이동 (404 정상)
- localhost:3000 화면 확인
