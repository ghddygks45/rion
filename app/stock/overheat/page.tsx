"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import RiskIndicator from "@/components/ui/RiskIndicator";
import { RISK_LEVELS } from "@/server/kiwoom/risk/riskLevels";
import { RiskCategoryResult } from "@/server/kiwoom/risk/types";

type OverheatResult = {
  stockCode: string;
  categories: RiskCategoryResult[];
};

type StockSearchResult = {
  code: string;
  name: string;
  marketName: string;
};

function StatusText({ met }: { met: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {met && <span className="w-2 h-2 rounded-full bg-red-600" />}
      {met ? "해당" : "해당 없음"}
    </span>
  );
}

function ShortTermOverheatingCard({ result }: { result: RiskCategoryResult }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 text-sm text-text space-y-1">
      <p className="font-medium">단기과열</p>
      <p>
        지정예고: <StatusText met={!!result.isWarning} />
      </p>
      <p>
        지정: <StatusText met={result.isDesignated} />
      </p>
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
      <p>
        지정예고[투자주의]: <StatusText met={!!result.isWarning} />
      </p>
      <p>
        지정: <StatusText met={result.isDesignated} />
      </p>
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
      <p>
        지정예고: <StatusText met={!!result.isWarning} />
      </p>
      <p>
        지정: <StatusText met={result.isDesignated} />
      </p>
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
  const [query, setQuery] = useState("");
  const [selectedStockCode, setSelectedStockCode] = useState<string | null>(
    null,
  );
  const [suggestions, setSuggestions] = useState<StockSearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [result, setResult] = useState<OverheatResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const isRawCode = /^\d{6}$/.test(query);

  useEffect(() => {
    itemRefs.current[highlightedIndex]?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const res = await fetch(
        `/api/stocks/search?q=${encodeURIComponent(query)}`,
      );
      if (!res.ok) return;
      const data = await res.json();
      setSuggestions(data.results ?? []);
      setHighlightedIndex(-1);
    }, 250);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const fetchRisk = async (stockCode: string) => {
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

  const handleSelect = (stock: StockSearchResult) => {
    setQuery(stock.name);
    setSelectedStockCode(stock.code);
    setSuggestions([]);
    setShowSuggestions(false);
    fetchRisk(stock.code);
  };

  const handleSearch = () => {
    const stockCode = selectedStockCode ?? (isRawCode ? query : null);
    if (!stockCode) {
      setError("종목명을 검색해서 선택하거나 종목코드 6자리를 입력해주세요");
      return;
    }
    fetchRisk(stockCode);
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

      <div className="relative mb-6">
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedStockCode(null);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
            onKeyDown={(e) => {
              const hasSuggestions = showSuggestions && suggestions.length > 0;

              if (e.key === "ArrowDown") {
                if (!hasSuggestions) return;
                e.preventDefault();
                setHighlightedIndex((i) =>
                  Math.min(i + 1, suggestions.length - 1),
                );
              } else if (e.key === "ArrowUp") {
                if (!hasSuggestions) return;
                e.preventDefault();
                setHighlightedIndex((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter") {
                if (hasSuggestions && highlightedIndex >= 0) {
                  e.preventDefault();
                  handleSelect(suggestions[highlightedIndex]);
                } else {
                  handleSearch();
                }
              }
            }}
            placeholder="종목명 또는 종목코드 (예: 삼성전자, 111710)"
            className="flex-1 px-3 py-2 rounded-lg border border-border bg-surface text-text text-sm"
          />
          <Button onClick={handleSearch} disabled={loading || !query}>
            검색
          </Button>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-10 top-full left-0 right-0 mt-1 rounded-lg border border-border bg-surface shadow-md max-h-60 overflow-auto">
            {suggestions.map((s, i) => (
              <li key={s.code}>
                <button
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(s)}
                  onMouseEnter={() => setHighlightedIndex(i)}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-left text-sm text-text ${
                    i === highlightedIndex ? "bg-border/50" : ""
                  }`}
                >
                  <span>{s.name}</span>
                  <span className="text-xs text-text-secondary">
                    {s.code} · {s.marketName}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
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
