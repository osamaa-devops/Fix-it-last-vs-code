# ⚡ Quick Commands - Fix It Monorepo

## 🚀 Start Development

```bash
# Web App Only (Next.js)
npm run dev:web

# Mobile App Only (Expo)  
npm run dev:mobile

# Both Apps (Turbo)
npm run dev
```

---

## 🏗️ Build

```bash
# Build all apps & packages
npm run build

# Clean all build artifacts
npm run clean
```

---

## ✅ Quality

```bash
# Type check all files
npm run type-check

# Lint all files
npm run lint

# Format all files
npm run format

# Check formatting without changing
npm run format:check
```

---

## 🧪 Test

```bash
# Run all tests
npm run test
```

---

## 📦 Install

```bash
# Install dependencies (use this after pulling changes)
npm install --legacy-peer-deps
```

---

## 🐛 Fix Issues

```bash
# Fix npm vulnerabilities (optional)
npm audit fix --force

# Clean everything and reinstall
npm run clean
npm install --legacy-peer-deps
```

---

## 📍 Web App URLs

| Page | URL |
|------|-----|
| Home | http://localhost:3000 |
| Login | http://localhost:3000/auth/login |
| Register | http://localhost:3000/auth/register |
| Forgot Password | http://localhost:3000/auth/forgot-password |
| Dashboard | http://localhost:3000/dashboard |

---

## 👤 Demo Accounts

### Customer
```
Email: customer@fixit.local
Password: Password123!
```

### Handyman
```
Email: handyman@fixit.local
Password: Password123!
```

---

## 📂 Important Directories

```
apps/web/src/
├── app/              # Pages & routes
├── components/       # React components
├── hooks/            # Custom hooks
├── lib/              # Libraries
└── utils/            # Utilities

packages/
├── api/              # API services
├── types/            # TypeScript types
├── schemas/          # Zod schemas
└── utils/            # Shared utilities
```

---

## 🔗 Useful Links

- **Next.js Docs:** https://nextjs.org
- **Turborepo:** https://turbo.build
- **Zod:** https://zod.dev
- **Axios:** https://axios-http.com

---

## ⚖️ Current Status

- ✅ Dependencies installed
- ✅ Next.js web app running
- ✅ Authentication pages ready
- ✅ TypeScript configured
- ✅ All packages linked

---

**Keep this handy for quick reference!**
