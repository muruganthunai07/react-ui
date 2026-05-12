import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ShoppingBag } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/cart-context';
import { useAuth } from '@/contexts/auth-context';
import { GameRules } from '@/components/game-rules';
import { v4 as uuidv4 } from 'uuid';
import TimerOptions from './TimerOptions';
import momentTz from 'moment-timezone';
import { useTimer } from '@/hooks/useTimer';
import { useDashboard } from '@/contexts/dasboard-context';
import {
  convertTo24HourFormat,
  get12HourTimeArray,
  getNextClosestTime,
  getRemainingTime,
  getNextBotDrawTime,
  isSameTime,
} from '@/utils/TimeFunctions';
import BiBoxContainer from './game/BiBoxContainer';
import { ResultsContent } from './results-content';
import { useGameContext } from '@/contexts/GameContext';
import type { DrawDto, GameModeDto, PlayableLots } from '@/types/api';
import TimerComponent from './TimerComponent';
import GameProgressBar from './GameProgressBar';
import MultiBoxContainer from './game/MultiBoxContainer';
import type { BetNumbersMap, QuantitiesMap } from './3DGame/models';
import './3DGame/three-digit-game.css'
import LotteryLoadingOverlay from '@/components/ui/LotteryLoadingOverlay';
import { useBetClosed } from '@/hooks/useBetClosed';
import { BettingClosedOverlay } from './BettingClosedOverlay';
import { ERROR_CODES } from './3DGame/models';
import { MyOrder } from './MyOrder';
interface ThreeDigitGameProps {
  gameType?: string;
  gameId?: number;
  isBot?: boolean;  
  name?: string
}
// Change from 'export function' to 'export const' to ensure named export works correctly
export const ThreeDigitGame = ({
  gameType = '',
  gameId = 0,
  isBot = false,
  name = ''
}: ThreeDigitGameProps) => {
  const navigate = useNavigate();
  const { allModes } = useDashboard();
  const {
    fetchUpcomingDraws,
    fetchBotDraws,
    setCurrentGameSlot,
    currentGameSlot,
  } = useGameContext();
  const { addItem, totalBets, totalAmount } = useCart();
  const { isAgent } = useAuth();
  const currentGame = allModes[gameType]?.find((x: GameModeDto) => x.id === gameId);
  
  // Memoize sorted playableLots to ensure consistent sorting
  const sortedPlayableLots = useMemo(() => {
    if (!currentGame?.playableLots) return [];
    return [...currentGame.playableLots].sort((a, b) => (a.winningAmount || 0) - (b.winningAmount || 0));
  }, [currentGame?.playableLots]);

  const [selectedTimeOption, setSelectedTimeOption] = useState(
    getNextClosestTime(allModes[gameType][0]?.gameTimes || [])?.timeStr || ''
  );
  const [quantities, setQuantities] = useState<QuantitiesMap>({});
  const [betNumbers, setBetNumbers] = useState<BetNumbersMap>({});
  const [showRules, setShowRules] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [drawCycleKey, setDrawCycleKey] = useState(0);
  // Use the custom hook
  const [isBetClosed, showBetClosedOverlay] = useBetClosed(selectedTimeOption, currentGame?.betCloseTimeSeconds ?? 0);
  const remainingTime = useMemo(() => {
    if (!selectedTimeOption) return { hours: 0, minutes: 0, seconds: 0 };
    return getRemainingTime(convertTo24HourFormat(selectedTimeOption));
  }, [selectedTimeOption]);
  const [resultsRefreshKey, setResultsRefreshKey] = useState(0);
  
  const timer = useTimer(
    remainingTime,
    () => {
      if (selectedTimeOption) {
        toast({ title: 'New Draw!', description: 'Time expired — new numbers are being drawn!' });
        setResultsRefreshKey((k) => k + 1);
        setDrawCycleKey((k) => k + 1);
      }
    },
    selectedTimeOption
  );
 
  //initilonly to set selectedTimeOption
  useEffect(() => {
    if (allModes && allModes[gameType]) {
      const setBotTime = () => {
        const current = allModes[name]?.filter(
          (game: GameModeDto) => game.id === gameId
        );
        const interval = getNextBotDrawTime(
          JSON.parse(current?.[0]?.botDetails)?.IntervalMin
        );
        return interval;
      };
      
      const time = isBot ? setBotTime() : getNextClosestTime((currentGame?.gameTimes) || [])?.timeStr;
      setSelectedTimeOption(time);
    }
  }, [drawCycleKey]);

  //For API
  useEffect(() => {
    const fetchDraws = async () => {
      try {
        setIsLoading(true);
        const draws: DrawDto[] =
          (isBot
            ? await fetchBotDraws(gameId)
            : await fetchUpcomingDraws(gameId)) || [];
        const data = isBot
          ? draws
          : draws.filter((draw) =>
              isSameTime(selectedTimeOption, draw.drawDateTime)
            );
        const finalDraw: DrawDto[] = data;
        if (finalDraw.length == 0) {
          navigate("/error", {
            state: { errorCode: `5569 - ${ERROR_CODES["5569"]}` },
          });
        }
        setCurrentGameSlot(finalDraw[0]);

        const frameBetNumber: BetNumbersMap = {};
        const frameBetQualities: QuantitiesMap = {};

        currentGame?.playableLots?.forEach((lot: PlayableLots) => {
          const lotConfig = {
            Single: {
              betNumbers: { single: [null, null, null] },
              quantities: { single: [1, 1, 1] },
            },
            Double: {
              betNumbers: {
                doubleAB: [null, null],
                doubleAC: [null, null],
                doubleBC: [null, null],
              },
              quantities: {
                doubleAB: 1,
                doubleAC: 1,
                doubleBC: 1,
              },
            },
            Three: {
              betNumbers: { triple: [null, null, null] },
              quantities: { triple: 1 },
            },
            Four: {
              betNumbers: { four: [null, null, null, null] },
              quantities: { four: 1 },
            },
          };

          const config = lotConfig[lot.type as keyof typeof lotConfig];
          if (config) {
            frameBetNumber[lot.name] = config.betNumbers;
            frameBetQualities[lot.name] = config.quantities;
          }
        });
        setBetNumbers((prev) =>
          JSON.stringify(prev) !== JSON.stringify(frameBetNumber)
            ? { ...frameBetNumber }
            : prev
        );
        setQuantities((prev) =>
          JSON.stringify(prev) !== JSON.stringify(frameBetQualities)
            ? { ...frameBetQualities }
            : prev
        );
      } catch (error) {
        console.error("Error fetching upcoming draws:", error);
        // setError removed, only navigate
        navigate("/error", {
          state: { errorCode: `5568 - ${ERROR_CODES["5568"]}` },
        });
      } finally {
        setIsLoading(false);
      }
    };
    if (gameId) fetchDraws();
  }, [gameId, drawCycleKey, currentGameSlot, selectedTimeOption]);


  // Optimized handlers with better type safety and performance
  const handleQuantityChange = useCallback(
    (lotName: string, gameKey: string, quantity: number, position?: number) => {
      setQuantities((prev) => {
        const lot = prev[lotName] || {};
        
        // Handle single type with array positions
        if (gameKey === 'single' && Array.isArray(lot.single) && position !== undefined) {
          const updated = [...lot.single];
          updated[position] = quantity;
          return {
            ...prev,
            [lotName]: { ...lot, single: updated }
          };
        }
        
        // Handle other types (double, triple, four)
        return {
          ...prev,
          [lotName]: { ...lot, [gameKey]: quantity }
        };
      });
    },
    []
  );

  const handleNumberChange = useCallback(
    (lotName: string, gameKey: string, value: string, position?: number) => {
      // Validate input: only empty string or single digit
      if (value !== '' && !/^[0-9]$/.test(value)) return;
      
      setBetNumbers((prev) => {
        const lot = prev[lotName] || {};
        const isArrayType = ['single', 'doubleAB', 'doubleAC', 'doubleBC', 'triple', 'four'].includes(gameKey);
        
        if (isArrayType && Array.isArray(lot[gameKey]) && position !== undefined) {
          const updated = [...(lot[gameKey] as (string | null)[])];
          updated[position] = value;
          return {
            ...prev,
            [lotName]: { ...lot, [gameKey]: updated }
          };
        }
        
        return prev;
      });
    },
    []
  );

  // Optimized random digit generator with memoized length config
  const digitLengths = useMemo(() => ({
    single: 3,
    doubleAB: 2,
    doubleAC: 2,
    doubleBC: 2,
    triple: 3,
    four: 4,
  }), []);

  const generateRandomDigit = useCallback((type: string) => {
    const length = digitLengths[type as keyof typeof digitLengths] || 3;
    return Array.from({ length }, () => Math.floor(Math.random() * 10).toString());
  }, [digitLengths]);

  const handleQuickGuess = useCallback((lotKey: string, type: string) => {
    setBetNumbers((prev) => {
      const currentLot = prev[lotKey] || {};
      
      if (type === 'single') {
        // For single type, generate individual random digits for each position
        const updatedSingle = Array.from({ length: 3 }, () => 
          Math.floor(Math.random() * 10).toString()
        );
        
        return {
          ...prev,
          [lotKey]: {
            ...currentLot,
            single: updatedSingle,
          },
        };
      } else {
        // For other types, use the existing generateRandomDigit function
        return {
          ...prev,
          [lotKey]: {
            ...currentLot,
            [type]: generateRandomDigit(type),
          },
        };
      }
    });
  }, [generateRandomDigit]);

  // Optimized permutation generator with better performance
  const generatePermutations = useCallback(
    (digits: string[], isFourDigit: boolean): { digitX: string; digitA: string; digitB: string; digitC: string }[] => {
      const uniquePermutations = new Set<string>();
      const results: { digitX: string; digitA: string; digitB: string; digitC: string }[] = [];

      const permute = (arr: string[], start: number) => {
        if (start === arr.length - 1) {
          const key = arr.join('');
          if (!uniquePermutations.has(key)) {
            uniquePermutations.add(key);
            results.push(
              isFourDigit
                ? {
                    digitX: arr[0],
                    digitA: arr[1],
                    digitB: arr[2],
                    digitC: arr[3],
                  }
                : {
                    digitX: '',
                    digitA: arr[0],
                    digitB: arr[1],
                    digitC: arr[2],
                  }
            );
          }
          return;
        }

        for (let i = start; i < arr.length; i++) {
          [arr[start], arr[i]] = [arr[i], arr[start]];
          permute([...arr], start + 1);
          [arr[start], arr[i]] = [arr[i], arr[start]];
        }
      };

      permute([...digits], 0);
      return results;
    },
    []
  );

  // Helper to calculate bet close time as a Date
  const getBetCloseDate = useCallback(() => {
    if (!selectedTimeOption || !currentGame?.betCloseTimeSeconds) return new Date();
    const [time, period] = selectedTimeOption.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let drawMoment = momentTz.tz('Asia/Kolkata').set({
      hour: period === 'PM' ? (hours % 12) + 12 : hours % 12,
      minute: minutes,
      second: 0,
      millisecond: 0,
    });
    // If draw time is before now, assume it's for the next day
    if (drawMoment.isBefore(momentTz.tz('Asia/Kolkata'))) {
      drawMoment = drawMoment.add(1, 'day');
    }
    const closeMoment = drawMoment.clone().subtract(currentGame?.betCloseTimeSeconds, 'seconds');
    return closeMoment.toDate();
  }, [selectedTimeOption, currentGame?.betCloseTimeSeconds]);

  // Optimized Box bet handler
  const handleBoxBet = useCallback(
    (key: string, type: string) => {
      const lot = betNumbers[key] || {};
      const isFourDigit = type !== 'triple';
      
      // Extract digits based on type
      const digits = isFourDigit 
        ? [lot.four?.[0] ?? '', lot.four?.[1] ?? '', lot.four?.[2] ?? '', lot.four?.[3] ?? '']
        : [lot.triple?.[0] ?? '', lot.triple?.[1] ?? '', lot.triple?.[2] ?? ''];
      
      // Validate all digits are entered
      const allDigitsEntered = isFourDigit 
        ? digits.every(d => d !== '') 
        : digits.every(d => d !== '');
      
      if (!allDigitsEntered) {
        toast({
          title: 'Invalid Box Bet',
          description: isFourDigit
            ? 'Please enter all four digits for a 4-digit Box bet (xabc)'
            : 'Please enter all three digits for a 3-digit Box bet (abc)',
          variant: 'destructive',
        });
        return;
      }
      
      const permutations = generatePermutations(digits as string[], isFourDigit);
      
      const playableLot = currentGame?.playableLots.find((lot) => lot.name === key);
      const price = getPrice(playableLot);
      const unit = isFourDigit ? (quantities[key]?.four ?? 1) : (quantities[key]?.triple ?? 1);
      
      // Add all permutations to cart
      permutations.forEach((finalNumber) => {
        addItem({
          id: uuidv4(),
          gameType: isFourDigit ? '4 digit' : '3 digit',
          lotName: `${gameType} Box`,
          drawId: currentGameSlot?.drawId ?? 0,
          lotTypeId: playableLot?.id ?? 0,
          drawTime: selectedTimeOption,
          numbers: finalNumber,
          unit,
          price,
          amount: price * unit,
          expiresAt: getBetCloseDate(),
          gameModeName: currentGame?.name || '',
          lotTypeName: playableLot?.name || '',
        });
      });
      
      // Reset bet numbers
      setBetNumbers((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          triple: [null, null, null],
          ...(isFourDigit && { four: [null, null, null, null] }),
        },
      }));
      
      toast({
        title: 'Box Bet Added',
        description: `Added ${permutations.length} permutations of ${digits.join('')} to your cart.`,
      });
    },
    [betNumbers, quantities, getBetCloseDate, addItem, generatePermutations, gameType, currentGameSlot, selectedTimeOption]
  );

  const handleAddBet = useCallback(
    (key: string, type: string, position: number) => {
      if (isBetClosed) {
        toast({
          title: 'Betting Closed',
          description: 'You cannot place bets after betting is closed.',
          variant: 'destructive',
        });
        return;
      }
      let valid = false;
      const numbers: { digitX: string; digitA: string; digitB: string; digitC: string;  } = { digitX: '', digitA: '', digitB: '', digitC: '' };
      const foundLot = currentGame?.playableLots?.find((lot) => lot?.name?.toLowerCase() === key?.toLowerCase());
      const price = getPrice(foundLot);
      const lotName = gameType;
      
      switch (type) {
        case 'single':
          valid = betNumbers[key]?.single?.[position] !== '' && betNumbers[key]?.single?.[position] !== null;
          if (position === 0) numbers.digitA = betNumbers[key]?.single?.[position] ?? '';
          if (position === 1) numbers.digitB = betNumbers[key]?.single?.[position] ?? '';
          if (position === 2) numbers.digitC = betNumbers[key]?.single?.[position] ?? '';
          break;
        case 'doubleAB':
          valid = Array.isArray(betNumbers[key]?.[type]) && (betNumbers[key]?.[type] as (string | null)[]).every((val) => val !== '' && val !== null);
          numbers.digitA = (betNumbers[key]?.[type] as (string | null)[])[0] ?? '';
          numbers.digitB = (betNumbers[key]?.[type] as (string | null)[])[1] ?? '';
          break;
        case 'doubleAC':
          valid = Array.isArray(betNumbers[key]?.[type]) && (betNumbers[key]?.[type] as (string | null)[]).every((val) => val !== '' && val !== null);
          numbers.digitA = (betNumbers[key]?.[type] as (string | null)[])[0] ?? '';
          numbers.digitC = (betNumbers[key]?.[type] as (string | null)[])[1] ?? '';
          break;
        case 'doubleBC':
          valid = Array.isArray(betNumbers[key]?.[type]) && (betNumbers[key]?.[type] as (string | null)[]).every((val) => val !== '' && val !== null);
          numbers.digitB = (betNumbers[key]?.[type] as (string | null)[])[0] ?? '';
          numbers.digitC = (betNumbers[key]?.[type] as (string | null)[])[1] ?? '';
          break;
        default:     
         { const numberKey = type === 'four' ? ['digitX', 'digitA', 'digitB', 'digitC'] : ['digitA', 'digitB', 'digitC'];
           valid = Array.isArray(betNumbers[key]?.[type]) && (betNumbers[key]?.[type] as (string | null)[]).every((val) => val !== '' && val !== null);
          
          for (let i = 0; i < (betNumbers[key]?.[type] as (string | null)[])?.length; i++) {
            if (numberKey[i] === 'digitX') numbers.digitX = (betNumbers[key]?.[type] as (string | null)[])[i] ?? '';
            if (numberKey[i] === 'digitA') numbers.digitA = (betNumbers[key]?.[type] as (string | null)[])[i] ?? '';
            if (numberKey[i] === 'digitB') numbers.digitB = (betNumbers[key]?.[type] as (string | null)[])[i] ?? '';
            if (numberKey[i] === 'digitC') numbers.digitC = (betNumbers[key]?.[type] as (string | null)[])[i] ?? '';
          }
          break; }
      }
      
      const betAmount = valid ? price * (type === 'single' ? (quantities[key]?.single?.[position] ?? 1) : (quantities[key]?.[type] as number ?? 1)) : 0;
      if (valid) {
        addItem({
          id: uuidv4(),
          gameType: '3digit',
          lotName,
          drawId: currentGameSlot?.drawId ?? 0,
          lotTypeId: currentGame?.playableLots.find((lot) => lot.name === key)?.id ?? 0,
          drawTime: selectedTimeOption,
          numbers: numbers,
          unit: type === 'single' ? (quantities[key]?.single?.[position] ?? 1) : (quantities[key]?.[type] as number ?? 1),
          price,
          amount: betAmount,
          expiresAt: getBetCloseDate(),
          gameModeName: currentGame?.name || '',
          lotTypeName: currentGame?.playableLots.find((lot) => lot.name === key)?.name || '',
        });
        setBetNumbers((prev) => ({
          ...prev,
          [key]: {
            ...prev[key],
            [type]:
              type === 'single' && Array.isArray(prev[key]?.[type]) && typeof position === 'number'
                ? (prev[key]?.[type] as (string | null)[]).map((val, idx) => idx === position ? null : val)
                : Array.isArray(prev[key]?.[type])
                  ? (prev[key]?.[type] as (string | null)[]).map(() => null)
                  : prev[key]?.[type],
          },
        }));
      } else {
        toast({
          title: 'Invalid Bet',
          description: 'Please enter all required numbers',
          variant: 'destructive',
        });
      }
    },
    [betNumbers, quantities, getBetCloseDate, addItem, isBetClosed]
  );

  const formatTime = (hours: number, minutes: number) => {
    return `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${
      hours >= 12 ? 'PM' : 'AM'
    }`;
  };

  const currentTime = momentTz.tz('Asia/Kolkata');
  const displayTime = formatTime(currentTime.hours(), currentTime.minutes());

  // Handle navigation to cart
  const navigateToCart = () => {
    navigate('/cart');
  };
  const getTimeOptions = () => {
    if (isBot) {
      const finalData: string[] = [];
      const game = allModes[name][0];
      if (game && game.botDetails) {
        const interval = JSON.parse(game.botDetails).IntervalMin;
        finalData.push(interval + ' Mins');
      };
      return finalData;
    } else {
      return get12HourTimeArray(allModes[gameType][0]?.gameTimes || []);
    }
  };

  // Helper to get the correct price based on user role
  const getPrice = useCallback(
    (lot: PlayableLots | undefined) => (isAgent ? lot?.agentPrice ?? 0 : lot?.clientPrice ?? 0),
    [isAgent]
  );

  // Helper to flatten quantities for BiBoxContainer
  function flattenQuantitiesForBiBox(quantities: QuantitiesMap): Record<string, { single: number[]; doubleAB?: number; doubleAC?: number; doubleBC?: number }> {
    const result: Record<string, { single: number[]; doubleAB?: number; doubleAC?: number; doubleBC?: number }> = {};
    for (const key in quantities) {
      const q = quantities[key] || {};
      result[key] = {
        single: Array.isArray(q.single) ? q.single.map((v) => v ?? 1) : [1, 1, 1],
        doubleAB: q.doubleAB ?? 1,
        doubleAC: q.doubleAC ?? 1,
        doubleBC: q.doubleBC ?? 1,
      };
    }
    return result;
  }

  // Helper to flatten quantities for MultiBoxContainer
  function flattenQuantitiesForMultiBox(quantities: QuantitiesMap): { [key: string]: { [key: string]: number } } {
    const result: { [key: string]: { [key: string]: number } } = {};
    for (const key in quantities) {
      const q = quantities[key] || {};
      result[key] = {
        triple: q.triple ?? 1,
        four: q.four ?? 1,
      };
    }
    return result;
  }

  // Get game type CSS class
  const getGameTypeClass = () => {
    if (isBot) return 'game-type-bot';
    switch (gameType?.toLowerCase()) {
      case 'dear':
        return 'game-type-dear';
      case 'jackpot':
        return 'game-type-jackpot';
      case 'kerala':
        return 'game-type-kerala';
      default:
        return 'game-type-default';
    }
  };
  // No need to render ErrorPage here, navigation will handle it
  return (
    <div className='flex flex-col h-full bg-background'>
      <LotteryLoadingOverlay show={isLoading} />
      <BettingClosedOverlay show={showBetClosedOverlay} />
      <style>{hideScrollbarStyle}</style>
      {/* Game header */}
      <div className={`game-header ${getGameTypeClass()}`}>
        <div className='game-header-content'>
          <div className='game-logo'>
            {gameType?.toUpperCase() + ' Lottery'}
          </div>

          <div className='game-draw-time'>
            <span className='font-medium'>Draw Time:</span>{' '}
         {selectedTimeOption}
             
          </div>
        </div>
      </div>
      <Button
            variant="secondary"
            className="flex items-center gap-2 shadow-md"
            onClick={() => setShowRules(true)}
          >
            <BookOpen className="w-4 h-4" />
            Game Rules
          </Button>
      <div className='flex-1 w-full overflow-auto pb-20'>

      {!isBot && (
        <TimerOptions
          timeOptions={getTimeOptions()}
          selectedTimeOption={selectedTimeOption}
          setSelectedTimeOption={setSelectedTimeOption}
          isBot={isBot}
          betCloseTimeSeconds={currentGame?.betCloseTimeSeconds ?? 0}
        />
      )}
        {/* Quick info */}
        <div className='p-4'>
          <TimerComponent timer={timer} displayTime={displayTime} />
        </div>

        {/* Progress bar */}
        <div className='h-3 bg-gray-800 relative overflow-hidden rounded-full mx-4 my-2 shadow-inner'>
          <GameProgressBar
            timer={timer}
            selectedTimeOption={selectedTimeOption}
            betCloseTimeSeconds={currentGame?.betCloseTimeSeconds ?? 0}
            isBot={isBot}
            botIntervalMinutes={isBot ?  JSON.parse(allModes[name]?.filter(
              (game: GameModeDto) => game.id === gameId
            )?.[0]?.botDetails)?.IntervalMin: undefined}
          />
        </div>

        {/* Betting sections */}
        <div className='p-4 space-y-8' key={gameId}>
          {/* Single Digit */}
          {sortedPlayableLots
            ?.filter((lot) => lot.type === 'Single')
            .map((lot) => (
              <Card key={lot.id}>
                <CardContent className='p-4'>
                  <div className='flex justify-between items-center mb-4 flex-wrap gap-2'>
                    <div>
                      <h3 className='text-lg font-bold'>{lot.name}</h3>
                      <p className='text-sm text-muted-foreground'>
                        ₹{getPrice(lot)}
                      </p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Badge
                        variant='secondary'
                        className='bg-primary/10 text-primary'
                      >
                        Win
                      </Badge>
                      <span className='font-bold'>₹{lot.winningAmount}</span>
                    </div>
                    <Button
                      variant='outline'
                      className='text-sm font-medium'
                      onClick={() => {
                        handleQuickGuess(lot.name, 'single');
                      }}
                      disabled={isBetClosed}
                    >
                      Quick Guess
                    </Button>
                  </div>

                  {/* Single A, B, C */}
                  {['A', 'B', 'C'].map((digit, idx) => (
                    <BiBoxContainer
                      digit={digit}
                      value={[(betNumbers[lot.name]?.single?.[idx] ?? '')]}
                      lotName={lot.name}
                      position={idx}
                      gameKey='single'
                      handleQuantityChange={handleQuantityChange}
                      quantities={flattenQuantitiesForBiBox(quantities)}
                      handleNumberChange={handleNumberChange}
                      handleAddBet={handleAddBet}
                      disabled={isBetClosed}
                    />
                  ))}
                </CardContent>
              </Card>
            ))}

          {/* Triple Digit */}

          {/* Double Digits */}
          {sortedPlayableLots
            ?.filter((lot) => lot.type === 'Double')
            .map((lot) => (
              <Card key={lot.id}>
                <CardContent className='p-4'>
                  <div className='flex justify-between items-center mb-4 flex-wrap gap-2'>
                    <div>
                      <h3 className='text-lg font-bold'>{lot.name}</h3>
                      <p className='text-sm text-muted-foreground'>
                        ₹{getPrice(lot)}
                      </p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Badge
                        variant='secondary'
                        className='bg-primary/10 text-primary'
                      >
                        Win
                      </Badge>
                      <span className='font-bold'>₹{lot.winningAmount}</span>
                    </div>
                    <Button
                      variant='outline'
                      className='text-sm font-medium'
                      onClick={() => {
                        handleQuickGuess(lot.name, 'doubleAB');
                        handleQuickGuess(lot.name, 'doubleBC');
                        handleQuickGuess(lot.name, 'doubleAC');
                      }}
                      disabled={isBetClosed}
                    >
                      Quick Guess
                    </Button>
                  </div>
                  {/* Double AB */}
                  <BiBoxContainer
                    digit={'AB'}
                    value={(betNumbers[lot.name]?.['doubleAB'] ?? []).map((v) => v ?? '')}
                    lotName={lot.name}
                    position={0}
                    gameKey={'doubleAB'}
                    handleQuantityChange={handleQuantityChange}
                    quantities={flattenQuantitiesForBiBox(quantities)}
                    handleNumberChange={handleNumberChange}
                    handleAddBet={handleAddBet}
                    disabled={isBetClosed}
                  />
                  <BiBoxContainer
                    digit={'BC'}
                    value={(betNumbers[lot.name]?.['doubleBC'] ?? []).map((v) => v ?? '')}
                    lotName={lot.name}
                    position={0}
                    gameKey={'doubleBC'}
                    handleQuantityChange={handleQuantityChange}
                    quantities={flattenQuantitiesForBiBox(quantities)}
                    handleNumberChange={handleNumberChange}
                    handleAddBet={handleAddBet}
                    disabled={isBetClosed}
                  />
                  <BiBoxContainer
                    digit={'AC'}
                    value={(betNumbers[lot.name]?.['doubleAC'] ?? []).map((v) => v ?? '')}
                    lotName={lot.name}
                    position={0}
                    gameKey={'doubleAC'}
                    handleQuantityChange={handleQuantityChange}
                    quantities={flattenQuantitiesForBiBox(quantities)}
                    handleNumberChange={handleNumberChange}
                    handleAddBet={handleAddBet}
                    disabled={isBetClosed}
                  />
                </CardContent>
              </Card>
            ))}

          {/* Three Digits */}
          {sortedPlayableLots
            ?.filter((lot) => lot.type === 'Three')
            .map((lot) => (
              <Card key={lot.id}>
                <CardContent className='p-4'>
                  <div className='flex justify-between items-center mb-4 flex-wrap gap-2'>
                    <div>
                      <h3 className='text-lg font-bold'>{lot.name}</h3>
                      <p className='text-sm text-muted-foreground'>
                        ₹{getPrice(lot)}
                      </p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Badge
                        variant='secondary'
                        className='bg-primary/10 text-primary'
                      >
                        Win
                      </Badge>
                      <span className='font-bold'>₹{lot.winningAmount}</span>
                    </div>
                    <Button
                      variant='outline'
                      className='text-sm font-medium'
                      onClick={() => handleQuickGuess(lot.name, 'triple')}
                      disabled={isBetClosed}
                    >
                      Quick Guess
                    </Button>
                  </div>
                  <MultiBoxContainer
                    digit={'ABC'}
                    value={(betNumbers[lot.name]?.['triple'] ?? []).map((v) => v ?? '')}
                    lotName={lot.name}
                    position={0}
                    gameKey={'triple'}
                    handleQuantityChange={handleQuantityChange}
                    quantities={flattenQuantitiesForMultiBox(quantities)}
                    handleNumberChange={handleNumberChange}
                    handleBoxBet={handleBoxBet}
                    handleAddBet={handleAddBet}
                    disabled={isBetClosed}
                  />
                </CardContent>
              </Card>
            ))}
          {/* Four Digit */}
          {sortedPlayableLots
            ?.filter((lot) => lot.type === 'Four')
            .map((lot) => (
              <Card key={lot.id}>
                <CardContent className='p-4'>
                  <div className='flex justify-between items-center mb-4 flex-wrap gap-2'>
                    <div>
                      <h3 className='text-lg font-bold'>{lot.name}</h3>
                      <p className='text-sm text-muted-foreground'>
                        ₹{getPrice(lot)}
                      </p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Badge
                        variant='secondary'
                        className='bg-primary/10 text-primary'
                      >
                        Win
                      </Badge>
                      <span className='font-bold'>₹{lot.winningAmount}</span>
                    </div>
                    <Button
                      variant='outline'
                      className='text-sm font-medium'
                      onClick={() => handleQuickGuess(lot.name, 'four')}
                      disabled={isBetClosed}
                    >
                      Quick Guess
                    </Button>
                  </div>
                  <MultiBoxContainer
                    digit={'XABC'}
                    value={(betNumbers[lot.name]?.['four'] ?? []).map((v) => v ?? '')}
                    lotName={lot.name}
                    position={0}
                    gameKey={'four'}
                    handleQuantityChange={handleQuantityChange}
                    quantities={flattenQuantitiesForMultiBox(quantities)}
                    handleNumberChange={handleNumberChange}
                    handleBoxBet={handleBoxBet}
                    handleAddBet={handleAddBet}
                    disabled={isBetClosed}
                  />
                </CardContent>
              </Card>
            ))}
        </div>
        {/* )} */}

        {/* Results section */}
        <div className='p-4'>
          <Tabs defaultValue='result'>
            <TabsList className='w-full grid grid-cols-2'>
              <TabsTrigger value='result'>Result</TabsTrigger>
              <TabsTrigger value='my-order'>My order</TabsTrigger>
            </TabsList>
            <TabsContent value='result' className='mt-4'>
              <ResultsContent gameModeIdProp={gameId} refreshKey={resultsRefreshKey} />
            </TabsContent>
            <TabsContent value='my-order' className='mt-4'>
              <Card>
                <CardContent className='p-4 text-center'>
                 <MyOrder drawId={currentGameSlot?.drawId}/>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Game Rules Dialog */}
      <GameRules open={showRules} onOpenChange={setShowRules} />

      {/* Cart Bottom Bar */}
      <div className='fixed bottom-0 left-0 right-0 bg-background border-t p-3 flex justify-between items-center z-30'>
        <div className='flex items-center'>
          <div className='bg-muted rounded-full p-2 mr-2'>
            <ShoppingBag className='h-5 w-5 text-foreground' />
          </div>
          <div>
            <div className='font-bold'>₹{totalAmount.toFixed(2)}</div>
            <div className='text-xs text-muted-foreground'>
              {totalBets} bets
            </div>
          </div>
        </div>
        <Button onClick={navigateToCart} className='px-8'>
          Place Bet
        </Button>
      </div>
    </div>
  );
};


// Add this at the top of the file, after the imports
// Add a style tag to hide scrollbars on certain elements
const hideScrollbarStyle = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
