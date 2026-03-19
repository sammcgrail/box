# Domain + HTTPS Setup (Squarespace / Google Domains)

How to point a domain at this server and get automatic HTTPS via Caddy.

> Your domains are managed through **Squarespace** (which absorbed Google Domains).
> The DNS panel is at: squarespace.com → Domains → your domain → DNS Settings

---

## 1. Add a DNS Record in Squarespace

In the Squarespace DNS panel, add an **A record**:

| Host | Type | Value            | TTL  |
|------|------|------------------|------|
| `@`  | A    | `<YOUR_SERVER_IP>` | 3600 |

To use a subdomain (e.g. `app.yourdomain.com`) instead of the root:

| Host  | Type | Value            | TTL  |
|-------|------|------------------|------|
| `app` | A    | `<YOUR_SERVER_IP>` | 3600 |

> DNS propagation takes anywhere from a few minutes to an hour. You can check with:
> ```bash
> dig yourdomain.com A +short
> ```
> Once it returns your server IP you're good to proceed.

---

## 2. Update the Caddyfile

Edit `app/Caddyfile` — replace `:80` with your domain:

```caddyfile
yourdomain.com {
    root * /srv
    encode gzip
    try_files {path} /index.html
    file_server

    header {
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
        Referrer-Policy "strict-origin-when-cross-origin"
    }
}
```

For a subdomain:

```caddyfile
app.yourdomain.com {
    root * /srv
    encode gzip
    try_files {path} /index.html
    file_server
}
```

For **both** root and www:

```caddyfile
yourdomain.com, www.yourdomain.com {
    root * /srv
    encode gzip
    try_files {path} /index.html
    file_server
}
```

---

## 3. Rebuild and Restart

```bash
cd /root/box
docker compose up -d --build
```

Caddy will automatically:
- Obtain a free Let's Encrypt TLS certificate for your domain
- Redirect HTTP → HTTPS
- Renew the cert before it expires (stored in the `caddy_data` Docker volume)

> Port 80 must be open in the Hetzner firewall — Caddy uses it for the ACME HTTP-01 challenge to prove domain ownership.

---

## 4. Verify

```bash
# Check Caddy logs for cert provisioning
docker compose logs -f

# Should see something like:
# {"level":"info","msg":"served key authentication","domain":"yourdomain.com"}
# {"level":"info","msg":"certificate obtained successfully","identifier":"yourdomain.com"}
```

Then visit `https://yourdomain.com` — you should see a valid cert and HTTPS in the browser.

---

## Notes

- **Squarespace proxy / "Website" records**: If Squarespace is also hosting a website on this domain, you'll need to either use a subdomain for this server or migrate the domain to DNS-only mode (remove Squarespace's built-in website). Using a subdomain is easier.
- **TTL**: Lower TTL (e.g. 300) before making changes so propagation is faster.
- **CAA records**: Squarespace may add default CAA records. Let's Encrypt is allowed by default, so this usually isn't an issue.
