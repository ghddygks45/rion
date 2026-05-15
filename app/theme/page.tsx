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

export default function ThemesPage() {
  const { data: themes } = useThemes();
  const allStocks = useAllThemeStocks(themes ?? []);
  const { data: topVolume } = useStockTopVolum();

  const allLoaded =
    allStocks.every((stocks) => stocks.data !== undefined) &&
    topVolume !== undefined;

  if (!allLoaded)
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
  // if (isError)
  //   return (
  //     <main className="max-w-7xl mx-auto px-6 py-8">
  //       <p className="text-text-secondary">데이터를 불러오지 못했습니다.</p>
  //     </main>
  //   );

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-6">
        <Title level={1}>오늘의 테마</Title>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 내가 가공한 데이터의 map으로 돌려서 카드를 만든다. */}
        {themes?.map((theme) => (
          <ThemeCard key={theme.themeId} theme={theme} />
        ))}
      </div>
    </main>
  );
}
