import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ThemeWithStocks } from "@/features/themes/types";

const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");

export async function POST(request: Request) {
  const {
    topVolumeThemes,
    topChangeRateThemes,
  }: {
    topVolumeThemes: ThemeWithStocks[];
    topChangeRateThemes: ThemeWithStocks[];
  } = await request.json();

  await Promise.all([
    prisma.todaysTheme.upsert({
      where: { date_type: { date: today, type: "topVolumeThemes" } },
      update: { data: JSON.parse(JSON.stringify(topVolumeThemes)) },
      create: {
        date: today,
        type: "topVolumeThemes",
        data: JSON.parse(JSON.stringify(topVolumeThemes)),
      },
    }),
    prisma.todaysTheme.upsert({
      where: { date_type: { date: today, type: "topChangeRateThemes" } },
      update: { data: JSON.parse(JSON.stringify(topChangeRateThemes)) },
      create: {
        date: today,
        type: "topChangeRateThemes",
        data: JSON.parse(JSON.stringify(topChangeRateThemes)),
      },
    }),
  ]);

  console.log(" GET /api/themes/save: db에 오늘의 테마 저장");

  return NextResponse.json({ topVolumeThemes });
}
