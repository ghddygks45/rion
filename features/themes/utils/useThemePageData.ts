import { useVolume } from "@/features/stock-detail/hooks/useVolume";
import { useAllThemeStocks } from "../hooks/useAllThemeStocks";
import { useStockTopVolum } from "../hooks/useStockTopVolum";
import { useThemes } from "../hooks/useThemes";
import { useTopThemeStocks } from "../hooks/useTopThemeStocks";
import { buildTopVolumeThemes } from "./buildTopVolumeThemes";
import { buildVolumeMap } from "./buildVolumeMap";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTodayThemesFromDB } from "../hooks/useTodayThemesFromDB";
import { buildTopChangeRateThemes } from "./buildTopChangeRateThemes";

export function useThemePageData() {
  const { data: dbThemeData } = useTodayThemesFromDB();

  // *********************************************************

  const { data: themes } = useThemes();
  const { data: allStockResults } = useAllThemeStocks(themes ?? []);
  const { data: topVolume, dataUpdatedAt: themesUpdatedAt } =
    useStockTopVolum();

  const allStocksData = allStockResults.map((query) => query.data ?? []);

  const topVolumeThemes = buildTopVolumeThemes({
    themes: themes ?? [],
    allStocks: allStocksData,
    topVolume: topVolume ?? [],
  });

  // **************************************************

  const topRateThemes = themes?.slice(0, 10);
  const topThemeStocks = useTopThemeStocks(topRateThemes ?? []);

  const stockCodes = topThemeStocks
    .flatMap((result) => result.data ?? [])
    .map((stock) => stock.stockCode);
  const uniqueStockCodes = [...new Set(stockCodes)];
  const { data: volumeDataResults, allSuccess: allvolumeSuccess } =
    useVolume(stockCodes);

  console.log("volume", allvolumeSuccess);

  const volumeData = volumeDataResults.map((query) => query.data);
  const volumeDataMap = buildVolumeMap({
    uniqueStockCodes,
    volumeData,
  });

  // **************************************************

  const topThemeStocksData = topThemeStocks.map((query) => query.data ?? []);

  const topChangeRateThemes = buildTopChangeRateThemes(
    topRateThemes ?? [],
    topThemeStocksData,
    volumeDataMap,
    dbThemeData?.topChangeRateThemes ?? [],
  );

  console.log("리팩토링", topChangeRateThemes);

  // **************************************************

  const allLoaded =
    allStockResults.every((query) => !query.isLoading) &&
    !!topVolume &&
    volumeDataResults.every((query) => !query.isLoading);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!allLoaded) return;
    fetch("/api/themes/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topVolumeThemes, topChangeRateThemes }),
    }).then(() => {
      queryClient.invalidateQueries({ queryKey: ["themes-db"] });
    });
  }, [allLoaded, themesUpdatedAt]);

  return {
    topVolumeThemes,
    volumeDataMap,
    topChangeRateThemes,
  };
}
