import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Trophy,
  User,
  LogOut,
  Settings,
  LogIn,
  LockKeyhole,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/auth-context';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';
import { Sheet, SheetContent } from './ui/sheet';
import { AuthDrawer } from './auth-drawer';
import rolesData from '../data/roles-data.json';
import { TENANT_APP_NAME } from '@/config/tenant';

export function Navigation() {
  const location = useLocation();
  const params = location.search;
  const pathname = location.pathname;
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [hideNavigation, setHideNavigation] = useState(false);
  const [authDrawerOpen, setAuthDrawerOpen] = useState(false);
  const [authDrawerTab, setAuthDrawerTab] = useState<'login' | 'signup'>(
    'login'
  );
  const [referralCode, setReferralCode] = useState<string>('');
  useEffect(() => {
    // Hide navigation on auth pages and game pages
    setHideNavigation(
      pathname.startsWith('/auth') ||
        pathname === '/3-digit-game' ||
        pathname === '/dice-game' ||
        pathname === '/cart'
    );
    
    // Check for referral query params and auto-open signup drawer
    const urlParams = new URLSearchParams(params);
    const referralParam = urlParams.get('referral') || urlParams.get('ref');
    
    if (params.includes('login') && window.innerWidth > 768) {
      openAuthDrawer('login');
      navigate({ pathname, search: '' }, { replace: true });
    } else if (referralParam && !isAuthenticated && window.innerWidth > 768) {
      // Auto-open signup drawer when referral param exists and user is not authenticated
      setReferralCode(referralParam);
      openAuthDrawer('signup');
      // Clear the referral param from URL after opening the drawer
      navigate({ pathname, search: '' }, { replace: true });
    }
  }, [pathname, params, isAuthenticated, navigate]);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setAuthDrawerOpen(false);
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const openAuthDrawer = (tab: 'login' | 'signup') => {
    setAuthDrawerTab(tab);
    setAuthDrawerOpen(true);
  };

  const navItems = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
    },
    {
      name: 'Results',
      href: '/results',
      icon: Trophy,
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: User,
      requiresAuth: true,
    },
  ];
  if (
    user &&
    user.role &&
    rolesData[user.role as keyof typeof rolesData].isAdmin
  ) {
    navItems.push({
      name: 'Admin',
      href: '/admin',
      icon: LockKeyhole,
      requiresAuth: true,
    });
  }
  if (hideNavigation) {
    return null;
  }

  if (isMobile) {
    return null; // We'll use FloatingNav instead
  }
  const [brandPrimary, ...brandRest] = TENANT_APP_NAME.split(' ');
  const brandSecondary = brandRest.join(' ');

  return (
    <>
      <div className='fixed left-0 top-0 z-40 hidden h-full w-[240px] border-r bg-background md:block'>
        <div className='flex h-full flex-col'>
          <div className='flex h-14 items-center justify-between border-b px-4'>
            <Link to='/' className='flex items-center gap-2 font-bold text-lg'>
              <span className='text-primary'>{brandPrimary}</span>
              {brandSecondary && <span>{brandSecondary}</span>}
            </Link>
            <ThemeToggle />
          </div>

          {user ? (
            <div className='border-b p-4'>
              <div className='flex items-center gap-3'>
                <Avatar className='h-10 w-10 border-2 border-primary'>
                  <AvatarFallback className='bg-primary text-primary-foreground'>
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className='flex-1 overflow-hidden'>
                  <p className='text-sm font-medium truncate'>{user.name}</p>
                  <p className='text-xs text-muted-foreground truncate'>
                    {user.isAdmin ? 'Administrator' : user.email}
                  </p>
                </div>
              </div>

              <div className='mt-3 grid grid-cols-2 gap-2'>
                <div className='rounded-md bg-muted p-2'>
                  <p className='text-xs text-muted-foreground'>Balance</p>
                  <p className='font-medium'>
                    ₹{user.userBalance.totalBalance || 0}
                  </p>
                </div>
                <div className='rounded-md bg-muted p-2'>
                  <p className='text-xs text-muted-foreground'>Winnings</p>
                  <p className='font-medium'>
                    ₹{user.userBalance.winningBalance || 0}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className='border-b p-4'>
              <div className='flex flex-col gap-2'>
                <Button
                  onClick={() => openAuthDrawer('login')}
                  className='w-full'
                >
                  Login
                </Button>
                <Button
                  onClick={() => openAuthDrawer('signup')}
                  variant='outline'
                  className='w-full'
                >
                  Sign Up
                </Button>
              </div>
            </div>
          )}

          <div className='flex-1 overflow-auto py-2'>
            <nav className='grid gap-1 px-2'>
              {navItems.map((item) => {
                // Skip the requiresAuth check if the user is already authenticated
                const shouldRenderAsLink =
                  !item.requiresAuth || isAuthenticated;

                if (!shouldRenderAsLink) {
                  return (
                    <button
                      key={item.name}
                      onClick={() => openAuthDrawer('login')}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
                        'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      <item.icon className='h-5 w-5' />
                      {item.name}
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
                      pathname === item.href
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <item.icon className='h-5 w-5' />
                    {item.name}
                  </Link>
                );
              })}

              <Link
                to='/settings'
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
                  pathname === '/settings'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Settings className='h-5 w-5' />
                Settings
              </Link>
            </nav>
          </div>

          <div className='border-t p-4'>
            {user ? (
              <Button
                onClick={handleLogout}
                variant='outline'
                className='w-full justify-start text-red-500 hover:bg-red-500/10 hover:text-red-500'
              >
                <LogOut className='h-5 w-5 mr-2' />
                Sign Out
              </Button>
            ) : (
              <Button
                onClick={() => openAuthDrawer('login')}
                variant='outline'
                className='w-full justify-start'
              >
                <LogIn className='h-5 w-5 mr-2' />
                Login
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Auth Drawer */}
      <Sheet open={authDrawerOpen} onOpenChange={setAuthDrawerOpen}>
        <SheetContent side='right' className='w-full p-0 sm:max-w-md'>
          <AuthDrawer
            onClose={() => {
              setAuthDrawerOpen(false);
              setReferralCode(''); // Clear referral code when drawer closes
            }}
            defaultTab={authDrawerTab}
            initialReferralCode={referralCode}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
