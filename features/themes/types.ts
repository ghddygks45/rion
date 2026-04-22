import { StockRow } from "@/components/ui/StockTable";

export type themeStock = {
  code: string;
  name: string;
  price: number;
  changeRate: number;
};

export type Theme = {
  id: string;
  name: string;
  avgChangeRate: number;
  main_stk: string;
  stocks: themeStock[];
};
