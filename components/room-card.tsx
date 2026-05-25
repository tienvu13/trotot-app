import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Link } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useFavorites } from '@/contexts/favorites-context';
import { type RentalListing } from '@/data/rentals';

export function RoomCard({ room }: { room: RentalListing }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(room.id);

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={[styles.favoriteButton, favorite && styles.favoriteButtonActive]}
        onPress={() => toggleFavorite(room.id)}
        activeOpacity={0.8}>
        <IconSymbol name={favorite ? 'heart.fill' : 'heart'} size={18} color={favorite ? '#EF4444' : '#475569'} />
      </TouchableOpacity>
      <Link href={{ pathname: '/room/[id]', params: { id: room.id } }} style={styles.cardLink}>
        <View style={styles.cardImageWrapper}>
          <Image source={{ uri: room.imageUrl }} style={styles.cardImage} contentFit="cover" />
        </View>
        <ThemedView style={styles.cardBody}>
          <View style={styles.cardHeader}>
            <View style={styles.titleContainer}>
              <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
                {room.title}
              </ThemedText>
              <View style={[styles.statusBadge, room.status === 'available' ? styles.availableBadge : styles.rentedBadge]}>
                <ThemedText style={room.status === 'available' ? styles.availableText : styles.rentedText}>
                  {room.status === 'available' ? 'Còn trống' : 'Đã cho thuê'}
                </ThemedText>
              </View>
            </View>
            <ThemedText type="subtitle" style={styles.price}>
              {room.price}
            </ThemedText>
          </View>
          <ThemedText style={styles.cardMeta}>
            {room.district} · {room.area} · {room.bedrooms} pn
          </ThemedText>
          <View style={styles.tagRow}>
            {room.tags.slice(0, 2).map((tag: string) => (
              <View key={tag} style={styles.tag}>
                <ThemedText>{tag}</ThemedText>
              </View>
            ))}
          </View>
        </ThemedView>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  favoriteButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 10,
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  favoriteButtonActive: {
    backgroundColor: '#FFE4E6',
  },
  cardLink: {
    width: '100%',
  },
  cardImageWrapper: {
    width: '100%',
    height: 210,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardBody: {
    padding: 18,
    gap: 12,
  },
  cardHeader: {
    justifyContent: 'space-between',
    gap: 10,
  },
  titleContainer: {
    flex: 1,
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    lineHeight: 24,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  availableBadge: {
    backgroundColor: '#DCFCE7',
  },
  rentedBadge: {
    backgroundColor: '#FEE2E2',
  },
  availableText: {
    color: '#166534',
    fontSize: 12,
    fontWeight: '600',
  },
  rentedText: {
    color: '#991B1B',
    fontSize: 12,
    fontWeight: '600',
  },
  cardMeta: {
    color: '#64748B',
  },
  price: {
    color: '#0A7EA4',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#EEF2FF',
  },
});
