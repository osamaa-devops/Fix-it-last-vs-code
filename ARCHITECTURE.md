# Fix It Monorepo - Architecture & Conventions

This document outlines the architectural decisions, design patterns, and conventions for the Fix It monorepo.

## 📐 Architecture Overview

### Monorepo Structure

The Fix It project uses a **monorepo pattern** with Turborepo orchestration:

```
┌─────────────────────────────────────┐
│        Fix It Monorepo              │
│   (Single Git Repository)           │
├─────────────────────────────────────┤
│ Apps (Full Applications)             │
│  ├─ apps/web (Next.js)              │
│  └─ apps/mobile (Expo)              │
├─────────────────────────────────────┤
│ Packages (Shared Libraries)          │
│  ├─ packages/api (Services)         │
│  ├─ packages/schemas (Validation)   │
│  ├─ packages/types (Types)          │
│  └─ packages/utils (Utilities)      │
├─────────────────────────────────────┤
│ Config (Build & Quality Tools)       │
│  ├─ turbo.json (Turborepo)          │
│  ├─ tsconfig.json (TypeScript)      │
│  ├─ eslint.config.js (Linting)      │
│  └─ .prettierrc (Formatting)        │
└─────────────────────────────────────┘
```

### Benefits of Monorepo

- **Single Source of Truth:** One repository for entire platform
- **Shared Code:** Reuse packages across web and mobile
- **Unified Versioning:** Everything versioned together
- **Type Safety:** Shared TypeScript types prevent bugs
- **Simplified Dependencies:** No need to publish private packages
- **Atomic Changes:** Feature across apps in single commit

---

## 🎯 Design Patterns

### 1. Layered Architecture

Each app follows a **layered architecture**:

```
┌────────────────────────────────────┐
│   UI Components (React)             │
├────────────────────────────────────┤
│   Custom Hooks                      │
├────────────────────────────────────┤
│   Shared Libraries (@fix-it/*)      │
│  ├─ API Services                    │
│  ├─ Validation Schemas              │
│  ├─ Type Definitions                │
│  └─ Utilities                       │
├────────────────────────────────────┤
│   External APIs                     │
│  ├─ Backend REST API                │
│  └─ Third-party Services            │
└────────────────────────────────────┘
```

**Interaction Flow:**

1. UI Component renders
2. Component uses custom Hook
3. Hook calls API service from `@fix-it/api`
4. API service validates with `@fix-it/schemas`
5. API service calls backend REST API
6. Response validated against `@fix-it/types`
7. Data flows back to Hook → Component

### 2. Domain-Driven Organization

Code is organized by **business domain**, not technical layer:

```
domains/
├── auth/          (login, register, password reset)
├── user/          (profile, account management)
├── service/       (browse services, categories)
├── order/         (create, manage orders)
└── handyman/      (find professionals, ratings)
```

**Benefits:**

- Easy to find related code
- Clear feature ownership
- Reduces circular dependencies

### 3. Service Locator Pattern

The `@fix-it/api` package uses a **service locator pattern**:

```typescript
// Single responsibility - each service handles one domain
authService; // handles auth endpoints
userService; // handles user endpoints
orderService; // handles order endpoints
handymanService; // handles handyman endpoints
```

**Advantages:**

- Easy to test (mock services)
- Clear API surface
- Organized by domain

### 4. Validation at Boundaries

Validation happens at **system boundaries** using Zod schemas:

```
User Input → Form Validation (Zod Schema) → API Call → API Response Parsing
```

```typescript
// Always validate before API or form submission
const result = LoginSchema.safeParse(formData);
if (!result.success) {
  // Handle validation errors
} else {
  const validData = result.data; // Type-safe!
  await authService.login(validData);
}
```

**Why Boundaries?**

- Single responsibility
- Clear error handling
- Type safety guaranteed
- Prevents invalid data propagation

---

## 📦 Package Design

### `@fix-it/api` - API Client

**Purpose:** Single point for all backend communication

**Principles:**

- One service per domain (authService, userService, etc.)
- All methods return typed responses
- Axios interceptors handle auth, errors
- No business logic (thin wrapper)
- No UI dependencies

**File Structure:**

```
src/
├── client.ts              # Axios instance
├── services/
│   ├── auth.service.ts
│   ├── user.service.ts
│   ├── order.service.ts
│   └── ...
└── index.ts              # Export all services
```

**Example Service:**

```typescript
// Services are thin wrappers around API calls
export const authService = {
  login: (data) => apiClient.post("/auth/login", data),
  register: (data) => apiClient.post("/auth/register", data),
  logout: () => apiClient.post("/auth/logout"),
};

// No business logic - that goes in components/hooks
```

### `@fix-it/schemas` - Validation Schemas

**Purpose:** Runtime validation with TypeScript inference

**Principles:**

