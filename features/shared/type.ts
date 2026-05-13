export type DomesticMarket = {
  date?: string;
  kospi: number;
  kospiChange: number;
  kosdaq: number;
  kosdaqChange: number;
};

export type TopChangeRateStock = {
  stockCode: string;
  stockName: string;
  changeRate: number;
  price: number;
  volume?: number;
};
