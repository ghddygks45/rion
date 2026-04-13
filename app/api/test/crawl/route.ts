import { NextRequest, NextResponse } from 'next/server'
import { crawlNaverNews } from '@/server/crawlers/naverNewsCrawler'

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('query')

  if (!query) {
    return NextResponse.json({ error: 'query 파라미터가 필요합니다' }, { status: 400 })
  }

  const newsList = await crawlNaverNews(query)

  return NextResponse.json({
    query,
    crawled: newsList.length,
    news: newsList,
  })
}
