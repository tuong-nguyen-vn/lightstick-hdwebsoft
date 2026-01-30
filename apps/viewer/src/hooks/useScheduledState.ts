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
  const appliedVersionRef = useRef<number>(-1);

  useEffect(() => {
    if (!latestUpdate) return;
    
    if (latestUpdate.version <= appliedVersionRef.current) return;

    const { startAt, state, version } = latestUpdate;
    const currentServerTime = Date.now() + serverOffset;
    const delay = startAt - currentServerTime;

    console.log('[State] Update received:', { version, state, startAt, currentServerTime, delay, serverOffset });

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (delay <= 0) {
      console.log('[State] Applying immediately');
      setCurrentState(state);
      appliedVersionRef.current = version;
      setPendingUpdate(null);
    } else {
      console.log('[State] Scheduling for', delay, 'ms');
      setPendingUpdate(latestUpdate);
      timeoutRef.current = setTimeout(() => {
        console.log('[State] Applying scheduled state');
        setCurrentState(state);
        appliedVersionRef.current = version;
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
