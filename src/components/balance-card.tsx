import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Upload, Wallet } from 'lucide-react';
import { RefreshCw, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import React from 'react';

export function BalanceCard() {
  const { user, refreshBalance, isLoading } = useAuth();
  const isMobile = useIsMobile();
  const router = useNavigate();
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshBalance();
    setRefreshing(false);
  };

  return (
    <div
      className={`flex flex-col items-center ${
        isMobile ? 'w-full' : 'ml-auto max-w-md'
      }`}
    >
      {/* Wallet Icon and Refresh */}
      <div className='flex items-center gap-2 bg-primary rounded-full p-3 -mb-6 z-10'>
        <Wallet className='h-6 w-6 text-primary-foreground' />
        {user && (
          <button
            aria-label='Refresh Balance'
            onClick={handleRefresh}
            disabled={refreshing || isLoading}
            className='ml-1 p-1 rounded-full hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary-foreground transition'
            type='button'
          >
            {refreshing || isLoading ? (
              <Loader2 className='h-4 w-4 animate-spin text-primary-foreground' />
            ) : (
              <RefreshCw className='h-4 w-4 text-primary-foreground' />
            )}
          </button>
        )}
      </div>

      {user ? (
        <Card className='w-full shadow-md rounded-xl overflow-hidden'>
          <CardContent className='p-0'>
            {/* Balance Section */}
            <div className='grid grid-cols-2 divide-x dark:divide-border mt-6'>
              <div className='py-4 px-4 text-center'>
                <p className='text-sm text-muted-foreground mb-1'>
                  Current Balance
                </p>
                <p className='text-2xl font-bold'>
                  ₹{user?.userBalance.totalBalance || 0}
                </p>
              </div>
              <div className='py-4 px-4 text-center'>
                <p className='text-sm text-muted-foreground mb-1'>
                  Winning Balance
                </p>
                <p className='text-2xl font-bold'>
                  ₹{user?.userBalance.winningBalance || 0}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='grid grid-cols-2 gap-4 p-4'>
              <Button
                className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-full flex gap-2 items-center justify-center'
                onClick={() => router('/deposit')}
              >
                <Download className='h-4 w-4' />
                Deposit
              </Button>
              <Button
                variant='outline'
                className='border-border text-foreground hover:bg-accent hover:text-accent-foreground rounded-full flex gap-2 items-center justify-center'
                onClick={() => router('/withdraw')}
              >
                <Upload className='h-4 w-4' />
                Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className='text-center py-6'>
          <p className='text-sm text-muted-foreground py-3'>
            Please log in to view your balance
          </p>
          <Button onClick={() => router('/?login')}>Log In</Button>
        </div>
      )}
    </div>
  );
}
