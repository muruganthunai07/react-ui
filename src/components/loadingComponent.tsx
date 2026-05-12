// components/LoadingBarProvider.tsx
import React, { useRef, useEffect, type PropsWithChildren } from 'react';
import LoadingBar, { type LoadingBarRef } from 'react-top-loading-bar';
import { setLoadingBar } from '../utils/LoadingBarController';

const LoadingBarProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const ref = useRef<LoadingBarRef>(null);

  useEffect(() => {
    if (ref.current) {
      setLoadingBar(ref.current);
    }
  }, []);

  return (
    <>
      <LoadingBar color='var(--color-primary)' height={3} ref={ref} />
      {children}
    </>
  );
};

export default LoadingBarProvider;
