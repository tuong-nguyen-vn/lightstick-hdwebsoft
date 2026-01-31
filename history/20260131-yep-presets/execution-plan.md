# Execution Plan: YEP 2026 Presets & Icon Mode

**Epic**: YEP-2026-Presets  
**Generated**: 2026-01-31  
**Total Effort**: ~8-12 hours

---

## Tracks Overview

| Track | Agent | Beads | File Scope | Effort |
|-------|-------|-------|------------|--------|
| 1 | BlueLake | T1-1, T1-2 | `packages/shared/**` | 2h |
| 2 | GreenCastle | T2-1, T2-2, T2-3 | `apps/admin/**` | 4-6h |
| 3 | RedStone | T3-1, T3-2 | `apps/viewer/**` | 2-3h |

---

## Track 1: BlueLake - Shared Constants & Types

**File scope**: `packages/shared/**`

### T1-1: Add Brand Color + YEP Presets Constants
**Priority**: P0 (blocking)  
**Files**: `packages/shared/src/constants.ts`

**Tasks**:
1. Thêm `'#4A90D9'` vào đầu `DEFAULT_COLORS`
2. Thêm `YEP_PRESET_TEXTS` array:
   ```typescript
   export const YEP_PRESET_TEXTS = [
     'HDWEBSOFT', 'YEP 2026', 'GO HDS!', '1-2-3 YÔ!', '🔥🔥🔥'
   ] as const;
   ```
3. Thêm `ScenePreset` interface và `YEP_SCENES`:
   ```typescript
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
   ```
4. Thêm `ICON_PRESETS`:
   ```typescript
   export const ICON_PRESETS = ['🔥', '❤️', '⭐', '🎉', '👏', '🚀', '🌍', '💙'] as const;
   ```

**Acceptance Criteria**:
- [ ] TypeScript compiles without error
- [ ] Brand color là item đầu tiên trong DEFAULT_COLORS

---

### T1-2: Extend LightstickState with Icon Mode
**Priority**: P0 (blocking for T3)  
**Files**: `packages/shared/src/types.ts`

**Tasks**:
1. Extend mode union:
   ```typescript
   mode: 'color' | 'text' | 'pattern' | 'icon';
   ```
2. Add icon field:
   ```typescript
   icon?: string;
   ```
3. Update `AdminCommand.type` nếu cần (optional, có thể skip nếu forward toàn bộ state)

**Acceptance Criteria**:
- [ ] TypeScript compiles
- [ ] `mode: 'icon'` valid trong LightstickState

---

## Track 2: GreenCastle - Admin UI Components

**File scope**: `apps/admin/**`  
**Depends on**: Track 1 complete

### T2-1: Update TextControl with Preset Texts
**Priority**: P1  
**Files**: `apps/admin/src/components/TextControl.tsx`

**Tasks**:
1. Import `YEP_PRESET_TEXTS` từ shared
2. Thêm section "Preset texts (YEP)" phía trên "Saved texts"
3. Render preset texts như clickable chips
4. onClick → `setText(preset)`

**UI Design**:
```
┌─────────────────────────────────┐
│ Message Text              [Save]│
├─────────────────────────────────┤
│ Preset texts (YEP)              │
│ [HDWEBSOFT] [YEP 2026] [GO HDS!]│
│ [1-2-3 YÔ!] [🔥🔥🔥]            │
├─────────────────────────────────┤
│ Saved texts                     │
│ [user saved 1] [user saved 2]   │
└─────────────────────────────────┘
```

**Acceptance Criteria**:
- [ ] Preset texts hiển thị
- [ ] Click preset → fill vào textarea
- [ ] Không trùng với saved texts logic

---

### T2-2: Create SceneControl Component
**Priority**: P1  
**Files**: `apps/admin/src/components/SceneControl.tsx` (NEW)

**Tasks**:
1. Create component với props `{ onApply: (state: LightstickState) => void }`
2. Import `YEP_SCENES` từ shared
3. Render grid of scene cards/buttons
4. Mỗi card hiển thị: label, icon/color preview, description
5. onClick → `onApply(scene.state)`

**UI Design**:
```
┌─────────────────────────────────┐
│ 🎬 Scenes                       │
├─────────────────────────────────┤
│ ┌───────┐ ┌───────┐ ┌───────┐  │
│ │HDS    │ │Chill  │ │Party  │  │
│ │Blue   │ │🔵pulse│ │🌈     │  │
│ └───────┘ └───────┘ └───────┘  │
│ ┌───────┐ ┌───────┐            │
│ │Hype   │ │Count  │            │
│ │⚡strobe│ │down🔴 │            │
│ └───────┘ └───────┘            │
└─────────────────────────────────┘
```

