import Title from "@/components/ui/Title";
import { useTopVolumeStock } from "./useTopVolumeStock";

export default function TopVolumeStock() {
  const { data: stocks, isLoading, error } = useTopVolumeStock();

  if (isLoading) {
    return <div> Loading...</div>;
  }

  if (error) {
    return <div> Error: {error.message}</div>;
  }

  return (
    <>
      <Title level={1}>거래대금 상위</Title>
      {stocks &&
        stocks.map((stock) => (
          <div key={stock.stockCode}>
            <ul>
              <li>{stock.stockName}</li>
              <li>{stock.rank}</li>
              <li>{stock.volume}</li>
            </ul>
          </div>
        ))}
    </>
  );
}
