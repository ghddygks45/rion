import Link from "next/link";
import Badge from "./Badge";
import Title from "./Title";
import { themeStock } from "@/features/themes/types";

function formatPrice(price: number) {
  return price.toLocaleString("ko-KR");
}

function formatVolume(volume: number) {
  const billion = volume / 100;
  if (billion >= 10_000) return (billion / 10_000).toFixed(1) + "조";
  return Math.round(billion) + "억";
}

function formatChangeRate(rate: number) {
  const sign = rate > 0 ? "+" : "";
  return `${sign}${rate.toFixed(2)}%`;
}

function formatSupplyValue(value: number | undefined) {
  return value !== undefined ? formatPrice(value) : "-";
}

type StockTableProps = {
  stocks: themeStock[];
  title?: string;
  className?: string;
  view?: "price" | "supply";
};

export default function StockTable({
  stocks,
  title,
  className,
  view = "price",
}: StockTableProps) {
  return (
    <div
      className={`relative bg-surface border-t-0 border-b-0 xl:border border-border rounded-lg overflow-hidden w-[calc(100%+32px)] left-[-16px] xl:w-full xl:left-0 ${className}`}
    >
      {title && (
        <div className="px-4 py-3 border-b border-border">
          <Title level={2}>{title}</Title>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm table-fixed min-w-[300px]">
          <thead>
            <tr className="text-left">
              <th className="py-3 pl-4 font-medium text-xs text-text-disabled tracking-wider w-[35%]">
                종목명
              </th>
              <th className="py-3 font-medium text-xs text-text-disabled tracking-wider text-right w-[30%]">
                {view === "price" ? "가격" : "외국인"}
              </th>
              <th className="py-3 font-medium text-xs text-text-disabled tracking-wider text-right w-[25%]">
                {view === "price" ? "등락률" : "기관"}
              </th>
              <th className="py-3 pr-4 font-medium text-xs text-text-disabled tracking-wider text-right w-[25%]">
                {view === "price" ? "거래대금" : "프로그램"}
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
                    {/* <Link
                      href={`/stock/${stock.stockCode}`}
                      className="absolute inset-0"
                    /> */}
                    {stock.stockName}
                  </td>
                  <td className="py-3 text-right text-text tabular-nums">
                    {view === "price"
                      ? formatPrice(stock.price) + "원"
                      : formatSupplyValue(stock.foreign)}
                  </td>
                  <td className="py-3 text-right">
                    {view === "price" ? (
                      <Badge variant={variant}>
                        {formatChangeRate(stock.changeRate)}
                      </Badge>
                    ) : (
                      formatSupplyValue(stock.institution)
                    )}
                  </td>
                  <td className="py-3 pr-4 text-right text-text-secondary tabular-nums">
                    {view === "price"
                      ? stock.volume !== undefined
                        ? formatVolume(stock.volume)
                        : "-"
                      : formatSupplyValue(stock.program)}
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
