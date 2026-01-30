export const WS_EVENTS = {
  STATE_UPDATE: 'state_update',
  DEVICE_REGISTER: 'device_register',
  DEVICE_DISCONNECT: 'device_disconnect',
  ADMIN_COMMAND: 'admin_command',
  PING: 'ping',
  PONG: 'pong'
} as const;

export const DEFAULT_COLORS = [
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
  color: '#FFFFFF'
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
  PATTERN_SPEED_MAX: 5000
} as const;

export const PORTS = {
  SERVER: 3001,
  ADMIN: 3000,
  VIEWER: 3002
} as const;
