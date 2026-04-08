"use client";

import Title from "@/components/ui/Title";
import ThemeCard from "@/features/themes/components/ThemeCard";
import { useThemes } from "@/features/themes/hooks/useThemes";

export default function ThemesPage() {
  const { data: themes, isLoading, isError } = useThemes();

  if (isLoading)
    return (
      <main className="max-w-7xl mx-auto px-6 py-8">
        <p className="text-text-secondary">불러오는 중...</p>
      </main>
    );
  if (isError)
    return (
      <main className="max-w-7xl mx-auto px-6 py-8">
        <p className="text-text-secondary">데이터를 불러오지 못했습니다.</p>
      </main>
    );

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-6">
        <Title level={1}>오늘의 테마</Title>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes?.map((theme) => (
          <ThemeCard key={theme.id} theme={theme} />
        ))}
      </div>
    </main>
  );
}
