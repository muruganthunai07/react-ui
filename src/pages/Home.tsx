import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { BalanceCard } from '@/components/balance-card';
import { GameCarousel } from '@/components/game-carousel';
import { GameDigitCard } from '@/components/game-digit-card';
import { Diamond, Download } from 'lucide-react';
import { useDashboard } from '@/contexts/dasboard-context';
import type { GameModeDto } from '@/types/api';
import {
  isGamewithinLockTime,
  getNextClosestTime,
  getNextBotDrawTime,
} from '@/utils/TimeFunctions';
import { Skeleton } from '@/components/ui/skeleton';
import MarqueeText from '@/components/ui/marquee';
import JackpotCard from '@/components/game/JackpotCard';
import { openWhatsAppHelp } from '@/lib/utils';
import {
  TENANT_APK_FILE_NAME,
  TENANT_APK_URL,
  TENANT_APP_NAME,
} from '@/config/tenant';

const WhatsAppIcon = () => (
  <svg 
    fill='currentColor'
    aria-hidden='true' xmlns="http://www.w3.org/2000/svg"><path d="M11.42 9.49c-.19-.09-1.1-.54-1.27-.61s-.29-.09-.42.1-.48.6-.59.73-.21.14-.4 0a5.13 5.13 0 0 1-1.49-.92 5.25 5.25 0 0 1-1-1.29c-.11-.18 0-.28.08-.38s.18-.21.28-.32a1.39 1.39 0 0 0 .18-.31.38.38 0 0 0 0-.33c0-.09-.42-1-.58-1.37s-.3-.32-.41-.32h-.4a.72.72 0 0 0-.5.23 2.1 2.1 0 0 0-.65 1.55A3.59 3.59 0 0 0 5 8.2 8.32 8.32 0 0 0 8.19 11c.44.19.78.3 1.05.39a2.53 2.53 0 0 0 1.17.07 1.93 1.93 0 0 0 1.26-.88 1.67 1.67 0 0 0 .11-.88c-.05-.07-.17-.12-.36-.21z"/><path d="M13.29 2.68A7.36 7.36 0 0 0 8 .5a7.44 7.44 0 0 0-6.41 11.15l-1 3.85 3.94-1a7.4 7.4 0 0 0 3.55.9H8a7.44 7.44 0 0 0 5.29-12.72zM8 14.12a6.12 6.12 0 0 1-3.15-.87l-.22-.13-2.34.61.62-2.28-.14-.23a6.18 6.18 0 0 1 9.6-7.65 6.12 6.12 0 0 1 1.81 4.37A6.19 6.19 0 0 1 8 14.12z"/></svg>

);

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [threeDigitGames, setThreeDigitGames] = useState<GameModeDto[]>([]);
  const [jackpot, setJackpot] = useState<GameModeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const { getDashboard, dashboardData } = useDashboard();
  const [botGames, setBotGames] = useState<GameModeDto[]>([]);

  // Check if mobile
  // Fetch dashboard data
  const getDashboardData = async () => {
    const data = await getDashboard(true); // Force refresh for Home component
    const threeDigitGames = data?.gameModes?.filter(
      (game: GameModeDto) => game.name === 'Kerala' || game.name === 'Dear'
    );
    const Jackpot = data?.gameModes?.filter(
      (game: GameModeDto) => game.name === 'Jackpot'
    );
    const botGames = data?.gameModes
      ?.filter((game: GameModeDto) => game.isBot && game.name === 'Quick Games');
    setJackpot(Jackpot || []);
    setThreeDigitGames(threeDigitGames || []);
    setBotGames(botGames || []);
    setLoading(false);
  };

  // Check if mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    getDashboardData();

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const handleDownloadApk = () => {
    if (!TENANT_APK_URL) return;
    const link = document.createElement("a");
    link.href = TENANT_APK_URL;
    link.download = TENANT_APK_FILE_NAME;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleHelpClick = () => {
    openWhatsAppHelp(dashboardData?.helpNumber);
  };
  return (
    <div className='container max-w-4xl px-4 py-6 md:py-8 pb-24 md:pb-8'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6'>
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <h1 className='text-2xl font-bold'>Welcome to {TENANT_APP_NAME}</h1>
            {isMobile && (
              <div className='flex items-center gap-2 ml-2'>
                <Button
                  variant='outline'
                  size='sm'
                  className='flex items-center gap-1'
                  onClick={handleDownloadApk}
                >
                  <Download className='h-4 w-4' />
                  <span>APK</span>
                </Button>
                {dashboardData?.helpNumber && (
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex items-center gap-1 text-green-600'
                    onClick={handleHelpClick}
                  >
                    <WhatsAppIcon />
                    <span>Help</span>
                  </Button>
                )}
              </div>
            )}
          </div>
          {!isMobile && dashboardData?.helpNumber && (
            <Button
              variant='outline'
              size='sm'
              className='flex items-center gap-2 w-fit text-green-600'
              onClick={handleHelpClick}
            >
              <WhatsAppIcon />
              <span>Help</span>
            </Button>
          )}
        </div>
        <BalanceCard />
      </div>

      <div className='mt-8'>
        <GameCarousel bannerImageUrls={dashboardData?.bannerImageUrls} />
      </div>

      {dashboardData?.bannerMessage && dashboardData.bannerMessage !== '' && (
        <div className='mt-4'>
          <MarqueeText text={dashboardData.bannerMessage} />
        </div>
      )}

      {/* 3 & 4 Digits Game Section */}
      <div className='mt-8'>
        <h2 className='text-2xl font-bold mb-4 flex items-center text-red-500'>
          <Diamond className='mr-2 h-6 w-6 fill-red-500' /> 3 & 4 Digits Game
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6'>
          {loading
            ? Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className='rounded-lg bg-gray-200/10 p-4'>
                  <div className='flex justify-between items-start'>
                    <div>
                      <Skeleton className='h-5 w-24 mb-2' />
                      <Skeleton className='h-3 w-16' />
                    </div>
                    <Skeleton className='h-6 w-10' />
                  </div>
                  <Skeleton className='h-20 w-full mt-4' />
                </div>
              ))
            : threeDigitGames
                ?.filter(
                  (game: GameModeDto) =>
                    game.name === 'Kerala' || game.name === 'Dear'
                )
                .map((game: GameModeDto, index: number) => (
                  <GameDigitCard
                    key={`${game.name}-${index}`}
                    type={game.name.toLowerCase() as 'dear' | 'kerala'}
                    digits={['1', '2', '3']}
                    time={`Next draw: ${
                      getNextClosestTime(game.gameTimes).timeStr
                    }`}
                    disabled={
                      isGamewithinLockTime(
                        getNextClosestTime(game.gameTimes).timeStr,
                        game.betCloseTimeSeconds
                      )
                    }
                    href={`/3-digit-game/${game?.name?.toLowerCase()}/${
                      game.id
                    }`}
                    isActive={game.isActive}
                  />
                ))}
        </div>
      </div>

      {/* Golden Jackpot Section */}
      <JackpotCard loading={loading} jackpot={jackpot} />

      {/* Bot Games */}
      <div className='mt-8'>
        <h2 className='text-2xl font-bold mb-4 flex items-center text-red-500'>
          <Diamond className='mr-2 h-6 w-6 fill-red-500' /> Quick Mode
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6'>
          {loading
            ? Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className='rounded-lg bg-gray-200/10 p-4'>
                  <div className='flex justify-between items-start'>
                    <div>
                      <Skeleton className='h-5 w-24 mb-2' />
                      <Skeleton className='h-3 w-16' />
                    </div>
                    <Skeleton className='h-6 w-10' />
                  </div>
                  <Skeleton className='h-20 w-full mt-4' />
                </div>
              ))
            : botGames?.map((game: GameModeDto, index) => {
                const intervalMin = JSON.parse(game?.botDetails)?.IntervalMin;
                const nextDrawTime = getNextBotDrawTime(intervalMin);
                // If next draw is 12:00 AM, mark as closed
                const isMidnight = nextDrawTime.trim() === '12:00 AM';
                return (
                  <GameDigitCard
                    disabled = {isMidnight}
                    key={`${game.name}-${index}`}
                    type={'bot'}
                    time={`Next draw: ${nextDrawTime}`}
                    href={`/3-digit-game/quick games/${game.id}`}
                    intervalMin={intervalMin?.toString()}
                    isActive={game.isActive}
                  />
                );
              })}
        </div>
      </div>
      {/* CSS for animations */}
      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(0) translateX(20px);
          }
          75% {
            transform: translateY(20px) translateX(10px);
          }
        }
      `}</style>
    </div>
  );
}
