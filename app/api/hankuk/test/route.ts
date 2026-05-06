import { NextResponse } from "next/server";
import { hankukFetch } from "@/server/hankuk/hankukFetcher";
import { ResponseBodyOutput } from "@/server/hankuk/types";

export async function GET() {
  const data = await hankukFetch<ResponseBodyOutput>(
    "GET",
    "/uapi/domestic-stock/v1/quotations/inquire-index-price",
    "FHPUP02100000",
    {
      FID_COND_MRKT_DIV_CODE: "U",
      FID_INPUT_ISCD: "0001",
    },
  );

  return NextResponse.json(data);
}
