import { useCallback, useEffect, useRef, useState } from 'react';
import type { LightstickState, StateUpdate } from '@lightstick/shared';
import { WS_EVENTS, CONFIG } from '@lightstick/shared';

interface WebSocketMessage {
  type: string;
  data: unknown;
  timestamp: number;
}

interface UseAdminWebSocketOptions {
  roomCode: string;
  adminKey: string;
  onStateUpdate?: (state: StateUpdate) => void;
}

interface UseAdminWebSocketReturn {
  isConnected: boolean;
  deviceCount: number;
  currentState: LightstickState | null;
  sendCommand: (state: LightstickState) => void;
  disconnect: () => void;
}

export function useAdminWebSocket({
  roomCode,
  adminKey,
  onStateUpdate,
}: UseAdminWebSocketOptions): UseAdminWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [deviceCount, setDeviceCount] = useState(0);
  const [currentState, setCurrentState] = useState<LightstickState | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout>>();

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws/${roomCode}/admin?key=${encodeURIComponent(adminKey)}`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      reconnectAttempts.current = 0;
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as WebSocketMessage;
        handleMessage(message);
      } catch {
        // Invalid message
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      wsRef.current = null;

      if (reconnectAttempts.current < CONFIG.MAX_RECONNECT_ATTEMPTS) {
        const delay = CONFIG.RECONNECT_DELAY * Math.pow(2, reconnectAttempts.current);
        reconnectAttempts.current++;
        reconnectTimeout.current = setTimeout(connect, delay);
      }
    };

    ws.onerror = () => {
      ws.close();
    };
  }, [roomCode, adminKey]);

  const handleMessage = useCallback((message: WebSocketMessage) => {
    switch (message.type) {
      case WS_EVENTS.STATE_UPDATE: {
        const stateUpdate = message.data as StateUpdate;
        setCurrentState(stateUpdate.state);
        onStateUpdate?.(stateUpdate);
        break;
      }

      case 'room_info': {
        const data = message.data as { roomCode: string; viewerCount: number };
        setDeviceCount(data.viewerCount);
        break;
      }

      case 'viewer_count': {
        const data = message.data as { count: number };
        setDeviceCount(data.count);
        break;
      }

      case WS_EVENTS.PING: {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: WS_EVENTS.PONG,
            clientTime: (message.data as { serverTime: number }).serverTime,
            timestamp: Date.now(),
          }));
        }
        break;
      }
    }
  }, [onStateUpdate]);

  const sendCommand = useCallback((state: LightstickState) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: WS_EVENTS.ADMIN_COMMAND,
        data: state,
        timestamp: Date.now(),
      }));
      setCurrentState(state);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
    }
    reconnectAttempts.current = CONFIG.MAX_RECONNECT_ATTEMPTS;
    wsRef.current?.close();
    wsRef.current = null;
    setIsConnected(false);
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      wsRef.current?.close();
    };
  }, [connect]);

  return {
    isConnected,
    deviceCount,
    currentState,
    sendCommand,
    disconnect,
  };
}
