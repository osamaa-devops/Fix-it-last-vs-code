# Getting Started with Fix It Monorepo

## 🚀 Quick Start

### Prerequisites

- **Node.js:** 18 or higher (20+ recommended)
- **npm:** 9 or higher
- **Git:** For version control

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/fix-it.git
cd fix-it

# Install dependencies (installs all workspace packages)
npm install

# Verify installation
npm run type-check
```

### Start Development

```bash
# Run both web and mobile apps
npm run dev

# Or run individually
npm run dev:web      # Next.js web app on http://localhost:3000
npm run dev:mobile   # Expo on http://localhost:8081
```

---

## 📚 Key Concepts

### Workspaces

This is a **monorepo** with npm workspaces. All packages are in one repository:

- **apps/** - Standalone applications
  - `web` - Next.js 14 web application
  - `mobile` - Expo/React Native mobile application
- **packages/** - Shared libraries
  - `api` - Axios API services
  - `schemas` - Zod validation schemas
  - `types` - TypeScript type definitions
  - `utils` - Utility functions

### Imports

Always use scoped package imports:

```typescript
// ✅ Correct
import { authService } from "@fix-it/api";
import { formatDate } from "@fix-it/utils";
import type { User } from "@fix-it/types";

// ❌ Wrong
import { authService } from "../../packages/api";
```

### Turborepo

Turbo orchestrates builds, testing, and linting across all packages.

```bash
npm run build        # Build all packages in dependency order
npm run lint         # Lint all packages
npm run type-check   # Type check all packages
npm run test         # Run tests
```

---

## 📁 Project Structure

### apps/web

Next.js 14 with App Router for the web application.

```
apps/web/
├── src/
│   ├── app/                    # App Router (file-based routing)
│   │   ├── (auth)/            # Auth routes (login, register, etc.)
│   │   ├── customer/          # Customer dashboard
│   │   ├── handyman/          # Handyman dashboard
│   │   ├── admin/             # Admin dashboard
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable React components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility libraries
│   ├── types/                 # App-specific types
│   └── utils/                 # App utilities
├── public/                    # Static assets
├── next.config.js             # Next.js config
└── package.json
```

**Run Web Only:**

```bash
npm run dev:web
# Opens http://localhost:3000
```

---

### apps/mobile

Expo + React Native with file-based routing for mobile.

```
apps/mobile/
├── src/
│   ├── app/                   # Expo Router (file-based routing)
│   ├── screens/               # Screen components
│   ├── components/            # Reusable components
│   ├── hooks/                 # Custom hooks
│   ├── navigation/            # Navigation setup
│   └── utils/                 # Utilities
├── assets/                    # Images, icons
├── app.json                   # Expo config
└── package.json
```

**Run Mobile:**

```bash
npm run dev:mobile            # Expo dev server
npm run android               # Run on Android
npm run ios                   # Run on iOS
npm run web                   # Web preview
```

---

### packages/api

Centralized API client using Axios.

**Main Files:**

- `src/client.ts` - Axios instance with interceptors
- `src/services/*.service.ts` - Service modules for each domain
- `src/index.ts` - Export everything

**Services:**

- `authService` - Login, register, logout, token refresh
- `userService` - Profile, avatar, account management
- `serviceService` - Browse services and categories
- `orderService` - Create, view, manage orders
- `handymanService` - Find handymen, ratings, reviews

```typescript
import { authService, orderService } from "@fix-it/api";

await authService.login({ email, password });
const orders = await orderService.getOrders({ status: "PENDING" });
```

---

### packages/schemas

Zod validation schemas with TypeScript inference.

**Files by Domain:**

- `auth.schemas.ts` - Login, register, password reset
- `user.schemas.ts` - Profile updates, filters
- `order.schemas.ts` - Order creation, status updates, filtering
- `service.schemas.ts` - Service filters, handyman search, ratings

```typescript
import { LoginSchema, type TLogin } from "@fix-it/schemas";

const result = LoginSchema.safeParse(formData);
if (result.success) {
  const validData: TLogin = result.data; // Type-safe!
}
```

---

### packages/types

Shared TypeScript types (no runtime code).

**Type Groups:**

- `user.types.ts` - `User`, `UserRole`, `AuthResponse`, etc.
- `service.types.ts` - `Service`, `Category`, `Handyman`, `Rating`
- `order.types.ts` - `Order`, `OrderStatus`, etc.
- `api.types.ts` - `ApiResponse`, `ApiError`, `PaginatedResponse`

```typescript
import type { User, Order } from "@fix-it/types";

const user: User = {
  /* ... */
};
const orders: Order[] = [];
```

---

### packages/utils

Shared utility functions (date, string, number, object, storage).

**Categories:**

- **Date:** `formatDate()`, `formatDateTime()`, `getRelativeTime()`, etc.
- **String:** `capitalize()`, `truncate()`, `slugify()`, `getInitials()`, etc.
- **Number:** `formatCurrency()`, `formatNumber()`, `clamp()`, `percentage()`, etc.
- **Object:** `groupBy()`, `unique()`, `flatten()`, `chunk()`, `omit()`, `pick()`, etc.
- **Storage:** `getFromStorage()`, `setInStorage()`, `removeFromStorage()`, etc.

```typescript
import { formatDate, formatCurrency, groupBy } from "@fix-it/utils";

