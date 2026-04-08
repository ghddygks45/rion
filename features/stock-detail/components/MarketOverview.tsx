import Title from "@/components/ui/Title";
import Badge from "@/components/ui/Badge";

type MarketIndex = {
  name: string;
  value: number;
  changeRate: number;
  className?: string;
};

type MarketOverviewProps = {
  marketIndices: MarketIndex[];
  className?: string;
};

export default function MarketOverview({
  marketIndices,
  className,
}: MarketOverviewProps) {
  return (
    <div className={`min-w-xs ${className}`}>
      <Title level={2}>시장 개요</Title>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-4">
        {marketIndices.map((index) => {
          const variant =
            index.changeRate > 0
              ? "up"
              : index.changeRate < 0
                ? "down"
                : "neutral";
          const sign = index.changeRate > 0 ? "+" : "";
          return (
            <div
              key={index.name}
              className="bg-surface rounded-lg p-3 flex flex-col gap-1"
            >
              <span className="text-text-secondary text-xs">{index.name}</span>
              <span className="text-text font-medium text-sm">
                {index.value.toLocaleString("ko-KR")}
              </span>
              <Badge variant={variant}>
                {sign}
                {index.changeRate.toFixed(2)}%
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}
