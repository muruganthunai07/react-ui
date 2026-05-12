import { useEffect, useState } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { Button } from './ui/button';
import { useNavigate, useLocation } from 'react-router-dom';

// Add errorCode prop type
interface ErrorPageProps {
  errorCode?: string;
}

export default function ErrorPage({ errorCode }: ErrorPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    import('../assets/lottie/error.json').then((data) => setAnimationData(data.default || data));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-background text-foreground px-4">
      {animationData && (
        <Player
          autoplay
          loop
          src={animationData}
          style={{ height: 220, width: 220 }}
        />
      )}
      <h1 className="mt-6 text-3xl font-bold text-red-500">Something went wrong</h1>
      <p className="mt-2 text-lg text-muted-foreground text-center max-w-md">
        Oops! An unexpected error occurred. Please try again or return to the home page.
      </p>
      {/* Show error code if provided */}
      {errorCode && (
        <div className="mt-4 text-sm text-red-400 font-mono">Error Code: {errorCode}</div>
      )}
      <Button
        className="mt-8 w-40"
        onClick={() => {
          if (location.pathname === '/') {
            window.location.reload();
          } else {
            navigate('/');
          }
        }}
      >
        Go Home
      </Button>
    </div>
  );
} 