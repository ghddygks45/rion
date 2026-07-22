import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const results = await prisma.stockMaster.findMany({
    where: { name: { contains: q, mode: "insensitive" } },
    select: { code: true, name: true, marketName: true },
    take: 10,
  });

  return NextResponse.json({ results });
}
