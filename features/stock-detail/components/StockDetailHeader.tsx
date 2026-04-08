import Title from "@/components/ui/Title";
import Badge from "@/components/ui/Badge";

type StockDetailHeaderProps = {
  ticker: string;
  name: string;
  price: number;
  changeRate: number;
  className?: string;
};

export default function StockDetailHeader({
  ticker,
  name,
  price,
  changeRate,
  className,
}: StockDetailHeaderProps) {
  const variant = changeRate > 0 ? "up" : changeRate < 0 ? "down" : "neutral";
  const sign = changeRate > 0 ? "+" : "";

  return (
    <div className={`min-w-xs ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <Title level={1}>{name}</Title>
        <Badge variant={variant}>
          {sign}
          {changeRate.toFixed(2)}%
        </Badge>
      </div>
      <div className="flex items-center gap-3 justify-between">
        <span className="text-text-secondary text-sm">{ticker}</span>
        <span className="text-text font-bold text-2xl">
          {price.toLocaleString("ko-KR")}원
        </span>
      </div>
    </div>
  );
}
