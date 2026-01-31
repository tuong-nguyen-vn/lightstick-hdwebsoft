import type { WebSocket } from 'ws';
import type { LightstickState } from '@lightstick/shared';
import { WS_EVENTS } from '@lightstick/shared';
import {
  type Room,
  type Connection,
  getOrCreateRoom,
  addConnection,
  removeConnection,
  broadcastToViewers,
  getViewerCount
} from './room-manager.js';
import { updateRoomState, getOrCreateRoomState } from '../state/store.js';
import { 
  createStateUpdateMessage, 
  createPongMessage,
  SYNC_DELAY,
  type StateUpdateMessage,
  type PongMessage
} from './protocol.js';
import { handlePing } from './time-sync.js';

const HEARTBEAT_INTERVAL = 20000;

function generateConnectionId(): string {
  return `conn_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

interface ClientMessage {
  type: string;
  data?: LightstickState;
  clientTime?: number;
}

export function handleConnection(
  socket: WebSocket,
  roomCode: string,
  isAdmin: boolean,
  adminKey?: string
): void {
  const room = getOrCreateRoom(roomCode);
  const connectionId = generateConnectionId();

  const connection: Connection = {
    socket,
    id: connectionId,
    isAdmin,
    connectedAt: Date.now(),
    lastPing: Date.now()
  };

  addConnection(room, connection);

  const roomState = getOrCreateRoomState(roomCode);
  const stateUpdate = createStateUpdateMessage(roomState.version, roomState.state, SYNC_DELAY);
  console.log('[WS] Sending initial state to new viewer:', JSON.stringify(stateUpdate));
  sendStateUpdate(socket, stateUpdate);

  if (isAdmin) {
    sendMessage(socket, 'room_info', {
      roomCode: room.code,
      viewerCount: getViewerCount(room)
    });
  }

  const heartbeatInterval = setInterval(() => {
    if (socket.readyState === 1) {
      const now = Date.now();
      if (now - connection.lastPing > HEARTBEAT_INTERVAL * 2) {
        socket.close(1000, 'Heartbeat timeout');
        return;
      }
      sendMessage(socket, WS_EVENTS.PING, { serverTime: now });
    }
  }, HEARTBEAT_INTERVAL);

  socket.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString()) as ClientMessage;
      handleMessage(room, connection, message);
    } catch {
      // Invalid JSON, ignore
    }
  });

  socket.on('close', () => {
    clearInterval(heartbeatInterval);
    removeConnection(room, connectionId);
    
    if (room.adminConnection) {
      sendMessage(room.adminConnection.socket, 'viewer_count', {
        count: getViewerCount(room)
      });
    }
  });

  socket.on('error', () => {
    clearInterval(heartbeatInterval);
    removeConnection(room, connectionId);
  });

  if (!isAdmin && room.adminConnection) {
    const count = getViewerCount(room);
    console.log('[WS] Notifying admin of viewer count:', count);
    sendMessage(room.adminConnection.socket, 'viewer_count', {
      count
    });
  } else if (!isAdmin) {
    console.log('[WS] No admin connected to room:', roomCode);
  }
}

function handleMessage(room: Room, connection: Connection, message: ClientMessage): void {
  connection.lastPing = Date.now();

  switch (message.type) {
    case 'PING':
    case WS_EVENTS.PING:
      if (message.clientTime !== undefined) {
        const pongMessage = createPongMessage(message.clientTime);
        sendPong(connection.socket, pongMessage);
      }
      break;

    case WS_EVENTS.PONG:
      break;

    case 'ADMIN_COMMAND':
    case WS_EVENTS.ADMIN_COMMAND:
      console.log('[WS] ADMIN_COMMAND received, isAdmin:', connection.isAdmin, 'data:', message.data);
      if (connection.isAdmin && message.data) {
        handleAdminCommand(room, message.data);
      }
      break;

    default:
      break;
  }
}

function handleAdminCommand(room: Room, newState: LightstickState): void {
  const roomState = updateRoomState(room.code, newState);
  const stateUpdate = createStateUpdateMessage(roomState.version, roomState.state, SYNC_DELAY);
  const messageStr = JSON.stringify(stateUpdate);
  console.log('[WS] Broadcasting to viewers in room:', room.code, 'viewerCount:', getViewerCount(room));
  broadcastToViewers(room, messageStr);
}

function sendStateUpdate(socket: WebSocket, message: StateUpdateMessage): void {
  if (socket.readyState === 1) {
    try {
      socket.send(JSON.stringify(message));
    } catch {
      // Socket might be closing
    }
  }
}

function sendPong(socket: WebSocket, message: PongMessage): void {
  if (socket.readyState === 1) {
    try {
      socket.send(JSON.stringify(message));
    } catch {
      // Socket might be closing
    }
  }
}

function sendMessage(socket: WebSocket, type: string, data: unknown): void {
  if (socket.readyState === 1) {
    try {
      socket.send(JSON.stringify({
        type,
        data,
        timestamp: Date.now()
      }));
    } catch {
      // Socket might be closing
    }
  }
}

export { SYNC_DELAY };
