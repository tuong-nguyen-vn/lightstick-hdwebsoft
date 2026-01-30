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
