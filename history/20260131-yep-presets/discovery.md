# Discovery Report: YEP 2026 Presets & Icon Mode

## Context
- Sự kiện YEP cuối năm HDWEBSOFT 2026
- ~200 viewers dự kiến
- Màu brand: `#4A90D9` (xanh dương)

## Architecture Snapshot

### Monorepo Structure
```
apps/
├── admin/      # React + Vite - Control panel (port 5174)
├── viewer/     # React + Vite - Lightstick display (port 5173)
└── server/     # Fastify + WebSocket (port 3001)
packages/
└── shared/     # Types, constants, patterns
```

### Key Files
| File | Role |
|------|------|
| `packages/shared/src/types.ts` | LightstickState interface |
| `packages/shared/src/constants.ts` | DEFAULT_COLORS, CONFIG |
| `apps/admin/src/components/ControlPanel.tsx` | Main admin UI |
| `apps/admin/src/components/TextControl.tsx` | Text mode với saved texts |
| `apps/viewer/src/App.tsx` | Mode switch rendering |

## Existing Patterns

### 1. DEFAULT_COLORS Array
```typescript
// packages/shared/src/constants.ts
export const DEFAULT_COLORS = [
  '#FF0000', '#FF8000', '#FFFF00', '#00FF00', '#00FFFF',
  '#0000FF', '#8000FF', '#FF00FF', '#FFFFFF', '#FF69B4'
] as const;
```
**Pattern**: Thêm màu mới = thêm vào array, tự động render trong UI.

### 2. localStorage Saved Texts
```typescript
// TextControl.tsx
const STORAGE_KEY = 'lightstick-saved-texts';
const loadSavedTexts = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
const saveSavedTexts = (texts) => localStorage.setItem(STORAGE_KEY, JSON.stringify(texts));
```
**Pattern**: Load trong useEffect, save sau mỗi update.

### 3. Mode Switching (ControlPanel)
```typescript
type ControlTab = 'color' | 'text' | 'pattern';
const [activeTab, setActiveTab] = useState<ControlTab>('color');
// Conditional rendering per tab
```

### 4. LightstickState Modes
```typescript
export interface LightstickState {
  mode: 'color' | 'text' | 'pattern';
  color?: string;
  backgroundColor?: string;
  text?: string;
  textSpeed?: number;
  pattern?: PatternType;
  patternParams?: PatternParams;
}
```

## Technical Constraints
- Node: v20 (from .nvmrc)
- Package manager: pnpm
- Build: Turborepo
- Styling: Tailwind CSS
- WebSocket: Fastify WebSocket

## Feature Requirements

### F1: Thêm Brand Color
- Thêm `#4A90D9` vào đầu DEFAULT_COLORS
- File touch: `packages/shared/src/constants.ts`
- Risk: LOW

### F2: Preset Texts
- Thêm default texts cho YEP: `HDWEBSOFT`, `YEP 2026`, `GO HDS!`, etc.
- Follow pattern của saved texts nhưng là built-in
- File touch: `apps/admin/src/components/TextControl.tsx`
- Risk: LOW

### F3: Preset Scenes
- Bundle: color + pattern + speed + optional text
- 1-click apply từ admin
- New component: `SceneControl.tsx`
- Files touch: `packages/shared/src/constants.ts`, admin components
- Risk: MEDIUM (new feature pattern)

### F4: Icon Mode
- Hiển thị emoji lớn trên viewer
- New mode trong LightstickState
- Files touch:
  - `packages/shared/src/types.ts` - add 'icon' mode
  - `apps/viewer/src/components/IconDisplay.tsx` - NEW
  - `apps/viewer/src/App.tsx` - add case
  - `apps/admin/src/components/IconControl.tsx` - NEW
  - `apps/admin/src/components/ControlPanel.tsx` - add tab
- Risk: MEDIUM (new mode type)

## Dependency Graph

```
F1 (brand color) ─────────────────────────────┐
                                              ↓
F3 (preset scenes) ←── depends on F1 colors ──┘
                                              
F2 (preset texts) ─── independent ────────────

F4 (icon mode) ─── independent ───────────────
   └── shared/types.ts (first)
   └── viewer/IconDisplay.tsx + App.tsx
   └── admin/IconControl.tsx + ControlPanel.tsx
```
