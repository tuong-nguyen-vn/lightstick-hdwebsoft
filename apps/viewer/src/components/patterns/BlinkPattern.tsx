import type { PatternParams } from '@lightstick/shared';

interface BlinkPatternProps {
  color: string;
  params: PatternParams;
}

export default function BlinkPattern({ color, params }: BlinkPatternProps) {
  const speed = params.speed || 500;
  
  return (
    <div 
      className="absolute inset-0 w-full h-full"
      style={{
        backgroundColor: color,
        animation: `blink ${speed}ms steps(1) infinite`
      }}
    />
  );
}
