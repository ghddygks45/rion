import { NextResponse } from "next/server";
import { kiwoomFetch } from "@/server/kiwoom/kiwoomFetcher";
import { topProgramBuysResponse } from "@/server/kiwoom/types";

export async function GET() {
  const kospiProgramBuysRes = await kiwoomFetch<topProgramBuysResponse>(
    "/api/dostk/stkinfo",
    "ka90003",
    {
      trde_upper_tp: "2",
      amt_qty_tp: "2",
      crd_cnd: "0",
      mrkt_tp: "P00101",
      stex_tp: "3",
    },
  );

  const kosdaqProgramBuysRes = await kiwoomFetch<topProgramBuysResponse>(
    "/api/dostk/stkinfo",
    "ka90003",
    {
      trde_upper_tp: "2",
      amt_qty_tp: "2",
      crd_cnd: "0",
      mrkt_tp: "P10102",
      stex_tp: "3",
    },
  );

  return NextResponse.json({
    kospiProgramBuys: kospiProgramBuysRes.prm_netprps_upper_50,
    kosdaqProgramBuys: kosdaqProgramBuysRes.prm_netprps_upper_50,
  });
}
