import type { PatternParams } from '@lightstick/shared';

interface RainbowPatternProps {
  params: PatternParams;
}

export default function RainbowPattern({ params }: RainbowPatternProps) {
  const speed = params.speed || 3000;
  
  return (
    <div 
      className="absolute inset-0 w-full h-full"
      style={{
        background: 'linear-gradient(90deg, #ff0000, #ff8000, #ffff00, #00ff00, #00ffff, #0000ff, #8000ff, #ff00ff, #ff0000)',
        backgroundSize: '200% 100%',
        animation: `rainbow ${speed}ms linear infinite`
      }}
    />
  );
}
