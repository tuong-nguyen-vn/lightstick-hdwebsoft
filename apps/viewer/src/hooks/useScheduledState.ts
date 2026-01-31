import { useState, useEffect, useRef } from 'react';
import type { StateUpdate, LightstickState } from '@lightstick/shared';
import { DEFAULT_STATE } from '@lightstick/shared';

interface UseScheduledStateReturn {
  currentState: LightstickState;
  pendingUpdate: StateUpdate | null;
}

export function useScheduledState(
  latestUpdate: StateUpdate | null,
  serverOffset: number
): UseScheduledStateReturn {
  const [currentState, setCurrentState] = useState<LightstickState>(DEFAULT_STATE);
  const [pendingUpdate, setPendingUpdate] = useState<StateUpdate | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!latestUpdate) return;

    const { startAt, state } = latestUpdate;
    const currentServerTime = Date.now() + serverOffset;
    const delay = startAt - currentServerTime;

    console.log('[State] Update received:', { state, startAt, currentServerTime, delay, serverOffset });

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (delay <= 0) {
      console.log('[State] Applying immediately');
      setCurrentState(state);
      setPendingUpdate(null);
    } else {
      console.log('[State] Scheduling for', delay, 'ms');
      setPendingUpdate(latestUpdate);
      timeoutRef.current = setTimeout(() => {
        console.log('[State] Applying scheduled state');
        setCurrentState(state);
        setPendingUpdate(null);
      }, delay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [latestUpdate, serverOffset]);

  return {
    currentState,
    pendingUpdate
  };
}
