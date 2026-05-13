import { useQuery } from "@tanstack/react-query";
import { topProgramBuysResponse } from "@/server/kiwoom/types";

export function useKospiTopProgramBuys() {
  return useQuery({
    queryKey: ["kospiProgramBuys"],
    queryFn: async () => {
      const res = await fetch("/api/kiwoom/top-programBuys");
      const data: topProgramBuysResponse = await res.json();
      return data.kospiProgramBuys.map((stock) => ({
        stockCode: stock.stk_cd,
        stockName: stock.stk_nm,
        price: Number(stock.cur_prc),
        changeRate: Number(stock.flu_rt),
        rank: Number(stock.rank),
        programTotal: Number(stock.prm_netprps_amt),
      }));
    },
  });
}

export function useKosdaqTopProgramBuys() {
  return useQuery({
    queryKey: ["kosdaqProgramBuys"],
    queryFn: async () => {
      const res = await fetch("/api/kiwoom/top-programBuys");
      const data: topProgramBuysResponse = await res.json();
      return data.kosdaqProgramBuys.map((stock) => ({
        stockCode: stock.stk_cd,
        stockName: stock.stk_nm,
        price: Number(stock.cur_prc),
        changeRate: Number(stock.flu_rt),
        rank: Number(stock.rank),
        programTotal: Number(stock.prm_netprps_amt),
      }));
    },
  });
}
