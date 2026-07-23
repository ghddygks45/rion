"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import RiskIndicator from "@/components/ui/RiskIndicator";
import Title from "@/components/ui/Title";
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

type CategoryKey =
  | "shortTermOverheating"
  | "investmentWarning"
  | "investmentRisk";

const CATEGORY_META: Record<
  CategoryKey,
  { label: string; description: string }
> = {
  shortTermOverheating: {
    label: "단기과열",
    description: "최근 며칠간 주가·거래량이 비정상적으로 급등한 경우",
  },
  investmentWarning: {
    label: "투자경고",
    description: "단기과열 지정 이후에도 과열이 계속되는 경우",
  },
  investmentRisk: {
    label: "투자위험",
    description: "투자경고 이후에도 이상 급등이 지속되는 가장 높은 단계",
  },
};

type Tone = {
  card: string;
  badge: string;
  badgeText: string | null;
};

function getTone(result: RiskCategoryResult): Tone {
  if (result.isDesignated) {
    return {
      card: "border-red-600 bg-red-600/10 dark:bg-red-600/15",
      badge: "bg-red-600 text-white",
      badgeText: "지정됨",
    };
  }
  if (result.isWarning) {
    return {
      card: "border-amber-400 bg-amber-400/10 dark:bg-amber-400/15",
      badge: "bg-amber-400 text-amber-950",
      badgeText: "지정예고",
    };
  }
  return {
    card: "border-border bg-surface",
    badge: "",
    badgeText: null,
  };
}

function WarningIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path
        d="M12 4.5 21 19.5H3L12 4.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M12 10v4.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="17.2" r="1" fill="currentColor" />
    </svg>
  );
}

function StatusRow({ label, met }: { label: string; met: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-text-secondary">{label}</span>
      <span className="inline-flex items-center gap-1.5">
        <span
          className={`inline-block h-2 w-2 rounded-full ${met ? "bg-red-600" : "bg-border"}`}
        />
        {met ? "해당" : "해당 없음"}
      </span>
    </div>
  );
}

