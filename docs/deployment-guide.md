# Deployment Guide - Virtual Lightstick

## Quick Start

### Local Docker

```bash
# Build and run
docker compose up --build

# Access:
# - Server API: http://localhost:3001
# - Health: http://localhost:3001/health
```

### Development with Docker

```bash
docker compose --profile dev up
```

---

## Fly.io Deployment

### Prerequisites

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login
```

### First Deploy

```bash
# Launch (creates app)
fly launch --name lightstick-hdwebsoft --region sin

# Set secrets
fly secrets set ADMIN_SECRET=your-secure-secret

# Deploy
fly deploy
```

### Subsequent Deploys

```bash
fly deploy
```

### Monitor

```bash
# View logs
fly logs

# Check status
fly status

# Open app
fly open
```

---

## Production URLs

After deployment:

- **WebSocket Server**: `wss://lightstick-hdwebsoft.fly.dev/ws/{roomCode}`
- **Admin WS**: `wss://lightstick-hdwebsoft.fly.dev/ws/{roomCode}/admin?key={secret}`
- **Health Check**: `https://lightstick-hdwebsoft.fly.dev/health`
- **Create Room**: `POST https://lightstick-hdwebsoft.fly.dev/api/rooms`

---

## Static Assets

The Dockerfile builds viewer/admin apps and copies to `/public`.

For production, either:
1. Serve from same server (add @fastify/static)
2. Deploy to CDN (Vercel, Netlify, Cloudflare Pages)

### CDN Deployment (Recommended)

```bash
# Build
pnpm build

# Deploy viewer to Vercel
cd apps/viewer && npx vercel --prod

# Deploy admin to Vercel  
cd apps/admin && npx vercel --prod
```

Update apps to point WebSocket URL to Fly.io server.

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3001 | Server port |
| `NODE_ENV` | development | Environment mode |
| `CORS_ORIGIN` | * | Allowed CORS origins |
| `ADMIN_SECRET` | lightstick-admin-secret | Admin auth key |

### Fly.io Secrets

```bash
fly secrets set ADMIN_SECRET=your-secret
fly secrets set CORS_ORIGIN=https://your-viewer-domain.com
```

---

## WebSocket in Production

Fly.io handles WebSocket upgrades automatically:
- HTTPS → WSS upgrade works out of box
- Connections stay alive with health checks
- Auto-scaling based on connections

---

## Scaling

```bash
# Scale to 2 machines
fly scale count 2

# Scale memory
fly scale memory 512

# View current scale
fly scale show
```

---

## Troubleshooting

### Connection Refused

```bash
# Check if running
fly status
fly logs
```

### WebSocket Fails

1. Ensure using `wss://` (not `ws://`)
2. Check CORS_ORIGIN includes your domain
3. Verify admin secret matches

### Health Check Fails

```bash
curl https://lightstick-hdwebsoft.fly.dev/health
# Should return: {"status":"ok","timestamp":...}
```

---

## Cost Estimate (Fly.io)

- Free tier: 3 shared-cpu-1x VMs
- This config: ~$0-5/month (auto-suspend when idle)
