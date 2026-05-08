import { NextResponse } from "next/server";
import { kiwoomFetch } from "@/server/kiwoom/kiwoomFetcher";
import { topProgramBuys } from "@/server/kiwoom/types";

export async function GET() {
  const kospiProgramBuys = await kiwoomFetch<topProgramBuys[]>(
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

  const kosdaqProgramBuys = await kiwoomFetch<topProgramBuys[]>(
    "/api/dostk/stkinfo",
    "ka90003",
    {
      trde_upper_tp: "2",
      amt_qty_tp: "2",
      crd_cnd: "0",
      mrkt_tp: "P00102",
      stex_tp: "3",
    },
  );

  return NextResponse.json({ kospiProgramBuys, kosdaqProgramBuys });
}
