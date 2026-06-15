import { InvestorFlowItem } from "@/server/hankuk/types";
import { ProgramFlowItem } from "@/server/kiwoom/types";
import { themeStock, ThemeWithStocks, ThemeWithSupply } from "../types";

type buildSupplyThemesProps = {
  themes: ThemeWithStocks[];
  investorMap: Map<string, InvestorFlowItem | undefined>;
  programMap: Map<string, ProgramFlowItem | undefined>;
  dbStockMap: Map<string, themeStock>;
};

export function buildSupplyThemes({
  themes,
  investorMap,
  programMap,
  dbStockMap,
}: buildSupplyThemesProps): ThemeWithSupply[] {
  return themes.map((theme) => ({
    ...theme,
    stocks: theme.stocks.map((stock) => {
      const investor = investorMap.get(stock.stockCode);
      const program = programMap.get(stock.stockCode);
      const investorValid = typeof investor === "object" && investor !== null;
      const programValid = typeof program === "object" && program !== null;
      const dbStock = dbStockMap.get(stock.stockCode);
      return {
        ...stock,
        institution: investorValid
          ? Number(investor.orgn_ntby_tr_pbmn)
          : dbStock?.institution,
        foreign: investorValid
          ? Number(investor.frgn_ntby_tr_pbmn)
          : dbStock?.foreign,
        program: programValid
          ? Number(program.prm_netprps_amt.replace(/^--/, "-"))
          : dbStock?.program,
      };
    }),
  }));
}
