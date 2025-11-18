import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Colors, FontSizes, FontWeights, Spacing } from '../styles/theme';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../navigation/AppNavigator';

type LoginScreenProps = StackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    await login(email, password);
    navigation.replace('LocationPreference');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="location" size={60} color={Colors.primaryBlue} />
          </View>
          <Text style={styles.welcomeText}>Welcome Back</Text>
          <Text style={styles.subtitle}>Connect with friends around the world</Text>
        </View>

        <View style={styles.form}>
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            icon={<Ionicons name="mail-outline" size={20} color={Colors.textSecondary} />}
            style={styles.input}
          />

          <Input
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secure
            icon={<Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} />}
            style={styles.input}
          />

          <Button
            title="Login"
            onPress={handleLogin}
            loading={isLoading}
            style={styles.loginButton}
          />

          <TouchableOpacity style={styles.signUpContainer}>
            <Text style={styles.signUpText}>
              Don't have an account?{' '}
              <Text style={styles.signUpLink}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.paleBlue,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  logoContainer: {
    marginBottom: Spacing.lg,
  },
  welcomeText: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: Spacing.lg,
  },
  loginButton: {
    marginTop: Spacing.md,
  },
  signUpContainer: {
    marginTop: Spacing.xl,
    alignItems: 'center',
  },
  signUpText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  signUpLink: {
    color: Colors.secondaryBlue,
    fontWeight: FontWeights.semibold,
  },
});
