type ConnectionState = 'disconnected' | 'connecting' | 'connected';

interface ConnectionStatusProps {
  state: ConnectionState;
}

export default function ConnectionStatus({ state }: ConnectionStatusProps) {
  const statusConfig = {
    connected: {
      color: 'bg-green-500',
      pulse: false
    },
    disconnected: {
      color: 'bg-red-500',
      pulse: true
    },
    connecting: {
      color: 'bg-yellow-500',
      pulse: true
    }
  };

  const config = statusConfig[state];

  return (
    <div className="fixed top-3 right-3 z-50">
      <div 
        className={`w-3 h-3 rounded-full ${config.color} ${config.pulse ? 'animate-pulse' : ''}`}
        title={state}
      />
    </div>
  );
}
