import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';

import { useAuth } from '@/contexts/auth-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (login(email, password)) {
      router.push('/');
      return;
    }

    Alert.alert('Đăng nhập thất bại', 'Email hoặc mật khẩu không chính xác.');
  };

  return (
    <ThemedView style={styles.pageContainer}>
      <Stack.Screen options={{ title: 'Đăng nhập' }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoiding}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <ThemedText type="title" style={styles.title}>
            Chào mừng trở lại
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Đăng nhập để lưu phòng yêu thích và sử dụng các tính năng cá nhân hóa.
          </ThemedText>

          <View style={styles.fieldGroup}>
            <ThemedText style={styles.fieldLabel}>Email</ThemedText>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="email@example.com"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
          </View>

          <View style={styles.fieldGroup}>
            <ThemedText style={styles.fieldLabel}>Mật khẩu</ThemedText>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              style={styles.input}
            />
          </View>

          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={handleLogin}>
            <ThemedText style={styles.primaryButtonText}>Đăng nhập</ThemedText>
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <ThemedText>Bạn chưa có tài khoản?</ThemedText>
            <TouchableOpacity onPress={() => router.push('/register')} activeOpacity={0.85}>
              <ThemedText style={styles.footerLink}>Đăng ký ngay</ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardAvoiding: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 18,
  },
  title: {
    fontSize: 32,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#475569',
  },
  fieldGroup: {
    gap: 10,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#334155',
  },
  input: {
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  primaryButton: {
    marginTop: 8,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#0A7EA4',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 18,
  },
  footerLink: {
    color: '#0A7EA4',
    fontWeight: '700',
  },
});
