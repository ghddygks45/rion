import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex-1 flex flex-col">
      {/* 1. NAV (랜딩페이지 전용 - 기존 전역 Header.tsx와 별개) */}
      <nav className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-[clamp(20px,5vw,40px)] py-4">
          <div className="flex items-center gap-2 text-lg font-extrabold tracking-[0.14em] text-text">
            RION
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary sm:gap-8">
            <Link href="#features">기능</Link>
            <Link href="theme">오늘의 테마</Link>
            <Link href="#alerts">알림</Link>
            <Link
              href="/theme"
              className="rounded-lg bg-accent px-4.5 py-2.25 font-semibold text-white"
            >
              무료로 시작
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO */}
      <section className="bg-bg dark:bg-[radial-gradient(130%_80%_at_50%_-10%,rgba(70,85,130,0.35),transparent_55%)]">
        <div className="mx-auto max-w-[900px] px-[clamp(20px,5vw,40px)] pt-[clamp(56px,9vw,96px)] text-center">
          <p className="mb-6 text-[13px] font-semibold uppercase tracking-[0.16em] text-accent">
            한국 주식시장 인텔리전스
          </p>

          <h1 className="text-[clamp(34px,6.2vw,60px)] font-extrabold leading-[1.16] tracking-tight text-text">
            오늘 돈이 몰리는 테마를
            <br />
            가장 먼저 봅니다
          </h1>

          <p className="mx-auto mt-6 max-w-[570px] text-lg leading-relaxed text-text-secondary">
            거래대금·수급·리스크를 한 화면에. 장중 내내 HTS를 들여다볼 필요
            없이, 핵심만 RION이 전합니다.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3.5">
            <Link
              href="/theme"
              className="rounded-[10px] bg-accent px-[30px] py-[15px] text-base font-bold text-white"
            >
              무료로 시작하기
            </Link>
            <Link
              href="#themes"
              className="rounded-[10px] border border-border bg-text/5 px-[30px] py-[15px] text-base font-semibold text-text"
            >
              데모 보기
            </Link>
          </div>
        </div>

        {/* ----- 히어로 하단 제품 미니 프리뷰 (브라우저 창 목업) ----- */}
        <div className="mx-auto mt-[60px] max-w-[1000px] px-[clamp(20px,5vw,40px)]">
          <div className="overflow-hidden rounded-t-2xl border border-border bg-surface shadow-2xl">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3.5">
              <span className="h-2.5 w-2.5 rounded-full bg-text-disabled" />
              <span className="h-2.5 w-2.5 rounded-full bg-text-disabled" />
              <span className="h-2.5 w-2.5 rounded-full bg-text-disabled" />
              <span className="ml-3.5 text-xs text-text-secondary">
                오늘의 테마 · rion
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3.5 p-5 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-bg p-3.5 text-left">
                <div className="mb-1 flex items-baseline justify-between">
                  <span className="text-[13px] font-bold text-text">
                    반도체 생산
                  </span>
                  <span className="text-xs font-bold text-up">+3.8%</span>
                </div>
                <div className="grid grid-cols-[1.4fr_0.9fr_0.8fr] gap-2 py-1 text-xs">
                  <span className="text-text-secondary">SK하이닉스</span>
                  <span className="text-right font-semibold text-text">
                    2,000,000원
                  </span>
                  <span className="text-right font-semibold text-up">
                    +4.5%
                  </span>
                </div>
                <div className="grid grid-cols-[1.4fr_0.9fr_0.8fr] gap-2 py-1 text-xs">
                  <span className="text-text-secondary">삼성전자</span>
                  <span className="text-right font-semibold text-text">
                    310,000원
                  </span>
                  <span className="text-right font-semibold text-up">
                    +4.5%
                  </span>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-bg p-3.5 text-left">
                <div className="mb-1 flex items-baseline justify-between">
                  <span className="text-[13px] font-bold text-text">
                    2차전지
                  </span>
                  <span className="text-xs font-bold text-up">+2.1%</span>
                </div>
                <div className="grid grid-cols-[1.4fr_0.9fr_0.8fr] gap-2 py-1 text-xs">
                  <span className="text-text-secondary">에코프로</span>
                  <span className="text-right font-semibold text-text">
                    620,000원
                  </span>
                  <span className="text-right font-semibold text-up">
                    +1.9%
                  </span>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-bg p-3.5 text-left">
                <div className="mb-1 flex items-baseline justify-between">
                  <span className="text-[13px] font-bold text-text">방산</span>
                  <span className="text-xs font-bold text-up">+4.6%</span>
                </div>
                <div className="grid grid-cols-[1.4fr_0.9fr_0.8fr] gap-2 py-1 text-xs">
                  <span className="text-text-secondary">
                    한화에어로스페이스
                  </span>
                  <span className="text-right font-semibold text-text">
                    450,000원
                  </span>
                  <span className="text-right font-semibold text-up">
                    +5.2%
                  </span>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-bg p-3.5 text-left">
                <div className="mb-1 flex items-baseline justify-between">
                  <span className="text-[13px] font-bold text-text">
                    AI·데이터센터
                  </span>
                  <span className="text-xs font-bold text-down">-0.9%</span>
                </div>
                <div className="grid grid-cols-[1.4fr_0.9fr_0.8fr] gap-2 py-1 text-xs">
                  <span className="text-text-secondary">삼성SDS</span>
                  <span className="text-right font-semibold text-text">
                    155,000원
                  </span>
                  <span className="text-right font-semibold text-down">
                    -1.3%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURES (핵심 기능 6개 카드) */}
      <section
        id="features"
        className="mx-auto max-w-295 px-[clamp(20px,5vw,40px)] pt-[clamp(72px,11vw,104px)] pb-10"
      >
        <div className="mb-14 text-center">
          <p className="mb-4.5 font-mono text-[13px] font-semibold uppercase tracking-[0.16em] text-accent">
            핵심 기능
          </p>
          <h2 className="text-[clamp(28px,4.6vw,42px)] font-extrabold leading-tight tracking-tight text-text">
            장중 내내 화면을 볼 필요 없이,
            <br />
            핵심만 RION이 전합니다
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-[14px] border border-border bg-surface px-6.5 py-7.5">
            <div className="mb-5 flex h-10.5 w-10.5 items-center justify-center rounded-[10px] bg-accent/12">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-accent">
                <rect
                  x="4"
                  y="13"
                  width="3.5"
                  height="7"
                  rx="1"
                  fill="currentColor"
                />
                <rect
                  x="10"
                  y="8"
                  width="3.5"
                  height="12"
                  rx="1"
                  fill="currentColor"
                />
                <rect
                  x="16"
                  y="4"
                  width="3.5"
                  height="16"
                  rx="1"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h3 className="mb-2.5 text-lg font-bold text-text">
              거래대금 기반 테마 분석
            </h3>
            <p className="text-[14.5px] leading-relaxed text-text-secondary">
              오늘 시장에서 돈이 몰리는 테마를 거래대금 순으로 즉시 확인합니다.
            </p>
          </div>

          <div className="rounded-[14px] border border-border bg-surface px-6.5 py-7.5">
            <div className="mb-5 flex h-10.5 w-10.5 items-center justify-center rounded-[10px] bg-accent/12">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-accent">
                <rect
                  x="4"
                  y="4"
                  width="7"
                  height="7"
                  rx="1.5"
                  fill="currentColor"
                />
                <rect
                  x="13"
                  y="4"
                  width="7"
                  height="7"
                  rx="1.5"
                  fill="currentColor"
                  opacity="0.5"
                />
                <rect
                  x="4"
                  y="13"
                  width="7"
                  height="7"
                  rx="1.5"
                  fill="currentColor"
                  opacity="0.5"
                />
                <rect
                  x="13"
                  y="13"
                  width="7"
                  height="7"
                  rx="1.5"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h3 className="mb-2.5 text-lg font-bold text-text">
              대표 종목 자동 분류
            </h3>
            <p className="text-[14.5px] leading-relaxed text-text-secondary">
              테마마다 핵심이 되는 대표 종목을 자동으로 묶어 정리해 보여줍니다.
            </p>
          </div>

          <div className="rounded-[14px] border border-border bg-surface px-6.5 py-7.5">
            <div className="mb-5 flex h-10.5 w-10.5 items-center justify-center rounded-[10px] bg-accent/12">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-accent">
                <circle cx="7" cy="8" r="3" fill="currentColor" />
                <circle cx="17" cy="16" r="3" fill="currentColor" />
                <path
                  d="M7 11v3a2 2 0 0 0 2 2h5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  fill="none"
                />
              </svg>
            </div>
            <h3 className="mb-2.5 text-lg font-bold text-text">
              기관·외국인·프로그램 수급
            </h3>
            <p className="text-[14.5px] leading-relaxed text-text-secondary">
              누가 사고 누가 파는지, 수급 주체를 한 화면에서 바로 확인합니다.
            </p>
          </div>

          <div className="rounded-[14px] border border-border bg-surface px-6.5 py-7.5">
            <div className="mb-5 flex h-10.5 w-10.5 items-center justify-center rounded-[10px] bg-accent/12">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-accent">
                <path
                  d="M12 4l8 15H4z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <rect
                  x="11.1"
                  y="9"
                  width="1.8"
                  height="5"
                  rx="0.9"
                  fill="currentColor"
                />
                <circle cx="12" cy="16.5" r="1" fill="currentColor" />
              </svg>
            </div>
            <h3 className="mb-2.5 text-lg font-bold text-text">
              투자주의·단기과열 모니터링
            </h3>
            <p className="text-[14.5px] leading-relaxed text-text-secondary">
              투자주의·경고·단기과열 예상 종목을 사전에 체크해 리스크를
              줄입니다.
            </p>
          </div>

          <div className="rounded-[14px] border border-border bg-surface px-6.5 py-7.5">
            <div className="mb-5 flex h-10.5 w-10.5 items-center justify-center rounded-[10px] bg-accent/12">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-accent">
                <circle
                  cx="12"
                  cy="12"
                  r="7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <circle cx="12" cy="12" r="2.4" fill="currentColor" />
              </svg>
            </div>
            <h3 className="mb-2.5 text-lg font-bold text-text">
              관심 종목 가격·등락률 알림
            </h3>
            <p className="text-[14.5px] leading-relaxed text-text-secondary">
              지켜보지 않아도 관심 종목이 움직이면 푸시 알림으로 알려드립니다.
            </p>
          </div>

          <div className="rounded-[14px] border border-border bg-surface px-6.5 py-7.5">
            <div className="mb-5 flex h-10.5 w-10.5 items-center justify-center rounded-[10px] bg-accent/12">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-accent">
                <rect
                  x="4"
                  y="5"
                  width="16"
                  height="14"
                  rx="2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path d="M4 9h16" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="6.5" cy="7" r="0.8" fill="currentColor" />
              </svg>
            </div>
            <h3 className="mb-2.5 text-lg font-bold text-text">
              핵심만, 한 화면에
            </h3>
            <p className="text-[14.5px] leading-relaxed text-text-secondary">
              장중 내내 HTS·MTS를 들여다볼 필요 없이 꼭 필요한 정보만
              전달합니다.
            </p>
          </div>
        </div>
      </section>

      {/* 4. 오늘의 테마 데모 (id=themes) */}
      <section
        id="themes"
        className="dark:bg-[radial-gradient(120%_50%_at_50%_0%,rgba(40,52,80,0.18),transparent_60%)]"
      >
        <div className="mx-auto max-w-295 px-[clamp(20px,5vw,40px)] pt-[clamp(56px,9vw,80px)] pb-10">
          <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            오늘의 테마
          </p>

          <div className="mb-6 flex flex-wrap items-end justify-between gap-4.5">
            <div>
              <h2 className="mb-2.5 text-[34px] font-extrabold leading-tight tracking-tight text-text">
                돈이 몰리는 곳,
                <br />
                그리고 그 안의 수급까지
              </h2>
              <p className="max-w-[540px] text-base leading-relaxed text-text-secondary">
                오늘 시장에서 거래대금이 몰린 테마를 순서대로. 테마별 대표
                종목을 자동으로 묶고, 그 종목들의 수급까지 한 화면에서 봅니다.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-accent px-4 py-2.25 text-[13px] font-semibold text-white">
                거래대금 상위
              </span>
              <span className="rounded-lg border border-border bg-text/5 px-4 py-2.25 text-[13px] font-semibold text-text-secondary">
                테마 상승률 상위
              </span>
              <span className="rounded-lg border border-border bg-text/5 px-4 py-2.25 text-[13px] font-semibold text-text-secondary">
                현재가
              </span>
              <span className="rounded-lg border border-border bg-text/5 px-4 py-2.25 text-[13px] font-semibold text-text-secondary">
                수급
              </span>
            </div>
          </div>

          {/* 테마 9개 카드 그리드 (거래대금 상위 · 현재가 뷰) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-[10px] border border-border bg-surface px-4.5 py-4">
              <div className="mb-3 flex items-baseline justify-between">
                <span className="text-sm font-bold text-text">반도체 생산</span>
                <span className="text-[13px] font-bold text-up">+3.8%</span>
              </div>
              <div className="mb-[5px] grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] gap-x-2 gap-y-1.5 border-b border-border pb-[7px] text-[11px] text-text-secondary">
                <span>종목명</span>
                <span className="text-right">가격</span>
                <span className="text-right">등락률</span>
                <span className="text-right">거래대금</span>
              </div>
              <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] gap-x-2 gap-y-1.5 py-1.5 text-[12.5px]">
                <span className="text-text-secondary">SK하이닉스</span>
                <span className="text-right font-semibold text-text">
                  210,000원
                </span>
                <span className="text-right font-semibold text-up">+4.5%</span>
                <span className="text-right text-text-secondary">1.8조</span>
              </div>
              <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] gap-x-2 gap-y-1.5 py-1.5 text-[12.5px]">
                <span className="text-text-secondary">삼성전자</span>
                <span className="text-right font-semibold text-text">
                  78,500원
                </span>
                <span className="text-right font-semibold text-up">+2.1%</span>
                <span className="text-right text-text-secondary">9,400억</span>
              </div>
            </div>

            <div className="rounded-[10px] border border-border bg-surface px-4.5 py-4">
              <div className="mb-3 flex items-baseline justify-between">
                <span className="text-sm font-bold text-text">
                  휴대폰 수동부품
                </span>
                <span className="text-[13px] font-bold text-up">+2.6%</span>
              </div>
              <div className="mb-[5px] grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] gap-x-2 gap-y-1.5 border-b border-border pb-[7px] text-[11px] text-text-secondary">
                <span>종목명</span>
                <span className="text-right">가격</span>
                <span className="text-right">등락률</span>
                <span className="text-right">거래대금</span>
              </div>
              <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] gap-x-2 gap-y-1.5 py-1.5 text-[12.5px]">
                <span className="text-text-secondary">삼화콘덴서</span>
                <span className="text-right font-semibold text-text">
                  45,300원
                </span>
                <span className="text-right font-semibold text-up">+6.2%</span>
                <span className="text-right text-text-secondary">3,100억</span>
              </div>
              <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] gap-x-2 gap-y-1.5 py-1.5 text-[12.5px]">
                <span className="text-text-secondary">삼성전기</span>
                <span className="text-right font-semibold text-text">
                  152,000원
                </span>
                <span className="text-right font-semibold text-up">+1.8%</span>
                <span className="text-right text-text-secondary">2,200억</span>
              </div>
            </div>

            <div className="rounded-[10px] border border-border bg-surface px-4.5 py-4">
              <div className="mb-3 flex items-baseline justify-between">
                <span className="text-sm font-bold text-text">보험</span>
                <span className="text-[13px] font-bold text-up">+1.4%</span>
              </div>
              <div className="mb-[5px] grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] gap-x-2 gap-y-1.5 border-b border-border pb-[7px] text-[11px] text-text-secondary">
                <span>종목명</span>
                <span className="text-right">가격</span>
                <span className="text-right">등락률</span>
                <span className="text-right">거래대금</span>
              </div>
              <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] gap-x-2 gap-y-1.5 py-1.5 text-[12.5px]">
                <span className="text-text-secondary">삼성생명</span>
                <span className="text-right font-semibold text-text">
                  92,000원
                </span>
                <span className="text-right font-semibold text-up">+1.9%</span>
                <span className="text-right text-text-secondary">1,500억</span>
              </div>
              <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] gap-x-2 gap-y-1.5 py-1.5 text-[12.5px]">
                <span className="text-text-secondary">삼성화재</span>
                <span className="text-right font-semibold text-text">
                  310,000원
                </span>
                <span className="text-right font-semibold text-up">+1.1%</span>
                <span className="text-right text-text-secondary">980억</span>
              </div>
            </div>

            <div className="rounded-[10px] border border-border bg-surface px-4.5 py-4">
              <div className="mb-3 flex items-baseline justify-between">
                <span className="text-sm font-bold text-text">
                  스마트그리드
                </span>
                <span className="text-[13px] font-bold text-up">+2.9%</span>
              </div>
              <div className="mb-[5px] grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] gap-x-2 gap-y-1.5 border-b border-border pb-[7px] text-[11px] text-text-secondary">
                <span>종목명</span>
                <span className="text-right">가격</span>
                <span className="text-right">등락률</span>
                <span className="text-right">거래대금</span>
              </div>
              <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] gap-x-2 gap-y-1.5 py-1.5 text-[12.5px]">
                <span className="text-text-secondary">삼화콘덴서</span>
                <span className="text-right font-semibold text-text">
                  45,300원
                </span>
                <span className="text-right font-semibold text-up">+6.2%</span>
                <span className="text-right text-text-secondary">3,100억</span>
              </div>
              <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] gap-x-2 gap-y-1.5 py-1.5 text-[12.5px]">
                <span className="text-text-secondary">LS일렉트릭</span>
                <span className="text-right font-semibold text-text">
                  185,000원
                </span>
                <span className="text-right font-semibold text-up">+3.4%</span>
                <span className="text-right text-text-secondary">2,600억</span>
              </div>
            </div>

            <div className="rounded-[10px] border border-border bg-surface px-4.5 py-4">
              <div className="mb-3 flex items-baseline justify-between">
                <span className="text-sm font-bold text-text">스마트폰</span>
                <span className="text-[13px] font-bold text-up">+2.2%</span>
              </div>
              <div className="mb-[5px] grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] gap-x-2 gap-y-1.5 border-b border-border pb-[7px] text-[11px] text-text-secondary">
                <span>종목명</span>
                <span className="text-right">가격</span>
                <span className="text-right">등락률</span>
                <span className="text-right">거래대금</span>
              </div>
              <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] gap-x-2 gap-y-1.5 py-1.5 text-[12.5px]">
                <span className="text-text-secondary">삼성전자</span>
                <span className="text-right font-semibold text-text">
                  78,500원
                </span>
                <span className="text-right font-semibold text-up">+2.1%</span>
                <span className="text-right text-text-secondary">9,400억</span>
              </div>
              <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] gap-x-2 gap-y-1.5 py-1.5 text-[12.5px]">
                <span className="text-text-secondary">삼성전기</span>
                <span className="text-right font-semibold text-text">
                  152,000원
                </span>
                <span className="text-right font-semibold text-up">+1.8%</span>
                <span className="text-right text-text-secondary">2,200억</span>
              </div>
            </div>

            <div className="rounded-[10px] border border-border bg-surface px-4.5 py-4">
              <div className="mb-3 flex items-baseline justify-between">
                <span className="text-sm font-bold text-text">애플 관련주</span>
                <span className="text-[13px] font-bold text-up">+3.1%</span>
              </div>
              <div className="mb-[5px] grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] gap-x-2 gap-y-1.5 border-b border-border pb-[7px] text-[11px] text-text-secondary">
                <span>종목명</span>
                <span className="text-right">가격</span>
                <span className="text-right">등락률</span>
                <span className="text-right">거래대금</span>
              </div>
              <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] gap-x-2 gap-y-1.5 py-1.5 text-[12.5px]">
                <span className="text-text-secondary">LG이노텍</span>
                <span className="text-right font-semibold text-text">
                  320,000원
                </span>
                <span className="text-right font-semibold text-up">+3.9%</span>
                <span className="text-right text-text-secondary">1,700억</span>
              </div>
              <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] gap-x-2 gap-y-1.5 py-1.5 text-[12.5px]">
                <span className="text-text-secondary">비에이치</span>
                <span className="text-right font-semibold text-text">
                  18,200원
                </span>
                <span className="text-right font-semibold text-up">+5.4%</span>
                <span className="text-right text-text-secondary">640억</span>
              </div>
            </div>

            <div className="rounded-[10px] border border-border bg-surface px-4.5 py-4">
              <div className="mb-3 flex items-baseline justify-between">
                <span className="text-sm font-bold text-text">
                  온실가스배출저감
                </span>
                <span className="text-[13px] font-bold text-up">+4.0%</span>
              </div>
              <div className="mb-[5px] grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] gap-x-2 gap-y-1.5 border-b border-border pb-[7px] text-[11px] text-text-secondary">
                <span>종목명</span>
                <span className="text-right">가격</span>
                <span className="text-right">등락률</span>
                <span className="text-right">거래대금</span>
              </div>
              <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] gap-x-2 gap-y-1.5 py-1.5 text-[12.5px]">
                <span className="text-text-secondary">두산에너빌리티</span>
                <span className="text-right font-semibold text-text">
                  24,500원
                </span>
                <span className="text-right font-semibold text-up">+5.1%</span>
                <span className="text-right text-text-secondary">4,200억</span>
              </div>
              <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] gap-x-2 gap-y-1.5 py-1.5 text-[12.5px]">
                <span className="text-text-secondary">후성</span>
                <span className="text-right font-semibold text-text">
                  12,800원
                </span>
                <span className="text-right font-semibold text-up">+7.3%</span>
                <span className="text-right text-text-secondary">2,900억</span>
              </div>
            </div>

            <div className="rounded-[10px] border border-border bg-surface px-4.5 py-4">
              <div className="mb-3 flex items-baseline justify-between">
                <span className="text-sm font-bold text-text">카메라</span>
                <span className="text-[13px] font-bold text-up">+2.5%</span>
              </div>
              <div className="mb-[5px] grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] gap-x-2 gap-y-1.5 border-b border-border pb-[7px] text-[11px] text-text-secondary">
                <span>종목명</span>
                <span className="text-right">가격</span>
                <span className="text-right">등락률</span>
                <span className="text-right">거래대금</span>
              </div>
              <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] gap-x-2 gap-y-1.5 py-1.5 text-[12.5px]">
                <span className="text-text-secondary">삼성전기</span>
                <span className="text-right font-semibold text-text">
                  152,000원
                </span>
                <span className="text-right font-semibold text-up">+1.8%</span>
                <span className="text-right text-text-secondary">2,200억</span>
              </div>
              <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] gap-x-2 gap-y-1.5 py-1.5 text-[12.5px]">
                <span className="text-text-secondary">LG이노텍</span>
                <span className="text-right font-semibold text-text">
                  320,000원
                </span>
                <span className="text-right font-semibold text-up">+3.9%</span>
                <span className="text-right text-text-secondary">1,700억</span>
              </div>
            </div>

            <div className="rounded-[10px] border border-border bg-surface px-4.5 py-4">
              <div className="mb-3 flex items-baseline justify-between">
                <span className="text-sm font-bold text-text">
                  그린카·전기차
                </span>
                <span className="text-[13px] font-bold text-up">+2.1%</span>
              </div>
              <div className="mb-[5px] grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] gap-x-2 gap-y-1.5 border-b border-border pb-[7px] text-[11px] text-text-secondary">
                <span>종목명</span>
                <span className="text-right">가격</span>
                <span className="text-right">등락률</span>
                <span className="text-right">거래대금</span>
              </div>
              <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] gap-x-2 gap-y-1.5 py-1.5 text-[12.5px]">
                <span className="text-text-secondary">현대차</span>
                <span className="text-right font-semibold text-text">
                  245,000원
                </span>
                <span className="text-right font-semibold text-up">+1.8%</span>
                <span className="text-right text-text-secondary">5,300억</span>
              </div>
              <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] gap-x-2 gap-y-1.5 py-1.5 text-[12.5px]">
                <span className="text-text-secondary">현대모비스</span>
                <span className="text-right font-semibold text-text">
                  215,000원
                </span>
                <span className="text-right font-semibold text-up">+2.4%</span>
                <span className="text-right text-text-secondary">2,100억</span>
              </div>
            </div>
          </div>

          {/* 테마 종목 수급 미니 위젯 */}
          <div className="mt-5.5 overflow-hidden rounded-xl border border-border bg-surface">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4.5 py-3.5">
              <span className="text-[13px] font-bold text-text">
                테마 종목 수급{" "}
                <span className="font-medium text-text-secondary">
                  · 기관 · 외국인 · 프로그램
                </span>
              </span>
              <span className="text-[11px] text-text-secondary">
                순매수 <span className="font-bold text-up">빨강</span> · 순매도{" "}
                <span className="font-bold text-down">파랑</span>
              </span>
            </div>

            <div className="px-4.5">
              <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-2 border-b border-border py-2 text-[11px] text-text-secondary">
                <span>종목명</span>
                <span className="text-right">기관</span>
                <span className="text-right">외국인</span>
                <span className="text-right">프로그램</span>
              </div>

              <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-2 border-b border-border py-2 text-[12.5px]">
                <span className="font-semibold text-text">SK하이닉스</span>
                <span className="text-right font-semibold text-up">
                  +1,240억
                </span>
                <span className="text-right font-semibold text-up">
                  +3,580억
                </span>
                <span className="text-right font-semibold text-up">+890억</span>
              </div>
              <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-2 border-b border-border py-2 text-[12.5px]">
                <span className="font-semibold text-text">삼성전자</span>
                <span className="text-right font-semibold text-down">
                  -620억
                </span>
                <span className="text-right font-semibold text-up">
                  +2,140억
                </span>
                <span className="text-right font-semibold text-down">
                  -310억
                </span>
              </div>
              <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-2 border-b border-border py-2 text-[12.5px]">
                <span className="font-semibold text-text">삼화콘덴서</span>
                <span className="text-right font-semibold text-up">+210억</span>
                <span className="text-right font-semibold text-up">+85억</span>
                <span className="text-right font-semibold text-up">+44억</span>
              </div>
              <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-2 border-b border-border py-2 text-[12.5px]">
                <span className="font-semibold text-text">LG이노텍</span>
                <span className="text-right font-semibold text-down">
                  -120억
                </span>
                <span className="text-right font-semibold text-up">+330억</span>
                <span className="text-right font-semibold text-up">+12억</span>
              </div>
              <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-2 py-2 text-[12.5px]">
                <span className="font-semibold text-text">두산에너빌리티</span>
                <span className="text-right font-semibold text-up">+540억</span>
                <span className="text-right font-semibold text-down">
                  -180억
                </span>
                <span className="text-right font-semibold text-up">+76억</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 투자유의 모니터링 */}
      <section className="border-t border-border">
        <div className="mx-auto grid max-w-295 grid-cols-1 items-center gap-8 px-[clamp(20px,5vw,40px)] py-16 lg:grid-cols-2 lg:gap-14 lg:py-24">
          <div>
            <p className="mb-4.5 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-accent">
              투자주의·투자경고·단기과열 모니터링
            </p>
            <h2 className="mb-4 text-[clamp(28px,4.6vw,38px)] font-extrabold leading-tight tracking-tight text-text">
              종가베팅 전에,
              <br />
              다음날 하락 위험부터 거른다
            </h2>
            <p className="mb-6 text-base leading-relaxed text-text-secondary">
              투자주의·투자경고·단기과열로 지정됐거나 지정이 예상되는 종목은
              다음날 하락 가능성이 큽니다. 종가에 담기 전, 위험 종목부터
              걸러내세요.
            </p>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                투자주의·투자경고·단기과열 지정/예상 표시
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                종가베팅 시 다음날 하락 리스크 회피
              </li>
            </ul>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-4.5 py-3.5">
              <span className="text-[13px] font-bold text-text">
                투자유의 종목
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-text-secondary">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                실시간 감시
              </span>
            </div>

            <div className="px-4.5">
              <div className="flex items-center justify-between gap-3 border-b border-border py-3.25">
                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-accent/10 px-2.25 py-1 text-[11px] font-bold text-accent">
                    단기과열
                  </span>
                  <div>
                    <div className="text-[13.5px] font-semibold text-text">
                      삼화콘덴서
                    </div>
                    <div className="mt-0.5 text-[11.5px] text-text-secondary">
                      지정 예상
                    </div>
                  </div>
                </div>
                <span className="text-[13.5px] font-bold text-up">+21.53%</span>
              </div>

              <div className="flex items-center justify-between gap-3 border-b border-border py-3.25">
                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-up/10 px-2.25 py-1 text-[11px] font-bold text-up">
                    투자경고
                  </span>
                  <div>
                    <div className="text-[13.5px] font-semibold text-text">
                      에코프로
                    </div>
                    <div className="mt-0.5 text-[11.5px] text-text-secondary">
                      지정
                    </div>
                  </div>
                </div>
                <span className="text-[13.5px] font-bold text-down">
                  -4.56%
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 border-b border-border py-3.25">
                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-primary/10 px-2.25 py-1 text-[11px] font-bold text-primary">
                    투자주의
                  </span>
                  <div>
                    <div className="text-[13.5px] font-semibold text-text">
                      후성
                    </div>
                    <div className="mt-0.5 text-[11.5px] text-text-secondary">
                      지정 예상
                    </div>
                  </div>
                </div>
                <span className="text-[13.5px] font-bold text-up">+7.17%</span>
              </div>

              <div className="flex items-center justify-between gap-3 py-3.25">
                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-primary/10 px-2.25 py-1 text-[11px] font-bold text-primary">
                    투자주의
                  </span>
                  <div>
                    <div className="text-[13.5px] font-semibold text-text">
                      삼성생명
                    </div>
                    <div className="mt-0.5 text-[11.5px] text-text-secondary">
                      지정
                    </div>
                  </div>
                </div>
                <span className="text-[13.5px] font-bold text-up">+5.59%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. 실시간 푸시 알림 (id=alerts) */}
      <section id="alerts" className="border-t border-border">
        <div className="mx-auto grid max-w-295 grid-cols-1 items-center gap-8 px-[clamp(20px,5vw,40px)] py-16 lg:grid-cols-2 lg:gap-14 lg:py-24">
          <div>
            <p className="mb-4.5 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-accent">
              실시간 푸시 알림
            </p>
            <h2 className="mb-4 text-[clamp(28px,4.6vw,38px)] font-extrabold leading-tight tracking-tight text-text">
              주식창 안 봐도,
              <br />폰 알림으로 시세 확인
            </h2>
            <p className="mb-6 text-base leading-relaxed text-text-secondary">
              관심 종목을 등록해두면 RION이 몇 분·몇 시간 간격으로 현재가와
              등락률을 푸시 알림으로 보내드려요. 직장에서 모니터를 못 봐도
              흐름을 놓치지 않습니다.
            </p>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                등록 종목의 현재가·등락률을 주기적으로 푸시
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                자리를 비워도 카톡 알림처럼 바로 확인
              </li>
            </ul>
          </div>

          <div className="flex justify-center">
            <div
              className="w-[300px] rounded-[38px] border border-white/10 px-3 pt-3.5 pb-6 shadow-[0_36px_70px_rgba(0,0,0,0.5)]"
              style={{
                background: "linear-gradient(165deg, #202840, #0a0c12 70%)",
              }}
            >
              {/* 상태바 */}
              <div className="flex items-center justify-between px-4.5 pt-1.5 pb-2.5">
                <span className="text-sm font-bold text-white">2:48</span>
                <div className="flex items-center gap-1.5">
                  <span className="flex items-end gap-0.5">
                    <span className="h-1.25 w-0.75 rounded-[1px] bg-white" />
                    <span className="h-1.75 w-0.75 rounded-[1px] bg-white" />
                    <span className="h-2.25 w-0.75 rounded-[1px] bg-white" />
                  </span>
                  <span className="flex h-2.5 w-5 items-center rounded-[3px] border border-white/70 p-px">
                    <span className="block h-full w-3 rounded-[1px] bg-white" />
                  </span>
                </div>
              </div>

              {/* 잠금화면 시계 */}
              <div className="mt-3.5 mb-5.5 text-center">
                <div className="text-[13px] font-medium text-white/65">
                  6월 18일 목요일
                </div>
                <div className="mt-0.5 text-[58px] font-light leading-[1.05] tracking-[-0.02em] text-white">
                  2:48
                </div>
              </div>

              {/* 알림 리스트 */}
              <div className="flex flex-col gap-2.25 px-1.5">
                <div className="flex items-center gap-2.75 rounded-[17px] border border-white/[0.08] bg-[rgba(40,42,52,0.85)] px-3.25 py-2.75">
                  <span
                    className="flex h-8.5 w-8.5 flex-none items-center justify-center rounded-[9px] text-base font-extrabold text-white"
                    style={{
                      background: "linear-gradient(150deg, #fb5e0b, #d6480a)",
                    }}
                  >
                    R
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="mb-0.75 flex items-center justify-between">
                      <span className="text-[11px] font-bold tracking-[0.06em] text-white">
                        RION
                      </span>
                      <span className="text-[10.5px] text-white/50">방금</span>
                    </div>
                    <div className="text-[12.5px] text-[#e8eaed]">
                      <b className="text-white">삼화콘덴서</b> 184,000원{" "}
                      <span className="font-bold text-up">+21.53%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.75 rounded-[17px] border border-white/[0.08] bg-[rgba(40,42,52,0.85)] px-3.25 py-2.75">
                  <span
                    className="flex h-8.5 w-8.5 flex-none items-center justify-center rounded-[9px] text-base font-extrabold text-white"
                    style={{
                      background: "linear-gradient(150deg, #fb5e0b, #d6480a)",
                    }}
                  >
                    R
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="mb-0.75 flex items-center justify-between">
                      <span className="text-[11px] font-bold tracking-[0.06em] text-white">
                        RION
                      </span>
                      <span className="text-[10.5px] text-white/50">
                        오후 2:30
                      </span>
                    </div>
                    <div className="text-[12.5px] text-[#e8eaed]">
                      <b className="text-white">SK하이닉스</b> 2,690,000원{" "}
                      <span className="font-bold text-up">+6.70%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.75 rounded-[17px] border border-white/[0.08] bg-[rgba(40,42,52,0.85)] px-3.25 py-2.75">
                  <span
                    className="flex h-8.5 w-8.5 flex-none items-center justify-center rounded-[9px] text-base font-extrabold text-white"
                    style={{
                      background: "linear-gradient(150deg, #fb5e0b, #d6480a)",
                    }}
                  >
                    R
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="mb-0.75 flex items-center justify-between">
                      <span className="text-[11px] font-bold tracking-[0.06em] text-white">
                        RION
                      </span>
                      <span className="text-[10.5px] text-white/50">
                        오후 2:00
                      </span>
                    </div>
                    <div className="text-[12.5px] text-[#e8eaed]">
                      <b className="text-white">삼성전자</b> 362,000원{" "}
                      <span className="font-bold text-up">+4.47%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.75 rounded-[17px] border border-white/[0.08] bg-[rgba(40,42,52,0.85)] px-3.25 py-2.75">
                  <span
                    className="flex h-8.5 w-8.5 flex-none items-center justify-center rounded-[9px] text-base font-extrabold text-white"
                    style={{
                      background: "linear-gradient(150deg, #fb5e0b, #d6480a)",
                    }}
                  >
                    R
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="mb-0.75 flex items-center justify-between">
                      <span className="text-[11px] font-bold tracking-[0.06em] text-white">
                        RION
                      </span>
                      <span className="text-[10.5px] text-white/50">
                        오후 1:30
                      </span>
                    </div>
                    <div className="text-[12.5px] text-[#e8eaed]">
                      <b className="text-white">후성</b> 18,840원{" "}
                      <span className="font-bold text-up">+7.17%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. 하단 CTA */}
      <section
        id="cta"
        className="bg-[radial-gradient(70%_120%_at_50%_100%,rgba(251,94,11,0.16),transparent_60%)] px-[clamp(20px,5vw,40px)] pt-[clamp(72px,11vw,96px)] pb-[clamp(80px,12vw,104px)] text-center"
      >
        <h2 className="text-[clamp(30px,5.2vw,46px)] font-extrabold leading-[1.2] tracking-tight text-text">
          오늘의 테마,
          <br />
          지금 확인하세요
        </h2>
        <p className="mx-auto mt-5.5 max-w-[480px] text-[17px] leading-relaxed text-text-secondary">
          신용카드 없이 무료로 시작. 종가베팅 전에 시장의 돈 흐름부터
          확인하세요.
        </p>
        <div className="mt-9">
          <Link
            href="/theme"
            className="inline-block rounded-[10px] bg-accent px-10 py-4 text-[17px] font-bold text-white"
          >
            무료로 시작하기
          </Link>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-295 flex-wrap items-center justify-between gap-4 px-10 py-9">
          <div className="flex items-center gap-2.25 text-[17px] font-extrabold tracking-[0.14em] text-text-secondary">
            RION
            <span className="mb-2.25 h-1.25 w-1.25 rounded-full bg-accent" />
          </div>

          <div className="flex gap-6 text-[13px] text-text-secondary">
            <Link href="#features">기능</Link>
            <Link href="#themes">오늘의 테마</Link>
            <Link href="#">고객센터</Link>
            <Link href="#">이용약관</Link>
          </div>

          <div className="max-w-[340px] text-right text-[11.5px] text-text-disabled">
            본 서비스는 투자 참고용 정보이며 투자 권유가 아닙니다. © 2026 RION
          </div>
        </div>
      </footer>
    </main>
  );
}
