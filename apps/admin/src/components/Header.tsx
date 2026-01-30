import { CONFIG } from '@lightstick/shared';
import type { RoomInfo } from '../App';

interface HeaderProps {
  roomInfo: RoomInfo | null;
  deviceCount: number;
}

export default function Header({ roomInfo, deviceCount }: HeaderProps) {
  return (
    <header className="bg-slate-800 border-b border-slate-700 p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Lightstick Admin</h1>
            {roomInfo && (
              <p className="text-sm text-slate-400">
                Room: <span className="text-primary-400 font-mono">{roomInfo.roomCode}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{deviceCount}</p>
            <p className="text-xs text-slate-400">
              / {CONFIG.MAX_DEVICES} devices
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
