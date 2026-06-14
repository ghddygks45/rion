import { stockTopVolume, Theme, themeStock } from "../types";

type buildTopVolumeThemesProps = {
  themes: Theme[];
  allStocks: themeStock[][];
  topVolume: stockTopVolume[];
};

export function buildTopVolumeThemes({
  themes,
  allStocks,
  topVolume,
}: buildTopVolumeThemesProps) {
  const topVolumeThemes = themes
    ?.map((theme, i) => {
      const stocks = allStocks[i] ?? [];

      // 1단계: topVolume에 있는 테마만 걸러내기
      const matchedStocks = stocks.filter((stock) =>
        topVolume?.some((volume) => volume.stockCode === stock.stockCode),
      );

      // 2단계: 걸러진 종목에 volume 붙이기
      const withVolumeStocks = matchedStocks.map((stock) => {
        const tv = topVolume.find(
          (volume) => volume.stockCode === stock.stockCode,
        );
        return { ...stock, volume: Number(tv?.volume) };
      });

      // 3단계: 거래대금 높은 순으로 정렬
      const sortedStocks = withVolumeStocks.sort((a, b) => b.volume - a.volume);

      return { ...theme, stocks: sortedStocks };
    })
    .filter((theme) => theme.stocks.length > 0);

  return topVolumeThemes;
}