function ResultCard({ result }: { result: RiskCategoryResult }) {
  const meta = CATEGORY_META[result.category as CategoryKey];
  const tone = getTone(result);

  if (!meta) return null;

  return (
    <div className={`rounded-lg border-2 p-5 ${tone.card}`}>
      <div className="mb-1 flex items-center justify-between gap-2">
        <p className="font-semibold text-text">{meta.label}</p>
        {tone.badgeText && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${tone.badge}`}
          >
            <WarningIcon className="h-3 w-3" />
            {tone.badgeText}
          </span>
        )}
      </div>
      <p className="mb-4 text-xs text-text-secondary">{meta.description}</p>

      <div className="space-y-2 text-sm text-text">
        <StatusRow label="지정예고" met={!!result.isWarning} />
        <StatusRow label="지정" met={result.isDesignated} />
        {result.warningDate && (
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">예고일</span>
            <span>{result.warningDate}</span>
          </div>
        )}
        {result.riskLevel && (
          <div className="flex items-center justify-between pt-1">
            <RiskIndicator level={result.riskLevel} />
            {result.riskMargin !== undefined && (
              <span className="text-xs text-text-secondary">
                (오차범위 {result.riskMargin.toFixed(1)}% 내외)
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {(Object.keys(CATEGORY_META) as CategoryKey[]).map((key) => (
        <div
          key={key}
          className="rounded-lg border border-border bg-surface p-5"
        >
          <p className="mb-1 font-semibold text-text">
            {CATEGORY_META[key].label}
          </p>
          <p className="text-xs text-text-secondary">
            {CATEGORY_META[key].description}
          </p>
        </div>
      ))}
    </div>
  );
}

type Severity = "none" | "warning" | "severe";

type LevelInfo = {
  label: string;
  severity: Severity;
  sanction: string;
  description: React.ReactNode;
};

const LEVEL_GUIDE: LevelInfo[] = [
  {
    label: "투자주의",
    severity: "none",
    sanction: "없음",
    description:
      "이상급등·이상거래가 발생해 투자에 주의가 필요한 종목입니다. 거래방식은 평소와 동일합니다.",
  },
  {
    label: "투자경고 지정예고",
    severity: "warning",
    sanction: "없음",
    description:
      "투자경고 지정 직전 단계입니다. 다음 거래일부터 투자경고 지정 여부를 매일 판단하므로 주가 변동성과 투자위험이 크게 높아질 수 있습니다.",
  },
  {
    label: "투자경고",
    severity: "none",
    sanction: "없음",
    description:
      "투자주의보다 한 단계 높은 시장경보입니다. 거래는 동일하지만 투자위험 지정 대상이 되어 추가 제재 가능성이 커집니다.",
  },
  {
    label: "투자위험 지정예고",
    severity: "warning",
    sanction: "없음",
    description:
      "투자위험 지정 직전 단계입니다. 다음 거래일 투자위험으로 지정되면 매매거래정지 대상이 될 수 있으므로 각별한 주의가 필요합니다.",
  },
  {
    label: "투자위험",
    severity: "severe",
    sanction: "매우 큼",
    description: (
      <>
        시장경보 최고 단계입니다.{" "}
        <strong className="font-semibold text-text">
          매매거래정지(1일 이상)
        </strong>
        가 예고·실시될 수 있는 가장 강력한 시장경보입니다.
      </>
    ),
  },
  {
    label: "단기과열 지정예고",
    severity: "warning",
    sanction: "없음",
    description:
      "단기과열종목 지정 직전 단계입니다. 지정되면 30분 단일가매매가 적용될 수 있어 단기 매매에 큰 영향을 줍니다.",
  },
  {
    label: "단기과열종목 지정",
    severity: "severe",
    sanction: "매우 큼",
    description: (
      <>
        <strong className="font-semibold text-text">
          3거래일간 30분 단일가매매
        </strong>
        가 적용됩니다. 일반 연속매매가 불가능해져 체결 방식이 크게 변경됩니다.
      </>
    ),
  },
];

function getSeverityTone(severity: Severity) {
  if (severity === "severe") {
    return {
      border: "border-red-600",
      tint: "bg-red-600/10 dark:bg-red-600/15",
      badge: "bg-red-600 text-white",
    };
  }
  if (severity === "warning") {
    return {
      border: "border-amber-400",
      tint: "bg-amber-400/10 dark:bg-amber-400/15",
      badge: "bg-amber-400 text-amber-950",
    };
  }
  return {
    border: "border-border",
    tint: "",
    badge: "bg-border text-text-secondary",
  };
}

function LevelGuideSection() {
  return (
    <section>
      <div className="mb-6 max-w-xl">
        <Title level={2}>시장경보 단계별 기준</Title>
        <p className="mt-1.5 text-sm text-text-secondary">
          단계가 높아질수록 실제 거래에 영향을 주는 제재(매매정지·단일가매매)가
          강해집니다.
        </p>
      </div>

      {/* PC: 표 */}
      <div className="hidden overflow-hidden rounded-lg border border-border md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-surface text-text-secondary">
              <th className="whitespace-nowrap px-4 py-3 font-medium">구분</th>
              <th className="whitespace-nowrap px-4 py-3 font-medium">
                실제 제재
              </th>
              <th className="px-4 py-3 font-medium">설명</th>
            </tr>
          </thead>
          <tbody>
            {LEVEL_GUIDE.map((lv) => {
              const tone = getSeverityTone(lv.severity);
              return (
                <tr
                  key={lv.label}
                  className={`border-b border-border last:border-0 ${tone.tint}`}
                >
                  <td className="whitespace-nowrap px-4 py-3 align-top font-medium text-text">
                    {lv.label}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 align-top">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${tone.badge}`}
                    >
                      {lv.sanction}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top leading-relaxed text-text-secondary">
                    {lv.description}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 모바일: 표는 잘리기 쉬워서 카드 리스트로 대체 */}
      <div className="space-y-3 md:hidden">
        {LEVEL_GUIDE.map((lv) => {
          const tone = getSeverityTone(lv.severity);
          return (
            <div
              key={lv.label}
              className={`rounded-lg border-2 p-4 ${tone.border} ${tone.tint || "bg-surface"}`}
            >
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <p className="font-semibold text-text">{lv.label}</p>
                <span
                  className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-semibold ${tone.badge}`}
                >
                  제재 {lv.sanction}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-text-secondary">
                {lv.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
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
    <main className="max-w-7xl mx-auto px-4 py-6">
      <div className="mx-auto mb-8 mt-8 max-w-xl text-center">
        <Title level={1}>종목 상태 조회</Title>
        <p className="mt-2 text-sm text-text-secondary">
          단기과열 · 투자경고 · 투자위험 지정 여부를 한 번에 확인하세요
        </p>
      </div>

      <div className="relative mx-auto mb-4 max-w-xl">
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
            className="flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text md:px-4 md:py-3"
          />
          <Button
            onClick={handleSearch}
            disabled={loading || !query}
            className="md:px-6 md:py-3 md:text-base"
          >
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

      <div className="mx-auto mb-8 flex max-w-xl flex-col  justify-center gap-1 text-xs text-text-secondary md:flex-row md:flex-wrap md:gap-x-4 md:gap-y-1">
        {RISK_LEVELS.map((r, i) => (
          <span key={r.level} className="inline-flex items-center gap-1.5">
            <RiskIndicator level={r.level} />
            <span>
              {i === RISK_LEVELS.length - 1
                ? "그 미만"
                : `${r.minAchievement}%↑`}
            </span>
          </span>
        ))}
      </div>

      {error && (
        <p className="mx-auto mb-4 max-w-xl text-sm text-red-500">{error}</p>
      )}

      {result ? (
        <div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {shortTermOverheating && (
              <ResultCard result={shortTermOverheating} />
            )}
            {investmentWarning && <ResultCard result={investmentWarning} />}
            {investmentRisk && <ResultCard result={investmentRisk} />}
          </div>
        </div>
      ) : (
        <EmptyState />
      )}

      <div className="mt-16">
        <LevelGuideSection />
      </div>
    </main>
  );
}
