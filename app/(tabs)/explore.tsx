import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#EFF6FF', dark: '#0F172A' }}
      headerImage={
        <IconSymbol
          size={260}
          color="#0A7EA4"
          name="house.fill"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.container}>
        <View style={styles.heroCard}>
          <ThemedText type="title" style={styles.heroTitle}>
            Mẹo thuê trọ thông minh
          </ThemedText>
          <ThemedText style={styles.heroSubtitle}>
            Lọc, kiểm tra và chuẩn bị hồ sơ đúng cách trước khi đặt phòng.
          </ThemedText>
        </View>

        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <IconSymbol name="paperplane.fill" size={20} color="#0A7EA4" />
            <ThemedText type="subtitle">Kiểm tra kỹ tiện ích</ThemedText>
          </View>
          <ThemedText style={styles.tipText}>
            Chọn phòng có WC riêng, internet ổn định, an ninh, và khoảng cách thuận tiện đến nơi làm việc.
          </ThemedText>
        </View>

        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <IconSymbol name="house.fill" size={20} color="#0A7EA4" />
            <ThemedText type="subtitle">Xem vị trí và giá</ThemedText>
          </View>
          <ThemedText style={styles.tipText}>
            So sánh giá các phòng trong cùng khu vực để chọn nơi phù hợp nhất với ngân sách.
          </ThemedText>
        </View>

        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <IconSymbol name="chevron.left.forwardslash.chevron.right" size={20} color="#0A7EA4" />
            <ThemedText type="subtitle">Chuẩn bị hồ sơ</ThemedText>
          </View>
          <ThemedText style={styles.tipText}>
            Mang theo CMND/CCCD, thông tin người bảo lãnh và đặt cọc khi đi xem phòng.
          </ThemedText>
        </View>

        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80' }}
          style={styles.footerImage}
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#0A7EA4',
    bottom: -60,
    left: -30,
    position: 'absolute',
  },
  container: {
    gap: 16,
  },
  heroCard: {
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
    gap: 10,
  },
  heroTitle: {
    fontSize: 28,
    lineHeight: 36,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
  },
  tipCard: {
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    padding: 18,
    gap: 12,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tipText: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
  },
  footerImage: {
    width: '100%',
    height: 220,
    borderRadius: 24,
    marginTop: 8,
  },
});
