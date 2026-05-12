import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { gameService } from '@/services/game.service';
import type { GameModeDto } from '@/types/api';

interface ReportFormProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: (formData: { date?: Date; gameMode: string; gameModeName: string; time: string; isBot: boolean }) => React.ReactNode;
}

export default function ReportForm({ 
  title, 
  description, 
  icon, 
  children
}: ReportFormProps) {
  // Game modes state
  const [gameModes, setGameModes] = useState<GameModeDto[]>([]);
  const [loadingGameModes, setLoadingGameModes] = useState(true);

  // Form state
  const [date, setDate] = useState<Date | null>(new Date());
  const [gameMode, setGameMode] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [open, setOpen] = useState(false);

  // Fetch game modes on component mount
  useEffect(() => {
    const fetchGameModes = async () => {
      try {
        setLoadingGameModes(true);
        const data = await gameService.getGameModes();
        setGameModes(data);
        
        // Set first game mode as default
        if (data.length > 0) {
          const firstGameMode = data[0];
          setGameMode(firstGameMode.id.toString());
          
          // Set default time based on game mode type
          if (firstGameMode.isBot) {
            setTime(''); // Empty for bot games
          } else if (firstGameMode.gameTimes.length > 0) {
            setTime(firstGameMode.gameTimes[0]); // First available time
          } else {
            setTime(''); // No times available
          }
        }
      } catch (error) {
        console.error('Error fetching game modes:', error);
      } finally {
        setLoadingGameModes(false);
      }
    };

    fetchGameModes();
  }, []);

  // Helper function to get selected game mode
  const getSelectedGameMode = (gameModeId: string) => {
    return gameModes.find(mode => mode.id.toString() === gameModeId);
  };

  // Helper function to format time for display
  const formatTimeForDisplay = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  // Helper function to check if game mode is bot
  const isBotGame = (gameModeId: string) => {
    const gameMode = getSelectedGameMode(gameModeId);
    return gameMode?.isBot || false;
  };



  // Helper function to get game times for a game mode
  const getGameTimes = (gameModeId: string) => {
    const gameMode = getSelectedGameMode(gameModeId);
    return gameMode?.gameTimes || [];
  };

  // Helper function to reset time when game mode changes
  const handleGameModeChange = (gameModeId: string) => {
    const gameMode = getSelectedGameMode(gameModeId);
    if (gameMode) {
      if (gameMode.isBot) {
        setTime(''); // Empty for bot games
      } else if (gameMode.gameTimes.length > 0) {
        setTime(gameMode.gameTimes[0]); // Set to first available time
      } else {
        setTime(''); // No times available
      }
    }
  };



  // // Handle date clear - reset to today's date
  // const handleDateClear = () => {
  //   setDate(null);
  //   setOpen(false); // Close the popover when clearing
  // };



  const gameTimes = getGameTimes(gameMode);
  const isBot = isBotGame(gameMode);

  return (
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle className='flex items-center'>
          {icon}
          {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='grid gap-2'>
            <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
              <span className='w-24 text-sm font-medium'>Date</span>
              <div className="flex-1 flex items-center gap-2">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className={cn(
                        'flex-1 justify-start text-left font-normal min-h-[40px]'
                      )}
                    >
                      <Calendar className='mr-2 h-4 w-4 flex-shrink-0' />
                      <span className='truncate'>
                        {date ? format(date, 'PPP') : 'DD/MM/YYYY'}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <CalendarComponent
                      mode='single'
                      selected={date || undefined}
                      onSelect={(selectedDate) => {
                        if (selectedDate) {
                          setDate(selectedDate);
                        }
                        setOpen(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {/* <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDateClear}
                  title="Reset to today"
                  className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 flex-shrink-0 min-h-[40px]"
                >
                  <X className="h-4 w-4" />
                </Button> */}
              </div>
            </div>
          </div>

          <div className='grid gap-2'>
            <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
              <span className='w-24 text-sm font-medium'>Game Mode</span>
              <Select 
                value={gameMode} 
                onValueChange={(newGameMode) => {
                  setGameMode(newGameMode);
                  handleGameModeChange(newGameMode);
                }}
              >
                <SelectTrigger className='w-full min-h-[40px]'>
                  <SelectValue placeholder='SELECT GAME MODE' />
                </SelectTrigger>
                <SelectContent>
                  {loadingGameModes ? (
                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                  ) : (
                    gameModes.map((mode) => (
                      <SelectItem key={mode.id} value={mode.id.toString()}>
                        {mode.description}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='grid gap-2'>
            <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
              <span className='w-24 text-sm font-medium'>Time</span>
              <Select 
                value={time} 
                onValueChange={setTime}
                disabled={isBot}
              >
                <SelectTrigger className='w-full min-h-[40px]'>
                  <SelectValue placeholder={isBot ? 'ALL' : time ? formatTimeForDisplay(time) : 'Select Time'} />
                </SelectTrigger>
                <SelectContent>
                  {gameTimes.map((timeString) => (
                    <SelectItem key={timeString} value={timeString}>
                      {formatTimeForDisplay(timeString)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Custom buttons for each report type */}
          <div className='pt-4 space-y-2'>
            {children({ 
              date: date || undefined, 
              gameMode, 
              gameModeName: getSelectedGameMode(gameMode)?.name || '', 
              time, 
              isBot: isBotGame(gameMode) 
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
