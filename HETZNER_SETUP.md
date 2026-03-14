# Hetzner Server Setup

Steps to configure the Hetzner server and deploy this stack from scratch.

---

## 1. Hetzner Cloud Console — Firewall

In the [Hetzner Cloud Console](https://console.hetzner.cloud):

1. Go to **Firewalls** → create a new firewall (or edit the one attached to your server).
2. Add the following **Inbound** rules:

| Protocol | Port    | Source        | Description          |
|----------|---------|---------------|----------------------|
| TCP      | 22      | Your IP/0.0.0.0/0 | SSH                |
| TCP      | 80      | 0.0.0.0/0     | HTTP                 |
| TCP      | 443     | 0.0.0.0/0     | HTTPS                |
| UDP      | 443     | 0.0.0.0/0     | HTTP/3 (QUIC)        |

3. Attach the firewall to your server.

> Note: By default Hetzner blocks no ports at the OS level, but the cloud firewall sits in front. Make sure ports 80 and 443 are open.

---

## 2. SSH into the Server

```bash
ssh root@<YOUR_SERVER_IP>
```

---

## 3. Install Docker

```bash
# Install dependencies
apt-get update
apt-get install -y ca-certificates curl gnupg

# Add Docker's official GPG key
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

# Add Docker apt repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine + Compose plugin
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verify
docker --version
docker compose version
```

---

## 4. Clone the Repo

```bash
cd /root
git clone <YOUR_REPO_URL> box
cd box
```

Or if already there (this repo is at `/root/box`):

```bash
cd /root/box
git pull
```

---

## 5. Build and Start

```bash
docker compose up -d --build
```

The first build will take a minute (Bun install + Vite build). After that the site is live at:

```
http://<YOUR_SERVER_IP>
```

---

## 6. Optional: Add a Domain + HTTPS

If you have a domain, Caddy can provision a free Let's Encrypt TLS certificate automatically.

1. Point your domain's **A record** to `<YOUR_SERVER_IP>` in your DNS provider.

2. Edit `app/Caddyfile` — replace `:80` with your domain:

   ```caddyfile
   yourdomain.com {
       root * /srv
       encode gzip
       try_files {path} /index.html
       file_server
   }
   ```

3. Rebuild and restart:

   ```bash
   docker compose up -d --build
   ```

Caddy will automatically obtain and renew the certificate. Make sure port 80 is open (used for the ACME HTTP-01 challenge).

---

## 7. Useful Commands

```bash
# View logs
docker compose logs -f

# Restart without rebuild
docker compose restart

# Rebuild after code changes
docker compose up -d --build

# Stop everything
docker compose down

# Stop and remove volumes (clears Caddy certs)
docker compose down -v
```

---

## 8. Auto-start on Reboot

Docker's `restart: unless-stopped` policy (already set in `docker-compose.yml`) handles this automatically as long as the Docker daemon itself starts on boot, which it does by default after the install above.

To verify:

```bash
systemctl is-enabled docker
# should output: enabled
```
