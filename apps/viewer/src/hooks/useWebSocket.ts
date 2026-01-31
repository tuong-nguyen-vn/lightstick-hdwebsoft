import { useEffect, useRef, useState, useCallback } from 'react';
import { CONFIG, WS_EVENTS } from '@lightstick/shared';
import type { WebSocketMessage, StateUpdate } from '@lightstick/shared';

export type ConnectionState = 'disconnected' | 'connecting' | 'connected';

interface UseWebSocketReturn {
  state: ConnectionState;
  isConnected: boolean;
  serverOffset: number;
  latestUpdate: StateUpdate | null;
  send: (message: WebSocketMessage) => void;
}

export function useWebSocket(roomCode: string): UseWebSocketReturn {
  const [state, setState] = useState<ConnectionState>('disconnected');
  const [serverOffset, setServerOffset] = useState(0);
  const [latestUpdate, setLatestUpdate] = useState<StateUpdate | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const pingIntervalRef = useRef<ReturnType<typeof setInterval>>();
  const pingTimestampRef = useRef<number>(0);

  const getServerUrl = useCallback(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname;
    // In dev, connect directly to server port; in prod, use same host
    const port = import.meta.env.DEV ? 3001 : window.location.port;
    const portSuffix = port ? `:${port}` : '';
    return `${protocol}//${host}${portSuffix}/ws/${encodeURIComponent(roomCode)}`;
  }, [roomCode]);

  const calculateOffset = useCallback((serverTime: number, clientSendTime: number) => {
    const clientReceiveTime = Date.now();
    const roundTripTime = clientReceiveTime - clientSendTime;
    const offset = serverTime - clientReceiveTime + roundTripTime / 2;
    return offset;
  }, []);

  const send = useCallback((message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  const startPingPong = useCallback(() => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
    }

    pingIntervalRef.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        pingTimestampRef.current = Date.now();
        send({
          type: WS_EVENTS.PING,
          data: { clientTime: pingTimestampRef.current },
          timestamp: pingTimestampRef.current
        });
      }
    }, CONFIG.HEARTBEAT_INTERVAL);
  }, [send]);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    
    setState('connecting');
    const url = getServerUrl();
    console.log('[WS] Connecting to:', url);
    
    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;
      console.log('[WS] WebSocket created, readyState:', ws.readyState);

      ws.onopen = () => {
        console.log('[WS] Connected successfully');
        setState('connected');
        reconnectAttemptsRef.current = 0;
        
        send({
          type: WS_EVENTS.DEVICE_REGISTER,
          data: { userAgent: navigator.userAgent },
          timestamp: Date.now()
        });
        
        startPingPong();
      };

      ws.onmessage = (event) => {
        console.log('[WS] Message received:', event.data);
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          switch (message.type) {
            case WS_EVENTS.PONG: {
              const serverTime = message.timestamp;
              const newOffset = calculateOffset(serverTime, pingTimestampRef.current);
              setServerOffset(prev => {
                const smoothed = prev === 0 ? newOffset : prev * 0.8 + newOffset * 0.2;
                return Math.round(smoothed);
              });
              break;
            }
            case WS_EVENTS.STATE_UPDATE: {
              const stateUpdate: StateUpdate = {
                version: (message as any).version,
                serverNow: (message as any).serverNow,
                startAt: (message as any).startAt,
                state: (message as any).state,
              };
              console.log('[WS] StateUpdate parsed:', stateUpdate);
              setLatestUpdate(stateUpdate);
              break;
            }
          }
        } catch {
          console.error('Failed to parse WebSocket message');
        }
      };

      ws.onclose = (event) => {
        console.log('[WS] Connection closed:', event.code, event.reason);
        setState('disconnected');
        wsRef.current = null;
        
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
        }

        if (reconnectAttemptsRef.current < CONFIG.MAX_RECONNECT_ATTEMPTS) {
          const delay = CONFIG.RECONNECT_DELAY * Math.pow(2, reconnectAttemptsRef.current);
          console.log('[WS] Reconnecting in', delay, 'ms');
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connect();
          }, delay);
        }
      };

      ws.onerror = (error) => {
        console.error('[WS] Error:', error);
        ws.close();
      };
    } catch (err) {
      console.error('[WS] Failed to create WebSocket:', err);
      setState('disconnected');
    }
  }, [getServerUrl, send, startPingPong, calculateOffset]);

  useEffect(() => {
    if (!roomCode) return;
    
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomCode]);

  return {
    state,
    isConnected: state === 'connected',
    serverOffset,
    latestUpdate,
    send
  };
}
