import { NextResponse } from "next/server";
import { kiwoomFetch } from "@/server/kiwoom/kiwoomFetcher";
import { TopChangeRateStockResponse } from "@/server/kiwoom/types";

export async function GET() {
  const limitUpRes = await kiwoomFetch<TopChangeRateStockResponse>(
    "/api/dostk/stkinfo",
    "ka10017",
    {
      mrkt_tp: "000",
      updown_tp: "1",
      sort_tp: "3",
      stk_cnd: "1",
      trde_qty_tp: "000",
      crd_cnd: "0",
      trde_gold_tp: "0",
      stex_tp: "3",
    },
  );

  const topRateRes = await kiwoomFetch<TopChangeRateStockResponse>(
    "/api/dostk/stkinfo",
    "ka10017",
    {
      mrkt_tp: "000",
      updown_tp: "2",
      sort_tp: "3",
      stk_cnd: "1",
      trde_qty_tp: "000",
      crd_cnd: "0",
      trde_gold_tp: "0",
      stex_tp: "3",
    },
  );

  return NextResponse.json({
    limitUp: limitUpRes.updown_pric,
    topRate: topRateRes.updown_pric,
  });
}
