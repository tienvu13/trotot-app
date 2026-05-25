import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';

import { useAuth } from '@/contexts/auth-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Khách hàng');

  const handleRegister = () => {
    if (!name || !email || !password || !role) {
      Alert.alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (register(name, email, password, role)) {
      router.push('/');
      return;
    }

    Alert.alert('Đăng ký thất bại', 'Email này đã được sử dụng.');
  };

  return (
    <ThemedView style={styles.pageContainer}>
      <Stack.Screen options={{ title: 'Đăng ký' }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoiding}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <ThemedText type="title" style={styles.title}>
            Tạo tài khoản mới
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Đăng ký nhanh để lưu phòng yêu thích và quản lý dữ liệu của bạn.
          </ThemedText>

          <View style={styles.fieldGroup}>
            <ThemedText style={styles.fieldLabel}>Họ và tên</ThemedText>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Nhập họ tên"
              placeholderTextColor="#94A3B8"
              style={styles.input}
            />
          </View>

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

          <View style={styles.fieldGroup}>
            <ThemedText style={styles.fieldLabel}>Vai trò</ThemedText>
            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[styles.roleButton, role === 'Khách hàng' && styles.roleButtonActive]}
                onPress={() => setRole('Khách hàng')}
                activeOpacity={0.85}
              >
                <ThemedText style={role === 'Khách hàng' ? styles.roleTextActive : styles.roleText}>
                  Khách hàng
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleButton, role === 'Hộ kinh doanh' && styles.roleButtonActive]}
                onPress={() => setRole('Hộ kinh doanh')}
                activeOpacity={0.85}
              >
                <ThemedText style={role === 'Hộ kinh doanh' ? styles.roleTextActive : styles.roleText}>
                  Hộ kinh doanh
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={handleRegister}>
            <ThemedText style={styles.primaryButtonText}>Đăng ký</ThemedText>
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <ThemedText>Đã có tài khoản?</ThemedText>
            <TouchableOpacity onPress={() => router.push('/login')} activeOpacity={0.85}>
              <ThemedText style={styles.footerLink}>Đăng nhập</ThemedText>
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
  roleContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  roleButtonActive: {
    backgroundColor: '#0A7EA4',
    borderColor: '#0A7EA4',
  },
  roleText: {
    fontSize: 16,
    color: '#64748B',
  },
  roleTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
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
