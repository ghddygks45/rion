import Link from "next/link";
import Badge from "./Badge";
import Title from "./Title";

export type StockRow = {
  code: string;
  name: string;
  price: number;
  changeRate: number;
  volume?: number;
  href?: string;
};

type StockTableProps = {
  stocks: StockRow[];
  title?: string;
  className?: string;
};

function formatPrice(price: number) {
  return price.toLocaleString("ko-KR") + "원";
}

function formatVolume(volume: number) {
  if (volume >= 100_000_000) return (volume / 100_000_000).toFixed(0) + "억";
  if (volume >= 10_000) return (volume / 10_000).toFixed(0) + "만";
  return volume.toLocaleString("ko-KR");
}

function formatChangeRate(rate: number) {
  const sign = rate > 0 ? "+" : "";
  return `${sign}${rate.toFixed(2)}%`;
}

export default function StockTable({
  stocks,
  title,
  className,
}: StockTableProps) {
  return (
    <div
      className={`bg-surface border border-border rounded-lg overflow-hidden ${className}`}
    >
      {title && (
        <div className="px-4 py-3 border-b border-border">
          <Title level={2}>{title}</Title>
        </div>
      )}

      <div className="">
        <table className="w-full text-sm table-fixed">
          <thead>
            <tr className="text-left">
              <th className="py-3 pl-4 font-medium text-xs text-text-disabled tracking-wider w-[40%]">
                종목명
              </th>
              <th className="py-3 font-medium text-xs text-text-disabled tracking-wider text-right w-[22%]">
                가격
              </th>
              <th className="py-3 font-medium text-xs text-text-disabled tracking-wider text-right w-[18%]">
                등락률
              </th>
              <th className="py-3 pr-4 font-medium text-xs text-text-disabled tracking-wider text-right w-[20%]">
                거래대금
              </th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock, i) => {
              const variant =
                stock.changeRate > 0
                  ? "up"
                  : stock.changeRate < 0
                    ? "down"
                    : "neutral";
              return (
                <tr
                  key={i}
                  className="relative border-t border-border hover:bg-black/5 dark:hover:bg-white/20"
                >
                  <td className="py-3 pl-4 text-text font-medium">
                    {stock.href && (
                      <Link href={stock.href} className="absolute inset-0" />
                    )}
                    {stock.name}
                  </td>
                  <td className="py-3 text-right text-text tabular-nums">
                    {formatPrice(stock.price)}
                  </td>
                  <td className="py-3 text-right">
                    <Badge variant={variant}>
                      {formatChangeRate(stock.changeRate)}
                    </Badge>
                  </td>
                  <td className="py-3 pr-4 text-right text-text-secondary tabular-nums">
                    {stock.volume !== undefined
                      ? formatVolume(stock.volume)
                      : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
