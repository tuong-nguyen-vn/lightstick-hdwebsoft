import { useState, useEffect, useCallback } from 'react';
import type { LightstickState } from '@lightstick/shared';
import type { RoomInfo as RoomInfoType } from '../App';
import { createRoom } from '../api/rooms';
import { useAdminWebSocket } from '../hooks/useAdminWebSocket';
import ColorControl from './ColorControl';
import TextControl from './TextControl';
import PatternControl from './PatternControl';
import RoomInfo from './RoomInfo';

const ADMIN_KEY = 'lightstick-admin-secret';

interface ControlPanelProps {
  roomInfo: RoomInfoType | null;
  setRoomInfo: (info: RoomInfoType | null) => void;
  setDeviceCount: (count: number) => void;
  setIsConnected: (connected: boolean) => void;
}

function CreateRoomScreen({ onCreateRoom, isLoading }: { onCreateRoom: () => void; isLoading: boolean }) {
  return (
    <div className="max-w-4xl mx-auto">
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
    </div>
  );
}

type ControlTab = 'color' | 'text' | 'pattern';

interface ConnectedControlPanelProps {
  roomInfo: RoomInfoType;
  setDeviceCount: (count: number) => void;
  setIsConnected: (connected: boolean) => void;
}

function ConnectedControlPanel({
  roomInfo,
  setDeviceCount,
  setIsConnected,
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
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <RoomInfo roomInfo={roomInfo} deviceCount={deviceCount} />

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

  if (!roomInfo) {
    return (
      <>
        <CreateRoomScreen onCreateRoom={handleCreateRoom} isLoading={isLoading} />
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
    />
  );
}
