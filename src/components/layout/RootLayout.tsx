import { type ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import { Toaster } from '@/components/ui/toaster';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const router = useNavigate();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      router('/auth/login');
    }
  }, [router, isClient]);

  if (!isClient) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        Loading...
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background'>
      <Navigation />
      <main className='container mx-auto px-4 py-8'>{children}</main>
      <Toaster />
    </div>
  );
}
