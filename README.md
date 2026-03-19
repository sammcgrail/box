# box

Personal site running on Hetzner. React + TypeScript + Bun + Vite, served via Caddy in Docker.

**Live:** `http://<YOUR_SERVER_IP>`

---

## Stack

- **React 18** + **TypeScript** — UI
- **Vite** — build tool
- **Bun** — package manager / build runner
- **Tailwind CSS** + **shadcn/ui** — styling and components
- **React Router v6** — client-side routing
- **Caddy** — web server, handles HTTPS automatically when a domain is configured
- **Docker** — containerized, multi-stage build (Bun builds → Caddy serves)
- **Hetzner** — VPS hosting
- **Tailscale** — SSH access (no public port 22)

---

## Project Structure

```
box/
├── app/
│   ├── src/
│   │   ├── components/ui/    # shadcn components (button, card, badge)
│   │   ├── components/       # nav, footer
│   │   ├── pages/            # home, about, not-found
│   │   ├── styles/           # wordart.css and other styles
│   │   ├── lib/utils.ts      # cn() helper
│   │   └── App.tsx           # routes
│   ├── Caddyfile
│   └── Dockerfile
├── docker-compose.yml
├── HETZNER_SETUP.md          # server setup from scratch
├── DOMAIN_SETUP.md           # adding a domain + HTTPS via Squarespace DNS
└── README.md
```

---

## Dev

```bash
cd app
bun install
bun run dev
```

## Deploy

```bash
docker compose up -d --build
```

See [HETZNER_SETUP.md](./HETZNER_SETUP.md) for full server setup.
See [DOMAIN_SETUP.md](./DOMAIN_SETUP.md) for pointing a domain at this server.
