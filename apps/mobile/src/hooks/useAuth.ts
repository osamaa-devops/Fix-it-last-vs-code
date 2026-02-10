import { useState, useCallback } from 'react';
import { ZodSchema } from 'zod';
import { useAuth } from '../context/auth';

// Generic form validation hook
export const useForm = <T extends Record<string, any>>(
  initialValues: T,
  onSubmit: (values: T) => Promise<void>,
  validationSchema?: ZodSchema
) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (field: keyof T, value: any) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      // Clear field error when user starts typing
      if (errors[field as any]) {
        setErrors((prev) => ({ ...prev, [field as any]: '' }));
      }
    },
    [errors]
  );

  const handleSubmit = useCallback(async () => {
    try {
      setIsSubmitting(true);
      setErrors({});

      // Validate if schema provided
      if (validationSchema) {
        const result = validationSchema.safeParse(values);
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((error) => {
            const path = error.path.join('.');
            fieldErrors[path] = error.message;
          });
          setErrors(fieldErrors);
          return;
        }
      }

      await onSubmit(values);
    } catch (error: any) {
      // Error is handled by context, but we can set field-level errors if needed
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validationSchema, onSubmit]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
    setValues,
  };
};

// Login hook
export const useLogin = () => {
  const { login, isLoading, error, clearError } = useAuth();

  return {
    login,
    isLoading,
    error,
    clearError,
  };
};

// Register hook
export const useRegister = () => {
  const { register, isLoading, error, clearError } = useAuth();

  return {
    register,
    isLoading,
    error,
    clearError,
  };
};

// Password reset hook
export const usePasswordReset = () => {
  const { forgotPassword, verifyOTP, resetPassword, isLoading, error, clearError } =
    useAuth();

  return {
    forgotPassword,
    verifyOTP,
    resetPassword,
    isLoading,
    error,
    clearError,
  };
};

// Async operation hook for handling loading and error states
export const useAsync = <T,>(
  asyncFunction: () => Promise<T>,
  immediate = true
) => {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setStatus('pending');
    setData(null);
    setError(null);

    try {
      const response = await asyncFunction();
      setData(response);
      setStatus('success');
      return response;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      setStatus('error');
      throw err;
    }
  }, [asyncFunction]);

  useCallback(async () => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { data, status, error, execute };
};

// Debounce hook
export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useCallback(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
