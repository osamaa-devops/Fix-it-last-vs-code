# Fix It - Professional Monorepo

A comprehensive, production-ready monorepo for the "Fix It" home services marketplace platform using Turborepo, Next.js, React Native + Expo, and shared packages.

## 📋 Project Structure

```
fix-it/
├── apps/
│   ├── web/                    # Next.js 14 Web Application
│   │   ├── src/
│   │   │   ├── app/            # App Router directory
│   │   │   │   ├── (auth)/     # Authentication routes (login, register, reset-password)
│   │   │   │   ├── customer/   # Customer dashboard routes
│   │   │   │   ├── handyman/   # Handyman dashboard routes
│   │   │   │   ├── admin/      # Admin dashboard routes
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── components/     # Reusable React components
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── lib/            # Library utilities & helpers
│   │   │   ├── types/          # App-specific TypeScript types
│   │   │   └── utils/          # Utility functions
│   │   ├── next.config.js
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── mobile/                 # Expo + React Native App
│       ├── src/
│       │   ├── app/            # Expo Router directory
│       │   ├── screens/        # Screen components
│       │   ├── components/     # Reusable components
│       │   ├── navigation/     # Navigation config
│       │   ├── hooks/          # Custom hooks
│       │   └── utils/          # Utility functions
│       ├── assets/             # Images, icons, fonts
│       ├── app.json            # Expo config
│       ├── tsconfig.json
│       └── package.json
│
├── packages/
│   ├── api/                    # Axios API Services
│   │   ├── src/
│   │   │   ├── client.ts       # Axios instance & interceptors
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── user.service.ts
│   │   │   │   ├── service.service.ts
│   │   │   │   ├── order.service.ts
│   │   │   │   └── handyman.service.ts
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── schemas/                # Zod Validation Schemas
│   │   ├── src/
│   │   │   ├── auth.schemas.ts
│   │   │   ├── user.schemas.ts
│   │   │   ├── order.schemas.ts
│   │   │   ├── service.schemas.ts
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── types/                  # Shared TypeScript Types
│   │   ├── src/
│   │   │   ├── user.types.ts
│   │   │   ├── service.types.ts
│   │   │   ├── order.types.ts
│   │   │   ├── api.types.ts
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── utils/                  # Shared Utility Functions
│       ├── src/
│       │   ├── date.ts         # Date formatting & manipulation
│       │   ├── string.ts       # String utilities
│       │   ├── number.ts       # Number formatting & calculations
│       │   ├── object.ts       # Object & array helpers
│       │   ├── storage.ts      # localStorage/sessionStorage wrapper
│       │   └── index.ts
│       ├── tsconfig.json
│       └── package.json
│
├── .eslintrc.js               # ESLint configuration
├── .prettierrc                # Prettier configuration
├── .gitignore
├── turbo.json                 # Turborepo configuration
├── tsconfig.json              # Root TypeScript configuration
├── package.json               # Root package.json with workspaces
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (recommended 20+)
- npm 9+ or yarn/pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd fix-it

# Install dependencies
npm install
# or
yarn install
```

### Development

```bash
# Run all apps in development mode
npm run dev

# Run web app only
npm run dev:web

# Run mobile app only
npm run dev:mobile
```

### Building

```bash
# Build all apps and packages
npm run build

# Type check all packages
npm run type-check

# Lint all files
npm run lint
```

## 📦 Packages Overview

### `@fix-it/api` - API Client Services

**Purpose:** Centralized API communication layer using Axios

**Key Features:**

- Pre-configured Axios instance with interceptors
- Auth token injection & refresh handling
- 401 error handling (automatic logout)
- Service-oriented API methods for:
  - Authentication (login, register, logout)
  - User management (profile, avatar, account)
  - Services & categories (search, filter)
  - Orders (CRUD, status updates)
  - Handymen (search, ratings, reviews)

**Usage:**

```typescript
import { authService, orderService } from "@fix-it/api";

// Login
const { token, user } = await authService.login({ email, password });

// Get orders
const orders = await orderService.getOrders({ status: "PENDING" });
```

---

### `@fix-it/schemas` - Zod Validation Schemas

**Purpose:** Centralized data validation with Zod, with TypeScript type inference

**Included Schemas:**

- **Auth:** Login, Register, ResetPassword, ConfirmResetPassword
- **User:** UpdateProfile, UserFilter
- **Order:** CreateOrder, OrderFilter, OrderStatusUpdate
- **Service:** ServiceFilter, HandymanFilter, Rating

**Features:**

- End-to-end form validation (client & server)
- Type-safe request/response validation
- Custom error messages
- Cross-field validation (password confirmation)

