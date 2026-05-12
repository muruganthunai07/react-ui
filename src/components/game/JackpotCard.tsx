import React from 'react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Diamond } from 'lucide-react';
import { getNextBotDrawTime } from '@/utils/TimeFunctions';
import type { GameModeDto } from '@/types/api';

interface JackpotCardProps {
  loading: boolean;
  jackpot: GameModeDto[];
  className?: string;
}

const JackpotCard: React.FC<JackpotCardProps> = ({ loading, jackpot, className }) => {
  // Get intervalMin from botDetails
  let intervalMin: number | undefined = undefined;
  if (jackpot[0]?.botDetails) {
    try {
      intervalMin = JSON.parse(jackpot[0].botDetails)?.IntervalMin;
    } catch {
      intervalMin = undefined;
    }
  }
  const nextDrawTime = intervalMin ? getNextBotDrawTime(intervalMin) : '12:00 AM';
  const isJackpotClosed = nextDrawTime.trim() === '12:00 AM';

  return (
    <div className={`mt-8 ${className || ''}`}>
      <h2 className='text-2xl font-bold mb-4 flex items-center text-red-500'>
        <Diamond className='mr-2 h-6 w-6 fill-red-500' /> Golden Jackpot
      </h2>
      {loading ? (
        <div className='rounded-lg bg-gray-200/10 p-6 h-64 flex flex-col items-center justify-center'>
          <div className='flex gap-4 mb-4'>
            <Skeleton className='h-12 w-12 rounded-full' />
            <Skeleton className='h-12 w-12 rounded-full' />
            <Skeleton className='h-12 w-12 rounded-full' />
          </div>
          <Skeleton className='h-8 w-48 mb-2' />
          <Skeleton className='h-12 w-64 mb-6' />
          <Skeleton className='h-10 w-32 rounded-full' />
        </div>
      ) : (
        isJackpotClosed ? (
          // Closed state design
          <div className='relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-600 to-gray-800 p-6 h-64 flex flex-col items-center justify-center'>
            {/* Background effects for closed state */}
            <div className='absolute inset-0'>
              <div className='absolute inset-0 bg-gray-700 opacity-20'></div>
              <div className='absolute inset-0 bg-gradient-to-br from-gray-500/30 to-gray-600/30'></div>
              <div className='absolute top-0 left-0 w-full h-full'>
                {Array.from({ length: 15 }).map((_, i) => (
                  <div
                    key={i}
                    className='absolute rounded-full bg-gray-400'
                    style={{
                      width: `${Math.random() * 8 + 4}px`,
                      height: `${Math.random() * 8 + 4}px`,
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      opacity: Math.random() * 0.3 + 0.2,
                      animation: 'float 15s linear infinite',
                    }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Closed overlay */}
            <div className='absolute inset-0 bg-black/40 z-20 flex items-center justify-center'>
              <div className='bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold'>
                CLOSED
              </div>
            </div>

            {/* Lottery balls - dimmed */}
            <div className='flex gap-4 mb-4 z-10 opacity-50'>
              <div className='w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-gray-300 font-bold text-xl border-2 border-gray-400'>
                A
              </div>
              <div className='w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-gray-300 font-bold text-xl border-2 border-gray-400'>
                B
              </div>
              <div className='w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-gray-300 font-bold text-xl border-2 border-gray-400'>
                C
              </div>
            </div>

            {/* Jackpot text - dimmed */}
            <div className='text-center z-10'>
              <div className='text-gray-400 font-bold text-3xl mb-1'>
                GOLDEN
              </div>
              <div
                className='text-gray-300 font-extrabold text-5xl'
                style={{
                  textShadow: 'none',
                  background: 'linear-gradient(to bottom, #9ca3af 0%, #6b7280 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                JACKPOT
              </div>
            </div>

            {/* Closed message */}
            <div className='mt-6 z-10'>
              <div className='text-gray-400 text-sm font-medium'>
                Next draw: {nextDrawTime}
              </div>
            </div>
          </div>
        ) : (
          // Active state - original design
          <Link
            to={`/3-digit-game/${jackpot[0]?.name?.toLowerCase()}/${jackpot[0]?.id}`}
            className='block'
          >
            <div className='relative overflow-hidden rounded-lg bg-gradient-to-br from-amber-700 to-red-700 p-6 h-64 flex flex-col items-center justify-center transition-transform hover:scale-[1.02]'>
              {/* Background effects */}
              <div className='absolute inset-0'>
                <div className='absolute inset-0 bg-amber-800 opacity-20'></div>
                <div className='absolute inset-0 bg-gradient-to-br from-yellow-500/30 to-red-600/30'></div>
                <div className='absolute top-0 left-0 w-full h-full'>
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className='absolute rounded-full bg-yellow-300'
                      style={{
                        width: `${Math.random() * 10 + 5}px`,
                        height: `${Math.random() * 10 + 5}px`,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        opacity: Math.random() * 0.5 + 0.3,
                        animation: 'float 10s linear infinite',
                      }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Lottery balls */}
              <div className='flex gap-4 mb-4 z-10'>
                <div className='w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xl border-2 border-white'>
                  A
                </div>
                <div className='w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl border-2 border-white'>
                  B
                </div>
                <div className='w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold text-xl border-2 border-white'>
                  C
                </div>
              </div>

              {/* Jackpot text */}
              <div className='text-center z-10'>
                <div className='text-yellow-300 font-bold text-3xl mb-1'>
                  GOLDEN
                </div>
                <div
                  className='text-white font-extrabold text-5xl'
                  style={{
                    textShadow:
                      '0 0 10px rgba(255,215,0,0.7), 0 0 20px rgba(255,215,0,0.5)',
                    background:
                      'linear-gradient(to bottom, #fff6a9 0%, #ffcc33 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  JACKPOT
                </div>
              </div>

              {/* Play now button */}
              <div className='mt-6 z-10'>
                <button className='bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-8 rounded-full border-2 border-green-400 transition-all'>
                  PLAY NOW
                </button>
              </div>
            </div>
          </Link>
        )
      )}
    </div>
  );
};

export default JackpotCard; 