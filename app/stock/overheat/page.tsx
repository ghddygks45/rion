"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import RiskIndicator from "@/components/ui/RiskIndicator";
import { RISK_LEVELS } from "@/server/kiwoom/risk/riskLevels";
import { RiskCategoryResult } from "@/server/kiwoom/risk/types";

type OverheatResult = {
  stockCode: string;
  categories: RiskCategoryResult[];
};

function ShortTermOverheatingCard({ result }: { result: RiskCategoryResult }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 text-sm text-text space-y-1">
      <p className="font-medium">단기과열</p>
      <p>지정예고: {result.isWarning ? "해당" : "해당 없음"}</p>
      <p>지정: {result.isDesignated ? "해당" : "해당 없음"}</p>
      {result.warningDate && <p>예고일: {result.warningDate}</p>}
      {result.riskLevel && (
        <div className="flex items-center gap-2">
          <span>위험도:</span>
          <RiskIndicator level={result.riskLevel} />
          {result.riskMargin !== undefined && (
            <span className="text-text-secondary">
              (오차범위 {result.riskMargin.toFixed(1)}% 내외)
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function InvestmentWarningCard({ result }: { result: RiskCategoryResult }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 text-sm text-text space-y-1">
      <p className="font-medium">투자경고</p>
      <p>지정예고[투자주의]: {result.isWarning ? "해당" : "해당 없음"}</p>
      <p>지정: {result.isDesignated ? "해당" : "해당 없음"}</p>
      {result.warningDate && <p>예고일: {result.warningDate}</p>}
      {result.riskLevel && (
        <div className="flex items-center gap-2">
          <span>위험도:</span>
          <RiskIndicator level={result.riskLevel} />
          {result.riskMargin !== undefined && (
            <span className="text-text-secondary">
              (오차범위 {result.riskMargin.toFixed(1)}% 내외)
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function InvestmentRiskCard({ result }: { result: RiskCategoryResult }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 text-sm text-text space-y-1">
      <p className="font-medium">투자위험</p>
      <p>지정예고: {result.isWarning ? "해당" : "해당 없음"}</p>
      <p>지정: {result.isDesignated ? "해당" : "해당 없음"}</p>
      {result.warningDate && <p>예고일: {result.warningDate}</p>}
      {result.riskLevel && (
        <div className="flex items-center gap-2">
          <span>위험도:</span>
          <RiskIndicator level={result.riskLevel} />
          {result.riskMargin !== undefined && (
            <span className="text-text-secondary">
              (오차범위 {result.riskMargin.toFixed(1)}% 내외)
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default function StockOverheatPage() {
  const [stockCode, setStockCode] = useState("");
  const [result, setResult] = useState<OverheatResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!stockCode) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/kiwoom/stock-risk?stockCode=${stockCode}`);
      if (!res.ok) throw new Error("조회에 실패했습니다");
      setResult(await res.json());
    } catch {
      setError("조회에 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  const shortTermOverheating = result?.categories.find(
    (c) => c.category === "shortTermOverheating",
  );
  const investmentWarning = result?.categories.find(
    (c) => c.category === "investmentWarning",
  );
  const investmentRisk = result?.categories.find(
    (c) => c.category === "investmentRisk",
  );

  return (
    <main className="max-w-md mx-auto px-6 py-8">
      <h1 className="text-lg font-semibold text-text mb-6">종목 상태 조회</h1>

      <div className="flex gap-2 mb-6">
        <input
          value={stockCode}
          onChange={(e) => setStockCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="종목코드 (예: 111710)"
          className="flex-1 px-3 py-2 rounded-lg border border-border bg-surface text-text text-sm"
        />
        <Button onClick={handleSearch} disabled={loading || !stockCode}>
          검색
        </Button>
      </div>

      <div className="flex flex-col gap-1 mb-6 text-xs text-text-secondary">
        {RISK_LEVELS.map((r, i) => (
          <div key={r.level} className="flex items-center gap-2">
            <RiskIndicator level={r.level} />
            <span>
              {i === RISK_LEVELS.length - 1
                ? "그 미만"
                : `달성률 ${r.minAchievement}% 이상`}
            </span>
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {result && (
        <div className="space-y-3">
          <p className="text-sm text-text">종목코드: {result.stockCode}</p>
          {shortTermOverheating && (
            <ShortTermOverheatingCard result={shortTermOverheating} />
          )}
          {investmentWarning && (
            <InvestmentWarningCard result={investmentWarning} />
          )}
          {investmentRisk && <InvestmentRiskCard result={investmentRisk} />}
        </div>
      )}
    </main>
  );
}
