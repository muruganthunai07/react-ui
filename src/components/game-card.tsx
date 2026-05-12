import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface GameCardProps {
  league: string;
  matchday: string;
  teamA: string;
  teamB: string;
  scoreA?: number;
  scoreB?: number;
  odds: number[];
  status: 'upcoming' | 'ongoing' | 'completed';
  isNumberGame?: boolean;
}

export function GameCard({
  league,
  matchday,
  teamA,
  teamB,
  scoreA,
  scoreB,
  odds,
  status,
  isNumberGame = false,
}: GameCardProps) {
  return (
    <Card className='overflow-hidden'>
      <div className='bg-muted px-4 py-2 flex items-center justify-between'>
        <div>
          <p className='text-sm font-medium'>{league}</p>
          <p className='text-xs text-muted-foreground'>{matchday}</p>
        </div>
        {status === 'ongoing' && (
          <Badge
            variant='default'
            className='bg-primary text-primary-foreground'
          >
            Ongoing
          </Badge>
        )}
        {status === 'upcoming' && <Badge variant='outline'>Upcoming</Badge>}
      </div>

      <CardContent className='p-4'>
        <div className='flex flex-col space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 bg-muted rounded-full flex items-center justify-center'>
                {isNumberGame ? '123' : 'L'}
              </div>
              <span className='font-medium'>{teamA}</span>
            </div>
            {scoreA !== undefined && scoreB !== undefined && (
              <div className='text-lg font-bold'>{scoreA}</div>
            )}
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 bg-muted rounded-full flex items-center justify-center'>
                {isNumberGame ? '456' : 'A'}
              </div>
              <span className='font-medium'>{teamB}</span>
            </div>
            {scoreA !== undefined && scoreB !== undefined && (
              <div className='text-lg font-bold'>{scoreB}</div>
            )}
          </div>

          {!isNumberGame && (
            <div className='grid grid-cols-3 gap-2 mt-4'>
              <div className='flex flex-col items-center justify-center p-2 bg-muted rounded-md'>
                <span className='text-xs text-muted-foreground'>1</span>
                <span className='font-medium'>{odds[0]}</span>
              </div>
              <div className='flex flex-col items-center justify-center p-2 bg-muted rounded-md'>
                <span className='text-xs text-muted-foreground'>X</span>
                <span className='font-medium'>{odds[1]}</span>
              </div>
              <div className='flex flex-col items-center justify-center p-2 bg-muted rounded-md'>
                <span className='text-xs text-muted-foreground'>2</span>
                <span className='font-medium'>{odds[2]}</span>
              </div>
            </div>
          )}

          {isNumberGame && (
            <div className='flex justify-center mt-4'>
              <Link to='/3-digit-game'>
                <Badge
                  variant='outline'
                  className='bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer'
                >
                  Place Bet
                </Badge>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
