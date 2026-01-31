import { useState } from 'react';
import { useWebSocket, useScheduledState } from './hooks';
import ConnectionStatus from './components/ConnectionStatus';
import ColorDisplay from './components/ColorDisplay';
import PatternRenderer from './components/PatternRenderer';
import MarqueeText from './components/MarqueeText';
import IconDisplay from './components/IconDisplay';
import FullscreenPrompt from './components/FullscreenPrompt';

function getRoomCode(): string {
  const pathMatch = window.location.pathname.match(/\/viewer\/([^/]+)/);
  if (pathMatch) return pathMatch[1];
  return new URLSearchParams(window.location.search).get('room') || 'default';
}

const ROOM_CODE = getRoomCode();

export default function App() {
  const [isActivated, setIsActivated] = useState(false);
  const [showDebug, setShowDebug] = useState(true);
  const { state: connectionState, serverOffset, latestUpdate, logs } = useWebSocket(ROOM_CODE);
  const { currentState } = useScheduledState(latestUpdate, serverOffset);

  console.log('[App] latestUpdate:', latestUpdate, 'currentState:', currentState);

  const renderContent = () => {
    switch (currentState.mode) {
      case 'color':
        return <ColorDisplay color={currentState.color || '#000000'} />;
      case 'pattern':
        return currentState.pattern ? (
          <PatternRenderer 
            pattern={currentState.pattern}
            color={currentState.color || '#FFFFFF'}
            params={currentState.patternParams}
          />
        ) : null;
      case 'text':
        return (
          <MarqueeText
            text={currentState.text || ''}
            speed={currentState.textSpeed}
            textColor={currentState.color || '#FFFFFF'}
            backgroundColor={currentState.backgroundColor || '#000000'}
          />
        );
      case 'icon':
        return (
          <IconDisplay
            icon={currentState.icon || '🎉'}
            backgroundColor={currentState.backgroundColor}
          />
        );
      default:
        return <ColorDisplay color="#000000" />;
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {renderContent()}
      <ConnectionStatus state={connectionState} />
      {!isActivated && <FullscreenPrompt onActivated={() => setIsActivated(true)} />}
      
      {showDebug && (
        <div 
          className="absolute top-2 left-2 bg-black/90 text-white text-xs p-2 rounded max-w-[95vw] max-h-[60vh] overflow-auto z-50"
          onClick={() => setShowDebug(false)}
        >
          <div className="font-bold mb-1">Room: {ROOM_CODE} | WS: {connectionState}</div>
          <div>Offset: {serverOffset}ms | Ver: {latestUpdate?.version ?? '-'} | Mode: {currentState.mode}</div>
          <div className="border-t border-gray-600 mt-1 pt-1 font-mono text-[10px]">
            {logs.map((log, i) => (
              <div key={i} className="text-green-400">{log}</div>
            ))}
          </div>
          <div className="text-gray-500 mt-1">(tap to hide)</div>
        </div>
      )}
    </div>
  );
}
