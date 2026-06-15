import { InvestorFlowItem } from "@/server/hankuk/types";
import { ProgramFlowItem } from "@/server/kiwoom/types";

export function buildSupplyMap({
  stockCodes,
  investorDataList,
  programDataList,
}: {
  stockCodes: string[];
  investorDataList: (InvestorFlowItem | undefined)[];
  programDataList: (ProgramFlowItem | undefined)[];
}) {
  const investorMap = new Map(
    stockCodes.map((stockCode, i) => [stockCode, investorDataList[i]]),
  );
  const programMap = new Map(
    stockCodes.map((stockCode, i) => [stockCode, programDataList[i]]),
  );
  return { investorMap, programMap };
}
