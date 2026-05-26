import { useQueries } from "@tanstack/react-query";

export function useStockInvestorFlow(stockCodes: string[]) {
  const uniqueCodes = [...new Set(stockCodes)];
  return useQueries({
    queries: uniqueCodes.map((stockCode) => ({
      queryKey: ["stockInvestorFlow", stockCode],
      queryFn: async (): Promise<{ stockCode: string }> => {
        const res = await fetch(
          `/api/hankuk/investor-flow?stockCode=${stockCode}`,
        );
        return res.json();
      },
    })),
  });
}
