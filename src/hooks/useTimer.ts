// hooks/useTimer.ts
import { useState, useEffect, useRef } from 'react';

interface TimerValues {
  hours: number;
  minutes: number;
  seconds: number;
}

export function useTimer(
    initial: TimerValues,
    onExpire?: () => void,
    key?: string | number // ← trigger re-init
  ): TimerValues {
    const [time, setTime] = useState(initial);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
    useEffect(() => {
      setTime(initial); // ← re-init state
      if (intervalRef.current) clearInterval(intervalRef.current);
  
      intervalRef.current = setInterval(() => {
        setTime((prev) => {
          const { hours, minutes, seconds } = prev;
  
          if (seconds > 0) return { hours, minutes, seconds: seconds - 1 };
          if (minutes > 0) return { hours, minutes: minutes - 1, seconds: 59 };
          if (hours > 0) return { hours: hours - 1, minutes: 59, seconds: 59 };
  
          // Timer expired
          clearInterval(intervalRef.current!);
          onExpire?.();
          return { hours: 0, minutes: 0, seconds: 0 };
        });
      }, 1000);
  
      return () => clearInterval(intervalRef.current!);
    }, [initial.hours, initial.minutes, initial.seconds, key]); // ← include key
  
    return time;
  }
  