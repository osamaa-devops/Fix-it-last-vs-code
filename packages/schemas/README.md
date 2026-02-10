# Schemas Package (`@fix-it/schemas`)

End-to-end data validation using Zod with built-in TypeScript type inference for forms, API requests, and responses.

## 📁 Structure

```
packages/schemas/
├── src/
│   ├── auth.schemas.ts      # Authentication schemas
│   ├── user.schemas.ts      # User management schemas
│   ├── order.schemas.ts     # Order schemas
│   ├── service.schemas.ts   # Service & handyman schemas
│   └── index.ts
├── tsconfig.json
└── package.json
```

## 🔧 Usage Pattern

Each schema comes with automatic TypeScript type inference:

```typescript
import { LoginSchema, type TLogin } from "@fix-it/schemas";

// Validate at runtime
const loginData = LoginSchema.parse(formData);
// Now loginData is type-safe: { email: string, password: string }

// Or safe parsing with error handling
const result = LoginSchema.safeParse(formData);
if (!result.success) {
  console.log(result.error.issues); // Validation errors
} else {
  const validData: TLogin = result.data;
}

// Extract type for use without parsing
type LoginInput = TLogin;
const handleLogin = (data: LoginInput) => {
  /* ... */
};
```

---

## 📋 Auth Schemas

### LoginSchema

Validates login credentials.

```typescript
import { LoginSchema, type TLogin } from "@fix-it/schemas";

const data: TLogin = {
  email: "user@example.com",
  password: "securePassword123",
};

LoginSchema.parse(data);
```

**Validation:**

- Email: Valid email format
- Password: Minimum 8 characters

---

### RegisterSchema

Validates new user registration with password confirmation.

```typescript
import { RegisterSchema, type TRegister } from "@fix-it/schemas";

const data: TRegister = {
  email: "newuser@example.com",
  password: "securePassword123",
  confirmPassword: "securePassword123",
  firstName: "John",
  lastName: "Doe",
  phone: "+12025551234",
  role: "CUSTOMER", // or "HANDYMAN" | "ADMIN"
};

RegisterSchema.parse(data);
```

**Validation:**

- Email: Valid format
- Password: Minimum 8 characters
- Confirm Password: Must match password
- First Name: Minimum 2 characters
- Last Name: Minimum 2 characters
- Phone: Valid phone format (E.164)
- Role: One of CUSTOMER, HANDYMAN, ADMIN

---

### ResetPasswordSchema

Validates password reset request.

```typescript
import { ResetPasswordSchema, type TResetPassword } from "@fix-it/schemas";

const data: TResetPassword = {
  email: "user@example.com",
};

ResetPasswordSchema.parse(data);
```

**Validation:**

- Email: Valid format

---

### ConfirmResetPasswordSchema

Validates password reset confirmation with new password.

```typescript
import { ConfirmResetPasswordSchema, type TConfirmResetPassword } from "@fix-it/schemas";

const data: TConfirmResetPassword = {
  token: "reset-token-from-email",
  newPassword: "newSecurePassword123",
  confirmPassword: "newSecurePassword123",
};

ConfirmResetPasswordSchema.parse(data);
```

**Validation:**

- Token: Required string
- New Password: Minimum 8 characters
- Confirm Password: Must match newPassword

---

## 👤 User Schemas

### UpdateProfileSchema

Validates user profile updates (all fields optional).

```typescript
import { UpdateProfileSchema, type TUpdateProfile } from "@fix-it/schemas";

const data: TUpdateProfile = {
  firstName: "Jane",
  phone: "+14155552671",
  bio: "Professional electrician with 10 years experience",
  // other fields optional
};

UpdateProfileSchema.parse(data);
```

**Validation:**

- First Name: Minimum 2 characters (optional)
- Last Name: Minimum 2 characters (optional)
- Phone: Valid phone format (optional)
- Address: Any string (optional)
- City: Any string (optional)
- State: Any string (optional)
- Zip Code: Any string (optional)
- Bio: Maximum 500 characters (optional)

---

### UserFilterSchema

Validates user filtering/search parameters.

```typescript
import { UserFilterSchema, type TUserFilter } from "@fix-it/schemas";

const filters: TUserFilter = {
  role: "HANDYMAN",
  search: "john",
  status: "ACTIVE",
};

UserFilterSchema.parse(filters);
// Pass to API for filtering
```

**Validation:**

- Role: CUSTOMER, HANDYMAN, or ADMIN (optional)
- Search: Any string (optional)
- Status: ACTIVE, INACTIVE, or SUSPENDED (optional)

---

## 📦 Order Schemas

### CreateOrderSchema

Validates new order creation.

```typescript
import { CreateOrderSchema, type TCreateOrder } from "@fix-it/schemas";

const data: TCreateOrder = {
  handymanId: "uuid-string",
  serviceId: "uuid-string",
  description: "Fix leaking kitchen sink and bathroom faucet",
  scheduledDate: "2026-02-20T14:00:00Z",
  address: "123 Main St, New York, NY 10001",
  budget: 250,
};

CreateOrderSchema.parse(data);
```

**Validation:**

- Handyman ID: Valid UUID
- Service ID: Valid UUID
- Description: Minimum 10 characters
- Scheduled Date: Valid ISO datetime
- Address: Minimum 5 characters
- Budget: Positive number (optional)

---

### OrderFilterSchema

Validates order filtering parameters.

```typescript
import { OrderFilterSchema, type TOrderFilter } from "@fix-it/schemas";

const filters: TOrderFilter = {
  status: "PENDING",
  customerId: "uuid-string",
  dateFrom: "2026-02-01T00:00:00Z",
  dateTo: "2026-02-28T23:59:59Z",
};

OrderFilterSchema.parse(filters);
```

