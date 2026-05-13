import { useQuery } from "@tanstack/react-query";
import { KiwoomDailyTradeDetailResponse } from "@/server/kiwoom/types";

export function useVolume(stockCodes: string[]) {
  return useQuery<KiwoomDailyTradeDetailResponse>({
    queryKey: ["volume", stockCodes],
    enabled: stockCodes.length > 0,
    queryFn: async () => {
      const res = await fetch(
        `/api/kiwoom/stockvolume?stockCodes=${stockCodes.join(",")}`,
      );
      return res.json();
    },
  });
}
