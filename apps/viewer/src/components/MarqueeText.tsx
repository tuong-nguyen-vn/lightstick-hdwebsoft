import { useRef, useEffect, useState } from 'react';

interface MarqueeTextProps {
  text: string;
  speed?: number;
  textColor?: string;
  backgroundColor?: string;
}

export default function MarqueeText({ 
  text,
  speed = 200,
  textColor = '#FFFFFF',
  backgroundColor = '#000000'
}: MarqueeTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(10);
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;
    
    const containerSize = isPortrait 
      ? containerRef.current.offsetHeight 
      : containerRef.current.offsetWidth;
    const textSize = isPortrait
      ? textRef.current.offsetHeight
      : textRef.current.offsetWidth;
    const totalDistance = containerSize + textSize;
    const calculatedDuration = totalDistance / (speed / 10);
    setDuration(Math.max(calculatedDuration, 1));
  }, [text, speed, isPortrait]);

  if (!text) {
    return (
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ backgroundColor }}
      />
    );
  }

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden"
      style={{ backgroundColor }}
    >
      <div 
        ref={textRef}
        className="whitespace-nowrap font-bold absolute"
        style={{
          color: textColor,
          fontSize: isPortrait ? '20vh' : '20vw',
          animation: `${isPortrait ? 'marquee-vertical' : 'marquee-horizontal'} ${duration}s linear infinite`,
          ...(isPortrait ? {
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            transform: 'rotate(180deg)',
            right: '50%',
            translateX: '50%',
            top: '100%',
          } : {
            top: '50%',
            transform: 'translateY(-50%)',
            left: '100%',
          })
        }}
      >
        {text}
      </div>
      
      <style>{`
        @keyframes marquee-horizontal {
          0% { left: 100%; }
          100% { left: -100%; }
        }
        @keyframes marquee-vertical {
          0% { top: 100%; }
          100% { top: -100%; }
        }
      `}</style>
    </div>
  );
}
