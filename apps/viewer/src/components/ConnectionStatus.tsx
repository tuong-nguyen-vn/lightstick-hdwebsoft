type ConnectionState = 'disconnected' | 'connecting' | 'connected';

interface ConnectionStatusProps {
  state: ConnectionState;
}

export default function ConnectionStatus({ state }: ConnectionStatusProps) {
  if (state === 'connected') {
    return null;
  }

  const statusConfig = {
    disconnected: {
      text: 'Disconnected',
      color: 'bg-red-500',
      pulse: false
    },
    connecting: {
      text: 'Connecting...',
      color: 'bg-yellow-500',
      pulse: true
    }
  };

  const config = statusConfig[state];

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-black/70 backdrop-blur-sm`}>
        <div 
          className={`w-3 h-3 rounded-full ${config.color} ${config.pulse ? 'animate-pulse' : ''}`} 
        />
        <span className="text-white text-sm font-medium">{config.text}</span>
      </div>
    </div>
  );
}
