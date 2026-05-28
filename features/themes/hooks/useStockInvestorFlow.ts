import { InvestorFlowItem } from "@/server/hankuk/types";
import { useQueries } from "@tanstack/react-query";

export function useStockInvestorFlow(stockCodes: string[]) {
  const uniqueCodes = [...new Set(stockCodes)];
  return useQueries({
    queries: uniqueCodes.map((stockCode, index) => ({
      queryKey: ["stockInvestorFlow", stockCode],
      queryFn: async (): Promise<InvestorFlowItem> => {
        await new Promise((r) => setTimeout(r, index * 100));
        const res = await fetch(
          `/api/hankuk/investor-flow?stockCode=${stockCode}`,
        );
        return res.json();
      },
      retry: 3,
      retryDelay: 3000,
    })),
  });
}
