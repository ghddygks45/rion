import { prisma } from "@/lib/prisma";
import { CrawledNews } from "@/server/crawlers/naverNewsCrawler";

export async function saveNews(
  ticker: string,
  newsList: CrawledNews[],
): Promise<number> {
  const results = await Promise.allSettled(
    newsList.map((item) =>
      prisma.news.upsert({
        where: { url: item.url },
        update: {},
        create: {
          ticker,
          title: item.title,
          url: item.url,
          press: item.press,
          publishedAt: item.publishedAt,
        },
      }),
    ),
  );

  results.forEach((r, i) => {
    if (r.status === "rejected")
      console.error(`[saveNews] ${i}번 실패:`, r.reason);
  });

  return results.filter((r) => r.status === "fulfilled").length;
}
