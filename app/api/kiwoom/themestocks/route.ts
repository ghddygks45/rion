import { NextResponse } from "next/server";
import { kiwoomFetch } from "@/server/kiwoom/kiwoomFetcher";
import { KiwoomThemeStockResponse } from "@/server/kiwoom/types";
import { stringify } from "querystring";

export async function GET(themeId: Request) {
  const { searchParams } = new URL(themeId.url);
  const thema_grp_cd = searchParams.get("themeId") ?? "";
  const data = await kiwoomFetch<KiwoomThemeStockResponse>(
    "/api/dostk/thme",
    "ka90002",
    {
      stk_cd: "2",
      thema_grp_cd: thema_grp_cd,
      stex_tp: "3",
    },
  );

  return NextResponse.json(data);
}
