import Title from "@/components/ui/Title";

type SupplySectionProps = {
  institution: number;
  foreign: number;
  className?: string;
};

function formatSupply(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toLocaleString("ko-KR")}억`;
}

export default function SupplySection({
  institution,
  foreign,
  className,
}: SupplySectionProps) {
  return (
    <div className={`min-w-xs ${className}`}>
      <Title level={2}>수급 현황</Title>
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">기관</span>
          <span
            className={
              institution >= 0 ? "text-up font-medium" : "text-down font-medium"
            }
          >
            {formatSupply(institution)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">외국인</span>
          <span
            className={
              foreign >= 0 ? "text-up font-medium" : "text-down font-medium"
            }
          >
            {formatSupply(foreign)}
          </span>
        </div>
      </div>
    </div>
  );
}
