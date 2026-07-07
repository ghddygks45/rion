import { NextResponse } from "next/server";
import { refreshThemesData } from "@/app/api/cron/refresh/route";

export async function POST() {
  try {
    const result = await refreshThemesData();
    return NextResponse.json(result);
  } catch (err) {
    console.error("[themes/manual-refresh] error:", err);
    return NextResponse.json({ error: "refresh failed" }, { status: 500 });
  }
}
