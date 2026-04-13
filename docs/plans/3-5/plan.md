# Plan 3-5. 네이버 뉴스 크롤링 로직 구현

## 목표

검색어(query)를 입력받아 네이버 뉴스 검색 결과를 크롤링하는 서버 함수를 구현한다.
크롤링 결과를 DB에 저장하지는 않는다 — 저장은 plan 3-6에서 한다.
이번 plan은 "크롤링이 잘 되는지" 확인하는 단계다.

---

## 현재 상태

- Supabase News 테이블 생성 완료 (plan 3-4)
- `server/kiwoom/` 폴더에 키움 API 관련 서버 로직 존재
- 크롤링 로직 없음

---

## 크롤링 대상

**네이버 뉴스 검색 페이지**

```
https://search.naver.com/search.naver?ssc=tab.news.all&where=news&sm=tab_jum&query={query}
```

예: 삼성전자 → `https://search.naver.com/search.naver?...&query=삼성전자`

각 뉴스 항목에서 추출할 정보:
- 기사 제목
- 기사 URL
- 언론사
- 발행 일시

---

## 사용할 라이브러리

| 라이브러리 | 역할 |
|---|---|
| `node-fetch` | 서버에서 HTML 페이지 요청 (Next.js App Router는 기본 fetch 사용 가능) |
| `cheerio` | HTML을 파싱해서 원하는 요소를 jQuery처럼 선택 |

cheerio 설치:
```bash
npm install cheerio
```

Next.js 서버 환경에서는 `fetch`가 기본 내장이라 별도 설치 불필요.

---

## 구현할 파일

### `server/crawlers/naverNewsCrawler.ts`

```ts
export type CrawledNews = {
  title: string
  url: string
  press: string
  publishedAt: Date
}

export async function crawlNaverNews(query: string): Promise<CrawledNews[]>
```

- 네이버 뉴스 검색 페이지 HTML fetch
- cheerio로 뉴스 목록 파싱
- `CrawledNews[]` 반환

---

## HTML 구조 분석

네이버 뉴스 검색 결과 페이지의 뉴스 구조:

```html
<!-- 기사 링크 -->
<a data-heatmap-target=".tit" href="https://...">
  기사 제목
</a>

<!-- 언론사 + 날짜 -->
<div data-sds-comp="Profile">
  <span class="sds-comps-profile-info-title-text">언론사명</span>
  <span class="sds-comps-profile-info-subtext">2시간 전</span>
</div>
```

날짜 형식 세 가지:
- `"N분 전"` — 크롤링 시점 기준 역산
- `"N시간 전"` — 크롤링 시점 기준 역산
- `"2026.04.10."` — 절대 날짜 (자정으로 저장)

---

## 완료 조건

- `crawlNaverNews("삼성전자")` 호출 시 뉴스 배열 반환 확인
- `npx tsc --noEmit` 타입 에러 없음
- `npm run build` 빌드 성공
