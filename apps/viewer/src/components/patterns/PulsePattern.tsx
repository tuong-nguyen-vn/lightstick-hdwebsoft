import type { PatternParams } from '@lightstick/shared';

interface PulsePatternProps {
  color: string;
  params: PatternParams;
}

export default function PulsePattern({ color, params }: PulsePatternProps) {
  const speed = params.speed || 1000;
  
  return (
    <div 
      className="absolute inset-0 w-full h-full"
      style={{
        backgroundColor: color,
        animation: `pulse ${speed}ms ease-in-out infinite`
      }}
    />
  );
}
