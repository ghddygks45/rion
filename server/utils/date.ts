/**
 * 주어진 날짜로부터 N영업일 전 날짜를 구한다.
 * 토/일만 건너뛰며, 공휴일은 반영하지 않는다.
 *
 * @param from 기준 날짜
 * @param days 거슬러 올라갈 영업일 수
 * @returns N영업일 전 날짜
 */
export function getBusinessDaysAgo(from: Date, days: number): Date {
  const result = new Date(from);
  let remaining = days;

  while (remaining > 0) {
    result.setDate(result.getDate() - 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) remaining--;
  }

  return result;
}

/**
 * 날짜를 "YYYYMMDD" 형식 문자열로 변환한다.
 *
 * @param date 변환할 날짜
 */
export function formatYYYYMMDD(date: Date): string {
  return date.toISOString().slice(0, 10).replace(/-/g, "");
}
