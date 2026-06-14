import { useQueries } from "@tanstack/react-query";
import { KiwoomThemeStockResponse } from "@/server/kiwoom/types";
import { Theme, themeStock } from "../types";

export function useAllThemeStocks(themes: Theme[]) {
  return useQueries({
    queries: themes.map((theme, index) => ({
      queryKey: ["themestocks", theme.themeId],
      queryFn: async (): Promise<themeStock[]> => {
        // console.log(`[요청 시작] ${theme.themeId}`);
        await new Promise((r) => setTimeout(r, index * 100));
        const res = await fetch(
          `/api/kiwoom/themestocks?themeId=${theme.themeId}`,
        );
        const data: KiwoomThemeStockResponse = await res.json();
        if (data === null || undefined) {
          // console.log(`[themestocks] 재시도 예정: ${theme.themeId}`);
        }
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
      retryDelay: (attemptIndex: number) => {
        const delay = 1000 + Math.random() * 5000; // 1~5초
        // console.log(
        //   `[재시도 예정] ${theme.themeId} - ${attemptIndex + 1}번째, ${delay}초 후`,
        // );
        return delay;
      },
    })),
    combine: (results) => ({
      data: results,
      allSuccess: results.every((query) => query.isSuccess),
    }),
  });
}
