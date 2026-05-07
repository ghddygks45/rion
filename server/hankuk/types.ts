export interface ResponseBodyOutput {
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
}

export interface MarketIndexResponse {
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
}
