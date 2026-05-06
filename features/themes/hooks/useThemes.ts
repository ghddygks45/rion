import { useQuery } from "@tanstack/react-query";
import { Theme } from "../types";
import { Ka90001Response } from "@/server/kiwoom/types";

export function useThemes() {
  return useQuery<Theme[]>({
    queryKey: ["themes"],
    queryFn: async () => {
      const res = await fetch("/api/kiwoom/themes");
      const data: Ka90001Response = await res.json();
      return data.thema_grp.map((theme) => ({
        themeId: theme.thema_grp_cd,
        themeName: theme.thema_nm,
        themeChangeRate: parseFloat(theme.flu_rt),
      }));
    },
  });
}
