# Plan 3-5 완료 보고서: 네이버 뉴스 크롤링 로직 구현

## 무엇을 했나

네이버 뉴스 검색 페이지에서 기사 목록을 가져오는 크롤링 함수를 구현했다.
이번 plan에서는 크롤링만 한다. DB 저장은 plan 3-6에서 한다.

---

## 설치한 패키지

| 패키지 | 역할 |
|---|---|
| `cheerio` | 서버에서 HTML을 파싱해 원하는 요소를 추출하는 라이브러리 |

---

## 만든 파일

### `server/crawlers/naverNewsCrawler.ts`

```ts
import * as cheerio from 'cheerio'

export type CrawledNews = {
  title: string
  url: string
  press: string
  publishedAt: Date
}

export async function crawlNaverNews(query: string): Promise<CrawledNews[]> {
  const res = await fetch(
    `https://search.naver.com/search.naver?ssc=tab.news.all&where=news&sm=tab_jum&query=${encodeURIComponent(query)}`,
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    }
  )

  const html = await res.text()
  const $ = cheerio.load(html)
  const results: CrawledNews[] = []

  $("a[data-heatmap-target='.tit']").each((_, el) => {
    const $el = $(el)
    const title = $el.text().trim()
    const url = $el.attr('href')

    if (!title || !url) return
    if (!url.startsWith('http')) return

    const isMainArticle = $el.find('.sds-comps-text-type-headline1').length > 0

    const $profile = isMainArticle
      ? $el.parent().parent().parent().find("[data-sds-comp='Profile']").first()
      : $el.parent().find("[data-sds-comp='Profile']").first()

    const press = $profile.find('.sds-comps-profile-info-title-text').first().text().trim()
    const dateStr = $profile.find('.sds-comps-profile-info-subtext').first().text().trim()

    if (!press || !dateStr) return

    const publishedAt = parseNaverDate(dateStr)
    if (!publishedAt) return

    results.push({ title, url, press, publishedAt })
  })

  return results
}

function parseNaverDate(dateStr: string): Date | null {
  const absolute = dateStr.match(/(\d{4})\.(\d{2})\.(\d{2})/)
  if (absolute) {
    const [, year, month, day] = absolute
    return new Date(`${year}-${month}-${day}T00:00:00+09:00`)
  }

  const minutesAgo = dateStr.match(/(\d+)분 전/)
  if (minutesAgo) {
    const date = new Date()
    date.setMinutes(date.getMinutes() - parseInt(minutesAgo[1]))
    return date
  }

  const hoursAgo = dateStr.match(/(\d+)시간 전/)
  if (hoursAgo) {
    const date = new Date()
    date.setHours(date.getHours() - parseInt(hoursAgo[1]))
    return date
  }

  return null
}
```

#### 코드 설명

**크롤링 대상 변경**

처음에는 네이버 금융 종목 뉴스 페이지(`finance.naver.com`)를 대상으로 계획했다. 그런데 실제로 해보니 ticker(종목코드)보다 검색어(query)로 뉴스를 가져오는 게 더 자연스러웠다. 예를 들어 "삼성전자", "반도체" 같은 키워드로 검색하면 더 넓은 범위의 기사를 가져올 수 있다. 그래서 네이버 뉴스 검색 페이지(`search.naver.com`)로 변경했다.

**`fetch` + `User-Agent` 헤더**

네이버는 브라우저가 아닌 요청을 차단하는 경우가 있다. `User-Agent` 헤더를 실제 Chrome 브라우저처럼 설정해서 차단을 우회한다.

**`cheerio.load(html)`**

HTML 문자열을 받아서 jQuery처럼 CSS 선택자로 요소를 선택할 수 있게 해준다. `$`라는 변수명을 쓰는 것도 jQuery 문법과 동일하다.

**`a[data-heatmap-target='.tit']` 선택자**

네이버 뉴스 검색 결과에서 기사 제목 링크를 감싸는 `<a>` 태그가 `data-heatmap-target=".tit"` 속성을 가지고 있다. 이 속성으로 기사 링크만 골라낸다.

**메인 기사 vs 일반 기사 구분**

네이버 검색 결과에는 크게 표시되는 메인 기사와 작게 표시되는 일반 기사가 섞여 있다. HTML 구조가 달라서 언론사/날짜 정보를 찾는 경로가 다르다. `isMainArticle` 변수로 구분해서 각각 다른 경로로 `Profile` 컴포넌트를 찾는다.

**`parseNaverDate()`**

네이버 검색 결과는 날짜를 세 가지 형식으로 보여준다:

| 형식 | 예시 | 처리 방법 |
|---|---|---|
| 절대 날짜 | `"2026.04.10."` | 해당 날짜 자정(00:00)으로 변환 |
| N분 전 | `"30분 전"` | 크롤링 시점에서 30분 차감 |
| N시간 전 | `"5시간 전"` | 크롤링 시점에서 5시간 차감 |

"N시간 전"은 정확한 발행 시각을 알 수 없어서 크롤링 시점 기준으로 역산한 근사값이다. DB에 저장하는 목적(최신순 정렬)으로는 충분하다.

---

### `app/api/test/crawl/route.ts`

크롤러 동작을 확인하기 위한 테스트용 API Route다.

```ts
export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('query')
  const newsList = await crawlNaverNews(query)
  return NextResponse.json({ query, crawled: newsList.length, news: newsList })
}
```

`GET /api/test/crawl?query=삼성전자` 로 호출하면 크롤링 결과를 JSON으로 반환한다.

---

## 완료 검증

- `crawlNaverNews("삼성전자")` 호출 → 21건 뉴스 반환 확인
- `npx tsc --noEmit` 타입 에러 없음
- `npm run build` 빌드 성공
