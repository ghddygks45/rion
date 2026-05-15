import { useQueries, useQuery } from "@tanstack/react-query";
import { KiwoomThemeStockResponse } from "@/server/kiwoom/types";
import { Theme, themeStock } from "../types";

export function useAllThemeStocks(themes: Theme[]) {
  return useQueries<themeStock[]>({
    queries: themes.map((theme) => ({
      queryKey: ["themestocks", theme.themeId],
      queryFn: async () => {
        const res = await fetch(
          `/api/kiwoom/themestocks?themeId=${theme.themeId}`,
        );
        const data: KiwoomThemeStockResponse = await res.json();
        return data.thema_comp_stk.map((stock) => ({
          themeName: theme.themeName,
          themeId: theme.themeId,
          stockCode: stock.stk_cd,
          stockName: stock.stk_nm,
          price: parseFloat(stock.cur_prc),
          changeRate: parseFloat(stock.flu_rt),
        }));
      },
    })),
  });
}
