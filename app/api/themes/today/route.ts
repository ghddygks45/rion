import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");

export async function GET() {
  const [topVolumeThemes, topChangeRateThemes] = await Promise.all([
    prisma.todaysTheme.findUnique({
      where: { date_type: { date: today, type: "topVolumeThemes" } },
    }),
    prisma.todaysTheme.findUnique({
      where: { date_type: { date: today, type: "topChangeRateThemes" } },
    }),
  ]);

  return NextResponse.json({
    topVolumeThemes: topVolumeThemes?.data ?? null,
    topChangeRateThemes: topChangeRateThemes?.data ?? null,
    createdAt: topVolumeThemes?.createdAt ?? null,
  });
}
