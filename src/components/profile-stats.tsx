import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function ProfileStats() {
  // const { user } = useAuth();

  // Mock statistics data
  const stats = {
    totalBets: 42,
    wonBets: 18,
    lostBets: 24,
    winRate: 42.86,
    totalWagered: 840,
    totalWon: 1260,
    netProfit: 420,
    favoriteGame: '3 Digit',
    luckyNumber: '7',
    biggestWin: 300,
    currentStreak: 'L2', // Lost last 2
    longestWinStreak: 4,
  };

  // Mock monthly data for chart
  const monthlyData = [
    { month: 'Jan', bets: 5, won: 2, profit: -60 },
    { month: 'Feb', bets: 8, won: 3, profit: -100 },
    { month: 'Mar', bets: 10, won: 6, profit: 150 },
    { month: 'Apr', bets: 12, won: 5, profit: 80 },
    { month: 'May', bets: 7, won: 2, profit: -90 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Betting Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue='overview'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='games'>Games</TabsTrigger>
            <TabsTrigger value='trends'>Trends</TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='space-y-4 pt-4'>
            <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
              <div className='rounded-lg bg-muted p-3'>
                <p className='text-sm text-muted-foreground'>Total Bets</p>
                <p className='text-2xl font-bold'>{stats.totalBets}</p>
              </div>
              <div className='rounded-lg bg-muted p-3'>
                <p className='text-sm text-muted-foreground'>Win Rate</p>
                <p className='text-2xl font-bold'>{stats.winRate}%</p>
              </div>
              <div className='rounded-lg bg-muted p-3'>
                <p className='text-sm text-muted-foreground'>Total Wagered</p>
                <p className='text-2xl font-bold'>₹{stats.totalWagered}</p>
              </div>
              <div className='rounded-lg bg-muted p-3'>
                <p className='text-sm text-muted-foreground'>Net Profit</p>
                <p
                  className={`text-2xl font-bold ${
                    stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  ₹{stats.netProfit}
                </p>
              </div>
            </div>

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div className='rounded-lg border p-4'>
                <h3 className='text-lg font-semibold mb-2'>Betting Summary</h3>
                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Won</span>
                    <span className='font-medium text-green-600'>
                      {stats.wonBets}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Lost</span>
                    <span className='font-medium text-red-600'>
                      {stats.lostBets}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Total Won</span>
                    <span className='font-medium text-green-600'>
                      ₹{stats.totalWon}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>
                      Current Streak
                    </span>
                    <span
                      className={`font-medium ${
                        stats.currentStreak.startsWith('W')
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {stats.currentStreak}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>
                      Longest Win Streak
                    </span>
                    <span className='font-medium'>
                      {stats.longestWinStreak}
                    </span>
                  </div>
                </div>
              </div>

              <div className='rounded-lg border p-4'>
                <h3 className='text-lg font-semibold mb-2'>Lucky Stats</h3>
                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Favorite Game</span>
                    <span className='font-medium'>{stats.favoriteGame}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Lucky Number</span>
                    <span className='font-medium'>{stats.luckyNumber}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Biggest Win</span>
                    <span className='font-medium text-green-600'>
                      ₹{stats.biggestWin}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Best Day</span>
                    <span className='font-medium'>Wednesday</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Best Time</span>
                    <span className='font-medium'>Evening</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value='games' className='pt-4'>
            <div className='space-y-4'>
              <div className='rounded-lg border p-4'>
                <h3 className='text-lg font-semibold mb-4'>Game Performance</h3>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <div className='flex justify-between items-center'>
                      <span>3 Digit Game</span>
                      <span className='text-sm font-medium'>Win Rate: 45%</span>
                    </div>
                    <div className='h-2 w-full bg-muted rounded-full overflow-hidden'>
                      <div
                        className='bg-primary h-full'
                        style={{ width: '45%' }}
                      ></div>
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <div className='flex justify-between items-center'>
                      <span>Dice</span>
                      <span className='text-sm font-medium'>Win Rate: 38%</span>
                    </div>
                    <div className='h-2 w-full bg-muted rounded-full overflow-hidden'>
                      <div
                        className='bg-primary h-full'
                        style={{ width: '38%' }}
                      ></div>
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <div className='flex justify-between items-center'>
                      <span>Color</span>
                      <span className='text-sm font-medium'>Win Rate: 52%</span>
                    </div>
                    <div className='h-2 w-full bg-muted rounded-full overflow-hidden'>
                      <div
                        className='bg-primary h-full'
                        style={{ width: '52%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value='trends' className='pt-4'>
            <div className='rounded-lg border p-4'>
              <h3 className='text-lg font-semibold mb-4'>
                Monthly Performance
              </h3>
              <div className='space-y-4'>
                {monthlyData.map((month) => (
                  <div key={month.month} className='space-y-2'>
                    <div className='flex justify-between items-center'>
                      <span>{month.month}</span>
                      <span
                        className={`text-sm font-medium ${
                          month.profit >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {month.profit >= 0 ? '+' : ''}₹{month.profit}
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <div className='text-xs w-16'>
                        {month.won}/{month.bets} bets
                      </div>
                      <div className='h-2 flex-1 bg-muted rounded-full overflow-hidden'>
                        <div
                          className={`h-full ${
                            month.profit >= 0 ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{
                            width: `${(month.won / month.bets) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
