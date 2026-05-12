import { createContext, useContext, useEffect } from 'react';
import { useState, type ReactNode } from 'react';
import type { GameModeDto, DrawDto, HolidayDto, ApiError, GameAndAllLots } from '@/types/api';
import { gameService } from '@/services/game.service';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface GameContextType {
  gameModes: GameModeDto[];
  gameModesAndAlLots : GameAndAllLots | undefined;
  upcomingDraws: DrawDto[];
  loading: boolean;
  error: string | null;
  fetchGameModes: () => Promise<GameModeDto[] | void>;
  fetchGameModesAndLots: () => Promise<GameAndAllLots | void>;
  fetchUpcomingDraws: (gameModeId: number) => Promise<DrawDto[] | void>;
  fetchBotDraws: (gameModeId: number) => Promise<DrawDto[] | void>;
  setCurrentGameSlot: React.Dispatch<React.SetStateAction<DrawDto | null>>;
  currentGameSlot: DrawDto | null;
  getHolidays: () => Promise<HolidayDto[] | void>;
  holidayData: HolidayDto[];
  // toggleGameStatus: (gameModeId: number) => Promise<void>;
  // updateBetCloseTime: (gameModeId: number, minutes: number) => Promise<void>;
  // publishDrawResult: (data: unknown) => Promise<DrawDto>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameModes, setGameModes] = useState<GameModeDto[]>([]);
  const [gameModesAndAlLots, setGameModesAndAlLots] = useState<GameAndAllLots>();
  const [upcomingDraws, setUpcomingDraws] = useState<DrawDto[]>([]);
  const [currentGameSlot, setCurrentGameSlot] = useState<DrawDto | null>(null);
  const [holidayData, setHolidayData] = useState<HolidayDto[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setUpcomingDraws([]);
  }, [window.location.pathname]);
  const fetchGameModes = async () => {
    // Implement fetching game modes logic here
    setLoading(true);
    try {
      // Simulate loading state
      const response = await gameService.getGameModes();
      const data = response as GameModeDto[];
      setGameModes(data);
      return data;
    } catch (error) {
      console.error('Error fetching game modes:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchGameModesAndLots = async () => {
    // Implement fetching game modes logic here
    setLoading(true);
    try {
      // Simulate loading state
      const response = await gameService.getGameModesAndLots();
      const data = response as GameAndAllLots;
      setGameModesAndAlLots(data);
      return data;
    } catch (error) {
      console.error('Error fetching game modes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingDraws = async (gameModeId: number) => {
    if (upcomingDraws && upcomingDraws.length > 0) return upcomingDraws;
    // Implement fetching upcoming draws logic here
    try {
      setLoading(true);
      // Simulate loading state
      const response = await gameService.getFutureDraws(gameModeId);
      setUpcomingDraws(response as DrawDto[]);
      return response as DrawDto[];
    } catch (error) {
      console.error('Error fetching upcoming draws:', error);
    } finally {
      setLoading(false);
    }
  };
  // Helper type guard for Axios-like errors
  function isAxiosError(err: unknown): err is { response: { status: number; data: ApiError } } {
    return (
      typeof err === 'object' &&
      err !== null &&
      'response' in err &&
      typeof (err as { response?: unknown }).response === 'object' &&
      (err as { response?: unknown }).response !== null &&
      'status' in (err as { response: { status?: unknown } }).response &&
      'data' in (err as { response: { data?: unknown } }).response
    );
  }

  const fetchBotDraws = async (gameModeId: number) => {
    if (upcomingDraws && upcomingDraws.length > 0) return upcomingDraws;
    try {
      setLoading(true);
      const response = await gameService.getBotDraws(gameModeId);
      setUpcomingDraws(response as DrawDto[]);
      return response as DrawDto[];
    } catch (error: unknown) {
      let apiError: ApiError | undefined;
      let status: number | undefined;
      if (isAxiosError(error)) {
        status = error.response.status;
        apiError = error.response.data;
      }
      if (
        status === 500 &&
        apiError?.isError &&
        apiError?.detail
      ) {
        toast({
          title: 'Error',
          description: apiError.detail,
          variant: 'destructive',
        });
        setTimeout(() => {
          navigate('/');
        }, 300);
      } else {
        toast({
          title: 'Error',
          description: 'An unexpected error occurred.',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  //Get Holidays
  const getHolidays = async () => {
    // Implement fetching upcoming draws logic here
    try {
      setLoading(true);
      // Simulate loading state
      const response = await gameService.getHolidayData();
      setHolidayData(response);
      return response;
    } catch (error) {
      console.error('Error fetching upcoming draws:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <GameContext.Provider
      value={{
        gameModes,
        gameModesAndAlLots,
        fetchGameModes,
        fetchGameModesAndLots,
        fetchUpcomingDraws,
        fetchBotDraws,
        upcomingDraws,
        setCurrentGameSlot,
        currentGameSlot,
        getHolidays,
        loading,
        error: null,
        holidayData,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}
