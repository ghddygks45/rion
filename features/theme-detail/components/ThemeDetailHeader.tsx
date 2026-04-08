import Title from "@/components/ui/Title";
import Badge from "@/components/ui/Badge";

type ThemeDetailHeaderProps = {
  name: string;
  avgChangeRate: number;
  summary: string;
};

export default function ThemeDetailHeader({
  name,
  avgChangeRate,
  summary,
}: ThemeDetailHeaderProps) {
  const variant =
    avgChangeRate > 0 ? "up" : avgChangeRate < 0 ? "down" : "neutral";
  const sign = avgChangeRate > 0 ? "+" : "";

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <Title level={1}>{name}</Title>
        <Badge variant={variant}>
          {sign}
          {avgChangeRate.toFixed(2)}%
        </Badge>
      </div>
      <p className="text-text-secondary">{summary}</p>
    </div>
  );
}
