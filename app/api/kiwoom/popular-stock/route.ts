import { NextResponse } from "next/server";
import { kiwoomFetch } from "@/server/kiwoom/kiwoomFetcher";
import { PopularStockResponse } from "@/server/kiwoom/types";

export async function GET() {
  const data = await kiwoomFetch<PopularStockResponse>(
    "/api/dostk/stkinfo",
    "ka00198",
    {
      qry_tp: "1",
    },
  );
  return NextResponse.json(data);
}
