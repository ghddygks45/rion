"use client";

import { useState } from "react";

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return "방금 전";
  if (diffMinutes < 60) return `${diffMinutes}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  return `${diffDays}일 전`;
}

type NewsItem = {
  title: string;
  url: string;
  press: string;
  publishedAt: string;
};

export default function TestNewsPage() {
  const [query, setQuery] = useState("");
  const [ticker, setTicker] = useState("");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleCrawl() {
    if (!ticker || !query) return;
    setLoading(true);
    const res = await fetch("/api/news/crawl", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticker, query }),
    });
    const data = await res.json();
    setNews(data.news);
    setLoading(false);
  }

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">뉴스 크롤링 테스트</h1>
      <div className="flex gap-2 mb-6">
        <input
          className="border px-3 py-2 rounded text-black"
          placeholder="ticker (예: 005930)"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
        />
        <input
          className="border px-3 py-2 rounded text-black"
          placeholder="검색어 (예: 삼성전자)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleCrawl}
          disabled={loading}
        >
          {loading ? "크롤링 중..." : "크롤링"}
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {news.map((item) => (
          <div key={item.url} className="border p-4 rounded">
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="font-medium hover:underline"
            >
              {item.title}
            </a>
            <div className="text-sm text-gray-400 mt-1">
              {item.press} · {formatRelativeTime(item.publishedAt)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
