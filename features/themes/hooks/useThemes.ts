import { useQuery } from "@tanstack/react-query";
import { Ka90001Response } from "@/server/kiwoom/types";
import { Theme } from "../types";

export function useThemes() {
  return useQuery<Theme[]>({
    queryKey: ["themes"],
    refetchInterval: 10000,
    queryFn: async () => {
      const res = await fetch("/api/kiwoom/themes");
      const data: Ka90001Response = await res.json();
      return data.thema_grp.map((item) => ({
        id: item.thema_grp_cd,
        name: item.thema_nm,
        avgChangeRate: parseFloat(item.flu_rt),
        summary: "",
        stocks: [],
      }));
    },
  });
}
