import { FlatList, StyleSheet, View } from 'react-native';

import { RoomCard } from '@/components/room-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { type RentalListing } from '@/data/rentals';
import { useFavorites } from '@/contexts/favorites-context';
import { useListings } from '@/contexts/listings-context';

export default function SavedScreen() {
  const { favorites } = useFavorites();
  const { listings } = useListings();
  const savedRooms = listings.filter((room) => favorites.includes(room.id));

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Yêu thích</ThemedText>
        <ThemedText style={styles.subtitle}>
          Những phòng trọ bạn đã lưu lại để xem sau.
        </ThemedText>
      </View>

      {savedRooms.length > 0 ? (
        <FlatList
          data={savedRooms}
          keyExtractor={(item: RentalListing) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }: { item: RentalListing }) => <RoomCard room={item} />}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <ThemedView style={styles.emptyState}>
          <ThemedText type="subtitle">Bạn chưa lưu phòng nào.</ThemedText>
          <ThemedText style={styles.emptyText}>
            Nhấn vào trái tim để lưu phòng vào danh sách yêu thích.
          </ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8FAFC',
  },
  header: {
    marginBottom: 16,
    gap: 8,
  },
  subtitle: {
    color: '#64748B',
    lineHeight: 24,
  },
  listContent: {
    paddingBottom: 32,
  },
  separator: {
    height: 16,
  },
  emptyState: {
    flex: 1,
    borderRadius: 24,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  emptyText: {
    marginTop: 12,
    color: '#64748B',
    textAlign: 'center',
  },
});
