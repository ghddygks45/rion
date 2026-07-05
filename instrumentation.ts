export async function register() {
  if (
    process.env.NEXT_RUNTIME === "nodejs" &&
    process.env.NODE_ENV === "development"
  ) {
    const { refreshThemesData } = await import(
      "@/app/api/cron/refresh/route"
    );

    refreshThemesData().catch(console.error);

    setInterval(() => {
      refreshThemesData().catch(console.error);
    }, 10 * 60 * 1000);

    console.log("[cron] 로컬 자동갱신 시작 (10분 간격)");
  }
}