const date = formatDate("2026-02-10"); // "2/10/2026"
const price = formatCurrency(99.99); // "$99.99"
const grouped = groupBy(users, "role"); // { CUSTOMER: [...], HANDYMAN: [...] }
```

---

## 🔄 Workflow: Adding a Feature

Let's say you want to add a "Complaints" feature.

### 1. Define Types

```typescript
// packages/types/src/complaint.types.ts
export interface Complaint {
  id: string;
  orderId: string;
  customerId: string;
  handymanId: string;
  reason: "POOR_QUALITY" | "NO_SHOW" | "RUDE_BEHAVIOR" | "OTHER";
  description: string;
  status: "OPEN" | "IN_REVIEW" | "RESOLVED" | "CLOSED";
  createdAt: string;
  updatedAt: string;
}
```

Then export from `packages/types/src/index.ts`:

```typescript
export * from "./complaint.types";
```

### 2. Create Validation Schemas

```typescript
// packages/schemas/src/complaint.schemas.ts
import { z } from "zod";

export const CreateComplaintSchema = z.object({
  orderId: z.string().uuid(),
  reason: z.enum(["POOR_QUALITY", "NO_SHOW", "RUDE_BEHAVIOR", "OTHER"]),
  description: z.string().min(20).max(1000),
});

export type TCreateComplaint = z.infer<typeof CreateComplaintSchema>;
```

Export from `packages/schemas/src/index.ts`:

```typescript
export * from "./complaint.schemas";
```

### 3. Add API Service

```typescript
// packages/api/src/services/complaint.service.ts
import { apiClient } from "../client";
import type { Complaint } from "@fix-it/types";

export const complaintService = {
  createComplaint: async (data: CreateComplaintRequest) => {
    const response = await apiClient.post<Complaint>("/complaints", data);
    return response.data;
  },

  getComplaints: async (filters?: any) => {
    const response = await apiClient.get<Complaint[]>("/complaints", { params: filters });
    return response.data;
  },

  getComplaintById: async (id: string) => {
    const response = await apiClient.get<Complaint>(`/complaints/${id}`);
    return response.data;
  },

  updateComplaintStatus: async (id: string, status: string) => {
    const response = await apiClient.put<Complaint>(`/complaints/${id}`, { status });
    return response.data;
  },
};
```

Export from `packages/api/src/index.ts`:

```typescript
export { complaintService } from "./services/complaint.service";
```

### 4. Use in Apps

**In Next.js:**

```typescript
// apps/web/src/app/customer/complaints/page.tsx
import { complaintService } from "@fix-it/api";
import { CreateComplaintSchema } from "@fix-it/schemas";
import type { Complaint } from "@fix-it/types";

