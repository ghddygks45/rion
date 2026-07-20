type RiskLevel = "매우위험" | "위험" | "주의" | "안전";

type RiskIndicatorProps = {
  level: RiskLevel;
  className?: string;
};

const RISK_COLORS: Record<RiskLevel, string> = {
  매우위험: "bg-red-600",
  위험: "bg-orange-500",
  주의: "bg-yellow-400",
  안전: "bg-green-500",
};

export default function RiskIndicator({
  level,
  className = "",
}: RiskIndicatorProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-sm font-medium text-text ${className}`}
    >
      <span className={`w-2.5 h-2.5 rounded-full ${RISK_COLORS[level]}`} />
      {level}
    </span>
  );
}
