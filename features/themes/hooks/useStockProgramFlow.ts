import { ProgramFlowItem } from "@/server/kiwoom/types";
import { useQueries } from "@tanstack/react-query";

export function useStockProgramFlow(stockCodes: string[]) {
  const uniqueCodes = [...new Set(stockCodes)];
  return useQueries({
    queries: uniqueCodes.map((stockCode, index) => ({
      queryKey: ["stockProgramFlow", stockCode],
      queryFn: async (): Promise<ProgramFlowItem> => {
        await new Promise((r) => setTimeout(r, index * 100));
        const res = await fetch(
          `/api/kiwoom/stock-program-flow?stockCode=${stockCode}`,
        );

        return res.json();
      },
      retry: 3,
      retryDelay: 3000,
    })),
  });
}
