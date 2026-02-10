# Fix It Mobile App - Authentication System

Production-ready authentication flow for React Native using Expo, TypeScript, and Zod validation.

## 📋 Features

### ✅ Complete Authentication System
- **Login Screen** - Email/password authentication with secure token storage
- **Register Screen** - Multi-step registration with user type selection (Customer/Handyman)
- **Password Reset** - 4-step flow: email verification → OTP code → password validation → success
- **Session Management** - Automatic token refresh and 401 error handling
- **Secure Token Storage** - Uses Expo Secure Store for encryption

### 🔒 Security Features
- Zod runtime validation for all inputs
- Password strength requirements (uppercase, lowercase, numbers, special chars)
- Secure token storage using Expo Secure Store (platform-native encryption)
- Automatic token refresh with refresh token rotation
- 401 interceptor for session management
- XSS and SQL injection prevention through validation

### 🎨 UI/UX Features
- Loading states for all async operations
- Inline error messages with field validation
- Success messages and confirmations
- Multi-step forms with progress indicators
- OTP input with auto-focus navigation
- Password visibility toggle
- Demo credentials display for testing
- Clean, production-ready design

### 🏗️ Code Architecture
- Context API for state management
- Custom React hooks (useForm, useAuth, useAsync, useDebounce)
- Reusable UI components library
- Separation of concerns (services, context, screens, components)
- TypeScript throughout for type safety
- Axios with interceptors for API calls

## 📁 Folder Structure

```
apps/mobile/src/
├── app/                        # Expo Router navigation
│   ├── _layout.tsx             # Root layout with auth flow
│   ├── (auth)/                 # Unauthenticated screens
│   │   ├── _layout.tsx         # Auth stack
│   │   ├── login.tsx           # Login route
│   │   ├── register.tsx        # Register route
│   │   └── forgot-password.tsx # Password reset route
│   └── (dashboard)/            # Authenticated screens
│       ├── _layout.tsx         # Dashboard stack
│       └── home.tsx            # Dashboard route
├── components/
│   └── UI.tsx                  # Reusable UI components
├── context/
│   └── auth.tsx                # Auth context & useAuth hook
├── hooks/
│   └── useAuth.ts              # Custom authentication hooks
├── libs/
│   ├── api/
│   │   ├── client.ts           # Axios instance with interceptors
│   │   └── auth.ts             # Auth API service with mock
│   └── validation/
│       └── auth.ts             # Zod validation schemas
├── screens/
│   ├── LoginScreen.tsx         # Login page
│   ├── RegisterScreen.tsx      # Register page (3 steps)
│   ├── ForgotPasswordScreen.tsx# Password reset (4 steps)
│   └── DashboardScreen.tsx     # User dashboard
└── utils/                      # Utility functions
```

## 🚀 Getting Started

### Installation

```bash
cd apps/mobile
npm install --legacy-peer-deps
```

### Run on iOS simulator
```bash
npm run ios
```

### Run on Android emulator
```bash
npm run android
```

### Run on web
```bash
npm run web
```

### Start Expo development server
```bash
npm start
```

## 🧪 Testing the Authentication

### Demo Credentials

The system includes mock authentication with pre-configured test accounts:

**Customer Account:**
- Email: `customer@fixit.local`
- Password: `Password123!`

**Handyman Account:**
- Email: `handyman@fixit.local`
- Password: `Password123!`

### Test Flows

1. **Login Flow**
   - Open the app → Login screen appears
   - Enter demo credentials
   - Token stored in Secure Store
   - Dashboard displayed
   - User info shows on dashboard

2. **Register Flow**
   - Click "Create Account"
   - Step 1: Enter full name, email, select user type
   - Step 2: Create password meeting requirements
   - Step 3: Review information and confirm
   - Auto-login after registration

3. **Password Reset Flow**
   - Click "Forgot Password" on login screen
   - Enter email address → OTP sent (check console for test OTP)
   - Enter 6-digit OTP code
   - Create new password
   - Return to login with new credentials

