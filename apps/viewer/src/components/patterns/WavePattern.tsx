import type { PatternParams } from '@lightstick/shared';

interface WavePatternProps {
  color: string;
  params: PatternParams;
}

export default function WavePattern({ color, params }: WavePatternProps) {
  const speed = params.speed || 1500;
  const intensity = params.intensity || 0.8;
  
  return (
    <div 
      className="absolute inset-0 w-full h-full"
      style={{
        backgroundColor: color,
        animation: `wave ${speed}ms ease-in-out infinite`,
        '--wave-intensity': intensity
      } as React.CSSProperties}
    />
  );
}
