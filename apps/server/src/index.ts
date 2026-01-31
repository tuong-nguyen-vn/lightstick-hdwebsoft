import Fastify from 'fastify';
import websocket from '@fastify/websocket';
import { PORTS } from '@lightstick/shared';
import { handleConnection } from './ws/handlers.js';
import { createRoom, getRoom, getAllRooms } from './ws/room-manager.js';
import { getRoomState } from './state/store.js';

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'lightstick-admin-secret';

const fastify = Fastify({
  logger: true
});

await fastify.register(websocket);

fastify.get('/health', async () => {
  return { status: 'ok', timestamp: Date.now() };
});

fastify.post('/api/rooms', async () => {
  const room = createRoom();
  return { roomCode: room.code };
});

fastify.get('/api/rooms', async (request, reply) => {
  const { key } = request.query as { key?: string };
  if (key !== ADMIN_SECRET) {
    reply.code(401);
    return { error: 'Unauthorized' };
  }
  
  const allRooms = getAllRooms();
  const roomList = Array.from(allRooms.values()).map(room => {
    const state = getRoomState(room.code);
    return {
      roomCode: room.code,
      connectionCount: room.connections.size,
      viewerCount: Array.from(room.connections.values()).filter(c => !c.isAdmin).length,
      hasAdmin: room.adminConnection !== null,
      createdAt: room.createdAt,
      lastUpdated: state?.lastUpdated || room.createdAt,
      currentMode: state?.state.mode || 'color',
    };
  });
  
  return { rooms: roomList };
});

fastify.get('/api/rooms/:roomCode', async (request, reply) => {
  const { roomCode } = request.params as { roomCode: string };
  const room = getRoom(roomCode);
  if (!room) {
    reply.code(404);
    return { error: 'Room not found' };
  }
  return {
    roomCode: room.code,
    connectionCount: room.connections.size,
    createdAt: room.createdAt
  };
});

fastify.get('/ws/:roomCode', { websocket: true }, (socket, request) => {
  const { roomCode } = request.params as { roomCode: string };
  console.log('[WS] New viewer connection to room:', roomCode);
  console.log('[WS] Socket type:', typeof socket, 'keys:', Object.keys(socket));
  console.log('[WS] Has readyState:', 'readyState' in socket, socket.readyState);
  handleConnection(socket, roomCode, false);
});

fastify.get('/ws/:roomCode/admin', { websocket: true }, (socket, request) => {
  const { roomCode } = request.params as { roomCode: string };
  const { key } = request.query as { key?: string };
  console.log('[WS] Admin connection attempt to room:', roomCode, 'key provided:', !!key);

  if (key !== ADMIN_SECRET) {
    console.log('[WS] Admin auth failed');
    socket.close(4001, 'Unauthorized');
    return;
  }

  console.log('[WS] Admin connected to room:', roomCode);
  handleConnection(socket, roomCode, true, key);
});

const start = async () => {
  try {
    await fastify.listen({ port: PORTS.SERVER, host: '0.0.0.0' });
    console.log(`Server running on port ${PORTS.SERVER}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
