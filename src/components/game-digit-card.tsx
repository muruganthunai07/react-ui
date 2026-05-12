import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { getNextBotDrawTime } from '@/utils/TimeFunctions';

// Import logo images
import DearLogo from '@/assets/logos/Dearlogo.png';
import KeralaLogo from '@/assets/logos/Keralalogo.png';
import QuickLogo from '@/assets/logos/quicklogo.png';

type GameDigitCardProps = {
  type: 'dear' | 'kerala' | 'bot';
  digits?: string[];
  time?: string;
  disabled?: boolean;
  href: string;
  isActive?: boolean;
  intervalMin?: string;
};

export function GameDigitCard({
  type,
  time,
  disabled,
  href,
  isActive = false,
  intervalMin,
}: GameDigitCardProps) {
  const [countdown, setCountdown] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isRunning, setIsRunning] = useState(isActive);

  // Get the appropriate logo based on type
  const getLogo = () => {
    switch (type) {
      case 'dear':
        return DearLogo;
      case 'kerala':
        return KeralaLogo;
      case 'bot':
        return QuickLogo;
      default:
        return DearLogo;
    }
  };

  // Parse the time string to get hours and minutes
  useEffect(() => {
    // Skip timer initialization if lottery is closed
    if (!isActive) {
      setIsRunning(false);
      return;
    }

    const parseTime = () => {
      // Extract time from string like "Next draw: 10:30 AM"
      const timeMatch = time?.match(/(\d+):(\d+)\s*(AM|PM)/i);

      if (timeMatch) {
        let hours = Number.parseInt(timeMatch[1]);
        const minutes = Number.parseInt(timeMatch[2]);
        const period = timeMatch[3].toUpperCase();

        // Convert to 24-hour format
        if (period === 'PM' && hours < 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;

        // Calculate target time for today
        const now = new Date();
        const targetTime = new Date(now);
        targetTime.setHours(hours, minutes, 0, 0);

        // If target time is in the past, set it for tomorrow
        if (targetTime <= now) {
          targetTime.setDate(targetTime.getDate() + 1);
        }

        return targetTime;
      }

      // Default to 30 minutes from now if parsing fails
      const defaultTarget = new Date();
      defaultTarget.setMinutes(defaultTarget.getMinutes() + 30);
      return defaultTarget;
    };

    const targetTime = parseTime();

    // Update countdown every second
    const updateCountdown = () => {
      const now = new Date();
      const diff = targetTime.getTime() - now.getTime();

      if (diff <= 0) {
        // Reset timer when it reaches zero
        setIsRunning(false);
        setTimeout(() => {
          if (type === 'bot') {
            // Bot game: use interval-based next draw
            const nextDrawTimeStr = getNextBotDrawTime(Number(intervalMin));
            const timeMatch = nextDrawTimeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
            if (timeMatch) {
              let hours = Number.parseInt(timeMatch[1]);
              const minutes = Number.parseInt(timeMatch[2]);
              const period = timeMatch[3].toUpperCase();
              if (period === 'PM' && hours < 12) hours += 12;
              if (period === 'AM' && hours === 12) hours = 0;
              const now = new Date();
              const newTarget = new Date(now);
              newTarget.setHours(hours, minutes, 0, 0);
              if (newTarget <= now) newTarget.setDate(newTarget.getDate() + 1);
              const diffMs = newTarget.getTime() - now.getTime();
              const hoursNew = Math.floor(diffMs / (1000 * 60 * 60));
              const minutesNew = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
              const secondsNew = Math.floor((diffMs % (1000 * 60)) / 1000);
              setCountdown({ hours:hoursNew, minutes:minutesNew,seconds: secondsNew });
              setIsRunning(true);
            }
          } else {
            // Normal game: add a day to the target time
            const newTarget = new Date(targetTime);
            newTarget.setDate(newTarget.getDate() + 1);
            setCountdown({ hours: 23, minutes: 59, seconds: 59 });
            setIsRunning(true);
          }
        }, 3000);
        return;
      }

      // Calculate hours, minutes, seconds
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({ hours, minutes, seconds });
    };

    // Initial update
    updateCountdown();

    // Set interval for updates
    const interval = setInterval(updateCountdown, 1000);

    // Cleanup
    return () => clearInterval(interval);
  }, [time, isActive, intervalMin, type]);

  return (
    <Link to={disabled ? '#' : href} className='block h-full'>
      <div
        className={cn(
          'relative h-full rounded-lg p-4 overflow-hidden transition-transform hover:scale-[1.02]',
          disabled && 'pointer-events-none opacity-40 cursor-not-allowed ',
          type === 'dear'
            ? 'bg-gradient-to-br from-red-500 to-red-700'
            : type === 'bot'
            ? 'bg-gradient-to-br from-blue-500 to-blue-700'
            : 'bg-gradient-to-br from-green-500 to-green-700',
          !isActive && 'opacity-80'
        )}
      >
        {/* Background pattern - Remove problematic background image */}
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute inset-0 bg-black'></div>
        </div>

        <div className='relative z-10'>
          <div className='flex justify-between items-start mb-2'>
            <div className='flex items-center gap-3'>
              {/* Bigger logo */}
              <div className='relative'>
                <img 
                  src={getLogo()} 
                  alt={`${type} logo`}
                  className='w-20 h-20 object-contain drop-shadow-lg'
                />
              </div>
              <div>
                <h3 className='text-white font-bold text-lg'>
                  {type === 'bot'
                    ? intervalMin + ' Mins'
                    : type?.toUpperCase() + ' Lottery'}
                </h3>
                <div className='flex items-center mt-1'>
                  <div
                    className={cn(
                      'w-2 h-2 rounded-full mr-2',
                      isActive
                        ? isRunning
                          ? 'bg-green-300 animate-pulse'
                          : 'bg-yellow-300'
                        : 'bg-red-500'
                    )}
                  ></div>
                  <p className='text-white text-xs opacity-90'>
                    {!isActive
                      ? 'Closed'
                      : isRunning
                      ? 'Live Draw'
                      : 'Draw Complete'}
                  </p>
                </div>
                <p className='text-white text-xs opacity-90'>
                  {type === 'bot' && time}
                </p>
              </div>
            </div>
            {type !== 'bot' && (
              <div className='bg-white/20 backdrop-blur-sm rounded px-2 py-1'>
                <p className='text-white text-xs font-medium'>
                  {type.toUpperCase()}
                </p>
              </div>
            )}
          </div>

          {!isActive && (
            <div className='bg-black/30 text-white text-center py-2 px-4 rounded-lg my-4 backdrop-blur-sm'>
              <p className='font-medium'>LOTTERY CLOSED</p>
              <p className='text-xs mt-1 opacity-80'>
                This lottery is currently unavailable
              </p>
            </div>
          )}

          {!disabled ? (
            <div className='mt-3'>
              <div className='bg-white/20 backdrop-blur-sm rounded-lg p-2'>
                <div className='text-center text-white text-xs mb-1'>
                  Next Draw In
                </div>
                <div className='flex justify-center gap-1'>
                  <div className='bg-white/30 backdrop-blur-sm rounded px-2 py-1 w-14 text-center'>
                    <span className='text-white font-bold text-lg'>
                      {String(countdown.hours).padStart(2, '0')}
                    </span>
                    <p className='text-white text-[10px]'>HOURS</p>
                  </div>
                  <div className='bg-white/30 backdrop-blur-sm rounded px-2 py-1 w-14 text-center'>
                    <span className='text-white font-bold text-lg'>
                      {String(countdown.minutes).padStart(2, '0')}
                    </span>
                    <p className='text-white text-[10px]'>MINS</p>
                  </div>
                  <div className='bg-white/30 backdrop-blur-sm rounded px-2 py-1 w-14 text-center'>
                    <span className='text-white font-bold text-lg'>
                      {String(countdown.seconds).padStart(2, '0')}
                    </span>
                    <p className='text-white text-[10px]'>SECS</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className='bg-white/20 backdrop-blur-sm rounded-lg p-6 flex flex-col items-center justify-center'>
              <span className='text-white text-xl font-bold mb-2'>Closed</span>
              <span className='text-white text-sm opacity-80'>
                This lottery is currently unavailable
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
