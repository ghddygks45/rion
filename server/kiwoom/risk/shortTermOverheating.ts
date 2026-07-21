import { KiwoomDailyTradeDetail } from "@/server/kiwoom/types";
import { RiskCategoryResult } from "./types";
import { RISK_LEVELS } from "./riskLevels";

// (주가상승률): 당일 종가가 직전 40거래일 종가 평균의 130%이상
const WINDOW_SIZE = 40;
const SURGE_THRESHOLD_RATIO = 1.3;

export function isPriceSurge(dailyData: KiwoomDailyTradeDetail[]) {
  if (dailyData.length < WINDOW_SIZE) return null;

  const window = dailyData.slice(0, WINDOW_SIZE);
  const closes = window.map((d) => Math.abs(parseFloat(d.close_pric)));
  const todayClose = closes[0];
  const avgClose = closes.reduce((sum, c) => sum + c, 0) / WINDOW_SIZE;
  const ratio = todayClose / avgClose;

  return {
    isSurge: ratio >= SURGE_THRESHOLD_RATIO,
    todayClose,
    avgClose,
    ratio,
  };
}

// (주가변동성): 당일을 포함한 최근 2거래일 일별 주가변동성 평균이 직전 40거래일 일별 주가변동성 평균의 150%이상
const RECENT_WINDOW_SIZE = 2;
const VOLATILITY_SURGE_THRESHOLD_RATIO = 1.5;

export function isVolatilitySurge(dailyData: KiwoomDailyTradeDetail[]) {
  if (dailyData.length < WINDOW_SIZE) return null;

  const volatilities = dailyData
    .slice(0, WINDOW_SIZE)
    .map((d) => Math.abs(parseFloat(d.flu_rt)));

  const recentAvgVolatility =
    volatilities.slice(0, RECENT_WINDOW_SIZE).reduce((sum, v) => sum + v, 0) /
    RECENT_WINDOW_SIZE;
  const baseAvgVolatility =
    volatilities.reduce((sum, v) => sum + v, 0) / WINDOW_SIZE;
  const ratio = recentAvgVolatility / baseAvgVolatility;

  return {
    isSurge: ratio >= VOLATILITY_SURGE_THRESHOLD_RATIO,
    recentAvgVolatility,
    baseAvgVolatility,
    ratio,
  };
}

// (거래회전율): 당일을 포함한 최근 2거래일 일별 거래회전율 평균이 직전 40거래일 일별 거래회전율 평균의 600%이상
const TURNOVER_SURGE_THRESHOLD_RATIO = 6.0;

export function isTurnoverSurge(
  dailyData: KiwoomDailyTradeDetail[],
  listedShares: number,
) {
  if (dailyData.length < WINDOW_SIZE) return null;

  const turnoverRates = dailyData
    .slice(0, WINDOW_SIZE)
    .map((d) => (parseFloat(d.trde_qty) / listedShares) * 100);

  const recentAvgTurnover =
    turnoverRates.slice(0, RECENT_WINDOW_SIZE).reduce((sum, t) => sum + t, 0) /
    RECENT_WINDOW_SIZE;
  const baseAvgTurnover =
    turnoverRates.reduce((sum, t) => sum + t, 0) / WINDOW_SIZE;
  const ratio = recentAvgTurnover / baseAvgTurnover;

  return {
    isSurge: ratio >= TURNOVER_SURGE_THRESHOLD_RATIO,
    recentAvgTurnover,
    baseAvgTurnover,
    ratio,
  };
}

/**
 * 단기과열지정예고 여부를 판단한다.
 * 주가상승률/주가변동성/거래회전율 세 조건을 모두 충족하면 예고 대상.
 *
 * @param dailyData 최신순(오늘이 index 0) 일별거래상세 데이터
 * @param listedShares 상장주식수
 * @returns 세 조건 판정 결과와 `isWarning` 종합 여부. 40거래일 데이터가 부족하면 `null`
 */
