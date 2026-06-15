import { useQuery } from "@tanstack/react-query";
import { ThemeWithStocks } from "../types";

type ThemeDB_Response = {
  topVolumeThemes: ThemeWithStocks[] | null;
  topChangeRateThemes: ThemeWithStocks[] | null;
  createdAt: string | null;
};

export function useTodayThemesFromDB() {
  return useQuery<ThemeDB_Response>({
    queryKey: ["themes-db"],
    queryFn: async () => {
      const res = await fetch("/api/themes/today");
      return res.json();
    },
    refetchInterval: 60 * 1000,
  });
}
