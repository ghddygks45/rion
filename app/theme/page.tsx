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
import { useThemePageData } from "@/features/themes/hooks/useThemePageData";

export default function ThemesPage() {
  const { dbThemeData, dbSupplyData, isLoading } = useThemePageData();

  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>("volume");

  const [activeView, setActiveView] = useState<"price" | "supply">("price");

  const isFetching = useIsFetching(); // 현재 fetching 중인 쿼리 수

  // 새로고침 로직
  const [isReFetching, setIsReFetching] = useState(false);
  const isRefreshing = isReFetching && isFetching > 0;

  if (isLoading)
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

  const volumeThemes =
    activeView === "supply"
      ? dbSupplyData?.topVolumeSupply
      : dbThemeData?.topVolumeThemes;

  const changeRateThemes =
    activeView === "supply"
      ? dbSupplyData?.topChangeRateSupply
      : dbThemeData?.topChangeRateThemes;

  const themesToShow = activeTab === "volume" ? volumeThemes : changeRateThemes;

  // 7. 화면표시
  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-end justify-between mb-6">
        <div className="flex gap-2 items-end">
          <Title level={1}>오늘의 테마</Title>
          <Button
            disabled={isRefreshing}
            size="sm"
            onClick={async () => {
              setIsReFetching(true);
              await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["themes"] }),
                queryClient.invalidateQueries({ queryKey: ["themestocks"] }),
                queryClient.invalidateQueries({ queryKey: ["topVolume"] }),
                queryClient.removeQueries({ queryKey: ["stockInvestorFlow"] }),
                queryClient.removeQueries({ queryKey: ["stockProgramFlow"] }),
              ]);
              setIsReFetching(false);
            }}
          >
            {isRefreshing ? "최신데이터를 불러오고 있습니다..." : "새로고침"}
          </Button>
        </div>
        <div className="flex gap-2">
          <Tab
            tabs={[
              { key: "volume", label: "거래대금 상위" },
              { key: "changeRate", label: "테마 상승률 상위" },
            ]}
            activeKey={activeTab}
            onChange={(tab) => setActiveTab(tab)}
          />
        </div>
        <div className="flex gap-2">
          <Toggle
            checked={activeView === "supply"}
            onChange={(toggle) => setActiveView(toggle ? "supply" : "price")}
            labelLeft="현재가"
            labelRight="수급"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themesToShow?.map((theme) => (
          <ThemeCard key={theme.themeId} theme={theme} view={activeView} />
        ))}
      </div>
    </main>
  );
}
