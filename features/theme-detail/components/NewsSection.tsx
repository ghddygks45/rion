import Title from "@/components/ui/Title";
import Link from "next/link";

type NewsProps = {
  news: { title: string; date: string }[];
};

export default function NewsSection({ news }: NewsProps) {
  return (
    <div className="mb-8">
      <Title level={2}>최근 뉴스</Title>
      <ul className="mt-4 space-y-3">
        {news.map((item, i) => (
          <li key={i} className="flex items-center justify-between">
            <Link href="#" className="hover:underline">
              <span className="text-text">{item.title}</span>
            </Link>
            <span className="text-text-secondary text-sm shrink-0 ml-4">
              {item.date}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
