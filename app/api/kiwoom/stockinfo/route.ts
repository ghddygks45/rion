import { NextResponse } from "next/server";
import { kiwoomFetch } from "@/server/kiwoom/kiwoomFetcher";
import { Ka10100Response } from "@/server/kiwoom/types";

export async function GET() {
  const data = await kiwoomFetch<Ka10100Response>(
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
