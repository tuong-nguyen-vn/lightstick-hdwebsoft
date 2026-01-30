import type { LightstickState } from '@lightstick/shared';
import { WS_EVENTS } from '@lightstick/shared';

export const SYNC_DELAY = 300;

export interface StateUpdateMessage {
  type: typeof WS_EVENTS.STATE_UPDATE;
  version: number;
  serverNow: number;
  startAt: number;
  state: LightstickState;
}

export interface PingMessage {
  type: 'PING';
  clientTime: number;
}

export interface PongMessage {
  type: 'PONG';
  clientTime: number;
  serverTime: number;
}

export interface RoomInfoMessage {
  type: 'ROOM_INFO';
  roomCode: string;
  viewerCount: number;
}

export interface ViewerCountMessage {
  type: 'VIEWER_COUNT';
  count: number;
}

export interface AdminCommandMessage {
  type: 'ADMIN_COMMAND';
  state: LightstickState;
}

export type ServerMessage = 
  | StateUpdateMessage 
  | PongMessage 
  | RoomInfoMessage 
  | ViewerCountMessage;

export type ClientMessage = 
  | PingMessage 
  | AdminCommandMessage;

export function createStateUpdateMessage(
  version: number,
  state: LightstickState,
  syncDelay: number = SYNC_DELAY
): StateUpdateMessage {
  const serverNow = Date.now();
  return {
    type: WS_EVENTS.STATE_UPDATE,
    version,
    serverNow,
    startAt: serverNow + syncDelay,
    state
  };
}

export function createPongMessage(clientTime: number): PongMessage {
  return {
    type: 'PONG',
    clientTime,
    serverTime: Date.now()
  };
}
