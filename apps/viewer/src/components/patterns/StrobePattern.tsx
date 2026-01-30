import type { PatternParams } from '@lightstick/shared';

interface StrobePatternProps {
  color: string;
  params: PatternParams;
}

export default function StrobePattern({ color, params }: StrobePatternProps) {
  const speed = params.speed || 100;
  
  return (
    <div 
      className="absolute inset-0 w-full h-full"
      style={{
        backgroundColor: color,
        animation: `strobe ${speed}ms steps(1) infinite`
      }}
    />
  );
}
