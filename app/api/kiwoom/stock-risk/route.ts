import { NextResponse } from "next/server";
import { kiwoomFetch } from "@/server/kiwoom/kiwoomFetcher";
import { hankukFetch } from "@/server/hankuk/hankukFetcher";
import {
  KiwoomDailyTradeDetailResponse,
  KiwoomStockBasicInfoResponse,
  KiwoomDailyPriceResponse,
} from "@/server/kiwoom/types";
import { IndustryDailyIndexResponse } from "@/server/hankuk/types";
import { evaluateShortTermOverheating } from "@/server/kiwoom/risk/shortTermOverheating";
import { evaluateInvestmentWarning } from "@/server/kiwoom/risk/investmentWarning";
import { getBusinessDaysAgo, formatYYYYMMDD } from "@/server/utils/date";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stockCode = searchParams.get("stockCode");

  if (!stockCode) {
    return NextResponse.json(
      { error: "stockCode is required" },
      { status: 400 },
    );
  }

  const today = new Date();
  // 지정 스캔(최대 10거래일 전)마다 각자 T-5가 또 필요해서 15거래일 + 공휴일 여유분까지 확보
  const indexLookbackStart = getBusinessDaysAgo(today, 20);

  const [data, stockInfo, dailyPrice, industryIndex] = await Promise.all([
    // 단기과열 평가용
    kiwoomFetch<KiwoomDailyTradeDetailResponse>(
      "/api/dostk/stkinfo",
      "ka10015",
      {
        stk_cd: `${stockCode}_AL`,
        strt_dt: formatYYYYMMDD(today),
      },
    ),
    kiwoomFetch<KiwoomStockBasicInfoResponse>("/api/dostk/stkinfo", "ka10100", {
      stk_cd: stockCode,
    }),
    // 투자경고종목 평가용
    kiwoomFetch<KiwoomDailyPriceResponse>("/api/dostk/mrkcond", "ka10086", {
      stk_cd: `${stockCode}_AL`,
      qry_dt: formatYYYYMMDD(today),
      indc_tp: "1",
    }),
    hankukFetch<IndustryDailyIndexResponse>(
      "GET",
      "/uapi/domestic-stock/v1/quotations/inquire-daily-indexchartprice",
      "FHKUP03500100",
      {
        FID_COND_MRKT_DIV_CODE: "U",
        FID_INPUT_ISCD: "0001",
        FID_INPUT_DATE_1: formatYYYYMMDD(indexLookbackStart),
        FID_INPUT_DATE_2: formatYYYYMMDD(today),
        FID_PERIOD_DIV_CODE: "D",
      },
    ),
  ]);

  const listedShares = Number(stockInfo.listCount);

  console.log("ka10086 raw:", JSON.stringify(dailyPrice));
  // console.log(JSON.stringify(industryIndex.output2, null, 2));

  const categories = [
    evaluateShortTermOverheating(data.daly_trde_dtl, listedShares),
    evaluateInvestmentWarning(dailyPrice.daly_stkpc, industryIndex.output2),
  ];

  return NextResponse.json({ stockCode, categories, industryIndex });
}