export function isShortTermOverheatingWarning(
  dailyData: KiwoomDailyTradeDetail[],
  listedShares: number,
) {
  const priceSurge = isPriceSurge(dailyData);
  const volatilitySurge = isVolatilitySurge(dailyData);
  const turnoverSurge = isTurnoverSurge(dailyData, listedShares);

  if (!priceSurge || !volatilitySurge || !turnoverSurge) return null;

  return {
    isWarning:
      priceSurge.isSurge && volatilitySurge.isSurge && turnoverSurge.isSurge,
    priceSurge,
    volatilitySurge,
    turnoverSurge,
  };
}

const MONITOR_WINDOW = 10;

/**
 * 단기과열지정 여부를 판단한다.
 * 지정예고 후 10거래일 이내에 종가가 예고일 종가 이상인 상태로 동일 요건을 재충족하면 지정 대상.
 *
 * @param dailyData 최신순(오늘이 index 0) 일별거래상세 데이터
 * @param listedShares 상장주식수
 * @returns `isDesignated`와, 지정된 경우 근거가 된 예고일(`warningDate`)
 */
export function isShortTermOverheatingDesignated(
  dailyData: KiwoomDailyTradeDetail[],
  listedShares: number,
) {
  const today = isShortTermOverheatingWarning(dailyData, listedShares);
  if (!today?.isWarning) return { isDesignated: false };

  const todayClose = Math.abs(parseFloat(dailyData[0].close_pric));

  for (let i = 1; i <= MONITOR_WINDOW; i++) {
    if (i + WINDOW_SIZE > dailyData.length) break;

    const prior = isShortTermOverheatingWarning(
      dailyData.slice(i),
      listedShares,
    );
    if (!prior?.isWarning) continue;

    const priorClose = Math.abs(parseFloat(dailyData[i].close_pric));
    if (todayClose >= priorClose) {
      return {
        isDesignated: true,
        warningDate: dailyData[i].dt,
      };
    }
  }

  return { isDesignated: false };
}

// 위험도: 세 조건(주가상승률/주가변동성/거래회전율) 중 임계값에 가장 못 미친 조건 기준으로 산정
// (셋 다 충족해야 예고/지정이 되므로, 가장 뒤처진 조건이 전체 위험도의 병목이 됨)
export function getOverheatingRiskLevel(
  dailyData: KiwoomDailyTradeDetail[],
  listedShares: number,
) {
  const priceSurge = isPriceSurge(dailyData);
  const volatilitySurge = isVolatilitySurge(dailyData);
  const turnoverSurge = isTurnoverSurge(dailyData, listedShares);

  if (!priceSurge || !volatilitySurge || !turnoverSurge) return null;

  const achievements = [
    (priceSurge.ratio / SURGE_THRESHOLD_RATIO) * 100,
    (volatilitySurge.ratio / VOLATILITY_SURGE_THRESHOLD_RATIO) * 100,
    (turnoverSurge.ratio / TURNOVER_SURGE_THRESHOLD_RATIO) * 100,
  ];
  const minAchievement = Math.min(...achievements);
  const margin = Math.max(0, 100 - minAchievement);

  const level =
    RISK_LEVELS.find((r) => minAchievement >= r.minAchievement)?.level ??
    "안전";

  return {
    level,
    margin,
    minAchievement,
  };
}

export function evaluateShortTermOverheating(
  dailyData: KiwoomDailyTradeDetail[],
  listedShares: number,
): RiskCategoryResult {
  const warning = isShortTermOverheatingWarning(dailyData, listedShares);
  const designation = isShortTermOverheatingDesignated(dailyData, listedShares);

  const isConfirmed = (warning?.isWarning ?? false) || designation.isDesignated;
  const risk = isConfirmed
    ? null
    : getOverheatingRiskLevel(dailyData, listedShares);

  return {
    category: "shortTermOverheating",
    isWarning: warning?.isWarning ?? false,
    isDesignated: designation.isDesignated,
    warningDate: designation.isDesignated ? designation.warningDate : undefined,
    riskLevel: risk?.level,
    riskMargin: risk && risk.level !== "안전" ? risk.margin : undefined,
  };
}
