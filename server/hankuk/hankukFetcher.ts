import { getHankukToken } from "./auth";

const PROXY_URL = process.env.HANKUK_BASE_URL;
console.log("1. hankukFetch 진입, PROXY_URL:", !!PROXY_URL);

export async function hankukFetch<T>(
  method: "GET" | "POST" = "POST",
  url: string,
  trId: string,
  params: Record<string, string>,
): Promise<T> {
  if (PROXY_URL) {
    console.log("2.프록시 경로 진입");
    const res = await fetch(`${PROXY_URL}/hankuk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, trId, method, params }),
    });
    console.log("3.프록시 응답", res.status);
    return res.json() as Promise<T>;
  }

  const token = await getHankukToken();
  const baseUrl = `https://openapi.koreainvestment.com:9443${url}`;
  const fullUrl =
    method === "GET"
      ? `${baseUrl}?${new URLSearchParams(params).toString()}`
      : baseUrl;

  const res = await fetch(fullUrl, {
    method,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      authorization: `Bearer ${token}`,
      appkey: process.env.HANKUK_APP_KEY as string,
      appsecret: process.env.HANKUK_APP_SECRET as string,
      tr_id: trId,
      custtype: "P",
    },
    ...(method === "POST" && { body: JSON.stringify(params) }),
  });

  return res.json() as Promise<T>;
}
