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
  // Brand & Basic
  { id: 'hds-blue', label: 'HDS Blue', description: 'Màu thương hiệu', state: { mode: 'color', color: '#4A90D9' } },
  { id: 'blackout', label: 'Blackout', description: 'Tắt hết đèn', state: { mode: 'color', color: '#000000' } },
  { id: 'full-white', label: 'Full White', description: 'Sáng trắng', state: { mode: 'color', color: '#FFFFFF' } },
  
  // Mood scenes
  { id: 'chill', label: 'Chill', description: 'Thư giãn', state: { mode: 'pattern', pattern: 'pulse', color: '#4A90D9', patternParams: { speed: 2000 } } },
  { id: 'romantic', label: 'Romantic', description: 'Lãng mạn', state: { mode: 'pattern', pattern: 'pulse', color: '#FF69B4', patternParams: { speed: 1500 } } },
  { id: 'ocean', label: 'Ocean', description: 'Đại dương', state: { mode: 'pattern', pattern: 'pulse', color: '#00CED1', patternParams: { speed: 2500 } } },
  { id: 'sunset', label: 'Sunset', description: 'Hoàng hôn', state: { mode: 'pattern', pattern: 'pulse', color: '#FF6347', patternParams: { speed: 3000 } } },
  
  // Party scenes
  { id: 'party', label: 'Party', description: 'Tiệc tùng', state: { mode: 'pattern', pattern: 'rainbow', patternParams: { speed: 3000 } } },
  { id: 'disco', label: 'Disco', description: 'Sàn nhảy', state: { mode: 'pattern', pattern: 'rainbow', patternParams: { speed: 1000 } } },
  { id: 'rave', label: 'Rave', description: 'Cuồng nhiệt', state: { mode: 'pattern', pattern: 'rainbow', patternParams: { speed: 500 } } },
  
  // Hype scenes
  { id: 'hype', label: 'Hype', description: 'Cực máu', state: { mode: 'pattern', pattern: 'strobe', color: '#FFFFFF', patternParams: { speed: 100 } } },
  { id: 'warning', label: 'Warning', description: 'Cảnh báo', state: { mode: 'pattern', pattern: 'strobe', color: '#FFFF00', patternParams: { speed: 200 } } },
  { id: 'emergency', label: 'Emergency', description: 'Khẩn cấp', state: { mode: 'pattern', pattern: 'strobe', color: '#FF0000', patternParams: { speed: 150 } } },
  { id: 'police', label: 'Police', description: 'Đèn cảnh sát', state: { mode: 'pattern', pattern: 'strobe', color: '#0000FF', patternParams: { speed: 200 } } },
  
  // Event scenes
  { id: 'countdown', label: 'Countdown', description: 'Đếm ngược', state: { mode: 'pattern', pattern: 'blink', color: '#FF0000', patternParams: { speed: 300 } } },
  { id: 'applause', label: 'Applause', description: 'Vỗ tay', state: { mode: 'pattern', pattern: 'blink', color: '#FFD700', patternParams: { speed: 150 } } },
  { id: 'victory', label: 'Victory', description: 'Chiến thắng', state: { mode: 'pattern', pattern: 'blink', color: '#00FF00', patternParams: { speed: 200 } } },
  { id: 'heartbeat', label: 'Heartbeat', description: 'Nhịp tim', state: { mode: 'pattern', pattern: 'pulse', color: '#FF0000', patternParams: { speed: 800 } } },
  
  // Color solid scenes
  { id: 'fire-red', label: 'Fire Red', description: 'Đỏ lửa', state: { mode: 'color', color: '#FF0000' } },
  { id: 'lime-green', label: 'Lime Green', description: 'Xanh lá', state: { mode: 'color', color: '#00FF00' } },
  { id: 'electric-blue', label: 'Electric Blue', description: 'Xanh dương', state: { mode: 'color', color: '#0000FF' } },
  { id: 'royal-purple', label: 'Royal Purple', description: 'Tím hoàng gia', state: { mode: 'color', color: '#8000FF' } },
  { id: 'golden', label: 'Golden', description: 'Vàng kim', state: { mode: 'color', color: '#FFD700' } },
  { id: 'hot-pink', label: 'Hot Pink', description: 'Hồng nóng', state: { mode: 'color', color: '#FF1493' } },
];

export const ICON_PRESETS = ['🔥', '❤️', '⭐', '🎉', '👏', '🚀', '🌍', '💙'] as const;
