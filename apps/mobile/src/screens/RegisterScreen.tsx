import React, { useState, useReducer } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../context/auth';
import { useForm } from '../hooks/useAuth';
import { RegisterSchema } from '../libs/validation/auth';
import {
  TextInput,
  Button,
  ErrorMessage,
  Divider,
  LinkText,
  colors,
} from '../components/UI';

type Step = 'account' | 'details' | 'confirmation';

interface FormState {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: 'customer' | 'handyman' | '';
}

const RegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { register, error, clearError } = useAuth();
  const [step, setStep] = useState<Step>('account');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<FormState>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (field: keyof FormState, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = async () => {
    try {
      const result = RegisterSchema.safeParse(formData);
      if (!result.success) {
        const errors: Record<string, string> = {};
        result.error.errors.forEach((error) => {
          const path = error.path.join('.');
          errors[path] = error.message;
        });
        setFieldErrors(errors);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Validation error:', err);
      return false;
    }
  };

  const handleNextStep = async () => {
    const isValid = await validateStep();
    if (isValid) {
      if (step === 'account') {
        setStep('details');
      } else if (step === 'details') {
        setStep('confirmation');
      }
    }
  };

  const handlePrevStep = () => {
    if (step === 'details') {
      setStep('account');
    } else if (step === 'confirmation') {
      setStep('details');
    }
  };

  const handleRegister = async () => {
    const isValid = await validateStep();
    if (isValid) {
      await register(formData);
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  const getStepProgress = () => {
    switch (step) {
      case 'account':
        return { current: 1, total: 3 };
      case 'details':
        return { current: 2, total: 3 };
      case 'confirmation':
        return { current: 3, total: 3 };
    }
  };

  const progress = getStepProgress();

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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Step {progress.current} of {progress.total}
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${(progress.current / progress.total) * 100}%`,
                  },
                ]}
              />
            </View>
          </View>

          {/* Error Message */}
          {error && <ErrorMessage message={error} onDismiss={clearError} />}

          {/* Step 1: Account Details */}
          {step === 'account' && (
            <View style={styles.step}>
              <Text style={styles.stepTitle}>Account Information</Text>

              <TextInput
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChangeText={(text) => handleFieldChange('fullName', text)}
                error={fieldErrors.fullName}
              />

              <TextInput
                label="Email Address"
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={(text) => handleFieldChange('email', text)}
                error={fieldErrors.email}
                keyboardType="email-address"
              />

              <View style={styles.userTypeContainer}>
                <Text style={styles.label}>I am a</Text>
                <View style={styles.userTypeButtons}>
                  <TouchableOpacity
                    style={[
                      styles.userTypeButton,
                      formData.userType === 'customer' && styles.userTypeButtonActive,
                    ]}
                    onPress={() => handleFieldChange('userType', 'customer')}
                  >
                    <Text
                      style={[
                        styles.userTypeText,
                        formData.userType === 'customer' && styles.userTypeTextActive,
                      ]}
                    >
                      Customer
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.userTypeButton,
                      formData.userType === 'handyman' && styles.userTypeButtonActive,
                    ]}
                    onPress={() => handleFieldChange('userType', 'handyman')}
                  >
                    <Text
                      style={[
                        styles.userTypeText,
                        formData.userType === 'handyman' && styles.userTypeTextActive,
                      ]}
                    >
                      Handyman
                    </Text>
                  </TouchableOpacity>
                </View>
                {fieldErrors.userType && (
                  <Text style={styles.errorText}>{fieldErrors.userType}</Text>
                )}
              </View>

              <Button title="Next" onPress={handleNextStep} />
            </View>
          )}

          {/* Step 2: Password */}
          {step === 'details' && (
            <View style={styles.step}>
              <Text style={styles.stepTitle}>Set Password</Text>

              <Text style={styles.passwordRequirements}>
                Password must contain:
              </Text>
              <View style={styles.requirementsList}>
                <Text style={styles.requirement}>
                  • At least 8 characters
                </Text>
                <Text style={styles.requirement}>
                  • One uppercase letter (A-Z)
                </Text>
                <Text style={styles.requirement}>
                  • One lowercase letter (a-z)
                </Text>
                <Text style={styles.requirement}>
                  • One number (0-9)
                </Text>
                <Text style={styles.requirement}>
                  • One special character (!@#$%^&*)
                </Text>
              </View>

              <TextInput
                label="Password"
                placeholder="Create a strong password"
                value={formData.password}
                onChangeText={(text) => handleFieldChange('password', text)}
                error={fieldErrors.password}
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
                value={formData.confirmPassword}
                onChangeText={(text) => handleFieldChange('confirmPassword', text)}
                error={fieldErrors.confirmPassword}
                secureTextEntry={!showConfirmPassword}
              />

              <View style={styles.showPasswordContainer}>
                <LinkText
                  text={showConfirmPassword ? 'Hide' : 'Show'}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              </View>

              <View style={styles.buttonGroup}>
                <Button
                  title="Back"
                  onPress={handlePrevStep}
                  variant="outline"
                  fullWidth={true}
                />
                <Button
                  title="Next"
                  onPress={handleNextStep}
                  fullWidth={true}
                />
              </View>
            </View>
          )}

          {/* Step 3: Confirmation */}
          {step === 'confirmation' && (
            <View style={styles.step}>
              <View style={styles.confirmationBox}>
                <Text style={styles.confirmationIcon}>✓</Text>
                <Text style={styles.confirmationTitle}>Almost Done!</Text>
                <Text style={styles.confirmationText}>
                  Review your information before creating your account
                </Text>
              </View>

              <View style={styles.summarySection}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Full Name</Text>
                  <Text style={styles.summaryValue}>{formData.fullName}</Text>
                </View>

                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Email</Text>
                  <Text style={styles.summaryValue}>{formData.email}</Text>
                </View>

                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Account Type</Text>
                  <Text style={styles.summaryValue}>
                    {formData.userType === 'customer' ? 'Customer' : 'Handyman'}
                  </Text>
                </View>
              </View>

              <View style={styles.buttonGroup}>
                <Button
                  title="Back"
                  onPress={handlePrevStep}
                  variant="outline"
                  fullWidth={true}
                />
                <Button
                  title="Create Account"
                  onPress={handleRegister}
                  fullWidth={true}
                />
              </View>
            </View>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <LinkText
              text="Sign In"
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
    paddingVertical: 24,
  },
  header: {
    marginBottom: 24,
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
  progressContainer: {
    marginBottom: 24,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: colors.lightGray,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  step: {
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.darkGray,
    marginBottom: 20,
  },
  userTypeContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.darkGray,
    marginBottom: 12,
  },
  userTypeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  userTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    alignItems: 'center',
  },
  userTypeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  userTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.darkGray,
  },
  userTypeTextActive: {
    color: colors.white,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 8,
  },
  passwordRequirements: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.darkGray,
    marginBottom: 12,
  },
  requirementsList: {
    backgroundColor: colors.lightGray,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  requirement: {
    fontSize: 13,
    color: colors.gray,
    marginBottom: 4,
  },
  showPasswordContainer: {
    marginBottom: 20,
    alignItems: 'flex-end',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  confirmationBox: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    marginBottom: 32,
  },
  confirmationIcon: {
    fontSize: 48,
    color: colors.success,
    marginBottom: 12,
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.darkGray,
    marginBottom: 8,
  },
  confirmationText: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
  },
  summarySection: {
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  summaryItem: {
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: 4,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.darkGray,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: {
    fontSize: 14,
    color: colors.gray,
  },
});

export default RegisterScreen;
