import Link from "next/link";
import Title from "@/components/ui/Title";
import Badge from "@/components/ui/Badge";

type Stock = {
  name: string;
  price: number;
  changeRate: number;
  volume: number;
  href: string;
  signal?: "52주 신고가" | "이상 거래량";
};

type StockDetailTableProps = {
  stocks: Stock[];
};

function formatPrice(price: number) {
  return price.toLocaleString("ko-KR");
}

function formatVolume(volume: number) {
  return Math.floor(volume / 100000000) + "억";
}

export default function StockDetailTable({ stocks }: StockDetailTableProps) {
  return (
    <div>
      <Title level={2}>종목 목록</Title>
      <table className="w-full mt-4 table-fixed">
        <thead>
          <tr className="text-text-secondary text-sm">
            <th className="text-left py-2 pl-4 w-[25%]">종목명</th>
            <th className="text-right py-2 w-[20%]">가격</th>
            <th className="text-right py-2 w-[15%]">등락률</th>
            <th className="text-right py-2 w-[15%]">거래대금</th>
            <th className="text-right py-2 pr-4 w-[25%]">시그널</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock, i) => {
            const isUp = stock.changeRate > 0;
            const isDown = stock.changeRate < 0;
            const rateClass = isUp
              ? "text-up"
              : isDown
                ? "text-down"
                : "text-text";
            const sign = isUp ? "+" : "";

            return (
              <tr
                key={i}
                className="relative border-t border-border hover:bg-black/5 dark:hover:bg-white/20"
              >
                <td className="py-3 pl-4 text-text font-medium">
                  {/* <Link href={stock.href} className="absolute inset-0" /> */}
                  {stock.name}
                </td>
                <td className={`py-3 text-right ${rateClass}`}>
                  {formatPrice(stock.price)}
                </td>
                <td className={`py-3 text-right ${rateClass}`}>
                  {sign}
                  {stock.changeRate.toFixed(2)}%
                </td>
                <td className="py-3 text-right text-text-secondary">
                  {formatVolume(stock.volume)}
                </td>
                <td className="py-3 text-right pr-4">
                  {stock.signal && (
                    <Badge variant="neutral">{stock.signal}</Badge>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
