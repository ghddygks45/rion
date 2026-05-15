import { useQuery } from "@tanstack/react-query";
import { TodaysThemes } from "./type";
import { TodaysThemes as ApiTodaysThemes } from "@/app/api/kiwoom/top-changeRate-theme/route";

export function useTopChangeRateTheme() {
  return useQuery<TodaysThemes[]>({
    queryKey: ["topChangeRateTheme"],
    queryFn: async () => {
      const res = await fetch("/api/kiwoom/top-changeRate-theme");
      const data: { result: ApiTodaysThemes[] } = await res.json();
      return data.result.map((theme) => ({
        ...theme,
        stocks: theme.stocks.map((stock) => ({
          stockCode: stock.stk_cd,
          stockName: stock.stk_nm,
          price: Number(stock.cur_prc),
          changeRate: Number(stock.flu_rt),
          volume: Number(stock.trde_prica),
        })),
      }));
    },
  });
}
