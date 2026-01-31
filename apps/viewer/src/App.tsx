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
  const { state: connectionState, serverOffset, latestUpdate } = useWebSocket(ROOM_CODE);
  const { currentState } = useScheduledState(latestUpdate, serverOffset);

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
            size={currentState.textSize}
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
    </div>
  );
}
