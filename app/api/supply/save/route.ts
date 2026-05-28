import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ThemeWithSupply } from "@/features/themes/types";

const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");

export async function POST(request: Request) {
  const {
    topVolumeSupply,
    topChangeRateSupply,
  }: {
    topVolumeSupply: ThemeWithSupply[];
    topChangeRateSupply: ThemeWithSupply[];
  } = await request.json();

  await Promise.all([
    prisma.todaysSupply.upsert({
      where: { date_type: { date: today, type: "topVolumeSupply" } },
      update: { data: JSON.parse(JSON.stringify(topVolumeSupply)) },
      create: {
        date: today,
        type: "topVolumeSupply",
        data: JSON.parse(JSON.stringify(topVolumeSupply)),
      },
    }),
    prisma.todaysSupply.upsert({
      where: { date_type: { date: today, type: "topChangeRateSupply" } },
      update: { data: JSON.parse(JSON.stringify(topChangeRateSupply)) },
      create: {
        date: today,
        type: "topChangeRateSupply",
        data: JSON.parse(JSON.stringify(topChangeRateSupply)),
      },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
