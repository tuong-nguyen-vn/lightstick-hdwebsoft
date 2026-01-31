export interface CreateRoomResponse {
  roomCode: string;
}

export async function createRoom(): Promise<CreateRoomResponse> {
  const response = await fetch('/api/rooms', {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to create room');
  }

  return response.json();
}

export interface RoomInfoResponse {
  roomCode: string;
  connectionCount: number;
  createdAt: number;
}

export async function getRoomInfo(roomCode: string): Promise<RoomInfoResponse> {
  const response = await fetch(`/api/rooms/${roomCode}`);
  
  if (!response.ok) {
    throw new Error('Room not found');
  }

  return response.json();
}

export interface RoomListItem {
  roomCode: string;
  connectionCount: number;
  viewerCount: number;
  hasAdmin: boolean;
  createdAt: number;
  lastUpdated: number;
  currentMode: string;
}

export interface RoomListResponse {
  rooms: RoomListItem[];
}

export async function getRoomList(adminKey: string): Promise<RoomListResponse> {
  const response = await fetch(`/api/rooms?key=${encodeURIComponent(adminKey)}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch rooms');
  }

  return response.json();
}
