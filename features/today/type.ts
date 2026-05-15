export type TodaysThemes = {
  themeName: string;
  themeId: string;
  themeChangeRate: number;
  stocks: ThemeStocksInfo[];
};

export type ThemeStocksInfo = {
  stockCode: string;
  stockName: string;
  price: number;
  changeRate: number;
  volume: number;
};
