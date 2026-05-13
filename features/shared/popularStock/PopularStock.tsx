import Title from "@/components/ui/Title";
import { usePopularStock } from "./usePopularStock";

export default function PopularStock() {
  const { data: popularStocks, isLoading, error } = usePopularStock();

  if (isLoading) {
    return <div>isLoading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <Title level={1}>현재 조회수 순위</Title>
      {popularStocks &&
        popularStocks.map((stock) => (
          <div key={stock.stockName}>
            <ul>
              <li>{stock.stockName}</li>
              <li>{stock.rank}</li>
              <li>{stock.price}</li>
              <li>{stock.changeRate}</li>
            </ul>
          </div>
        ))}
    </>
  );
}
