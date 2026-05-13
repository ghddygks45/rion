import { NextResponse } from "next/server";
import { kiwoomFetch } from "@/server/kiwoom/kiwoomFetcher";
import { KiwoomStockInfoResponse } from "@/server/kiwoom/types";

export async function GET() {
  const data = await kiwoomFetch<KiwoomStockInfoResponse>(
    "/api/dostk/stkinfo",
    "ka10100",
    {
      mrkt_tp: "000",
      mang_stk_incls: "0",
      stex_tp: "3",
    },
  );

  return NextResponse.json(data);
}
