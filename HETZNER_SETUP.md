# Hetzner Server Setup

Steps to get the server running from scratch.

---

## 1. Hetzner Cloud Console — Firewall

> SSH is managed via **Tailscale** — port 22 does not need to be exposed publicly.

In the [Hetzner Cloud Console](https://console.hetzner.cloud):

1. Go to **Firewalls** → create or edit the firewall attached to your server.
2. Set these **Inbound** rules (nothing else):

| Protocol | Port | Source    | Description   |
|----------|------|-----------|---------------|
| TCP      | 80   | 0.0.0.0/0 | HTTP          |
| TCP      | 443  | 0.0.0.0/0 | HTTPS         |
| UDP      | 443  | 0.0.0.0/0 | HTTP/3 (QUIC) |

3. Attach the firewall to your server.

---

## 2. Connect to the Server

Via Tailscale:

```bash
ssh root@<TAILSCALE_IP_OR_HOSTNAME>
# e.g. ssh root@your-tailscale-hostname
```

---

## 3. Install Docker (Ubuntu 24.04)

```bash
apt-get update && apt-get install -y ca-certificates curl gnupg

install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

---

## 4. Clone and Start

```bash
cd /root
git clone <YOUR_REPO_URL> box
cd box
docker compose up -d --build
```

Site is live at `http://<YOUR_SERVER_IP>`.

For HTTPS with a domain, see [DOMAIN_SETUP.md](./DOMAIN_SETUP.md).

---

## 5. Useful Commands

```bash
docker compose up -d --build   # rebuild after code changes
docker compose logs -f         # tail logs
docker compose restart         # restart without rebuild
docker compose down            # stop
docker compose down -v         # stop + wipe Caddy cert volumes
```

---

## 6. Auto-start on Reboot

`restart: unless-stopped` in `docker-compose.yml` handles this. Docker daemon starts on boot by default. Verify:

```bash
systemctl is-enabled docker   # should say: enabled
```
