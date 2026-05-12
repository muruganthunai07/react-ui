interface TimerProps {
  hours: number;
  minutes: number;
  seconds: number;
}
interface props {
  timer: TimerProps;
  displayTime: string;
}
function TimerComponent({ timer, displayTime }: props) {
  return (
    <div className='flex flex-col items-end'>
      <div className='flex items-center gap-1 sm:gap-2 text-xl sm:text-2xl font-bold'>
        <div className='bg-primary text-primary-foreground p-2 rounded-md w-12 sm:w-14 h-12 sm:h-14 flex items-center justify-center'>
          {String(timer.hours).padStart(2, '0')}
        </div>
        <span>:</span>
        <div className='bg-primary text-primary-foreground p-2 rounded-md w-12 sm:w-14 h-12 sm:h-14 flex items-center justify-center'>
          {String(timer.minutes).padStart(2, '0')}
        </div>
        <span>:</span>
        <div className='bg-primary text-primary-foreground p-2 rounded-md w-12 sm:w-14 h-12 sm:h-14 flex items-center justify-center'>
          {String(timer.seconds).padStart(2, '0')}
        </div>
      </div>
      <p className='text-sm mt-1 text-muted-foreground'>{displayTime}</p>
    </div>
  );
}

export default TimerComponent;
