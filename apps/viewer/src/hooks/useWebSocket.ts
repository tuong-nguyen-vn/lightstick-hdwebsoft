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
  logs: string[];
}

export function useWebSocket(roomCode: string): UseWebSocketReturn {
  const [state, setState] = useState<ConnectionState>('disconnected');
  const [serverOffset, setServerOffset] = useState(0);
  const [latestUpdate, setLatestUpdate] = useState<StateUpdate | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const connectionTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const pingIntervalRef = useRef<ReturnType<typeof setInterval>>();
  const pingTimestampRef = useRef<number>(0);
  const isUnmountedRef = useRef(false);
  
  const CONNECTION_TIMEOUT = 5000;
  
  const addLog = useCallback((msg: string) => {
    const time = new Date().toLocaleTimeString('vi-VN', { hour12: false });
    setLogs(prev => [...prev.slice(-20), `${time} ${msg}`]);
    console.log('[WS]', msg);
  }, []);

  const getServerUrl = useCallback(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname;
    const port = window.location.port;
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
    addLog(`connect() rs=${wsRef.current?.readyState}`);
    
    if (wsRef.current) {
      const rs = wsRef.current.readyState;
      if (rs === WebSocket.OPEN) {
        addLog('Already OPEN, skip');
        return;
      }
      if (rs === WebSocket.CONNECTING || rs === WebSocket.CLOSING) {
        addLog(`Closing stale rs=${rs}`);
        wsRef.current.onclose = null;
        wsRef.current.onerror = null;
        wsRef.current.onmessage = null;
        wsRef.current.onopen = null;
        wsRef.current.close();
        wsRef.current = null;
      }
    }
    
    setState('connecting');
    const url = getServerUrl();
    addLog(`URL: ${url}`);
    
    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;
      addLog(`WS created rs=${ws.readyState}`);

      connectionTimeoutRef.current = setTimeout(() => {
        if (ws.readyState === WebSocket.CONNECTING) {
          addLog('TIMEOUT 5s, closing');
          ws.close();
        }
      }, CONNECTION_TIMEOUT);

      ws.onopen = () => {
        addLog(`OPEN rs=${ws.readyState}`);
        if (connectionTimeoutRef.current) {
          clearTimeout(connectionTimeoutRef.current);
        }
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
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          addLog(`MSG: ${message.type}`);
          
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
              addLog(`STATE v=${stateUpdate.version} mode=${stateUpdate.state.mode}`);
              setLatestUpdate(stateUpdate);
              break;
            }
          }
        } catch {
          addLog('MSG parse error');
        }
      };

      ws.onclose = (event) => {
        addLog(`CLOSE code=${event.code}`);
        setState('disconnected');
        wsRef.current = null;
        
        if (connectionTimeoutRef.current) {
          clearTimeout(connectionTimeoutRef.current);
        }
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
        }

        if (!isUnmountedRef.current && reconnectAttemptsRef.current < CONFIG.MAX_RECONNECT_ATTEMPTS) {
          const delay = Math.min(CONFIG.RECONNECT_DELAY * Math.pow(2, reconnectAttemptsRef.current), 10000);
          addLog(`Retry in ${delay}ms (#${reconnectAttemptsRef.current + 1})`);
          reconnectTimeoutRef.current = setTimeout(() => {
            if (!isUnmountedRef.current) {
              reconnectAttemptsRef.current++;
              connect();
            }
          }, delay);
        } else if (!isUnmountedRef.current) {
          addLog('Max retries reached');
        }
      };

      ws.onerror = () => {
        addLog('ERROR event');
        ws.close();
      };
    } catch (err) {
      addLog(`Create failed: ${err}`);
      setState('disconnected');
    }
  }, [getServerUrl, send, startPingPong, calculateOffset, addLog]);

  useEffect(() => {
    if (!roomCode) return;
    
    isUnmountedRef.current = false;
    reconnectAttemptsRef.current = 0;
    connect();

    const cleanup = () => {
      isUnmountedRef.current = true;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close(1000, 'Page unload');
        wsRef.current = null;
      }
    };

    window.addEventListener('beforeunload', cleanup);
    window.addEventListener('pagehide', cleanup);

    return () => {
      window.removeEventListener('beforeunload', cleanup);
      window.removeEventListener('pagehide', cleanup);
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomCode]);

  return {
    state,
    isConnected: state === 'connected',
    serverOffset,
    latestUpdate,
    send,
    logs
  };
}