- One schema file per domain
- Export both schema and inferred type
- Use `.safeParse()` for runtime safety
- No async validation (keep pure)
- Clear error messages

**File Structure:**

```
src/
├── auth.schemas.ts
├── user.schemas.ts
├── order.schemas.ts
├── service.schemas.ts
└── index.ts              # Export all schemas
```

**Example Schema:**

```typescript
// Schema with automatic type inference
export const LoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Too short"),
});

// Type is automatically inferred from schema
export type TLogin = z.infer<typeof LoginSchema>;

// Usage
const data: TLogin = { email: "...", password: "..." };
```

### `@fix-it/types` - Type Definitions

**Purpose:** Single source of truth for domain types

**Principles:**

- Types only (no runtime code)
- Organized by domain
- Exported from domain files
- Used by API responses and components
- No circular dependencies

**File Structure:**

```
src/
├── user.types.ts         # User, UserRole, UserStatus
├── service.types.ts      # Service, Category, Handyman
├── order.types.ts        # Order, OrderStatus
├── api.types.ts          # ApiResponse, ApiError
└── index.ts              # Export all types
```

**Example Types:**

```typescript
// Domain enums
export enum UserRole {
  CUSTOMER = "CUSTOMER",
  HANDYMAN = "HANDYMAN",
  ADMIN = "ADMIN",
}

// Domain interfaces
export interface User {
  id: string;
  email: string;
  role: UserRole;
  // ...
}

// API-specific types
export interface ApiResponse<T> {
  data: T;
  message: string;
}
```

### `@fix-it/utils` - Utility Functions

**Purpose:** Shared, pure utility functions

**Principles:**

- Pure functions (no side effects)
- Organized by category (date, string, etc.)
- Well-documented with examples
- Tested independently
- Reusable across apps

**File Structure:**

```
src/
├── date.ts              # formatDate, getRelativeTime, etc.
├── string.ts            # capitalize, slugify, etc.
├── number.ts            # formatCurrency, clamp, etc.
├── object.ts            # groupBy, unique, flatten, etc.
├── storage.ts           # localStorage/sessionStorage helpers
└── index.ts             # Export all functions
```

**Example Utility:**

```typescript
// Pure function with explicit inputs/outputs
export const formatCurrency = (amount: number, currency: string = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};

// Usage
const formatted = formatCurrency(99.99); // "$99.99"
```

---

## 🏗️ Naming Conventions

### Files & Directories

| Type         | Convention                | Example                |
| ------------ | ------------------------- | ---------------------- |
| Components   | PascalCase                | `LoginForm.tsx`        |
| Hooks        | camelCase                 | `useAuth.ts`           |
| Utilities    | camelCase                 | `formatDate.ts`        |
| Services     | camelCase + `.service.ts` | `auth.service.ts`      |
| Schemas      | camelCase + `.schemas.ts` | `auth.schemas.ts`      |
| Types        | camelCase + `.types.ts`   | `user.types.ts`        |
| Pages/Routes | kebab-case                | `login`, `my-orders`   |
| Directories  | kebab-case                | `auth`, `user-profile` |

### Code

| Item            | Convention                | Example                  |
| --------------- | ------------------------- | ------------------------ |
| Classes         | PascalCase                | `UserService`            |
| Functions       | camelCase                 | `formatDate()`           |
| Constants       | UPPER_SNAKE_CASE          | `API_BASE_URL`           |
| Enums           | PascalCase                | `UserRole`               |
| Interfaces      | PascalCase, no `I` prefix | `User`, not `IUser`      |
| Types           | PascalCase                | `Order`, `UserStatus`    |
| Zod Type Infer  | `T{Name}`                 | `TLogin`, `TCreateOrder` |
| Private methods | `_privateMethod()`        | `_validateEmail()`       |

### Imports

Organize imports in this order:

```typescript
// 1. External packages
import React from "react";
import { useState } from "react";
import axios from "axios";

// 2. Workspace packages (@fix-it/*)
import { authService } from "@fix-it/api";
import { LoginSchema } from "@fix-it/schemas";
import type { User } from "@fix-it/types";
import { formatDate } from "@fix-it/utils";

// 3. Relative imports
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/Button";
import { config } from "../lib/config";

// 4. CSS/Assets
import styles from "./page.module.css";
import logo from "./logo.svg";
```

---

## 🔄 Data Flow Examples

### Example 1: Login Flow

```
User Types Email/Password
      ↓
Form validates with LoginSchema (Zod)
      ↓
authService.login(validData) is called
      ↓
Axios interceptor adds auth header
      ↓
POST /auth/login sent to backend
      ↓
Response parsed as AuthResponse (from @fix-it/types)
      ↓
Token saved to localStorage
      ↓
User navigated to dashboard
```

**Code:**

