import { useState } from 'react';
import { Coins, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { reportsService } from '@/services/reports.service';
import type { WithdrawCommissionReportDto } from '@/types/reports';

export default function WithdrawCommissionReport() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<WithdrawCommissionReportDto | null>(null);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const requestDate = format(selectedDate, 'yyyy-MM-dd');
      const data = await reportsService.getWithdrawCommissionReport({
        date: requestDate
      });
      setReportData(data);
    } catch (error) {
      console.error('Error fetching withdraw commission report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle className='flex items-center'>
          <Coins className='h-5 w-5 mr-2 text-primary' />
          Withdraw Commission Report
        </CardTitle>
        <CardDescription>
          Commission is calculated at 3% of approved withdrawals for the selected date.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid gap-2'>
          <span className='text-sm font-medium'>Date</span>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className={cn('w-full justify-start text-left font-normal min-h-[40px]')}
              >
                <Calendar className='mr-2 h-4 w-4' />
                {format(selectedDate, 'PPP')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <CalendarComponent
                mode='single'
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date);
                  }
                  setOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>


        <Button className='w-full' disabled={loading} onClick={handleGenerate}>
          {loading ? 'Loading...' : 'GET COMMISSION REPORT'}
        </Button>

        {reportData && (
          <div className='rounded-md border p-4 space-y-2'>
            <p className='text-sm text-muted-foreground'>
              Date: {format(new Date(reportData.date), 'PPP')}
            </p>
            <p className='text-sm'>Processed Withdrawals: <span className='font-semibold'>{reportData.totalWithdrawalCount}</span></p>
            <p className='text-sm'>Commission Profit: <span className='font-semibold'>{reportData.totalCommissionProfit.toFixed(2)}</span></p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
