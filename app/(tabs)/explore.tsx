import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/contexts/auth-context";

export default function ExploreAsAuth() {
  const router = useRouter();
  const { login, register, user, logout } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [authMessage, setAuthMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );

  // login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // register fields
  const [name, setName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [role, setRole] = useState("Khách hàng");

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setRegEmail("");
    setRegPassword("");
    setRole("Khách hàng");
    setAuthMessage("");
  };

  const handleLogin = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!normalizedEmail || !password) {
      setAuthMessage("Vui lòng nhập email và mật khẩu.");
      setMessageType("error");
      return;
    }

    if (!emailPattern.test(normalizedEmail)) {
      setAuthMessage("Email không hợp lệ.");
      setMessageType("error");
      return;
    }

    if (await login(normalizedEmail, password)) {
      resetForm();
      setAuthMessage("Đăng nhập thành công.");
      setMessageType("success");
      return;
    }

    setAuthMessage("Email hoặc mật khẩu không chính xác.");
    setMessageType("error");
  };

  const handleRegister = async () => {
    const normalizedEmail = regEmail.trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !normalizedEmail || !regPassword || !role) {
      setAuthMessage("Vui lòng nhập đầy đủ thông tin.");
      setMessageType("error");
      return;
    }

    if (!emailPattern.test(normalizedEmail)) {
      setAuthMessage("Email không hợp lệ.");
      setMessageType("error");
      return;
    }

    if (regPassword.length < 6) {
      setAuthMessage("Mật khẩu phải có ít nhất 6 ký tự.");
      setMessageType("error");
      return;
    }

    if (await register(name, normalizedEmail, regPassword, role)) {
      resetForm();
      setAuthMessage("Đăng ký thành công.");
      setMessageType("success");
      return;
    }

    setAuthMessage("Email này đã được sử dụng.");
    setMessageType("error");
  };

  // If user is logged in, show profile on this page
  if (user) {
    return (
      <ThemedView style={styles.page}>
        <Stack.Screen options={{ title: "Tài khoản" }} />
        <View style={styles.card}>
          <ThemedText type="title" style={styles.title}>
            {user.name}
          </ThemedText>
          <ThemedText style={styles.subtitle}>Email: {user.email}</ThemedText>
          <ThemedText style={styles.subtitle}>Vai trò: {user.role}</ThemedText>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              { backgroundColor: "#EF4444", marginTop: 12 },
            ]}
            activeOpacity={0.85}
            onPress={() => {
              logout();
              setMode("login");
              setAuthMessage("Bạn đã đăng xuất.");
              setMessageType("success");
            }}
          >
            <ThemedText style={styles.primaryButtonText}>Đăng xuất</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.page}>
      <Stack.Screen options={{ title: "Đăng nhập / Đăng ký" }} />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
      >
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabButton, mode === "login" && styles.tabActive]}
            onPress={() => setMode("login")}
          >
            <ThemedText
              style={mode === "login" ? styles.tabTextActive : styles.tabText}
            >
              Đăng nhập
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, mode === "register" && styles.tabActive]}
            onPress={() => setMode("register")}
          >
            <ThemedText
              style={
                mode === "register" ? styles.tabTextActive : styles.tabText
              }
            >
              Đăng ký
            </ThemedText>
          </TouchableOpacity>
        </View>

        {mode === "login" ? (
          <View style={styles.card}>
            <ThemedText type="title" style={styles.title}>
              Chào mừng trở lại
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Đăng nhập để lưu phòng yêu thích và sử dụng các tính năng cá nhân
              hóa.
            </ThemedText>

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

            <ThemedText style={styles.fieldLabel}>Mật khẩu</ThemedText>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              style={styles.input}
            />

            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.85}
              onPress={handleLogin}
            >
              <ThemedText style={styles.primaryButtonText}>
                Đăng nhập
              </ThemedText>
            </TouchableOpacity>
            {authMessage ? (
              <ThemedText
                style={[
                  styles.messageText,
                  messageType === "error"
                    ? styles.errorText
                    : styles.successText,
                ]}
              >
                {authMessage}
              </ThemedText>
            ) : null}
            <View style={styles.linkRow}>
              <ThemedText>Hoặc</ThemedText>
              <TouchableOpacity
                onPress={() => router.push("/register")}
                activeOpacity={0.85}
              >
                <ThemedText style={styles.linkText}>
                  {" "}
                  Mở trang đăng ký riêng
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.card}>
            <ThemedText type="title" style={styles.title}>
              Tạo tài khoản mới
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Đăng ký nhanh để lưu phòng yêu thích và quản lý dữ liệu của bạn.
            </ThemedText>

            <ThemedText style={styles.fieldLabel}>Họ và tên</ThemedText>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Nhập họ tên"
              placeholderTextColor="#94A3B8"
              style={styles.input}
            />

            <ThemedText style={styles.fieldLabel}>Email</ThemedText>
            <TextInput
              value={regEmail}
              onChangeText={setRegEmail}
              placeholder="email@example.com"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />

            <ThemedText style={styles.fieldLabel}>Mật khẩu</ThemedText>
            <TextInput
              value={regPassword}
              onChangeText={setRegPassword}
              placeholder="••••••••"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              style={styles.input}
            />

            <View style={styles.roleRow}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === "Khách hàng" && styles.roleActive,
                ]}
                onPress={() => setRole("Khách hàng")}
              >
                <ThemedText
                  style={
                    role === "Khách hàng"
                      ? styles.roleTextActive
                      : styles.roleText
                  }
                >
                  Khách hàng
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === "Hộ kinh doanh" && styles.roleActive,
                ]}
                onPress={() => setRole("Hộ kinh doanh")}
              >
                <ThemedText
                  style={
                    role === "Hộ kinh doanh"
                      ? styles.roleTextActive
                      : styles.roleText
                  }
                >
                  Hộ kinh doanh
                </ThemedText>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.85}
              onPress={handleRegister}
            >
              <ThemedText style={styles.primaryButtonText}>Đăng ký</ThemedText>
            </TouchableOpacity>
            {authMessage ? (
              <ThemedText
                style={[
                  styles.messageText,
                  messageType === "error"
                    ? styles.errorText
                    : styles.successText,
                ]}
              >
                {authMessage}
              </ThemedText>
            ) : null}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F8FAFC" },
  content: { padding: 18, gap: 12 },
  tabRow: { flexDirection: "row", gap: 8, marginBottom: 6 },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
  },
  tabActive: { backgroundColor: "#0A7EA4" },
  tabText: { color: "#0A7EA4", fontWeight: "600" },
  tabTextActive: { color: "#FFFFFF", fontWeight: "700" },
  card: { borderRadius: 18, backgroundColor: "#FFFFFF", padding: 16, gap: 10 },
  title: { fontSize: 28, lineHeight: 36 },
  subtitle: { color: "#475569" },
  fieldLabel: { fontSize: 14, color: "#334155" },
  input: {
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  primaryButton: {
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#0A7EA4",
    alignItems: "center",
  },
  primaryButtonText: { color: "#FFFFFF", fontWeight: "700" },
  roleRow: { flexDirection: "row", gap: 8, marginTop: 6 },
  roleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  roleActive: { backgroundColor: "#0A7EA4", borderColor: "#0A7EA4" },
  roleText: { color: "#64748B" },
  roleTextActive: { color: "#FFFFFF", fontWeight: "700" },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  linkText: { color: "#0A7EA4" },
  messageText: { fontSize: 14, marginTop: 12 },
  errorText: { color: "#DC2626" },
  successText: { color: "#16A34A" },
});
