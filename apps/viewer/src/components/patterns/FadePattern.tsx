import { useState, useEffect, useMemo } from 'react';
import type { PatternParams } from '@lightstick/shared';

interface FadePatternProps {
  params: PatternParams;
}

export default function FadePattern({ params }: FadePatternProps) {
  const colors = useMemo(() => 
    params.colors && params.colors.length > 0 
      ? params.colors 
      : ['#ff0000', '#00ff00', '#0000ff'],
    [params.colors]
  );
  const speed = params.speed || 2000;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let animationFrame: number;
    let startTime: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const newProgress = Math.min(elapsed / speed, 1);
      
      setProgress(newProgress);
      
      if (newProgress >= 1) {
        setCurrentIndex(nextIndex);
        setNextIndex((nextIndex + 1) % colors.length);
        startTime = timestamp;
      }
      
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [colors.length, nextIndex, speed]);

  const currentColor = colors[currentIndex];
  const nextColor = colors[nextIndex];

  return (
    <div className="absolute inset-0 w-full h-full">
      <div 
        className="absolute inset-0"
        style={{ backgroundColor: currentColor }}
      />
      <div 
        className="absolute inset-0"
        style={{ 
          backgroundColor: nextColor,
          opacity: progress 
        }}
      />
    </div>
  );
}
