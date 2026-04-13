import * as cheerio from "cheerio";

export type CrawledNews = {
  title: string;
  url: string;
  press: string;
  publishedAt: Date;
};

export async function crawlNaverNews(query: string): Promise<CrawledNews[]> {
  const res = await fetch(
    `https://search.naver.com/search.naver?ssc=tab.news.all&where=news&sm=tab_jum&query=${encodeURIComponent(query)}`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    },
  );

  const html = await res.text();
  const $ = cheerio.load(html);
  const results: CrawledNews[] = [];

  $("a[data-heatmap-target='.tit']").each((_, el) => {
    const $el = $(el);
    const title = $el.text().trim();
    const url = $el.attr("href");

    if (!title || !url) return;
    if (!url.startsWith("http")) return;

    const isMainArticle = $el.find(".sds-comps-text-type-headline1").length > 0;

    const $profile = isMainArticle
      ? $el.parent().parent().parent().find("[data-sds-comp='Profile']").first()
      : $el.parent().find("[data-sds-comp='Profile']").first();

    const press = $profile
      .find(".sds-comps-profile-info-title-text")
      .first()
      .text()
      .trim();
    const dateStr = $profile
      .find(".sds-comps-profile-info-subtext")
      .first()
      .text()
      .trim();

    if (!press || !dateStr) return;

    const publishedAt = parseNaverDate(dateStr);
    if (!publishedAt) return;

    results.push({ title, url, press, publishedAt });
  });

  return results;
}

function parseNaverDate(dateStr: string): Date | null {
  // 형식: "2026.04.10." 또는 "1시간 전" 등
  const absolute = dateStr.match(/(\d{4})\.(\d{2})\.(\d{2})/);
  if (absolute) {
    const [, year, month, day] = absolute;
    return new Date(`${year}-${month}-${day}T00:00:00+09:00`);
  }

  // "N분 전", "N시간 전" 처리
  const minutesAgo = dateStr.match(/(\d+)분 전/);
  if (minutesAgo) {
    const date = new Date();
    date.setMinutes(date.getMinutes() - parseInt(minutesAgo[1]));
    return date;
  }

  const hoursAgo = dateStr.match(/(\d+)시간 전/);
  if (hoursAgo) {
    const date = new Date();
    date.setHours(date.getHours() - parseInt(hoursAgo[1]));
    return date;
  }

  return null;
}
