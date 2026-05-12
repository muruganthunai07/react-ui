import { Link, useLocation } from 'react-router-dom';

import {
  BarChart3,
  Calculator,
  CreditCard,
  Home,
  LayoutDashboard,
  Trophy,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const adminNavItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Game Management',
    href: '/admin/games',
    icon: Home,
  },
  {
    title: 'Results',
    href: '/admin/results',
    icon: Trophy,
  },
  {
    title: 'Lot Pricing',
    href: '/admin/lot-pricing',
    icon: Calculator,
  },
  {
    title: 'Reports',
    href: '/admin/reports',
    icon: BarChart3,
  },
  {
    title: 'Approvals',
    href: '/admin/deposits',
    icon: CreditCard,
  },
  {
    title: 'User Management',
    href: '/admin/users',
    icon: Users,
  },
];

export function AdminNav() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className='flex md:flex-col gap-1 w-full overflow-x-auto md:overflow-x-visible pb-2 md:pb-0'>
      {adminNavItems.map((item) => (
        <Button
          key={item.href}
          variant='ghost'
          size='sm'
          className={cn(
            'flex-1 md:flex-none justify-start whitespace-nowrap',
            pathname === item.href && 'bg-accent text-accent-foreground'
          )}
          asChild
        >
          <Link to={item.href} className='flex items-center'>
            <item.icon className='h-4 w-4 md:mr-2' />
            <span className='hidden md:inline'>{item.title}</span>
          </Link>
        </Button>
      ))}
    </div>
  );
}
