# Fix It Authentication API Contract

**Version:** 1.0.0  
**Status:** Production Ready  
**Last Updated:** February 10, 2026

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Authentication Flow](#authentication-flow)
3. [Base URL & Headers](#base-url--headers)
4. [Endpoints](#endpoints)
5. [Data Models](#data-models)
6. [Error Handling](#error-handling)
7. [Status Codes](#status-codes)
8. [Security](#security)

---

## Overview

The Fix It authentication system provides secure user registration, login, and account management with JWT-based tokens and OTP verification for sensitive operations.

### Key Features

- ✅ Dual role support (CUSTOMER, HANDYMAN)
- ✅ JWT access tokens (15 minutes)
- ✅ Refresh tokens (7 days)
- ✅ OTP verification for registration
- ✅ Password reset with OTP
- ✅ Role-based response formatting
- ✅ Secure token storage (httpOnly cookies)

---

## Authentication Flow

### Registration Flow

```
User (Email, Password, Role)
    ↓
Register Endpoint (returns OTP)
    ↓
OTP Verification Endpoint (returns tokens)
    ↓
JWT Access Token + Refresh Token
```

### Login Flow

```
User (Email, Password)
    ↓
Login Endpoint
    ↓
Success: Return JWT Tokens + Role-specific response
Failure: Return error with reason
```

### Password Reset Flow

```
User (Email)
    ↓
Request Reset Endpoint (sends OTP)
    ↓
OTP Verification Endpoint
    ↓
Reset Password Endpoint
    ↓
Success: Tokens returned, user logged in
```

### Token Refresh Flow

```
Expired Access Token
    ↓
Refresh Token Endpoint (uses refresh token)
    ↓
New Access Token + New Refresh Token
```

---

## Base URL & Headers

### Base URL

```
https://api.fixit.local/v1/auth
```

### Required Headers

```json
{
  "Content-Type": "application/json",
  "Accept": "application/json"
}
```

### Authorization Header

```
Authorization: Bearer {access_token}
```

---

## Endpoints

### 1. Register Endpoint

**Endpoint:** `POST /register`

**Description:** Create a new user account (Customer or Handyman)

**Request Body:**

```json
{
  "email": "customer@example.com",
  "password": "SecurePassword123!",
  "confirmPassword": "SecurePassword123!",
  "role": "CUSTOMER",
  "fullName": "John Doe",
  "phoneNumber": "+1234567890"
}
```

**Path Description:**

- `email` (string, required): Unique email address
- `password` (string, required): Minimum 8 characters, must include uppercase, lowercase, number, special character
- `confirmPassword` (string, required): Must match password
- `role` (enum, required): `CUSTOMER` or `HANDYMAN`
- `fullName` (string, required): User's full name
- `phoneNumber` (string, required): International format

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Registration successful. OTP sent to email.",
  "data": {
    "registrationToken": "temp_token_xyz123",
    "expiresIn": 300,
    "email": "customer@example.com",
    "requiresOtpVerification": true
  }
}
```

**Error Responses:**

**409 Conflict - Email Already Exists:**

```json
{
  "success": false,
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "message": "Email already registered",
    "suggestion": "Try logging in or use password reset"
  }
}
```

**400 Bad Request - Validation Error:**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "password": "Password must contain uppercase, lowercase, number, and special character",
      "email": "Invalid email format"
    }
  }
}
```

---

### 2. Verify OTP (Registration)

**Endpoint:** `POST /verify-otp`

**Description:** Verify OTP sent during registration

**Request Body:**

```json
{
  "email": "customer@example.com",
  "otp": "123456",
  "registrationToken": "temp_token_xyz123"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "user": {
      "id": "uuid-1234-5678",
      "email": "customer@example.com",
      "role": "CUSTOMER",
      "fullName": "John Doe",
      "phoneNumber": "+1234567890",
      "status": "ACTIVE",
      "createdAt": "2026-02-10T10:30:00Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 900,
      "tokenType": "Bearer"
    }
  }
}
```

**Error Responses:**

**400 Bad Request - Invalid OTP:**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_OTP",
    "message": "OTP is invalid or expired",
    "attemptsRemaining": 2
  }
}
```

**400 Bad Request - Too Many Attempts:**

```json
{
  "success": false,
  "error": {
    "code": "OTP_ATTEMPTS_EXCEEDED",
    "message": "Too many failed OTP attempts. Request a new OTP.",
    "retryAfter": 300
  }
}
```

---

### 3. Login Endpoint

**Endpoint:** `POST /login`

**Description:** Authenticate user with email and password

**Request Body:**

```json
{
  "email": "customer@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK) - CUSTOMER Role:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid-1234-5678",
      "email": "customer@example.com",
      "role": "CUSTOMER",
      "fullName": "John Doe",
      "phoneNumber": "+1234567890",
      "status": "ACTIVE",
      "avatar": "https://cdn.fixit.local/avatars/uuid-1234-5678.jpg",
      "createdAt": "2026-02-10T10:30:00Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 900,
      "tokenType": "Bearer"
    }
  }
}
```

**Response (200 OK) - HANDYMAN Role:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid-5678-1234",
      "email": "handyman@example.com",
      "role": "HANDYMAN",
      "fullName": "Mike Smith",
      "phoneNumber": "+1234567890",
      "status": "ACTIVE",
      "avatar": "https://cdn.fixit.local/avatars/uuid-5678-1234.jpg",
      "verified": true,
      "rating": 4.8,
      "profileCompletion": 95,
      "services": ["Plumbing", "Electrical", "HVAC"],
      "createdAt": "2026-02-10T10:30:00Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 900,
      "tokenType": "Bearer"
    }
  }
}
```

**Error Responses:**

**401 Unauthorized - Invalid Credentials:**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email or password is incorrect",
    "attemptsRemaining": 4
  }
}
```

**403 Forbidden - Account Suspended:**

```json
{
  "success": false,
  "error": {
    "code": "ACCOUNT_SUSPENDED",
    "message": "Your account has been suspended",
    "reason": "Suspicious activity detected",
    "supportEmail": "support@fixit.local"
  }
}
```

**429 Too Many Requests - Rate Limited:**

```json
{
  "success": false,
  "error": {
    "code": "TOO_MANY_ATTEMPTS",
    "message": "Too many login attempts. Please try again later.",
    "retryAfter": 300
  }
}
```

---

### 4. Request Password Reset

**Endpoint:** `POST /forgot-password`

**Description:** Request password reset OTP

**Request Body:**

```json
{
  "email": "customer@example.com"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Password reset OTP sent to your email",
  "data": {
    "resetToken": "reset_token_xyz123",
    "expiresIn": 1800,
    "email": "customer@example.com"
  }
}
```

**Error Responses:**

**404 Not Found - User Not Found:**

```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "No account found with this email",
    "suggestion": "Please register or check your email"
  }
}
```

---

### 5. Verify Password Reset OTP

**Endpoint:** `POST /verify-reset-otp`

**Description:** Verify OTP for password reset

**Request Body:**

```json
{
  "email": "customer@example.com",
  "otp": "123456",
  "resetToken": "reset_token_xyz123"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "OTP verified successfully",
  "data": {
    "verificationToken": "verify_token_xyz123",
    "expiresIn": 1800
  }
}
```

---

### 6. Reset Password

**Endpoint:** `POST /reset-password`

**Description:** Set new password after OTP verification

**Request Body:**

```json
{
  "email": "customer@example.com",
  "verificationToken": "verify_token_xyz123",
  "newPassword": "NewSecurePassword456!",
  "confirmPassword": "NewSecurePassword456!"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Password reset successfully",
  "data": {
    "user": {
      "id": "uuid-1234-5678",
      "email": "customer@example.com",
      "role": "CUSTOMER"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 900,
      "tokenType": "Bearer"
    }
  }
}
```

---

### 7. Refresh Access Token

**Endpoint:** `POST /refresh-token`

**Description:** Get new access token using refresh token

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900,
    "tokenType": "Bearer"
  }
}
```

