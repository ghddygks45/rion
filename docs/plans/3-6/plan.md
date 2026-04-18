# Plan 3-6. 크롤링 결과 DB 저장 + 테스트 UI

## 목표

크롤링한 뉴스를 DB에 저장하고, 테스트 페이지에서 결과를 확인한다.

---

## 현재 상태

- News 테이블 생성 완료 (plan 3-4)
- 크롤링 함수 `crawlNaverNews(query)` 구현 완료 (plan 3-5)
- DB 저장 로직 없음
- UI 없음

---

## 구현할 파일

### 1. `server/queries/news.ts`

크롤링 결과를 DB에 저장하는 서버 쿼리 함수.

```ts
export async function saveNews(ticker: string, newsList: CrawledNews[]): Promise<number>
```

- `prisma.news.upsert` 사용 — url이 이미 있으면 skip, 없으면 insert
- 저장된 건수 반환

### 2. `app/api/news/crawl/route.ts`

크롤링 + 백그라운드 DB 저장을 처리하는 API Route.

```ts
// POST /api/news/crawl
// body: { ticker: string, query: string }
```

- `query`로 `crawlNaverNews` 호출 후 결과 즉시 반환
- `saveNews`는 await 없이 백그라운드 실행 (응답 안 기다림)

**요청**
```json
{ "ticker": "005930", "query": "삼성전자" }
```

**응답**
```json
{ "crawled": 21, "news": [...] }
```

### 3. `app/test/news/page.tsx`

크롤링 결과를 확인하는 테스트 페이지 (`/test/news`).

- 검색어 입력 + 크롤링 버튼
- 버튼 클릭 시 `/api/news/crawl` 호출
- 결과 뉴스 목록 표시 (제목, 언론사, 날짜)
- 로딩 상태 표시

---

## 중복 처리 전략

News 테이블의 `url` 필드에 `@unique`가 걸려 있다.
같은 URL의 기사가 이미 있으면 저장하지 않는다.

```ts
prisma.news.upsert({
  where: { url: item.url },
  update: {},   // 이미 있으면 아무것도 안 함
  create: { ticker, ...item },
})
```

---

## 완료 조건

- `/test/news` 에서 검색어 입력 후 크롤링 결과 화면에 표시
- 백그라운드로 DB 저장 확인 (Supabase 대시보드에서 직접 확인)
- 같은 요청 두 번 보내도 중복 저장 안 됨 확인
- `npx tsc --noEmit` 타입 에러 없음
- `npm run build` 빌드 성공
