export type PatternType = 'blink' | 'pulse' | 'fade' | 'rainbow' | 'wave' | 'strobe';

export interface PatternParams {
  speed?: number;
  colors?: string[];
  intensity?: number;
}

export interface LightstickState {
  mode: 'color' | 'text' | 'pattern' | 'icon';
  color?: string;
  backgroundColor?: string;
  text?: string;
  textSpeed?: number;
  pattern?: PatternType;
  patternParams?: PatternParams;
  icon?: string;
}

export interface StateUpdate {
  version: number;
  serverNow: number;
  startAt: number;
  state: LightstickState;
}

export interface DeviceInfo {
  id: string;
  connectedAt: number;
  lastSeen: number;
  userAgent?: string;
}

export interface AdminCommand {
  type: 'setColor' | 'setText' | 'setPattern' | 'sync';
  payload: LightstickState | null;
  timestamp: number;
}

export type WebSocketMessageType = 
  | 'state_update'
  | 'device_register'
  | 'device_disconnect'
  | 'admin_command'
  | 'ping'
  | 'pong';

export interface WebSocketMessage<T = unknown> {
  type: WebSocketMessageType;
  data: T;
  timestamp: number;
}
