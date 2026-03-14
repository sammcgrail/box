# Adding a new app at sebland.com/*

Reference for spinning up a new service under a path route (e.g. `sebland.com/myapp`).

---

## Architecture

```
Internet
  └── box-web-1 (Caddy, ports 80+443, handles TLS)
        ├── sebland.com/          → box SPA (/srv static files)
        ├── sebland.com/mptodo*   → box-mptodo-1 container (port 8767)
        └── sebland.com/seb*      → seb-status systemd service (port 8765)
```

Each app is its own container defined in `box/docker-compose.yml`, proxied by Caddy in `box/app/Caddyfile`. Caddy auto-provisions HTTPS via Let's Encrypt — no cert setup needed.

---

## Checklist for a new app

### 1. Pick a port
Use an unused port above 8767. Currently taken:
- `8765` — seb-status (systemd, not a box container)
- `8767` — mptodo

### 2. Add the service to `docker-compose.yml`

```yaml
  myapp:
    build:
      context: ./myapp
      dockerfile: Dockerfile
    restart: unless-stopped
    ports:
      - "8768:8768"        # ← NEVER use 127.0.0.1:XXXX:XXXX here (see gotchas)
    volumes:
      - myapp_data:/data   # only if you need persistence
```

Add to the top-level `volumes:` block if using a named volume:
```yaml
volumes:
  myapp_data:
```

### 3. Add a Caddy route to `app/Caddyfile`

**No path stripping (recommended for apps that own their own prefix):**
```
handle /myapp* {
    reverse_proxy host.docker.internal:8768
}
```
The app itself handles the full `/myapp/...` path. This is simpler.

**With path stripping (if the app expects to run at `/`):**
```
handle /myapp* {
    uri strip_prefix /myapp
    reverse_proxy host.docker.internal:8768
}
```
Only use this for apps that have no awareness of their path prefix (e.g. a plain static file server). If stripping, the app's fetch calls and asset paths must all be relative or the app must inject a base URL.

Put new routes **before** the final `handle { }` SPA block.

### 4. Add a `myapp/` directory in the box repo

Typical structure for a fullstack app:
```
myapp/
  Dockerfile        # multi-stage: build frontend, run backend
  main.py           # (or server.js, etc.) — API + static serving
  app/              # frontend source (Vite/React)
    package.json
    vite.config.ts
    src/
```

### 5. Vite frontend config

Set `base` to match your route prefix so assets resolve correctly:
```ts
// vite.config.ts
export default defineConfig({
  base: "/myapp/",
  plugins: [react()],
});
```

If using React Router, set `basename` to match:
```tsx
<BrowserRouter basename="/myapp">
```

API calls from the frontend should use absolute paths:
```ts
const API = "/myapp/api";
fetch(`${API}/things`)
```

### 6. Backend serving static files + API (Python/FastAPI pattern)

See `mptodo/main.py` for the full example. Key points:
- Register API routes **before** the SPA catch-all
- SPA catch-all: if file exists in `/app/static/`, serve it; else serve `index.html`
- DB/data stored in `/data/` (mapped to a Docker volume)

```python
@app.get("/myapp/api/things")
def list_things(): ...

@app.get("/myapp/{path:path}")
async def serve_spa(path: str):
    file_path = os.path.join("/app/static", path)
    if path and os.path.isfile(file_path):
        return FileResponse(file_path)
    return FileResponse("/app/static/index.html")
```

### 7. Dockerfile pattern (multi-stage: bun + python)

```dockerfile
FROM oven/bun:1-alpine AS builder
WORKDIR /app
COPY app/package.json ./
RUN bun install
COPY app/ .
RUN bun run build

FROM python:3.12-slim
WORKDIR /app
RUN pip install --no-cache-dir fastapi "uvicorn[standard]"
COPY main.py .
COPY --from=builder /app/dist /app/static
VOLUME /data
EXPOSE 8768
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8768"]
```

### 8. Deploy

```bash
cd /root/box
docker compose build myapp
docker compose up -d
```

Rebuild Caddy too if you changed the Caddyfile:
```bash
docker compose build web && docker compose up -d web
```

---

## Gotchas

### Port binding must be `"PORT:PORT"` not `"127.0.0.1:PORT:PORT"`
The box-web-1 Caddy container reaches other services via `host.docker.internal` (resolves to the Docker bridge gateway, `172.17.0.1`). If you bind a port to `127.0.0.1` only, the bridge can't reach it and Caddy returns 502. Always use the short form `"PORT:PORT"` in docker-compose.

### Caddy strips the prefix before proxying (if you use `uri strip_prefix`)
If Caddy strips `/myapp` before forwarding, the backend receives `/` and `/api/things` instead of `/myapp` and `/myapp/api/things`. In that case the backend routes and the JS fetch paths must NOT include the prefix. The mptodo app does **not** strip — it keeps the full path.

### `host.docker.internal` is how box-web-1 reaches the host and other containers
Defined in `box/docker-compose.yml` as `extra_hosts: host.docker.internal:host-gateway`. Services running directly on the host (like seb-status) are also reachable this way.

### seb-status (port 8765) runs as a systemd service, not a Docker container
It's not in docker-compose. It binds to `0.0.0.0:8765` directly on the host. The Caddy `/seb*` route proxies to it via `host.docker.internal:8765`.
