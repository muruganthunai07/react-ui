import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ThreeDigitGame } from '@/components/three-digit-game';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useDashboard } from '@/contexts/dasboard-context';
import { getNextBotDrawTime, getNextClosestTime } from '@/utils/TimeFunctions';
import LotteryLoadingOverlay from '@/components/ui/LotteryLoadingOverlay';

function ThreeDigitGamePage() {
  const searchParams = useParams();
  const navigate = useNavigate();
  const { allModes, getDashboard } = useDashboard();
  const gameType = searchParams.type || '';
  const gameId = Number(searchParams.id) || 0;

  const [gameData, setGameData] = useState({
    title: gameType.toUpperCase() + ' LOTTERY',
    id: gameId,
    drawTime: '10:30 AM',
    isBot: false,
    name: '',
    nextBotDrawTime: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      await fetchData();
    }
    load();
    if (allModes && allModes[gameType] && allModes[gameType][0]) {
      const intervalMin = allModes[gameType][0]?.isBot ? JSON.parse(allModes[gameType][0]?.botDetails)?.IntervalMin : 0;
      const nextBotDrawTime = allModes[gameType][0]?.isBot ? getNextBotDrawTime(intervalMin || 0) : '';
      setGameData({
        title: gameType.toUpperCase() + ' LOTTERY',
        id: gameId,
        drawTime:
          getNextClosestTime(allModes[gameType][0]?.gameTimes || [])?.timeStr ||
          '',
        isBot: allModes[gameType][0]?.isBot,
        name: allModes[gameType][0]?.name,
        nextBotDrawTime: nextBotDrawTime
      });
    }
    setLoading(false);
  }, [gameType, gameId]);
  async function fetchData() {
    await getDashboard();
  }
  return (
    <div className='container mx-auto px-2 sm:px-4 py-6 sm:py-8 max-w-4xl'>
      <LotteryLoadingOverlay show={loading} />
      {!loading && (
        <>
          <div className='flex items-center mb-4 sm:mb-6'>
            <Button
              variant='ghost'
              size='sm'
              className='mr-2'
              onClick={() => navigate('/')}
            >
              <ArrowLeft className='h-4 w-4 mr-1' />
              Back
            </Button>
            <div>
              <h1 className='text-xl sm:text-2xl font-bold mb-1 sm:mb-2'>
                {gameData.title} - {gameId}
              </h1>
              <p className='text-muted-foreground'>
                Next draw: {gameData.isBot
                  ? gameData.nextBotDrawTime
                  : gameData.drawTime}
              </p>
            </div>
          </div>

          <ThreeDigitGame
            gameType={gameType as 'dear' | 'kerala' | 'bot' | 'jackpot'}
            gameId={Number(gameId)}
            isBot={gameData.isBot}
            name ={gameData.name.toLowerCase()}
          />
        </>
      )}
    </div>
  );
}
export default React.memo(ThreeDigitGamePage);
