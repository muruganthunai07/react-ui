import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface MatchDetailsProps {
  // league: string;
  matchday: string;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  odds: number[];
  stats: {
    possession: number[];
    shots: number[];
    shotsOnTarget: number[];
    corners: number[];
    saves: number[];
  };
}

export function MatchDetails({
  // league,
  matchday,
  teamA,
  teamB,
  scoreA,
  scoreB,
  odds,
  stats,
}: MatchDetailsProps) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='icon' className='h-8 w-8'>
            <ArrowLeft className='h-4 w-4' />
          </Button>
          <CardTitle className='text-base'>Match Details</CardTitle>
        </div>
        <Badge variant='outline' className='bg-primary text-primary-foreground'>
          Live Match
        </Badge>
      </CardHeader>

      <CardContent className='p-4'>
        <div className='flex flex-col items-center mb-6'>
          <p className='text-sm text-muted-foreground mb-2'>{matchday}</p>

          <div className='flex items-center justify-center gap-4 w-full'>
            <div className='flex flex-col items-center'>
              <div className='w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-2'>
                L
              </div>
              <span className='font-medium'>{teamA}</span>
            </div>

            <div className='flex items-center gap-2'>
              <span className='text-2xl font-bold'>{scoreA}</span>
              <span className='text-xl font-bold'>:</span>
              <span className='text-2xl font-bold'>{scoreB}</span>
            </div>

            <div className='flex flex-col items-center'>
              <div className='w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-2'>
                A
              </div>
              <span className='font-medium'>{teamB}</span>
            </div>
          </div>

          <div className='flex gap-4 mt-6'>
            <div className='flex flex-col items-center'>
              <div className='bg-primary/10 text-primary px-3 py-1 rounded-md'>
                <span className='text-sm font-medium'>Either FT</span>
              </div>
              <span className='text-xs text-muted-foreground mt-1'>
                O. Salah
              </span>
            </div>

            <div className='flex flex-col items-center'>
              <div className='bg-primary/10 text-primary px-3 py-1 rounded-md'>
                <span className='text-sm font-medium'>2+ Goals</span>
              </div>
              <span className='text-xs text-muted-foreground mt-1'>
                G. Jesus
              </span>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-3 gap-4 mb-6'>
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

        <Tabs defaultValue='match'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='match'>Match</TabsTrigger>
            <TabsTrigger value='h2h'>H2H</TabsTrigger>
            <TabsTrigger value='standings'>Standings</TabsTrigger>
          </TabsList>
          <TabsContent value='match' className='mt-4'>
            <div className='space-y-4'>
              <div className='flex justify-between items-center'>
                <div className='w-1/3 text-left'>
                  <span className='text-sm'>{stats.possession[0]}%</span>
                </div>
                <div className='w-1/3 text-center'>
                  <span className='text-xs text-muted-foreground'>
                    Possession
                  </span>
                </div>
                <div className='w-1/3 text-right'>
                  <span className='text-sm'>{stats.possession[1]}%</span>
                </div>
              </div>

              <div className='relative h-2 bg-muted rounded-full overflow-hidden'>
                <div
                  className='absolute top-0 left-0 h-full bg-primary'
                  style={{ width: `${stats.possession[0]}%` }}
                />
              </div>

              <div className='grid grid-cols-3 gap-4 mt-6'>
                <div className='text-center'>
                  <span className='text-lg font-medium'>{stats.shots[0]}</span>
                  <p className='text-xs text-muted-foreground'>Shots</p>
                </div>
                <div className='text-center'>
                  <span className='text-lg font-medium'>
                    {stats.shotsOnTarget[0]}
                  </span>
                  <p className='text-xs text-muted-foreground'>
                    Shots on target
                  </p>
                </div>
                <div className='text-center'>
                  <span className='text-lg font-medium'>
                    {stats.corners[0]}
                  </span>
                  <p className='text-xs text-muted-foreground'>Corner kicks</p>
                </div>
              </div>

              <div className='grid grid-cols-3 gap-4'>
                <div className='text-center'>
                  <span className='text-lg font-medium'>{stats.shots[1]}</span>
                </div>
                <div className='text-center'>
                  <span className='text-lg font-medium'>
                    {stats.shotsOnTarget[1]}
                  </span>
                </div>
                <div className='text-center'>
                  <span className='text-lg font-medium'>
                    {stats.corners[1]}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value='h2h'>
            <div className='py-4 text-center text-muted-foreground'>
              Head to head statistics will appear here
            </div>
          </TabsContent>
          <TabsContent value='standings'>
            <div className='py-4 text-center text-muted-foreground'>
              League standings will appear here
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
