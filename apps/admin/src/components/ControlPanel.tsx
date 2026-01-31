import { useState, useEffect, useCallback } from 'react';
import type { LightstickState } from '@lightstick/shared';
import type { RoomInfo as RoomInfoType } from '../App';
import { createRoom, getRoomList, type RoomListItem } from '../api/rooms';
import { useAdminWebSocket } from '../hooks/useAdminWebSocket';
import ColorControl from './ColorControl';
import TextControl from './TextControl';
import PatternControl from './PatternControl';
import SceneControl from './SceneControl';
import IconControl from './IconControl';
import RoomInfo from './RoomInfo';
import PhonePreview from './PhonePreview';

const ADMIN_KEY = 'lightstick-admin-secret';

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'vừa xong';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  return `${Math.floor(hours / 24)} ngày trước`;
}

interface ControlPanelProps {
  roomInfo: RoomInfoType | null;
  setRoomInfo: (info: RoomInfoType | null) => void;
  setDeviceCount: (count: number) => void;
  setIsConnected: (connected: boolean) => void;
}

interface CreateRoomScreenProps {
  onCreateRoom: () => void;
  onJoinRoom: (roomCode: string) => void;
  isLoading: boolean;
}

function CreateRoomScreen({ onCreateRoom, onJoinRoom, isLoading }: CreateRoomScreenProps) {
  const [rooms, setRooms] = useState<RoomListItem[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await getRoomList(ADMIN_KEY);
        setRooms(response.rooms);
      } catch {
        // Ignore errors
      } finally {
        setIsLoadingRooms(false);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="bg-slate-800 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-primary-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Create a Room</h2>
        <p className="text-slate-400 mb-6">
          Start a new session to control lightsticks
        </p>
        <button
          onClick={onCreateRoom}
          disabled={isLoading}
          className="bg-primary-500 hover:bg-primary-600 disabled:bg-slate-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
        >
          {isLoading ? 'Creating...' : 'Create Room'}
        </button>
      </div>

      {rooms.length > 0 && (
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Existing Rooms
          </h3>
          <div className="space-y-2">
            {rooms.map((room) => (
              <button
                key={room.roomCode}
                onClick={() => onJoinRoom(room.roomCode)}
                className="w-full bg-slate-700 hover:bg-slate-600 rounded-lg p-4 text-left transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-white font-mono font-bold text-lg">{room.roomCode}</span>
                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
                      <span>{room.viewerCount} viewers</span>
                      <span>•</span>
                      <span className="capitalize">{room.currentMode}</span>
                      <span>•</span>
                      <span>{formatTimeAgo(room.lastUpdated)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {room.hasAdmin && (
                      <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded">
                        Admin active
                      </span>
                    )}
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {isLoadingRooms && (
        <div className="text-center text-slate-400">Loading rooms...</div>
      )}
    </div>
  );
}

type ControlTab = 'color' | 'text' | 'pattern' | 'scenes' | 'icon';

interface ConnectedControlPanelProps {
  roomInfo: RoomInfoType;
  setDeviceCount: (count: number) => void;
  setIsConnected: (connected: boolean) => void;
  onChangeRoom: () => void;
}

function ConnectedControlPanel({
  roomInfo,
  setDeviceCount,
  setIsConnected,
  onChangeRoom,
}: ConnectedControlPanelProps) {
  const [activeTab, setActiveTab] = useState<ControlTab>('color');
  
  const { isConnected, deviceCount, currentState, sendCommand } = useAdminWebSocket({
    roomCode: roomInfo.roomCode,
    adminKey: roomInfo.adminKey,
  });

  useEffect(() => {
    setIsConnected(isConnected);
  }, [isConnected, setIsConnected]);

  useEffect(() => {
    setDeviceCount(deviceCount);
  }, [deviceCount, setDeviceCount]);

  const handleSendState = useCallback((state: LightstickState) => {
    sendCommand(state);
  }, [sendCommand]);

  const tabs: { key: ControlTab; label: string; icon: JSX.Element }[] = [
    {
      key: 'color',
      label: 'Color',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
    {
      key: 'text',
      label: 'Text',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      ),
    },
    {
      key: 'pattern',
      label: 'Pattern',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      key: 'scenes',
      label: 'Scenes',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      key: 'icon',
      label: 'Icon',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex gap-8 justify-center">
      {/* Main controls */}
      <div className="max-w-4xl flex-1 space-y-4">
        <RoomInfo roomInfo={roomInfo} deviceCount={deviceCount} onChangeRoom={onChangeRoom} />

        <div className="bg-slate-800 rounded-xl p-2">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-primary-500 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'color' && (
          <ColorControl
            onApply={handleSendState}
            currentColor={currentState?.color}
          />
        )}

        {activeTab === 'text' && (
          <TextControl
            onApply={handleSendState}
            currentText={currentState?.text}
            currentSpeed={currentState?.textSpeed}
            currentColor={currentState?.color}
          />
        )}

        {activeTab === 'pattern' && (
          <PatternControl
            onApply={handleSendState}
            currentPattern={currentState?.pattern}
            currentParams={currentState?.patternParams}
          />
        )}

        {activeTab === 'scenes' && (
          <SceneControl onApply={handleSendState} />
        )}

        {activeTab === 'icon' && (
          <IconControl onApply={handleSendState} />
        )}
      </div>

      {/* Phone Preview - hidden on small screens */}
      <div className="hidden xl:block sticky top-4 h-fit">
        <PhonePreview state={currentState} />
      </div>
    </div>
  );
}

export default function ControlPanel({
  roomInfo,
  setRoomInfo,
  setDeviceCount,
  setIsConnected,
}: ControlPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateRoom = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await createRoom();
      setRoomInfo({
        roomCode: response.roomCode,
        adminKey: ADMIN_KEY,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create room');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRoom = (roomCode: string) => {
    setRoomInfo({
      roomCode,
      adminKey: ADMIN_KEY,
    });
  };

  const handleChangeRoom = () => {
    setRoomInfo(null);
  };

  if (!roomInfo) {
    return (
      <>
        <CreateRoomScreen 
          onCreateRoom={handleCreateRoom} 
          onJoinRoom={handleJoinRoom}
          isLoading={isLoading} 
        />
        {error && (
          <div className="max-w-4xl mx-auto mt-4">
            <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 text-red-300">
              {error}
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <ConnectedControlPanel
      roomInfo={roomInfo}
      setDeviceCount={setDeviceCount}
      setIsConnected={setIsConnected}
      onChangeRoom={handleChangeRoom}
    />
  );
}
