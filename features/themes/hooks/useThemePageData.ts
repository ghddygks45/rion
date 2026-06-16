import { useVolume } from "@/features/stock-detail/hooks/useVolume";
import { useAllThemeStocks } from "../hooks/useAllThemeStocks";
import { useStockTopVolume } from "../hooks/useStockTopVolume";
import { useThemes } from "../hooks/useThemes";
import { useTopThemeStocks } from "../hooks/useTopThemeStocks";
import { buildTopVolumeThemes } from "../utils/buildTopVolumeThemes";
import { buildVolumeMap } from "../utils/buildVolumeMap";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTodayThemesFromDB } from "../hooks/useTodayThemesFromDB";
import { buildTopChangeRateThemes } from "../utils/buildTopChangeRateThemes";
import { useStockInvestorFlow } from "../hooks/useStockInvestorFlow";
import { useStockProgramFlow } from "../hooks/useStockProgramFlow";
import { buildSupplyMap } from "../utils/buildSupplyMap";
import { useTodaySupplyFromDB } from "../hooks/useTodaySupplyFromDB";
import { buildSupplyThemes } from "../utils/buildSupplyThemes";

export function useThemePageData() {
  const { data: dbThemeData } = useTodayThemesFromDB();
  const { data: dbSupplyData } = useTodaySupplyFromDB();

  // *********************************************************

  const { data: themes } = useThemes();
  const { data: allStockResults } = useAllThemeStocks(themes ?? []);
  const { data: topVolume, dataUpdatedAt: themesUpdatedAt } =
    useStockTopVolume();

  const allStocksData = allStockResults.map((query) => query.data ?? []);

  // *********************************************************
  // 거래대금 상위 테마 로직
  const topVolumeThemes = buildTopVolumeThemes({
    themes: themes ?? [],
    allStocks: allStocksData,
    topVolume: topVolume ?? [],
  });

  // **************************************************
  // 테마 상승률 상위 종목들 거래대금 Map 만들기
  const topRateThemes = themes?.slice(0, 10);
  const topThemeStocks = useTopThemeStocks(topRateThemes ?? []);

  const stockCodes = topThemeStocks
    .flatMap((result) => result.data ?? [])
    .map((stock) => stock.stockCode);
  const uniqueStockCodes = [...new Set(stockCodes)];
  const { data: volumeDataResults, allSuccess: allvolumeSuccess } =
    useVolume(stockCodes);

  const volumeData = volumeDataResults.map((query) => query.data);
  const volumeDataMap = buildVolumeMap({
    uniqueStockCodes,
    volumeData,
  });

  // **************************************************
  // 테마 상승률 상위 로직
  const topThemeStocksData = topThemeStocks.map((query) => query.data ?? []);

  const topChangeRateThemes = buildTopChangeRateThemes(
    topRateThemes ?? [],
    topThemeStocksData,
    volumeDataMap,
    dbThemeData?.topChangeRateThemes ?? [],
  );

  // **************************************************
  // 로딩 & 오늘의 테마 상승률 로직 db저장
  const allLoaded =
    allStockResults.every((query) => !query.isLoading) &&
    !!topVolume &&
    volumeDataResults.every((query) => !query.isLoading);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!allLoaded || topVolumeThemes.length === 0) return;
    fetch("/api/themes/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topVolumeThemes, topChangeRateThemes }),
    }).then(() => {
      queryClient.invalidateQueries({ queryKey: ["themes-db"] });
    });
  }, [allLoaded, themesUpdatedAt]);

  // **************************************************
  // 수급 불러오기

  const topVolumeStockCodes = topVolumeThemes
    .flatMap((theme) => theme.stocks)
    .map((stock) => stock.stockCode);
  const topChangeRateStockCodes = topThemeStocks
    .flatMap((result) => result.data ?? [])
    .map((stock) => stock.stockCode);
  // 중복을 제거한 모든 stockCodes
  const allStockCodes = [
    ...new Set([...topVolumeStockCodes, ...topChangeRateStockCodes]),
  ];

  const {
    data: investorFlowResults,
    allSuccess: allInvestorFlowSuccess,
    failedCodes,
  } = useStockInvestorFlow(allStockCodes);
  console.log("최종 실패 코드", failedCodes);
  console.log("investorFlowResults", allInvestorFlowSuccess);

  const { data: programFlowResults } = useStockProgramFlow(allStockCodes);

  const { investorMap, programMap } = buildSupplyMap({
    stockCodes: allStockCodes,
    investorDataList: investorFlowResults.map((query) => query.data),
    programDataList: programFlowResults.map((query) => query.data),
  });

  // ***********************************************************

  // DB 폴백용 Map
  const dbVolumeStockMap = new Map(
    (dbSupplyData?.topVolumeSupply ?? [])
      .flatMap((theme) => theme.stocks)
      .map((stock) => [stock.stockCode, stock]),
  );
  const dbChangeRateStockMap = new Map(
    (dbSupplyData?.topChangeRateSupply ?? [])
      .flatMap((theme) => theme.stocks)
      .map((stock) => [stock.stockCode, stock]),
  );

  // 거래대금 상위 수급 데이터 db와 비교 후 업데이트
  const topVolumeSupply = buildSupplyThemes({
    themes: topVolumeThemes,
    investorMap,
    programMap,
    dbStockMap: dbVolumeStockMap,
  });

  // 상승률 상위 수급 데이터 db와 비교 후 업데이트
  const topChangeRateSupply = buildSupplyThemes({
    themes: topChangeRateThemes,
    investorMap,
    programMap,
    dbStockMap: dbChangeRateStockMap,
  });

  //***************************************************************
  // 로딩 & 수급데이터 로직 db저장
  const supplyLoaded =
    investorFlowResults.every((queryResult) => !queryResult.isLoading) &&
    programFlowResults.every((queryResult) => !queryResult.isLoading);

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

  //***************************************************************
  // 자동갱신 (2분 주기)
  const STALE_MS = 10000 * 60 * 1000000;
  const dbDataExists = dbThemeData?.topVolumeThemes != null;

  useEffect(() => {
    if (!dbDataExists) return;
    const id = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["themes"] });
      queryClient.invalidateQueries({ queryKey: ["themestocks"] });
      queryClient.invalidateQueries({ queryKey: ["topVolume"] });
      queryClient.invalidateQueries({ queryKey: ["stockInvestorFlow"] });
      queryClient.invalidateQueries({ queryKey: ["stockProgramFlow"] });
    }, STALE_MS);
    return () => clearInterval(id);
  }, [queryClient, dbDataExists]);

  return {
    dbThemeData,
    dbSupplyData,
    isLoading:
      !dbThemeData?.topVolumeThemes || !dbSupplyData?.topChangeRateSupply,
  };
}
