import { cn } from '@/lib/utils';
import {
  isGamewithinLockTime,
} from '@/utils/TimeFunctions';
import { AlarmClock } from 'lucide-react';
import { useEffect, useRef } from 'react';
type TimerOptionsProps = {
  timeOptions: string[];
  selectedTimeOption: string;
  setSelectedTimeOption: (option: string) => void;
  isBot?: boolean;
  betCloseTimeSeconds?: number;
};

export default function TimerOptions({
  timeOptions,
  selectedTimeOption,
  setSelectedTimeOption,
  isBot,
  betCloseTimeSeconds = 0,
}: TimerOptionsProps) {
  const timeRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  useEffect(() => {
    const selectedEl = timeRefs.current[selectedTimeOption];
    if (selectedEl) {
      selectedEl.scrollIntoView({
        behavior: 'smooth',
        inline: 'start',
        block: 'nearest',
      });
    }
  }, [selectedTimeOption]);
  const getOption = (option: string) => {
    if (isBot) {
      return option;
    } else {
      return option;
    }
  };
  const handleChange = (option: string) => {
    setSelectedTimeOption(option);
  };
  return (
    <div className='flex gap-2 p-4 overflow-x-auto pb-2 hide-scrollbar w-full'>
      {timeOptions.map((option: string) => (
        <button
          key={option}
          ref={(el) => {
            timeRefs.current[option] = el;
          }}
          onClick={() => handleChange(option)}
          className={cn(
            'flex flex-col items-center justify-center p-3 rounded-lg border shrink-0',
            selectedTimeOption == getOption(option)
              ? 'bg-primary/10 border-primary'
              : 'bg-background border-border',
              isGamewithinLockTime(option, betCloseTimeSeconds) &&
              'opacity-50 cursor-not-allowed'
          )}
          disabled={isGamewithinLockTime(option, betCloseTimeSeconds)}
          title={
            isGamewithinLockTime(option, betCloseTimeSeconds)
              ? 'Too late to select this time'
              : ''
          }
        >
          <div
            className={cn(
              'p-1 rounded-full',
              selectedTimeOption == getOption(option)
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          >
            <AlarmClock className='h-5 w-5' />
          </div>
          <span className='text-sm font-medium mt-1'>{option}</span>
        </button>
      ))}
    </div>
  );
}
