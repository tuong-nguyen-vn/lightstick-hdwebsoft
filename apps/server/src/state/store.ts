import type { LightstickState, StateUpdate } from '@lightstick/shared';
import { DEFAULT_STATE, CONFIG } from '@lightstick/shared';

export interface RoomState {
  version: number;
  state: LightstickState;
  lastUpdated: number;
}

const roomStates = new Map<string, RoomState>();

export function getOrCreateRoomState(roomCode: string): RoomState {
  let roomState = roomStates.get(roomCode);
  if (!roomState) {
    roomState = {
      version: CONFIG.STATE_VERSION_INITIAL,
      state: { ...DEFAULT_STATE },
      lastUpdated: Date.now()
    };
    roomStates.set(roomCode, roomState);
  }
  return roomState;
}

export function getRoomState(roomCode: string): RoomState | undefined {
  return roomStates.get(roomCode);
}

export function updateRoomState(roomCode: string, newState: LightstickState): RoomState {
  const current = getOrCreateRoomState(roomCode);
  current.version++;
  current.state = newState;
  current.lastUpdated = Date.now();
  return current;
}

export function deleteRoomState(roomCode: string): void {
  roomStates.delete(roomCode);
}

export function createStateUpdate(roomCode: string, syncDelay: number = 300): StateUpdate {
  const roomState = getOrCreateRoomState(roomCode);
  const serverNow = Date.now();
  return {
    version: roomState.version,
    serverNow,
    startAt: serverNow + syncDelay,
    state: roomState.state
  };
}
