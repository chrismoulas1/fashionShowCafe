# Deployment Instructions — fashionShowCafe (Next.js)

## Overview

This is a **Next.js full-stack application** with:
- Server-side rendering & API routes
- Admin authentication (JWT)
- File/image uploads (up to 10 MB via Server Actions)
- Environment variables for secrets

The easiest and most cost-effective hosting path is **Vercel** (built by the Next.js team). A VPS option (DigitalOcean / Hetzner) is also covered for full server control.

---

## Option A — Vercel (Recommended, Easiest)

### Step 1: Acquire a Domain Name

1. Go to a domain registrar:
   - **Namecheap**: https://www.namecheap.com
   - **Cloudflare Registrar**: https://www.cloudflare.com/products/registrar
   - **Google Domains**: https://domains.google
2. Search for your desired domain (e.g. `fashionshowcafe.com`).
3. Purchase it (typically €8–€15/year for a `.com`).
4. You will receive access to a DNS management dashboard for that domain.

---

### Step 2: Push Your Code to GitHub

1. Create a GitHub account at https://github.com if you don't have one.
2. Create a new **private** repository on GitHub.
3. From your project folder, run:

   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

4. Make sure `.env.local` is listed in `.gitignore` — **never commit secrets**.

---

### Step 3: Deploy to Vercel

1. Go to https://vercel.com and sign up (free tier available).
2. Click **"Add New Project"** → **"Import Git Repository"**.
3. Select your GitHub repository.
4. Vercel auto-detects Next.js — keep all build defaults.
5. Before clicking **Deploy**, open **"Environment Variables"** and add:

   | Key | Value |
   |-----|-------|
   | `ADMIN_USERNAME` | Your admin username |
   | `ADMIN_PASSWORD` | A strong password |
   | `JWT_SECRET` | Run `openssl rand -base64 64` locally and paste the result |
   | `NEXT_PUBLIC_APP_URL` | `https://yourdomain.com` |

6. Click **Deploy**. Vercel builds and hosts the site. You get a free `*.vercel.app` URL immediately.

---

### Step 4: Connect Your Custom Domain to Vercel

1. In your Vercel project dashboard, go to **Settings → Domains**.
2. Click **"Add Domain"** and enter your domain (e.g. `fashionshowcafe.com`).
3. Vercel will show DNS records to add. In your registrar's DNS panel, add:

   **Option A — Keep DNS at your registrar:**
   - **A record**: `@` → `76.76.21.21`
   - **CNAME record**: `www` → `cname.vercel-dns.com`

   **Option B — Delegate DNS to Vercel (easiest):**
   - Change your domain's **nameservers** to:
     - `ns1.vercel-dns.com`
     - `ns2.vercel-dns.com`

4. Wait 10–30 minutes for DNS to propagate.
5. Vercel automatically issues a free **SSL/TLS certificate** (HTTPS).

---

### Vercel Pricing

| Plan | Cost | Notes |
|------|------|-------|
| Hobby | Free | 1 project, 100 GB bandwidth/month — good for testing |
| Pro | $20/month | Required for commercial use, more bandwidth |

> ⚠️ The free **Hobby** plan does not permit commercial use. If this is a business site, upgrade to **Pro**.

---

## Option B — VPS (DigitalOcean / Hetzner) — Full Control

Use this if you need persistent file storage (uploaded images saved to disk), full server control, or want to avoid Vercel's limits.

### Step 1: Provision a Server

- **DigitalOcean**: https://www.digitalocean.com → Create a Droplet → Ubuntu 22.04 → Basic plan ($6/month)
- **Hetzner** (cheaper, EU-based): https://www.hetzner.com → Cloud → CX22 (~€4/month)

After creation you will receive your server's **IP address** and SSH credentials.

---

### Step 2: Set Up the Server

SSH into your server and run:

```bash
# Update the system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (keeps the app running)
sudo npm install -g pm2

# Install Nginx (reverse proxy)
sudo apt install -y nginx
```

---

### Step 3: Deploy Your Application

```bash
# Clone your repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git /var/www/app
cd /var/www/app

# Create and fill in your environment file
cp .env.local.example .env.local
nano .env.local   # Set ADMIN_USERNAME, ADMIN_PASSWORD, JWT_SECRET, NEXT_PUBLIC_APP_URL

# Install dependencies and build
npm install
npm run build

# Start the app with PM2
pm2 start npm --name "fashionshowcafe" -- start
pm2 startup        # Run the printed command to enable auto-start on reboot
pm2 save
```

---

### Step 4: Configure Nginx as a Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/fashionshowcafe
```

Paste the following configuration (replace `yourdomain.com` with your actual domain):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    client_max_body_size 20M;
}
```

Enable the configuration:

```bash
sudo ln -s /etc/nginx/sites-available/fashionshowcafe /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

### Step 5: Enable HTTPS (Free with Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot automatically renews the certificate every 90 days.

---

### Step 6: Point Your Domain to the VPS

In your registrar's DNS panel, add:

- **A record**: `@` → your server's IP address
- **A record**: `www` → your server's IP address

Wait 10–30 minutes for DNS to propagate.

---

### Step 7: Enable Firewall (Recommended)

```bash
sudo ufw allow 22       # SSH
sudo ufw allow 80       # HTTP
sudo ufw allow 443      # HTTPS
sudo ufw enable
```

---

## Comparison Summary

| | Vercel Hobby (Free) | Vercel Pro | VPS (DigitalOcean/Hetzner) |
|---|---|---|---|
| Monthly cost | Free | $20/month | $4–$6/month |
| Setup difficulty | ⭐ Very Easy | ⭐ Very Easy | ⭐⭐⭐ Medium |
| Persistent file storage | ❌ No | ❌ No* | ✅ Yes |
| Auto SSL | ✅ | ✅ | ✅ (Certbot) |
| Commercial use | ❌ No | ✅ Yes | ✅ Yes |
| Best for | Testing / MVP | Production | Full control |

> *Vercel has an **ephemeral filesystem** — files uploaded through the admin panel are lost on each redeploy. If you use image uploads, either host on a VPS or integrate an external storage service like **Vercel Blob** or **Cloudinary**.

---

## Security Checklist

- [ ] `.env.local` is in `.gitignore` and is **never committed** to the repository
- [ ] `JWT_SECRET` is generated with `openssl rand -base64 64` (random, 64+ bytes)
- [ ] `ADMIN_PASSWORD` is strong (12+ characters, mixed case, numbers, symbols)
- [ ] HTTPS is enabled (SSL certificate active)
- [ ] Firewall is configured on VPS deployments
- [ ] `NEXT_PUBLIC_APP_URL` is set to the live HTTPS domain before building