**Usage:**

```typescript
import { LoginSchema } from "@fix-it/schemas";

const parsed = LoginSchema.parse({ email: "user@example.com", password: "123456" });
// TypeScript knows parsed is { email: string, password: string }
```

---

### `@fix-it/types` - TypeScript Type Definitions

**Purpose:** Single source of truth for all domain types across apps

**Type Groups:**

- **User:** `User`, `UserRole`, `UserStatus`, `AuthResponse`, `LoginRequest`, `RegisterRequest`
- **Service:** `Service`, `Category`, `Handyman`, `Rating`, `ServiceFilters`, `HandymanFilters`
- **Order:** `Order`, `OrderStatus`, `CreateOrderRequest`, `OrderFilters`
- **API:** `ApiResponse`, `ApiError`, `PaginatedResponse`

**Features:**

- Enums for user roles and statuses
- Comprehensive interface definitions
- No runtime code (types-only package)

**Usage:**

```typescript
import { User, Order, OrderStatus } from "@fix-it/types";

const user: User = {
  /* ... */
};
const orders: Order[] = [];
```

---

### `@fix-it/utils` - Shared Utility Functions

**Purpose:** Common helper functions used across web and mobile apps

**Categories:**

#### Date Utilities

- `formatDate()` - Format date to locale string
- `formatDateTime()` - Format with time
- `getRelativeTime()` - Time ago format (e.g., "2h ago")
- `addDays()` - Add days to date
- `isToday()` - Check if date is today
- `isFutureDate()` - Check if date is in future

#### String Utilities

- `capitalize()` - Capitalize first letter
- `truncate()` - Truncate with ellipsis
- `slugify()` - Convert to URL-safe slug
- `camelCase()` - Convert to camelCase
- `getInitials()` - Get user initials
- `formatPhoneNumber()` - Format phone number
- `isValidEmail()` - Validate email format

#### Number Utilities

- `formatCurrency()` - Format as currency (USD, EUR, etc.)
- `formatNumber()` - Format with decimals
- `clamp()` - Constrain value between min/max
- `percentage()` - Calculate percentage
- `round()` - Round to decimals
- `generateRandom()` - Random number in range

#### Object Utilities

- `groupBy()` - Group array by property
- `unique()` - Remove duplicates
- `flatten()` - Flatten nested arrays
- `chunk()` - Split array into chunks
- `omit()` - Remove object properties
- `pick()` - Select object properties
- `isEmpty()` - Check if object is empty

#### Storage Utilities

- `getFromStorage()` - Get from localStorage
- `setInStorage()` - Set to localStorage
- `removeFromStorage()` - Remove from localStorage
- `clearStorage()` - Clear all localStorage
- `getFromSessionStorage()` - Get from sessionStorage
- `setInSessionStorage()` - Set to sessionStorage

**Usage:**

```typescript
import { formatDate, formatCurrency, groupBy, getInitials } from "@fix-it/utils";

const date = formatDate(new Date()); // "2/10/2026"
const price = formatCurrency(99.99); // "$99.99"
const initials = getInitials("John", "Doe"); // "JD"
```

---

## 🎯 Apps

### `apps/web` - Next.js 14 Web Application

**Tech Stack:**

- Next.js 14 with App Router
- React 18
- TypeScript
- TailwindCSS (ready to install)
- Jest for testing

**Directory Structure:**

```
src/
├── app/
│   ├── (auth)/          # Grouped auth routes
│   │   ├── login/
│   │   ├── register/
│   │   └── reset-password/
│   ├── customer/        # Customer routes
│   │   ├── home/
│   │   ├── categories/
│   │   ├── handyman/
│   │   ├── orders/
│   │   └── profile/
│   ├── handyman/        # Handyman routes
│   │   ├── dashboard/
│   │   ├── requests/
│   │   └── profile/
│   ├── admin/           # Admin routes
│   │   ├── dashboard/
│   │   ├── users/
│   │   ├── handymen/
│   │   ├── categories/
│   │   └── complaints/
│   ├── layout.tsx
│   └── page.tsx
├── components/          # Reusable components
├── hooks/              # Custom React hooks
├── lib/                # Libraries & DB clients
├── types/              # App-specific types
└── utils/              # App utilities
```

