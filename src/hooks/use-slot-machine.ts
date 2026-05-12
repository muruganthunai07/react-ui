import { useState, useCallback, useEffect, useRef } from 'react';
import type {
  UseSlotMachineProps,
  UseSlotMachineReturn,
} from '@/types/slot-machine';

export function useSlotMachine({
  reels,
  minNumber,
  maxNumber,
  spinDuration,
  reelStopDelay,
  finalNumbers,
  onSpinStart,
  onSpinEnd,
}: UseSlotMachineProps): UseSlotMachineReturn {
  const [numbers, setNumbers] = useState<number[]>(
    Array(reels)
      .fill(0)
      .map(() => getRandomNumber(minNumber, maxNumber))
  );
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinningReels, setSpinningReels] = useState<boolean[]>(
    Array(reels).fill(false)
  );

  const spinIntervalsRef = useRef<(NodeJS.Timeout | null)[]>(
    Array(reels).fill(null)
  );
  const stopTimersRef = useRef<(NodeJS.Timeout | null)[]>(
    Array(reels).fill(null)
  );
  const finalNumbersRef = useRef<number[] | undefined>(finalNumbers);

  // Update ref when finalNumbers prop changes
  useEffect(() => {
    finalNumbersRef.current = finalNumbers;
  }, [finalNumbers]);

  // Clean up intervals and timers on unmount
  useEffect(() => {
    return () => {
      spinIntervalsRef.current.forEach((interval) => {
        if (interval) clearInterval(interval);
      });
      stopTimersRef.current.forEach((timer) => {
        if (timer) clearTimeout(timer);
      });
    };
  }, []);

  const spin = useCallback(() => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSpinningReels(Array(reels).fill(true));

    if (onSpinStart) onSpinStart();

    // Clear any existing intervals
    spinIntervalsRef.current.forEach((interval) => {
      if (interval) clearInterval(interval);
    });

    // Clear any existing timers
    stopTimersRef.current.forEach((timer) => {
      if (timer) clearTimeout(timer);
    });

    // Start spinning each reel with a staggered start
    const newSpinIntervals: (NodeJS.Timeout | null)[] = [];

    for (let i = 0; i < reels; i++) {
      // Add a small staggered start delay for each reel
      const startDelay = i * 100;

      setTimeout(() => {
        // Start with slower interval and gradually speed up
        let intervalTime = 300; // Start slow
        let elapsedTime = 0;

        const interval = setInterval(() => {
          setNumbers((prev) => {
            const newNumbers = [...prev];
            newNumbers[i] = getRandomNumber(minNumber, maxNumber);
            return newNumbers;
          });

          elapsedTime += intervalTime;

          // Speed up the spinning over time
          if (elapsedTime > spinDuration / 3 && intervalTime > 200) {
            clearInterval(interval);
            intervalTime = 200;
            newSpinIntervals[i] = setInterval(() => {
              setNumbers((prev) => {
                const newNumbers = [...prev];
                newNumbers[i] = getRandomNumber(minNumber, maxNumber);
                return newNumbers;
              });
            }, intervalTime);
          } else if (elapsedTime > spinDuration / 2 && intervalTime > 100) {
            clearInterval(interval);
            intervalTime = 100;
            newSpinIntervals[i] = setInterval(() => {
              setNumbers((prev) => {
                const newNumbers = [...prev];
                newNumbers[i] = getRandomNumber(minNumber, maxNumber);
                return newNumbers;
              });
            }, intervalTime);
          } else if (elapsedTime > spinDuration * 0.8 && intervalTime > 50) {
            clearInterval(interval);
            intervalTime = 50;
            newSpinIntervals[i] = setInterval(() => {
              setNumbers((prev) => {
                const newNumbers = [...prev];
                newNumbers[i] = getRandomNumber(minNumber, maxNumber);
                return newNumbers;
              });
            }, intervalTime);
          }
        }, intervalTime);

        newSpinIntervals[i] = interval;
      }, startDelay);

      // Set a timeout to stop this reel
      const stopTime = spinDuration + i * reelStopDelay;

      stopTimersRef.current[i] = setTimeout(() => {
        const interval = newSpinIntervals[i];
        if (interval) {
          clearInterval(interval);
        }

        // Set the final number for this reel
        setNumbers((prev) => {
          const newNumbers = [...prev];
          // Use provided final number if available, otherwise random
          if (
            finalNumbersRef.current &&
            finalNumbersRef.current[i] !== undefined
          ) {
            newNumbers[i] = finalNumbersRef.current[i];
          } else {
            newNumbers[i] = getRandomNumber(minNumber, maxNumber);
          }
          return newNumbers;
        });

        // Mark this reel as stopped
        setSpinningReels((prev) => {
          const newSpinningReels = [...prev];
          newSpinningReels[i] = false;
          return newSpinningReels;
        });

        // Check if all reels have stopped
        if (i === reels - 1) {
          setTimeout(() => {
            setIsSpinning(false);
            if (onSpinEnd) {
              setNumbers((prev) => {
                if (onSpinEnd) onSpinEnd(prev);
                return prev;
              });
            }
          }, 100);
        }
      }, stopTime);
    }

    spinIntervalsRef.current = newSpinIntervals;
  }, [
    isSpinning,
    reels,
    minNumber,
    maxNumber,
    spinDuration,
    reelStopDelay,
    onSpinStart,
    onSpinEnd,
  ]);

  return {
    numbers,
    isSpinning,
    spin,
    spinningReels,
  };
}

// Helper function to generate random numbers
function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