**Error Responses:**

**401 Unauthorized - Invalid Refresh Token:**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_REFRESH_TOKEN",
    "message": "Refresh token is invalid or expired",
    "action": "Please login again"
  }
}
```

---

### 8. Logout

**Endpoint:** `POST /logout`

**Description:** Invalidate refresh token (optional - can be client-side only)

**Headers:**

```
Authorization: Bearer {access_token}
```

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 9. Get Current User

**Endpoint:** `GET /me`

**Description:** Get current authenticated user details

**Headers:**

```
Authorization: Bearer {access_token}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-1234-5678",
      "email": "customer@example.com",
      "role": "CUSTOMER",
      "fullName": "John Doe",
      "phoneNumber": "+1234567890",
      "status": "ACTIVE",
      "avatar": "https://cdn.fixit.local/avatars/uuid-1234-5678.jpg",
      "createdAt": "2026-02-10T10:30:00Z"
    }
  }
}
```

**Error Responses:**

**401 Unauthorized - No Token:**

```json
{
  "success": false,
  "error": {
    "code": "MISSING_TOKEN",
    "message": "Authorization token is required"
  }
}
```

**401 Unauthorized - Invalid Token:**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_TOKEN",
    "message": "Authorization token is invalid or expired"
  }
}
```

---

## Data Models

