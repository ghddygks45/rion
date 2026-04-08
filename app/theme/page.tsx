import Title from "@/components/ui/Title";
import ThemeCard from "@/features/themes/components/ThemeCard";
import { mockThemes } from "@/features/themes/mocks";

export default function ThemesPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-6">
        <Title level={1}>오늘의 테마</Title>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockThemes.map((theme) => (
          <ThemeCard key={theme.id} theme={theme} />
        ))}
      </div>
    </main>
  );
}
