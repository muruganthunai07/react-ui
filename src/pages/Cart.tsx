import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, MinusCircle, PlusCircle } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { LoginForm } from '@/components/login-form';
import { BetService } from '@/services/BetService';
import BetSummary from '@/components/BetSummary';
import type { BulkBetAPIDto, BulkBetFailedDto, BulkBetResponse } from '@/types/api';
import { BetNumbersDisplay } from '@/components/BetNumbersDisplay';

export default function CartPage() {
  const { items, totalAmount, removeItem, updateItemUnit, clearCart } =
    useCart();
  const { user, refreshBalance, isAuthenticated } = useAuth();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [betSummary, setBetSummary] = useState<{
    successBets: BulkBetAPIDto[];
    failedBets: BulkBetFailedDto[];
  } | null>(null);
  const formatTime = (timeString: string) => {
    return timeString;
  };

  const handlePlaceBet = async () => {
    if (!isAuthenticated) {
      setLoginOpen(true);
      return;
    }

    if (items.length === 0) {
      toast({
        title: 'Cart Empty',
        description: 'Please add some bets to your cart first.',
        variant: 'destructive',
      });
      return;
    }

    if (!user || user.userBalance.totalBalance < totalAmount) {
      toast({
        title: 'Insufficient Balance',
        description: "You don't have enough balance to place these bets.",
        variant: 'destructive',
      });
      return;
    }

    setIsPlacingOrder(true);
    const body: BulkBetAPIDto[] = items.map((item) => {
      return {
        drawId: item.drawId,
        lotTypeId: item.lotTypeId,
        digitX: item.numbers.digitX ? Number(item.numbers.digitX) : null,
        digitA: item.numbers.digitA ? Number(item.numbers.digitA) : null,
        digitB: item.numbers.digitB ? Number(item.numbers.digitB) : null,
        digitC: item.numbers.digitC ? Number(item.numbers.digitC) : null,
        quantity: item.unit,
        amount: item.price,
      };
    });
    try {
      const res: BulkBetResponse = await BetService.placeBulkBet(body);
      // Handle error scenario (API returns error object)
      if (res?.isError) {
        toast({
          title: 'Error Placing Bets',
          description: res.detail || 'An error occurred while placing bets.',
          variant: 'destructive',
        });
        setIsPlacingOrder(false);
        clearCart();
        return;
      }

      await refreshBalance();
      setBetSummary({ successBets: res?.successfulBets || [], failedBets:  res?.failedBets || [], });
      setIsPlacingOrder(false);
      clearCart();
    } catch (error: unknown) {
      // Network or unexpected error
      let description = 'An error occurred while placing bets.';
      if (typeof error === 'object' && error !== null) {
        // Try to extract error message from known error shapes
        const err = error as {
          response?: { data?: { detail?: string } };
          message?: string;
        };
        description = err.response?.data?.detail || err.message || description;
      }
      toast({
        title: 'Error Placing Bets',
        description,
        variant: 'destructive',
      });
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className='flex flex-col min-h-screen bg-background'>
      {/* Header */}
      <div className='flex items-center justify-between p-4 border-b'>
        <div className='flex items-center'>
          <Link to='/' className='mr-4'>
            <ArrowLeft className='h-6 w-6' />
          </Link>
          <h1 className='text-xl font-bold'>My Cart</h1>
        </div>
        {items.length > 0 && !betSummary && (
          <Button
            variant='ghost'
            size='sm'
            className='text-destructive'
            onClick={clearCart}
          >
            <Trash2 className='h-4 w-4 mr-2' />
            Clear
          </Button>
        )}
      </div>

      {/* Cart Content or Bet Summary */}
      <div className='flex-1 p-4 overflow-auto pb-24'>
        {betSummary ? (
          <BetSummary
            successBets={betSummary.successBets}
            failedBets={betSummary.failedBets}
          />
        ) : items.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-full text-center p-4'>
            <div className='bg-muted rounded-full p-6 mb-4'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='48'
                height='48'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='text-muted-foreground'
              >
                <circle cx='8' cy='21' r='1' />
                <circle cx='19' cy='21' r='1' />
                <path d='M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12' />
              </svg>
            </div>
            <h2 className='text-xl font-semibold mb-2'>Your cart is empty</h2>
            <p className='text-muted-foreground mb-6'>
              Add some bets to get started
            </p>
            <Link to='/'>
              <Button>Browse Games</Button>
            </Link>
          </div>
        ) : (
          <Card>
            <CardContent className='p-0'>
              <div className='p-4 border-b'>
                <div className='flex justify-between items-center'>
                  <div>
                    <p className='font-medium'>Name: {user?.name || 'Guest'}</p>
                  </div>
                  <div>
                    <p className='font-medium'>
                      Date: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              {/* Table for md+ screens */}
              <div className='hidden md:block overflow-x-auto w-full'>
                <Table className='min-w-[700px] md:min-w-0'>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lot Details</TableHead>
                      <TableHead className='text-center'>Game/Lot Type</TableHead>
                      <TableHead className='text-center'>Number</TableHead>
                      <TableHead className='text-center'>Unit</TableHead>
                      <TableHead className='text-center'>₹</TableHead>
                      <TableHead className='text-right'>Amount ₹</TableHead>
                      <TableHead className='w-[50px]'></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id} className='break-words'>
                        <TableCell className='font-medium'>
                          <div>{item.lotName}</div>
                          <div className='text-xs text-muted-foreground'>
                            {formatTime(item.drawTime)}
                          </div>
                        </TableCell>
                        <TableCell className='text-center'>
                          <span className='block text-xs md:text-sm font-semibold'>{item.gameModeName} - {item.lotTypeName}</span>
                        </TableCell>
                        <TableCell className='text-center'>
                          <BetNumbersDisplay numbers={item.numbers} />
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center justify-center gap-2'>
                            <Button
                              variant='outline'
                              size='icon'
                              className='h-6 w-6 rounded-full'
                              onClick={() => updateItemUnit(item.id, item.unit - 1)}
                            >
                              <MinusCircle className='h-3 w-3' />
                            </Button>
                            <span>{item.unit}</span>
                            <Button
                              variant='outline'
                              size='icon'
                              className='h-6 w-6 rounded-full'
                              onClick={() => updateItemUnit(item.id, item.unit + 1)}
                            >
                              <PlusCircle className='h-3 w-3' />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className='text-center'>
                          {item.price.toFixed(2)}
                        </TableCell>
                        <TableCell className='text-right'>
                          {item.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-destructive'
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {/* Card layout for mobile screens */}
              <div className='block md:hidden space-y-4 p-2'>
                {items.map((item) => (
                  <div key={item.id} className='rounded-lg border bg-card p-4 shadow-sm flex flex-col gap-2'>
                    <div className='flex justify-between items-center'>
                      <div>
                        <div className='font-semibold text-base'>{item.gameModeName}</div>
                        <div className='text-xs text-muted-foreground'>{formatTime(item.drawTime)}</div>
                      </div>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-destructive'
                        onClick={() => removeItem(item.id)}
                        aria-label='Remove'
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                    <div className='text-xs font-medium text-primary'>{item.lotTypeName}</div>
                    <div className='flex flex-wrap gap-2 text-sm'>
                      <BetNumbersDisplay numbers={item.numbers} />
                      <div><span className='font-semibold'>Unit:</span> {item.unit}</div>
                      <div><span className='font-semibold'>Price:</span> ₹{item.price.toFixed(2)}</div>
                      <div><span className='font-semibold'>Amount:</span> ₹{item.amount.toFixed(2)}</div>
                    </div>
                    <div className='flex gap-2 mt-2'>
                      <Button
                        variant='outline'
                        size='icon'
                        className='h-6 w-6 rounded-full'
                        onClick={() => updateItemUnit(item.id, item.unit - 1)}
                        aria-label='Decrease unit'
                      >
                        <MinusCircle className='h-3 w-3' />
                      </Button>
                      <span className='self-center'>{item.unit}</span>
                      <Button
                        variant='outline'
                        size='icon'
                        className='h-6 w-6 rounded-full'
                        onClick={() => updateItemUnit(item.id, item.unit + 1)}
                        aria-label='Increase unit'
                      >
                        <PlusCircle className='h-3 w-3' />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className='flex justify-between border-t p-4'>
              <div className='font-bold'>Total Amount:</div>
              <div className='font-bold'>₹{totalAmount.toFixed(2)}</div>
            </CardFooter>
            <div className='px-4 pb-4 text-xs text-muted-foreground'>
              ** Some items are removed automatically if draw time expired.
            </div>
          </Card>
        )}
      </div>

      {/* Bottom Bar */}
      <div className='fixed bottom-0 left-0 right-0 bg-background border-t p-3 flex justify-between items-center'>
        <div className='flex items-center'>
          <div className='bg-muted rounded-full p-2 mr-2'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='20'
              height='20'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='text-foreground'
            >
              <circle cx='8' cy='21' r='1' />
              <circle cx='19' cy='21' r='1' />
              <path d='M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12' />
            </svg>
          </div>
          <div>
            <div className='font-bold'>₹{totalAmount.toFixed(2)}</div>
            <div className='text-xs text-muted-foreground'>
              {items.length} bets
            </div>
          </div>
        </div>
        <Button
          onClick={handlePlaceBet}
          disabled={isPlacingOrder || items.length === 0 || !!betSummary}
          className='px-8'
        >
          {isPlacingOrder ? 'Processing...' : 'Place Bet'}
        </Button>
      </div>

      {/* Login Sheet */}
      <Sheet open={loginOpen} onOpenChange={setLoginOpen}>
        <SheetContent
          side='bottom'
          className='h-[90vh] rounded-t-xl p-0 md:w-[400px] md:h-screen md:rounded-none md:right-0 md:left-auto'
        >
          <LoginForm
            onSuccess={() => setLoginOpen(false)}
            onSignupClick={() => {
              // Handle signup if needed
            }}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
