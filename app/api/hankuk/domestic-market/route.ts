import { NextResponse } from "next/server";
import { hankukFetch } from "@/server/hankuk/hankukFetcher";
import { MarketIndexResponse } from "@/server/hankuk/types";

export async function GET() {
  const kospi = await hankukFetch<MarketIndexResponse>(
    "GET",
    "/uapi/domestic-stock/v1/quotations/inquire-index-price",
    "FHPUP02100000",
    {
      FID_COND_MRKT_DIV_CODE: "U",
      FID_INPUT_ISCD: "0001",
    },
  );

  const kosdaq = await hankukFetch<MarketIndexResponse>(
    "GET",
    "/uapi/domestic-stock/v1/quotations/inquire-index-price",
    "FHPUP02100000",
    {
      FID_COND_MRKT_DIV_CODE: "U",
      FID_INPUT_ISCD: "1001",
    },
  );

  return NextResponse.json({ kospi, kosdaq });
}
