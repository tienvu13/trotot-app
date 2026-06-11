import { Stack, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/contexts/auth-context";
import { useFavorites } from "@/contexts/favorites-context";
import { useListings } from "@/contexts/listings-context";

export default function AccountScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const { getUserListings } = useListings();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const userListings = useMemo(() => {
    if (!user) return [];
    return getUserListings(user.email);
  }, [user, getUserListings]);

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc muốn đăng xuất khỏi tài khoản?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          setIsLoggingOut(true);
          logout();
          router.replace("/login");
        },
      },
    ]);
  };

  if (!user) {
    return (
      <ThemedView style={styles.pageContainer}>
        <Stack.Screen options={{ title: "Tài khoản" }} />
        <View style={styles.notLoggedInContainer}>
          <IconSymbol name="person.fill" size={64} color="#CBD5E1" />
          <ThemedText type="title" style={styles.notLoggedInTitle}>
            Chưa đăng nhập
          </ThemedText>
          <ThemedText style={styles.notLoggedInSubtitle}>
            Vui lòng đăng nhập để xem tài khoản của bạn.
          </ThemedText>
          <TouchableOpacity
            style={styles.loginButton}
            activeOpacity={0.85}
            onPress={() => router.push("/login")}
          >
            <ThemedText style={styles.loginButtonText}>Đăng nhập</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  const getAvatarInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <ThemedView style={styles.pageContainer}>
      <Stack.Screen options={{ title: "Tài khoản" }} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <ThemedText style={styles.avatarText}>
                {getAvatarInitial(user.name)}
              </ThemedText>
            </View>
            <View style={styles.verifiedBadge}>
              <IconSymbol
                name="checkmark.circle.fill"
                size={24}
                color="#059669"
              />
            </View>
          </View>

          <ThemedText type="title" style={styles.userName}>
            {user.name}
          </ThemedText>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <IconSymbol name="envelope.fill" size={18} color="#0A7EA4" />
              </View>
              <View style={styles.infoContent}>
                <ThemedText style={styles.infoLabel}>Email</ThemedText>
                <ThemedText style={styles.infoValue}>{user.email}</ThemedText>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <IconSymbol
                  name="person.badge.fill"
                  size={18}
                  color="#0A7EA4"
                />
              </View>
              <View style={styles.infoContent}>
                <ThemedText style={styles.infoLabel}>Vai trò</ThemedText>
                <ThemedText style={styles.infoValue}>{user.role}</ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Activity Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <IconSymbol name="heart.fill" size={24} color="#DC2626" />
            </View>
            <View style={styles.statContent}>
              <ThemedText style={styles.statValue}>
                {favorites.length}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Yêu thích</ThemedText>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <IconSymbol name="house.fill" size={24} color="#0A7EA4" />
            </View>
            <View style={styles.statContent}>
              <ThemedText style={styles.statValue}>
                {userListings.length}
              </ThemedText>
              <ThemedText style={styles.statLabel}>
                {user.role === "Hộ kinh doanh" ? "Bài đăng" : "Phòng"}
              </ThemedText>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <IconSymbol name="calendar" size={24} color="#8B5CF6" />
            </View>
            <View style={styles.statContent}>
              <ThemedText style={styles.statValue}>0</ThemedText>
              <ThemedText style={styles.statLabel}>Bản nháp</ThemedText>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        {user.role === "Hộ kinh doanh" && (
          <View style={styles.quickActionsSection}>
            <ThemedText style={styles.sectionTitle}>Hành động nhanh</ThemedText>
            <TouchableOpacity
              style={styles.quickActionButton}
              activeOpacity={0.7}
              onPress={() => router.push("/post")}
            >
              <IconSymbol name="plus.circle.fill" size={20} color="#FFFFFF" />
              <ThemedText style={styles.quickActionText}>
                Đăng bài mới
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}

        {/* My Content */}
        <View style={styles.contentSection}>
          <ThemedText style={styles.sectionTitle}>Nội dung của tôi</ThemedText>

          <TouchableOpacity
            style={styles.contentItem}
            activeOpacity={0.7}
            onPress={() => router.push("/(tabs)/saved")}
          >
            <View style={styles.contentItemLeft}>
              <IconSymbol name="bookmark.fill" size={20} color="#0A7EA4" />
              <View style={styles.contentItemContent}>
                <ThemedText style={styles.contentItemTitle}>
                  Phòng yêu thích
                </ThemedText>
                <ThemedText style={styles.contentItemSubtitle}>
                  {favorites.length} phòng đã lưu
                </ThemedText>
              </View>
            </View>
            <IconSymbol name="chevron.right" size={20} color="#CBD5E1" />
          </TouchableOpacity>

          {user.role === "Hộ kinh doanh" && (
            <>
              <TouchableOpacity
                style={styles.contentItem}
                activeOpacity={0.7}
                onPress={() => router.push("/post")}
              >
                <View style={styles.contentItemLeft}>
                  <IconSymbol name="house.fill" size={20} color="#0A7EA4" />
                  <View style={styles.contentItemContent}>
                    <ThemedText style={styles.contentItemTitle}>
                      Bài đăng của tôi
                    </ThemedText>
                    <ThemedText style={styles.contentItemSubtitle}>
                      {userListings.length} bài đăng đang hoạt động
                    </ThemedText>
                  </View>
                </View>
                <IconSymbol name="chevron.right" size={20} color="#CBD5E1" />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Security & Privacy */}
        <View style={styles.menuSection}>
          <ThemedText style={styles.sectionTitle}>
            Bảo mật & Riêng tư
          </ThemedText>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert("Chưa có", "Tính năng này sẽ được thêm sau.")
            }
          >
            <View style={styles.menuItemLeft}>
              <IconSymbol name="lock.fill" size={20} color="#0A7EA4" />
              <View style={styles.menuItemContent}>
                <ThemedText style={styles.menuItemTitle}>
                  Đổi mật khẩu
                </ThemedText>
                <ThemedText style={styles.menuItemSubtitle}>
                  Cập nhật mật khẩu tài khoản
                </ThemedText>
              </View>
            </View>
            <IconSymbol name="chevron.right" size={20} color="#CBD5E1" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert("Chưa có", "Tính năng này sẽ được thêm sau.")
            }
          >
            <View style={styles.menuItemLeft}>
              <IconSymbol name="eye.slash.fill" size={20} color="#0A7EA4" />
              <View style={styles.menuItemContent}>
                <ThemedText style={styles.menuItemTitle}>
                  Quyền riêng tư
                </ThemedText>
                <ThemedText style={styles.menuItemSubtitle}>
                  Quản lý cài đặt riêng tư
                </ThemedText>
              </View>
            </View>
            <IconSymbol name="chevron.right" size={20} color="#CBD5E1" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert("Chưa có", "Tính năng này sẽ được thêm sau.")
            }
          >
            <View style={styles.menuItemLeft}>
              <IconSymbol name="shield.fill" size={20} color="#0A7EA4" />
              <View style={styles.menuItemContent}>
                <ThemedText style={styles.menuItemTitle}>
                  Xác thực hai yếu tố
                </ThemedText>
                <ThemedText style={styles.menuItemSubtitle}>
                  Bảo vệ tài khoản của bạn
                </ThemedText>
              </View>
            </View>
            <IconSymbol name="chevron.right" size={20} color="#CBD5E1" />
          </TouchableOpacity>
        </View>

        {/* Settings */}
        <View style={styles.menuSection}>
          <ThemedText style={styles.sectionTitle}>Cài đặt</ThemedText>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert("Chưa có", "Tính năng này sẽ được thêm sau.")
            }
          >
            <View style={styles.menuItemLeft}>
              <IconSymbol name="bell.fill" size={20} color="#0A7EA4" />
              <View style={styles.menuItemContent}>
                <ThemedText style={styles.menuItemTitle}>Thông báo</ThemedText>
                <ThemedText style={styles.menuItemSubtitle}>
                  Quản lý cài đặt thông báo
                </ThemedText>
              </View>
            </View>
            <IconSymbol name="chevron.right" size={20} color="#CBD5E1" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert("Chưa có", "Tính năng này sẽ được thêm sau.")
            }
          >
            <View style={styles.menuItemLeft}>
              <IconSymbol name="globe" size={20} color="#0A7EA4" />
              <View style={styles.menuItemContent}>
                <ThemedText style={styles.menuItemTitle}>Ngôn ngữ</ThemedText>
                <ThemedText style={styles.menuItemSubtitle}>
                  Tiếng Việt
                </ThemedText>
              </View>
            </View>
            <IconSymbol name="chevron.right" size={20} color="#CBD5E1" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert("Chưa có", "Tính năng này sẽ được thêm sau.")
            }
          >
            <View style={styles.menuItemLeft}>
              <IconSymbol name="moon.fill" size={20} color="#0A7EA4" />
              <View style={styles.menuItemContent}>
                <ThemedText style={styles.menuItemTitle}>Giao diện</ThemedText>
                <ThemedText style={styles.menuItemSubtitle}>
                  Tùy chỉnh chế độ hiển thị
                </ThemedText>
              </View>
            </View>
            <IconSymbol name="chevron.right" size={20} color="#CBD5E1" />
          </TouchableOpacity>
        </View>

        {/* Support & About */}
        <View style={styles.menuSection}>
          <ThemedText style={styles.sectionTitle}>
            Hỗ trợ & Thông tin
          </ThemedText>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert("Chưa có", "Tính năng này sẽ được thêm sau.")
            }
          >
            <View style={styles.menuItemLeft}>
              <IconSymbol
                name="questionmark.circle.fill"
                size={20}
                color="#0A7EA4"
              />
              <View style={styles.menuItemContent}>
                <ThemedText style={styles.menuItemTitle}>
                  Trợ giúp & hỗ trợ
                </ThemedText>
                <ThemedText style={styles.menuItemSubtitle}>
                  Liên hệ với chúng tôi
                </ThemedText>
              </View>
            </View>
            <IconSymbol name="chevron.right" size={20} color="#CBD5E1" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert("Chưa có", "Tính năng này sẽ được thêm sau.")
            }
          >
            <View style={styles.menuItemLeft}>
              <IconSymbol name="info.circle.fill" size={20} color="#0A7EA4" />
              <View style={styles.menuItemContent}>
                <ThemedText style={styles.menuItemTitle}>
                  Về ứng dụng
                </ThemedText>
                <ThemedText style={styles.menuItemSubtitle}>
                  Phiên bản 1.0.0
                </ThemedText>
              </View>
            </View>
            <IconSymbol name="chevron.right" size={20} color="#CBD5E1" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert("Chưa có", "Tính năng này sẽ được thêm sau.")
            }
          >
            <View style={styles.menuItemLeft}>
              <IconSymbol name="doc.fill" size={20} color="#0A7EA4" />
              <View style={styles.menuItemContent}>
                <ThemedText style={styles.menuItemTitle}>
                  Điều khoản & Chính sách
                </ThemedText>
                <ThemedText style={styles.menuItemSubtitle}>
                  Đọc các điều khoản sử dụng
                </ThemedText>
              </View>
            </View>
            <IconSymbol name="chevron.right" size={20} color="#CBD5E1" />
          </TouchableOpacity>
        </View>

        {/* Account Actions */}
        <View style={styles.dangerSection}>
          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.85}
            onPress={handleLogout}
            disabled={isLoggingOut}
          >
            <IconSymbol
              name="arrow.right.from.line"
              size={20}
              color="#DC2626"
            />
            <ThemedText style={styles.logoutButtonText}>Đăng xuất</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteAccountButton}
            activeOpacity={0.85}
            onPress={() =>
              Alert.alert(
                "Xóa tài khoản",
                "Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn.",
                [
                  { text: "Hủy", style: "cancel" },
                  {
                    text: "Xóa",
                    style: "destructive",
                    onPress: () => {
                      Alert.alert("Chưa có", "Tính năng này sẽ được thêm sau.");
                    },
                  },
                ],
              )
            }
          >
            <IconSymbol name="trash.fill" size={20} color="#DC2626" />
            <ThemedText style={styles.deleteAccountButtonText}>
              Xóa tài khoản
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
    gap: 24,
  },

  // Not Logged In
  notLoggedInContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    gap: 16,
  },
  notLoggedInTitle: {
    marginTop: 16,
    textAlign: "center",
  },
  notLoggedInSubtitle: {
    textAlign: "center",
    color: "#64748B",
    marginBottom: 8,
  },
  loginButton: {
    backgroundColor: "#0A7EA4",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  // Profile Section
  profileSection: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 16,
  },
  avatarContainer: {
    marginBottom: 8,
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#0A7EA4",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "700",
  },
  userName: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  infoCard: {
    width: "100%",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#E0F2FE",
    justifyContent: "center",
    alignItems: "center",
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
  },

  // Menu Section
  menuSection: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  menuItemLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 13,
    color: "#94A3B8",
  },

  // Logout Button
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#FECACA",
    gap: 8,
  },
  logoutButtonText: {
    color: "#DC2626",
    fontSize: 16,
    fontWeight: "700",
  },

  // Delete Account Button
  deleteAccountButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: "#DC2626",
    gap: 8,
    marginTop: 12,
  },
  deleteAccountButtonText: {
    color: "#DC2626",
    fontSize: 16,
    fontWeight: "700",
  },

  // Danger Section
  dangerSection: {
    gap: 12,
  },

  // Stats Section
  statsSection: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#E0F2FE",
    justifyContent: "center",
    alignItems: "center",
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  statLabel: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },

  // Quick Actions Section
  quickActionsSection: {
    gap: 8,
  },
  quickActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0A7EA4",
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  quickActionText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  // Content Section
  contentSection: {
    gap: 8,
  },
  contentItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  contentItemLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  contentItemContent: {
    flex: 1,
  },
  contentItemTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 2,
  },
  contentItemSubtitle: {
    fontSize: 13,
    color: "#94A3B8",
  },

  // Verified Badge
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
});
