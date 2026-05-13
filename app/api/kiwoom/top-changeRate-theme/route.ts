import { NextResponse } from "next/server";
import { kiwoomFetch } from "@/server/kiwoom/kiwoomFetcher";
import {
  KiwoomDailyTradeDetailResponse,
  KiwoomThemeGroupResponse,
  KiwoomThemeStockResponse,
  KiwoomThemeStock,
} from "@/server/kiwoom/types";

type TodaysThemes = {
  themeName: string;
  themeId: string;
  themeChangeRate: number;
  stocks: stockWithvolume[];
};

type stockWithvolume = KiwoomThemeStock & {
  trde_prica?: string | undefined;
};

const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
const RETRY_DELAY = 100;
const delay = () => new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));

// 질문 제네럴타입이 KiwoomThemeStock[]가 되는 이유?
async function fetchThemeStocks(themeId: string): Promise<KiwoomThemeStock[]> {
  const data = await kiwoomFetch<KiwoomThemeStockResponse>(
    "/api/dostk/thme",
    "ka90002",
    {
      stk_cd: "2",
      thema_grp_cd: themeId,
      stex_tp: "3",
    },
  );
  return data.thema_comp_stk ?? null;
}

// 질문 제네럴타입이 string이 되는 이유?
async function fetchVolumeAddedStocks(stockId: string): Promise<string> {
  const data = await kiwoomFetch<KiwoomDailyTradeDetailResponse>(
    "/api/dostk/stkinfo",
    "ka10015",
    {
      stk_cd: stockId,
      strt_dt: today,
    },
  );
  return data.daly_trde_dtl?.[0]?.trde_prica ?? undefined;
}

export async function GET() {
  try {
    // 테마 목록 가져오기
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

    let todaysThemes: TodaysThemes[] = themesData.thema_grp
      .map((theme) => {
        return {
          themeName: theme.thema_nm,
          themeId: theme.thema_grp_cd,
          themeChangeRate: parseFloat(theme.flu_rt),
          stocks: [], // 나중에 채워질 예정
        };
      })
      .slice(0, 10);

    // 각 테마에 속한 종목들 가져오기
    let themeStocks: TodaysThemes[] = await Promise.all(
      todaysThemes.map(async (theme) => {
        return {
          ...theme,
          stocks: await fetchThemeStocks(theme.themeId),
        };
      }),
    );

    while (themeStocks.some((theme) => theme.stocks === null)) {
      await delay();

      const failed = themeStocks.filter((theme) => theme.stocks === null);
      const retried = await Promise.all(
        failed.map(async (theme) => ({
          ...theme,
          stocks: await fetchThemeStocks(theme.themeId),
        })),
      );

      // 테마별 종목 데이터를 다시 끼워넣기
      const retriedMap = new Map(
        retried.map((theme) => [theme.themeId, theme]),
      );

      themeStocks = themeStocks.map(
        (theme) => retriedMap.get(theme.themeId) ?? theme,
      );
    }

    // 각 종목별 거래대금 가져오기
    let themesAddedVolume: TodaysThemes[] = await Promise.all(
      themeStocks.map(async (theme) => {
        return {
          ...theme,
          stocks: await Promise.all(
            theme.stocks.map(async (stock) => ({
              ...stock,
              trde_prica: await fetchVolumeAddedStocks(stock.stk_cd),
            })),
          ),
        };
      }),
    );

    // 실패한 거래대금 요청 재시도
    while (
      themesAddedVolume.some((theme) =>
        theme.stocks.some((stock) => stock.trde_prica === undefined),
      )
    ) {
      await delay();

      const failed = themesAddedVolume.flatMap((theme) =>
        theme.stocks.filter((stock) => stock.trde_prica === undefined),
      );

      const retried = await Promise.all(
        failed.map(async (stock) => {
          return {
            ...stock,
            trde_prica: await fetchVolumeAddedStocks(stock.stk_cd),
          };
        }),
      );

      // 종목별 거래대금 데이터를 다시 끼워넣기
      const retriedMap = new Map(retried.map((stock) => [stock.stk_cd, stock]));

      themesAddedVolume = await Promise.all(
        themesAddedVolume.map(async (theme) => {
          return {
            ...theme,
            stocks: theme.stocks.map(
              (stock) => retriedMap.get(stock.stk_cd) ?? stock,
            ),
          };
        }),
      );
    }

    todaysThemes = themesAddedVolume;

    return NextResponse.json({ result: todaysThemes });
  } catch (error) {
    return NextResponse.json({
      result: [],
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
