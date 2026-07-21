export type ResponseBodyOutput = {
  bstp_nmix_prpr: string;
  bstp_nmix_prdy_vrss: string;
  prdy_vrss_sign: string;
  bstp_nmix_prdy_ctrt: string;
  acml_vol: string;
  prdy_vol: string;
  acml_tr_pbmn: string;
  prdy_tr_pbmn: string;
  bstp_nmix_oprc: string;
  prdy_nmix_vrss_nmix_oprc: string;
  oprc_vrss_prpr_sign: string;
  bstp_nmix_oprc_prdy_ctrt: string;
  bstp_nmix_hgpr: string;
  prdy_nmix_vrss_nmix_hgpr: string;
  hgpr_vrss_prpr_sign: string;
  bstp_nmix_hgpr_prdy_ctrt: string;
  bstp_nmix_lwpr: string;
  prdy_clpr_vrss_lwpr: string;
  lwpr_vrss_prpr_sign: string;
  prdy_clpr_vrss_lwpr_rate: string;
  ascn_issu_cnt: string;
  uplm_issu_cnt: string;
  stnr_issu_cnt: string;
  down_issu_cnt: string;
  lslm_issu_cnt: string;
  dryy_bstp_nmix_hgpr: string;
  dryy_hgpr_vrss_prpr_rate: string;
  dryy_bstp_nmix_hgpr_date: string;
  dryy_bstp_nmix_lwpr: string;
  dryy_lwpr_vrss_prpr_rate: string;
  dryy_bstp_nmix_lwpr_date: string;
  total_askp_rsqn: string;
  total_bidp_rsqn: string;
  seln_rsqn_rate: string;
  shnu_rsqn_rate: string;
  ntby_rsqn: string;
};

export type MarketIndexResponse = {
  bstp_nmix_prpr: string; // 업종 지수 현재가
  bstp_nmix_prdy_vrss: string; // 업종 지수 전일 대비
  prdy_vrss_sign: string; // 전일 대비 부호
  bstp_nmix_prdy_ctrt: string; // 업종 지수 전일 대비율

  acml_vol: string; // 누적 거래량
  prdy_vol: string; // 전일 거래량

  acml_tr_pbmn: string; // 누적 거래 대금
  prdy_tr_pbmn: string; // 전일 거래 대금

  bstp_nmix_oprc: string; // 업종 지수 시가2
  prdy_nmix_vrss_nmix_oprc: string; // 전일 지수 대비 지수 시가2
  oprc_vrss_prpr_sign: string; // 시가2 대비 현재가 부호
  bstp_nmix_oprc_prdy_ctrt: string; // 업종 지수 시가2 전일 대비율

  bstp_nmix_hgpr: string; // 업종 지수 최고가
  prdy_nmix_vrss_nmix_hgpr: string; // 전일 지수 대비 지수 최고가
  hgpr_vrss_prpr_sign: string; // 최고가 대비 현재가 부호
  bstp_nmix_hgpr_prdy_ctrt: string; // 업종 지수 최고가 전일 대비율

  bstp_nmix_lwpr: string; // 업종 지수 최저가
  prdy_clpr_vrss_lwpr: string; // 전일 종가 대비 최저가
  lwpr_vrss_prpr_sign: string; // 최저가 대비 현재가 부호
  prdy_clpr_vrss_lwpr_rate: string; // 전일 종가 대비 최저가 비율

  ascn_issu_cnt: string; // 상승 종목 수
  uplm_issu_cnt: string; // 상한 종목 수
  stnr_issu_cnt: string; // 보합 종목 수
  down_issu_cnt: string; // 하락 종목 수
  lslm_issu_cnt: string; // 하한 종목 수

  dryy_bstp_nmix_hgpr: string; // 연중 업종지수 최고가
  dryy_hgpr_vrss_prpr_rate: string; // 연중 최고가 대비 현재가 비율
  dryy_bstp_nmix_hgpr_date: string; // 연중 업종지수 최고가 일자

  dryy_bstp_nmix_lwpr: string; // 연중 업종지수 최저가
  dryy_lwpr_vrss_prpr_rate: string; // 연중 최저가 대비 현재가 비율
  dryy_bstp_nmix_lwpr_date: string; // 연중 업종지수 최저가 일자

  total_askp_rsqn: string; // 총 매도호가 잔량
  total_bidp_rsqn: string; // 총 매수호가 잔량

  seln_rsqn_rate: string; // 매도 잔량 비율
  shnu_rsqn_rate: string; // 매수 잔량 비율

  ntby_rsqn: string; // 순매수 잔량
};

