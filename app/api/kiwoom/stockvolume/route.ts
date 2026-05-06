import { NextResponse } from "next/server";
import { kiwoomFetch } from "@/server/kiwoom/kiwoomFetcher";
import { Ka10015Response } from "@/server/kiwoom/types";

const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stockCodesParam = searchParams.get("stockCodes") ?? "";
  const stockCodes = stockCodesParam.split(",").filter(Boolean);

  const results = [];
  for (const stk_cd of stockCodes) {
    const detail = await kiwoomFetch<Ka10015Response>(
      "/api/dostk/stkinfo",
      "ka10015",
      {
        stk_cd: stk_cd,
        strt_dt: today,
      },
    );
    results.push({
      stk_cd,
      trde_prica: detail.daly_trde_dtl?.[0]?.trde_prica ?? "0",
    });
    console.log(results);
    // console.log("============" + detail.daly_trde_dtl[0] + "============");
    // console.log(JSON.stringify(detail.daly_trde_dtl[0]));
  }

  return NextResponse.json(results);
}
