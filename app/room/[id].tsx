import { useState } from 'react';
import { Image } from 'expo-image';
import { Linking, Modal, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Link, Stack, useLocalSearchParams } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useFavorites } from '@/contexts/favorites-context';
import { useListings } from '@/contexts/listings-context';
import { type RentalListing } from '@/data/rentals';

export default function RoomDetailScreen() {
  const { id } = useLocalSearchParams() as { id?: string };
  const { listings } = useListings();
  const room = listings.find((item: RentalListing) => item.id === id);
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = room ? isFavorite(room.id) : false;
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);

  return (
    <ThemedView style={styles.pageContainer}>
      <Stack.Screen options={{ title: room?.title ?? 'Chi tiết phòng' }} />
      <ScrollView contentContainerStyle={styles.content}>
        <Link href="/" style={styles.backLink}>
          <ThemedText type="defaultSemiBold">← Quay lại</ThemedText>
        </Link>
        {room ? (
          <>
            <View style={styles.imageWrapper}>
              <TouchableOpacity
                style={styles.imageTouchable}
                activeOpacity={0.9}
                onPress={() => setIsImageModalVisible(true)}>
                <Image source={{ uri: room.imageUrl }} style={styles.image} contentFit="cover" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.favoriteToggle, favorite && styles.favoriteToggleActive]}
                onPress={() => toggleFavorite(room.id)}
                activeOpacity={0.85}>
                <IconSymbol
                  name={favorite ? 'heart.fill' : 'heart'}
                  size={20}
                  color={favorite ? '#DC2626' : '#475569'}
                />
              </TouchableOpacity>
            </View>
            <Modal
              visible={isImageModalVisible}
              transparent
              animationType="fade"
              onRequestClose={() => setIsImageModalVisible(false)}>
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setIsImageModalVisible(false)}>
                <TouchableWithoutFeedback>
                  <View style={styles.modalImageWrapper}>
                    <Image source={{ uri: room.imageUrl }} style={styles.modalImage} contentFit="contain" />
                  </View>
                </TouchableWithoutFeedback>
              </TouchableOpacity>
            </Modal>
            <View style={styles.titleRow}>
              <View style={styles.titleBlock}>
                <ThemedText type="title" style={styles.title}>
                  {room.title}
                </ThemedText>
                <ThemedText style={styles.infoText}>{room.address}</ThemedText>
              </View>
              <ThemedView style={styles.priceBadge}>
                <ThemedText type="defaultSemiBold" style={styles.price}>
                  {room.price}
                </ThemedText>
              </ThemedView>
            </View>
            <View style={styles.metaRow}>
              <ThemedView style={styles.metaItem}>
                <IconSymbol name="house.fill" size={18} color="#0A7EA4" />
                <ThemedText style={styles.metaText}>{room.area}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.metaItem}>
                <IconSymbol name="paperplane.fill" size={18} color="#0A7EA4" />
                <ThemedText style={styles.metaText}>{room.bedrooms} phòng</ThemedText>
              </ThemedView>
            </View>
            <View style={styles.sectionBlock}>
              <ThemedText type="subtitle">Mô tả</ThemedText>
              <ThemedText style={styles.description}>{room.description}</ThemedText>
            </View>
            <View style={styles.sectionBlock}>
              <ThemedText type="subtitle">Tiện ích</ThemedText>
              <View style={styles.tagsRow}>
                {room.tags.map((tag: string) => (
                  <ThemedView key={tag} style={styles.tag}>
                    <ThemedText>{tag}</ThemedText>
                  </ThemedView>
                ))}
              </View>
            </View>
            <View style={styles.sectionBlock}>
              <ThemedText type="subtitle">Liên hệ</ThemedText>
              <ThemedText style={styles.contactText}>{room.contact}</ThemedText>
              <TouchableOpacity
                style={styles.contactButton}
                activeOpacity={0.85}
                onPress={() => Linking.openURL(`tel:${room.contact.replace(/\D/g, '')}`)}>
                <ThemedText style={styles.contactButtonText}>Gọi ngay</ThemedText>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <ThemedText>Không tìm thấy thông tin phòng. Vui lòng thử lại.</ThemedText>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 24,
    gap: 18,
  },
  backLink: {
    alignSelf: 'flex-start',
  },
  image: {
    width: '100%',
    height: 240,
    borderRadius: 24,
    marginTop: 8,
  },
  titleRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
  },
  imageWrapper: {
    position: 'relative',
  },
  imageTouchable: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalImageWrapper: {
    width: '100%',
    maxHeight: '90%',
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  favoriteToggle: {
    position: 'absolute',
    top: 18,
    right: 18,
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  favoriteToggleActive: {
    backgroundColor: '#FEE2E2',
  },
  infoText: {
    marginTop: 6,
    fontSize: 16,
    lineHeight: 24,
    color: '#475569',
  },
  priceBadge: {
    alignSelf: 'flex-start',
    borderRadius: 18,
    backgroundColor: '#E0F2FE',
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  price: {
    color: '#0A7EA4',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    marginTop: 14,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  metaText: {
    fontSize: 14,
    color: '#475569',
  },
  sectionBlock: {
    gap: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#334155',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#E2E8F0',
  },
  contactText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#334155',
  },
  contactButton: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#0A7EA4',
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
  },
});
