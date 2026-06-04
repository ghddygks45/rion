import { getKiwoomToken } from "./auth";

const PROXY_URL = process.env.KIWOOM_BASE_URL;

export async function kiwoomFetch<T>(
  url: string,
  apiId: string,
  body: Record<string, string>,
): Promise<T> {
  if (PROXY_URL) {
    const res = await fetch(`${PROXY_URL}/kiwoom`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, apiId, body }),
    });
    return res.json() as Promise<T>;
  }

  const token = await getKiwoomToken();
  const res = await fetch(`https://api.kiwoom.com${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      authorization: `Bearer ${token}`,
      "api-id": apiId,
      "cont-yn": "N",
      "next-key": "N",
    },
    body: JSON.stringify(body),
  });
  return res.json() as Promise<T>;
}
