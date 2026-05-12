import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { ArrowLeft } from 'lucide-react';
import { ThemeCustomizer } from '@/components/theme-customizer';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useState, useEffect } from 'react';
import { AuthDrawer } from '@/components/auth-drawer';
import { useDashboard } from '@/contexts/dasboard-context';
import { openWhatsAppHelp } from '@/lib/utils';
import { TENANT_APP_NAME } from '@/config/tenant';
// import ResetPasswordForm from '@/components/ResetPasswordForm';

const WhatsAppIcon = () => (
  <svg fill='currentColor' aria-hidden='true' xmlns="http://www.w3.org/2000/svg"><path d="M11.42 9.49c-.19-.09-1.1-.54-1.27-.61s-.29-.09-.42.1-.48.6-.59.73-.21.14-.4 0a5.13 5.13 0 0 1-1.49-.92 5.25 5.25 0 0 1-1-1.29c-.11-.18 0-.28.08-.38s.18-.21.28-.32a1.39 1.39 0 0 0 .18-.31.38.38 0 0 0 0-.33c0-.09-.42-1-.58-1.37s-.3-.32-.41-.32h-.4a.72.72 0 0 0-.5.23 2.1 2.1 0 0 0-.65 1.55A3.59 3.59 0 0 0 5 8.2 8.32 8.32 0 0 0 8.19 11c.44.19.78.3 1.05.39a2.53 2.53 0 0 0 1.17.07 1.93 1.93 0 0 0 1.26-.88 1.67 1.67 0 0 0 .11-.88c-.05-.07-.17-.12-.36-.21z"/><path d="M13.29 2.68A7.36 7.36 0 0 0 8 .5a7.44 7.44 0 0 0-6.41 11.15l-1 3.85 3.94-1a7.4 7.4 0 0 0 3.55.9H8a7.44 7.44 0 0 0 5.29-12.72zM8 14.12a6.12 6.12 0 0 1-3.15-.87l-.22-.13-2.34.61.62-2.28-.14-.23a6.18 6.18 0 0 1 9.6-7.65 6.12 6.12 0 0 1 1.81 4.37A6.19 6.19 0 0 1 8 14.12z"/>
  </svg>
);

export default function SettingsPage() {
  const router = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const { dashboardData, getDashboard } = useDashboard();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setIsDrawerOpen(false);
      setShowForgotPassword(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!dashboardData) {
      void getDashboard();
    }
  }, [dashboardData, getDashboard]);

  const handleResetPasswordClick = () => {
    setShowForgotPassword(true);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setShowForgotPassword(false);
  };

  const handleHelpClick = () => {
    openWhatsAppHelp(dashboardData?.helpNumber);
  };

  // If not authenticated, show auth drawer
  if (!isAuthenticated) {
    return (
      <>
        <div className='container max-w-4xl px-4 py-6 md:py-8'>
          <Card>
            <CardHeader>
              <CardTitle>Please Login</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground'>
                You need to be logged in to view settings.
              </p>
            </CardContent>
          </Card>
        </div>

        <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <SheetContent side='right' className='w-full p-0 sm:max-w-md'>
            <AuthDrawer onClose={() => router('/')} showForgotPasswordInitially={showForgotPassword} />
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <div className='container max-w-4xl px-4 py-6 md:py-8 pb-32'>
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => router(-1)}
            className='mr-2'
          >
            <ArrowLeft className='h-5 w-5' />
          </Button>
          <h1 className='text-2xl font-bold'>Settings</h1>
        </div>
      </div>

      <div className='grid gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize how {TENANT_APP_NAME} looks on your device
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ThemeCustomizer />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {dashboardData?.helpNumber && (
              <Button
                variant='outline'
                className='w-full flex items-center gap-2 text-green-600'
                onClick={handleHelpClick}
              >
                <WhatsAppIcon />
                <span>WhatsApp Help</span>
              </Button>
            )}
            <Button
              variant='outline'
              className='w-full'
              onClick={handleResetPasswordClick}
            >
              Reset Password
            </Button>
          </CardContent>
          <CardContent className='space-y-4'>
            <Button variant='destructive' className='w-full' onClick={logout}>
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>

      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent side='right' className='w-full p-0 sm:max-w-md'>
          <AuthDrawer onClose={closeDrawer} showForgotPasswordInitially={showForgotPassword} initialMobileNumber={String(user?.mobileNumber ?? '')} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
