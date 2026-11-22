import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Radius, Tokens, Spacing } from '@/constants/theme';
import { useOwnerMobile } from '@/pages/owner dashboard';

export default function SignUpScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setUserProfile } = useOwnerMobile();

  const [fullName, setFullName] = useState('');
  const [nin, setNin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    if (fullName.trim() || email.trim()) {
      setUserProfile({
        ...(fullName.trim() ? { fullName: fullName.trim() } : {}),
        ...(email.trim() ? { email: email.trim() } : {}),
      });
    }
    try {
      router.replace('/dashboard');
    } catch {
      // Fallback
    }
  };

  const handleGoogleSignUp = () => {
    try {
      router.replace('/dashboard');
    } catch {
      // Fallback
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardContainer}>
      <StatusBar style="dark" />
      <Pressable
        style={[
          styles.container,
          {
            paddingTop: Math.max(insets.top, Spacing[3]),
            paddingBottom: Math.max(insets.bottom, Spacing[3]),
          },
        ]}
        onPress={Platform.OS === 'web' ? undefined : Keyboard.dismiss}>
        {/* Brand Header */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/vantaged-measurement-logo.png')}
            style={styles.logo}
            contentFit="contain"
          />
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>
            Join Vantaged to oversee your construction projects
          </Text>
        </View>

        {/* Google SSO Button */}
        <Pressable
          style={({ pressed }) => [
            styles.googleButton,
            pressed && styles.googleButtonPressed,
          ]}
          onPress={handleGoogleSignUp}
          accessibilityRole="button"
          accessibilityLabel="Sign up with Google">
          <Image
            source={require('../../assets/images/google-icon.svg')}
            style={styles.googleIcon}
            contentFit="contain"
          />
          <Text style={styles.googleButtonText}>Sign up with Google</Text>
        </Pressable>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or register with details</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Form Inputs */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Adebayo Olumide"
              placeholderTextColor="#A3A0B8"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>NIN (National Identity Number)</Text>
              <Text style={styles.labelHint}>11 digits</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="11-digit NIN (e.g. 12345678901)"
              placeholderTextColor="#A3A0B8"
              value={nin}
              onChangeText={(text) => setNin(text.replace(/[^0-9]/g, '').slice(0, 11))}
              keyboardType="number-pad"
              maxLength={11}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="name@example.com"
              placeholderTextColor="#A3A0B8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#A3A0B8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Sign Up Primary Button */}
          <Pressable
            style={({ pressed }) => [
              styles.signUpButton,
              pressed && styles.signUpButtonPressed,
            ]}
            onPress={handleSignUp}
            accessibilityRole="button"
            accessibilityLabel="Sign Up">
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </Pressable>

          {/* Footer Links */}
          <View style={styles.footerLinks}>
            <View style={styles.loginRow}>
              <Text style={styles.alreadyText}>Already have an account? </Text>
              <Pressable
                onPress={() => router.push('/signin')}
                accessibilityRole="link"
                accessibilityLabel="Log In">
                <Text style={styles.loginLinkText}>Log In</Text>
              </Pressable>
            </View>

            <Pressable
              style={styles.backButton}
              onPress={() => router.push('/')}>
              <Text style={styles.backButtonText}>← Back to Welcome</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing[5],
    justifyContent: 'center',
    overflow: 'hidden',
  },
  header: {
    alignItems: 'center',
    marginBottom: 12,
  },
  logo: {
    width: 175,
    height: 44,
    marginBottom: 6,
  },
  title: {
    fontSize: 21,
    color: '#261A66',
    marginBottom: 2,
    includeFontPadding: false,
    ...(Platform.OS === 'web' ? { fontWeight: '800' as const } : {}),
    fontFamily: Platform.select({
      ios: 'Outfit-Bold',
      android: 'Outfit-Bold',
      default: 'Outfit, sans-serif',
    }),
  },
  subtitle: {
    fontSize: 12,
    color: '#7C7894',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 16,
    fontFamily: Platform.select({
      ios: 'Outfit',
      android: 'Outfit',
      default: 'Outfit, sans-serif',
    }),
  },
  googleButton: {
    height: 44,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E0EC',
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 10,
    shadowColor: '#261A66',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  googleButtonPressed: {
    backgroundColor: '#F7F7FA',
    transform: [{ scale: 0.99 }],
  },
  googleIcon: {
    width: 18,
    height: 18,
  },
  googleButtonText: {
    fontSize: 14,
    color: '#261A66',
    includeFontPadding: false,
    ...(Platform.OS === 'web' ? { fontWeight: '700' as const } : {}),
    fontFamily: Platform.select({
      ios: 'Outfit-Bold',
      android: 'Outfit-Bold',
      default: 'Outfit, sans-serif',
    }),
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E0EC',
  },
  dividerText: {
    paddingHorizontal: 10,
    fontSize: 11,
    color: '#A3A0B8',
    fontFamily: Platform.select({
      ios: 'Outfit',
      android: 'Outfit',
      default: 'Outfit, sans-serif',
    }),
  },
  form: {
    gap: 9,
  },
  inputGroup: {
    gap: 3,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 11,
    color: '#261A66',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    includeFontPadding: false,
    ...(Platform.OS === 'web' ? { fontWeight: '700' as const } : {}),
    fontFamily: Platform.select({
      ios: 'Outfit-Bold',
      android: 'Outfit-Bold',
      default: 'Outfit, sans-serif',
    }),
  },
  labelHint: {
    fontSize: 10,
    color: '#A3A0B8',
    fontFamily: Platform.select({
      ios: 'Outfit',
      android: 'Outfit',
      default: 'Outfit, sans-serif',
    }),
  },
  input: {
    height: 42,
    borderWidth: 1,
    borderColor: '#E2E0EC',
    borderRadius: Radius.md,
    paddingHorizontal: 13,
    fontSize: 13.5,
    color: '#261A66',
    backgroundColor: '#F7F7FA',
    fontFamily: Platform.select({
      ios: 'Outfit',
      android: 'Outfit',
      default: 'Outfit, sans-serif',
    }),
  },
  signUpButton: {
    backgroundColor: Tokens.color.orange[500],
    height: 46,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    paddingHorizontal: Spacing[4],
    shadowColor: Tokens.color.orange[500],
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  signUpButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
  signUpButtonText: {
    width: '100%',
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 15,
    includeFontPadding: false,
    ...(Platform.OS === 'web' ? { fontWeight: '700' as const } : {}),
    fontFamily: Platform.select({
      ios: 'Outfit-Bold',
      android: 'Outfit-Bold',
      default: 'Outfit, sans-serif',
    }),
  },
  footerLinks: {
    gap: 2,
    marginTop: 4,
    alignItems: 'center',
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alreadyText: {
    color: '#7C7894',
    fontSize: 12.5,
    fontFamily: Platform.select({
      ios: 'Outfit',
      android: 'Outfit',
      default: 'Outfit, sans-serif',
    }),
  },
  loginLinkText: {
    color: Tokens.color.orange[500],
    fontSize: 12.5,
    ...(Platform.OS === 'web' ? { fontWeight: '700' as const } : {}),
    fontFamily: Platform.select({
      ios: 'Outfit-Bold',
      android: 'Outfit-Bold',
      default: 'Outfit, sans-serif',
    }),
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  backButtonText: {
    fontSize: 12,
    color: '#7C7894',
    fontFamily: Platform.select({
      ios: 'Outfit-Medium',
      android: 'Outfit-Medium',
      default: 'Outfit, sans-serif',
    }),
  },
});
