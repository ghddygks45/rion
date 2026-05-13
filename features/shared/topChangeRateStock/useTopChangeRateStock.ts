import { useQuery } from "@tanstack/react-query";
import { TopChangeRateStock } from "../type";
import { TopChangeRateStockResponse } from "@/server/kiwoom/types";
// import { TopChangeRateStock } from '../type';

export function useTopChangeRateStockLimitUp() {
  return useQuery<TopChangeRateStock[]>({
    queryKey: ["topChangeRateStock", "limitUp"],
    queryFn: async () => {
      const res = await fetch("/api/kiwoom/top-changeRate-stock");
      const data: TopChangeRateStockResponse = await res.json();
      return data.limitUp.map((stock) => ({
        stockCode: stock.stk_cd,
        stockName: stock.stk_nm,
        changeRate: Number(stock.flu_rt),
        price: Number(stock.cur_prc),
      }));
    },
  });
}

export function useTopChangeRateStock() {
  return useQuery<TopChangeRateStock[]>({
    queryKey: ["topChangeRateStock", "topRate"],
    queryFn: async () => {
      const res = await fetch("/api/kiwoom/top-changeRate-stock");
      const data: TopChangeRateStockResponse = await res.json();
      return data.topRate.map((stock) => ({
        stockCode: stock.stk_cd,
        stockName: stock.stk_nm,
        changeRate: Number(stock.flu_rt),
        price: Number(stock.cur_prc),
      }));
    },
  });
}
