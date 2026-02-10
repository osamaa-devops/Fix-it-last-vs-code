import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions,
} from 'react-native';

// Colors
export const colors = {
  primary: '#0ea5e9',
  secondary: '#f59e0b',
  danger: '#ef4444',
  success: '#22c55e',
  warning: '#f59e0b',
  gray: '#6b7280',
  lightGray: '#f3f4f6',
  darkGray: '#111827',
  white: '#ffffff',
  border: '#e5e7eb',
};

// Text Input Component
interface TextInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  disabled?: boolean;
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  icon?: React.ReactNode;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  disabled = false,
  editable = true,
  multiline = false,
  numberOfLines = 1,
  icon,
}) => {
  return (
    <View style={styles.inputContainer}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrapper, error && styles.inputError]}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <RNTextInput
          style={[styles.input, icon && styles.inputWithIcon]}
          placeholder={placeholder}
          placeholderTextColor={colors.gray}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          editable={!disabled && editable}
          multiline={multiline}
          numberOfLines={numberOfLines}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

// Button Component
interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'large',
  style,
  textStyle,
  fullWidth = true,
}) => {
  const buttonStyle = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    fullWidth && styles.buttonFullWidth,
    (loading || disabled) && styles.buttonDisabled,
    style,
  ];

  const txtStyle = [styles.buttonText, styles[`buttonText_${variant}`], textStyle];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'danger' ? colors.white : colors.white} />
      ) : (
        <Text style={txtStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

// Error Message Component
interface ErrorMessageProps {
  message: string | null;
  onDismiss?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <View style={styles.errorContainer}>
      <View style={styles.errorContent}>
        <Text style={styles.errorTitle}>Error</Text>
        <Text style={styles.errorDescription}>{message}</Text>
      </View>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss}>
          <Text style={styles.errorDismiss}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Loading Spinner
interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = colors.primary,
}) => {
  return <ActivityIndicator size={size} color={color} />;
};

// Success Message
interface SuccessMessageProps {
  message: string;
  onDismiss?: () => void;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ message, onDismiss }) => {
  return (
    <View style={styles.successContainer}>
      <Text style={styles.successText}>✓ {message}</Text>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss}>
          <Text style={styles.successDismiss}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Card Component
interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ children, onPress, style }) => {
  const content = (
    <View
      style={[
        {
          backgroundColor: colors.white,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.border,
          padding: 16,
        },
        style,
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

// Empty State Component
interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description }) => {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 40 }}>
      <Text style={{ fontSize: 40, marginBottom: 12 }}>{icon}</Text>
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8, color: colors.darkGray }}>
        {title}
      </Text>
      {description && (
        <Text style={{ fontSize: 14, color: colors.gray, textAlign: 'center' }}>
          {description}
        </Text>
      )}
    </View>
  );
};

// Rating Star Component
interface RatingStarProps {
  rating: number;
  reviews: number;
  size?: number;
}

export const RatingStar: React.FC<RatingStarProps> = ({ rating, reviews, size = 16 }) => {
  const stars = Array(5)
    .fill(0)
    .map((_, i) => (i < Math.floor(rating) ? '★' : '☆'));

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <View style={{ flexDirection: 'row' }}>
        {stars.map((star, i) => (
          <Text
            key={i}
            style={{
              fontSize: size,
              color: i < Math.floor(rating) ? '#fbbf24' : colors.border,
            }}
          >
            {star}
          </Text>
        ))}
      </View>
      <Text style={{ fontSize: 14, fontWeight: '600', color: colors.darkGray, marginLeft: 4 }}>
        {rating}
      </Text>
      <Text style={{ fontSize: 12, color: colors.gray }}>({reviews})</Text>
    </View>
  );
};

// Divider
interface DividerProps {
  text?: string;
}

export const Divider: React.FC<DividerProps> = ({ text }) => {
  return (
    <View style={styles.dividerContainer}>
      <View style={styles.dividerLine} />
      {text && <Text style={styles.dividerText}>{text}</Text>}
      <View style={styles.dividerLine} />
    </View>
  );
};

// Link Text
interface LinkTextProps {
  text: string;
  onPress: () => void;
  color?: string;
}

export const LinkText: React.FC<LinkTextProps> = ({
  text,
  onPress,
  color = colors.primary,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={[styles.linkText, { color }]}>{text}</Text>
    </TouchableOpacity>
  );
};

// Styles
const styles = StyleSheet.create({
  // Input
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.darkGray,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.darkGray,
  },
  inputWithIcon: {
    marginLeft: 8,
  },
  iconContainer: {
    marginRight: 8,
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: '#fef2f2',
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 4,
  },

  // Button
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  button_primary: {
    backgroundColor: colors.primary,
  },
  button_secondary: {
    backgroundColor: colors.secondary,
  },
  button_danger: {
    backgroundColor: colors.danger,
  },
  button_outline: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  button_small: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  button_medium: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  button_large: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  buttonFullWidth: {
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonText_primary: {
    color: colors.white,
  },
  buttonText_secondary: {
    color: colors.white,
  },
  buttonText_danger: {
    color: colors.white,
  },
  buttonText_outline: {
    color: colors.primary,
  },

  // Error Message
  errorContainer: {
    flexDirection: 'row',
    backgroundColor: '#fef2f2',
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
    padding: 12,
    marginBottom: 16,
    borderRadius: 6,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  errorContent: {
    flex: 1,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.danger,
    marginBottom: 4,
  },
  errorDescription: {
    fontSize: 13,
    color: '#7f1d1d',
  },
  errorDismiss: {
    fontSize: 18,
    color: colors.danger,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  // Success Message
  successContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0fdf4',
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
    padding: 12,
    marginBottom: 16,
    borderRadius: 6,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  successText: {
    fontSize: 14,
    color: '#166534',
    fontWeight: '500',
    flex: 1,
  },
  successDismiss: {
    fontSize: 18,
    color: colors.success,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  // Divider
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    paddingHorizontal: 12,
    color: colors.gray,
    fontSize: 14,
  },

  // Link
  linkText: {
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});
