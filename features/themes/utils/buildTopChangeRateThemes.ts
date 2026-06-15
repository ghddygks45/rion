import { Theme, themeStock, ThemeWithStocks } from "../types";

type VolumeData = { stockCode: string; volume: number };

export function buildTopChangeRateThemes(
  topRateThemes: Theme[],
  topThemeStocks: themeStock[][],
  volumeDataMap: Map<string, VolumeData | "실패" | undefined>,
  dbFallback: ThemeWithStocks[],
) {
  const topChangeRateThemes = topRateThemes?.map((theme, i) => {
    return {
      ...theme,
      stocks: (topThemeStocks[i] ?? []).map((stock) => {
        const volData = volumeDataMap.get(stock.stockCode);
        const dbStock = dbFallback
          ?.flatMap((theme) => theme.stocks)
          .find((dbStock) => dbStock.stockCode === stock.stockCode);
        return {
          ...stock,
          volume:
            volData === "실패" || volData === undefined
              ? dbStock?.volume
              : volData.volume,
        };
      }),
    };
  });

  return topChangeRateThemes;
}
