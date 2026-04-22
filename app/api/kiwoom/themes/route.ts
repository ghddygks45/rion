import { NextResponse } from "next/server";
import { kiwoomFetch } from "@/server/kiwoom/kiwoomFetcher";
import { Ka90001Response } from "@/server/kiwoom/types";
import { Ka90002Response } from "@/server/kiwoom/types";

export async function GET() {
  const themesData = await kiwoomFetch<Ka90001Response>(
    "/api/dostk/thme",
    "ka90001",
    {
      qry_tp: "0",
      date_tp: "0",
      flu_pl_amt_tp: "3",
      stex_tp: "3",
    },
  );

  const themeTop10 = themesData.thema_grp.slice(0, 10);

  const result = await Promise.all(
    themeTop10.map(async (theme) => {
      const themeStocks = await kiwoomFetch<Ka90002Response>(
        "/api/dostk/thme",
        "ka90002",
        {
          stk_cd: "2",
          thema_grp_cd: theme.thema_grp_cd,
          stex_tp: "3",
        },
      );
      return {
        ...theme,
        stocks: themeStocks.thema_comp_stk,
      };
    }),
  );

  return NextResponse.json(result);
}
