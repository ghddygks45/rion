export type RiskCategoryResult = {
  category: string; // "shortTermOverheating" 등
  isWarning?: boolean; // 예고 단계가 있는 카테고리만
  isDesignated: boolean;
  warningDate?: string;
  riskLevel?: "매우위험" | "위험" | "주의" | "안전";
  riskMargin?: number;
};
