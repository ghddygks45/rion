import { useQueries } from "@tanstack/react-query";
import { KiwoomDailyTradeDetailResponse } from "@/server/kiwoom/types";

export function useVolume(stockCodes: string[]) {
  const uniqueCodes = [...new Set(stockCodes)];
  return useQueries({
    queries: uniqueCodes.map((stockCode, index) => ({
      queryKey: ["volume", stockCode],
      queryFn: async (): Promise<{ stockCode: string; volume: number } | "실패"> => {
        await new Promise((r) => setTimeout(r, index * 100));
        const res = await fetch(
          `/api/kiwoom/stock-volume?stockCode=${stockCode}`,
        );
        return res.json();
      },
      retry: 3,
      retryDelay: 3000,
    })),
  });
}
