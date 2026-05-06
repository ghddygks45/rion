import { NextResponse } from "next/server";
import { kiwoomFetch } from "@/server/kiwoom/kiwoomFetcher";
import { Ka10015Response } from "@/server/kiwoom/types";

const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");

export async function GET() {
  const detail = await kiwoomFetch<Ka10015Response>(
    "/api/dostk/stkinfo",
    "ka10015",
    {
      stk_cd: "011930_AL",
      strt_dt: today,
    },
  );
  console.log("============" + detail.daly_trde_dtl[0] + "============");
  console.log(JSON.stringify(detail.daly_trde_dtl[0]));

  return NextResponse.json(detail.daly_trde_dtl[0].trde_prica);
}
