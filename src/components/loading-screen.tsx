import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { TENANT_APP_NAME } from '@/config/tenant';

export function LoadingScreen({
  onLoadingComplete,
}: {
  onLoadingComplete: () => void;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(timer);
          onLoadingComplete();
          return 100;
        }
        return Math.min(oldProgress + 2, 100);
      });
    }, 50);

    return () => {
      clearInterval(timer);
    };
  }, [onLoadingComplete]);

  return (
    <div className='fixed inset-0 bg-background flex flex-col items-center justify-center z-50'>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className='w-24 h-24 relative mb-8'
      >
        <img
          src='/logo.svg'
          alt={`${TENANT_APP_NAME} Logo`}
          className='object-contain w-full h-full'
          loading='eager'
        />
      </motion.div>
      <div className='w-64'>
        <Progress value={progress} className='h-1' />
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className='absolute bottom-8 text-xl font-semibold text-muted-foreground'
      >
        {TENANT_APP_NAME}
      </motion.div>
    </div>
  );
}
