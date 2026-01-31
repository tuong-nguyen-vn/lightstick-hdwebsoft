import { useRef, useEffect, useState } from 'react';

interface MarqueeTextProps {
  text: string;
  speed?: number;
  size?: number;
  textColor?: string;
  backgroundColor?: string;
}

export default function MarqueeText({ 
  text,
  speed = 200,
  size = 60,
  textColor = '#FFFFFF',
  backgroundColor = '#000000'
}: MarqueeTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [duration, setDuration] = useState(10);
  const [translateDistance, setTranslateDistance] = useState(0);
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
      setIsReady(false);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!textRef.current) return;
    
    const textWidth = textRef.current.offsetWidth;
    const gap = isPortrait ? window.innerHeight * 0.5 : window.innerWidth * 0.5;
    const distance = textWidth + gap;
    
    setTranslateDistance(distance);
    
    const calculatedDuration = distance / (speed / 10);
    setDuration(Math.max(calculatedDuration, 1));
    setIsReady(true);
  }, [text, speed, size, isPortrait]);

  if (!text) {
    return (
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ backgroundColor }}
      />
    );
  }

  const fontSize = isPortrait ? `${size}vw` : `${size / 3}vw`;
  const gap = isPortrait ? '50vh' : '50vw';

  if (isPortrait) {
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    return (
      <div 
        ref={containerRef}
        className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center"
        style={{ backgroundColor }}
      >
        <div 
          className="whitespace-nowrap font-bold"
          style={{
            color: textColor,
            fontSize,
            transform: `rotate(90deg) translateX(${screenHeight}px)`,
            animation: isReady ? `marquee-up ${duration}s linear infinite` : 'none',
          }}
        >
          <span ref={textRef}>{text}</span>
          <span style={{ marginLeft: gap }}>{text}</span>
        </div>
        
        <style>{`
          @keyframes marquee-up {
            0% { transform: rotate(90deg) translateX(${screenHeight}px); }
            100% { transform: rotate(90deg) translateX(${screenHeight - translateDistance}px); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden flex items-center"
      style={{ backgroundColor }}
    >
      <div 
        className="absolute whitespace-nowrap font-bold"
        style={{
          color: textColor,
          fontSize,
          left: 0,
          animation: isReady ? `marquee-left ${duration}s linear infinite` : 'none',
        }}
      >
        <span ref={textRef}>{text}</span>
        <span style={{ marginLeft: gap }}>{text}</span>
      </div>
      
      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-${translateDistance}px); }
        }
      `}</style>
    </div>
  );
}
