let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;

export async function getHankukToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  const res = await fetch(
    "https://openapi.koreainvestment.com:9443/oauth2/tokenP",
    {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      body: JSON.stringify({
        grant_type: "client_credentials",
        appkey: process.env.HANKUK_APP_KEY,
        appsecret: process.env.HANKUK_APP_SECRET,
      }),
    },
  );

  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + 23 * 60 * 60 * 1000; // 23시간 (만료 1시간 전 갱신)
  console.log("한국 토큰", data);
  return cachedToken as string;
}
