import { kiwoomFetch } from "./kiwoomFetcher";
import { KiwoomStockListResponse } from "./types";
import { prisma } from "@/lib/prisma";

// 0: 코스피, 10: 코스닥
const MARKET_TYPES = ["0", "10"];

// 코스피/코스닥 전 종목 코드+이름을 받아와 StockMaster를 통째로 갱신한다.
// 상장/상장폐지가 반영된 최신 리스트로 매번 전체 교체하는 방식이라 개별 upsert 대신 delete+createMany를 쓴다.
export async function syncStockMaster() {
  const results = await Promise.all(
    MARKET_TYPES.map((mrkt_tp) =>
      kiwoomFetch<KiwoomStockListResponse>("/api/dostk/stkinfo", "ka10099", {
        mrkt_tp,
      }),
    ),
  );

  const stocks = results.flatMap((r) => r.list ?? []);

  await prisma.$transaction([
    prisma.stockMaster.deleteMany({}),
    prisma.stockMaster.createMany({
      data: stocks.map((s) => ({
        code: s.code,
        name: s.name,
        marketCode: s.marketCode,
        marketName: s.marketName,
      })),
      skipDuplicates: true,
    }),
  ]);

  return { total: stocks.length };
}
