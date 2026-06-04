import { NextResponse } from "next/server";
import { kiwoomFetch } from "@/server/kiwoom/kiwoomFetcher";
import { KiwoomThemeGroupResponse } from "@/server/kiwoom/types";

export async function GET() {
  const themesData = await kiwoomFetch<KiwoomThemeGroupResponse>(
    "/api/dostk/thme",
    "ka90001",
    {
      qry_tp: "0",
      date_tp: "0",
      flu_pl_amt_tp: "3",
      stex_tp: "3",
    },
  );
  // console.log(themesData);
  return NextResponse.json(themesData);
}
