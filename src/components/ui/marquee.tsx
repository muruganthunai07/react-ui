import React from 'react';
import Marquee from 'react-fast-marquee';
import { cn } from '@/lib/utils';

interface MarqueeTextProps {
  text: string;
  className?: string;
}

const MarqueeText: React.FC<MarqueeTextProps> = ({ text, className }) => {
  return (
    <div
      className={cn(
        'bg-primary text-primary-foreground overflow-hidden py-2 text-sm',
        className
      )}
    >
      <Marquee>
        <p className='mr-4'>{text}</p>
        <p className='mr-4'>{text}</p>
      </Marquee>
    </div>
  );
};

export default MarqueeText; 