```typescript
// Component
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const handleLogin = async () => {
  // 1. Validate
  const result = LoginSchema.safeParse({ email, password });
  if (!result.success) {
    setError(result.error.issues[0].message);
    return;
  }

  // 2. Call service
  const { token, user } = await authService.login(result.data);

  // 3. Save token (axios interceptor will use it)
  localStorage.setItem("authToken", token);

  // 4. Navigate
  router.push("/customer/home");
};
```

### Example 2: Create Order Flow

```
Customer fills order form
      ↓
Form validates with CreateOrderSchema
      ↓
orderService.createOrder(validData) called
      ↓
Axios adds auth header (from localStorage)
      ↓
POST /orders sent to backend
      ↓
Response parsed as Order type
      ↓
Order added to UI list
      ↓
Success message shown to user
```

**Code:**

```typescript
// Component
const handleCreateOrder = async (formData: unknown) => {
  // 1. Validate with Zod schema
  const result = CreateOrderSchema.safeParse(formData);
  if (!result.success) {
    displayValidationErrors(result.error);
    return;
  }

  try {
    // 2. Call API service
    const newOrder: Order = await orderService.createOrder(result.data);

    // 3. Update UI
    setOrders([...orders, newOrder]);
    showSuccessMessage("Order created successfully!");
  } catch (error) {
    handleApiError(error);
  }
};
```

---

## 🧪 Testing Strategy

### Unit Tests

Test pure functions in isolation:

```typescript
// packages/utils/__tests__/date.test.ts
import { formatDate } from "../date";

describe("formatDate", () => {
  it("formats date correctly", () => {
    const result = formatDate("2026-02-10");
    expect(result).toBe("2/10/2026");
  });
});
```

### Integration Tests

Test services with mocked API:

```typescript
// packages/api/__tests__/auth.service.test.ts
import { authService } from "../services/auth.service";
import { apiClient } from "../client";

jest.mock("../client");

describe("authService", () => {
  it("calls correct endpoint", async () => {
    await authService.login({ email: "test@example.com", password: "123456" });
    expect(apiClient.post).toHaveBeenCalledWith("/auth/login", expect.any(Object));
  });
});
```

### Component Tests

Test React components with mocked services:

```typescript
// apps/web/__tests__/LoginPage.test.tsx
import { render, screen } from "@testing-library/react";
import { authService } from "@fix-it/api";
import LoginPage from "@/app/auth/login/page";

jest.mock("@fix-it/api");

describe("LoginPage", () => {
  it("submits form with valid data", async () => {
    render(<LoginPage />);
    // ... test submission
  });
});
```

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Run `npm run lint` - no linting errors
- [ ] Run `npm run type-check` - no type errors
- [ ] Run `npm run test` - all tests pass
- [ ] Run `npm run build` - successful build
- [ ] Review environment variables are configured
- [ ] Database migrations run successfully
- [ ] API endpoints are tested and working
- [ ] Error handling is comprehensive
- [ ] Logging is configured
- [ ] Security checklist completed

---

## 🔒 Security Considerations

### Authentication

- Tokens stored in localStorage (web) or secure storage (mobile)
- Axios interceptor adds `Authorization` header to requests
- 401 responses clear token (force re-login)
- HTTPS required in production

### API Communication

- All requests validated with Zod schemas
- Environment variables for sensitive config
- CORS configured on backend
- Rate limiting on endpoints (backend responsibility)

### Form Handling

- All user inputs validated before submission
- XSS prevention through React's built-in escaping
- CSRF tokens if required (backend provides)

---

## 📊 Build Performance Tips

### Turbo Caching

Turbo caches task outputs by default:

```bash
# Invalidate cache before debugging
npm run clean

# Cache specific task
npm run build -- --force
```

### Dependencies

Keep dependencies updated:

```bash
npm outdated           # Check for updates
npm update             # Update all packages
npm audit              # Check security issues
```

### Bundle Size

Monitor web app bundle:

```typescript
// pages/api/bundle-analysis.ts
// Use next-bundle-analyzer or similar tools
```

---

## 📚 Learning Path

**Week 1: Foundation**

1. Understand monorepo structure
2. Setup local development
3. Run all apps successfully
4. Review API services

**Week 2: Features**

1. Create a new feature following walkthrough
2. Add types, schemas, services
3. Implement UI in web app
4. Implement UI in mobile app

**Week 3: Polish**

1. Write tests for feature
2. Update documentation
3. Deploy to staging
4. Get feedback and iterate

---

## 🤝 Contributing Guidelines

1. **Create feature branch:** `git checkout -b feat/feature-name`
2. **Make changes:** Update types, schemas, services, components
3. **Run checks:** `npm run lint && npm run type-check && npm run test`
4. **Commit:** Use clear commit messages
5. **Push:** `git push origin feat/feature-name`
6. **Open PR:** Request review

---

**Last Updated:** February 10, 2026
