import { useQuery } from "@tanstack/react-query";
import { PopularStock } from "../type";
import { PopularStockResponse } from "@/server/kiwoom/types";

export function usePopularStock() {
  return useQuery<PopularStock[]>({
    queryKey: ["PopularStock"],
    queryFn: async () => {
      const res = await fetch("/api/kiwoom/popular-stock");
      const data: PopularStockResponse = await res.json();
      return data.item_inq_rank.map((stock) => ({
        stockName: stock.stk_nm,
        rank: Number(stock.bigd_rank),
        price: Number(stock.past_curr_prc),
        changeRate: Number(stock.base_comp_chgr),
      }));
    },
  });
}
