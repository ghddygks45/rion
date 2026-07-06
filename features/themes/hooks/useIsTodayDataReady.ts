import { useEffect, useState } from "react";

const GATE_START_HOUR = 7;
const GATE_START_MINUTE = 50;
const GATE_END_HOUR = 8;
const GATE_END_MINUTE = 10;

function checkIsInGateWindow() {
  const kstNow = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const minutesSinceMidnight =
    kstNow.getUTCHours() * 60 + kstNow.getUTCMinutes();
  const start = GATE_START_HOUR * 60 + GATE_START_MINUTE;
  const end = GATE_END_HOUR * 60 + GATE_END_MINUTE;
  return minutesSinceMidnight >= start && minutesSinceMidnight < end;
}

export function useIsTodayDataReady() {
  const [isInGateWindow, setIsInGateWindow] = useState(checkIsInGateWindow);

  useEffect(() => {
    const id = setInterval(() => {
      setIsInGateWindow(checkIsInGateWindow());
    }, 30 * 1000);
    return () => clearInterval(id);
  }, []);

  return isInGateWindow;
}
