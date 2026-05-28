import { NextResponse } from "next/server";
import { kiwoomFetch } from "@/server/kiwoom/kiwoomFetcher";
import { KiwoomDailyTradeDetailResponse } from "@/server/kiwoom/types";

const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stockCode = searchParams.get("stockCode") ?? "";

  try {
    const data = await kiwoomFetch<KiwoomDailyTradeDetailResponse>(
      "/api/dostk/stkinfo",
      "ka10015",
      {
        stk_cd: stockCode,
        strt_dt: today,
      },
    );
    if (!data.daly_trde_dtl?.[0]) return NextResponse.json("실패");
    return NextResponse.json({
      stockCode,
      volume: data.daly_trde_dtl[0].trde_prica,
    });
  } catch {
    return NextResponse.json("실패");
  }
}
