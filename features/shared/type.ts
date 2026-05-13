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

export type TopVolumeStock = {
  stockCode: string;
  stockName: string;
  volume: number;
  rank?: number;
};

export type PopularStock = {
  stockName: string;
  rank: number;
  price: number;
  changeRate: number;
};

export type topProgramBuys = {
  stockCode: string;
  stockName: string;
  price: number;
  changeRate: number;
  rank: number;
  programTotal: number;
};
