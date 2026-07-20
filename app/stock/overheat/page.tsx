"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import RiskIndicator from "@/components/ui/RiskIndicator";

type OverheatResult = {
  stockCode: string;
  isWarning: boolean;
  isDesignated: boolean;
  warningDate?: string;
  riskLevel?: string;
  riskMargin?: number;
};

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
      const res = await fetch(
        `/api/kiwoom/stock-daily-detail?stockCode=${stockCode}`,
      );
      if (!res.ok) throw new Error("조회에 실패했습니다");
      setResult(await res.json());
    } catch {
      setError("조회에 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto px-6 py-8">
      <h1 className="text-lg font-semibold text-text mb-6">
        단기과열 종목 조회
      </h1>

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

      {error && <p className="text-sm text-red-500">{error}</p>}

      {result && (
        <div className="rounded-lg border border-border bg-surface p-4 text-sm text-text space-y-1">
          <p>종목코드: {result.stockCode}</p>
          <p>단기과열지정예고: {result.isWarning ? "해당" : "해당 없음"}</p>
          <p>단기과열지정: {result.isDesignated ? "해당" : "해당 없음"}</p>
          {result.warningDate && <p>예고일: {result.warningDate}</p>}
          {result.riskLevel && (
            <div className="flex items-center gap-2">
              <span>위험도:</span>
              <RiskIndicator
                level={
                  result.riskLevel as "매우위험" | "위험" | "주의" | "안전"
                }
              />
              {result.riskMargin !== undefined && (
                <span className="text-text-secondary">
                  (오차범위 {result.riskMargin.toFixed(1)}% 내외)
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
