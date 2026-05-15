import { NextResponse } from "next/server";
import { hankukFetch } from "@/server/hankuk/hankukFetcher";

export async function GET() {
  try {
    const data = await hankukFetch(
      "GET",
      "/uapi/domestic-stock/v1/quotations/inquire-investor",
      "FHKST01010900",
      {
        FID_COND_MRKT_DIV_CODE: "UN",
        FID_INPUT_ISCD: "005930",
      },
    );
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(error);
  }
}
