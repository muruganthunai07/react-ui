import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getFileUrl } from '@/lib/utils';
import { TENANT_APP_NAME } from '@/config/tenant';

interface GameCarouselProps {
  bannerImageUrls?: string[];
}

export function GameCarousel({ bannerImageUrls = [] }: GameCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    if (bannerImageUrls.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((current) =>
        current === bannerImageUrls.length - 1 ? 0 : current + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [bannerImageUrls.length]);

  const nextSlide = () => {
    if (bannerImageUrls.length <= 1) return;
    setActiveIndex((current) =>
      current === bannerImageUrls.length - 1 ? 0 : current + 1
    );
  };

  const prevSlide = () => {
    if (bannerImageUrls.length <= 1) return;
    setActiveIndex((current) =>
      current === 0 ? bannerImageUrls.length - 1 : current - 1
    );
  };

  // If no banner images, show a placeholder
  if (!bannerImageUrls || bannerImageUrls.length === 0) {
    return (
      <div className='relative w-full h-48 md:h-64 lg:h-80 rounded-xl overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600'>
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='text-center text-white'>
            <h3 className='text-2xl md:text-3xl font-bold mb-2'>
              Welcome to {TENANT_APP_NAME}
            </h3>
            <p className='text-sm md:text-base opacity-90'>
              The Best Time is Now!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='relative w-full h-48 md:h-64 lg:h-80 rounded-xl overflow-hidden'>
      {/* Carousel container */}
      <div
        className='absolute inset-0 flex transition-transform duration-500 ease-in-out'
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {bannerImageUrls.map((imageUrl, index) => (
          <div key={index} className='min-w-full h-full relative'>
            <img
              src={getFileUrl(imageUrl)}
              alt={`Banner ${index + 1}`}
              className='w-full h-full object-cover object-center'
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = `
                  <div class="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                    <div class="text-center text-white">
                      <h3 class="text-2xl md:text-3xl font-bold mb-2">Banner ${
                        index + 1
                      }</h3>
                      <p class="text-sm md:text-base opacity-90">${TENANT_APP_NAME}</p>
                    </div>
                  </div>
                `;
              }}
            />
          </div>
        ))}
      </div>

      {/* Navigation buttons - only show if there are multiple images */}
      {bannerImageUrls.length > 1 && (
        <>
          <Button
            variant='outline'
            size='icon'
            className='absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group'
            onClick={prevSlide}
          >
            <svg
              className='w-5 h-5 md:w-6 md:h-6 text-gray-700 group-hover:text-gray-900 transition-colors duration-300'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2.5}
                d='M15 19l-7-7 7-7'
              />
            </svg>
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group'
            onClick={nextSlide}
          >
            <svg
              className='w-5 h-5 md:w-6 md:h-6 text-gray-700 group-hover:text-gray-900 transition-colors duration-300'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2.5}
                d='M9 5l7 7-7 7'
              />
            </svg>
          </Button>
        </>
      )}

      {/* Dots indicator - only show if there are multiple images */}
      {bannerImageUrls.length > 1 && (
        <div className='absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 md:gap-2'>
          {bannerImageUrls.map((_, index) => (
            <button
              key={index}
              className={cn(
                'w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300',
                activeIndex === index
                  ? 'bg-white w-4 md:w-6 shadow-lg'
                  : 'bg-white/50 hover:bg-white/75'
              )}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      )}

      {/* Loading state */}
      {bannerImageUrls.length === 0 && (
        <div className='absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse flex items-center justify-center'>
          <div className='text-gray-500'>
            <div className='w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-2'></div>
            <p className='text-sm'>Loading banners...</p>
          </div>
        </div>
      )}
    </div>
  );
}
