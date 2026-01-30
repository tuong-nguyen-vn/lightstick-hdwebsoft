import type { WebSocket } from 'ws';
import { createPongMessage, type PongMessage } from './protocol.js';

export const SYNC_DELAY = 300;

export function handlePing(socket: WebSocket, clientTime: number): void {
  const pongMessage = createPongMessage(clientTime);
  sendPong(socket, pongMessage);
}

export function sendPong(socket: WebSocket, message: PongMessage): void {
  if (socket.readyState === 1) {
    try {
      socket.send(JSON.stringify(message));
    } catch {
      // Socket might be closing
    }
  }
}

export function calculateStartTime(syncDelay: number = SYNC_DELAY): {
  serverNow: number;
  startAt: number;
} {
  const serverNow = Date.now();
  return {
    serverNow,
    startAt: serverNow + syncDelay
  };
}

export function getServerTimestamp(): number {
  return Date.now();
}
