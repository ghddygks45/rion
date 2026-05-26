import { NextResponse } from "next/server";
import { hankukFetch } from "@/server/hankuk/hankukFetcher";
import { InvestorFlowItem } from "@/server/hankuk/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stockCode = searchParams.get("stockCode")?.split("_")[0] ?? "";
  try {
    const data = await hankukFetch<InvestorFlowItem>(
      "GET",
      "/uapi/domestic-stock/v1/quotations/inquire-investor",
      "FHKST01010900",
      {
        FID_COND_MRKT_DIV_CODE: "UN",
        FID_INPUT_ISCD: stockCode,
      },
    );
    return NextResponse.json(data.output[0]);
  } catch (error) {
    return NextResponse.json(error);
  }
}
