import { NextResponse } from "next/server";
import { syncStockMaster } from "@/server/kiwoom/stockMaster";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncStockMaster();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[stocks/sync] error:", err);
    return NextResponse.json({ error: "sync failed" }, { status: 500 });
  }
}
