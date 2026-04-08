import { notFound } from "next/navigation";
import { mockStockDetails } from "@/features/stock-detail/mocks";
import StockDetailHeader from "@/features/stock-detail/components/StockDetailHeader";
import MarketOverview from "@/features/stock-detail/components/MarketOverview";
import SupplySection from "@/features/stock-detail/components/SupplySection";
import SignalSection from "@/features/stock-detail/components/SignalSection";
import NewsSection from "@/features/shared/components/NewsSection";

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
      <MarketOverview className="mb-8" marketIndices={stock.marketIndices} />
      <StockDetailHeader
        className="mb-8"
        ticker={stock.ticker}
        name={stock.name}
        price={stock.price}
        changeRate={stock.changeRate}
        signals={stock.signals}
      />
      <SupplySection
        className="mb-8"
        institution={stock.supply.institution}
        foreign={stock.supply.foreign}
      />
      <SignalSection className="mb-8" signals={stock.signals} />
      <NewsSection className="mb-8" news={stock.news} />
    </main>
  );
}
