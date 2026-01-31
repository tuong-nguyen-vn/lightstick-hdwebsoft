# Approach: YEP 2026 Presets & Icon Mode

## Gap Analysis

| Component | Have | Need | Gap |
|-----------|------|------|-----|
| Brand color | 10 generic colors | `#4A90D9` first | Add 1 line |
| Preset texts | localStorage saved only | Built-in YEP presets | Add constant + UI section |
| Preset scenes | Color/Pattern/Text separate | 1-click bundle apply | New SceneControl + constant |
| Icon mode | 3 modes only | Icon/emoji display | New mode + viewer + admin |

## Recommended Approach: Data-Driven Presets

**Rationale**: Không cần server/DB changes. Presets là constants, dễ chỉnh cho YEP.

### F1: Brand Color (#4A90D9)
- **Change**: Thêm `'#4A90D9'` vào đầu `DEFAULT_COLORS`
- **Files**: `packages/shared/src/constants.ts`
- **Risk**: LOW
- **Effort**: < 30 min

### F2: Preset Texts
- **Change**: 
  - Thêm `YEP_PRESET_TEXTS` constant
  - Render preset section trong TextControl
- **Files**: 
  - `packages/shared/src/constants.ts`
  - `apps/admin/src/components/TextControl.tsx`
- **Risk**: LOW
- **Effort**: 1-2 hours

### F3: Preset Scenes
- **Change**:
  - Define `ScenePreset` interface + `YEP_SCENES` constant
  - Create `SceneControl.tsx` component
  - Add 'scenes' tab to ControlPanel
- **Files**:
  - `packages/shared/src/constants.ts`
  - `apps/admin/src/components/SceneControl.tsx` (NEW)
  - `apps/admin/src/components/ControlPanel.tsx`
- **Risk**: MEDIUM
- **Effort**: 2-4 hours

### F4: Icon Mode
- **Change**:
  - Extend LightstickState with 'icon' mode + `icon` field
  - Create `IconDisplay.tsx` viewer component
  - Create `IconControl.tsx` admin component
  - Add 'icon' tab to ControlPanel
  - Update viewer App.tsx
- **Files**:
  - `packages/shared/src/types.ts`
  - `apps/viewer/src/components/IconDisplay.tsx` (NEW)
  - `apps/viewer/src/App.tsx`
  - `apps/admin/src/components/IconControl.tsx` (NEW)
  - `apps/admin/src/components/ControlPanel.tsx`
- **Risk**: MEDIUM
- **Effort**: 4-6 hours

## Risk Map

| Component | Risk | Reason | Mitigation |
|-----------|------|--------|------------|
| F1 Brand color | LOW | Simple array change | N/A |
| F2 Preset texts | LOW | Follow existing pattern | N/A |
| F3 Scenes | MEDIUM | New feature pattern | Type-check scene data |
| F4 Icon mode | MEDIUM | New mode across layers | Deploy sync, test devices |

## Implementation Order

```
F1 (brand color) → F3 (scenes depend on brand color)
       ↓
F2 (preset texts) → independent
       ↓  
F4 (icon mode) → independent, test last
```

## Preset Data (Pre-defined)

### YEP_PRESET_TEXTS
```typescript
['HDWEBSOFT', 'YEP 2026', 'GO HDS!', '1-2-3 YÔ!', '🔥🔥🔥']
```

### YEP_SCENES
| Scene | Mode | Color | Pattern | Speed |
|-------|------|-------|---------|-------|
| HDS Blue | color | #4A90D9 | - | - |
| Chill | pattern | #4A90D9 | pulse | slow |
| Party | pattern | auto | rainbow | medium |
| Hype | pattern | #FFFFFF | strobe | fast |
| Countdown | pattern | #FF0000 | blink | fast |

### ICON_PRESETS
```
🔥 ❤️ ⭐ 🎉 👏 🚀 🌍 💙
```

## Success Criteria
- [ ] Brand color #4A90D9 xuất hiện đầu tiên trong color picker
- [ ] Preset texts hiển thị và click để fill
- [ ] 1-click scene apply đúng state
- [ ] Icon mode hiển thị emoji full-screen trên viewer
- [ ] Test trên iOS Safari + Android Chrome
