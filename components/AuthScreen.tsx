import React, { useState, useRef, useEffect } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { loginUser, registerUser, createGuestUser, UserAccount } from '@/services/turso';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AuthScreenProps {
  onSuccess: (user: UserAccount, isNewUser: boolean) => void;
}

export function AuthScreen({ onSuccess }: AuthScreenProps) {
  // Navigation states
  const [view, setView] = useState<'welcome' | 'form'>('welcome');
  // Default to Sign In first as requested by user
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [formStep, setFormStep] = useState(1);

  // Form fields
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [isAnimating, setIsAnimating] = useState(false);

  // Slide animation between steps
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const tap = () => {
    if (Platform.OS !== 'web') {
      try {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    }
  };

  const transitionStep = (direction: 'next' | 'prev', callback?: () => void) => {
    tap();
    setErrorMessage('');
    setIsAnimating(true);
    const outValue = direction === 'next' ? -SCREEN_WIDTH * 0.22 : SCREEN_WIDTH * 0.22;
    const inStartValue = direction === 'next' ? SCREEN_WIDTH * 0.22 : -SCREEN_WIDTH * 0.22;

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: outValue,
        duration: 140,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 140,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (direction === 'next') {
        setFormStep((prev) => prev + 1);
      } else {
        setFormStep((prev) => Math.max(1, prev - 1));
      }
      callback?.();

      slideAnim.setValue(inStartValue);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsAnimating(false);
      });
    });
  };

  const handleBack = () => {
    tap();
    setErrorMessage('');
    if (view === 'form') {
      if (formStep > 1) {
        transitionStep('prev');
      } else {
        setView('welcome');
      }
    }
  };

  const handleStartEmail = () => {
    tap();
    setErrorMessage('');
    setFormStep(1);
    setView('form');
  };

  const handleGuestLogin = async () => {
    tap();
    setErrorMessage('');
    setLoading(true);
    try {
      const guest = await createGuestUser();
      onSuccess(guest, false);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Could not start guest session.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    tap();
    setLoading(true);
    setErrorMessage('');
    try {
      const demoUser = await registerUser({
        email: 'alex@kaicode.dev',
        password: 'password123',
        username: 'alex_code',
        displayName: 'Alex Morgan',
      });
      if (demoUser.user) {
        onSuccess(demoUser.user, false);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Demo sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  // Stepped validation & submission
  const handleContinue = async () => {
    tap();
    setErrorMessage('');

    if (mode === 'signin') {
      // Step 1: Email or Username
      if (formStep === 1) {
        if (!email.trim()) {
          setErrorMessage('Please enter your email or username to continue.');
          return;
        }
        transitionStep('next');
        return;
      }

      // Step 2: Password
      if (formStep === 2) {
        if (!password) {
          setErrorMessage('Please enter your password.');
          return;
        }
        setLoading(true);
        try {
          const res = await loginUser({
            emailOrUsername: email.trim(),
            password,
          });
          if (res.error) {
            setErrorMessage(res.error);
          } else if (res.user) {
            onSuccess(res.user, false);
          }
        } catch (err: any) {
          setErrorMessage(err?.message || 'Sign in failed. Please check credentials.');
        } finally {
          setLoading(false);
        }
      }
    } else {
      // Sign Up Flow
      // Step 1: Email
      if (formStep === 1) {
        if (!email.trim() || !email.includes('@')) {
          setErrorMessage('Please enter a valid email address.');
          return;
        }
        transitionStep('next');
        return;
      }

      // Step 2: Username
      if (formStep === 2) {
        if (!username.trim()) {
          setErrorMessage('Please choose a username.');
          return;
        }
        if (username.trim().length < 3) {
          setErrorMessage('Username must be at least 3 characters.');
          return;
        }
        transitionStep('next');
        return;
      }

      // Step 3: Password
      if (formStep === 3) {
        if (password.length < 6) {
          setErrorMessage('Password must be at least 6 characters.');
          return;
        }
        setLoading(true);
        try {
          const res = await registerUser({
            email: email.trim(),
            username: username.trim(),
            password,
            displayName: username.trim(),
          });
          if (res.error) {
            setErrorMessage(res.error);
          } else if (res.user) {
            onSuccess(res.user, true);
          }
        } catch (err: any) {
          setErrorMessage(err?.message || 'Account creation failed. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const toggleAuthMode = () => {
    tap();
    setErrorMessage('');
    setFormStep(1);
    setMode((prev) => (prev === 'signin' ? 'signup' : 'signin'));
  };

  // Total steps for current mode
  const totalSteps = mode === 'signin' ? 2 : 3;

  // ==========================================
  // VIEW 1: IMMERSIVE WELCOME GATE (Image 1 Style)
  // ==========================================
  if (view === 'welcome') {
    return (
      <View style={styles.welcomeContainer}>
        {/* Custom Glowing Horizon Background Artwork - Zoomed out, perfectly cut-to-cut */}
        <Image
          source={require('@/assets/images/authbg.png')}
          style={styles.welcomeBackgroundImage}
          resizeMode="contain"
        />

        {/* Top Spacer so the artwork's glowing crescent dome and "KaiCodes" brand is cleanly showcased */}
        <View style={styles.welcomeArtworkSpacer} />

        {/* Bottom Content Sheet */}
        <View style={styles.welcomeBottomContent}>
          <Text style={styles.welcomeTitle}>Welcome to KaiCode</Text>
          <Text style={styles.welcomeSubtitle}>
            Master algorithms & system design with interactive daily reps.
          </Text>

          {/* Primary iOS Apple Pill Button in Our Purple */}
          <Pressable
            disabled={loading}
            onPress={handleStartEmail}
            style={({ pressed }) => [
              styles.welcomeEmailBtn,
              pressed && styles.pillPressed,
            ]}
          >
            <Feather name="mail" size={22} color="#FFFFFF" style={{ marginRight: 10 }} />
            <Text style={styles.welcomeEmailBtnText}>Continue with Email</Text>
          </Pressable>

          {/* Secondary Light Card Pill Button */}
          <Pressable
            disabled={loading}
            onPress={handleGuestLogin}
            style={({ pressed }) => [
              styles.welcomeGuestBtn,
              pressed && styles.pillPressed,
            ]}
          >
            <Feather name="compass" size={22} color="#0F172A" style={{ marginRight: 10 }} />
            <Text style={styles.welcomeGuestBtnText}>Continue as Guest</Text>
          </Pressable>

          {/* Quick Demo Test Link */}
          <Pressable onPress={handleDemoLogin} style={styles.demoLink}>
            <Feather name="zap" size={14} color="#7C3AED" />
            <Text style={styles.demoLinkText}>Quick Test: Sign in as Alex Morgan</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ==========================================
  // VIEW 2: STEPPED MINIMALIST AUTH (Image 2 Style)
  // ==========================================
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.formContainer}
    >
      <ScrollView
        contentContainerStyle={styles.formScrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Top Navigation Row (Image 2 style with circular iOS back button) */}
        <View style={styles.formTopBar}>
          <Pressable onPress={handleBack} style={styles.backCircleBtn}>
            <Feather name="chevron-left" size={24} color="#0F172A" />
          </Pressable>

          <View style={styles.stepProgressContainer}>
            {[...Array(totalSteps)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.stepDot,
                  i + 1 <= formStep && styles.stepDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Error Banner */}
        {errorMessage ? (
          <View style={styles.minimalErrorBanner}>
            <Feather name="alert-circle" size={16} color="#DC2626" />
            <Text style={styles.minimalErrorText}>{errorMessage}</Text>
          </View>
        ) : null}

        {/* Dynamic Animated Stepped View with horizontal slide transition */}
        <Animated.View
          style={[
            styles.animatedStepContainer,
            {
              transform: isAnimating ? [{ translateX: slideAnim }] : undefined,
              opacity: fadeAnim,
            },
          ]}
        >
          {mode === 'signin' ? (
            /* ================= SIGN IN STEPS ================= */
            formStep === 1 ? (
              <View style={styles.stepBlock}>
                <Text style={styles.steppedHeading}>What’s Your Email?</Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={[
                      styles.cleanLineInput,
                      inputFocused && styles.cleanLineInputFocused,
                    ]}
                    placeholder="hellobesnik@gmail.com"
                    placeholderTextColor="#94A3B8"
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoFocus
                    keyboardType="email-address"
                    returnKeyType="next"
                    onSubmitEditing={handleContinue}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.stepBlock}>
                <Text style={styles.steppedHeading}>Enter Password</Text>
                <Text style={styles.steppedSubtitle}>
                  Account for <Text style={{ color: '#7C3AED', fontWeight: '700' }}>{email}</Text>
                </Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <View
                    style={[
                      styles.passwordRowWrap,
                      inputFocused && styles.cleanLineInputFocused,
                    ]}
                  >
                    <TextInput
                      style={styles.cleanLineInputFlex}
                      placeholder="Your secret password"
                      placeholderTextColor="#94A3B8"
                      value={password}
                      onChangeText={setPassword}
                      onFocus={() => setInputFocused(true)}
                      onBlur={() => setInputFocused(false)}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoFocus
                      returnKeyType="done"
                      onSubmitEditing={handleContinue}
                    />
                    <Pressable
                      onPress={() => {
                        tap();
                        setShowPassword(!showPassword);
                      }}
                      style={styles.eyeIconBtn}
                    >
                      <Feather
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={20}
                        color="#64748B"
                      />
                    </Pressable>
                  </View>
                </View>
              </View>
            )
          ) : (
            /* ================= SIGN UP STEPS ================= */
            formStep === 1 ? (
              <View style={styles.stepBlock}>
                <Text style={styles.steppedHeading}>What’s Your Email?</Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={[
                      styles.cleanLineInput,
                      inputFocused && styles.cleanLineInputFocused,
                    ]}
                    placeholder="hellobesnik@gmail.com"
                    placeholderTextColor="#94A3B8"
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoFocus
                    returnKeyType="next"
                    onSubmitEditing={handleContinue}
                  />
                </View>
              </View>
            ) : formStep === 2 ? (
              <View style={styles.stepBlock}>
                <Text style={styles.steppedHeading}>Pick a Username</Text>
                <Text style={styles.steppedSubtitle}>
                  This is how you will appear on the daily leagues.
                </Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Username</Text>
                  <View
                    style={[
                      styles.usernameRowWrap,
                      inputFocused && styles.cleanLineInputFocused,
                    ]}
                  >
                    <Text style={styles.usernamePrefix}>@</Text>
                    <TextInput
                      style={styles.cleanLineInputFlex}
                      placeholder="e.g. dev_alex"
                      placeholderTextColor="#94A3B8"
                      value={username}
                      onChangeText={setUsername}
                      onFocus={() => setInputFocused(true)}
                      onBlur={() => setInputFocused(false)}
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoFocus
                      returnKeyType="next"
                      onSubmitEditing={handleContinue}
                    />
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.stepBlock}>
                <Text style={styles.steppedHeading}>Create Password</Text>
                <Text style={styles.steppedSubtitle}>
                  Must be at least 6 characters.
                </Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <View
                    style={[
                      styles.passwordRowWrap,
                      inputFocused && styles.cleanLineInputFocused,
                    ]}
                  >
                    <TextInput
                      style={styles.cleanLineInputFlex}
                      placeholder="At least 6 characters"
                      placeholderTextColor="#94A3B8"
                      value={password}
                      onChangeText={setPassword}
                      onFocus={() => setInputFocused(true)}
                      onBlur={() => setInputFocused(false)}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoFocus
                      returnKeyType="done"
                      onSubmitEditing={handleContinue}
                    />
                    <Pressable
                      onPress={() => {
                        tap();
                        setShowPassword(!showPassword);
                      }}
                      style={styles.eyeIconBtn}
                    >
                      <Feather
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={20}
                        color="#64748B"
                      />
                    </Pressable>
                  </View>
                </View>
              </View>
            )
          )}

          {/* Primary iOS Apple Pill Button in Our Purple (Image 2 style) */}
          <Pressable
            disabled={loading}
            onPress={handleContinue}
            style={({ pressed }) => [
              styles.applePurplePill,
              pressed && styles.pillPressed,
              loading && styles.pillDisabled,
            ]}
          >
            <Text style={styles.applePurplePillText}>
              {loading
                ? 'Checking...'
                : formStep < totalSteps
                ? 'Continue'
                : mode === 'signin'
                ? 'Sign In'
                : 'Create Account'}
            </Text>
          </Pressable>

          {/* Bottom Mode Switcher (Image 2 style with red/coral or purple link) */}
          <View style={styles.bottomSwitcherWrap}>
            <Text style={styles.switcherQuestion}>
              {mode === 'signin' ? 'Don’t have account? ' : 'Already have account? '}
            </Text>
            <Pressable onPress={toggleAuthMode}>
              <Text style={styles.switcherAction}>
                {mode === 'signin' ? 'Sign Up' : 'Sign In'}
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // ==========================================
  // WELCOME VIEW STYLES (Image 1 Style)
  // ==========================================
  welcomeContainer: {
    flex: 1,
    backgroundColor: '#FAF7F2',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  welcomeBackgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    aspectRatio: 852 / 1846,
    maxHeight: '100%',
    ...(Platform.OS === 'web'
      ? ({
          objectFit: 'contain',
          objectPosition: 'top center',
        } as any)
      : {}),
  },
  welcomeArtworkSpacer: {
    flex: 1.25,
    minHeight: 280,
  },
  welcomeBottomContent: {
    width: '100%',
    alignItems: 'center',
    gap: 14,
    zIndex: 10,
  },
  welcomeTitle: {
    fontFamily: 'Nunito_900Black',
    fontSize: 32,
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -0.8,
  },
  welcomeSubtitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
    marginBottom: 6,
  },
  welcomeEmailBtn: {
    backgroundColor: '#7C3AED',
    height: 58,
    borderRadius: 99,
    width: '86%',
    maxWidth: 325,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.32,
    shadowRadius: 12,
    elevation: 5,
  },
  welcomeEmailBtnText: {
    fontFamily: 'Nunito_900Black',
    fontSize: 18.5,
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  welcomeGuestBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    height: 58,
    borderRadius: 99,
    width: '86%',
    maxWidth: 325,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  welcomeGuestBtnText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 18,
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  pillPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
  pillDisabled: {
    opacity: 0.6,
  },
  demoLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
    paddingVertical: 6,
  },
  demoLinkText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    color: '#A78BFA',
  },

  // ==========================================
  // FORM VIEW STYLES (Image 2 Style)
  // ==========================================
  formContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  formScrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 48,
    paddingBottom: 40,
  },
  formTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  backCircleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  stepProgressContainer: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  stepDotActive: {
    backgroundColor: '#7C3AED',
    width: 18,
  },
  minimalErrorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  minimalErrorText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: '#DC2626',
    flex: 1,
  },
  animatedStepContainer: {
    width: '100%',
  },
  stepBlock: {
    gap: 6,
  },
  steppedHeading: {
    fontFamily: 'Nunito_900Black',
    fontSize: 34,
    color: '#0F172A',
    letterSpacing: -0.9,
    marginBottom: 6,
  },
  steppedSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
    marginBottom: 16,
  },
  inputGroup: {
    marginTop: 20,
    gap: 8,
  },
  inputLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#64748B',
  },
  cleanLineInput: {
    height: 50,
    borderWidth: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1.5,
    borderBottomColor: '#CBD5E1',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 19,
    color: '#0F172A',
    paddingHorizontal: 0,
    paddingBottom: 6,
    backgroundColor: 'transparent',
    ...(Platform.OS === 'web'
      ? ({
          outlineStyle: 'none',
          outline: 'none',
          boxShadow: 'none',
          borderTopStyle: 'none',
          borderLeftStyle: 'none',
          borderRightStyle: 'none',
        } as any)
      : {}),
  },
  cleanLineInputFocused: {
    borderBottomColor: '#7C3AED',
    borderBottomWidth: 2.5,
    ...(Platform.OS === 'web'
      ? ({
          outlineStyle: 'none',
          outline: 'none',
          boxShadow: 'none',
        } as any)
      : {}),
  },
  passwordRowWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1.5,
    borderBottomColor: '#CBD5E1',
    height: 50,
    paddingBottom: 6,
    backgroundColor: 'transparent',
    ...(Platform.OS === 'web'
      ? ({
          outlineStyle: 'none',
          outline: 'none',
          borderTopStyle: 'none',
          borderLeftStyle: 'none',
          borderRightStyle: 'none',
        } as any)
      : {}),
  },
  usernameRowWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1.5,
    borderBottomColor: '#CBD5E1',
    height: 50,
    paddingBottom: 6,
    backgroundColor: 'transparent',
    ...(Platform.OS === 'web'
      ? ({
          outlineStyle: 'none',
          outline: 'none',
          borderTopStyle: 'none',
          borderLeftStyle: 'none',
          borderRightStyle: 'none',
        } as any)
      : {}),
  },
  usernamePrefix: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 18,
    color: '#7C3AED',
    marginRight: 4,
  },
  cleanLineInputFlex: {
    flex: 1,
    height: '100%',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 19,
    color: '#0F172A',
    paddingHorizontal: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    ...(Platform.OS === 'web'
      ? ({
          outlineStyle: 'none',
          outline: 'none',
          boxShadow: 'none',
        } as any)
      : {}),
  },
  eyeIconBtn: {
    padding: 6,
  },
  applePurplePill: {
    backgroundColor: '#7C3AED',
    height: 58,
    borderRadius: 99,
    width: '88%',
    maxWidth: 335,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.32,
    shadowRadius: 12,
    elevation: 5,
    marginTop: 32,
  },
  applePurplePillText: {
    fontFamily: 'Nunito_900Black',
    fontSize: 18.5,
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  bottomSwitcherWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  switcherQuestion: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: '#64748B',
  },
  switcherAction: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 15,
    color: '#EF4444',
  },
});
