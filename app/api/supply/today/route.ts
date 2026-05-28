import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");

export async function GET() {
  const [topVolumeSupply, topChangeRateSupply] = await Promise.all([
    prisma.todaysSupply.findUnique({
      where: { date_type: { date: today, type: "topVolumeSupply" } },
    }),
    prisma.todaysSupply.findUnique({
      where: { date_type: { date: today, type: "topChangeRateSupply" } },
    }),
  ]);

  return NextResponse.json({
    topVolumeSupply: topVolumeSupply?.data ?? null,
    topChangeRateSupply: topChangeRateSupply?.data ?? null,
  });
}
