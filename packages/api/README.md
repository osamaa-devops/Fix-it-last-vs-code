# API Package (`@fix-it/api`)

Centralized API client for Fix It platform using Axios with pre-configured interceptors, error handling, and service-oriented methods.

## 📁 Structure

```
packages/api/
├── src/
│   ├── client.ts              # Axios instance & interceptors
│   ├── services/
│   │   ├── auth.service.ts    # Authentication
│   │   ├── user.service.ts    # User management
│   │   ├── service.service.ts # Services & categories
│   │   ├── order.service.ts   # Orders
│   │   └── handyman.service.ts # Handymen
│   └── index.ts
├── tsconfig.json
└── package.json
```

## 🔧 Client Configuration

### Base Setup

```typescript
import { apiClient } from "@fix-it/api";

// Already pre-configured with:
// - baseURL: from NEXT_PUBLIC_API_URL or EXPO_PUBLIC_API_URL
// - timeout: 10 seconds
// - default headers
```

### Interceptors

**Request Interceptor:**

- Automatically injects `Authorization: Bearer <token>` header
- Reads token from `localStorage.getItem("authToken")`
- Only on web (safe for SSR)

**Response Interceptor:**

- Handles 401 Unauthorized errors
- Clears auth token on failure
- Propagates other errors normally

## 📋 Services

### Auth Service (`authService`)

```typescript
import { authService } from "@fix-it/api";

// Login
const response = await authService.login({
  email: "user@example.com",
  password: "password123",
});
// Returns: { user: User, token: string, refreshToken: string }

// Register
await authService.register({
  email: "new@example.com",
  password: "password123",
  firstName: "John",
  lastName: "Doe",
  phone: "+1234567890",
  role: "CUSTOMER", // or "HANDYMAN"
});

// Get current user
const user = await authService.getCurrentUser();

// Logout
await authService.logout();

// Refresh token
const newTokens = await authService.refreshToken();

// Reset password (request)
await authService.resetPassword("user@example.com");

// Reset password (confirm)
await authService.confirmResetPassword("reset-token-from-email", "newPassword123");
```

**Endpoints Called:**

- `POST /auth/login`
- `POST /auth/register`
- `GET /auth/me`
- `POST /auth/logout`
- `POST /auth/refresh`
- `POST /auth/reset-password`
- `POST /auth/confirm-reset-password`

---

### User Service (`userService`)

```typescript
import { userService } from "@fix-it/api";

// Get user profile
const user = await userService.getProfile("user-id");

// Update profile
const updated = await userService.updateProfile("user-id", {
  firstName: "Jane",
  lastName: "Smith",
  phone: "+1234567890",
  address: "123 Main St",
  city: "New York",
  state: "NY",
  zipCode: "10001",
  bio: "Professional handyman..."
});

// Upload avatar
const file = /* File from input */;
const withAvatar = await userService.uploadAvatar("user-id", file);

// Delete account
await userService.deleteAccount("user-id");
```

**Endpoints Called:**

- `GET /users/{userId}`
- `PUT /users/{userId}`
- `POST /users/{userId}/avatar`
- `DELETE /users/{userId}`

---

### Service Service (`serviceService`)

```typescript
import { serviceService } from "@fix-it/api";

// Get all categories
const categories = await serviceService.getCategories();
// Returns: [{ id, name, description, icon, slug }]

// Get services
const services = await serviceService.getServices({
  categoryId: "cat-123",
  search: "plumbing",
  minRating: 4,
  maxPrice: 100,
});

// Get single service
const service = await serviceService.getServiceById("service-123");

// Search services
const results = await serviceService.searchServices("electrical");
```

**Endpoints Called:**

- `GET /services/categories`
- `GET /services`
- `GET /services/{serviceId}`
- `GET /services/search?q=...`

---

### Order Service (`orderService`)

```typescript
import { orderService } from "@fix-it/api";

// Create order
const order = await orderService.createOrder({
  handymanId: "handyman-123",
  serviceId: "service-456",
  description: "Fix leaking kitchen sink",
  scheduledDate: "2026-02-15T14:00:00Z",
  address: "123 Main St, New York, NY 10001",
  budget: 150,
});

// Get orders
const orders = await orderService.getOrders({
  status: "PENDING",
  customerId: "customer-123",
  dateFrom: "2026-01-01T00:00:00Z",
  dateTo: "2026-03-01T00:00:00Z",
});

// Get single order
const order = await orderService.getOrderById("order-123");

// Update order
const updated = await orderService.updateOrder("order-123", {
  description: "Updated description",
});

// Cancel order
const cancelled = await orderService.cancelOrder("order-123", "Found another provider");

// Complete order
const completed = await orderService.completeOrder("order-123");
```