**Validation:**

- Status: PENDING, ACCEPTED, IN_PROGRESS, COMPLETED, or CANCELLED (optional)
- Customer ID: Valid UUID (optional)
- Handyman ID: Valid UUID (optional)
- Date From: Valid ISO datetime (optional)
- Date To: Valid ISO datetime (optional)

---

### OrderStatusUpdateSchema

Validates order status updates.

```typescript
import { OrderStatusUpdateSchema, type TOrderStatusUpdate } from "@fix-it/schemas";

const update: TOrderStatusUpdate = {
  status: "IN_PROGRESS",
  notes: "Started work, estimated 2 hours",
};

OrderStatusUpdateSchema.parse(update);
```

**Validation:**

- Status: ACCEPTED, IN_PROGRESS, COMPLETED, or CANCELLED
- Notes: Any string (optional)

---

## 🔧 Service Schemas

### ServiceFilterSchema

Validates service search/filter parameters.

```typescript
import { ServiceFilterSchema, type TServiceFilter } from "@fix-it/schemas";

const filters: TServiceFilter = {
  categoryId: "uuid-string",
  search: "plumbing",
  minRating: 4,
  maxPrice: 150,
};

ServiceFilterSchema.parse(filters);
```

**Validation:**

- Category ID: Valid UUID (optional)
- Search: Any string (optional)
- Min Rating: 0-5 (optional)
- Max Price: Positive number (optional)

---

### HandymanFilterSchema

Validates handyman search parameters.

```typescript
import { HandymanFilterSchema, type THandymanFilter } from "@fix-it/schemas";

const filters: THandymanFilter = {
  serviceId: "uuid-string",
  city: "New York",
  minRating: 4,
  availability: true,
};

HandymanFilterSchema.parse(filters);
```

**Validation:**

- Service ID: Valid UUID (optional)
- City: Any string (optional)
- Min Rating: 0-5 (optional)
- Availability: Boolean (optional)

---

### RatingSchema

Validates handyman ratings and reviews.

```typescript
import { RatingSchema, type TRating } from "@fix-it/schemas";

const rating: TRating = {
  rating: 5,
  review: "Excellent work! Very professional, timely, and friendly. Highly recommended.",
};

RatingSchema.parse(rating);
```

**Validation:**

- Rating: 1-5 (required)
- Review: 10-1000 characters (required)

---

## 💡 Integration Examples

### Form Validation (Next.js)

```typescript
// src/app/auth/register/page.tsx
"use client";
import { RegisterSchema } from "@fix-it/schemas";
import { useState } from "react";

export default function RegisterPage() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const result = RegisterSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      phone: formData.get("phone"),
      role: formData.get("role"),
    });

    if (!result.success) {
      // Display field errors
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // Valid data - submit to API
    const validData = result.data;
    // authService.register(validData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" />
      {errors.email && <span className="error">{errors.email}</span>}
      {/* More fields... */}
    </form>
  );
}
```

### Server-Side Validation (API Route)

```typescript
// src/app/api/orders/route.ts
import { CreateOrderSchema } from "@fix-it/schemas";

export async function POST(request: Request) {
  const body = await request.json();

  const result = CreateOrderSchema.safeParse(body);
  if (!result.success) {
    return Response.json({ errors: result.error.issues }, { status: 422 });
  }

  // Process valid order
  const order = await createOrderInDatabase(result.data);
  return Response.json(order, { status: 201 });
}
```

### Mobile Form Validation (React Native)

```typescript
// src/screens/Auth/LoginScreen.tsx
import { LoginSchema } from "@fix-it/schemas";
import { authService } from "@fix-it/api";

export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const result = LoginSchema.safeParse({ email, password });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    try {
      const { token } = await authService.login(result.data);
      // Save token and navigate
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <View>
      <TextInput value={email} onChangeText={setEmail} />
      <TextInput value={password} onChangeText={setPassword} secureTextEntry />
      {error && <Text style={{ color: "red" }}>{error}</Text>}
      <TouchableOpacity onPress={handleLogin}>
        <Text>Login</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## 🔄 Creating Custom Schemas

Extend existing schemas or create new ones:

```typescript
// packages/schemas/src/complaint.schemas.ts
import { z } from "zod";

export const CreateComplaintSchema = z.object({
  orderId: z.string().uuid("Invalid order ID"),
  reason: z.enum(["POOR_QUALITY", "NO_SHOW", "RUDE_BEHAVIOR", "OTHER"]),
  description: z.string().min(20, "Description must be at least 20 characters").max(2000),
  evidence: z.array(z.string().url()).optional(),
});

export type TCreateComplaint = z.infer<typeof CreateComplaintSchema>;

export const ComplaintStatusSchema = z.object({
  status: z.enum(["OPEN", "IN_REVIEW", "RESOLVED", "CLOSED"]),
  resolution: z.string().optional(),
});

export type TComplaintStatus = z.infer<typeof ComplaintStatusSchema>;
```

Then add to `index.ts`:

```typescript
export * from "./complaint.schemas";
```

---

## 📚 Zod Features Used

- **String validation:** `.email()`, `.min()`, `.max()`, `.regex()`
- **Enum validation:** `.enum()`
- **UUID validation:** `.uuid()`
- **Custom refine:** `.refine()` for cross-field validation
- **Type inference:** `z.infer<typeof Schema>`
- **Safe parsing:** `.safeParse()` for error handling

---

## Last Updated

February 10, 2026
