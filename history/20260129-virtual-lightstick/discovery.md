# Discovery Report: Virtual Lightstick

## Project Overview

Ứng dụng lightstick ảo cho phép admin điều khiển đồng loạt 300 thiết bị (điện thoại) để hiển thị màu sắc, chữ chạy và animation patterns.

## Requirements Summary

### Scale
- **Concurrent devices**: 300 thiết bị đồng thời
- **Latency**: Real-time sync (< 100ms)

### Client Features (Viewer)
- Hiển thị màu full screen
- Hiển thị chữ chạy (marquee text)
- Animation patterns (nhấp nháy, fade, etc.)
- Không cần auth - vào web là dùng được
- Không có UI phức tạp - chỉ render hiệu ứng

### Admin Features (Controller)
- Web app responsive (mobile-friendly)
- Single admin control
- Chọn màu (color picker)
- Nhập chữ để chạy
- Chọn animation pattern từ preset
- Start/stop control

### Infrastructure
- Cloud hosting (quyết định sau)
- Không cần offline mode

## Clarifications

| Question | Answer | Impact |
|----------|--------|--------|
| Scale | 300 devices | WebSocket cần handle connection pool |
| Latency | Real-time | WebSocket là bắt buộc |
| Auth | Không cần | Simplify client code |
| Admin type | Web responsive | Single codebase |
| Group control | Không cần | Simpler state management |
| Offline | Không cần | No service worker needed |

**User Confirmation**: 2026-01-29
