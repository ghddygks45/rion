import { InvestorFlowItem } from "@/server/hankuk/types";
import { ProgramFlowItem } from "@/server/kiwoom/types";
import { themeStock, ThemeWithStocks, ThemeWithSupply } from "../types";

function toNumberOrUndefined(
  value: string | null | undefined,
): number | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const num = Number(value);
  return Number.isNaN(num) ? undefined : num;
}

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
          ? (toNumberOrUndefined(investor.orgn_ntby_tr_pbmn) ??
            dbStock?.institution)
          : dbStock?.institution,
        foreign: investorValid
          ? (toNumberOrUndefined(investor.frgn_ntby_tr_pbmn) ??
            dbStock?.foreign)
          : dbStock?.foreign,
        program: programValid
          ? (toNumberOrUndefined(program.prm_netprps_amt?.replace(/^--/, "-")) ??
            dbStock?.program)
          : dbStock?.program,
      };
    }),
  }));
}
