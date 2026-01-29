# Approach: Virtual Lightstick

## Tech Stack

| Layer | Technology | Reason |
|-------|------------|--------|
| Frontend | React + Vite + TypeScript | Fast build, simple setup |
| Styling | TailwindCSS | Rapid UI development |
| Real-time | WebSocket (ws library) | Native, low latency |
| Backend | Node.js + Fastify + TypeScript | Fast, lightweight |
| Rendering | CSS + Canvas | Simple effects = CSS, Complex = Canvas |
| Hosting | Fly.io / Render / Vercel | Easy deploy, WS support |

## Architecture

```
┌─────────────────┐         ┌──────────────────┐
│   Admin App     │         │   Viewer App     │
│  (Controller)   │         │   (Lightstick)   │
│                 │         │   x 300 devices  │
└────────┬────────┘         └────────┬─────────┘
         │                           │
         │ WebSocket                 │ WebSocket
         │                           │
         └───────────┬───────────────┘
                     │
           ┌─────────▼─────────┐
           │   WS Server       │
           │   (Broadcaster)   │
           │                   │
           │  - Current State  │
           │  - Version        │
           │  - Time Sync      │
           └───────────────────┘
```

## Core Concept: Time-Scheduled Commands

**Vấn đề**: Nếu server broadcast "apply now", mỗi client nhận ở thời điểm khác nhau → không đồng bộ.

**Giải pháp**: Server broadcast với `startAt` timestamp trong tương lai (~200-400ms). Tất cả clients apply cùng lúc dựa trên server time.

```typescript
interface StateUpdate {
  version: number;
  serverNow: number;      // Server timestamp khi gửi
  startAt: number;        // Server timestamp để apply (serverNow + 300ms)
  state: {
    mode: 'color' | 'text' | 'pattern';
    color?: string;       // #RRGGBB
    text?: string;        // Marquee text
    pattern?: PatternType;
    params?: PatternParams;
  }
}
```

## Features Breakdown

### 1. Solid Color Mode
- Full screen background color
- CSS `background-color` transition
- Admin: Color picker

### 2. Marquee Text Mode
- Scrolling text across screen
- CSS animation (`translateX`) hoặc Canvas
- Admin: Text input + speed control

### 3. Animation Patterns (Presets)
| Pattern | Description | Implementation |
|---------|-------------|----------------|
| Blink | On/off flashing | CSS animation |
| Pulse | Brightness fade in/out | CSS opacity animation |
| Fade | Color A → Color B | CSS transition |
| Rainbow | Cycle through colors | CSS/JS color rotation |
| Wave | Sequential brightness wave | Canvas + requestAnimationFrame |
| Strobe | Fast flash | CSS keyframes |

## Risk Assessment

| Component | Risk | Reason | Mitigation |
|-----------|------|--------|------------|
| WebSocket Server | LOW | 300 clients là nhỏ, single instance đủ | Heartbeat + reconnect logic |
| Time Sync | MEDIUM | Clock drift, network jitter | startAt scheduling + offset calc |
| Mobile Rendering | LOW | CSS animations well-supported | Test trên low-end devices |
| Screen Lock | MEDIUM | Auto-lock interrupt experience | Wake Lock API + user guide |
| No Auth | LOW | Room code trong URL đủ secure | Admin URL có secret key |

## Project Structure

```
lightstick-hdwebsoft/
├── apps/
│   ├── server/           # Fastify + WebSocket server
│   │   ├── src/
│   │   │   ├── ws/       # WebSocket handlers
│   │   │   ├── state/    # State management
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── admin/            # Admin control panel
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── App.tsx
│   │   └── package.json
│   │
│   └── viewer/           # Lightstick display
│       ├── src/
│       │   ├── components/
│       │   ├── effects/   # Color, Text, Patterns
│       │   ├── hooks/
│       │   └── App.tsx
│       └── package.json
│
├── packages/
│   └── shared/           # Shared types & constants
│       ├── src/
│       │   ├── types.ts
│       │   └── patterns.ts
│       └── package.json
│
├── package.json          # Workspace root (pnpm)
├── pnpm-workspace.yaml
└── turbo.json            # Turborepo config
```

## URL Structure

- **Viewer**: `https://lightstick.example.com/{roomCode}`
- **Admin**: `https://lightstick.example.com/admin/{roomCode}?key={secretKey}`

## Deployment Strategy

1. **Development**: Local with hot reload
2. **Production**: 
   - Server: Fly.io hoặc Render (single instance)
   - Static: Cùng server hoặc Vercel/Cloudflare

## MVP Scope

### Phase 1 (MVP)
- [x] WebSocket server với room support
- [x] Viewer: Solid color display
- [x] Admin: Color picker + send
- [x] Time sync protocol

### Phase 2
- [ ] Marquee text
- [ ] Basic patterns (blink, pulse, fade)

### Phase 3
- [ ] Advanced patterns (rainbow, wave)
- [ ] Pattern parameters UI
- [ ] Screen wake lock
