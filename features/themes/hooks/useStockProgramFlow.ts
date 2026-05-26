import { useQueries } from "@tanstack/react-query";

export function useStockProgramFlow(stockCodes: string[]) {
  const uniqueCodes = [...new Set(stockCodes)];
  return useQueries({
    queries: uniqueCodes.map((stockCode) => ({
      queryKey: ["stockProgramFlow", stockCode],
      queryFn: async (): Promise<{ stockCode: string }> => {
        const res = await fetch(
          `/api/kiwoom/stock-program-flow?stockCode=${stockCode}`,
        );
        return res.json();
      },
    })),
  });
}
