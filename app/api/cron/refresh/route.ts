import { NextResponse } from "next/server";
import { kiwoomFetch } from "@/server/kiwoom/kiwoomFetcher";
import { hankukFetch } from "@/server/hankuk/hankukFetcher";
import {
  KiwoomThemeGroupResponse,
  KiwoomThemeStockResponse,
  KiwoomTopVolumeResponse,
  KiwoomDailyTradeDetailResponse,
  ProgramFlowResponse,
} from "@/server/kiwoom/types";
import { InvestorFlowItem } from "@/server/hankuk/types";
import { Theme, themeStock, stockTopVolume } from "@/features/themes/types";
import { buildTopVolumeThemes } from "@/features/themes/utils/buildTopVolumeThemes";
import { buildTopChangeRateThemes } from "@/features/themes/utils/buildTopChangeRateThemes";
import { buildVolumeMap } from "@/features/themes/utils/buildVolumeMap";
import { buildSupplyMap } from "@/features/themes/utils/buildSupplyMap";
import { buildSupplyThemes } from "@/features/themes/utils/buildSupplyThemes";
import { prisma } from "@/lib/prisma";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
const today = () => new Date().toISOString().slice(0, 10).replace(/-/g, "");

export async function refreshThemesData() {
  const date = today();

  // 1. 전체 테마 목록
  const themesRaw = await kiwoomFetch<KiwoomThemeGroupResponse>(
    "/api/dostk/thme",
    "ka90001",
    { qry_tp: "0", date_tp: "0", flu_pl_amt_tp: "3", stex_tp: "3" },
  );
  const themes: Theme[] = themesRaw.thema_grp.map((t) => ({
    themeId: t.thema_grp_cd,
    themeName: t.thema_nm,
    themeChangeRate: parseFloat(t.flu_rt),
  }));

  // 2. 전체 테마별 종목 (100ms 간격 병렬)
  const allStocksResults = await Promise.allSettled(
    themes.map(async (theme, i) => {
      await delay(i * 100);
      const data = await kiwoomFetch<KiwoomThemeStockResponse>(
        "/api/dostk/thme",
        "ka90002",
        { stk_cd: "2", thema_grp_cd: theme.themeId, stex_tp: "3" },
      );
      return data.thema_comp_stk.map((s): themeStock => ({
        themeName: theme.themeName,
        themeId: theme.themeId,
        stockCode: s.stk_cd,
        stockName: s.stk_nm,
        price: Math.abs(parseFloat(s.cur_prc)),
        changeRate: parseFloat(s.flu_rt),
      }));
    }),
  );
  const allStocks = allStocksResults.map((r) =>
    r.status === "fulfilled" ? r.value : [],
  );

  // 3. 거래대금 상위 종목
  const topVolumeRaw = await kiwoomFetch<KiwoomTopVolumeResponse>(
    "/api/dostk/rkinfo",
    "ka10032",
    { mrkt_tp: "000", mang_stk_incls: "0", stex_tp: "3" },
  );
  const topVolume: stockTopVolume[] = topVolumeRaw.trde_prica_upper.map(
    (s) => ({ stockCode: s.stk_cd, volume: s.trde_prica }),
  );

  // 4. 거래대금 상위 테마 빌드
  const topVolumeThemes = buildTopVolumeThemes({ themes, allStocks, topVolume });

  // 5. 상승률 상위 10개 테마 종목
  const topRateThemes = themes.slice(0, 10);
  const topThemeStocksResults = await Promise.allSettled(
    topRateThemes.map(async (theme, i) => {
      await delay(i * 100);
      const data = await kiwoomFetch<KiwoomThemeStockResponse>(
        "/api/dostk/thme",
        "ka90002",
        { stk_cd: "2", thema_grp_cd: theme.themeId, stex_tp: "3" },
      );
      return data.thema_comp_stk.map((s): themeStock => ({
        themeName: theme.themeName,
        themeId: theme.themeId,
        stockCode: s.stk_cd,
        stockName: s.stk_nm,
        price: Math.abs(parseFloat(s.cur_prc)),
        changeRate: parseFloat(s.flu_rt),
      }));
    }),
  );
  const topThemeStocksData = topThemeStocksResults.map((r) =>
    r.status === "fulfilled" ? r.value : [],
  );

  // 6. 상위 10개 테마 종목별 거래대금
  const uniqueTopStockCodes = [
    ...new Set(topThemeStocksData.flat().map((s) => s.stockCode)),
  ];
  const volumeResults = await Promise.allSettled(
    uniqueTopStockCodes.map(async (stockCode, i) => {
      await delay(i * 100);
      const data = await kiwoomFetch<KiwoomDailyTradeDetailResponse>(
        "/api/dostk/stkinfo",
        "ka10015",
        { stk_cd: stockCode, strt_dt: date },
      );
      if (!data.daly_trde_dtl?.[0]) return "실패" as const;
      return { stockCode, volume: Number(data.daly_trde_dtl[0].trde_prica) };
    }),
  );
  const volumeData = volumeResults.map((r) =>
    r.status === "fulfilled" ? r.value : ("실패" as const),
  );
  const volumeDataMap = buildVolumeMap({
    uniqueStockCodes: uniqueTopStockCodes,
    volumeData,
  });

  // 7. 상승률 상위 테마 빌드
  const topChangeRateThemes = buildTopChangeRateThemes(
    topRateThemes,
    topThemeStocksData,
    volumeDataMap,
    [],
  );

  // 8. 수급 데이터 (기관/외국인 + 프로그램)
  const allStockCodes = [
    ...new Set([
      ...topVolumeThemes.flatMap((t) => t.stocks.map((s) => s.stockCode)),
      ...topThemeStocksData.flat().map((s) => s.stockCode),
    ]),
  ];

  const [investorResults, programResults] = await Promise.all([
    Promise.allSettled(
      allStockCodes.map(async (stockCode, i) => {
        await delay(i * 150);
        const data = await hankukFetch<{ output: InvestorFlowItem[] }>(
          "GET",
          "/uapi/domestic-stock/v1/quotations/inquire-investor",
          "FHKST01010900",
          { FID_COND_MRKT_DIV_CODE: "UN", FID_INPUT_ISCD: stockCode },
        );
        return data.output?.[0] ?? undefined;
      }),
    ),
    Promise.allSettled(
      allStockCodes.map(async (stockCode, i) => {
        await delay(i * 150 + 75);
        const data = await kiwoomFetch<ProgramFlowResponse>(
          "/api/dostk/mrkcond",
          "ka90013",
          { amt_qty_tp: "1", stk_cd: stockCode, date },
        );
        return data.stk_daly_prm_trde_trnsn?.[0] ?? undefined;
      }),
    ),
  ]);

  const { investorMap, programMap } = buildSupplyMap({
    stockCodes: allStockCodes,
    investorDataList: investorResults.map((r) =>
      r.status === "fulfilled" ? r.value : undefined,
    ),
    programDataList: programResults.map((r) =>
      r.status === "fulfilled" ? r.value : undefined,
    ),
  });

  const emptyMap = new Map<string, themeStock>();
  const topVolumeSupply = buildSupplyThemes({
    themes: topVolumeThemes,
    investorMap,
    programMap,
    dbStockMap: emptyMap,
  });
  const topChangeRateSupply = buildSupplyThemes({
    themes: topChangeRateThemes,
    investorMap,
    programMap,
    dbStockMap: emptyMap,
  });

  // 9. DB 저장
  await Promise.all([
    prisma.todaysTheme.upsert({
      where: { date_type: { date, type: "topVolumeThemes" } },
      update: { data: JSON.parse(JSON.stringify(topVolumeThemes)) },
      create: { date, type: "topVolumeThemes", data: JSON.parse(JSON.stringify(topVolumeThemes)) },
    }),
    prisma.todaysTheme.upsert({
      where: { date_type: { date, type: "topChangeRateThemes" } },
      update: { data: JSON.parse(JSON.stringify(topChangeRateThemes)) },
      create: { date, type: "topChangeRateThemes", data: JSON.parse(JSON.stringify(topChangeRateThemes)) },
    }),
    prisma.todaysSupply.upsert({
      where: { date_type: { date, type: "topVolumeSupply" } },
      update: { data: JSON.parse(JSON.stringify(topVolumeSupply)) },
      create: { date, type: "topVolumeSupply", data: JSON.parse(JSON.stringify(topVolumeSupply)) },
    }),
    prisma.todaysSupply.upsert({
      where: { date_type: { date, type: "topChangeRateSupply" } },
      update: { data: JSON.parse(JSON.stringify(topChangeRateSupply)) },
      create: { date, type: "topChangeRateSupply", data: JSON.parse(JSON.stringify(topChangeRateSupply)) },
    }),
  ]);

  return { ok: true, themes: themes.length, topVolumeThemes: topVolumeThemes.length };
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await refreshThemesData();
    return NextResponse.json(result);
  } catch (err) {
    console.error("[cron/refresh] error:", err);
    return NextResponse.json({ error: "refresh failed" }, { status: 500 });
  }
}
