import { useState, useCallback } from 'react';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import ConnectionStatus from './components/ConnectionStatus';

export interface RoomInfo {
  roomCode: string;
  adminKey: string;
}

const ROOM_STORAGE_KEY = 'lightstick-admin-room';

function loadRoomFromStorage(): RoomInfo | null {
  try {
    const stored = sessionStorage.getItem(ROOM_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function App() {
  const [roomInfo, setRoomInfoState] = useState<RoomInfo | null>(loadRoomFromStorage);
  const [deviceCount, setDeviceCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  const setRoomInfo = useCallback((info: RoomInfo | null) => {
    setRoomInfoState(info);
    if (info) {
      sessionStorage.setItem(ROOM_STORAGE_KEY, JSON.stringify(info));
    } else {
      sessionStorage.removeItem(ROOM_STORAGE_KEY);
    }
  }, []);

  return (
    <div className="min-h-full flex flex-col bg-slate-900">
      <Header roomInfo={roomInfo} deviceCount={deviceCount} />

      <main className="flex-1 p-4 pb-20">
        <ControlPanel
          roomInfo={roomInfo}
          setRoomInfo={setRoomInfo}
          setDeviceCount={setDeviceCount}
          setIsConnected={setIsConnected}
        />
      </main>

      <ConnectionStatus isConnected={isConnected} deviceCount={deviceCount} />
    </div>
  );
}

export default App;
