import { useEffect, useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CategoryFilter } from '@/components/category-filter';
import { Card, CardContent } from '@/components/ui/card';
import { useDashboard } from '@/contexts/dasboard-context';
import type { ResultPayload, ResultDto } from '@/types/api';
import { get12HourTime } from '@/utils/TimeFunctions';
import momentTz from 'moment-timezone';
import {
  Pagination,
  PaginationContent,
  // PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';
import { getPaginationRange } from '@/utils/PaginationFunctions';
import { RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { Player } from '@lottiefiles/react-lottie-player';
import noResultsLottie from '@/assets/lottie/no-results-found.json';
import LotteryLoadingOverlay from '@/components/ui/LotteryLoadingOverlay';

interface ResultsContentProps {
  defaultCategory?: string;
  gameModeIdProp?: number;
  refreshKey?: number;
}

const GAME_MODES = [
  { id: '1', name: 'Kerala' },
  { id: '2', name: 'Dear' },
  { id: '3', name: 'Jackpot' },
  { id: '4', name: 'Quick Games 5 min' },
  { id: '5', name: 'Quick Games 15 min' },
  { id: '6', name: 'Quick Games 30 min' },
];

export function ResultsContent({ defaultCategory = '1', gameModeIdProp, refreshKey }: ResultsContentProps) {
  const [category, setCategory] = useState<string>(defaultCategory);
  const [isLoading, setIsLoading] = useState(false);

  // If gameModeIdProp is provided, use it for filtering and skip all filters/date UI
  const isGameModeIdProp = typeof gameModeIdProp === 'number';

  // Helper function to get gameModeId from category
  const getGameModeId = (cat: string) => {
    const found = GAME_MODES.find((c) => c.id === cat);
    return found ? Number(found.id) : null;
  };

  const [formData, setFormData] = useState<ResultPayload>({
    startDate: null,
    endDate: null,
    gameModeId: isGameModeIdProp ? gameModeIdProp : getGameModeId(defaultCategory),
    pageNumber: 1,
    pageSize: 5,
  });
  const [dateCleared, setDateCleared] = useState(false);
  const { results, getResults } = useDashboard();
  //categories
  const categories = GAME_MODES;
  // Sample results data
  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
  ];

  // Update category when defaultCategory prop changes
  useEffect(() => {
    setCategory(defaultCategory);
    setFormData((prev) => ({
      ...prev,
      gameModeId: getGameModeId(defaultCategory),
    }));
  }, [defaultCategory]);

  // Set default date to today on mount
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 1, 0);
    const end = new Date(today);
    end.setHours(23, 59, 58, 0);
    if (!isGameModeIdProp) {
      setFormData((prev) => ({
        ...prev,
        startDate: momentTz(today).tz('Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ss'),
        endDate: momentTz(end).tz('Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ss'),
        pageNumber: 1,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        gameModeId: gameModeIdProp,
        startDate: momentTz(today).tz('Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ss'),
        endDate: momentTz(end).tz('Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ss'),
        pageNumber: 1,
      }));
    }
  }, [gameModeIdProp, isGameModeIdProp]);

  useEffect(() => {
    // Make API call when formData changes
    // Since we now always have dates (either selected or default 30-day range), we can always make the call
    setIsLoading(true);
    Promise.resolve(getResults(formData)).finally(() => {
      setIsLoading(false);
      if (dateCleared) setDateCleared(false);
    });
  }, [formData, refreshKey, dateCleared]);

  const filteredResults: ResultDto[] = isGameModeIdProp
    ? (results?.items ?? [])
    : (results?.items ?? []).filter(
        (result) => {
          if (["4", "5", "6"].includes(category)) {
            return result.gameModeName && result.gameModeName.toLowerCase() === "quick games";
          }
          return result.gameModeName && result.gameModeName.toLowerCase() === categories.find(c => c.id === category)?.name.toLowerCase();
        }
      );
  function getDigits(data: ResultDto) {
    return Object.keys(data).filter((key) => key.startsWith('digit'));
  }

  // Helper to set start and end date for a single day
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    setFormData((prev) => ({
      ...prev,
      startDate: momentTz(start).tz('Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ss'),
      endDate: momentTz(end).tz('Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ss'),
      pageNumber: 1,
    }));
  };
  // Helper to clear date filter
  const clearDateFilter = () => {
    setDateCleared(true);
    setFormData((prev) => ({
      ...prev,
      startDate: null,
      endDate: null,
      pageNumber: 1,
    }));
  };

  return (
    <div className='container max-w-full mx-auto p-4 pb-32'>
      <LotteryLoadingOverlay show={isLoading} />
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold'>Results</h1>
        <button
          className='p-2 rounded hover:bg-muted transition-colors border border-transparent hover:border-primary'
          aria-label='Reload Results'
          onClick={() => {
            setFormData((prev) => ({ ...prev, pageNumber: 1 }));
            setTimeout(() => getResults({ ...formData, pageNumber: 1 }), 0);
          }}
        >
          <RotateCcw className='w-5 h-5' />
        </button>
      </div>
      {!isGameModeIdProp && (
        <div className='flex flex-col gap-4 mb-6 '>
          <div className='flex justify-between items-center'>
            <div>
              <h2 className='text-lg font-medium'>Date</h2>
              <p className='text-sm text-muted-foreground'>
                Select a date to view results
              </p>
            </div>
            <div className='relative flex items-center gap-2'>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className='border rounded px-3 py-1 bg-background hover:bg-muted text-sm flex items-center gap-2'
                    aria-label='Pick a date'
                  >
                    {formData.startDate
                      ? format(new Date(formData.startDate), 'PPP')
                      : 'Pick a date'}
                  </button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='center'>
                  <Calendar
                    mode='single'
                    selected={formData.startDate ? new Date(formData.startDate) : undefined}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {formData.startDate && (
                <button
                  className='ml-2 text-xs text-destructive underline'
                  onClick={clearDateFilter}
                  aria-label='Clear date filter'
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <CategoryFilter
            categories={categories}
            selectedCategory={category}
            onSelectCategory={(cat) => {
              setCategory(cat);
              setFormData((prev) => ({
                ...prev,
                gameModeId: getGameModeId(cat),
                pageNumber: 1,
              }));
            }}
          />
        </div>
      )}

      {filteredResults?.length > 0 ? (
        filteredResults?.map((result: ResultDto) => (
          <Card key={result.drawId} className='overflow-hidden'>
            <CardContent className='p-0'>
              <div className='flex items-center justify-between p-4'>
                <div>
                  <div className='flex items-center gap-2 mb-1'>
                    <span className='text-xs bg-primary/10 text-primary px-2 py-1 rounded font-medium'>
                      Draw #{result.drawId}
                    </span>
                  </div>
                  <p className='font-medium'>
                    {momentTz(result.drawDateTime).format('DD MMM YYYY')} | {get12HourTime(result.drawDateTime.split('T')[1])}
                  </p>
                  <p className='text-xs text-muted-foreground capitalize'>
                    {result.gameModeDescription || 'Unknown Category'}
                  </p>
                </div>
                <div className='flex flex-col gap-1'>
                  {/* XABC Labels */}
                  <div className='flex gap-1 justify-center'>
                    <span className='w-8 h-8 flex items-center justify-center text-xs font-bold text-muted-foreground'>
                      X
                    </span>
                    <span className='w-8 h-8 flex items-center justify-center text-xs font-bold text-muted-foreground'>
                      A
                    </span>
                    <span className='w-8 h-8 flex items-center justify-center text-xs font-bold text-muted-foreground'>
                      B
                    </span>
                    <span className='w-8 h-8 flex items-center justify-center text-xs font-bold text-muted-foreground'>
                      C
                    </span>
                  </div>
                  {/* Result Numbers */}
                  <div className='flex gap-1 justify-center'>
                    {getDigits(result)?.map((number, index) => (
                      <div
                        key={index}
                        className={`w-8 h-8 rounded-full ${colors[index]} flex items-center justify-center text-white font-bold`}
                      >
                        {result[number as keyof ResultDto]}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className='flex flex-col items-center justify-center py-8 text-muted-foreground'>
          <Player
            autoplay
            loop
            src={noResultsLottie}
            style={{ height: 180, width: 180 }}
            aria-label='No results found animation'
          />
          <div className='text-center'>No results found for the selected date and category.</div>
        </div>
      )}
      {filteredResults?.length > 0 && results && results.totalCount > 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  setFormData({
                    ...formData,
                    pageNumber: Math.max(1, formData.pageNumber - 1),
                  })
                }
                className={formData.pageNumber <= 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            {getPaginationRange(
              formData.pageNumber,
              Math.ceil(results.totalCount / 5)
            )?.map((item, index) => (
              <PaginationItem key={index}>
                {item === '...' ? (
                  <span className='px-2 text-muted-foreground'>...</span>
                ) : (
                  <PaginationLink
                    isActive={item === formData.pageNumber}
                    key={index}
                    className='w-8 h-8 flex items-center justify-center'
                    size='icon'
                    aria-label={`Page ${item}`}
                    onClick={() =>
                      setFormData({ ...formData, pageNumber: Number(item) })
                    }
                  >
                    {item}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setFormData({
                    ...formData,
                    pageNumber: formData.pageNumber + 1,
                  })
                }
                className={formData.pageNumber >= Math.ceil(results.totalCount / 5) ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
