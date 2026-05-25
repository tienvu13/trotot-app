import { useMemo } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';

import { useAuth } from '@/contexts/auth-context';
import { useListings } from '@/contexts/listings-context';
import { RoomCard } from '@/components/room-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { type RentalListing } from '@/data/rentals';

export default function ManageListingsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { getUserListings, editListing, deleteListing } = useListings();

  const userListings = useMemo(() => {
    if (!user) return [];
    return getUserListings(user.email);
  }, [user, getUserListings]);

  const handleDelete = (listing: RentalListing) => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc muốn xóa bài đăng "${listing.title}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => deleteListing(listing.id),
        },
      ],
    );
  };

  const handleEdit = (listing: RentalListing) => {
    // TODO: Navigate to edit screen
    Alert.alert('Chức năng chỉnh sửa', 'Tính năng này sẽ được thêm sau.');
  };

  const handleToggleStatus = (listing: RentalListing) => {
    const newStatus = listing.status === 'available' ? 'rented' : 'available';
    const statusText = newStatus === 'available' ? 'Còn trống' : 'Đã cho thuê';
    Alert.alert(
      'Cập nhật trạng thái',
      `Bạn có chắc muốn cập nhật trạng thái phòng thành "${statusText}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Cập nhật',
          onPress: () => editListing(listing.id, { status: newStatus }),
        },
      ],
    );
  };

  if (!user || user.role !== 'Hộ kinh doanh') {
    return (
      <ThemedView style={styles.pageContainer}>
        <Stack.Screen options={{ title: 'Quản lý trọ' }} />
        <View style={styles.notAllowedContainer}>
          <ThemedText type="title">Không có quyền truy cập</ThemedText>
          <ThemedText style={styles.subtitle}>
            Chỉ hộ kinh doanh mới có thể quản lý trọ.
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.pageContainer}>
      <Stack.Screen options={{ title: 'Quản lý trọ' }} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Quản lý trọ của bạn
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Xem và quản lý các bài đăng trọ của bạn.
          </ThemedText>
        </View>

        {userListings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <IconSymbol name="house.fill" size={64} color="#CBD5E1" />
            <ThemedText type="subtitle" style={styles.emptyTitle}>
              Chưa có bài đăng nào
            </ThemedText>
            <ThemedText style={styles.emptySubtitle}>
              Bắt đầu đăng bài để thu hút khách hàng.
            </ThemedText>
            <TouchableOpacity
              style={styles.postButton}
              activeOpacity={0.85}
              onPress={() => router.push('/post')}
            >
              <ThemedText style={styles.postButtonText}>Đăng bài ngay</ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.listingsContainer}>
            {userListings.map((listing) => (
              <View key={listing.id} style={styles.listingItem}>
                <RoomCard room={listing} />
                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.statusButton]}
                    activeOpacity={0.85}
                    onPress={() => handleToggleStatus(listing)}
                  >
                    <IconSymbol name="arrow.triangle.2.circlepath" size={16} color="#059669" />
                    <ThemedText style={styles.statusButtonText}>
                      {listing.status === 'available' ? 'Cho thuê' : 'Còn trống'}
                    </ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    activeOpacity={0.85}
                    onPress={() => handleEdit(listing)}
                  >
                    <IconSymbol name="pencil" size={16} color="#0A7EA4" />
                    <ThemedText style={styles.editButtonText}>Chỉnh sửa</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    activeOpacity={0.85}
                    onPress={() => handleDelete(listing)}
                  >
                    <IconSymbol name="trash.fill" size={16} color="#DC2626" />
                    <ThemedText style={styles.deleteButtonText}>Xóa</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
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
  },
  header: {
    marginBottom: 24,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    color: '#64748B',
  },
  notAllowedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    color: '#64748B',
  },
  emptySubtitle: {
    textAlign: 'center',
    color: '#94A3B8',
    marginBottom: 24,
  },
  postButton: {
    backgroundColor: '#0A7EA4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  postButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listingsContainer: {
    gap: 16,
  },
  listingItem: {
    gap: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  statusButton: {
    backgroundColor: '#ECFDF5',
  },
  statusButtonText: {
    color: '#059669',
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: '#E0F2FE',
  },
  editButtonText: {
    color: '#0A7EA4',
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FEF2F2',
  },
  deleteButtonText: {
    color: '#DC2626',
    fontWeight: '600',
  },
});