import moment from 'moment';
import momentTz from 'moment-timezone';

// Converts a 24-hour format time string to a 12-hour format string
// Example: '14:30:00' -> '2:30 PM'
function get12HourTime(time: string | Date) {
  const newTime = moment(time, 'HH:mm:ss').format('h:mm A');
  return newTime;
}

// Converts an array of 24-hour format times to 12-hour format
// Example: ['14:30:00', '09:15:00'] -> ['2:30 PM', '9:15 AM']
function get12HourTimeArray(times: string[]) {
  return times.map((time) => get12HourTime(time));
}

// Finds the next closest time from an array of 24-hour format times
// If the time is before the current time, it adds one day to it
// Returns the next closest time in 12-hour format
function getNextClosestTime(times: string[]) {
  const now = moment();

  const upcoming = times
    .map((timeStr) => {
      const time = moment(timeStr, 'HH:mm:ss');
      if (time.isBefore(now)) {
        time.add(1, 'day');
      }
      return { timeStr: get12HourTime(timeStr), time };
    })
    .sort((a, b) => a.time.valueOf() - b.time.valueOf());

  // // Find the first time at least 10 minutes from now
  // for (const entry of upcoming) {
  //   const diffInMinutes = entry.time.diff(now, 'minutes');
  //   if (diffInMinutes > 10) {
  //     return entry;
  //   }
  // }

  // If none are more than 10 minutes ahead, return the first one anyway
  return upcoming[0];
}

// Calculates the remaining time until a specified target time
// If the target time has already passed today, it assumes the target is for tomorrow
function getRemainingTime(time12h: string) {
  const now = momentTz.tz('Asia/Kolkata');
  const time24h = convertTo24HourFormat(time12h);
  const [targetHours, targetMinutes] = time24h.split(':').map(Number);

  const target = momentTz.tz('Asia/Kolkata').set({
    hour: targetHours,
    minute: targetMinutes,
    second: 0,
    millisecond: 0,
  });

  // If time has already passed today, move to next day
  if (target < now) {
    target.add(1, 'day');
  }

  const diffMs = target.valueOf() - now.valueOf();

  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds };
}

// Converts a 12-hour format time string to a 24-hour format string
// Example: '2:30 PM' -> '14:30:00'
function convertTo24HourFormat(time12h: string): string {
  const split = (time12h || '').trim().split(' ');
  const time = split[0] || '12:00';
  const modifier = split[1] || 'AM';
  const [hoursStr, minutesStr] = time.split(':');
  let hours = Number(hoursStr);
  const minutes = Number(minutesStr);

  if (modifier === 'PM' && hours !== 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;
}

/**
 * Checks if a game is allowed to be entered based on game time and bet close time.
 * Returns true if betting is still open (current time is before bet close time).
 * Similar logic to useBetClosed hook but as a pure function.
 * @param gameTime - The draw time in 12-hour format (e.g., "2:30 PM")
 * @param betCloseTimeSeconds - Number of seconds before draw time when betting closes
 * @param timezone - Timezone to use (defaults to 'Asia/Kolkata')
 * @returns true if game is allowed to be entered (betting is open), false otherwise
 */
function isGamewithinLockTime(
  gameTime: string,
  betCloseTimeSeconds: number,
  timezone = 'Asia/Kolkata'
): boolean {
  if (!gameTime || betCloseTimeSeconds == null) {
    return false; // Default to not allowing if no data provided
  }

  const now = momentTz.tz(timezone);
  const [time, period] = gameTime.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  
  const drawMoment = momentTz.tz(timezone).set({
    hour: period === 'PM' ? (hours % 12) + 12 : hours % 12,
    minute: minutes,
    second: 0,
    millisecond: 0,
  });
  
  const closeMoment = drawMoment.clone().subtract(betCloseTimeSeconds, 'seconds');
  return now.isAfter(closeMoment);
}
function isSameTime(timeStr: string, fullDateTime: string): boolean {
  // Convert "1:00 PM" to 24-hour format
  const [time, modifier] = timeStr.trim().split(' ');
  // eslint-disable-next-line prefer-const
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier?.toUpperCase() === 'PM' && hours !== 12) hours += 12;
  if (modifier?.toUpperCase() === 'AM' && hours === 12) hours = 0;

  // Extract time from fullDateTime
  const date = new Date(fullDateTime);
  const dateHours = date.getHours();
  const dateMinutes = date.getMinutes();

  return hours === dateHours && minutes === dateMinutes;
}
/**
 * Returns the next draw time for a bot game given an interval in minutes.
 * Always rounds UP to the next interval from the current IST time.
 * Example: If now is 2:03 PM and interval is 5, returns 2:05 PM.
 */
function getNextBotDrawTime(intervalMin: number): string {
  const now = momentTz.tz('Asia/Kolkata');
  // Calculate total minutes since midnight
  const totalMinutes = now.hours() * 60 + now.minutes();
  // Find the next interval strictly after now
  const nextIntervalMinutes = Math.ceil((totalMinutes + 1) / intervalMin) * intervalMin;
  // If nextIntervalMinutes >= 1440, wrap to next day
  const nextDraw = now.clone().startOf('day').add(nextIntervalMinutes % 1440, 'minutes');
  return nextDraw.format('h:mm A');
}

export {
  get12HourTime,
  getNextClosestTime,
  get12HourTimeArray,
  getRemainingTime,
  convertTo24HourFormat,
  isGamewithinLockTime,
  isSameTime,
  getNextBotDrawTime,
};