### User Model

```typescript
interface User {
  id: string; // UUID
  email: string; // Unique email
  role: "CUSTOMER" | "HANDYMAN" | "ADMIN";
  fullName: string;
  phoneNumber: string; // International format
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  avatar?: string; // URL to avatar image
  createdAt: string; // ISO 8601 timestamp
}
```

### Customer-Specific Fields

```typescript
interface Customer extends User {
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  preferences?: {
    notifications: boolean;
    newsletter: boolean;
  };
}
```

### Handyman-Specific Fields

```typescript
interface Handyman extends User {
  verified: boolean;
  rating: number; // 0-5 stars
  completedJobs: number;
  profileCompletion: number; // 0-100%
  services: string[]; // Service categories
  hourlyRate: number;
  availability: {
    monday: { start: string; end: string }[];
    tuesday: { start: string; end: string }[];
    // ... other days
  };
}
```

### Token Model

```typescript
interface AuthTokens {
  accessToken: string; // JWT, expires in 15 minutes
  refreshToken: string; // JWT, expires in 7 days
  expiresIn: number; // Seconds until expiration
  tokenType: "Bearer";
}
```

### JWT Payload (Access Token)

```typescript
interface JWTAccessPayload {
  sub: string; // User ID
  email: string;
  role: "CUSTOMER" | "HANDYMAN" | "ADMIN";
  iat: number; // Issued at
  exp: number; // Expiration (15 min)
}
```

### JWT Payload (Refresh Token)

```typescript
interface JWTRefreshPayload {
  sub: string; // User ID
  iat: number; // Issued at
  exp: number; // Expiration (7 days)
}
```

### Registration Request

```typescript
interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  role: "CUSTOMER" | "HANDYMAN";
  fullName: string;
  phoneNumber: string;
}
```

### Login Request

```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

### Error Model

```typescript
interface ApiError {
  success: false;
  error: {
    code: string; // Machine-readable error code
    message: string; // Human-readable message
    details?: Record<string, string>; // Field-level errors
    suggestion?: string; // What user should do next
    retryAfter?: number; // Seconds to wait before retry
    attemptsRemaining?: number;
    supportEmail?: string;
  };
}
```

---

## Error Handling

### Error Categories

#### 1. **Validation Errors (400)**

- Field validation failures
- Invalid data format
- Missing required fields

#### 2. **Authentication Errors (401)**

- Invalid credentials
- Missing/expired access token
- Invalid refresh token

#### 3. **Authorization Errors (403)**

- Account suspended
- Insufficient permissions
- Account locked

#### 4. **Conflict Errors (409)**

- Email already registered
- Duplicate resource

#### 5. **Rate Limiting (429)**

- Too many login attempts
- Too many OTP verifications
- API quota exceeded

#### 6. **Server Errors (500)**

- Internal server error
- Database connection failure
- External service timeout

### Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": {},
    "suggestion": "What to do next",
    "timestamp": "2026-02-10T10:30:00Z"
  }
}
```

### Common Error Codes