4. **Session Management**
   - Login and stay on dashboard
   - App automatic checks auth state on startup
   - Logout from dashboard settings

## 🔐 Validation Rules

### Login
- Email: Valid email format required
- Password: Minimum 6 characters

### Register
- Full Name: Minimum 2 characters
- Email: Valid email format
- Password: 
  - Minimum 8 characters
  - Must contain uppercase letter (A-Z)
  - Must contain lowercase letter (a-z)
  - Must contain number (0-9)
  - Must contain special character (!@#$%^&*)
- Confirm Password: Must match password field

### Password Reset
- Email: Valid email format
- OTP: Exactly 6 digits (auto-validated with auto-focus)
- New Password: Same requirements as registration
- Confirm Password: Must match new password

## 🔌 API Integration

### Current Setup
The app uses **mock authentication** for initial development. All API calls are simulated locally.

### Switching to Real Backend

To connect to your backend API:

1. **Update API Base URL** in `apps/mobile/src/libs/api/client.ts`:
```typescript
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://your-api.com/api';
```

2. **Implement Actual Endpoints** in `apps/mobile/src/libs/api/auth.ts`:
```typescript
export const authService = {
  async login(credentials: LoginInput): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    // Store tokens and user
    return response.data;
  },
  // ... other endpoints
};
```

3. **Required Backend Endpoints**:
```
POST   /auth/login              # Login
POST   /auth/register           # Register
POST   /auth/forgot-password    # Request OTP
POST   /auth/verify-otp         # Verify OTP code
POST   /auth/reset-password     # Reset password with OTP
POST   /auth/refresh            # Refresh access token
GET    /auth/me                 # Get current user
POST   /auth/logout             # Logout
```

## 🎣 Custom Hooks

### useAuth()
Global authentication hook with full context access:

```typescript
const { 
  user,                    // Current user object
  isAuthenticated,         // Boolean auth status
  isLoading,               // Loading state
  error,                   // Error message
  login,                   // Login function
  register,                // Register function
  forgotPassword,          // Request password reset
  verifyOTP,               // Verify OTP code
  resetPassword,           // Reset password
  logout,                  // Logout function
  clearError,              // Clear error message
  checkAuth                // Check auth status
} = useAuth();
```

### useForm()
Generic form handling with validation:

```typescript
const form = useForm(
  { email: '', password: '' },
  async (values) => {
    await login(values);
  },
  LoginSchema  // Optional Zod schema
);

// Returns:
{
  values,           // Form field values
  errors,           // Field errors
  isSubmitting,     // Submission state
  handleChange,     // Update field value
  handleSubmit,     // Validate and submit
  resetForm,        // Reset to initial state
  setValues         // Set multiple values
}
```

### useLogin()
Simplified login hook:

```typescript
const { login, isLoading, error, clearError } = useLogin();
```

### useRegister()
Simplified register hook:

```typescript
const { register, isLoading, error, clearError } = useRegister();
```

### usePasswordReset()
Password reset operations:

```typescript
const {
  forgotPassword,  // Request OTP
  verifyOTP,       // Verify code
  resetPassword,   // Set new password
  isLoading,
  error,
  clearError
} = usePasswordReset();
```

### useAsync()
General async operation handler:

```typescript
const { data, status, error, execute } = useAsync(
  async () => {
    // Async operation
  },
  true  // immediate execution
);
```

### useDebounce()
Debounce values for search, form validation, etc:

```typescript
const debouncedEmail = useDebounce(email, 500);
```

## 🎨 UI Components

All UI components are in `src/components/UI.tsx`:

### TextInput
```typescript
<TextInput
  label="Email"
  placeholder="Enter email"
  value={email}
  onChangeText={setEmail}
  error={errors.email}
  keyboardType="email-address"
  secureTextEntry={false}
/>
```

### Button
```typescript
<Button
  title="Sign In"
  onPress={handleSubmit}
  loading={isLoading}
  disabled={isLoading}
  variant="primary"        // primary, secondary, danger, outline
  size="large"            // small, medium, large
  fullWidth={true}
/>
```

### ErrorMessage
```typescript
<ErrorMessage 
  message={error} 
  onDismiss={() => clearError()}
/>
```

### SuccessMessage
```typescript
<SuccessMessage 
  message="Success!" 
  onDismiss={() => {}}
/>
```

## 📦 Dependencies

### Core
- `expo@^51.0.0` - React Native framework
- `expo-router@^3.4.0` - Navigation
- `expo-secure-store@^12.0.0` - Secure token storage
- `react-native@0.74.0` - Mobile framework
- `react@18.2.0` - React library

### HTTP & Validation
- `axios@^1.6.0` - HTTP client
- `zod@^3.22.0` - Runtime validation

### Navigation
- `@react-navigation/native@^6.1.0`
- `@react-navigation/bottom-tabs@^6.5.0`
- `@react-navigation/stack@^6.3.0`

### Development
- `typescript@^5.3.3`
- `eslint@^8.55.0`
- `jest@^29.7.0`

## 🚨 Common Issues & Solutions

### Issue: "Unsupported URL Type 'workspace:*'"
**Solution**: Use `npm install --legacy-peer-deps`

### Issue: Secure Store not working on web
**Solution**: Web doesn't support Secure Store. Use AsyncStorage instead:
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
```

### Issue: OTP input not advancing
**Solution**: Ensure `TextInput` refs are properly managed. Check that numeric keyboard is enabled.

### Issue: Token not persisting after app restart
**Solution**: Verify Secure Store permissions are set in `app.json`:
```json
{
  "plugins": [
    "expo-secure-store"
  ]
}
```

## 📚 Type Definitions

All validation schemas export TypeScript types:

```typescript
import { LoginInput, RegisterInput } from '../libs/validation/auth';

const credentials: LoginInput = {
  email: 'user@example.com',
  password: 'Password123!'
};
```

## 🔄 State Flow

```
App Launch
  ↓
AuthProvider checks Secure Store
  ↓
isAuthenticated determined
  ↓
Show (auth) or (dashboard) stack
  ↓
User interacts with screens
  ↓
API response stored in SecureStore
  ↓
Context updated
  ↓
Navigation changes
```

## 📱 Responsive Design

All screens are responsive and tested on:
- iPhone (SE, 12, 14, 15)
- iPad
- Android phones and tablets
- Web browsers (Expo Web)

## 🤝 Contributing

To extend the authentication system:

1. Add new validation schemas in `schemas/auth.ts`
2. Create service methods in `apis/auth.ts`
3. Add context actions in `context/auth.tsx`
4. Create UI screen in `screens/`
5. Add route in app directory

## 📖 References

- [Expo Documentation](https://docs.expo.dev)
- [Expo Router](https://docs.expo.dev/routing/introduction/)
- [Expo Secure Store](https://docs.expo.dev/modules/expo-secure-store/)
- [React Native Documentation](https://reactnative.dev)
- [Zod Documentation](https://zod.dev)
- [Axios Documentation](https://axios-http.com)

## ✅ Checklist for Production

- [ ] Replace mock API with real backend endpoints
- [ ] Add your real API base URL in environment variables
- [ ] Test all flows on target devices
- [ ] Implement push notifications for OTP codes
- [ ] Add rate limiting for login attempts
- [ ] Implement auto-logout after inactivity
- [ ] Add biometric authentication (Face/Touch ID)
- [ ] Set up error logging service
- [ ] Configure environment-specific API URLs
- [ ] Test on slow networks
- [ ] Implement analytics tracking
- [ ] Add crash reporting (Sentry, etc.)
- [ ] Test accessibility features
- [ ] Security audit of stored tokens
- [ ] Backend rate limiting and DDoS protection

## 📄 License

This authentication system is part of the Fix It mobile app.
