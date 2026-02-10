import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../context/auth';
import { useForm } from '../hooks/useAuth';
import { LoginSchema } from '../libs/validation/auth';
import { TextInput, Button, ErrorMessage, Divider, LinkText, colors } from '../components/UI';

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { login, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm(
    { email: '', password: '' },
    async (values) => {
      await login(values);
    },
    LoginSchema
  );

  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
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
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>
          </View>

          {/* Error Message */}
          {error && <ErrorMessage message={error} onDismiss={clearError} />}

          {/* Demo Credentials Info */}
          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>Demo Credentials</Text>
            <Text style={styles.demoText}>Customer: customer@fixit.local</Text>
            <Text style={styles.demoText}>Handyman: handyman@fixit.local</Text>
            <Text style={styles.demoText}>Password: Password123!</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <TextInput
              label="Email Address"
              placeholder="Enter your email"
              value={form.values.email}
              onChangeText={(text) => form.handleChange('email', text)}
              error={form.errors.email}
              keyboardType="email-address"
              editable={!form.isSubmitting}
            />

            <TextInput
              label="Password"
              placeholder="Enter your password"
              value={form.values.password}
              onChangeText={(text) => form.handleChange('password', text)}
              error={form.errors.password}
              secureTextEntry={!showPassword}
              editable={!form.isSubmitting}
            />

            <View style={styles.rememberContainer}>
              <LinkText
                text={showPassword ? 'Hide Password' : 'Show Password'}
                onPress={() => setShowPassword(!showPassword)}
              />
              <LinkText
                text="Forgot Password?"
                onPress={handleForgotPassword}
                color={colors.danger}
              />
            </View>

            <Button
              title="Sign In"
              onPress={form.handleSubmit}
              loading={form.isSubmitting}
              disabled={form.isSubmitting}
            />
          </View>

          {/* Divider */}
          <Divider text="Don't have an account?" />

          {/* Register Link */}
          <Button
            title="Create Account"
            onPress={handleRegister}
            variant="outline"
          />

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By signing in, you agree to our{' '}
              <Text style={styles.footerLink}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.footerLink}>Privacy Policy</Text>
            </Text>
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
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.darkGray,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray,
  },
  demoBox: {
    backgroundColor: '#f0f9ff',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 6,
  },
  demoText: {
    fontSize: 13,
    color: '#0369a1',
    marginBottom: 3,
  },
  form: {
    marginBottom: 20,
  },
  rememberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 18,
  },
  footerLink: {
    color: colors.primary,
    fontWeight: '600',
  },
});

export default LoginScreen;
