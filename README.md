# Grinaldi Fashion

A modern luxury fashion catalogue website for **Grinaldi Fashion House** — showcasing women's fashion and bridal couture.

## Features

- 🌟 **Animated splash screen** — falling stars that reveal the GRINALDI brand name
- 👗 **Fashion catalogue** — Women's fashion collections
- 💍 **Bridal section** — Wedding dress couture gallery
- 🔐 **Secure admin panel** — JWT-based authentication to manage products
- 📸 **Image upload** — Upload product photos directly from the admin
- ✏️ **Full CRUD** — Create, edit, delete products with images, prices and descriptions

## Tech Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** — utility-first styling
- **Framer Motion** — splash screen animations
- **jose** — JWT authentication
- **bcryptjs** — password hashing
- **JSON file** — zero-config product database

## Getting Started

```bash
npm install
cp .env.local.example .env.local  # edit credentials
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `ADMIN_USERNAME` | Admin login username | `admin` |
| `ADMIN_PASSWORD` | Admin login password | `Grinaldi2024!` |
| `JWT_SECRET` | Secret key for JWT tokens | *(change in production)* |

## Pages

| URL | Description |
|---|---|
| `/` | Animated splash screen |
| `/catalog` | Full product catalogue |
| `/catalog/fashion` | Women's fashion section |
| `/catalog/wedding` | Bridal collection |
| `/admin/login` | Admin login |
| `/admin/dashboard` | Admin overview |
| `/admin/products` | Manage all products |
| `/admin/products/new` | Add a new product |
| `/admin/products/[id]/edit` | Edit a product |

## Deployment

This Next.js app can be deployed to:
- **Vercel** — `vercel deploy` (recommended, free tier)
- **Netlify** — via Next.js adapter
- **Railway / Render** — full Node.js hosting with persistent filesystem

> **Note:** For production, update `ADMIN_PASSWORD` to a strong password and set a unique `JWT_SECRET`.
