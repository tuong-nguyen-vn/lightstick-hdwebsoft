# Testing Checklist - Virtual Lightstick

Manual testing guide for the Virtual Lightstick application.

## Prerequisites

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Endpoints:
   - Server: http://localhost:3001
   - Admin: http://localhost:5174
   - Viewer: http://localhost:5173

---

## Test Scenarios

### 1. Basic Flow
**Objective:** Verify complete admin → viewer color sync

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1.1 | Open Admin app | Dashboard loads, "Create Room" button visible |
| 1.2 | Click "Create Room" | Room created, room code displayed |
| 1.3 | Open Viewer app in new tab | Join room form visible |
| 1.4 | Enter room code, click "Join" | Viewer joins, lightstick displayed |
| 1.5 | Admin selects RED color | Viewer lightstick changes to RED immediately |
| 1.6 | Admin selects BLUE color | Viewer lightstick changes to BLUE immediately |
| 1.7 | Admin toggles strobe ON | Viewer lightstick starts strobing |
| 1.8 | Admin toggles strobe OFF | Viewer lightstick stops strobing |

**Pass Criteria:** All color/effect changes sync within 100ms

---

### 2. Multiple Viewers Sync
**Objective:** Verify simultaneous sync across 5+ viewers

| Step | Action | Expected Result |
|------|--------|-----------------|
| 2.1 | Create room in Admin | Room code generated |
| 2.2 | Open 5 Viewer tabs, join same room | All 5 viewers connected |
| 2.3 | Admin connection count shows "5" | Count accurate |
| 2.4 | Admin changes color to GREEN | ALL 5 viewers update simultaneously |
| 2.5 | Admin enables strobe | ALL 5 viewers strobe in sync |
| 2.6 | Close 2 viewer tabs | Admin count updates to "3" |

**Pass Criteria:** All viewers receive updates within 200ms of each other

---

### 3. Reconnection & State Recovery
**Objective:** Verify reconnect receives current state

| Step | Action | Expected Result |
|------|--------|-----------------|
| 3.1 | Create room, join as viewer | Connected, default state |
| 3.2 | Admin sets color to PURPLE | Viewer shows PURPLE |
| 3.3 | Disable network (DevTools → Offline) | Viewer shows disconnected |
| 3.4 | Re-enable network | Viewer auto-reconnects |
| 3.5 | Verify viewer shows PURPLE | State restored correctly |
| 3.6 | Admin changes to YELLOW while viewer offline | - |
| 3.7 | Viewer reconnects | Viewer shows YELLOW (latest state) |

**Pass Criteria:** Reconnected viewers receive current room state

---

### 4. Room Isolation
**Objective:** Verify commands don't cross rooms

| Step | Action | Expected Result |
|------|--------|-----------------|
| 4.1 | Create Room A in Admin tab 1 | Room A code: XXXX |
| 4.2 | Create Room B in Admin tab 2 | Room B code: YYYY |
| 4.3 | Join Room A with Viewer 1 | Viewer 1 connected to A |
| 4.4 | Join Room B with Viewer 2 | Viewer 2 connected to B |
| 4.5 | Room A Admin → RED | Only Viewer 1 turns RED |
| 4.6 | Room B Admin → BLUE | Only Viewer 2 turns BLUE |
| 4.7 | Room A Admin → strobe ON | Only Viewer 1 strobes |
| 4.8 | Verify Viewer 1 still RED, Viewer 2 still BLUE | No cross-contamination |

**Pass Criteria:** Zero cross-room pollution

---

### 5. Invalid Room Code
**Objective:** Verify error handling for invalid rooms

| Step | Action | Expected Result |
|------|--------|-----------------|
| 5.1 | Open Viewer, enter "INVALID" | - |
| 5.2 | Click Join | Error message: "Room not found" |
| 5.3 | Enter empty room code | Join button disabled or error |

---

### 6. WebSocket Connection Stress
**Objective:** Verify rapid command handling

| Step | Action | Expected Result |
|------|--------|-----------------|
| 6.1 | Create room, connect 3 viewers | All connected |
| 6.2 | Rapidly click colors (10+ times/sec) | No crashes, last color applies |
| 6.3 | Toggle strobe rapidly | Stable behavior |

---

## API Health Check

```bash
# Check server health
curl http://localhost:3001/health

# Expected: {"status":"ok","timestamp":...}
```

---

## Browser Compatibility

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)  
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

---

## Performance Benchmarks

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Color sync latency | < 100ms | DevTools Network tab |
| Reconnect time | < 2s | Disconnect/reconnect cycle |
| Memory (viewer) | < 50MB | DevTools Memory tab |
| CPU (idle) | < 5% | Task Manager |

---

## Sign-off

| Test Scenario | Tester | Date | Pass/Fail |
|---------------|--------|------|-----------|
| Basic Flow | | | |
| Multiple Viewers | | | |
| Reconnection | | | |
| Room Isolation | | | |
| Invalid Room | | | |
| Stress Test | | | |
