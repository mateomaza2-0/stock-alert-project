import {useEffect, useState, useRef} from 'react';

import {useThresholds} from '~/context/ThresholdsContext';

interface LowStockAlertProps {
  inventory: number;
}

export default function LowStockAlert({inventory}: LowStockAlertProps) {
  const {thresholds} = useThresholds();
  const {low: thresholdLow, critical: thresholdCritical} = thresholds;
  const shouldShow = inventory <= thresholdLow;

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  if (!shouldShow) return null;

  let bannerColor = '';
  let bannerText = '';

  if (inventory === 0) {
    bannerColor = 'border-grey-500 bg-grey-50 text-red-800';
    bannerText = '🛑 Out of stock';
  } else if (inventory <= thresholdCritical) {
    bannerColor = 'border-red-500 bg-red-50 text-red-800';
    bannerText = `🔥 Critical stock: Only ${inventory} left!`;
  } else {
    bannerColor = 'border-yellow-500 bg-yellow-50 text-red-800';
    bannerText = `⚠️ Low stock: ${inventory} remaining`;
  }

  return (
    <div className="absolute top-0 left-0 z-10 p-2 rounded animate-fadePulse">
      <div className={`border-l-4 p-4 text-sm ${bannerColor}`}>
        {bannerText}
      </div>
    </div>
  );
}
