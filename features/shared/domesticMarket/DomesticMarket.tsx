import { useDomesticMarket } from "@/features/shared/domesticMarket/useDomesticMarket";

export default function DomesticMarket() {
  const { data, isLoading, error } = useDomesticMarket();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <h1>DomesticMarket Component</h1>
      <div>
        <p>KOSPI: {data?.kospi}</p>
        <p>KOSPI Change: {data?.kospiChange}</p>
        <p>KOSDAQ: {data?.kosdaq}</p>
        <p>KOSDAQ Change: {data?.kosdaqChange}</p>
      </div>
    </>
  );
}
