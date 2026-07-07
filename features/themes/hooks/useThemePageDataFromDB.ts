import { useTodayThemesFromDB } from "../hooks/useTodayThemesFromDB";
import { useTodaySupplyFromDB } from "../hooks/useTodaySupplyFromDB";

export function useThemePageDataFromDB() {
  const { data: dbThemeData } = useTodayThemesFromDB();
  const { data: dbSupplyData } = useTodaySupplyFromDB();

  return {
    dbThemeData,
    dbSupplyData,
    isLoading:
      !dbThemeData?.topVolumeThemes || !dbSupplyData?.topChangeRateSupply,
  };
}
