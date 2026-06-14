import { InvestorFlowItem } from "@/server/hankuk/types";
import { useQueries } from "@tanstack/react-query";

export function useStockInvestorFlow(stockCodes: string[]) {
  const uniqueCodes = [
    ...new Set(stockCodes.map((code) => code.split("_")[0])),
  ];
  // console.log("useStockInvestorFlow", uniqueCodes.length);
  return useQueries({
    queries: uniqueCodes.map((stockCode, index) => ({
      queryKey: ["stockInvestorFlow", stockCode],
      queryFn: async (): Promise<InvestorFlowItem> => {
        // console.log(`[요청 시작] ${stockCode?.split("_")[0]}`);
        await new Promise((r) => setTimeout(r, index * 100));
        const res = await fetch(
          `/api/hankuk/investor-flow?stockCode=${stockCode}`,
        );
        const data = await res.json();
        if (data === "실패") {
          // console.log(`[stockCode] 재시도 예정: ${stockCode}`);
          throw new Error("실패");
        }
        return data;
      },
      retry: 5,
      retryDelay: (attemptIndex: number) => {
        const delay = 1000 + Math.random() * 5000; // 1~5초
        // console.log(
        //   `[재시도 예정] ${stockCode} - ${attemptIndex + 1}번째, ${delay}초 후`,
        // );
        return delay;
      },
    })),
    combine: (results) => ({
      data: results,
      allSuccess: results.every((query) => query.isSuccess),
      failedCodes: uniqueCodes.filter((_, i) => results[i]?.isError),
    }),
  });
}
