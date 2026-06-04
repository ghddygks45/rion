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
  return data.token;
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
