import { useQuery } from "@tanstack/react-query";
import { Theme } from "../types";
import { KiwoomThemeGroupResponse } from "@/server/kiwoom/types";

export function useThemes() {
  return useQuery<Theme[]>({
    queryKey: ["themes"],
    enabled: process.env.NEXT_PUBLIC_SKIP_FETCH !== 'true',
    queryFn: async () => {
      const res = await fetch("/api/kiwoom/themes");
      const data: KiwoomThemeGroupResponse = await res.json();
      return data.thema_grp.map((theme) => ({
        themeId: theme.thema_grp_cd,
        themeName: theme.thema_nm,
        themeChangeRate: parseFloat(theme.flu_rt),
      }));
    },
  });
}
