// Next.js Route Handler: "/api/news/crawl" 주소로 오는 HTTP 요청을 처리하는 파일
// NextRequest: 클라이언트가 보낸 요청 객체 (body, headers 등을 읽을 수 있다)
// NextResponse: 클라이언트에게 보낼 응답 객체 (JSON, 상태코드 등을 담는다)
import { NextRequest, NextResponse } from 'next/server'
import { crawlNaverNews } from '@/server/crawlers/naverNewsCrawler'
import { saveNews } from '@/server/queries/news'

// POST 요청을 처리하는 함수
// 클라이언트가 POST /api/news/crawl 로 요청을 보내면 이 함수가 실행된다
export async function POST(req: NextRequest) {
  // 요청 body에서 ticker(종목코드)와 query(검색어)를 꺼낸다
  // 예: { "ticker": "삼성전자", "query": "삼성전자 주가" }
  const { ticker, query } = await req.json()

  // ticker나 query가 없으면 잘못된 요청이므로 400 에러를 반환한다
  // 400: Bad Request (클라이언트가 잘못 보낸 요청)
  if (!ticker || !query) {
    return NextResponse.json({ error: 'ticker와 query가 필요합니다' }, { status: 400 })
  }

  // 1단계: 네이버에서 뉴스를 긁어온다
  const newsList = await crawlNaverNews(query)

  // 2단계: 긁어온 뉴스를 DB에 저장한다 (중복은 자동으로 걸러진다)
  const saved = await saveNews(ticker, newsList)

  // 3단계: 결과를 JSON으로 응답한다
  // crawled: 네이버에서 찾은 뉴스 수
  // saved: 실제로 DB에 새로 저장된 뉴스 수 (이미 있던 건 제외)
  // news: 크롤링한 뉴스 목록 전체
  return NextResponse.json({ crawled: newsList.length, saved, news: newsList })
}
