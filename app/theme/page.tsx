"use client";

import BadgeSkeleton from "@/components/skeleton/BadgeSkeleton";
import StockTableSkeleton from "@/components/skeleton/StockTableSkeleton";
import TitleSkeleton from "@/components/skeleton/TitleSkeleton";
import Card from "@/components/ui/Card";
import Title from "@/components/ui/Title";
import ThemeCard from "@/features/themes/components/ThemeCard";
import { useState } from "react";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import Button from "@/components/ui/Button";
import Tab from "@/components/ui/Tab";
import Toggle from "@/components/ui/Toggle";
import { useThemePageDataFromDB } from "@/features/themes/hooks/useThemePageDataFromDB";
import { useIsTodayDataReady } from "@/features/themes/hooks/useIsTodayDataReady";

export default function ThemesPage() {
  const { dbThemeData, dbSupplyData, isLoading } = useThemePageDataFromDB();
  const isDataReady = useIsTodayDataReady();

  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>("volume");

  const [activeView, setActiveView] = useState<"price" | "supply">("price");

  const isFetching = useIsFetching(); // 현재 fetching 중인 쿼리 수

  // 새로고침 로직
  const [isReFetching, setIsReFetching] = useState(false);
  const isRefreshing = isReFetching && isFetching > 0;

  if (isDataReady)
    return (
      <main className="xl:mx-auto xl:w-7xl px-4 py-6 flex-1 flex flex-col">
        <div className="mb-6 w-full">
          <Title level={1}>오늘의 테마</Title>
        </div>
        <div className="flex-1 flex items-center justify-center text-center flex-col">
          <p className="text-lg text-text-secondary max-w-md">
            장 시작 전 데이터 정비 중입니다.
          </p>
          <p className="text-lg text-text-secondary max-w-md">
            오전 8:10부터 오늘의 테마를 확인하실 수 있습니다.
          </p>
        </div>
      </main>
    );

  if (isLoading)
    return (
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <Title level={1}>오늘의 테마</Title>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:gap-6 gap-3">
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

  const volumeThemes =
    activeView === "supply"
      ? dbSupplyData?.topVolumeSupply
      : dbThemeData?.topVolumeThemes;

  const changeRateThemes =
    activeView === "supply"
      ? dbSupplyData?.topChangeRateSupply
      : dbThemeData?.topChangeRateThemes;

  const themesToShow = activeTab === "volume" ? volumeThemes : changeRateThemes;

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      <div className="relative flex w-full mb-6 flex-col md:flex-row md:items-end">
        <div className="flex-1 mb-4 md:mb-0 min-w-0">
          <Title level={1} className="inline-block align-bottom mr-2">
            오늘의 테마
          </Title>
          <Button
            disabled={isRefreshing}
            size="sm"
            onClick={async () => {
              setIsReFetching(true);
              await fetch("/api/themes/refresh", { method: "POST" });
              await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["themes-db"] }),
                queryClient.invalidateQueries({ queryKey: ["supply-db"] }),
              ]);
              setIsReFetching(false);
            }}
          >
            {isRefreshing ? "최신데이터를 불러오고 있습니다..." : "새로고침"}
          </Button>
        </div>
        <div className="flex md:items-center shrink-0 justify-end md:justify-between gap-4 self-end">
          <div className="">
            <Tab
              tabs={[
                { key: "volume", label: "거래대금 상위" },
                { key: "changeRate", label: "테마 상승률 상위" },
              ]}
              activeKey={activeTab}
              onChange={(tab) => setActiveTab(tab)}
            />
          </div>
          <div className="absolute top-1 right-0 md:static">
            <Toggle
              checked={activeView === "supply"}
              onChange={(toggle) => setActiveView(toggle ? "supply" : "price")}
              labelLeft="현재가"
              labelRight="수급"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:gap-6 gap-4">
        {themesToShow?.map((theme) => (
          <ThemeCard key={theme.themeId} theme={theme} view={activeView} />
        ))}
      </div>
    </main>
  );
}
