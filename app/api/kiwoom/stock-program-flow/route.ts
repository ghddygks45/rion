import { NextResponse } from "next/server";
import { kiwoomFetch } from "@/server/kiwoom/kiwoomFetcher";
import { ProgramFlowResponse } from "@/server/kiwoom/types";

const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stockCode = searchParams.get("stockCode") ?? "";
  const data = await kiwoomFetch<ProgramFlowResponse>(
    "/api/dostk/mrkcond",
    "ka90013",
    {
      amt_qty_tp: "1",
      stk_cd: stockCode,
      date: today,
    },
  );

  return NextResponse.json(data.stk_daly_prm_trde_trnsn[0]);
}
