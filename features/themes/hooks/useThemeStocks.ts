import { useQuery } from "@tanstack/react-query";
import { KiwoomThemeStockResponse } from "@/server/kiwoom/types";
import { themeStock } from "../types";

export function useThemeStocks(themeId: string, themeName: string) {
  return useQuery<themeStock[]>({
    queryKey: ["themestocks", themeId],
    queryFn: async () => {
      const res = await fetch(`/api/kiwoom/themestocks?themeId=${themeId}`);
      const data: KiwoomThemeStockResponse = await res.json();
      return data.thema_comp_stk.map((stock) => ({
        themeName: themeName,
        themeId: themeId,
        stockCode: stock.stk_cd,
        stockName: stock.stk_nm,
        price: parseFloat(stock.cur_prc),
        changeRate: parseFloat(stock.flu_rt),
      }));
    },
  });
}
