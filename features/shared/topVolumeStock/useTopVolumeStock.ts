import { KiwoomTopVolumeResponse } from "@/server/kiwoom/types";
import { useQuery } from "@tanstack/react-query";
import { TopVolumeStock } from "../type";

export function useTopVolumeStock() {
  return useQuery<TopVolumeStock[]>({
    queryKey: ["topVolumeStock"],
    queryFn: async () => {
      const res = await fetch("/api/kiwoom/top-volume");
      const data: KiwoomTopVolumeResponse = await res.json();
      return data.trde_prica_upper.map((stock) => ({
        stockCode: stock.stk_cd,
        stockName: stock.stk_nm,
        volume: Number(stock.trde_prica),
        rank: Number(stock.now_rank),
      }));
    },
  });
}
