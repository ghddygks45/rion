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
import { useTopThemeStocks } from "@/features/themes/hooks/useTopThemeStocks";

import { useState, useEffect } from "react";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { useTodayThemesFromDB } from "@/features/themes/hooks/useTodayThemesFromDB";
import Button from "@/components/ui/Button";
import Tab from "@/components/ui/Tab";
import { useStockInvestorFlow } from "@/features/themes/hooks/useStockInvestorFlow";
import { useStockProgramFlow } from "@/features/themes/hooks/useStockProgramFlow";
import Toggle from "@/components/ui/Toggle";
import { useTodaySupplyFromDB } from "@/features/themes/hooks/useTodaySupplyFromDB";

const STALE_MS = 1 * 60 * 1000;

export default function ThemesPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>("volume");

  const [activeView, setActiveView] = useState<"price" | "supply">("price");

  const isFetching = useIsFetching(); // 현재 fetching 중인 쿼리 수

  // 새로고침 로직
  const [isReFetching, setIsReFetching] = useState(false);
  const isRefreshing = isReFetching && isFetching > 0;

  // 1. DB에 데이터 확인(상승률)
  const { data: dbThemeData, isLoading: dbThemeLoading } =
    useTodayThemesFromDB();

  const dbDataChecker = dbThemeData?.topVolumeThemes != null;

  // 1. DB에 데이터 확인(수급)
  const { data: dbSupplyData, isLoading: dbSupplyLoading } =
    useTodaySupplyFromDB();

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

  const stockCodes = topThemeStocks
    .flatMap((result) => result.data ?? [])
    .map((stock) => stock.stockCode);

  const volume = useVolume(stockCodes);

  const uniqueStockCodes = [...new Set(stockCodes)];
  const volumeMap = new Map(
    uniqueStockCodes.map((code, i) => [code, volume[i]?.data]),
  );

  // 4. 로딩
  const allLoaded =
    allStocks.every((themeStockQuery) => !themeStockQuery.isLoading) &&
    !!topVolume &&
    volume.every((v) => !v.isLoading);

  const topChangeRateThemes = topRateThemes?.map((theme, i) => {
    return {
      ...theme,
      stocks: (topThemeStocks[i]?.data ?? []).map((stock) => {
        const volData = volumeMap.get(stock.stockCode);
        const dbStock = dbThemeData?.topChangeRateThemes
          ?.flatMap((t) => t.stocks)
          .find((s) => s.stockCode === stock.stockCode);
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

  // 5. 가공된 데이터 저장
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

  // 재요청 트리거
  useEffect(() => {
    if (!dbDataChecker) return;
    const id = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["themes"] });
      queryClient.invalidateQueries({ queryKey: ["themestocks"] });
      queryClient.invalidateQueries({ queryKey: ["topVolume"] });
      queryClient.invalidateQueries({ queryKey: ["stockInvestorFlow"] });
      queryClient.invalidateQueries({ queryKey: ["stockProgramFlow"] });
    }, STALE_MS);
    return () => clearInterval(id);
  }, [queryClient, dbDataChecker]);

  //************수급 불러오기***************************************

  // 거래대금 상위에서 가져온 stockCodes
  const topVolumeStockCodes = (topVolumeThemes ?? [])
    .flatMap((theme) => theme.stocks)
    .map((stock) => stock.stockCode);

  // 테마상승률 상위에서 가져온 stockCodes
  const topChangeRateStockCodes = topThemeStocks
    .flatMap((result) => result.data ?? [])
    .map((stock) => stock.stockCode);

  // 중복을 제거한 모든 stockCodes
  const allStockCodes = [
    ...new Set([...topVolumeStockCodes, ...topChangeRateStockCodes]),
  ];

  // other: 수급 불러오기(기관, 외국인)
  const investorFlowResults = useStockInvestorFlow(allStockCodes);
  // other: 수급 불러오기(프로그램)
  const programFlowResults = useStockProgramFlow(allStockCodes);
  // 수급 로딩
  const supplyLoaded =
    investorFlowResults.every((supply) => !supply.isLoading) &&
    programFlowResults.every((supply) => !supply.isLoading);

  const investorMap = new Map(
    allStockCodes.map((stockCode, i) => [
      stockCode,
      investorFlowResults[i]?.data,
    ]),
  );
  const programMap = new Map(
    allStockCodes.map((code, i) => [code, programFlowResults[i]?.data]),
  );

  // 수급 저장용 데이터 빌드 (실패한 종목은 db 데이터 사용)
  const topVolumeSupply = topVolumeThemes?.map((theme) => ({
    ...theme,
    stocks: theme.stocks.map((stock) => {
      const investor = investorMap.get(stock.stockCode);
      const program = programMap.get(stock.stockCode);
      const investorValid = typeof investor === "object" && investor !== null;
      const programValid = typeof program === "object" && program !== null;
      const dbSupply = dbSupplyData?.topVolumeSupply
        ?.flatMap((t) => t.stocks)
        .find((s) => s.stockCode === stock.stockCode);
      return {
        ...stock,
        institution: investorValid
          ? Number(investor.orgn_ntby_tr_pbmn)
          : dbSupply?.institution,
        foreign: investorValid
          ? Number(investor.frgn_ntby_tr_pbmn)
          : dbSupply?.foreign,
        program: programValid
          ? Number(program.prm_netprps_amt.replace(/^--/, "-"))
          : dbSupply?.program,
      };
    }),
  }));

  const topChangeRateSupply = topChangeRateThemes?.map((theme) => ({
    ...theme,
    stocks: theme.stocks.map((stock) => {
      const investor = investorMap.get(stock.stockCode);
      const program = programMap.get(stock.stockCode);
      const investorValid = typeof investor === "object" && investor !== null;
      const programValid = typeof program === "object" && program !== null;
      const dbSupply = dbSupplyData?.topChangeRateSupply
        ?.flatMap((t) => t.stocks)
        .find((s) => s.stockCode === stock.stockCode);
      return {
        ...stock,
        institution: investorValid
          ? Number(investor.orgn_ntby_tr_pbmn)
          : dbSupply?.institution,
        foreign: investorValid
          ? Number(investor.frgn_ntby_tr_pbmn)
          : dbSupply?.foreign,
        program: programValid
          ? Number(program.prm_netprps_amt.replace(/^--/, "-"))
          : dbSupply?.program,
      };
    }),
  }));

  // 수급 데이터 저장
  useEffect(() => {
    if (!supplyLoaded || allStockCodes.length === 0) return;
    fetch("/api/supply/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topVolumeSupply, topChangeRateSupply }),
    }).then(() => {
      queryClient.invalidateQueries({ queryKey: ["supply-db"] });
    });
  }, [supplyLoaded]);

  // topVolmeThmes에 매핑
  const topVolumeThemesWithSupply = topVolumeThemes?.map((theme) => ({
    ...theme,
    stocks: theme.stocks.map((stock) => ({
      ...stock,
      institution: Number(
        investorMap.get(stock.stockCode)?.orgn_ntby_tr_pbmn ?? 0,
      ),
      foreign: investorMap.get(stock.stockCode)?.frgn_ntby_tr_pbmn ?? "외국인?",
      program: (
        programMap.get(stock.stockCode)?.prm_netprps_amt ?? "sss"
      ).replace(/^--/, "-"),
    })),
  }));

  // topChangeRateThemes에 매핑
  const topChangeRateThemesWithSupply = topChangeRateThemes?.map((theme) => ({
    ...theme,
    stocks: theme.stocks.map((stock) => ({
      ...stock,
      institution: Number(
        investorMap.get(stock.stockCode)?.orgn_ntby_tr_pbmn ?? 0,
      ),
      foreign: Number(investorMap.get(stock.stockCode)?.frgn_ntby_tr_pbmn ?? 0),
      program: (
        programMap.get(stock.stockCode)?.prm_netprps_amt ?? "sss"
      ).replace(/^--/, "-"),
    })),
  }));

  // 6. 로딩 스켈레톤: db없을 때,
  if (!dbThemeData?.topVolumeThemes || !dbSupplyData?.topChangeRateSupply)
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
