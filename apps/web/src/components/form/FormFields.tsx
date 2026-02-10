'use client';

import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export function FormInput({
  label,
  error,
  helperText,
  required,
  className,
  ...props
}: FormInputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-2 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-colors
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      {helperText && !error && <p className="text-gray-500 text-sm mt-1">{helperText}</p>}
    </div>
  );
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  required?: boolean;
}

export function FormSelect({
  label,
  error,
  options,
  placeholder,
  required,
  className,
  ...props
}: FormSelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        className={`
          w-full px-4 py-2 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-colors
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${className}
        `}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

interface FormButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
}

export function FormButton({
  isLoading,
  loadingText = 'Loading...',
  variant = 'primary',
  fullWidth = true,
  className,
  children,
  disabled,
  ...props
}: FormButtonProps) {
  const baseStyles =
    'px-6 py-2.5 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${isLoading || disabled ? 'opacity-70 cursor-not-allowed' : ''}
        ${className}
      `}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? loadingText : children}
    </button>
  );
}

interface FormErrorProps {
  message?: string | null;
  className?: string;
}

export function FormError({ message, className }: FormErrorProps) {
  if (!message) return null;

  return (
    <div
      className={`
        w-full bg-red-50 border border-red-200 rounded-lg p-4
        text-red-700 text-sm
        ${className}
      `}
    >
      <div className="flex items-start">
        <svg
          className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        <span>{message}</span>
      </div>
    </div>
  );
}

interface FormContainerProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

export function FormContainer({ children, title, subtitle, className }: FormContainerProps) {
  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        {subtitle && <p className="text-gray-600 text-sm mb-6">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  error?: string;
}

export function OTPInput({ value, onChange, length = 6, error }: OTPInputProps) {
  const digits = value.split('').slice(0, length);

  const handleChange = (index: number, char: string) => {
    if (!/^\d*$/.test(char)) return; // Only digits

    const newDigits = [...digits];
    newDigits[index] = char;

    // Auto-focus next input
    if (char && index < length - 1) {
      const inputs = document.querySelectorAll('[data-otp-input]');
      (inputs[index + 1] as HTMLInputElement)?.focus();
    }

    onChange(newDigits.join(''));
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      const inputs = document.querySelectorAll('[data-otp-input]');
      (inputs[index - 1] as HTMLInputElement)?.focus();
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-2 justify-center mb-2">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={digits[index] || ''}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            data-otp-input
            className={`
              w-12 h-12 text-center text-lg font-semibold
              border rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-colors
              ${error ? 'border-red-500' : 'border-gray-300'}
            `}
          />
        ))}
      </div>
      {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
    </div>
  );
}

interface FormLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function FormLink({ href, children, className }: FormLinkProps) {
  return (
    <a
      href={href}
      className={`
        text-blue-600 hover:text-blue-700 font-medium
        transition-colors
        ${className}
      `}
    >
      {children}
    </a>
  );
}

interface FormDividerProps {
  text?: string;
}

export function FormDivider({ text }: FormDividerProps) {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300" />
      </div>
      {text && (
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">{text}</span>
        </div>
      )}
    </div>
  );
}

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const calculateStrength = () => {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;

    return strength;
  };

  const strength = calculateStrength();
  const strengthMap = {
    0: { label: 'Very Weak', color: 'bg-red-500' },
    1: { label: 'Weak', color: 'bg-orange-500' },
    2: { label: 'Fair', color: 'bg-yellow-500' },
    3: { label: 'Good', color: 'bg-blue-500' },
    4: { label: 'Strong', color: 'bg-green-500' },
    5: { label: 'Very Strong', color: 'bg-green-600' },
  };

  const current = strengthMap[strength as keyof typeof strengthMap] || strengthMap[0];

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i < strength ? current.color : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-600">
        Strength: <span className="font-semibold">{current.label}</span>
      </p>
    </div>
  );
}
