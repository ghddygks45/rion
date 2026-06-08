import { NextResponse } from "next/server";
import { hankukFetch } from "@/server/hankuk/hankukFetcher";
import { InvestorFlowItem } from "@/server/hankuk/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  console.log("한국투자증권");
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
    return NextResponse.json(data.output[0] ?? "실패");
  } catch {
    return NextResponse.json("실패");
  }
}
