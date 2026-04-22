import { NextResponse } from "next/server";
import { kiwoomFetch } from "@/server/kiwoom/kiwoomFetcher";
import { Ka10032Response } from "@/server/kiwoom/types";

export async function GET() {
  const data = await kiwoomFetch<Ka10032Response>(
    "/api/dostk/rkinfo",
    "ka10032",
    {
      mrkt_tp: "000",
      mang_stk_incls: "0",
      stex_tp: "3",
    },
  );

  return NextResponse.json(data);
}
