import { getHankukToken } from "./auth";

export async function hankukFetch<T>(
  method: "GET" | "POST" = "POST",
  url: string,
  trId: string,
  params: Record<string, string>,
): Promise<T> {
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
