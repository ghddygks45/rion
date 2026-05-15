import Title from "@/components/ui/Title";
import { useTopChangeRateTheme } from "./useTopChangeRateTheme";
import Card from "@/components/ui/Card";
import StockTable from "@/components/ui/StockTable";
import Badge from "@/components/ui/Badge";

// 컴포넌트에 넣기
// 버튼 만들기 --> 기관, 외인, 프로그램 수급 보이게 하기.

export default function TopChangeRateTheme() {
  const { data: todaysThemes, isLoading, error } = useTopChangeRateTheme();

  if (isLoading) {
    return <div>Loding...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <>
      <Title level={1}>오늘의 테마</Title>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {todaysThemes?.map((theme) => (
          <Card key={theme.themeId}>
            <div className="flex items-center justify-between mb-2">
              <Title level={2}>{theme.themeName}</Title>
              <Badge variant="up">
                {theme.themeChangeRate > 0 ? "+" : ""}
                {theme.themeChangeRate.toFixed(2)}%
              </Badge>
            </div>
            <StockTable stocks={theme.stocks} />
          </Card>
        ))}
      </div>
    </>
  );
}
