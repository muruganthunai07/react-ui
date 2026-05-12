import { useEffect, useRef, useState } from 'react';
import moment from 'moment-timezone';

export function useBetClosed(drawTime: string, betCloseTimeSeconds: number, timezone = 'Asia/Kolkata') {
  const [isBetClosed, setIsBetClosed] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const hasShownOverlay = useRef(false);

  useEffect(() => {
    if (!drawTime || betCloseTimeSeconds == null) {
      setIsBetClosed(false);
      return;
    }

    let intervalId: NodeJS.Timeout | null = null;

    const checkClosed = () => {
      const now = moment.tz(timezone);
      const [time, period] = drawTime.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let drawMoment = moment.tz(timezone).set({
        hour: period === 'PM' ? (hours % 12) + 12 : hours % 12,
        minute: minutes,
        second: 0,
        millisecond: 0,
      });
      if (drawMoment.isBefore(now)) {
        drawMoment = drawMoment.add(1, 'day');
      }
      const closeMoment = drawMoment.clone().subtract(betCloseTimeSeconds, 'seconds');
      const closed = now.isAfter(closeMoment);

      setIsBetClosed(closed);

      // Show overlay for 2 seconds if just closed or on initial mount if already closed
      if (closed && !hasShownOverlay.current) {
        setShowOverlay(true);
        hasShownOverlay.current = true;
        setTimeout(() => setShowOverlay(false), 2000);
      }
      // Reset overlay flag if betting reopens (e.g., new draw)
      if (!closed) {
        hasShownOverlay.current = false;
      }
    };

    checkClosed(); // Initial check
    intervalId = setInterval(checkClosed, 1000); // Poll every second

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [drawTime, betCloseTimeSeconds, timezone]);

  return [isBetClosed, showOverlay] as const;
} 