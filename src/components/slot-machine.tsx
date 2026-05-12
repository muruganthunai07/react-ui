import { useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useSlotMachine } from '@/hooks/use-slot-machine';
import type { SlotMachineProps } from '@/types/slot-machine';
import { Button } from '@/components/ui/button';
import { Ball } from './ball';

export function SlotMachine({
  reels = 3,
  minNumber = 0,
  maxNumber = 9,
  spinDuration = 2000,
  reelStopDelay = 300,
  autoSpin = false,
  onSpinStart,
  onSpinEnd,
  finalNumbers,
  className,
  variant = 'classic',
  size = 'md',
  showLever = true,
  ballColorScheme = 'default',
  ballDirection = 'alternating',
  visibleBalls = 5,
}: SlotMachineProps) {
  const { numbers, isSpinning, spin, spinningReels } = useSlotMachine({
    reels,
    minNumber,
    maxNumber,
    spinDuration,
    reelStopDelay,
    finalNumbers,
    onSpinStart,
    onSpinEnd,
  });

  const [leverPulled, setLeverPulled] = useState(false);
  const [ballSpeeds, setBallSpeeds] = useState<number[]>([]);

  // Generate surrounding numbers for each reel
  const surroundingNumbers = useMemo(() => {
    return Array(reels)
      .fill(0)
      .map((_, reelIndex) => {
        const centerNumber = numbers[reelIndex];
        const surroundingNums = [];

        for (let i = 0; i < visibleBalls; i++) {
          let num;
          if (i === Math.floor(visibleBalls / 2)) {
            num = centerNumber;
          } else {
            // Generate numbers before and after the center number
            const offset = i - Math.floor(visibleBalls / 2);
            num = centerNumber + offset;

            // Wrap around if out of range
            if (num < minNumber) num = maxNumber - (minNumber - num - 1);
            if (num > maxNumber) num = minNumber + (num - maxNumber - 1);
          }
          surroundingNums.push(num);
        }

        return surroundingNums;
      });
  }, [numbers, reels, minNumber, maxNumber, visibleBalls]);

  // Auto-spin on mount if enabled
  useEffect(() => {
    if (autoSpin) {
      spin();
    }
  }, [autoSpin, spin]);

  // Update ball speeds when spinning state changes
  useEffect(() => {
    if (isSpinning) {
      // Generate random speeds for each reel
      const speeds = Array(reels)
        .fill(0)
        .map(() => 2 + Math.random() * 3);
      setBallSpeeds(speeds);
    }
  }, [isSpinning, reels]);

  const handleSpin = () => {
    if (variant === 'classic' && showLever) {
      setLeverPulled(true);
      setTimeout(() => {
        spin();
        setTimeout(() => {
          setLeverPulled(false);
        }, 500);
      }, 300);
    } else {
      spin();
    }
  };

  // Size classes
  const sizeClasses = {
    sm: {
      container: 'h-16 max-w-xs',
      reel: 'w-12 h-12 text-xl',
      lever: 'h-16 w-8',
      ballsContainer: 'h-40',
      ballsReel: 'w-10 mx-1',
    },
    md: {
      container: 'h-24 max-w-md',
      reel: 'w-16 h-16 text-3xl',
      lever: 'h-24 w-10',
      ballsContainer: 'h-64',
      ballsReel: 'w-14 mx-2',
    },
    lg: {
      container: 'h-32 max-w-lg',
      reel: 'w-20 h-20 text-4xl',
      lever: 'h-32 w-12',
      ballsContainer: 'h-80',
      ballsReel: 'w-18 mx-3',
    },
  };

  // Render the appropriate variant
  const renderSlotMachine = () => {
    if (variant === 'balls') {
      return (
        <div
          className={cn(
            'flex justify-center',
            sizeClasses[size].ballsContainer
          )}
        >
          {surroundingNumbers.map((reelNumbers, reelIndex) => {
            // Determine direction for this reel
            let direction: 'up' | 'down';
            if (ballDirection === 'all-up') {
              direction = 'up';
            } else if (ballDirection === 'all-down') {
              direction = 'down';
            } else {
              // Alternating
              direction = reelIndex % 2 === 0 ? 'up' : 'down';
            }

            return (
              <div
                key={reelIndex}
                className={cn(
                  'relative flex flex-col items-center justify-center overflow-hidden',
                  sizeClasses[size].ballsReel
                )}
              >
                {/* Highlight for the center position */}
                <div className='absolute top-1/2 left-0 right-0 h-[calc(100%/5)] -translate-y-1/2 bg-gray-100 dark:bg-gray-800 rounded-md opacity-30 z-0'></div>

                {/* Balls */}
                <div className='relative flex flex-col items-center justify-center gap-2 py-2 z-10'>
                  {reelNumbers.map((num, ballIndex) => (
                    <Ball
                      key={ballIndex}
                      number={num}
                      isActive={ballIndex === Math.floor(visibleBalls / 2)}
                      isSpinning={spinningReels[reelIndex]}
                      size={size}
                      colorScheme={ballColorScheme}
                      index={ballIndex}
                      direction={direction}
                      speed={ballSpeeds[reelIndex] || 2}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      );
    } else if (variant === 'classic') {
      return (
        <div className='flex items-center'>
          <div
            className={cn(
              'relative bg-amber-400 rounded-xl p-4 flex items-center justify-center shadow-lg border-4 border-amber-500',
              sizeClasses[size].container
            )}
          >
            {/* Star on top */}
            <div className='absolute -top-4 left-1/2 transform -translate-x-1/2'>
              <div className='bg-red-500 w-8 h-8 rotate-45 transform'>
                <div className='absolute inset-0 bg-red-500 rotate-45 transform'></div>
              </div>
            </div>

            <div className='flex space-x-2 bg-white p-2 rounded-lg shadow-inner'>
              {numbers.map((number, index) => (
                <div
                  key={index}
                  className={cn(
                    'relative flex items-center justify-center bg-blue-100 rounded-md overflow-hidden shadow-inner',
                    sizeClasses[size].reel,
                    spinningReels[index] && 'animate-pulse'
                  )}
                >
                  <div
                    className={cn(
                      'font-bold text-blue-600 transition-transform',
                      spinningReels[index] && 'animate-bounce'
                    )}
                  >
                    {number}
                  </div>
                  {/* Reel lines */}
                  <div className='absolute top-0 left-0 right-0 h-px bg-gray-300'></div>
                  <div className='absolute bottom-0 left-0 right-0 h-px bg-gray-300'></div>
                </div>
              ))}
            </div>

            {/* Spin button if no lever */}
            {!showLever && (
              <Button
                onClick={handleSpin}
                disabled={isSpinning}
                className='absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 hover:bg-red-600 text-white rounded-full h-8 w-8 flex items-center justify-center p-0'
                aria-label='Spin'
              >
                <span className='sr-only'>Spin</span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='16'
                  height='16'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8' />
                  <path d='M21 3v5h-5' />
                </svg>
              </Button>
            )}
          </div>

          {/* Lever */}
          {showLever && (
            <div
              className={cn(
                'relative ml-2 cursor-pointer transition-all duration-300 transform',
                sizeClasses[size].lever,
                leverPulled ? 'translate-y-4' : ''
              )}
              onClick={!isSpinning ? handleSpin : undefined}
            >
              <div className='absolute top-0 w-full flex justify-center'>
                <div className='w-6 h-6 bg-red-500 rounded-full'></div>
              </div>
              <div className='h-full w-2 bg-gray-700 mx-auto rounded-b-lg'></div>
            </div>
          )}
        </div>
      );
    } else {
      // Modern variant
      return (
        <div className={cn('flex space-x-2', sizeClasses[size].container)}>
          {numbers.map((number, index) => (
            <div
              key={index}
              className={cn(
                'rounded-full flex items-center justify-center font-bold text-white transition-all',
                sizeClasses[size].reel,
                spinningReels[index] ? 'animate-bounce' : 'animate-none',
                [
                  'bg-purple-500',
                  'bg-red-500',
                  'bg-orange-500',
                  'bg-blue-500',
                  'bg-green-500',
                  'bg-pink-500',
                  'bg-indigo-500',
                  'bg-yellow-500',
                ][index % 8]
              )}
            >
              {number}
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className={cn('flex flex-col items-center', className)}>
      {renderSlotMachine()}

      {/* Spin button for non-classic variants or when lever is hidden */}
      {(variant !== 'classic' || (variant === 'classic' && !showLever)) && (
        <Button
          onClick={handleSpin}
          disabled={isSpinning}
          className='mt-4 bg-amber-500 hover:bg-amber-600'
        >
          {isSpinning ? 'Spinning...' : 'Spin'}
        </Button>
      )}
    </div>
  );
}
