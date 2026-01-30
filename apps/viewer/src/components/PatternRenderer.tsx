import type { PatternType, PatternParams } from '@lightstick/shared';
import { getDefaultPatternParams } from '@lightstick/shared';
import {
  BlinkPattern,
  PulsePattern,
  FadePattern,
  RainbowPattern,
  StrobePattern,
  WavePattern
} from './patterns';

interface PatternRendererProps {
  pattern: PatternType;
  color: string;
  params?: PatternParams;
}

export default function PatternRenderer({ 
  pattern, 
  color,
  params 
}: PatternRendererProps) {
  const mergedParams = { ...getDefaultPatternParams(pattern), ...params };

  switch (pattern) {
    case 'blink':
      return <BlinkPattern color={color} params={mergedParams} />;
    case 'pulse':
      return <PulsePattern color={color} params={mergedParams} />;
    case 'fade':
      return <FadePattern params={mergedParams} />;
    case 'rainbow':
      return <RainbowPattern params={mergedParams} />;
    case 'strobe':
      return <StrobePattern color={color} params={mergedParams} />;
    case 'wave':
      return <WavePattern color={color} params={mergedParams} />;
    default:
      return <div className="absolute inset-0 bg-black" />;
  }
}