export default function ComplaintsPage() {
  const handleSubmit = async (formData: any) => {
    const result = CreateComplaintSchema.safeParse(formData);
    if (!result.success) {
      // Show errors
      return;
    }

    const complaint = await complaintService.createComplaint(result.data);
    // Show success
  };

  return (
    // Complaint form...
  );
}
```

**In React Native:**

```typescript
// apps/mobile/src/screens/Complaints/CreateComplaint.tsx
import { complaintService } from "@fix-it/api";
import { CreateComplaintSchema } from "@fix-it/schemas";

export function CreateComplaintScreen() {
  const handleSubmit = async (data: any) => {
    const result = CreateComplaintSchema.safeParse(data);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    const complaint = await complaintService.createComplaint(result.data);
    // Show success, navigate
  };

  return (
    // Complaint form...
  );
}
```

---

## 🔐 Environment Variables

Create `.env.local` in root:

```env
# Web App API URL
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Mobile App API URL
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/fixit

# Optional
NODE_ENV=development
```

**Important:**

- `NEXT_PUBLIC_*` variables are exposed to the browser (public)
- `EXPO_PUBLIC_*` variables work similarly for Expo
- Don't put secrets in these variables

---

## 📚 Key Commands

```bash
# Development
npm run dev              # Run all apps
npm run dev:web         # Run web only
npm run dev:mobile      # Run mobile only

# Building
npm run build            # Build all packages for production
npm run build --filter=web  # Build web only

# Quality Check
npm run lint             # Lint all files
npm run type-check       # Type check all packages
npm run format           # Auto-format with Prettier
npm run format:check     # Check formatting without changes

# Testing
npm run test             # Run tests

# Cleanup
npm run clean            # Remove all build artifacts
npm install             # Reinstall from scratch (if npm install fails)
```

---

## 🐛 Troubleshooting

### "Module not found" errors

**Problem:** Import from `@fix-it/*` fails

**Solution:**

1. Make sure the package is in `packages/`
2. Check the package has `name: "@fix-it/xyz"` in `package.json`
3. Run `npm install` to update workspace links
4. Check `apps/web/tsconfig.json` for correct path aliases

### TypeScript errors

**Problem:** Type errors in IDE

**Solution:**

```bash
npm run type-check
```

### Build fails

**Problem:** Build step fails

**Solution:**

```bash
npm run clean
npm install
npm run build
```

### Fast Refresh not working

**Problem:** Changes don't hot reload

**Solution:**

- Kill the dev server
- Run `npm run clean`
- Run `npm run dev` again

### Port already in use

**Problem:** "Port 3000 already in use"

**Solution:**

```bash
# Kill process on port 3000 (macOS/Linux)
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

---

## 📖 Learning Resources

- **Turbo Docs:** https://turbo.build/repo/docs
- **Next.js 14:** https://nextjs.org/docs
- **Expo:** https://docs.expo.dev
- **React Native:** https://reactnative.dev/docs
- **Zod:** https://zod.dev
- **Axios:** https://axios-http.com
- **TypeScript:** https://www.typescriptlang.org/docs/

---

## 💡 Tips & Best Practices

1. **Use workspace packages:** Always import from `@fix-it/*`
2. **Run type-check first:** Before committing, run `npm run type-check`
3. **Format code:** Run `npm run format` before committing
4. **Use Zod for validation:** All form/API inputs should be validated
5. **Share types:** Put types in `@fix-it/types`, not in individual apps
6. **Extract utilities:** Common functions go in `@fix-it/utils`
7. **Service-oriented API:** Add new endpoints to `@fix-it/api` services

---

## 🎯 Next Steps

1. Review the [README.md](./README.md) for detailed architecture
2. Check [packages/api/README.md](./packages/api/README.md) for API usage
3. Check [packages/schemas/README.md](./packages/schemas/README.md) for validation
4. Explore [apps/web/](./apps/web/) and [apps/mobile/](./apps/mobile/) structure
5. Create your first feature!

---

**Last Updated:** February 10, 2026
