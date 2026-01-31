import type { LightstickState } from './types.js';

export const WS_EVENTS = {
  STATE_UPDATE: 'state_update',
  DEVICE_REGISTER: 'device_register',
  DEVICE_DISCONNECT: 'device_disconnect',
  ADMIN_COMMAND: 'admin_command',
  PING: 'ping',
  PONG: 'pong'
} as const;

export const DEFAULT_COLORS = [
  '#4A90D9', // HDS Blue (Brand Color)
  '#FF0000', // Red
  '#FF8000', // Orange
  '#FFFF00', // Yellow
  '#00FF00', // Green
  '#00FFFF', // Cyan
  '#0000FF', // Blue
  '#8000FF', // Purple
  '#FF00FF', // Magenta
  '#FFFFFF', // White
  '#FF69B4'  // Pink
] as const;

export const DEFAULT_STATE = {
  mode: 'color' as const,
  color: '#000000'
};

export const CONFIG = {
  MAX_DEVICES: 300,
  HEARTBEAT_INTERVAL: 30000,
  RECONNECT_DELAY: 1000,
  MAX_RECONNECT_ATTEMPTS: 5,
  STATE_VERSION_INITIAL: 0,
  TEXT_SPEED_MIN: 50,
  TEXT_SPEED_MAX: 6000,
  TEXT_SPEED_DEFAULT: 200,
  PATTERN_SPEED_MIN: 50,
  PATTERN_SPEED_MAX: 5000,
  SYNC_DELAY: 300, // ms - delay để đồng bộ tất cả devices
} as const;

export const PORTS = {
  SERVER: 3001,
  ADMIN: 3000,
  VIEWER: 3002
} as const;

export const YEP_PRESET_TEXTS = [
  'HDWEBSOFT', 'YEP 2026', 'GO HDS!', '1-2-3 YÔ!', '🔥🔥🔥'
] as const;

export interface ScenePreset {
  id: string;
  label: string;
  description?: string;
  state: LightstickState;
}

export const YEP_SCENES: ScenePreset[] = [
  { id: 'hds-blue', label: 'HDS Blue', state: { mode: 'color', color: '#4A90D9' } },
  { id: 'chill', label: 'Chill', state: { mode: 'pattern', pattern: 'pulse', color: '#4A90D9', patternParams: { speed: 2000 } } },
  { id: 'party', label: 'Party', state: { mode: 'pattern', pattern: 'rainbow', patternParams: { speed: 3000 } } },
  { id: 'hype', label: 'Hype', state: { mode: 'pattern', pattern: 'strobe', color: '#FFFFFF', patternParams: { speed: 100 } } },
  { id: 'countdown', label: 'Countdown', state: { mode: 'pattern', pattern: 'blink', color: '#FF0000', patternParams: { speed: 300 } } },
];

export const ICON_PRESETS = ['🔥', '❤️', '⭐', '🎉', '👏', '🚀', '🌍', '💙'] as const;
