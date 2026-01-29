# Execution Plan: Virtual Lightstick MVP

**Epic**: lightstick-hdwebsoft-1  
**Generated**: 2026-01-29

## Summary

| Metric | Value |
|--------|-------|
| Total Tasks | 18 |
| Priority 0 (Critical) | 4 |
| Priority 1 (Core) | 6 |
| Priority 2 (Standard) | 7 |
| Priority 3 (Polish) | 1 |

## Dependency Graph

```
lightstick-hdwebsoft-2 (Monorepo Setup)
    │
    ▼
lightstick-hdwebsoft-3 (Shared Types)
    │
    ├─────────────────────┬─────────────────────┐
    ▼                     ▼                     ▼
lightstick-hdwebsoft-4   lightstick-hdwebsoft-6 lightstick-hdwebsoft-11
(WS Server Core)         (Viewer Setup)         (Admin Setup)
    │                         │                     │
    ▼                         │                     │
lightstick-hdwebsoft-5       │                     │
(Time Sync Protocol)         │                     │
    │                         │                     │
    ├─────────────────────────┤─────────────────────┤
    ▼                         ▼                     ▼
lightstick-hdwebsoft-7   lightstick-hdwebsoft-12
(Viewer WS Hook)         (Admin WS + Room)
    │                         │
    ├────────┬────────┐       ├────────┬────────┬────────┐
    ▼        ▼        ▼       ▼        ▼        ▼        ▼
    8        9        16      13       14       15       17
 (Color)  (Marquee) (Wake)  (Color) (Text)  (Pattern) (QR)
    │        │
    ▼        │
    10 ──────┘
 (Patterns)
    │
    ▼
lightstick-hdwebsoft-18 (E2E Testing)
    │
    ▼
lightstick-hdwebsoft-19 (Deployment)
```

## Tracks (Parallel Execution)

| Track | Agent | Beads (in order) | File Scope |
|-------|-------|------------------|------------|
| 1 | BlueLake | 2 → 3 | `packages/**`, root configs |
| 2 | GreenCastle | 4 → 5 | `apps/server/**` |
| 3 | RedStone | 6 → 7 → 8 → 10 → 9 → 16 | `apps/viewer/**` |
| 4 | PurpleBear | 11 → 12 → 13 → 14 → 15 → 17 | `apps/admin/**` |
| 5 | OrangeWolf | 18 → 19 | `docs/**`, Docker, deploy configs |

## Track Details

### Track 1: BlueLake - Foundation Setup
**File scope**: `packages/**`, `pnpm-workspace.yaml`, `turbo.json`, `tsconfig.base.json`  
**Beads**:
1. `lightstick-hdwebsoft-2`: Setup monorepo pnpm + Turborepo
2. `lightstick-hdwebsoft-3`: Shared types package

**Notes**: Must complete before other tracks can start.

---

### Track 2: GreenCastle - WebSocket Server
**File scope**: `apps/server/**`  
**Beads**:
1. `lightstick-hdwebsoft-4`: WS Server core + Room management
2. `lightstick-hdwebsoft-5`: Time sync protocol

**Dependencies**: Starts after Track 1 completes bead 3 (shared types)

---

### Track 3: RedStone - Viewer App
**File scope**: `apps/viewer/**`  
**Beads**:
1. `lightstick-hdwebsoft-6`: Viewer setup (React + Vite)
2. `lightstick-hdwebsoft-7`: WebSocket hook + Time sync
3. `lightstick-hdwebsoft-8`: Solid color effect
4. `lightstick-hdwebsoft-10`: Animation patterns
5. `lightstick-hdwebsoft-9`: Marquee text
6. `lightstick-hdwebsoft-16`: Wake lock + Fullscreen

**Dependencies**: 
- Bead 6 starts after Track 1 completes
- Bead 7 starts after Track 2 completes bead 5

---

### Track 4: PurpleBear - Admin App
**File scope**: `apps/admin/**`  
**Beads**:
1. `lightstick-hdwebsoft-11`: Admin setup (React + Vite)
2. `lightstick-hdwebsoft-12`: WebSocket + Room creation
3. `lightstick-hdwebsoft-13`: Color picker control
4. `lightstick-hdwebsoft-14`: Text marquee control
5. `lightstick-hdwebsoft-15`: Pattern selector control
6. `lightstick-hdwebsoft-17`: QR code sharing

**Dependencies**: 
- Bead 11 starts after Track 1 completes
- Bead 12 starts after Track 2 completes bead 5

---

### Track 5: OrangeWolf - Testing & Deployment
**File scope**: `docs/**`, `Dockerfile`, `docker-compose.yml`, `fly.toml`  
**Beads**:
1. `lightstick-hdwebsoft-18`: Integration testing
2. `lightstick-hdwebsoft-19`: Deployment setup

**Dependencies**: 
- Bead 18 starts after Track 3 bead 8 AND Track 4 bead 13 complete

---

## Cross-Track Dependencies

```
Track 1 (BlueLake)
    │
    ├──[after bd-3]──▶ Track 2, 3, 4 can start setup beads
    │
Track 2 (GreenCastle)
    │
    └──[after bd-5]──▶ Track 3 bd-7, Track 4 bd-12 can start

Track 3 bd-8 + Track 4 bd-13
    │
    └──[after both]──▶ Track 5 can start
```

## Execution Order (Critical Path)

```
Phase 1: Foundation
  └─ bd-2 (Monorepo) → bd-3 (Shared types)

Phase 2: Parallel Development (3 tracks)
  ├─ Track 2: bd-4 → bd-5 (Server)
  ├─ Track 3: bd-6 → bd-7 → bd-8 (Viewer MVP)
  └─ Track 4: bd-11 → bd-12 → bd-13 (Admin MVP)

Phase 3: Extended Features (parallel)
  ├─ Track 3: bd-10, bd-9, bd-16
  └─ Track 4: bd-14, bd-15, bd-17

Phase 4: Finalization
  └─ Track 5: bd-18 → bd-19
```

## Starting Points

**Ready to start now**:
- `lightstick-hdwebsoft-2` - Setup monorepo (Track 1 first bead)

## Estimated Timeline

| Phase | Tasks | Est. Time |
|-------|-------|-----------|
| Phase 1 | 2 tasks | 2-3 hours |
| Phase 2 | 6 tasks (parallel) | 4-6 hours |
| Phase 3 | 7 tasks (parallel) | 4-6 hours |
| Phase 4 | 2 tasks | 2-3 hours |
| **Total** | **17 tasks** | **12-18 hours** |

## Key Learnings (from Oracle)

1. **Time-scheduled commands**: Use `startAt` timestamp 200-400ms in future for sync
2. **Single WS server**: 300 devices is small, no need for Redis/pub-sub
3. **CSS animations preferred**: Better performance than JS on mobile
4. **Wake Lock API**: Not all browsers support, need fallback instructions
5. **Room-based URLs**: Simple security via random room codes + admin secret