**Scripts:**

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # Type check
npm run test             # Run Jest
npm run clean            # Remove .next
```

**Key Features:**

- Route groups for organizing auth routes
- Dynamic routes for user dashboard sections
- API routes ready for server functions
- Turborepo local package imports via path aliases

---

### `apps/mobile` - Expo + React Native

**Tech Stack:**

- Expo 51
- React Native 0.74
- Expo Router (file-based routing)
- TypeScript
- React Navigation

**Directory Structure:**

```
src/
├── app/                 # Expo Router app directory
├── screens/             # Screen components
├── components/          # Reusable components
├── navigation/          # Navigation config
├── hooks/              # Custom hooks
└── utils/              # Utilities
```

**Scripts:**

```bash
npm start               # Start Expo
npm run android         # Run on Android
npm run ios            # Run on iOS
npm run web            # Run Web preview
npm run lint            # Run ESLint
npm run type-check      # Type check
npm run test            # Run Jest
npm run clean           # Remove .expo
```

**Environment Setup:**

- `app.json` pre-configured for Expo
- iOS and Android specific settings
- Deep linking scheme configured (`fixit://`)

---

## 🔧 Turborepo Configuration

**Key Pipeline Tasks:**

```json
{
  "build": {
    "dependsOn": ["^build"],
    "outputs": [".next/**", "dist/**"],
    "cache": true
  },
  "dev": {
    "cache": false,
    "persistent": true
  },
  "lint": {
    "cache": true
  },
  "type-check": {
    "cache": true
  },
  "test": {
    "dependsOn": ["^build"],
    "cache": true
  }
}
```

**Global Environment Variables:**

- `NODE_ENV` - Environment (development/production)
- `.env.local`, `.env.production` - Local overrides

---

## 📝 TypeScript Configuration

**Root `tsconfig.json`:**

- Strict mode enabled
- ES2020 target
- Module resolution: bundler
- Path aliases for workspace packages

**App-specific configs extend root:**

- Web: JSX preserve, Next.js plugins
- Mobile: React Native types, DOM lib

---

## 💾 Storage Patterns

**localStorage Usage:**

- Auth tokens: `authToken`
- User cache: `currentUser`
- App preferences: `appPreferences`

**sessionStorage Usage:**

- Temporary form state
- Page navigation history

→ Use `@fix-it/utils` storage functions for safe SSR handling

---

## 🔐 Authentication Flow

1. **Login/Register** → `authService.login()` / `authService.register()`
2. **Token Storage** → Axios interceptor saves to localStorage
3. **Request Flow** → Interceptor injects `Authorization: Bearer token`
4. **Token Refresh** → 401 response triggers `authService.refreshToken()`
5. **Logout** → Clear token on 401, remove from storage

---

## 🌐 Environment Variables

Create `.env.local` in root directory:

```env
# Web App
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Mobile App
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# Shared
DATABASE_URL=postgresql://user:pass@localhost:5432/fixit
NODE_ENV=development
```

---

## 🚢 Production Deployment

### Web (Next.js)

```bash
npm run build
npm run start
```

Deploy to: Vercel, Netlify, AWS, etc.

### Mobile (Expo)

```bash
eas build
eas submit
```

Deploy to: Apple App Store, Google Play Store

### Packages

Publish to npm with:

```bash
npm publish
```

---

## 📚 Conventions

### File Naming

- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Types: `camelCase.types.ts`
- Services: `camelCase.service.ts`
- Schemas: `camelCase.schemas.ts`

### Import Organization

1. External packages
2. Workspace packages (`@fix-it/*`)
3. Relative imports
4. Types/Interfaces

### Folder Organization

- Components grouped by feature
- Services by domain (auth, user, order, etc.)
- Utils by functionality (date, string, etc.)

---

## 🔄 Workflow

**Adding a Feature Across All Apps:**

1. Define types in `packages/types`

   ```bash
   # Edit packages/types/src/*.types.ts
   npm run type-check
   ```

2. Create API service in `packages/api`

   ```bash
   # Edit packages/api/src/services/*.service.ts
   npm run build
   ```

3. Add validation in `packages/schemas`

   ```bash
   # Edit packages/schemas/src/*.schemas.ts
   npm run build
   ```

4. Use in Web app

   ```bash
   npm run dev:web
   ```

5. Use in Mobile app
   ```bash
   npm run dev:mobile
   ```

---

## 🐛 Debugging

**Turbo Cache Issues:**

```bash
npm run clean  # Clear all build artifacts
npm run build  # Rebuild from scratch
```

**Type Checking:**

```bash
npm run type-check
```

**Linting:**

```bash
npm run lint
npm run format  # Auto-fix with Prettier
```

---

## 📖 References

- **Turbo Docs:** https://turbo.build/repo/docs
- **Next.js 14:** https://nextjs.org/docs
- **React Native/Expo:** https://docs.expo.dev
- **Zod:** https://zod.dev
- **Axios:** https://axios-http.com

---

## 📄 License

Graduation Project - Fix It Platform

---

**Last Updated:** February 10, 2026
