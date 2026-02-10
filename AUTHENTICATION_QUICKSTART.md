# 🚀 Authentication Quick Start

**Get the authentication system running in 5 minutes**

---

## Step 1: Start the App (1 min)

```bash
cd fix-it
npm run dev
```

Should see:

```
▲ Next.js 14.0.0
- Local:        localhost:3000
- Environments: .env.local
```

---

## Step 2: Visit Login Page (30 sec)

Open browser: **http://localhost:3000/auth/login**

You should see:

- "Welcome Back" heading
- Email and password fields
- "Sign In" button
- "Create account" link
- "Forgot password?" link
- **Demo credentials** at bottom

---

## Step 3: Test Login (1 min)

**Customer Demo Account:**

```
Email: customer@fixit.local
Password: Password123!
```

**OR Handyman Demo Account:**

```
Email: handyman@fixit.local
Password: Password123!
```

Click "Sign In" → Should redirect to `/dashboard`

---

## Step 4: Test Other Pages (2 min)

### Register Page

http://localhost:3000/auth/register

- Fill form: email, name, phone, password
- Get OTP (simulated)
- Enter OTP code (any 6 digits for testing)
- See success confirmation

### Forgot Password Page

http://localhost:3000/auth/forgot-password

- Enter email
- Get OTP (simulated)
- Enter new password
- See success

---

## File Locations to Review

```
apis/web/
├── src/
│   ├── app/
│   │   ├── (auth)/login/page.tsx         ← Login form
│   │   ├── (auth)/register/page.tsx      ← Register form
│   │   ├── (auth)/forgot-password/page.  ← Password reset
│   │   └── dashboard/page.tsx            ← Protected page
│   │
│   ├── lib/
│   │   └── auth-context.tsx              ← Auth logic (useAuth)
│   │
│   └── components/
│       ├── form/FormFields.tsx           ← Reusable components
│       └── auth/ProtectedRoute.tsx       ← Route protection
│
└── AUTHENTICATION_GUIDE.md               ← Full documentation
```

---

## Using Authentication in Your Code

### Access User Info

```typescript
import { useAuth } from '@/lib/auth-context';

export function MyComponent() {
  const { user } = useAuth();

  return <h1>Welcome {user?.fullName}</h1>;
}
```

### Protect a Route

```typescript
import { Protected } from '@/components/auth/ProtectedRoute';

export default function MyPage() {
  return (
    <Protected>
      <MyContent />
    </Protected>
  );
}
```

### Call Auth Functions

```typescript
const { login, logout, error } = useAuth();

await login("email@example.com", "password");
await logout();
console.log(error); // any auth error
```

---

## Testing Flows

### ✅ Login Flow

1. Go to `/auth/login`
2. Enter demo email and password
3. Click "Sign In"
4. Should redirect to `/dashboard`
5. See user info displayed

### ✅ Register Flow

1. Go to `/auth/register`
2. Fill all fields
3. Submit form
4. Enter OTP (any 6 digits)
5. See success message
6. Click "Go to Dashboard"

### ✅ Password Reset Flow

1. Go to `/auth/forgot-password`
2. Enter email
3. Enter OTP (any 6 digits)
4. Enter new password
5. See success message
6. Back to login

### ✅ Protected Route Flow

1. Go to `/dashboard` without login
2. Should redirect to `/auth/login`
3. Login
4. Should redirect back to `/dashboard`

---

## Common Tasks

### Change Form Styling

File: `src/components/form/FormFields.tsx`

```typescript
// Change button color
className={`
  ${fullWidth ? 'w-full' : ''}
  // ← Modify colors here
  ${variantStyles[variant]}
`}
```

### Add New Fields

1. Update Zod schema in page
2. Add to form state
3. Add FormInput component
4. Update API service

### Customize Messages

File: Each page (login/register/forgot-password)

```typescript
subtitle = "Your custom text here";
```

### Change Redirect After Login

File: `src/lib/auth-context.tsx`

Update redirect logic in login/register functions

---

## Troubleshooting

### Form Not Submitting

Check browser console for errors:

```
F12 → Console tab → Look for red errors
```

### Auth State Not Updating

Ensure AuthProvider is in root layout:

```typescript
// src/app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

### Protected Route Not Redirecting

Check that Protected component is used:

```typescript
export default function Page() {
  return (
    <Protected>
      {children}
    </Protected>
  );
}
```

---

## API Integration

The system works with the `@fix-it/api` package:

```typescript
// Automatically configured
import { authService } from "@fix-it/api";

// All these work out of the box
await authService.login({ email, password });
await authService.register(userData);
await authService.logout();
```

No additional setup needed!

---

## Next Steps

1. **Customize styling** to match your brand
2. **Add custom fields** to registration
3. **Implement dashboards** for each role
4. **Connect to real backend API**
5. **Deploy to Vercel**

---

## Documentation to Read

| Document                              | Time   | Use Case             |
| ------------------------------------- | ------ | -------------------- |
| `docs/API_AUTHENTICATION_CONTRACT.md` | 30 min | Understand APIs      |
| `apps/web/AUTHENTICATION_GUIDE.md`    | 1 hour | Learn implementation |
| This file                             | 10 min | Get started quickly  |

---

## Key Files Reference

| File                       | Purpose                             |
| -------------------------- | ----------------------------------- |
| `auth-context.tsx`         | Authentication logic (useAuth hook) |
| `FormFields.tsx`           | Reusable form components            |
| `ProtectedRoute.tsx`       | Route protection components         |
| `login/page.tsx`           | Login form page                     |
| `register/page.tsx`        | Registration form page (3-step)     |
| `forgot-password/page.tsx` | Password reset page (4-step)        |
| `dashboard/page.tsx`       | Protected dashboard example         |

---

## 🎯 You're All Set!

Everything is ready to use. No additional configuration needed.

**Start building on top of this authentication system! 🚀**

---

**Questions?** Check the comprehensive guide: `apps/web/AUTHENTICATION_GUIDE.md`
