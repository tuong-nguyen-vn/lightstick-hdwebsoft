import { useMemo } from 'react';
import type { LightstickState, PatternParams } from '@lightstick/shared';
import { getDefaultPatternParams } from '@lightstick/shared';

interface PhonePreviewProps {
  state: LightstickState | null;
}

function ColorDisplay({ color }: { color: string }) {
  return (
    <div 
      className="absolute inset-0 w-full h-full transition-colors duration-300"
      style={{ backgroundColor: color }}
    />
  );
}

function PatternDisplay({ pattern, color, params }: { 
  pattern: string; 
  color: string;
  params?: PatternParams;
}) {
  const mergedParams = useMemo(() => ({ 
    ...getDefaultPatternParams(pattern as import('@lightstick/shared').PatternType), 
    ...params 
  }), [pattern, params]);
  const speed = mergedParams.speed || 500;

  if (pattern === 'blink') {
    return (
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundColor: color,
          animation: `blink ${speed}ms steps(1) infinite`,
        }}
      >
        <style>{`
          @keyframes blink {
            0%, 49% { opacity: 1; }
            50%, 100% { opacity: 0; }
          }
        `}</style>
      </div>
    );
  }

  if (pattern === 'pulse') {
    return (
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundColor: color,
          animation: `pulse ${speed}ms ease-in-out infinite`,
        }}
      >
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  if (pattern === 'strobe') {
    return (
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundColor: color,
          animation: `strobe ${speed}ms linear infinite`,
        }}
      >
        <style>{`
          @keyframes strobe {
            0%, 10% { opacity: 1; }
            11%, 100% { opacity: 0; }
          }
        `}</style>
      </div>
    );
  }

  if (pattern === 'rainbow') {
    return (
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet, red)',
          backgroundSize: '200% 100%',
          animation: `rainbow ${speed}ms linear infinite`,
        }}
      >
        <style>{`
          @keyframes rainbow {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
          }
        `}</style>
      </div>
    );
  }

  return <ColorDisplay color={color} />;
}

function MarqueeTextDisplay({ 
  text, 
  speed = 200, 
  size = 60,
  textColor = '#FFFFFF',
  backgroundColor = '#000000'
}: { 
  text: string; 
  speed?: number; 
  size?: number;
  textColor?: string;
  backgroundColor?: string;
}) {
  const duration = Math.max(10000 / speed, 2);
  const fontSize = `${(size / 60) * 6}rem`;

  if (!text) {
    return <div className="absolute inset-0 w-full h-full" style={{ backgroundColor }} />;
  }

  return (
    <div 
      className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center"
      style={{ backgroundColor }}
    >
      <div 
        className="whitespace-nowrap font-bold"
        style={{
          color: textColor,
          fontSize,
          transform: 'rotate(90deg)',
          animation: `marquee-vertical ${duration}s linear infinite`,
        }}
      >
        <span>{text}</span>
        <span style={{ marginLeft: '2rem' }}>{text}</span>
      </div>
      
      <style>{`
        @keyframes marquee-vertical {
          0% { transform: rotate(90deg) translateX(100%); }
          100% { transform: rotate(90deg) translateX(-100%); }
        }
      `}</style>
    </div>
  );
}

function IconDisplayPreview({ 
  icon, 
  backgroundColor = '#000000' 
}: { 
  icon: string;
  backgroundColor?: string;
}) {
  return (
    <div 
      className="absolute inset-0 w-full h-full flex items-center justify-center"
      style={{ backgroundColor }}
    >
      <span className="text-6xl animate-pulse">{icon}</span>
    </div>
  );
}

export default function PhonePreview({ state }: PhonePreviewProps) {
  const renderContent = () => {
    if (!state) {
      return <ColorDisplay color="#000000" />;
    }

    switch (state.mode) {
      case 'color':
        return <ColorDisplay color={state.color || '#000000'} />;
      case 'pattern':
        return state.pattern ? (
          <PatternDisplay 
            pattern={state.pattern}
            color={state.color || '#FFFFFF'}
            params={state.patternParams}
          />
        ) : <ColorDisplay color="#000000" />;
      case 'text':
        return (
          <MarqueeTextDisplay
            text={state.text || ''}
            speed={state.textSpeed}
            size={state.textSize}
            textColor={state.color || '#FFFFFF'}
            backgroundColor={state.backgroundColor || '#000000'}
          />
        );
      case 'icon':
        return (
          <IconDisplayPreview
            icon={state.icon || '🎉'}
            backgroundColor={state.backgroundColor}
          />
        );
      default:
        return <ColorDisplay color="#000000" />;
    }
  };

  return (
    <div className="hidden xl:flex flex-col items-center">
      <p className="text-sm text-slate-400 mb-3">Live Preview</p>
      
      <div className="relative">
        {/* Phone frame */}
        <div className="relative w-[200px] h-[420px] bg-slate-900 rounded-[2.5rem] p-2 shadow-2xl border-4 border-slate-700">
          {/* Notch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 bg-slate-800 rounded-full z-10" />
          
          {/* Screen */}
          <div className="relative w-full h-full bg-black rounded-[2rem] overflow-hidden">
            {renderContent()}
          </div>
          
          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-slate-600 rounded-full" />
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-3 text-center max-w-[200px]">
        Xem trước hiệu ứng trên điện thoại người dùng
      </p>
    </div>
  );
}
