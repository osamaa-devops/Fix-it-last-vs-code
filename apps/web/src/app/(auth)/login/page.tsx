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
  FormDivider,
} from '@/components/form/FormFields';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, error: authError, clearError } = useAuth();
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    try {
      loginSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<LoginFormData> = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof LoginFormData;
          fieldErrors[path] = err.message as any;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      await login(formData.email, formData.password);
      
      // Redirect based on role (we'll handle this in middleware)
      router.push('/dashboard');
    } catch (err) {
      // Error is handled by auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear field error when user starts typing
    if (errors[name as keyof LoginFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
      <FormContainer
        title="Welcome Back"
        subtitle="Sign in to your Fix It account"
        className="animate-fade-in"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="flex justify-end">
            <FormLink href="/auth/forgot-password" className="text-sm">
              Forgot password?
            </FormLink>
          </div>

          <FormButton
            type="submit"
            isLoading={isLoading}
            loadingText="Signing in..."
            fullWidth
          >
            Sign In
          </FormButton>

          <FormDivider text="Or" />

          <p className="text-center text-gray-600 text-sm">
            Don't have an account?{' '}
            <FormLink href="/auth/register">Create one now</FormLink>
          </p>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center mb-3">Demo Credentials</p>
          <div className="space-y-2 text-sm bg-gray-50 p-3 rounded">
            <p>
              <strong>Customer:</strong> customer@fixit.local / Password123!
            </p>
            <p>
              <strong>Handyman:</strong> handyman@fixit.local / Password123!
            </p>
          </div>
        </div>
      </FormContainer>
    </div>
  );
}
