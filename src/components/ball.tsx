import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { BallProps } from '@/types/slot-machine';

export function Ball({
  number,
  isActive,
  isSpinning,
  size = 'md',
  colorScheme = 'default',
  index,
  direction,
  speed,
}: BallProps) {
  const [animationState, setAnimationState] = useState<
    'idle' | 'spinning' | 'stopping'
  >('idle');
  const [offset, setOffset] = useState(0);

  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl',
  };

  // Get color based on colorScheme and index
  const getBallColor = () => {
    if (colorScheme === 'monochrome') {
      return isActive ? 'bg-gray-800 text-white' : 'bg-gray-300 text-gray-700';
    }

    if (colorScheme === 'gradient') {
      return isActive
        ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
        : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700';
    }

    if (colorScheme === 'rainbow') {
      const colors = [
        'bg-red-500 text-white',
        'bg-orange-500 text-white',
        'bg-yellow-500 text-white',
        'bg-green-500 text-white',
        'bg-blue-500 text-white',
        'bg-indigo-500 text-white',
        'bg-purple-500 text-white',
        'bg-pink-500 text-white',
      ];
      return isActive
        ? colors[index % colors.length]
        : 'bg-gray-300 text-gray-700';
    }

    // Default color scheme
    const colors = [
      'bg-blue-500 text-white',
      'bg-green-500 text-white',
      'bg-amber-500 text-white',
      'bg-purple-500 text-white',
      'bg-red-500 text-white',
    ];
    return isActive
      ? colors[index % colors.length]
      : 'bg-gray-300 text-gray-700';
  };

  // Animation effect
  useEffect(() => {
    if (isSpinning) {
      setAnimationState('spinning');
      const baseSpeed = direction === 'up' ? -speed : speed;

      // Animation frame for smooth movement
      let animationId: number;
      let lastTimestamp: number;

      const animate = (timestamp: number) => {
        if (!lastTimestamp) lastTimestamp = timestamp;
        const elapsed = timestamp - lastTimestamp;
        lastTimestamp = timestamp;

        // Calculate movement based on speed and elapsed time
        setOffset((prev) => {
          let newOffset = prev + (baseSpeed * elapsed) / 16;

          // Reset position when it goes out of bounds
          if (direction === 'up' && newOffset < -100) {
            newOffset = 100;
          } else if (direction === 'down' && newOffset > 100) {
            newOffset = -100;
          }

          return newOffset;
        });

        animationId = requestAnimationFrame(animate);
      };

      animationId = requestAnimationFrame(animate);

      return () => {
        cancelAnimationFrame(animationId);
        setAnimationState('stopping');
        setTimeout(() => {
          setOffset(0);
          setAnimationState('idle');
        }, 300);
      };
    }
  }, [isSpinning, direction, speed]);

  return (
    <div
      className={cn(
        'relative rounded-full flex items-center justify-center font-bold shadow-md transition-all',
        sizeClasses[size],
        getBallColor(),
        isActive && !isSpinning && 'ring-2 ring-white ring-opacity-70',
        animationState === 'stopping' &&
          'transition-transform duration-300 ease-out'
      )}
      style={{
        transform: `translateY(${offset}%)`,
        transition:
          animationState === 'stopping' ? 'transform 300ms ease-out' : 'none',
      }}
    >
      {number}

      {/* 3D effect with pseudo-elements */}
      <div
        className='absolute inset-0 rounded-full bg-white opacity-20 blur-sm'
        style={{ clipPath: 'ellipse(40% 20% at 50% 20%)' }}
      ></div>
      <div
        className='absolute inset-0 rounded-full bg-black opacity-10 blur-sm'
        style={{ clipPath: 'ellipse(40% 20% at 50% 80%)' }}
      ></div>
    </div>
  );
}
