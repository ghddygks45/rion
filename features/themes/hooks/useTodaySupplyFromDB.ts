import { useQuery } from "@tanstack/react-query";
import { ThemeWithSupply } from "../types";

type SupplyDB_Response = {
  topVolumeSupply: ThemeWithSupply[] | null;
  topChangeRateSupply: ThemeWithSupply[] | null;
  createdAt: string | null;
};

export function useTodaySupplyFromDB() {
  return useQuery<SupplyDB_Response>({
    queryKey: ["supply-db"],
    queryFn: async () => {
      const res = await fetch("/api/supply/today");
      return res.json();
    },
    refetchInterval: 60 * 1000,
  });
}
