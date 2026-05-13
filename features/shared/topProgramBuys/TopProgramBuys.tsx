import Title from "@/components/ui/Title";
import {
  useKosdaqTopProgramBuys,
  useKospiTopProgramBuys,
} from "./useTopProgramBuys";

export default function TopProgramBuys() {
  const {
    data: kospiProgram,
    isLoading: isLoadingKospi,
    error: errorKospi,
  } = useKospiTopProgramBuys();

  const {
    data: kosdaqProgram,
    isLoading: isLoadingKosdaq,
    error: errorKosdaq,
  } = useKosdaqTopProgramBuys();

  if (isLoadingKospi || isLoadingKosdaq) {
    return <div>Loading...</div>;
  }

  if (errorKospi || errorKosdaq) {
    return <div>Error: {errorKospi?.message || errorKosdaq?.message}</div>;
  }

  return (
    <>
      <Title level={1}>코스피 프로그램매수</Title>

      {kospiProgram &&
        kospiProgram.map((stock) => (
          <div key={stock.stockCode}>
            <ul>
              <li>{stock.rank}</li>
              <li>{stock.stockName}</li>
              <li>{stock.price}</li>
              <li>{stock.changeRate}</li>
              <li>{stock.programTotal}</li>
            </ul>
          </div>
        ))}

      <Title level={1}>코스닥 프로그램매수</Title>

      {kosdaqProgram &&
        kosdaqProgram.map((stock) => (
          <div key={stock.stockCode}>
            <ul>
              <li>{stock.rank}</li>
              <li>{stock.stockName}</li>
              <li>{stock.price}</li>
              <li>{stock.changeRate}</li>
              <li>{stock.programTotal}</li>
            </ul>
          </div>
        ))}
    </>
  );
}
