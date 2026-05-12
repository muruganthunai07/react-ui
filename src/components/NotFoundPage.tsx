import { Player } from '@lottiefiles/react-lottie-player';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function NotFoundPage() {
  const navigate = useNavigate();
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
      <h1 className="mt-6 text-3xl font-bold text-yellow-500">Page Not Found</h1>
      <p className="mt-2 text-lg text-muted-foreground text-center max-w-md">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Button className="mt-8 w-40" onClick={() => navigate('/')}>Go Home</Button>
    </div>
  );
} 