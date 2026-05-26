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
import Button from "@/components/ui/Button";
import Tab from "@/components/ui/Tab";

const STALE_MS = 1 * 60 * 1000;

function isStale(createdAt: string | null) {
  if (!createdAt) return true;
  return Date.now() - new Date(createdAt).getTime() > STALE_MS;
}

export default function ThemesPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>("volume");
  const [refreshButton, setRefreshButton] = useState(false);

  // 1. DB에 데이터 확인
  const { data: dbThemeData, isLoading: dbThemeLoading } =
    useTodayThemesFromDB();

  const dbDataChecker = dbThemeData?.topVolumeThemes != null;

  // 2. 외부 api에 각 데이터 요청
  const { data: themes } = useThemes();
  const topRateThemes = themes?.slice(0, 10);
  const topThemeStocks = useTopThemeStocks(topRateThemes ?? []);
  const allStocks = useAllThemeStocks(themes ?? []);
  const { data: topVolume, dataUpdatedAt: themesUpdatedAt } =
    useStockTopVolum();

  // 3. 데이터 가공
  const topVolumeThemes = themes
    ?.map((theme, i) => {
      const stocks = allStocks[i].data ?? [];

      // 1단계: topVolume에 있는 테마만 걸러내기
      const matchedStocks = stocks.filter((stock) =>
        topVolume?.some((tv) => tv.stockCode === stock.stockCode),
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

  // 4. 로딩
  const allLoaded =
    allStocks.every((stocks) => stocks.data !== undefined) && !!topVolume;

  const stockCodes = topThemeStocks
    .flatMap((result) => result.data ?? [])
    .map((stock) => stock.stockCode);

  const volume = useVolume(stockCodes);

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

  console.log(topChangeRateThemes);

  // 5. 가공된 데이터 저장
  useEffect(() => {
    if (!allLoaded) return;
    console.log("db에 저장할까요?");
    fetch("/api/themes/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topVolumeThemes, topChangeRateThemes }),
      // body: JSON.stringify({ topVolumeThemes }),
    }).then(() => {
      queryClient.invalidateQueries({ queryKey: ["themes-db"] });
      setRefreshButton(false);
    });
    console.log("db에 저장되었습니다.");
  }, [allLoaded, themesUpdatedAt]);

  // 재요청 트리거
  useEffect(() => {
    if (!dbDataChecker) return;
    const id = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["themes"] });
      queryClient.invalidateQueries({ queryKey: ["themestocks"] });
      queryClient.invalidateQueries({ queryKey: ["topVolume"] });
      console.log("재요청 할까요?");
    }, STALE_MS);
    console.log("재요청 되었습니다.");
    return () => clearInterval(id);
  }, [queryClient, dbDataChecker]);

  // 6. 로딩 스켈레톤: db없을 때,
  if (!dbThemeData?.topVolumeThemes)
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

  const themesToShow =
    activeTab === "volume"
      ? dbThemeData?.topVolumeThemes
      : dbThemeData?.topChangeRateThemes;

  // 7. 화면표시
  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <Title level={1}>오늘의 테마</Title>
        <Button onClick={() => setRefreshButton(true)}>새로고침</Button>
        <div className="flex gap-2 mb-6">
          {/* <Button onClick={() => setActiveTab("volume")}>거래대금 상위</Button>
          <Button
            variant="secondary"
            onClick={() => setActiveTab("changeRate")}
          >
            테마 상승률 상위
          </Button> */}
          <Tab
            tabs={[
              { key: "volume", label: "거래대금 상위" },
              { key: "changeRate", label: "테마 상승률 상위" },
            ]}
            activeKey={activeTab}
            onChange={(tab) => setActiveTab(tab)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themesToShow?.map((theme) => (
          <ThemeCard key={theme.themeId} theme={theme} />
        ))}
      </div>
    </main>
  );
}
