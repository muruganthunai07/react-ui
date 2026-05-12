import { useEffect, useState } from 'react';
import { BetService } from '@/services/BetService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BetNumbersDisplay } from './BetNumbersDisplay';

interface MyOrderProps {
  drawId: number | undefined;
}

interface UserBet {
  betId: number;
  userId: string;
  drawId: number;
  gameModeName: string;
  lotTypeName: string;
  betType: number;
  digitX: number | null;
  digitA: number | null;
  digitB: number | null;
  digitC: number | null;
  amount: number;
  status: number;
  createdAt: string;
}

const statusMap: { [key: number]: { text: string; variant: 'default' | 'destructive' | 'secondary' | 'outline' } } = {
  0: { text: 'Pending', variant: 'secondary' },
  1: { text: 'Won', variant: 'default' },
  2: { text: 'Lost', variant: 'destructive' },
};

export const MyOrder = ({ drawId }: MyOrderProps) => {
  const [bets, setBets] = useState<UserBet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (drawId === undefined || drawId === 0) {
      setBets([]);
      return;
    }

    const fetchUserBets = async () => {
      setLoading(true);
      setError(null);
      try {
        const userBets = await BetService.getUserBetsByDraw(drawId);
        setBets(userBets);
      } catch (err) {
        setError('Failed to fetch your bets. Please try again later.');
        setBets([]);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBets();
  }, [drawId]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-4 text-center text-destructive">
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (bets.length === 0) {
    return (
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-muted-foreground">You have no bets for this draw.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
        <CardHeader>
            <CardTitle>My Bets for this Draw</CardTitle>
        </CardHeader>
      {bets.map((bet) => (
        <Card key={bet.betId}>
          <CardContent className='p-4 grid grid-cols-2 gap-x-4 gap-y-2 items-center'>
            <div className='font-semibold'>{bet.lotTypeName}</div>
            <div className='text-right'>
              <Badge variant={statusMap[bet.status]?.variant || 'secondary'}>
                {statusMap[bet.status]?.text || 'Unknown'}
              </Badge>
            </div>
            <div className='col-span-2 sm:col-span-1'>
              <BetNumbersDisplay numbers={bet} />
            </div>
            <div className='text-right font-medium col-span-2 sm:col-span-1'>Amount: ₹{bet.amount}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}; 