import { useCallback } from 'react';

interface UseTimeSyncReturn {
  getServerTime: () => number;
  scheduleAt: (targetServerTime: number, callback: () => void) => ReturnType<typeof setTimeout> | null;
}

export function useTimeSync(serverOffset: number): UseTimeSyncReturn {
  const getServerTime = useCallback(() => {
    return Date.now() + serverOffset;
  }, [serverOffset]);

  const scheduleAt = useCallback((targetServerTime: number, callback: () => void) => {
    const currentServerTime = Date.now() + serverOffset;
    const delay = targetServerTime - currentServerTime;
    
    if (delay <= 0) {
      callback();
      return null;
    }
    
    return setTimeout(callback, delay);
  }, [serverOffset]);

  return {
    getServerTime,
    scheduleAt
  };
}
