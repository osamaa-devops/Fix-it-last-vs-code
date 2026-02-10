import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TextInput as RNTextInput,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../context/auth';
import { useForm } from '../hooks/useAuth';
import {
  ForgotPasswordSchema,
  VerifyOTPSchema,
  ResetPasswordSchema,
} from '../libs/validation/auth';
import {
  TextInput,
  Button,
  ErrorMessage,
  SuccessMessage,
  LinkText,
  colors,
} from '../components/UI';

type Step = 'email' | 'otp' | 'password';

const ForgotPasswordScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { forgotPassword, verifyOTP, resetPassword, error, clearError } = useAuth();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const otpInputs = useRef<(RNTextInput | null)[]>([]);

  // Handle resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Auto-advance focus in OTP input
  const handleOTPChange = (index: number, value: string) => {
    const newOTP = otp.split('');
    newOTP[index] = value;
    const otpString = newOTP.join('');
    setOTP(otpString);

    // Auto focus to next input
    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }

    // Auto submit if all digits entered
    if (otpString.length === 6) {
      handleVerifyOTP();
    }
  };

  const handleOTPKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  // Step 1: Request Password Reset
  const handleSendReset = async () => {
    try {
      const validation = ForgotPasswordSchema.safeParse({ email });
      if (!validation.success) {
        const errors: Record<string, string> = {};
        validation.error.errors.forEach((error) => {
          errors[error.path.join('.')] = error.message;
        });
        setFieldErrors(errors);
        return;
      }

      setFieldErrors({});
      setIsLoading(true);
      await forgotPassword({ email });
      setSuccessMessage('OTP sent to your email address');
      setStep('otp');
      setResendTimer(60);
    } catch (err: any) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async () => {
    try {
      if (otp.length !== 6) {
        setFieldErrors({ otp: 'Please enter a valid 6-digit OTP' });
        return;
      }

      const validation = VerifyOTPSchema.safeParse({ email, otp });
      if (!validation.success) {
        const errors: Record<string, string> = {};
        validation.error.errors.forEach((error) => {
          errors[error.path.join('.')] = error.message;
        });
        setFieldErrors(errors);
        return;
      }

      setFieldErrors({});
      setIsLoading(true);
      await verifyOTP({ email, otp });
      setSuccessMessage('OTP verified successfully');
      setTimeout(() => {
        setSuccessMessage(null);
        setStep('password');
      }, 1500);
    } catch (err: any) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async () => {
    try {
      const validation = ResetPasswordSchema.safeParse({
        email,
        otp,
        newPassword,
        confirmPassword,
      });

      if (!validation.success) {
        const errors: Record<string, string> = {};
        validation.error.errors.forEach((error) => {
          errors[error.path.join('.')] = error.message;
        });
        setFieldErrors(errors);
        return;
      }

      setFieldErrors({});
      setIsLoading(true);
      await resetPassword({
        email,
        otp,
        newPassword,
        confirmPassword,
      });
      
      setSuccessMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigation.navigate('Login');
      }, 2000);
    } catch (err: any) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  const handleResendOTP = async () => {
    await handleSendReset();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBackToLogin}>
              <Text style={styles.backButton}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              {step === 'email' && 'Enter your email address'}
              {step === 'otp' && 'Verify the OTP sent to your email'}
              {step === 'password' && 'Create a new password'}
            </Text>
          </View>

          {/* Error & Success Messages */}
          {error && <ErrorMessage message={error} onDismiss={clearError} />}
          {successMessage && (
            <SuccessMessage message={successMessage} onDismiss={() => setSuccessMessage(null)} />
          )}

          {/* Step 1: Email */}
          {step === 'email' && (
            <View style={styles.step}>
              <TextInput
                label="Email Address"
                placeholder="Enter your registered email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (fieldErrors.email) {
                    setFieldErrors((prev) => ({ ...prev, email: '' }));
                  }
                }}
                error={fieldErrors.email}
                keyboardType="email-address"
              />

              <Button
                title="Send Reset OTP"
                onPress={handleSendReset}
                loading={isLoading}
                disabled={isLoading}
              />
            </View>
          )}

          {/* Step 2: OTP Verification */}
          {step === 'otp' && (
            <View style={styles.step}>
              <Text style={styles.otpExplanation}>
                Enter the 6-digit code sent to {email}
              </Text>

              <View style={styles.otpContainer}>
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <RNTextInput
                    key={index}
                    ref={(ref) => (otpInputs.current[index] = ref)}
                    style={[
                      styles.otpInput,
                      fieldErrors.otp && styles.otpInputError,
                    ]}
                    keyboardType="numeric"
                    maxLength={1}
                    value={otp[index] || ''}
                    onChangeText={(value) => handleOTPChange(index, value)}
                    onKeyPress={({ nativeEvent: { key } }) =>
                      handleOTPKeyPress(index, key)
                    }
                    editable={!isLoading}
                  />
                ))}
              </View>

              {fieldErrors.otp && (
                <Text style={styles.errorText}>{fieldErrors.otp}</Text>
              )}

              <View style={styles.resendContainer}>
                {resendTimer > 0 ? (
                  <Text style={styles.resendTimer}>
                    Resend OTP in {resendTimer}s
                  </Text>
                ) : (
                  <Button
                    title="Resend OTP"
                    onPress={handleResendOTP}
                    variant="outline"
                    size="small"
                  />
                )}
              </View>

              <Button
                title="Verify OTP"
                onPress={handleVerifyOTP}
                loading={isLoading}
                disabled={isLoading || otp.length !== 6}
              />
            </View>
          )}

          {/* Step 3: New Password */}
          {step === 'password' && (
            <View style={styles.step}>
              <Text style={styles.passwordNote}>
                Create a strong password with letters, numbers, and special characters
              </Text>

              <TextInput
                label="New Password"
                placeholder="Enter new password"
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  if (fieldErrors.newPassword) {
                    setFieldErrors((prev) => ({ ...prev, newPassword: '' }));
                  }
                }}
                error={fieldErrors.newPassword}
                secureTextEntry={!showPassword}
              />

              <View style={styles.showPasswordContainer}>
                <LinkText
                  text={showPassword ? 'Hide' : 'Show'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              </View>

              <TextInput
                label="Confirm Password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (fieldErrors.confirmPassword) {
                    setFieldErrors((prev) => ({ ...prev, confirmPassword: '' }));
                  }
                }}
                error={fieldErrors.confirmPassword}
                secureTextEntry={!showConfirmPassword}
              />

              <View style={styles.showPasswordContainer}>
                <LinkText
                  text={showConfirmPassword ? 'Hide' : 'Show'}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              </View>

              <Button
                title="Reset Password"
                onPress={handleResetPassword}
                loading={isLoading}
                disabled={isLoading}
              />
            </View>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <LinkText
              text="Back to Sign In"
              onPress={handleBackToLogin}
              color={colors.primary}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  header: {
    marginBottom: 32,
  },
  backButton: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.darkGray,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray,
  },
  step: {
    marginBottom: 24,
  },
  otpExplanation: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8,
  },
  otpInput: {
    flex: 1,
    height: 56,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.darkGray,
    backgroundColor: colors.white,
  },
  otpInputError: {
    borderColor: colors.danger,
    backgroundColor: '#fef2f2',
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginBottom: 12,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resendTimer: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
  },
  passwordNote: {
    fontSize: 13,
    color: colors.gray,
    marginBottom: 20,
    backgroundColor: colors.lightGray,
    padding: 12,
    borderRadius: 8,
  },
  showPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});

export default ForgotPasswordScreen;
