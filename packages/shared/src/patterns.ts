import type { PatternType, PatternParams } from './types.js';

export interface PatternDefinition {
  name: PatternType;
  displayName: string;
  description: string;
  defaultParams: PatternParams;
}

export const PATTERN_DEFINITIONS: Record<PatternType, PatternDefinition> = {
  blink: {
    name: 'blink',
    displayName: 'Blink',
    description: 'Simple on/off blinking effect',
    defaultParams: { speed: 500, intensity: 1 }
  },
  pulse: {
    name: 'pulse',
    displayName: 'Pulse',
    description: 'Smooth brightness pulsing',
    defaultParams: { speed: 1000, intensity: 1 }
  },
  fade: {
    name: 'fade',
    displayName: 'Fade',
    description: 'Gradual color transitions',
    defaultParams: { speed: 2000, colors: ['#ff0000', '#00ff00', '#0000ff'] }
  },
  rainbow: {
    name: 'rainbow',
    displayName: 'Rainbow',
    description: 'Cycling through rainbow colors',
    defaultParams: { speed: 3000, intensity: 1 }
  },
  wave: {
    name: 'wave',
    displayName: 'Wave',
    description: 'Wave-like brightness modulation',
    defaultParams: { speed: 1500, intensity: 0.8 }
  },
  strobe: {
    name: 'strobe',
    displayName: 'Strobe',
    description: 'Fast flashing strobe effect',
    defaultParams: { speed: 100, intensity: 1 }
  }
};

export const PATTERN_TYPES: PatternType[] = Object.keys(PATTERN_DEFINITIONS) as PatternType[];

export function getPatternDefinition(pattern: PatternType): PatternDefinition {
  return PATTERN_DEFINITIONS[pattern];
}

export function getDefaultPatternParams(pattern: PatternType): PatternParams {
  return { ...PATTERN_DEFINITIONS[pattern].defaultParams };
}