export type GlobalMarketResponse = {
  data_date: string; // 일자
  data_time: string; // 시각

  open_price: string; // 시가
  high_price: string; // 고가
  low_price: string; // 저가

  last_price: string; // 체결가격
  last_qntt: string; // 체결수량

  vol: string; // 누적거래수량

  prev_diff_flag: string; // 전일대비구분
  prev_diff_price: string; // 전일대비가격
  prev_diff_rate: string; // 전일대비율
};

// 주식현재가 투자자[v1_국내주식-012](FHKST01010900)
export type InvestorFlowItem = {
  output: string[];
  stck_bsop_date: string; // 주식 영업 일자
  stck_clpr: string; // 주식 종가
  prdy_vrss: string; // 전일 대비
  prdy_vrss_sign: string; // 전일 대비 부호
  prsn_ntby_qty: string; // 개인 순매수 수량
  frgn_ntby_qty: string; // 외국인 순매수 수량
  orgn_ntby_qty: string; // 기관계 순매수 수량
  prsn_ntby_tr_pbmn: string; // 개인 순매수 거래 대금
  frgn_ntby_tr_pbmn: string; // 외국인 순매수 거래 대금
  orgn_ntby_tr_pbmn: string; // 기관계 순매수 거래 대금
  prsn_shnu_vol: string; // 개인 매수 거래량
  frgn_shnu_vol: string; // 외국인 매수 거래량
  orgn_shnu_vol: string; // 기관계 매수 거래량
  prsn_shnu_tr_pbmn: string; // 개인 매수 거래 대금
  frgn_shnu_tr_pbmn: string; // 외국인 매수 거래 대금
  orgn_shnu_tr_pbmn: string; // 기관계 매수 거래 대금
  prsn_seln_vol: string; // 개인 매도 거래량
  frgn_seln_vol: string; // 외국인 매도 거래량
  orgn_seln_vol: string; // 기관계 매도 거래량
  prsn_seln_tr_pbmn: string; // 개인 매도 거래 대금
  frgn_seln_tr_pbmn: string; // 외국인 매도 거래 대금
  orgn_seln_tr_pbmn: string; // 기관계 매도 거래 대금
};

// 국내업종 일자별지수(FHKUP03500100)
export type IndustryDailyIndexSnapshot = {
  prdy_vrss_sign: string; // 전일 대비 부호
  bstp_nmix_prdy_ctrt: string; // 업종 지수 전일 대비율
  prdy_nmix: string; // 전일 지수
  acml_vol: string; // 누적 거래량
  acml_tr_pbmn: string; // 누적 거래 대금
  hts_kor_isnm: string; // HTS 한글 종목명
  bstp_nmix_prpr: string; // 업종 지수 현재가
  bstp_cls_code: string; // 업종 구분 코드
  prdy_vol: string; // 전일 거래량
  bstp_nmix_oprc: string; // 업종 지수 시가2
  bstp_nmix_hgpr: string; // 업종 지수 최고가
  bstp_nmix_lwpr: string; // 업종 지수 최저가
  futs_prdy_oprc: string; // 선물 전일 시가
  futs_prdy_hgpr: string; // 선물 전일 최고가
  futs_prdy_lwpr: string; // 선물 전일 최저가
};

export type IndustryDailyIndexItem = {
  stck_bsop_date: string; // 주식 영업 일자
  bstp_nmix_prpr: string; // 업종 지수 현재가
  bstp_nmix_oprc: string; // 업종 지수 시가2
  bstp_nmix_hgpr: string; // 업종 지수 최고가
  bstp_nmix_lwpr: string; // 업종 지수 최저가
  acml_vol: string; // 누적 거래량
  acml_tr_pbmn: string; // 누적 거래 대금
  mod_yn: string; // 변경 여부
};

export type IndustryDailyIndexResponse = {
  rt_cd: string; // 성공 실패 여부
  msg_cd: string; // 응답코드
  msg1: string; // 응답메세지
  output1: IndustryDailyIndexSnapshot;
  output2: IndustryDailyIndexItem[];
};
