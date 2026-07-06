function isWithinCollectionWindow(): boolean {
  const kstNow = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const minutesSinceMidnight =
    kstNow.getUTCHours() * 60 + kstNow.getUTCMinutes();
  return (
    minutesSinceMidnight >= 8 * 60 + 5 && minutesSinceMidnight < 20 * 60 + 15
  );
}

export async function register() {
  if (
    process.env.NEXT_RUNTIME === "nodejs" &&
    process.env.NODE_ENV === "development"
  ) {
    const { refreshThemesData } = await import("@/app/api/cron/refresh/route");

    const runIfWithinWindow = () => {
      if (!isWithinCollectionWindow()) {
        console.log("[cron] 수집 시간대(08:05~20:15) 아님 - 스킵");
        return;
      }
      refreshThemesData().catch(console.error);
    };

    runIfWithinWindow();
    setInterval(runIfWithinWindow, 10 * 60 * 1000);

    console.log("[cron] 로컬 자동갱신 시작 (10분 간격, 08:05~20:15만 동작)");
  }
}
