import { useAllThemeStocks } from "../hooks/useAllThemeStocks";
import { useStockTopVolum } from "../hooks/useStockTopVolum";
import { useThemes } from "../hooks/useThemes";
import { buildTopVolumeThemes } from "./buildTopVolumeThemes";

export function useThemePageData() {
  const { data: themes } = useThemes();
  const { data: allStockResults } = useAllThemeStocks(themes ?? []);
  const { data: topVolume } = useStockTopVolum();

  const allStocksData = allStockResults.map((query) => query.data ?? []);

  const topVolumeThemes = buildTopVolumeThemes({
    themes: themes ?? [],
    allStocks: allStocksData,
    topVolume: topVolume ?? [],
  });

  return {
    topVolumeThemes,
  };
}
