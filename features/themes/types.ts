export type themeStock = {
  themeId?: string;
  themeName?: string;
  stockCode: string;
  stockName: string;
  price: number;
  changeRate: number;
  volume?: number;
  themeVolume?: number;
  institution?: number;
  foreign?: number;
  program?: number;
};

export type Theme = {
  themeId: string;
  themeName: string;
  themeChangeRate: number;
};

export type ThemeWithStocks = {
  themeId: string;
  themeName: string;
  themeChangeRate: number;
  stocks: themeStock[];
};

export type ThemeWithSupply = {
  themeId: string;
  themeName: string;
  themeChangeRate: number;
  stocks: themeStock[];
};

export type stockTopVolume = {
  stockCode: string;
  volume: string;
};