**Endpoints Called:**

- `POST /orders`
- `GET /orders`
- `GET /orders/{orderId}`
- `PUT /orders/{orderId}`
- `POST /orders/{orderId}/cancel`
- `POST /orders/{orderId}/complete`

---

### Handyman Service (`handymanService`)

```typescript
import { handymanService } from "@fix-it/api";

// Get handymen
const handymen = await handymanService.getHandymen({
  serviceId: "service-123",
  city: "New York",
  minRating: 4,
  availability: true,
});

// Get handyman details
const handyman = await handymanService.getHandymanById("handyman-123");

// Get ratings
const ratings = await handymanService.getHandymanRatings("handyman-123");

// Rate handyman
const rating = await handymanService.rateHandyman(
  "handyman-123",
  5,
  "Excellent work! Very professional and on time."
);

// Update handyman profile
const updated = await handymanService.updateHandymanProfile("handyman-123", {
  hourlyRate: 50,
  isAvailable: true,
});
```

**Endpoints Called:**

- `GET /handymen`
- `GET /handymen/{handymanId}`
- `GET /handymen/{handymanId}/ratings`
- `POST /handymen/{handymanId}/ratings`
- `PUT /handymen/{handymanId}`

---

## 🛠️ Custom API Instances

Create additional API clients for different purposes:

```typescript
import { createApiClient } from "@fix-it/api";

// API client without auth token injection
const publicApiClient = createApiClient({
  baseURL: "https://public-api.example.com",
});

// API client with custom timeout
const slowApiClient = createApiClient({
  timeout: 30000, // 30 seconds
});
```

---

## 🔒 Error Handling

```typescript
import { authService } from "@fix-it/api";

try {
  await authService.login(credentials);
} catch (error) {
  if (error.response?.status === 401) {
    // Unauthorized - show login page
  } else if (error.response?.status === 422) {
    // Validation error - show field errors
    console.log(error.response.data.errors);
  } else if (error.code === "ECONNABORTED") {
    // Timeout
  } else {
    // Other errors
  }
}
```

---

## 📦 Integration Examples

### In Next.js Web App

```typescript
// src/app/auth/login/page.tsx
import { authService } from "@fix-it/api";

export default function LoginPage() {
  const handleLogin = async (email: string, password: string) => {
    try {
      const { token, user } = await authService.login({ email, password });
      localStorage.setItem("authToken", token);
      // Redirect to dashboard
    } catch (error) {
      // Show error message
    }
  };

  return (
    // Form code...
  );
}
```

### In Expo/React Native

```typescript
// src/app/auth/login/index.tsx
import { authService } from "@fix-it/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function LoginScreen() {
  const handleLogin = async (email: string, password: string) => {
    try {
      const { token, user } = await authService.login({ email, password });
      await AsyncStorage.setItem("authToken", token);
      // Navigate to dashboard
    } catch (error) {
      // Show error message
    }
  };

  return (
    // Screen code...
  );
}
```

---

## 🔄 Extending with New Services

Create a new service file:

```typescript
// packages/api/src/services/payment.service.ts
import { apiClient } from "../client";
import type { Payment, PaymentIntent } from "@fix-it/types";

export const paymentService = {
  createPaymentIntent: async (amount: number, orderId: string) => {
    const response = await apiClient.post<PaymentIntent>("/payments/intent", {
      amount,
      orderId,
    });
    return response.data;
  },

  getPayments: async (userId: string) => {
    const response = await apiClient.get<Payment[]>(`/payments/user/${userId}`);
    return response.data;
  },

  refundPayment: async (paymentId: string) => {
    const response = await apiClient.post(`/payments/${paymentId}/refund`, {});
    return response.data;
  },
};
```

Then export from `index.ts`:

```typescript
export { paymentService } from "./services/payment.service";
```

---

## Last Updated

February 10, 2026
