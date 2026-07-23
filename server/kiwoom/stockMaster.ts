import { kiwoomFetch } from "./kiwoomFetcher";
import { KiwoomStockListResponse } from "./types";
import { prisma } from "@/lib/prisma";

// 0: 코스피, 10: 코스닥
const MARKET_TYPES = ["0", "10"];

const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 2000;
// 두 마켓 요청 사이 텀. 키움 토큰 재발급 직후 연속 요청 시 인증 실패하는 문제의 방어책.
const MARKET_STAGGER_MS = 1000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchStockList(
  mrkt_tp: string,
): Promise<KiwoomStockListResponse> {
  let lastResult: KiwoomStockListResponse | undefined;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const result = await kiwoomFetch<KiwoomStockListResponse>(
      "/api/dostk/stkinfo",
      "ka10099",
      { mrkt_tp },
    );
    if (Array.isArray(result.list)) return result;

    lastResult = result;
    console.error(
      `[stockMaster] mrkt_tp=${mrkt_tp} 조회 실패 (시도 ${attempt}/${MAX_ATTEMPTS}):`,
      JSON.stringify(result),
    );
    if (attempt < MAX_ATTEMPTS) {
      await sleep(RETRY_DELAY_MS);
    }
  }

  throw new Error(
    `종목 마스터 조회 실패 (mrkt_tp=${mrkt_tp}, ${MAX_ATTEMPTS}회 시도): ${JSON.stringify(lastResult)}`,
  );
}

// 코스피/코스닥 전 종목 코드+이름을 받아와 StockMaster를 통째로 갱신한다.
// 상장/상장폐지가 반영된 최신 리스트로 매번 전체 교체하는 방식이라 개별 upsert 대신 delete+createMany를 쓴다.
export async function syncStockMaster() {
  // 키움 토큰은 요청마다 새로 발급되고 재발급 시 기존 토큰이 즉시 무효화되므로,
  // 두 마켓을 동시에 요청하면 토큰 레이스로 한쪽이 인증 실패할 수 있어 순차 요청 + 텀을 둔다.
  const results: KiwoomStockListResponse[] = [];
  for (const mrkt_tp of MARKET_TYPES) {
    if (results.length > 0) {
      await sleep(MARKET_STAGGER_MS);
    }
    results.push(await fetchStockList(mrkt_tp));
  }

  const stocks = results.flatMap((r) => r.list);

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
