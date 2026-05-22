import { useQuery } from "@tanstack/react-query";
import { ThemeWithStocks } from "../types";

type DB_Response = {
  topVolumeThemes: ThemeWithStocks[] | null;
  topChangeRateThemes: ThemeWithStocks[] | null;
};

export function useTodayThemesFromDB() {
  return useQuery<DB_Response>({
    queryKey: ["themes-db"],
    queryFn: async () => {
      const res = await fetch("/api/themes/today");
      return res.json();
    },
    // staleTime: 60 * 1000,
    // refetchInterval: 60 * 1000,
  });
}
