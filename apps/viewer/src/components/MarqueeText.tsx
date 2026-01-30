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

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;
    
    const containerWidth = containerRef.current.offsetWidth;
    const textWidth = textRef.current.offsetWidth;
    const totalDistance = containerWidth + textWidth;
    const calculatedDuration = totalDistance / (speed / 10);
    setDuration(Math.max(calculatedDuration, 1));
  }, [text, speed]);

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
      className="absolute inset-0 w-full h-full flex items-center overflow-hidden"
      style={{ backgroundColor }}
    >
      <div 
        ref={textRef}
        className="whitespace-nowrap text-[20vw] font-bold"
        style={{
          color: textColor,
          animation: `marquee ${duration}s linear infinite`,
          paddingLeft: '100%'
        }}
      >
        {text}
      </div>
    </div>
  );
}
