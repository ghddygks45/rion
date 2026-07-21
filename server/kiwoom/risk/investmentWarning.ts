import { KiwoomDailyPrice } from "@/server/kiwoom/types";
import { IndustryDailyIndexItem } from "@/server/hankuk/types";
import { RiskCategoryResult } from "./types";
import { RISK_LEVELS } from "./riskLevels";

// 두 데이터 소스(dailyPrice, industryIndex) 모두 최신순(index 0 = 오늘) 기준
const T5_INDEX = 5;

// 1) 판단일(T) 종가가 T-5 종가보다 60% 이상 상승
const T5_SURGE_THRESHOLD_RATIO = 1.6;

export function isPriceSurgeFromT5(dailyPrice: KiwoomDailyPrice[]) {
  if (dailyPrice.length <= T5_INDEX) return null;

  const closeT = Math.abs(parseFloat(dailyPrice[0].close_pric));
  const closeT5 = Math.abs(parseFloat(dailyPrice[T5_INDEX].close_pric));
  const ratio = closeT / closeT5;

  return {
    isMet: ratio >= T5_SURGE_THRESHOLD_RATIO,
    closeT,
    closeT5,
    ratio,
  };
}

// 2) 판단일(T) 종가가 당일을 포함한 최근 15일 종가 중 최고가
const RECENT_HIGH_WINDOW = 15;

export function isRecentHighClose(dailyPrice: KiwoomDailyPrice[]) {
  if (dailyPrice.length < RECENT_HIGH_WINDOW) return null;

  const closes = dailyPrice
    .slice(0, RECENT_HIGH_WINDOW)
    .map((d) => Math.abs(parseFloat(d.close_pric)));
  const closeT = closes[0];
  const highestClose = Math.max(...closes);

  return {
    isMet: closeT >= highestClose,
    closeT,
    highestClose,
  };
}

// 3) T-5 대비 종목 상승률이 같은 기간 종합주가지수 상승률의 5배 이상
const OUTPERFORM_MULTIPLE = 5;

export function isOutperformingIndex5x(
  dailyPrice: KiwoomDailyPrice[],
  industryIndex: IndustryDailyIndexItem[],
) {
  if (dailyPrice.length <= T5_INDEX || industryIndex.length <= T5_INDEX) {
    return null;
  }

  const closeT = Math.abs(parseFloat(dailyPrice[0].close_pric));
  const closeT5 = Math.abs(parseFloat(dailyPrice[T5_INDEX].close_pric));
  const stockReturn = (closeT - closeT5) / closeT5;

  const indexT = parseFloat(industryIndex[0].bstp_nmix_prpr);
  const indexT5 = parseFloat(industryIndex[T5_INDEX].bstp_nmix_prpr);
  const indexReturn = (indexT - indexT5) / indexT5;

  return {
    isMet: stockReturn >= indexReturn * OUTPERFORM_MULTIPLE,
    stockReturn,
    indexReturn,
  };
}

/**
 * 투자경고종목지정예고 여부를 판단한다.
 * 위 세 조건(T-5 대비 60%↑ / 최근 15일 최고종가 / 지수 대비 5배↑)을 모두 충족하면 예고 대상.
 *
 * @param dailyPrice 최신순(오늘이 index 0) 일별주가 데이터
 * @param industryIndex 최신순(오늘이 index 0) 종합주가지수 일별 데이터
 */
export function isInvestmentWarningNotice(
  dailyPrice: KiwoomDailyPrice[],
  industryIndex: IndustryDailyIndexItem[],
) {
  const priceSurge = isPriceSurgeFromT5(dailyPrice);
  const recentHigh = isRecentHighClose(dailyPrice);
  const outperform = isOutperformingIndex5x(dailyPrice, industryIndex);

  console.log("1) isPriceSurgeFromT5:", priceSurge);
  console.log("2) isRecentHighClose:", recentHigh);
  console.log("3) isOutperformingIndex5x:", outperform);

  if (!priceSurge || !recentHigh || !outperform) return null;

  return {
    isWarning: priceSurge.isMet && recentHigh.isMet && outperform.isMet,
    priceSurge,
    recentHigh,
    outperform,
  };
}

// 투자경고종목지정: 지정예고 다음날부터 10거래일 이내에 동일 요건을 재충족
const MONITOR_WINDOW = 10;

/**
 * 투자경고종목지정 여부를 판단한다.
 * 오늘 지정예고 요건을 충족한 상태에서, 그 이전 10거래일 이내에 같은 요건을 충족한 날(최초 예고일)이 있으면 지정 대상.
 *
 * @param dailyPrice 최신순(오늘이 index 0) 일별주가 데이터
 * @param industryIndex 최신순(오늘이 index 0) 종합주가지수 일별 데이터
 */
export function isInvestmentWarningDesignated(
  dailyPrice: KiwoomDailyPrice[],
  industryIndex: IndustryDailyIndexItem[],
) {
  const today = isInvestmentWarningNotice(dailyPrice, industryIndex);
  if (!today?.isWarning) return { isDesignated: false };

  for (let i = 1; i <= MONITOR_WINDOW; i++) {
    const prior = isInvestmentWarningNotice(
      dailyPrice.slice(i),
      industryIndex.slice(i),
    );
    if (prior?.isWarning) {
      return { isDesignated: true, noticeDate: dailyPrice[i].date };
    }
  }

  return { isDesignated: false };
}

// 위험도: 세 조건 중 임계값에 가장 못 미친 조건 기준으로 산정
export function getInvestmentWarningRiskLevel(
  dailyPrice: KiwoomDailyPrice[],
  industryIndex: IndustryDailyIndexItem[],
) {
  const priceSurge = isPriceSurgeFromT5(dailyPrice);
  const recentHigh = isRecentHighClose(dailyPrice);
  const outperform = isOutperformingIndex5x(dailyPrice, industryIndex);

  if (!priceSurge || !recentHigh || !outperform) return null;

  // 조건3은 기준값(indexReturn * 5)이 0 이하일 수 있어 단순 비율로 못 씀 —
  // 기준값이 0 이하면 충족 여부로만 100/0 처리
  const requiredStockReturn = outperform.indexReturn * OUTPERFORM_MULTIPLE;
  const outperformAchievement =
    requiredStockReturn <= 0
      ? outperform.stockReturn >= requiredStockReturn
        ? 100
        : 0
      : (outperform.stockReturn / requiredStockReturn) * 100;

  const achievements = [
    (priceSurge.ratio / T5_SURGE_THRESHOLD_RATIO) * 100,
    (recentHigh.closeT / recentHigh.highestClose) * 100,
    outperformAchievement,
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

export function evaluateInvestmentWarning(
  dailyPrice: KiwoomDailyPrice[],
  industryIndex: IndustryDailyIndexItem[],
): RiskCategoryResult {
  const notice = isInvestmentWarningNotice(dailyPrice, industryIndex);
  const designation = isInvestmentWarningDesignated(dailyPrice, industryIndex);

  const isConfirmed = (notice?.isWarning ?? false) || designation.isDesignated;
  const risk = isConfirmed
    ? null
    : getInvestmentWarningRiskLevel(dailyPrice, industryIndex);

  return {
    category: "investmentWarning",
    isWarning: notice?.isWarning ?? false,
    isDesignated: designation.isDesignated,
    warningDate: designation.isDesignated ? designation.noticeDate : undefined,
    riskLevel: risk?.level,
    riskMargin: risk && risk.level !== "안전" ? risk.margin : undefined,
  };
}
