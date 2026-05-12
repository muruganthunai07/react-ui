import { ArrowUpRight, CreditCard, DollarSign, Users } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AdminLayout } from '@/components/admin-layout';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDashboard } from '@/contexts/dasboard-context';
import momentTz from 'moment-timezone';
export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { getAdminDasboard, adminDashboardData } = useDashboard();
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    await getAdminDasboard();
  };
  return (
    <AdminLayout>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
            <DollarSign className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              ₹{adminDashboardData?.totalRevenue?.toLocaleString('en-IN') || 0}
            </div>
            <p className='text-xs text-muted-foreground'>
              {adminDashboardData?.revenueChangePercentage || 0}% from last
              month
            </p>
            <div className='mt-4 h-1 w-full bg-muted'>
              <div className='h-1 w-1/2 bg-primary'></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Pending Deposits
            </CardTitle>
            <CreditCard className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {adminDashboardData?.pendingDepositsCount || 0}
            </div>
            <div className='flex items-center pt-1'>
              <span className='text-xs text-muted-foreground'>
                Total amount: ₹{adminDashboardData?.pendingDepositsAmount}
              </span>
              <ArrowUpRight
                className='ml-auto h-4 w-4 text-primary cursor-pointer'
                onClick={() => navigate('/admin/deposits')}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Active Users</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {adminDashboardData?.activeUsersCount}
            </div>
            <p className='text-xs text-muted-foreground'>
              +{adminDashboardData?.activeUsersChange} since last week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4'>
        <Card className='col-span-full lg:col-span-4'>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Recent user activity and transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {adminDashboardData?.recentActivities?.map((i) => (
                <div key={i.username} className='flex items-center'>
                  <div className='w-2 h-2 rounded-full bg-primary mr-2'></div>
                  <div className='flex-1 space-y-1'>
                    <p className='text-sm font-medium leading-none'>
                      User {i.username} placed a bet
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      {momentTz(i?.activityTime).format('lll')}
                    </p>
                  </div>
                  <div className='font-medium'>
                    ₹{i?.betAmount?.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className='col-span-full lg:col-span-3'>
          <CardHeader>
            <CardTitle>Game Performance</CardTitle>
            <CardDescription>Most popular games by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {adminDashboardData?.gamePerformances?.map((game) => (
                <div key={game?.gameName} className='flex items-center'>
                  <div className='w-full flex-1'>
                    <div className='flex justify-between mb-1'>
                      <span className='text-sm font-medium'>
                        {game?.gameName}
                      </span>
                      <span className='text-sm font-medium'>
                        ₹{game?.revenue?.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className='w-full h-2 bg-muted rounded-full overflow-hidden'>
                      <div
                        className='h-full bg-primary'
                        style={{
                          width: `${
                            (game?.revenue / adminDashboardData?.totalRevenue) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
