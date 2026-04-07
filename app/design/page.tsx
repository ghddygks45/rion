import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Title from "@/components/ui/Title";
import StockTable, { StockRow } from "@/components/ui/StockTable";

const mockStocks: StockRow[] = [
  { name: "삼성전자", price: 73400, changeRate: 2.45, volume: 4320000000, href: "/stock/005930" },
  { name: "SK하이닉스", price: 189500, changeRate: -1.32, volume: 2100000000, href: "/stock/000660" },
  { name: "LG에너지솔루션", price: 412000, changeRate: 0, volume: 980000000, href: "/stock/373220" },
];

export default function DesignPage() {
  return (
    <div className="p-8 space-y-8 max-w-2xl">
      <Title level={1}>디자인 시스템</Title>

      <div className="space-y-4">
        <Title level={3}>Title</Title>
        <div className="space-y-2">
          <Title level={1}>Title Level 1</Title>
          <Title level={2}>Title Level 2</Title>
          <Title level={3}>Title Level 3</Title>
        </div>
      </div>

      <div className="space-y-2">
        <Title level={3}>Card</Title>
        <Card title="카드 제목">
          <p className="text-text">카드 컨텐츠 영역</p>
        </Card>
      </div>

      <div className="space-y-2">
        <Title level={3}>Button</Title>
        <div className="flex gap-3">
          <Button variant="primary">조회하기</Button>
          <Button variant="secondary">취소</Button>
          <Button variant="primary" disabled>비활성</Button>
        </div>
      </div>

      <div className="space-y-2">
        <Title level={3}>Badge</Title>
        <div className="flex gap-4">
          <Badge variant="up">+2.45%</Badge>
          <Badge variant="down">-1.32%</Badge>
          <Badge variant="neutral">0.00%</Badge>
        </div>
      </div>

      <div className="space-y-2">
        <Title level={3}>StockTable</Title>
        <StockTable title="반도체" stocks={mockStocks} />
      </div>
    </div>
  );
}
