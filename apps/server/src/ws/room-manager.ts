import type { WebSocket } from 'ws';
import { deleteRoomState } from '../state/store.js';

export interface Connection {
  socket: WebSocket;
  id: string;
  isAdmin: boolean;
  connectedAt: number;
  lastPing: number;
}

export interface Room {
  code: string;
  connections: Map<string, Connection>;
  adminConnection: Connection | null;
  createdAt: number;
}

const rooms = new Map<string, Room>();
const ROOM_CODE_LENGTH = 6;
const ROOM_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateRoomCode(): string {
  let code = '';
  for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
    code += ROOM_CODE_CHARS.charAt(Math.floor(Math.random() * ROOM_CODE_CHARS.length));
  }
  return code;
}

export function createRoom(): Room {
  let code: string;
  do {
    code = generateRoomCode();
  } while (rooms.has(code));

  const room: Room = {
    code,
    connections: new Map(),
    adminConnection: null,
    createdAt: Date.now()
  };
  rooms.set(code, room);
  return room;
}

export function getRoom(code: string): Room | undefined {
  return rooms.get(code.toUpperCase());
}

export function getOrCreateRoom(code: string): Room {
  const upperCode = code.toUpperCase();
  let room = rooms.get(upperCode);
  if (!room) {
    room = {
      code: upperCode,
      connections: new Map(),
      adminConnection: null,
      createdAt: Date.now()
    };
    rooms.set(upperCode, room);
  }
  return room;
}

export function addConnection(room: Room, connection: Connection): void {
  room.connections.set(connection.id, connection);
  if (connection.isAdmin) {
    room.adminConnection = connection;
  }
}

export function removeConnection(room: Room, connectionId: string): void {
  const connection = room.connections.get(connectionId);
  if (connection) {
    room.connections.delete(connectionId);
    if (connection.isAdmin && room.adminConnection?.id === connectionId) {
      room.adminConnection = null;
    }
  }
}

export function cleanupRoom(code: string): void {
  rooms.delete(code);
  deleteRoomState(code);
}

export function getConnectionCount(room: Room): number {
  return room.connections.size;
}

export function getViewerCount(room: Room): number {
  let count = 0;
  for (const conn of room.connections.values()) {
    if (!conn.isAdmin) count++;
  }
  return count;
}

export function broadcastToRoom(room: Room, message: string, excludeId?: string): void {
  for (const [id, conn] of room.connections) {
    if (id !== excludeId && conn.socket.readyState === 1) {
      try {
        conn.socket.send(message);
      } catch {
        // Connection might be closing
      }
    }
  }
}

export function broadcastToViewers(room: Room, message: string): void {
  const viewers = Array.from(room.connections.values())
    .filter(conn => !conn.isAdmin && conn.socket.readyState === 1);
  
  viewers.forEach(conn => {
    try {
      conn.socket.send(message);
    } catch {
      // Connection might be closing
    }
  });
  
  console.log('[WS] Broadcast to', viewers.length, 'viewers');
}

export function getAllRooms(): Map<string, Room> {
  return rooms;
}
