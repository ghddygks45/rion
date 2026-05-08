import { NextResponse } from "next/server";
import { kiwoomFetch } from "@/server/kiwoom/kiwoomFetcher";
import {
  Ka90001Response,
  Ka90002Response,
  topVolume,
} from "@/server/kiwoom/types";

export async function GET() {
  try {
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

    const themes = themesData.thema_grp.map((theme) => ({
      themeName: theme.thema_nm,
      themeId: theme.thema_grp_cd,
      themeChangeRate: parseFloat(theme.flu_rt),
    }));

    const result = [];
    const BATCH_SIZE = 5;
    for (let i = 0; i < themes.length; i += BATCH_SIZE) {
      const batch = themes.slice(i, i + BATCH_SIZE);

      const themeStocksList = await Promise.all(
        batch.map(async (theme) => {
          const themeStocksData = await kiwoomFetch<Ka90002Response>(
            "/api/dostk/thme",
            "ka90002",
            {
              stk_cd: "2",
              thema_grp_cd: theme.themeId,
              stex_tp: "3",
            },
          );
          // if (themeStocksData.return_code === 5) {
          //   throw new Error(themeStocksData.return_msg);
          // }
          // console.log(themeStocksData);
          return {
            ...theme,
            stocks: themeStocksData.thema_comp_stk,
          };
        }),
      );
      result.push(...themeStocksList);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return NextResponse.json({ result });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      result: [],
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
