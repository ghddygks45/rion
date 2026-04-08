export type NewsItem = {
  title: string;
  date: string;
};

export type Signal = "52주 신고가" | "이상 거래량";

export type ThemeDetailStock = {
  name: string;
  price: number;
  changeRate: number;
  volume: number;
  href: string;
  signal?: Signal;
};

export type ThemeDetail = {
  id: string;
  name: string;
  summary: string;
  avgChangeRate: number;
  news: NewsItem[];
  stocks: ThemeDetailStock[];
};
