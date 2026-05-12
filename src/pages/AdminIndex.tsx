import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Users, Settings, FileText, BarChart2, ListChecks, Gamepad2, Home, Cog } from 'lucide-react';
import diceLoading from '@/assets/lottie/dice-loading-animation.json';
import { Player } from '@lottiefiles/react-lottie-player';
import { useAuth } from '@/contexts/auth-context';
import rolesData from '@/data/roles-data.json';

const allAdminPages = [
  // {
  //   label: 'Dashboard',
  //   icon: DollarSign,
  //   path: '/admin/dashboard',
  //   color: 'bg-primary/10 text-primary',
  // },
  {
    label: 'Approvals',
    icon: CreditCard,
    path: '/admin/deposits',
    color: 'bg-green-100 text-green-700',
  },
  {
    label: 'Users',
    icon: Users,
    path: '/admin/users',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    label: 'Results',
    icon: FileText,
    path: '/admin/results',
    color: 'bg-yellow-100 text-yellow-700',
  },
  {
    label: 'Lot Pricing',
    icon: BarChart2,
    path: '/admin/lot-pricing',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    label: 'Reports',
    icon: ListChecks,
    path: '/admin/reports',
    color: 'bg-orange-100 text-orange-700',
  },
  {
    label: 'Games',
    icon: Gamepad2,
    path: '/admin/games',
    color: 'bg-pink-100 text-pink-700',
  },
  {
    label: 'Settings',
    icon: Settings,
    path: '/admin/settings',
    color: 'bg-gray-100 text-gray-700',
  },
  {
    label: 'Configurations',
    icon: Cog,
    path: '/admin/configurations',
    color: 'bg-indigo-100 text-indigo-700',
  },
];

export default function AdminIndexPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Get user's role data and filter pages based on permissions
  const userRoleData = user ? rolesData[user.role as keyof typeof rolesData] : null;
  const allowedScreens = userRoleData?.screens || [];

  // Filter admin pages based on user's role permissions
  const adminPages = allAdminPages.filter(page => 
    allowedScreens.some(x => page.path == x )
  );

  return (
    <div className='flex flex-col items-center w-full px-2 py-6'>
      {/* Go Home button for mobile only */}
      <div className='w-full flex justify-start mb-2 block md:hidden'>
        <Button variant='outline' size='sm' onClick={() => navigate('/')}
          className='flex items-center gap-2'>
          <Home className='w-4 h-4' /> Home
        </Button>
      </div>
      {/* Animation with extra margin to avoid overlap */}
      <div className='w-32 h-32 mb-2 flex items-center justify-center'>
        <Player
          autoplay
          loop
          src={diceLoading}
          style={{ height: 120, width: 120 }}
        />
      </div>
      <h1 className='text-2xl font-bold mb-2'>Admin Panel</h1>
      <p className='text-muted-foreground mb-6 text-center'>Quickly access all admin features</p>
      <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl'>
        {adminPages.map((page) => (
          <Card
            key={page.label}
            className='cursor-pointer transition hover:shadow-lg flex flex-col items-center justify-center p-4 min-h-[120px]'
            onClick={() => navigate(page.path)}
          >
            <div className={`rounded-full p-3 mb-2 ${page.color}`}>
              <page.icon className='w-7 h-7' />
            </div>
            <CardContent className='p-0 text-center'>
              <span className='font-medium'>{page.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 