| Code                    | HTTP Status | Meaning                  |
| ----------------------- | ----------- | ------------------------ |
| `VALIDATION_ERROR`      | 400         | Invalid request data     |
| `INVALID_CREDENTIALS`   | 401         | Wrong email/password     |
| `MISSING_TOKEN`         | 401         | No auth token provided   |
| `INVALID_TOKEN`         | 401         | Token is invalid/expired |
| `INVALID_OTP`           | 400         | Wrong OTP code           |
| `OTP_ATTEMPTS_EXCEEDED` | 429         | Too many OTP tries       |
| `EMAIL_ALREADY_EXISTS`  | 409         | Email in use             |
| `USER_NOT_FOUND`        | 404         | User doesn't exist       |
| `ACCOUNT_SUSPENDED`     | 403         | Account locked           |
| `TOO_MANY_ATTEMPTS`     | 429         | Rate limited             |
| `INVALID_REFRESH_TOKEN` | 401         | Refresh token expired    |

---

## Status Codes

| Code    | Meaning             | Use Case                |
| ------- | ------------------- | ----------------------- |
| **200** | OK                  | Successful request      |
| **201** | Created             | New resource created    |
| **400** | Bad Request         | Validation failed       |
| **401** | Unauthorized        | Auth failed/expired     |
| **403** | Forbidden           | Access denied           |
| **404** | Not Found           | Resource not found      |
| **409** | Conflict            | Resource already exists |
| **429** | Too Many Requests   | Rate limited            |
| **500** | Internal Error      | Server error            |
| **503** | Service Unavailable | Maintenance/outage      |

---

## Security

### Password Requirements

```
✓ Minimum 8 characters
✓ At least 1 uppercase letter (A-Z)
✓ At least 1 lowercase letter (a-z)
✓ At least 1 number (0-9)
✓ At least 1 special character (!@#$%^&*)
✓ No common patterns (password123, qwerty, etc.)
```

### Token Security

```
✓ Access tokens are short-lived (15 minutes)
✓ Refresh tokens are long-lived (7 days)
✓ Tokens stored in httpOnly cookies (not localStorage)
✓ CSRF protection on state-changing endpoints
✓ HTTPS only
```

### OTP Security

```
✓ OTP is 6 digits
✓ OTP expires after 10 minutes
✓ Maximum 3 failed attempts
✓ Rate limited: 5 OTP requests per hour
✓ OTP sent via email (second channel)
```

### Request Security

```
✓ Rate limiting on auth endpoints
✓ SQL injection protection
✓ CORS configured
✓ Input sanitization
✓ Request logging (no passwords)
```

### Password Reset Security

```
✓ Uses OTP verification (not email link)
✓ Token expires after 30 minutes
✓ Requires email verification
✓ Password immediately changed
✓ Old sessions invalidated
```

---

## Implementation Notes

### Token Storage (Next.js)

**Server-side (Recommended):**

```typescript
// Store in httpOnly cookies
response.cookies.set("accessToken", token, {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  maxAge: 900,
});
```

**Client-side (Fallback):**

```typescript
// Store in localStorage if httpOnly not available
localStorage.setItem("accessToken", token);
```

### Axios Interceptor

```typescript
// Request interceptor adds token
api.interceptors.request.use((config) => {
  const token = getToken(); // from cookies or localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor handles 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try to refresh token
      // If refresh fails, redirect to login
    }
    return Promise.reject(error);
  }
);
```

### Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=https://api.fixit.local/v1
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_OTP_EXPIRY=600
NEXT_PUBLIC_ACCESS_TOKEN_EXPIRY=900
NEXT_PUBLIC_REFRESH_TOKEN_EXPIRY=604800
```

---

## Testing Scenarios

### Happy Path - Customer Registration

```
1. POST /register (email, password, role=CUSTOMER)
2. POST /verify-otp (otp from email)
3. Returns: user + tokens
4. Navigate to dashboard
```

### Happy Path - Handyman Login

```
1. POST /login (email, password)
2. Returns: handyman user + tokens
3. Navigate to handyman dashboard
4. Show services, rating, verification status
```

### Error Path - Password Reset

```
1. POST /forgot-password
2. POST /verify-reset-otp
3. POST /reset-password
4. Returns: new tokens
5. User logged in automatically
```

### Token Refresh

```
1. Access token expires (15 min)
2. Axios interceptor detects 401
3. POST /refresh-token (with refresh token)
4. New access token generated
5. Original request retried
```

---

**This contract is ready for backend implementation and frontend integration.**
