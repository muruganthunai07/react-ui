import React from 'react';

type TimerProps = {
  hours: number;
  minutes: number;
  seconds: number;
};

type Props = {
  timer: TimerProps;
  selectedTimeOption: string;
  betCloseTimeSeconds: number;
  isBot?: boolean;
  botIntervalMinutes?: number;
};

function GameProgressBar({ 
  timer, 
  selectedTimeOption, 
  betCloseTimeSeconds, 
  isBot = false, 
  botIntervalMinutes = 5 
}: Props) {
  // Calculate total interval time in seconds
  const getTotalIntervalSeconds = () => {
    if (isBot) {
      // For bot games, use the provided interval
      return botIntervalMinutes * 60;
    }
    
    // For regular games (non-bot), the interval is from day start to the selected draw time
    if (!selectedTimeOption) return 24 * 60 * 60; // Default to 24 hours
    
    // Get the selected time in 24-hour format
    const time24h = selectedTimeOption.includes('AM') || selectedTimeOption.includes('PM') 
      ? selectedTimeOption 
      : `${selectedTimeOption} AM`; // Assume AM if no period specified
    
    // Calculate total seconds from day start to the selected draw time
    const [time, period] = time24h.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    
    let totalHours = hours;
    if (period === 'PM' && hours !== 12) totalHours += 12;
    if (period === 'AM' && hours === 12) totalHours = 0;
    
    const totalSeconds = (totalHours * 60 + minutes) * 60;
    
    // Add the bet close time to get the full interval
    return totalSeconds + betCloseTimeSeconds;
  };

  const totalIntervalSeconds = getTotalIntervalSeconds();
  
  // Calculate current remaining time in seconds
  const currentRemainingSeconds = timer.hours * 3600 + timer.minutes * 60 + timer.seconds;
  
  // Calculate the active betting time (total interval minus bet close time)
  const activeBettingTime = totalIntervalSeconds - betCloseTimeSeconds;
  
  // Calculate remaining active betting time
  const remainingActiveTime = Math.max(0, currentRemainingSeconds - betCloseTimeSeconds);
  
  // Calculate progress percentages
  const activeBettingProgress = (remainingActiveTime / activeBettingTime) * 100;
  const betCloseProgress = (betCloseTimeSeconds / totalIntervalSeconds) * 100;
  
  // Ensure percentages are within valid range
  const clampedActiveProgress = Math.max(0, Math.min(100, activeBettingProgress));
  const clampedBetCloseProgress = Math.max(0, Math.min(100, betCloseProgress));
  
  return (
    <div className="relative h-full">
      {/* Background track */}
      <div className="absolute top-0 left-0 h-full w-full bg-gray-700 rounded-full" />
      
      {/* Bet closed time indicator - red section on the left */}
      <div
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 to-red-600 rounded-l-full transition-all duration-1000 ease-linear shadow-lg"
        style={{
          width: `${clampedBetCloseProgress}%`,
        }}
      />
      
      {/* Main progress bar - shows remaining active betting time (yellow/gold gradient) */}
      <div
        className="absolute top-0 h-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 transition-all duration-1000 ease-linear shadow-lg"
        style={{
          left: `${clampedBetCloseProgress}%`,
          width: `${clampedActiveProgress}%`,
        }}
      />
      
      {/* Visual separator line at bet close time */}
      {clampedBetCloseProgress > 0 && (
        <div
          className="absolute top-0 h-full w-1 bg-white opacity-80 transition-all duration-1000 ease-linear shadow-sm"
          style={{
            left: `${clampedBetCloseProgress}%`,
          }}
        />
      )}
      
      {/* Progress text overlay for debugging (can be removed in production) */}
      <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center text-xs text-white font-mono opacity-60 pointer-events-none">
        {isBot 
          ? `${botIntervalMinutes}min` 
          : `${Math.floor(totalIntervalSeconds / 3600)}h ${Math.floor((totalIntervalSeconds % 3600) / 60)}m`
        }
      </div>
    </div>
  );
}

export default React.memo(GameProgressBar);
