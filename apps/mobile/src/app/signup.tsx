import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Radius, Tokens, Spacing } from '@/constants/theme';

export default function SignUpScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [nin, setNin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    try {
      router.push('/explore');
    } catch {
      // Fallback
    }
  };

  const handleGoogleSignUp = () => {
    try {
      router.push('/explore');
    } catch {
      // Fallback
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardContainer}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: insets.top + Spacing[4],
            paddingBottom: Math.max(insets.bottom, Spacing[5]) + Spacing[3],
          },
        ]}
        keyboardShouldPersistTaps="handled">
        {/* Brand Header */}
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/vantaged-measurement-logo.png')}
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
            source={require('@/assets/images/google-icon.svg')}
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

          {/* NIN (National Identity Number) Field */}
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

          {/* Sign Up Primary Button (Owner Dashboard border-radius: 10px) */}
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

          {/* Already have an account row */}
          <View style={styles.loginRow}>
            <Text style={styles.alreadyText}>Already have an account? </Text>
            <Pressable
              onPress={() => router.push('/signin')}
              accessibilityRole="link"
              accessibilityLabel="Log In">
              <Text style={styles.loginLinkText}>Log In</Text>
            </Pressable>
          </View>

          {/* Back to Welcome */}
          <Pressable
            style={styles.backButton}
            onPress={() => router.push('/')}>
            <Text style={styles.backButtonText}>← Back to Welcome</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: Spacing[6],
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  logo: {
    width: 170,
    height: 42,
    marginBottom: Spacing[3],
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#261A66',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Outfit-Bold',
      android: 'Outfit-Bold',
      default: 'Outfit, sans-serif',
    }),
  },
  subtitle: {
    fontSize: 13,
    color: '#7C7894',
    textAlign: 'center',
    maxWidth: 290,
    lineHeight: 18,
    fontFamily: Platform.select({
      ios: 'Outfit',
      android: 'Outfit',
      default: 'Outfit, sans-serif',
    }),
  },
  googleButton: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E0EC',
    borderRadius: Radius.md, // 10px (Owner dashboard rounded-md)
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: Spacing[3],
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
    width: 19,
    height: 19,
  },
  googleButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#261A66',
    fontFamily: Platform.select({
      ios: 'Outfit-Bold',
      android: 'Outfit-Bold',
      default: 'Outfit, sans-serif',
    }),
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing[3],
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E0EC',
  },
  dividerText: {
    paddingHorizontal: 12,
    fontSize: 11.5,
    color: '#A3A0B8',
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'Outfit',
      android: 'Outfit',
      default: 'Outfit, sans-serif',
    }),
  },
  form: {
    gap: Spacing[3],
  },
  inputGroup: {
    gap: 5,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#261A66',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: Platform.select({
      ios: 'Outfit-Bold',
      android: 'Outfit-Bold',
      default: 'Outfit, sans-serif',
    }),
  },
  labelHint: {
    fontSize: 10.5,
    color: '#A3A0B8',
    fontWeight: '500',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E0EC',
    borderRadius: Radius.md, // 10px (Owner dashboard rounded-md)
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#261A66',
    backgroundColor: '#F7F7FA',
    fontFamily: Platform.select({
      ios: 'Outfit',
      android: 'Outfit',
      default: 'Outfit, sans-serif',
    }),
  },
  signUpButton: {
    backgroundColor: Tokens.color.orange[500], // #EF5F18
    height: 50,
    borderRadius: Radius.md, // 10px
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing[2],
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
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Outfit-Bold',
      android: 'Outfit-Bold',
      default: 'Outfit, sans-serif',
    }),
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  alreadyText: {
    color: '#7C7894',
    fontSize: 13,
    fontFamily: Platform.select({
      ios: 'Outfit',
      android: 'Outfit',
      default: 'Outfit, sans-serif',
    }),
  },
  loginLinkText: {
    color: Tokens.color.orange[500],
    fontSize: 13,
    fontWeight: '700',
    fontFamily: Platform.select({
      ios: 'Outfit-Bold',
      android: 'Outfit-Bold',
      default: 'Outfit, sans-serif',
    }),
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 2,
  },
  backButtonText: {
    fontSize: 12.5,
    color: '#7C7894',
    fontWeight: '600',
    fontFamily: Platform.select({
      ios: 'Outfit-Medium',
      android: 'Outfit-Medium',
      default: 'Outfit, sans-serif',
    }),
  },
});
