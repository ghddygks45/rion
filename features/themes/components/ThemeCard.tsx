"use client";

import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Title from "@/components/ui/Title";
import StockTable from "@/components/ui/StockTable";
import { ThemeWithStocks } from "../types";

export default function ThemeCard({ theme }: { theme: ThemeWithStocks }) {
  const router = useRouter();
  const variant =
    theme.themeChangeRate > 0
      ? "up"
      : theme.themeChangeRate < 0
        ? "down"
        : "neutral";
  const sign = theme.themeChangeRate > 0 ? "+" : "";

  return (
    <>
      <Card>
        <div
          className="cursor-pointer"
          onClick={() => router.push(`/theme/${theme.themeId}`)}
        >
          <div className="flex items-center justify-between mb-2">
            <Title level={2}>{theme.themeName}</Title>
            <Badge variant={variant}>
              {sign}
              {theme.themeChangeRate.toFixed(2)}%
            </Badge>
          </div>
          <p className="text-sm text-text-secondary mb-4">
            여기는 나중에 따로...
          </p>
        </div>

        <StockTable stocks={theme.stocks} />
      </Card>
    </>
  );
}
