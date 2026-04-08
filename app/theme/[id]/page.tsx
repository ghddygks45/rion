import { notFound } from "next/navigation";
import { mockThemeDetails } from "@/features/theme-detail/mocks";
import ThemeDetailHeader from "@/features/theme-detail/components/ThemeDetailHeader";
import NewsSection from "@/features/theme-detail/components/NewsSection";

export default async function ThemeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const theme = mockThemeDetails.find((theme) => theme.id === id);

  if (!theme) notFound();

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <ThemeDetailHeader
        name={theme.name}
        avgChangeRate={theme.avgChangeRate}
        summary={theme.summary}
      />
      <NewsSection news={theme.news} />
    </main>
  );
}
