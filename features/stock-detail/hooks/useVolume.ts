import { useQuery } from "@tanstack/react-query";
import { Ka10015Response } from "@/server/kiwoom/types";

export function useVolume(stockCodes: string[]) {
  return useQuery<Ka10015Response>({
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
