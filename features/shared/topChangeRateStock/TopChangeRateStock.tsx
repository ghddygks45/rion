import Title from "@/components/ui/Title";
import {
  useTopChangeRateStock,
  useTopChangeRateStockLimitUp,
} from "./useTopChangeRateStock";

export default function TopChangeRateStock() {
  const {
    data: topRate,
    isLoading: isLoadingTopRate,
    error: errorTopRate,
  } = useTopChangeRateStock();

  const {
    data: limitUp,
    isLoading: isLoadingLimitUp,
    error: errorLimitUp,
  } = useTopChangeRateStockLimitUp();

  if (isLoadingTopRate || isLoadingLimitUp) {
    return <div>Loading...</div>;
  }

  if (errorTopRate || errorLimitUp) {
    return <div>Error: {errorTopRate?.message || errorLimitUp?.message}</div>;
  }

  return (
    <>
      <Title level={1}>상한가</Title>

      {limitUp &&
        limitUp.map((stock) => (
          <div key={stock.stockCode}>
            <ul>
              <li>{stock.stockName}</li>
              <li>{stock.changeRate}</li>
              <li>{stock.price}</li>
            </ul>
          </div>
        ))}

      <Title level={1}>상승률 상위 종목</Title>
      {topRate &&
        topRate.map((stock) => (
          <div key={stock.stockCode}>
            <ul>
              <li>{stock.stockName}</li>
              <li>{stock.changeRate}</li>
              <li>{stock.price}</li>
            </ul>
          </div>
        ))}
    </>
  );
}
