import { ProgramFlowItem } from "@/server/kiwoom/types";
import { useQueries } from "@tanstack/react-query";

export function useStockProgramFlow(stockCodes: string[]) {
  const uniqueCodes = [...new Set(stockCodes)];
  // console.log(uniqueCodes.length);
  return useQueries({
    queries: uniqueCodes.map((stockCode, index) => ({
      queryKey: ["stockProgramFlow", stockCode],
      enabled: process.env.NEXT_PUBLIC_SKIP_FETCH !== 'true',
      queryFn: async (): Promise<ProgramFlowItem> => {
        // console.log(`[요청 시작] ${stockCode}`);
        await new Promise((r) => setTimeout(r, index * 100));
        const res = await fetch(
          `/api/kiwoom/stock-program-flow?stockCode=${stockCode}`,
        );

        const data = await res.json();
        if (data === "실패") {
          // console.log(`[stockCode] 재시도 예정 : ${stockCode}`);
          throw new Error("실패");
        }
        return data;
      },
      retry: 3,
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
      failed: uniqueCodes.filter((_, i) => results[i]?.isError),
    }),
  });
}
