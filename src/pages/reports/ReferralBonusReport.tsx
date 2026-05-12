import { useState } from 'react';
import { Gift, Calendar, Users, UserRound, UserRoundCheck } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { reportsService } from '@/services/reports.service';
import type { ReferralBonusReportDto } from '@/types/reports';

const REFERRAL_LEVELS = [
  { key: 'Primary', percentage: 3, icon: UserRoundCheck },
  { key: 'Secondary', percentage: 2, icon: Users },
  { key: 'Tertiary', percentage: 1, icon: UserRound }
] as const;

const formatAmount = (value: number) => value.toFixed(2);

export default function ReferralBonusReport() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<ReferralBonusReportDto | null>(null);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const data = await reportsService.getReferralBonusReport({
        date: format(selectedDate, 'yyyy-MM-dd')
      });
      setReportData(data);
    } catch (error) {
      console.error('Error fetching referral bonus report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle className='flex items-center'>
          <Gift className='h-5 w-5 mr-2 text-primary' />
          Referral Bonus Report
        </CardTitle>
        <CardDescription>
          Daily referral bonus report for Primary, Secondary and Tertiary levels.
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
          {loading ? 'Loading...' : 'GET REFERRAL BONUS REPORT'}
        </Button>

        {reportData && (
          <div className='rounded-md border p-4 space-y-3'>
            <p className='text-sm text-muted-foreground'>
              Date: {format(new Date(reportData.date), 'PPP')}
            </p>
            <div className='space-y-2 md:hidden'>
              {REFERRAL_LEVELS.map((level) => {
                const count =
                  level.key === 'Primary'
                    ? reportData.primaryCount
                    : level.key === 'Secondary'
                      ? reportData.secondaryCount
                      : reportData.tertiaryCount;
                const earnings =
                  level.key === 'Primary'
                    ? reportData.primaryAmount
                    : level.key === 'Secondary'
                      ? reportData.secondaryAmount
                      : reportData.tertiaryAmount;
                const inferredInvested = earnings / (level.percentage / 100);
                const LevelIcon = level.icon;

                return (
                  <div key={level.key} className='rounded-md border p-3 space-y-1.5'>
                    <div className='flex items-center justify-between'>
                      <p className='text-sm font-semibold flex items-center gap-2'>
                        <LevelIcon className='h-4 w-4 text-primary' />
                        {level.key}
                      </p>
                      <span className='text-xs px-2 py-1 rounded bg-primary/10 text-primary font-medium'>
                        {level.percentage}%
                      </span>
                    </div>
                    <p className='text-sm'>Total Users: <span className='font-medium'>{count}</span></p>
                    <p className='text-sm'>Friend Invested: <span className='font-medium'>{formatAmount(inferredInvested)}</span></p>
                    <p className='text-sm'>Referral Earnings: <span className='font-semibold'>{formatAmount(earnings)}</span></p>
                  </div>
                );
              })}
              <div className='rounded-md border p-3 bg-muted/20'>
                <p className='text-sm font-semibold'>Total</p>
                <p className='text-sm'>Total Users: <span className='font-semibold'>{reportData.totalCount}</span></p>
                <p className='text-sm'>Friend Invested: <span className='font-semibold'>
                  {formatAmount(
                    reportData.primaryAmount / 0.03 +
                      reportData.secondaryAmount / 0.02 +
                      reportData.tertiaryAmount / 0.01
                  )}
                </span></p>
                <p className='text-sm'>Referral Earnings: <span className='font-semibold'>{formatAmount(reportData.totalAmount)}</span></p>
              </div>
            </div>

            <div className='hidden md:block overflow-x-auto rounded-md border'>
              <table className='w-full text-sm'>
                <thead className='bg-muted/50'>
                  <tr className='border-b'>
                    <th className='px-3 py-2 text-left font-medium'>Level</th>
                    <th className='px-3 py-2 text-right font-medium'>%</th>
                    <th className='px-3 py-2 text-right font-medium'>Total Users</th>
                    <th className='px-3 py-2 text-right font-medium'>Friend Invested</th>
                    <th className='px-3 py-2 text-right font-medium'>Referral Earnings</th>
                  </tr>
                </thead>
                <tbody>
                  {REFERRAL_LEVELS.map((level) => {
                    const count =
                      level.key === 'Primary'
                        ? reportData.primaryCount
                        : level.key === 'Secondary'
                          ? reportData.secondaryCount
                          : reportData.tertiaryCount;
                    const earnings =
                      level.key === 'Primary'
                        ? reportData.primaryAmount
                        : level.key === 'Secondary'
                          ? reportData.secondaryAmount
                          : reportData.tertiaryAmount;
                    const inferredInvested = earnings / (level.percentage / 100);

                    return (
                      <tr key={level.key} className='border-b last:border-b-0'>
                        <td className='px-3 py-2'>{level.key}</td>
                        <td className='px-3 py-2 text-right'>{level.percentage}%</td>
                        <td className='px-3 py-2 text-right'>{count}</td>
                        <td className='px-3 py-2 text-right'>{formatAmount(inferredInvested)}</td>
                        <td className='px-3 py-2 text-right font-medium'>{formatAmount(earnings)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className='bg-muted/30'>
                  <tr>
                    <td className='px-3 py-2 font-semibold'>Total</td>
                    <td className='px-3 py-2 text-right'>-</td>
                    <td className='px-3 py-2 text-right font-semibold'>{reportData.totalCount}</td>
                    <td className='px-3 py-2 text-right font-semibold'>
                      {formatAmount(
                        reportData.primaryAmount / 0.03 +
                          reportData.secondaryAmount / 0.02 +
                          reportData.tertiaryAmount / 0.01
                      )}
                    </td>
                    <td className='px-3 py-2 text-right font-semibold'>{formatAmount(reportData.totalAmount)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
