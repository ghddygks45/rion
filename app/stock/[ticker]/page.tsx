import { notFound } from "next/navigation";
import { mockStockDetails } from "@/features/stock-detail/mocks";
import StockDetailHeader from "@/features/stock-detail/components/StockDetailHeader";
import MarketOverview from "@/features/stock-detail/components/MarketOverview";

export default async function StockDetailPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await params;
  const stock = mockStockDetails.find((stock) => stock.ticker === ticker);

  if (!stock) notFound();

  return (
    <main className="max-w-3xl mx-auto px-6 py-8">
      <StockDetailHeader
        className="mb-8"
        ticker={stock.ticker}
        name={stock.name}
        price={stock.price}
        changeRate={stock.changeRate}
      />
      <MarketOverview className="mb-8" marketIndices={stock.marketIndices} />
    </main>
  );
}
