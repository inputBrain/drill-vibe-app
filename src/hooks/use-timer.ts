'use client';

import { useEffect, useState } from 'react';

/**
 * Hook for real-time timer that updates every second
 */
export function useTimer() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return currentTime;
}
