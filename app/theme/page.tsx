"use client";

import BadgeSkeleton from "@/components/skeleton/BadgeSkeleton";
import StockTableSkeleton from "@/components/skeleton/StockTableSkeleton";
import TitleSkeleton from "@/components/skeleton/TitleSkeleton";
import Card from "@/components/ui/Card";
import Title from "@/components/ui/Title";
import ThemeCard from "@/features/themes/components/ThemeCard";
import { useStockTopVolum } from "@/features/themes/hooks/useStockTopVolum";
import { useAllThemeStocks } from "@/features/themes/hooks/useAllThemeStocks";
import { useThemes } from "@/features/themes/hooks/useThemes";
import { useVolume } from "@/features/stock-detail/hooks/useVolume";
import { themeStock } from "@/features/themes/types";
import { useTopThemeStocks } from "@/features/themes/hooks/useTopThemeStocks";

import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTodayThemesFromDB } from "@/features/themes/hooks/useTodayThemesFromDB";

export default function ThemesPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"volume" | "changeRate">("volume");

  const { data: dbThemeData, isLoading: dbThemeLoading } =
    useTodayThemesFromDB();
  const dbThemeEmpty = !dbThemeLoading && dbThemeData?.topVolumeThemes === null;

  const { data: themes } = useThemes();
  const topRateThemes = dbThemeEmpty ? themes?.slice(0, 10) : [];
  const topThemeStocks = useTopThemeStocks(
    dbThemeEmpty ? (topRateThemes ?? []) : [],
  );
  const allStocks = useAllThemeStocks(dbThemeEmpty ? (themes ?? []) : []);
  const { data: topVolume } = useStockTopVolum();

  const allLoaded =
    dbThemeEmpty &&
    allStocks.every((stocks) => stocks.data !== undefined) &&
    topVolume;

  const stockCodes = dbThemeEmpty
    ? topThemeStocks
        .flatMap((result) => result.data ?? [])
        .map((stock) => stock.stockCode)
    : [];

  const volume = useVolume(stockCodes);

  useEffect(() => {
    if (!allLoaded || !themes || !topVolume) return;

    const topVolumeThemes = themes
      ?.map((theme, i) => {
        const stocks = allStocks[i].data ?? [];

        // 1단계: topVolume에 있는 테마만 걸러내기
        const matchedStocks = stocks.filter((stock) =>
          topVolume.some((tv) => tv.stockCode === stock.stockCode),
        );

        // 2단계: 걸러진 종목에 volume 붙이기
        const withVolume = matchedStocks.map((stock) => {
          const tv = topVolume!.find((tv) => tv.stockCode === stock.stockCode)!;
          return { ...stock, volume: Number(tv.volume) };
        });

        // 3단계: 정렬
        const sortedStocks = withVolume.sort((a, b) => b.volume - a.volume);

        return { ...theme, stocks: sortedStocks };
      })
      .filter((theme) => theme.stocks.length > 0);

    const topChangeRateThemes = topRateThemes?.map((theme, i) => {
      return {
        ...theme,
        stocks: (topThemeStocks[i]?.data ?? []).map((stock) => {
          const volResult = volume.find(
            (volume) => volume.data?.stockCode === stock.stockCode,
          );
          return { ...stock, volume: volResult?.data?.volume ?? 0 };
        }),
      };
    });

    fetch("/api/themes/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topVolumeThemes, topChangeRateThemes }),
    }).then(() => {
      queryClient.invalidateQueries({ queryKey: ["themes-db"] });
    });
  }, [allLoaded]);

  if (dbThemeLoading || allLoaded)
    return (
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <Title level={1}>오늘의 테마</Title>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <Card key={i}>
              <div className="flex items-center justify-between mb-2">
                <TitleSkeleton level={2} />
                <BadgeSkeleton />
              </div>
              <div className="h-4 w-3/5 bg-border rounded animate-pulse mb-4" />
              <StockTableSkeleton rows={3} />
            </Card>
          ))}
        </div>
      </main>
    );

  // console.log(topChangeRateThemes);

  const themesToShow =
    activeTab === "volume"
      ? dbThemeData?.topVolumeThemes
      : dbThemeData?.topChangeRateThemes;

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-6">
        <Title level={1}>오늘의 테마</Title>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themesToShow?.map((theme) => (
          <ThemeCard key={theme.themeId} theme={theme} />
        ))}
      </div>
    </main>
  );
}
