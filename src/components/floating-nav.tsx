import React from 'react';

import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  BarChart2,
  User,
  Settings,
  LogIn,
  LockKeyhole,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import navData from '@/data/navigation-data.json';
import { useAuth } from '@/contexts/auth-context';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useNavbar } from '@/contexts/navbar-context';
import { AuthDrawer } from './auth-drawer';
import { useIsMobile } from '@/hooks/use-mobile';
// Map icon names to components
const iconMap: Record<string, React.ComponentType<any>> = {
  Home,
  BarChart2,
  User,
  Settings,
  LogIn,
  LockKeyhole,
};

function FloatingNav() {
  const location = useLocation();
  const pathname = location.pathname;
  const {isAdmin, isAuthenticated } = useAuth();
  const { isNavbarVisible } = useNavbar();
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [navItems, setNavItems] = useState(navData.navItems);
  const [referralCode, setReferralCode] = useState<string>('');
  const params = location.search;
  const isMobile = useIsMobile();
  useEffect(() => {
    //Check if params has 'login' and open login sheet if true
    const urlParams = new URLSearchParams(params);
    const referralParam = urlParams.get('referral') || urlParams.get('ref');

    if (params.includes('login') && isMobile) {
      setLoginOpen(true);
      // Clear the search params after opening the login sheet
      window.history.replaceState(
        {},
        '',
        location.pathname + location.hash // Keep the pathname and hash, but clear search params
      );
    } else if (referralParam && !isAuthenticated && isMobile) {
      // Auto-open signup drawer when referral param exists and user is not authenticated
      setReferralCode(referralParam);
      setSignupOpen(true);
      // Clear the referral param from URL after opening the drawer
      window.history.replaceState(
        {},
        '',
        location.pathname + location.hash // Keep the pathname and hash, but clear search params
      );
    }
    // Handle navItems assignment based on isAdmin and isAuthenticated
    let updatedNavItems = [...navData.navItems];
    if (isAdmin && !updatedNavItems.find((item) => item.id === 'admin')) {
      updatedNavItems.push({
        id: 'admin',
        label: 'Admin',
        icon: 'LockKeyhole',
        href: '/admin',
      });
    }
    if (!isAuthenticated) {
      updatedNavItems = updatedNavItems.filter((item) => item.id !== 'admin');
    }
    setNavItems(updatedNavItems);
  }, [params, location.pathname, location.hash, isAdmin, isAuthenticated, isMobile]);

  useEffect(() => {
    if (isAuthenticated) {
      setLoginOpen(false);
      setSignupOpen(false);
    }
  }, [isAuthenticated]);
  // Get icon component from string name
  const getIconComponent = (iconName: string) => {
    return iconMap[iconName] || Home;
  };


  // If navbar is not visible, don't render anything
  if (!isNavbarVisible) {
    return null;
  }

  // Handle authentication-related navigation
  const handleAuthNav = (e: React.MouseEvent, itemId: string) => {
    // Only prevent navigation and show login if user is not authenticated
    // and the item requires authentication
    if (!isAuthenticated && (itemId === 'profile' || itemId === 'settings')) {
      e.preventDefault();
      setLoginOpen(true);
    }
  };
  return (
    <>
      <div className='fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 md:hidden'>
        <div className='flex items-center gap-1 bg-background border-2 border-accent rounded-full p-2 shadow-lg'>
          {navItems.map((item) => {
            const IconComponent = getIconComponent(item.icon);
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.id}
                to={item.href}
                onClick={(e) => handleAuthNav(e, item.id)}
                className={cn(
                  'flex flex-col items-center justify-center p-2 rounded-full w-12 h-12 transition-all',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                )}
                aria-label={item.label}
              >
                <IconComponent className='h-5 w-5' />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Auth Drawer */}
      <Sheet open={loginOpen || signupOpen} onOpenChange={setLoginOpen}>
        <SheetContent
          side='bottom'
          className='h-[90vh] rounded-t-xl p-0 md:w-[400px] md:h-screen md:rounded-none md:right-0 md:left-auto'
        >
          <AuthDrawer
            onClose={() => {
              setLoginOpen(false);
              setSignupOpen(false);
              setReferralCode(''); // Clear referral code when drawer closes
            }}
            defaultTab={signupOpen ? 'signup' : 'login'}
            initialReferralCode={referralCode}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
export default React.memo(FloatingNav);
