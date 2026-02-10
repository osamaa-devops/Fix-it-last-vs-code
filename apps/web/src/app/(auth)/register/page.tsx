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
  FormSelect,
  OTPInput,
  PasswordStrengthMeter,
} from '@/components/form/FormFields';
import { z } from 'zod';

const registerSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    phoneNumber: z.string().min(10, 'Invalid phone number'),
    role: z.enum(['CUSTOMER', 'HANDYMAN'], {
      errorMap: () => ({ message: 'Please select a role' }),
    }),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain an uppercase letter')
      .regex(/[a-z]/, 'Password must contain a lowercase letter')
      .regex(/\d/, 'Password must contain a number')
      .regex(/[!@#$%^&*]/, 'Password must contain a special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

type RegisterStep = 'form' | 'otp' | 'success';

export default function RegisterPage() {
  const router = useRouter();
  const { register, verifyOtp, error: authError, clearError } = useAuth();

  const [step, setStep] = useState<RegisterStep>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [registrationToken, setRegistrationToken] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [registeredRole, setRegisteredRole] = useState<'CUSTOMER' | 'HANDYMAN'>('CUSTOMER');

  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    fullName: '',
    phoneNumber: '',
    role: 'CUSTOMER',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});

  const validateForm = () => {
    try {
      registerSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<RegisterFormData> = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof RegisterFormData;
          fieldErrors[path] = err.message as any;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (errors[name as keyof RegisterFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await register({
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
      });

      setRegistrationToken(response.registrationToken);
      setRegisteredEmail(formData.email);
      setRegisteredRole(formData.role);
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
    setOtpError(null);

    if (otp.length !== 6) {
      setOtpError('Please enter a 6-digit OTP');
      return;
    }

    try {
      setIsLoading(true);
      await verifyOtp(registeredEmail, otp, registrationToken);
      setStep('success');
    } catch (err) {
      setOtpError('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsLoading(true);
      const response = await register({
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
      });
      setRegistrationToken(response.registrationToken);
      setOtp('');
      setOtpError(null);
    } catch (err) {
      setOtpError('Failed to resend OTP. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    router.push('/dashboard');
  };

  // Step 1: Registration Form
  if (step === 'form') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
        <FormContainer
          title="Create Your Account"
          subtitle={`Join Fix It${registeredRole === 'HANDYMAN' ? ' as a Handyman' : ' as a Customer'}`}
        >
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {authError && <FormError message={authError} />}

            <FormInput
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              label="Email Address"
              required
              disabled={isLoading}
            />

            <FormInput
              type="text"
              name="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              label="Full Name"
              required
              disabled={isLoading}
            />

            <FormInput
              type="tel"
              name="phoneNumber"
              placeholder="+1 (555) 123-4567"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={errors.phoneNumber}
              label="Phone Number"
              required
              disabled={isLoading}
            />

            <FormSelect
              name="role"
              value={formData.role}
              onChange={handleChange}
              error={errors.role}
              label="I am a"
              required
              options={[
                { value: 'CUSTOMER', label: 'Customer looking for services' },
                { value: 'HANDYMAN', label: 'Handyman offering services' },
              ]}
              disabled={isLoading}
            />

            <div>
              <FormInput
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                label="Password"
                required
                disabled={isLoading}
              />
              {formData.password && <PasswordStrengthMeter password={formData.password} />}
            </div>

            <FormInput
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              label="Confirm Password"
              required
              disabled={isLoading}
            />

            <FormButton
              type="submit"
              isLoading={isLoading}
              loadingText="Creating account..."
              fullWidth
            >
              Create Account
            </FormButton>

            <p className="text-center text-gray-600 text-sm">
              Already have an account?{' '}
              <FormLink href="/auth/login">Sign in here</FormLink>
            </p>
          </form>
        </FormContainer>
      </div>
    );
  }

  // Step 2: OTP Verification
  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
        <FormContainer
          title="Verify Your Email"
          subtitle={`Enter the 6-digit code sent to ${registeredEmail}`}
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

            <p className="text-center text-gray-600 text-sm">
              <FormLink href="/auth/register">Change email</FormLink>
            </p>
          </form>
        </FormContainer>
      </div>
    );
  }

  // Step 3: Success
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
      <FormContainer title="Welcome!" subtitle={`${formData.fullName}, your account is ready`}>
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

          <div>
            <p className="text-gray-600 text-sm mb-3">
              {registeredRole === 'HANDYMAN'
                ? 'Your handyman account has been created successfully. Complete your profile to start accepting jobs.'
                : 'Your customer account has been created successfully. You can now browse and book services.'}
            </p>
          </div>

          <FormButton onClick={handleContinue} fullWidth>
            Go to Dashboard
          </FormButton>

          <p className="text-xs text-gray-500 pt-3">
            Role: <strong>{registeredRole}</strong>
          </p>
        </div>
      </FormContainer>
    </div>
  );
}
