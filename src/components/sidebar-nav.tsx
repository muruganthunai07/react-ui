import type React from 'react';

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import navData from '@/data/navigation-data.json';
import { useAuth } from '@/contexts/auth-context';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { LoginForm } from '@/components/login-form';
import { SignupForm } from '@/components/signup-form';
import { Home, BarChart2, User, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle';
import { TENANT_APP_NAME, TENANT_SHORT_NAME } from '@/config/tenant';

// Map icon names to components
const iconMap: Record<string, React.ComponentType<any>> = {
  Home,
  BarChart2,
  User,
  Settings,
  LogOut,
};

export function SidebarNav() {
  const location = useLocation();
  const pathname = location.pathname;
  const { user, isAuthenticated, logout } = useAuth();
  const [navItems] = useState(navData.navItems);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  // Get icon component from string name
  const getIconComponent = (iconName: string) => {
    return iconMap[iconName] || Home;
  };

  // Handle authentication-related navigation
  const handleAuthNav = (e: React.MouseEvent, itemId: string) => {
    if (!isAuthenticated && itemId === 'profile') {
      e.preventDefault();
      setLoginOpen(true);
    }
  };

  return (
    <>
      <div className='fixed left-0 top-0 z-40 hidden h-full w-[240px] border-r border-border bg-background/80 backdrop-blur-md md:block'>
        <div className='flex h-full flex-col'>
          {/* Header with logo */}
          <div className='flex h-16 items-center justify-between border-b px-4'>
            <Link to='/' className='flex items-center gap-2'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary'>
                <span className='text-lg font-bold text-primary-foreground'>
                  {TENANT_SHORT_NAME}
                </span>
              </div>
              <span className='text-xl font-bold'>{TENANT_APP_NAME}</span>
            </Link>
            <ThemeToggle />
          </div>

          {/* User profile section */}
          {user && (
            <div className='border-b p-4'>
              <div className='flex items-center gap-3'>
                <Avatar className='h-10 w-10 border-2 border-primary'>
                  <AvatarFallback className='bg-primary text-primary-foreground'>
                    {user && user.username
                      ? user.username.charAt(0).toUpperCase()
                      : 'N/A'}
                  </AvatarFallback>
                </Avatar>
                <div className='flex-1 overflow-hidden'>
                  <p className='font-medium truncate'>{user.username}</p>
                  <p className='text-xs text-muted-foreground truncate'>
                    {user.isAdmin
                      ? 'Administrator'
                      : `+91 ${user.mobileNumber}`}
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
          )}

          {/* Navigation items */}
          <div className='flex-1 overflow-auto py-4'>
            <nav className='grid gap-1 px-2'>
              {navItems.map((item) => {
                const IconComponent = getIconComponent(item.icon);
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.id}
                    to={item.href}
                    onClick={(e) => handleAuthNav(e, item.id)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <IconComponent className='h-5 w-5' />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Footer with logout button */}
          <div className='border-t p-4'>
            <Button
              onClick={() => logout()}
              variant='outline'
              className='w-full justify-start text-red-500 hover:bg-red-500/10 hover:text-red-500'
            >
              <LogOut className='mr-2 h-5 w-5' />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Login Sheet */}
      <Sheet open={loginOpen} onOpenChange={setLoginOpen}>
        <SheetContent side='right' className='w-[400px] h-screen p-0'>
          <LoginForm
            onSuccess={() => setLoginOpen(false)}
            onSignupClick={() => {
              setLoginOpen(false);
              setSignupOpen(true);
            }}
          />
        </SheetContent>
      </Sheet>

      {/* Signup Sheet */}
      <Sheet open={signupOpen} onOpenChange={setSignupOpen}>
        <SheetContent side='right' className='w-[400px] h-screen p-0'>
          <SignupForm
            onSuccess={() => setSignupOpen(false)}
            onLoginClick={() => {
              setSignupOpen(false);
              setLoginOpen(true);
            }}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
