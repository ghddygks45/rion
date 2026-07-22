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

app.get("/debug", (_, res) => {
  res.json({
    hankukToken: !!hankukToken,
    expiresAt: new Date(hankukTokenExpiresAt).toISOString(),
  });
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

// 10분마다 Vercel cron 엔드포인트 호출 → 테마/수급 데이터 자동 갱신 (08:05~20:15만 동작)
const VERCEL_URL = process.env.VERCEL_URL;
const CRON_SECRET = process.env.CRON_SECRET;
const CRON_INTERVAL_MS = 10 * 60 * 1000;

function isWithinCollectionWindow(): boolean {
  const kstNow = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const minutesSinceMidnight =
    kstNow.getUTCHours() * 60 + kstNow.getUTCMinutes();
  return (
    minutesSinceMidnight >= 8 * 60 + 5 && minutesSinceMidnight < 20 * 60 + 15
  );
}

if (VERCEL_URL && CRON_SECRET) {
  setInterval(async () => {
    if (!isWithinCollectionWindow()) {
      console.log("[cron] 수집 시간대(08:05~20:15) 아님 - 스킵");
      return;
    }
    try {
      const res = await fetch(`${VERCEL_URL}/api/cron/refresh`, {
        headers: { authorization: `Bearer ${CRON_SECRET}` },
      });
      console.log(`[cron] refresh → ${res.status}`);
    } catch (err) {
      console.error("[cron] refresh failed:", err);
    }
  }, CRON_INTERVAL_MS);
  console.log(
    `[cron] 10분마다 ${VERCEL_URL}/api/cron/refresh 호출 시작 (08:05~20:15만 동작)`,
  );
}

// ── 종목 마스터(코드↔이름) 동기화: 장중엔 안 바뀌는 데이터라 하루 1번, 08:00 KST에만 호출 ──
// 반복 폴링(setInterval) 대신, "다음 08:00까지 남은 시간"만큼 한 번 타이머를 걸어두고
// 실행 후 다시 다음 날 08:00으로 재예약하는 방식이라 평소엔 아무 타이머도 돌지 않는다.
function getMsUntilNextKst8am(): number {
  const kstNow = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const nextKst8am = new Date(kstNow);
  nextKst8am.setUTCHours(8, 0, 0, 0);
  if (nextKst8am <= kstNow) {
    nextKst8am.setUTCDate(nextKst8am.getUTCDate() + 1);
  }
  return nextKst8am.getTime() - kstNow.getTime();
}

function scheduleStockMasterSync() {
  const delayMs = getMsUntilNextKst8am();
  console.log(
    `[cron] 다음 stocks/sync 예약: ${Math.round(delayMs / 60000)}분 후 (08:00 KST)`,
  );
  setTimeout(async () => {
    try {
      const res = await fetch(`${VERCEL_URL}/api/stocks/sync`, {
        headers: { authorization: `Bearer ${CRON_SECRET}` },
      });
      console.log(`[cron] stocks/sync → ${res.status}`);
    } catch (err) {
      console.error("[cron] stocks/sync failed:", err);
    } finally {
      scheduleStockMasterSync(); // 다음 날 08:00으로 재예약
    }
  }, delayMs);
}

if (VERCEL_URL && CRON_SECRET) {
  scheduleStockMasterSync();
}
