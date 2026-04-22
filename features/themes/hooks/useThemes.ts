import { useQuery } from "@tanstack/react-query";
import {
  KiwoomThemeGroupWithStocks,
  KiwoomThemeStock,
} from "@/server/kiwoom/types";
import { Ka90002Response } from "@/server/kiwoom/types";
import { Theme } from "../types";

export function useThemes() {
  return useQuery<Theme[]>({
    queryKey: ["themes"],
    queryFn: async () => {
      const res = await fetch("/api/kiwoom/themes");
      const data = await res.json();
      return data.map((item: KiwoomThemeGroupWithStocks) => ({
        id: item.thema_grp_cd,
        name: item.thema_nm,
        avgChangeRate: parseFloat(item.flu_rt),
        main_stk: item.main_stk,
        stocks: item.stocks.map((stock: KiwoomThemeStock) => ({
          code: stock.stk_cd,
          name: stock.stk_nm,
          price: parseInt(stock.cur_prc, 10),
          changeRate: parseFloat(stock.flu_rt),
        })),
      }));
    },
  });
}

export function useThemestocks(thema_grp_cd: string) {
  return useQuery({
    queryKey: ["themestocks", thema_grp_cd],
    // refetchInterval: 10000,
    queryFn: async () => {
      const res = await fetch(
        `/api/kiwoom/themestocks?thema_grp_cd=${thema_grp_cd}`,
      );

      const data: Ka90002Response = await res.json();
      return data.thema_comp_stk.map((item) => ({
        code: item.stk_cd,
        name: item.stk_nm,
        price: parseInt(item.cur_prc, 10),
        changeRate: parseFloat(item.flu_rt),
      }));
    },
  });
}
