'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  FormInput,
  FormButton,
  FormError,
  FormContainer,
  FormLink,
  OTPInput,
  PasswordStrengthMeter,
} from '@/components/form/FormFields';
import { z } from 'zod';

const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain an uppercase letter')
      .regex(/[a-z]/, 'Password must contain a lowercase letter')
      .regex(/\d/, 'Password must contain a number')
      .regex(/[!@#$%^&*]/, 'Password must contain a special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordStep = 'email' | 'otp' | 'password' | 'success';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const {
    forgotPassword,
    verifyResetOtp,
    resetPassword,
    error: authError,
    clearError,
  } = useAuth();

  const [step, setStep] = useState<ResetPasswordStep>('email');
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Email
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [resetToken, setResetToken] = useState('');

  // Step 2: OTP
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [verificationToken, setVerificationToken] = useState('');

  // Step 3: Password
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setEmailError('');

    const validation = emailSchema.safeParse({ email });
    if (!validation.success) {
      setEmailError(validation.error.errors[0].message);
      return;
    }

    try {
      setIsLoading(true);
      const response = await forgotPassword(email);
      setResetToken(response.resetToken);
      setStep('otp');
    } catch (err) {
      // Error handled by auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setOtpError('');

    const validation = otpSchema.safeParse({ otp });
    if (!validation.success) {
      setOtpError(validation.error.errors[0].message);
      return;
    }

    try {
      setIsLoading(true);
      const response = await verifyResetOtp(email, otp, resetToken);
      setVerificationToken(response.verificationToken);
      setStep('password');
    } catch (err) {
      setOtpError('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setPasswordError('');
    setConfirmPasswordError('');

    const validation = resetPasswordSchema.safeParse({
      newPassword: password,
      confirmPassword,
    });

    if (!validation.success) {
      validation.error.errors.forEach((err) => {
        if (err.path[0] === 'newPassword') {
          setPasswordError(err.message);
        } else if (err.path[0] === 'confirmPassword') {
          setConfirmPasswordError(err.message);
        }
      });
      return;
    }

    try {
      setIsLoading(true);
      await resetPassword(email, password, verificationToken);
      setStep('success');
    } catch (err) {
      setPasswordError('Failed to reset password. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsLoading(true);
      const response = await forgotPassword(email);
      setResetToken(response.resetToken);
      setOtp('');
      setOtpError('');
    } catch (err) {
      setOtpError('Failed to resend OTP. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Email
  if (step === 'email') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
        <FormContainer
          title="Reset Your Password"
          subtitle="Enter your email address to get started"
        >
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {authError && <FormError message={authError} />}

            <FormInput
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
              }}
              error={emailError}
              label="Email Address"
              required
              disabled={isLoading}
            />

            <FormButton
              type="submit"
              isLoading={isLoading}
              loadingText="Sending OTP..."
              fullWidth
            >
              Continue
            </FormButton>

            <p className="text-center text-gray-600 text-sm">
              Remember your password?{' '}
              <FormLink href="/auth/login">Sign in instead</FormLink>
            </p>
          </form>
        </FormContainer>
      </div>
    );
  }

  // Step 2: OTP
  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
        <FormContainer
          title="Verify Your Email"
          subtitle={`Enter the 6-digit code sent to ${email}`}
        >
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            {authError && <FormError message={authError} />}

            <OTPInput
              value={otp}
              onChange={setOtp}
              length={6}
              error={otpError || undefined}
            />

            <FormButton
              type="submit"
              isLoading={isLoading}
              loadingText="Verifying..."
              disabled={otp.length !== 6}
              fullWidth
            >
              Verify OTP
            </FormButton>

            <div className="space-y-3">
              <p className="text-center text-gray-600 text-sm">
                Didn't receive the code?
              </p>
              <FormButton
                type="button"
                variant="secondary"
                onClick={handleResendOtp}
                isLoading={isLoading}
                loadingText="Sending..."
                fullWidth
              >
                Resend OTP
              </FormButton>
            </div>
          </form>
        </FormContainer>
      </div>
    );
  }

  // Step 3: New Password
  if (step === 'password') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
        <FormContainer
          title="Set New Password"
          subtitle="Create a strong password for your account"
        >
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {authError && <FormError message={authError} />}

            <div>
              <FormInput
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                error={passwordError}
                label="New Password"
                required
                disabled={isLoading}
              />
              {password && <PasswordStrengthMeter password={password} />}
            </div>

            <FormInput
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (confirmPasswordError) setConfirmPasswordError('');
              }}
              error={confirmPasswordError}
              label="Confirm Password"
              required
              disabled={isLoading}
            />

            <FormButton
              type="submit"
              isLoading={isLoading}
              loadingText="Resetting..."
              fullWidth
            >
              Reset Password
            </FormButton>
          </form>
        </FormContainer>
      </div>
    );
  }

  // Step 4: Success
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
      <FormContainer
        title="Password Reset"
        subtitle="Your password has been successfully reset"
      >
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <p className="text-gray-600 text-sm">
            You can now sign in with your new password.
          </p>

          <FormButton onClick={() => router.push('/auth/login')} fullWidth>
            Back to Sign In
          </FormButton>
        </div>
      </FormContainer>
    </div>
  );
}