**Acceptance Criteria**:
- [ ] All YEP_SCENES render
- [ ] Click applies correct state
- [ ] Visual feedback on click

---

### T2-3: Create IconControl + Update ControlPanel
**Priority**: P1  
**Files**: 
- `apps/admin/src/components/IconControl.tsx` (NEW)
- `apps/admin/src/components/ControlPanel.tsx`

**Tasks (IconControl)**:
1. Create component với props `{ onApply }`
2. Import `ICON_PRESETS` từ shared
3. Render emoji grid (large buttons)
4. Background color picker (reuse pattern từ TextControl)
5. Custom emoji input (maxLength=4)
6. Apply button

**Tasks (ControlPanel)**:
1. Extend `ControlTab`: `'color' | 'text' | 'pattern' | 'scenes' | 'icon'`
2. Add tabs for 'scenes' và 'icon'
3. Import và render `SceneControl`, `IconControl`

**UI Design (IconControl)**:
```
┌─────────────────────────────────┐
│ 😀 Icon Mode                    │
├─────────────────────────────────┤
│ Quick Icons:                    │
│ [🔥] [❤️] [⭐] [🎉]             │
│ [👏] [🚀] [🌍] [💙]             │
├─────────────────────────────────┤
│ Custom: [____] (max 4 chars)    │
│ Background: [color picker]      │
├─────────────────────────────────┤
│ Preview: 🔥 (large)             │
├─────────────────────────────────┤
│ [        Apply Icon        ]    │
└─────────────────────────────────┘
```

**Acceptance Criteria**:
- [ ] IconControl renders all preset icons
- [ ] Custom emoji input works
- [ ] Background color selectable
- [ ] ControlPanel shows 5 tabs
- [ ] All tabs functional

---

## Track 3: RedStone - Viewer Components

**File scope**: `apps/viewer/**`  
**Depends on**: T1-2 complete

### T3-1: Create IconDisplay Component
**Priority**: P1  
**Files**: `apps/viewer/src/components/IconDisplay.tsx` (NEW)

**Tasks**:
1. Create component với props `{ icon: string, backgroundColor?: string }`
2. Full viewport container với background color
3. Center emoji với responsive font-size (`30vmin` hoặc `text-[25vw]`)
4. Optional: subtle animation (pulse/scale)

**Style**:
```css
.icon-display {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  font-size: 30vmin;
  line-height: 1;
}
```

**Acceptance Criteria**:
- [ ] Emoji renders centered
- [ ] Responsive sizing (không bị cắt)
- [ ] Background color applies

---

### T3-2: Update App.tsx for Icon Mode
**Priority**: P1  
**Files**: `apps/viewer/src/App.tsx`

**Tasks**:
1. Import `IconDisplay`
2. Add case trong render switch:
   ```typescript
   case 'icon':
     return <IconDisplay 
       icon={currentState.icon || '🎉'} 
       backgroundColor={currentState.backgroundColor} 
     />;
   ```

**Acceptance Criteria**:
- [ ] Icon mode renders khi nhận state
- [ ] Fallback emoji nếu `icon` undefined
- [ ] No console errors

---

## Cross-Track Dependencies

```
T1-1 (constants) ─────────────┐
         │                    │
         ▼                    ▼
      T2-1 (TextControl)   T2-2 (SceneControl)
                              │
T1-2 (types) ─────────────────┤
         │                    │
         ▼                    ▼
      T3-1 (IconDisplay)   T2-3 (IconControl + ControlPanel)
         │
         ▼
      T3-2 (App.tsx)
```

## Execution Order (Sequential)

1. **T1-1** → shared constants (unblocks all)
2. **T1-2** → shared types (unblocks icon mode)
3. **T2-1** → TextControl preset texts
4. **T2-2** → SceneControl
5. **T3-1** → IconDisplay
6. **T2-3** → IconControl + ControlPanel update
7. **T3-2** → Viewer App.tsx

## Testing Checklist

- [ ] `pnpm build` passes
- [ ] Admin: Brand color #4A90D9 first in picker
- [ ] Admin: Preset texts clickable
- [ ] Admin: Scenes 1-click apply
- [ ] Admin: Icon mode select + custom emoji
- [ ] Viewer: All modes render correctly
- [ ] Viewer: Icon mode full-screen emoji
- [ ] Cross-device: iOS Safari + Android Chrome
