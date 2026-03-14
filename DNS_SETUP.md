# sebland.com DNS Setup (Squarespace)

## Where to go
Squarespace Dashboard → **Domains** → `sebland.com` → **DNS Settings** → **Custom Records**

## Records to add

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | `@` | `YOUR_SERVER_IP` | Automatic |
| A | `www` | `YOUR_SERVER_IP` | Automatic |

- `@` = the root domain (`sebland.com`)
- `www` = `www.sebland.com` (redirects to root via Caddy)

## What each URL maps to once DNS propagates

| URL | Service |
|-----|---------|
| `https://sebland.com/` | box SPA (main site) |
| `https://sebland.com/scratch` | scratch metrics dashboard (public) |
| `https://sebland.com/seb` | seb status dashboard (password protected) |

## Notes

- **HTTPS is automatic** — Caddy handles Let's Encrypt cert provisioning as soon as
  DNS points at the server. No manual cert setup needed.
- DNS propagation typically takes a few minutes to a few hours depending on Squarespace's
  TTL settings. You can verify with `dig sebland.com` or `nslookup sebland.com`.
- The server must be reachable on ports **80 and 443** from the internet — both are already
  mapped in box's docker-compose.yml.
- seb status page credentials: **username** `seb`, **password** in `/root/seb/.env`

## After DNS propagates

Test it:
```bash
curl -I https://sebland.com
curl -I https://sebland.com/scratch
curl -u seb:<password> https://sebland.com/seb/data
```
