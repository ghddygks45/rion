"use client";

import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Title from "@/components/ui/Title";
import StockTable from "@/components/ui/StockTable";
import { Theme } from "../types";
import { useThemeStocks } from "../hooks/useTemeStocks";
import { useStockTopVolum } from "../hooks/useStockTopVolum";

export default function ThemeCard({ theme }: { theme: Theme }) {
  const router = useRouter();
  const variant =
    theme.themeChangeRate > 0
      ? "up"
      : theme.themeChangeRate < 0
        ? "down"
        : "neutral";
  const sign = theme.themeChangeRate > 0 ? "+" : "";

  const { data: stocks } = useThemeStocks(theme.themeId, theme.themeName);
  const { data: stockTopVolume } = useStockTopVolum();

  const stocksWithVolume =
    stocks && stockTopVolume
      ? stocks
          .filter((stock) =>
            stockTopVolume.some(
              (volume) => volume.stockCode === stock.stockCode,
            ),
          )
          .map((stock) => {
            const volumeData = stockTopVolume.find(
              (volume) => volume.stockCode === stock.stockCode,
            );
            return { ...stock, volume: Number(volumeData!.volume) };
          })
      : undefined;

  const themeVolume =
    stocksWithVolume?.reduce((acc, stock) => acc + Number(stock.volume), 0) ??
    0;

  const stocksWithThemeVolume = stocksWithVolume
    ?.map((stock) => ({
      ...stock,
      themeVolume,
    }))
    .sort((a, b) => b.themeVolume - a.themeVolume);

  console.log(stocksWithThemeVolume);

  if (!stocksWithThemeVolume || stocksWithThemeVolume.length === 0) return null;

  return (
    <>
      <Card>
        <div
          className="cursor-pointer"
          onClick={() => router.push(`/theme/${theme.themeId}`)}
        >
          <div className="flex items-center justify-between mb-2">
            <Title level={2}>{theme.themeName}</Title>
            <Badge variant={variant}>
              {sign}
              {theme.themeChangeRate.toFixed(2)}%
            </Badge>
          </div>
          <p className="text-sm text-text-secondary mb-4">
            여기는 나중에 따로...
          </p>
        </div>
        <StockTable stocks={stocksWithThemeVolume} />
      </Card>
    </>
  );
}
