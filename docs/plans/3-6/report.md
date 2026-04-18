# Plan 3-6 완료 보고서: 크롤링 결과 DB 저장 + 테스트 UI

## 무엇을 했나

크롤링한 뉴스를 DB에 저장하는 서버 쿼리 함수를 구현하고,
테스트 페이지에서 크롤링 결과를 화면에 표시하는 UI를 만들었다.

---

## 만든 파일

### `server/queries/news.ts`

크롤링 결과를 News 테이블에 저장하는 함수.

```ts
export async function saveNews(ticker: string, newsList: CrawledNews[]): Promise<number>
```

- `prisma.news.upsert` 사용 — url이 이미 있으면 skip, 없으면 insert
- `Promise.allSettled`로 각 기사를 병렬 저장
- 저장 성공 건수 반환

### `app/api/news/crawl/route.ts`

크롤링 + DB 저장을 처리하는 API Route.

```ts
// POST /api/news/crawl
// body: { ticker: string, query: string }
```

- `query`로 `crawlNaverNews` 호출
- `ticker`와 함께 `saveNews` 호출
- 크롤링된 기사 수와 결과 반환

**요청**
```json
{ "ticker": "005930", "query": "삼성전자" }
```

**응답**
```json
{ "crawled": 21, "saved": 18, "news": [...] }
```

`saved`가 `crawled`보다 적으면 중복 기사가 있었던 것.

### `app/test/news/page.tsx`

크롤링 결과를 확인하는 테스트 페이지 (`/test/news`).

- ticker + 검색어 입력 후 크롤링 버튼 클릭
- `/api/news/crawl` POST 호출
- 결과 뉴스 목록 표시 (제목, 언론사, 상대 시각)
- 로딩 상태 표시

---

## 주요 설계 결정

### ticker vs query 분리

News 테이블에는 `ticker`(종목코드)를 저장하고, 크롤링은 `query`(검색어)로 한다.
API 호출 시 둘 다 넘기는 방식으로 설계했다.

**이유:** 앱의 나머지 기능(테마 상세, 종목 상세)은 ticker 기준으로 동작한다.
뉴스도 ticker로 조회할 수 있어야 하므로 DB에는 ticker를 저장한다.
크롤링은 ticker 코드(`005930`)보다 회사명(`삼성전자`)으로 검색하는 게 더 풍부한 결과가 나온다.

### 중복 처리 — upsert

같은 기사가 여러 번 크롤링될 수 있다. url에 `@unique`가 걸려 있으므로
`upsert`를 써서 이미 있으면 아무것도 안 하고, 없으면 insert한다.

```ts
prisma.news.upsert({
  where: { url: item.url },
  update: {},
  create: { ticker, ...item },
})
```

### 상대 시각 표시 — formatRelativeTime

API에서 `publishedAt`은 ISO 날짜 문자열로 온다.
UI에서 현재 시각과 차이를 계산해 "5시간 전", "30분 전" 형식으로 표시한다.

```ts
if (diffMinutes < 1) return '방금 전'
if (diffMinutes < 60) return `${diffMinutes}분 전`
if (diffHours < 24) return `${diffHours}시간 전`
return `${diffDays}일 전`
```

---

## 오늘 세션에서 추가로 해결한 것

### User 마이그레이션 이슈

`model User` 추가 후 마이그레이션 시도 중 세 가지 문제가 겹쳐서 막혔음.

**문제 1 — `dotenv` 미설치**
Prisma 7부터 `.env`를 자동으로 읽지 않음. `prisma.config.ts`에서 `import "dotenv/config"`로 로드하는데, `dotenv` 패키지가 없었음.
→ `npm install --save-dev dotenv`로 해결.

**문제 2 — IP 밴**
연결 시도를 반복하면서 Supabase가 IP를 자동 차단함.
→ `npx supabase network-bans remove --db-unban-ip <IP> --project-ref <ID> --experimental`으로 해제.

**문제 3 — Direct Connection이 IPv6 전용**
Supabase 신규 프로젝트는 직접 연결(`db.xxx.supabase.co:5432`)이 IPv6만 지원함. 일반 가정 네트워크(IPv4)에서 접근 불가.
→ Supabase 대시보드에서 Connection Method를 **Session Pooler**로 전환해서 해결.
→ `.env`와 `.env.local` 모두 Session Pooler URL로 통일.

---

## 완료 검증

- `/test/news` 에서 크롤링 결과 화면 표시 확인
- 상대 시각 ("N시간 전", "N분 전") 정상 표시 확인
- DB 저장 확인 (Supabase 대시보드)
- 중복 저장 방지 확인
- `npx tsc --noEmit` 타입 에러 없음
- `npm run build` 빌드 성공
