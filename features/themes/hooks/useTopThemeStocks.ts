import { useQueries } from "@tanstack/react-query";
import { KiwoomThemeStockResponse } from "@/server/kiwoom/types";
import { Theme, themeStock } from "../types";

export function useTopThemeStocks(themes: Theme[]) {
  return useQueries({
    queries: themes.map((theme) => ({
      queryKey: ["themestocks", theme.themeId],
      enabled: process.env.NEXT_PUBLIC_SKIP_FETCH !== 'true',
      queryFn: async (): Promise<themeStock[]> => {
        const res = await fetch(
          `/api/kiwoom/themestocks?themeId=${theme.themeId}`,
        );
        const data: KiwoomThemeStockResponse = await res.json();
        return data.thema_comp_stk.map((stock) => ({
          themeName: theme.themeName,
          themeId: theme.themeId,
          stockCode: stock.stk_cd,
          stockName: stock.stk_nm,
          price: Math.abs(parseFloat(stock.cur_prc)),
          changeRate: parseFloat(stock.flu_rt),
        }));
      },
      retry: 3,
      retryDelay: () => {
        const delay = 3000 + Math.random() * 2000; // 3~5초
        return delay;
      },
    })),
  });
}
