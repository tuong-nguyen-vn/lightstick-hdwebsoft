interface ConnectionStatusProps {
  isConnected: boolean;
  deviceCount: number;
}

export default function ConnectionStatus({ isConnected, deviceCount }: ConnectionStatusProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 p-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`}
          />
          <span className="text-sm text-slate-300">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-slate-400">
          <span>
            <span className="text-white font-medium">{deviceCount}</span> devices online
          </span>
        </div>
      </div>
    </div>
  );
}
