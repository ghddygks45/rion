import { NextResponse } from "next/server";
import { kiwoomFetch } from "@/server/kiwoom/kiwoomFetcher";
import { Ka90002Response } from "@/server/kiwoom/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const thema_grp_cd = searchParams.get("thema_grp_cd") ?? "";
  const data = await kiwoomFetch<Ka90002Response>(
    "/api/dostk/thme",
    "ka90002",
    {
      stk_cd: "2",
      thema_grp_cd,
      stex_tp: "3",
    },
  );

  return NextResponse.json(data);
}
