import React, { useState } from 'react';
import {
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
import { loginUser, registerUser, UserAccount } from '@/services/turso';

interface AuthScreenProps {
  onSuccess: (user: UserAccount, isNewUser: boolean) => void;
}

export function AuthScreen({ onSuccess }: AuthScreenProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const tap = () => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.selectionAsync();
      } catch {}
    }
  };

  const handleSubmit = async () => {
    tap();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter your email and password.');
      return;
    }

    if (mode === 'signup' && !username.trim()) {
      setErrorMessage('Please pick a unique username.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        const result = await registerUser({
          email: email.trim(),
          password,
          username: username.trim(),
          displayName: displayName.trim() || username.trim(),
        });

        if (result.error) {
          setErrorMessage(result.error);
        } else if (result.user) {
          onSuccess(result.user, true);
        }
      } else {
        const result = await loginUser({
          emailOrUsername: email.trim(),
          password,
        });

        if (result.error) {
          setErrorMessage(result.error);
        } else if (result.user) {
          onSuccess(result.user, false);
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    tap();
    setLoading(true);
    const demoUser = await registerUser({
      email: 'alex@kaicode.dev',
      password: 'password123',
      username: 'alex_code',
      displayName: 'Alex Morgan',
    });
    setLoading(false);
    if (demoUser.user) {
      onSuccess(demoUser.user, true);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandRow}>
          <Image
            source={require('@/assets/images/kai_accepted.png')}
            style={styles.logoMascot}
            resizeMode="contain"
          />
          <Text style={styles.brandName}>
            kai<Text style={{ color: '#7C3AED' }}>code</Text>
          </Text>
        </View>

        <View style={styles.heroBox}>
          <Text style={styles.heroTitle}>
            {mode === 'signup' ? 'Create your profile' : 'Welcome back'}
          </Text>
          <Text style={styles.heroSubtitle}>
            {mode === 'signup'
              ? 'Join fellow engineers leveling up their DSA and Core CS skills with Kai.'
              : 'Log in to continue your daily engineering streak.'}
          </Text>
        </View>

        <View style={styles.togglePill}>
          <Pressable
            onPress={() => {
              tap();
              setMode('signup');
              setErrorMessage('');
            }}
            style={[styles.toggleBtn, mode === 'signup' && styles.toggleBtnActive]}
          >
            <Text style={[styles.toggleText, mode === 'signup' && styles.toggleTextActive]}>
              Create Account
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              tap();
              setMode('signin');
              setErrorMessage('');
            }}
            style={[styles.toggleBtn, mode === 'signin' && styles.toggleBtnActive]}
          >
            <Text style={[styles.toggleText, mode === 'signin' && styles.toggleTextActive]}>
              Sign In
            </Text>
          </Pressable>
        </View>

        {errorMessage ? (
          <View style={styles.errorBanner}>
            <Feather name="alert-circle" size={17} color="#DC2626" />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <View style={styles.formCard}>
          {mode === 'signup' && (
            <>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>CHOSEN USERNAME</Text>
                <View style={styles.inputWrap}>
                  <Text style={styles.inputPrefix}>@</Text>
                  <TextInput
                    style={styles.textInputWithPrefix}
                    placeholder="e.g. dev_sarah"
                    placeholderTextColor="#94A3B8"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>DISPLAY NAME (OPTIONAL)</Text>
                <View style={styles.inputWrap}>
                  <Feather name="user" size={17} color="#64748B" style={styles.fieldIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. Sarah Connor"
                    placeholderTextColor="#94A3B8"
                    value={displayName}
                    onChangeText={setDisplayName}
                    autoCapitalize="words"
                  />
                </View>
              </View>
            </>
          )}

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              {mode === 'signup' ? 'EMAIL ADDRESS' : 'EMAIL OR USERNAME'}
            </Text>
            <View style={styles.inputWrap}>
              <Feather name="mail" size={17} color="#64748B" style={styles.fieldIcon} />
              <TextInput
                style={styles.textInput}
                placeholder={mode === 'signup' ? 'sarah@engineering.edu' : 'sarah@engineering.edu or @sarah'}
                placeholderTextColor="#94A3B8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>PASSWORD</Text>
            <View style={styles.inputWrap}>
              <Feather name="lock" size={17} color="#64748B" style={styles.fieldIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="At least 6 characters"
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <Pressable
                onPress={() => {
                  tap();
                  setShowPassword(!showPassword);
                }}
                style={styles.eyeBtn}
              >
                <Feather
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={17}
                  color="#64748B"
                />
              </Pressable>
            </View>
          </View>

          <Pressable
            disabled={loading}
            onPress={handleSubmit}
            style={({ pressed }) => [
              styles.submitBtn,
              pressed && styles.submitBtnPressed,
              loading && styles.submitBtnDisabled,
            ]}
          >
            <Text style={styles.submitBtnText}>
              {loading
                ? 'Connecting to Turso...'
                : mode === 'signup'
                ? 'Continue to Profile Setup'
                : 'Sign In to KaiCode'}
            </Text>
            <Feather name="arrow-right" size={18} color="#FFFFFF" strokeWidth={2.8} />
          </Pressable>
        </View>

        <View style={styles.demoSection}>
          <Pressable onPress={handleDemoLogin} style={styles.demoBtn}>
            <Feather name="zap" size={15} color="#7C3AED" />
            <Text style={styles.demoBtnText}>Quick Test: Sign in as Alex Morgan</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 50,
    paddingBottom: 40,
    gap: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoMascot: {
    width: 38,
    height: 38,
  },
  brandName: {
    fontSize: 26,
    fontFamily: 'Nunito_800ExtraBold',
    color: '#0F172A',
    letterSpacing: -0.6,
  },
  heroBox: {
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 24,
    fontFamily: 'Nunito_800ExtraBold',
    color: '#0F172A',
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 12,
  },
  togglePill: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    color: '#64748B',
  },
  toggleTextActive: {
    fontFamily: 'Nunito_800ExtraBold',
    color: '#7C3AED',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    backgroundColor: '#FEE2E2',
    borderWidth: 1.5,
    borderColor: '#FECACA',
    borderRadius: 14,
    padding: 12,
  },
  errorText: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: '#DC2626',
    lineHeight: 17,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderBottomWidth: 4,
    borderBottomColor: '#CBD5E1',
    padding: 18,
    gap: 14,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 11,
    letterSpacing: 0.6,
    color: '#475569',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 13,
    paddingHorizontal: 12,
    height: 48,
  },
  fieldIcon: {
    marginRight: 9,
  },
  inputPrefix: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 15,
    color: '#7C3AED',
    marginRight: 4,
  },
  textInput: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#0F172A',
    height: '100%',
  },
  textInputWithPrefix: {
    flex: 1,
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: '#0F172A',
    height: '100%',
  },
  eyeBtn: {
    padding: 6,
  },
  submitBtn: {
    backgroundColor: '#7C3AED',
    borderRadius: 16,
    borderBottomWidth: 4.5,
    borderBottomColor: '#5B21B6',
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 6,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnPressed: {
    transform: [{ translateY: 2 }],
    borderBottomWidth: 2,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 15,
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  demoSection: {
    alignItems: 'center',
    marginTop: 2,
  },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#F5F3FF',
    borderWidth: 1.5,
    borderColor: '#DDD6FE',
    borderBottomWidth: 3,
    borderBottomColor: '#C4B5FD',
    borderRadius: 13,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  demoBtnText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    color: '#7C3AED',
  },
});
