import { NextResponse } from "next/server";
import { kiwoomFetch } from "@/server/kiwoom/kiwoomFetcher";
import { PopularStock } from "@/server/kiwoom/types";

export async function GET() {
  const data = await kiwoomFetch<PopularStock[]>(
    "/api/dostk/stkinfo",
    "ka00198",
    {
      qry_tp: "1",
    },
  );
  return NextResponse.json(data);
}
