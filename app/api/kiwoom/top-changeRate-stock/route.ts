import { NextResponse } from "next/server";
import { kiwoomFetch } from "@/server/kiwoom/kiwoomFetcher";
import { topChangeRateStock } from "@/server/kiwoom/types";

export async function GET() {
  const limitUp = await kiwoomFetch<topChangeRateStock[]>(
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

  const topRate = await kiwoomFetch<topChangeRateStock[]>(
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

  return NextResponse.json({ limitUp, topRate });
}
