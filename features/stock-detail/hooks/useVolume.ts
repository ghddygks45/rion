import { useQueries } from "@tanstack/react-query";
import { KiwoomDailyTradeDetailResponse } from "@/server/kiwoom/types";

export function useVolume(stockCodes: string[]) {
  const uniqueCodes = [...new Set(stockCodes)];
  return useQueries({
    queries: uniqueCodes.map((stockCode) => ({
      queryKey: ["volume", stockCode],
      queryFn: async (): Promise<{ stockCode: string; volume: number }> => {
        const res = await fetch(
          `/api/kiwoom/stock-volume?stockCode=${stockCode}`,
        );
        return res.json();
      },
    })),
  });
}
