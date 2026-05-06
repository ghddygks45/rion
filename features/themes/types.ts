export type themeStock = {
  themeId: string;
  themeName: string;
  stockCode: string;
  stockName: string;
  price: number;
  changeRate: number;
  volume?: number;
  themeVolume?: number;
};

export type Theme = {
  themeId: string;
  themeName: string;
  themeChangeRate: number;
};

export type stockTopVolume = {
  stockCode: string;
  volume: string;
};
