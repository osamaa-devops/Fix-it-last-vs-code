'use client';

import React, { ButtonHTMLAttributes, InputHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      fullWidth = false,
      isLoading = false,
      children,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variantStyles = {
      primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 disabled:bg-gray-400',
      outline:
        'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-primary-500 disabled:border-gray-200 disabled:text-gray-400',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-primary-500 disabled:text-gray-400',
    };

    const sizeStyles = {
      small: 'px-3 py-1 text-sm gap-2',
      medium: 'px-4 py-2 text-base gap-2',
      large: 'px-6 py-3 text-lg gap-2',
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          ${baseStyles}
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${widthStyle}
          ${className}
          disabled:cursor-not-allowed
        `}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`
          w-full px-4 py-2 border border-gray-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          placeholder-gray-400
          disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      />
    );
  }
);

TextInput.displayName = 'TextInput';

export const LoadingSpinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }[size];

  return <Loader2 className={`${sizeClass} animate-spin text-primary-500`} />;
};

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) => {
  return (
    <div className="text-center py-12">
      {Icon && <div className="flex justify-center mb-4 text-gray-400">{Icon}</div>}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-600 mb-4">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
};
