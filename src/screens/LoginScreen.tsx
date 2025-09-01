import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../contexts/AuthContext';
import { secureStorage } from '../services/secureStorage';
import { loginStyles as styles } from '../styles/LoginScreenStyles';
import { showError, showSuccess, showInfo } from '../utils/alertService';
import { EyeIcon } from '../components/EyeIcon';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  displayName?: string;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { user, loading: authLoading, signIn, signUp, isAuthenticated } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  
  // Form validation
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  
  // Track which fields have been touched/edited
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Sign up specific validations
    if (isSignUp) {
      if (!displayName.trim()) {
        newErrors.displayName = 'Display name is required';
      }

      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, password, isSignUp, displayName, confirmPassword]);

  // Clear validation error when user starts typing
  const clearFieldError = useCallback((fieldName: string) => {
    if (errors[fieldName as keyof FormErrors]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName as keyof FormErrors];
        return newErrors;
      });
    }
  }, [errors]);

  // Enhanced input handlers that clear errors
  const handleEmailChange = useCallback((text: string) => {
    setEmail(text);
    clearFieldError('email');
    setTouchedFields(prev => new Set(prev).add('email'));
  }, [clearFieldError]);

  const handlePasswordChange = useCallback((text: string) => {
    setPassword(text);
    clearFieldError('password');
    setTouchedFields(prev => new Set(prev).add('password'));
  }, [clearFieldError]);

  const handleConfirmPasswordChange = useCallback((text: string) => {
    setConfirmPassword(text);
    clearFieldError('confirmPassword');
    setTouchedFields(prev => new Set(prev).add('confirmPassword'));
  }, [clearFieldError]);

  const handleDisplayNameChange = useCallback((text: string) => {
    setDisplayName(text);
    clearFieldError('displayName');
    setTouchedFields(prev => new Set(prev).add('displayName'));
  }, [clearFieldError]);

  const handleSignIn = useCallback(async () => {
    if (!validateForm()) return;

    try {
      await signIn(email.trim(), password);
      console.log('Sign in successful');
    } catch (error: any) {
      showError(error.message, 'Sign In Error');
    }
  }, [email, password, validateForm, signIn]);

  const handleSignUp = useCallback(async () => {
    if (!validateForm()) return;

    try {
      await signUp(email.trim(), password, displayName.trim());
      console.log('Sign up successful');
      
      showSuccess(
        'Your account has been created successfully!',
        'Account Created'
      );
    } catch (error: any) {
      showError(error.message, 'Sign Up Error');
    }
  }, [email, password, displayName, validateForm, signUp]);

  const handleForgotPassword = useCallback(async () => {
    if (!email.trim()) {
      showError('Please enter your email address first.', 'Reset Password');
      return;
    }

    try {
      showInfo(
        'Password reset functionality would be implemented with your backend service.',
        'Password Reset'
      );
    } catch (error: any) {
      showError(error.message, 'Reset Password Error');
    }
  }, [email]);

  const toggleMode = useCallback(() => {
    setIsSignUp(!isSignUp);
    setErrors({});
    setTouchedFields(new Set());
    setPassword('');
    setConfirmPassword('');
    setDisplayName('');
  }, [isSignUp]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);

  const headerTitle = useMemo(() => {
    return isSignUp ? 'Create your account' : 'Welcome back';
  }, [isSignUp]);

  const buttonText = useMemo(() => {
    return isSignUp ? 'Sign Up' : 'Sign In';
  }, [isSignUp]);

  const toggleText = useMemo(() => {
    return isSignUp 
      ? "Already have an account? Sign In" 
      : "Don't have an account? Sign Up";
  }, [isSignUp]);

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>🎫 Event Discovery</Text>
          <Text style={styles.subtitle}>
            {headerTitle}
          </Text>
        </View>

        <View style={styles.form}>
          {/* Display Name Input - Only show error if field was touched */}
          {isSignUp && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Display Name</Text>
              <TextInput
                style={[styles.input, errors.displayName ? styles.inputError : null]}
                value={displayName}
                onChangeText={handleDisplayNameChange}
                placeholder="Enter your display name"
                autoCapitalize="words"
                returnKeyType="next"
              />
              {errors.displayName && touchedFields.has('displayName') && (
                <Text style={styles.errorText}>{errors.displayName}</Text>
              )}
            </View>
          )}

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, errors.email ? styles.inputError : null]}
              value={email}
              onChangeText={handleEmailChange}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
            {errors.email && touchedFields.has('email') && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.passwordInput, errors.password ? styles.inputError : null]}
                value={password}
                onChangeText={handlePasswordChange}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                returnKeyType={isSignUp ? 'next' : 'done'}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={togglePasswordVisibility}
              >
                <EyeIcon isVisible={showPassword} />
              </TouchableOpacity>
            </View>
            {errors.password && touchedFields.has('password') && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          {/* Confirm Password Input - Only show in sign up mode */}
          {isSignUp && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={[styles.input, errors.confirmPassword ? styles.inputError : null]}
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                placeholder="Confirm your password"
                secureTextEntry={!showPassword}
                returnKeyType="done"
              />
              {errors.confirmPassword && touchedFields.has('confirmPassword') && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.primaryButton, authLoading && styles.buttonDisabled]}
            onPress={isSignUp ? handleSignUp : handleSignIn}
            disabled={authLoading}
          >
            {authLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.primaryButtonText}>
                {buttonText}
              </Text>
            )}
          </TouchableOpacity>

          {/* Forgot Password - Only show in sign in mode */}
          {!isSignUp && (
            <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={handleForgotPassword}
              disabled={authLoading}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Toggle Sign In/Sign Up */}
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={toggleMode}
            disabled={authLoading}
          >
            <Text style={styles.toggleButtonText}>
              {toggleText}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
