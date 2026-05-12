import { Link, useLocation } from 'react-router-dom';
// import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import {
  Home,
  Gamepad2,
  Wallet,
  History,
  Settings,
  LogOut,
} from 'lucide-react';

const navigationItems = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Games', href: '/games', icon: Gamepad2 },
  { name: 'Wallet', href: '/wallet', icon: Wallet },
  { name: 'History', href: '/history', icon: History },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Navigation() {
  const location = useLocation();
  const pathname = location.pathname;
  // const { logout } = useAuth();

  return (
    <nav className='fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:top-0 md:bottom-auto md:border-b md:border-t-0'>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          <div className='hidden md:flex items-center space-x-8'>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary',
                    pathname === item.href
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  )}
                >
                  <Icon className='h-5 w-5' />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Navigation */}
          <div className='flex md:hidden items-center justify-around w-full'>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex flex-col items-center space-y-1 text-xs font-medium transition-colors hover:text-primary',
                    pathname === item.href
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  )}
                >
                  <Icon className='h-5 w-5' />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <button
            onClick={
              () => {} // Add your logout logic here, e.g., call a logout function or redirect
              // logout
            }
            className='hidden md:flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors'
          >
            <LogOut className='h-5 w-5' />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
