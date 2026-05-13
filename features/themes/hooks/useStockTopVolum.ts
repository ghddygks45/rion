import { useQuery } from "@tanstack/react-query";
import { KiwoomTopVolumeResponse } from "@/server/kiwoom/types";
import { stockTopVolume } from "../types";

export function useStockTopVolum() {
  return useQuery<stockTopVolume[]>({
    queryKey: ["topVolume"],
    queryFn: async () => {
      const res = await fetch(`/api/kiwoom/top-volume`);
      const data: KiwoomTopVolumeResponse = await res.json();
      return data.trde_prica_upper.map((stock) => ({
        stockCode: stock.stk_cd,
        stockName: stock.stk_nm,
        volume: stock.trde_prica,
      }));
    },
  });
}
