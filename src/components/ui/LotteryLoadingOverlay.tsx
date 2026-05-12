import { Player } from '@lottiefiles/react-lottie-player';
import lotteryLoading from '@/assets/lottie/lotteryloading.json';
import React from 'react';

interface LotteryLoadingOverlayProps {
  show: boolean;
}

const LotteryLoadingOverlay: React.FC<LotteryLoadingOverlayProps> = ({ show }) => {
  if (!show) return null;
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-white/5 backdrop-blur-sm'>
      <div className='w-40 h-40 flex items-center justify-center'>
        <Player autoplay loop src={lotteryLoading} style={{ height: 160, width: 160 }} />
      </div>
    </div>
  );
};

export default LotteryLoadingOverlay; 