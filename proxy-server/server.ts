import express from "express";
import "dotenv/config";

const app = express();
app.use(express.json());

// ── Kiwoom 토큰 ──────────────────────────────────────────
async function getKiwoomToken(): Promise<string> {
  const res = await fetch("https://api.kiwoom.com/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      appkey: process.env.KIWOOM_APP_KEY,
      secretkey: process.env.KIWOOM_APP_SECRET,
    }),
  });
  const data = await res.json();
  console.log("[token response]", JSON.stringify(data));
  return data.token;
}

// ── Hankuk 토큰 ──────────────────────────────────────────
let hankukToken: string | null = null;
let hankukTokenExpiresAt: number = 0;

async function getHankukToken(): Promise<string> {
  if (hankukToken && Date.now() < hankukTokenExpiresAt) {
    return hankukToken;
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
  hankukToken = data.access_token;
  hankukTokenExpiresAt = Date.now() + 23 * 60 * 60 * 1000;
  console.log("[hankuk token issued]");
  return hankukToken as string;
}

// ── 헬스체크 ─────────────────────────────────────────────
app.get("/health", (_, res) => {
  res.json({ ok: true });
});

// ── Kiwoom 프록시: POST /kiwoom ───────────────────────────
// body: { url, apiId, body }
app.post("/kiwoom", async (req, res) => {
  try {
    const { url, apiId, body } = req.body;
    const token = await getKiwoomToken();
    const response = await fetch(`https://api.kiwoom.com${url}`, {
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
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("[kiwoom error]", err);
    res.status(500).json({ error: "kiwoom proxy error" });
  }
});

// ── Hankuk 프록시: POST /hankuk ───────────────────────────
// body: { url, trId, method, params }
app.post("/hankuk", async (req, res) => {
  try {
    const { url, trId, method = "POST", params } = req.body;
    const token = await getHankukToken();
    const baseUrl = `https://openapi.koreainvestment.com:9443${url}`;
    const fullUrl =
      method === "GET"
        ? `${baseUrl}?${new URLSearchParams(params).toString()}`
        : baseUrl;
    const response = await fetch(fullUrl, {
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
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("[hankuk error]", err);
    res.status(500).json({ error: "hankuk proxy error" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
