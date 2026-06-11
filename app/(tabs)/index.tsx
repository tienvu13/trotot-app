import Slider from "@react-native-community/slider";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import MapView, { Marker, type Region } from "react-native-maps";

import { RoomCard } from "@/components/room-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/contexts/auth-context";
import { useListings } from "@/contexts/listings-context";
import { provinces, type RentalListing } from "@/data/rentals";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { listings } = useListings();
  const [query, setQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState(provinces[0]);
  const [selectedWards, setSelectedWards] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [showFilters, setShowFilters] = useState(false);
  const [showWardModal, setShowWardModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RentalListing | null>(null);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [mapRegion, setMapRegion] = useState<Region>({
    latitude: 10.8231,
    longitude: 106.6297,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    let newRegion: Region;
    if (selectedProvince === "TP.HCM") {
      newRegion = {
        latitude: 10.8231,
        longitude: 106.6297,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };
    } else if (selectedProvince === "Hà Nội") {
      newRegion = {
        latitude: 21.0278,
        longitude: 105.8342,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };
    } else {
      // Tất cả: center Việt Nam
      newRegion = {
        latitude: 16.0,
        longitude: 106.0,
        latitudeDelta: 10,
        longitudeDelta: 10,
      };
    }
    setMapRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 1000);
  }, [selectedProvince]);

  const handleLocateMe = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Quyền định vị bị từ chối",
          "Vui lòng cho phép ứng dụng truy cập vị trí của bạn.",
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      const region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setMapRegion(region);
      mapRef.current?.animateToRegion(region, 1000);
    } catch {
      Alert.alert(
        "Không thể xác định vị trí",
        "Đã có lỗi xảy ra khi lấy vị trí của bạn.",
      );
    }
  };

  const provinceWards = useMemo(() => {
    if (selectedProvince === "Tất cả") {
      return [];
    }

    return Array.from(
      new Set(
        listings
          .filter((room: RentalListing) => room.province === selectedProvince)
          .map((room: RentalListing) => room.ward),
      ),
    );
  }, [selectedProvince, listings]);

  const formatPrice = (value: number) => {
    if (value >= 10000000) {
      return "10 triệu+";
    }

    const million = value / 1000000;
    return Number.isInteger(million)
      ? `${million} triệu`
      : `${million.toFixed(1).replace(/\.0$/, "")} triệu`;
  };

  const PriceRangeSlider = ({
    min,
    max,
    step,
    value,
    onValueChange,
  }: {
    min: number;
    max: number;
    step: number;
    value: [number, number];
    onValueChange: (newValue: [number, number]) => void;
  }) => {
    const [trackWidth, setTrackWidth] = useState(0);
    const [localValue, setLocalValue] = useState<[number, number]>(value);

    const handleFromChange = (nextFrom: number) => {
      const newFrom = Math.max(
        Math.min(nextFrom, Math.max(localValue[1] - step, min)),
        min,
      );
      const newValue = [newFrom, localValue[1]] as [number, number];
      setLocalValue(newValue);
      onValueChange(newValue);
    };

    const handleToChange = (nextTo: number) => {
      const newTo = Math.min(
        Math.max(nextTo, Math.min(localValue[0] + step, max)),
        max,
      );
      const newValue = [localValue[0], newTo] as [number, number];
      setLocalValue(newValue);
      onValueChange(newValue);
    };

    const activeLeft =
      trackWidth > 0 ? ((localValue[0] - min) / (max - min)) * trackWidth : 0;
    const activeWidth =
      trackWidth > 0
        ? ((localValue[1] - localValue[0]) / (max - min)) * trackWidth
        : 0;

    return (
      <View
        style={styles.rangeSliderContainer}
        onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
      >
        <View style={styles.rangeTrackBackground} />
        <View
          style={[
            styles.rangeTrackActive,
            { left: activeLeft, width: activeWidth },
          ]}
        />
        <Slider
          style={styles.sliderOverlay}
          minimumValue={min}
          maximumValue={max}
          step={step}
          value={localValue[0]}
          onValueChange={handleFromChange}
          thumbTintColor="#0A7EA4"
          minimumTrackTintColor="transparent"
          maximumTrackTintColor="transparent"
        />
        <Slider
          style={styles.sliderOverlay}
          minimumValue={min}
          maximumValue={max}
          step={step}
          value={localValue[1]}
          onValueChange={handleToChange}
          thumbTintColor="#0A7EA4"
          minimumTrackTintColor="transparent"
          maximumTrackTintColor="transparent"
        />
      </View>
    );
  };

  const priceNumbers = useMemo(() => {
    return listings.map((room) => Number(room.price.replace(/[^0-9]/g, "")));
  }, [listings]);

  const filteredRooms = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return listings.filter((room: RentalListing, index: number) => {
      if (selectedProvince !== "Tất cả" && room.province !== selectedProvince) {
        return false;
      }
      if (selectedWards.length > 0 && !selectedWards.includes(room.ward)) {
        return false;
      }
      const price = priceNumbers[index];
      if (price < priceRange[0] || price > priceRange[1]) {
        return false;
      }
      if (!normalizedQuery) {
        return true;
      }
      return (
        room.title.toLowerCase().includes(normalizedQuery) ||
        room.address.toLowerCase().includes(normalizedQuery) ||
        room.district.toLowerCase().includes(normalizedQuery) ||
        room.tags.some((tag: string) =>
          tag.toLowerCase().includes(normalizedQuery),
        )
      );
    });
  }, [
    query,
    selectedProvince,
    selectedWards,
    priceRange,
    priceNumbers,
    listings,
  ]);

  return (
    <ThemedView style={styles.container}>
      {/* Hero header removed as requested */}

      {/* auth card removed — homepage now only shows search */}

      <View style={styles.searchCard}>
        <View style={styles.searchInputRow}>
          <IconSymbol name="paperplane.fill" size={20} color="#0A7EA4" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Tìm theo địa điểm hoặc tiện ích"
            placeholderTextColor="#6B7280"
            style={styles.searchInput}
            returnKeyType="search"
          />
        </View>

        <View style={styles.filterActionsRow}>
          <TouchableOpacity
            style={styles.filterToggle}
            activeOpacity={0.8}
            onPress={() => setShowFilters((prev) => !prev)}
          >
            <View style={styles.filterToggleContent}>
              <IconSymbol
                name={showFilters ? "chevron.up" : "chevron.down"}
                size={18}
                color="#0A7EA4"
              />
              <ThemedText
                type="defaultSemiBold"
                style={styles.filterToggleText}
              >
                {showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
              </ThemedText>
            </View>
          </TouchableOpacity>
          {user ? (
            <TouchableOpacity
              style={styles.avatarButton}
              activeOpacity={0.85}
              onPress={() => router.push("/manage")}
            >
              <View style={styles.avatarSmall}>
                <ThemedText style={styles.avatarSmallText}>
                  {user.name.charAt(0).toUpperCase()}
                </ThemedText>
              </View>
              <ThemedText style={styles.avatarButtonText} numberOfLines={1}>
                {user.name.split(" ")[0]}
              </ThemedText>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.profileButton}
              activeOpacity={0.85}
              onPress={() => router.push("/login")}
            >
              <IconSymbol name="person.fill" size={18} color="#0A7EA4" />
              <ThemedText style={styles.profileButtonText}>
                Đăng nhập
              </ThemedText>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.locateButton}
            activeOpacity={0.85}
            onPress={handleLocateMe}
          >
            <IconSymbol name="location" size={18} color="#0A7EA4" />
            <ThemedText style={styles.locateButtonText}>Định vị bạn</ThemedText>
          </TouchableOpacity>
        </View>

        {showFilters && (
          <>
            <View style={styles.filterGroup}>
              <ThemedText
                type="defaultSemiBold"
                style={styles.filterGroupLabel}
              >
                Tỉnh / TP
              </ThemedText>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterRow}
                style={styles.filterScroll}
              >
                {provinces.map((province: string) => (
                  <TouchableOpacity
                    key={province}
                    style={[
                      styles.filterButton,
                      selectedProvince === province &&
                        styles.filterButtonActive,
                    ]}
                    onPress={() => {
                      setSelectedProvince(province);
                      setSelectedWards([]);
                    }}
                    activeOpacity={0.85}
                  >
                    <ThemedText
                      type="defaultSemiBold"
                      style={
                        selectedProvince === province
                          ? styles.filterTextActive
                          : styles.filterText
                      }
                    >
                      {province}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {selectedProvince !== "Tất cả" && (
              <View style={styles.filterGroup}>
                <TouchableOpacity
                  style={styles.filterButton}
                  onPress={() => setShowWardModal(true)}
                  activeOpacity={0.85}
                >
                  <ThemedText type="defaultSemiBold" style={styles.filterText}>
                    {selectedWards.length > 0
                      ? `Đã chọn ${selectedWards.length} phường/xã`
                      : "Chọn Xã / Phường"}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.filterGroup}>
              <ThemedText
                type="defaultSemiBold"
                style={styles.filterGroupLabel}
              >
                Giá
              </ThemedText>
              <View style={styles.priceLabelsRow}>
                <ThemedText style={styles.priceRangeText}>
                  {formatPrice(priceRange[0])}
                </ThemedText>
                <ThemedText style={styles.priceRangeText}>
                  {formatPrice(priceRange[1])}
                </ThemedText>
              </View>
              <View style={styles.rangeSliderWrapper}>
                <PriceRangeSlider
                  min={0}
                  max={10000000}
                  step={500000}
                  value={priceRange}
                  onValueChange={setPriceRange}
                />
              </View>
            </View>
          </>
        )}
      </View>

      <Modal
        visible={showWardModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowWardModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText type="title" style={styles.modalTitle}>
              Chọn Xã / Phường
            </ThemedText>
            <ScrollView contentContainerStyle={styles.modalList}>
              {provinceWards.map((ward: string) => {
                const isSelected = selectedWards.includes(ward);
                return (
                  <TouchableOpacity
                    key={ward}
                    style={[
                      styles.modalOption,
                      isSelected && styles.modalOptionActive,
                    ]}
                    onPress={() => {
                      setSelectedWards((prev) =>
                        prev.includes(ward)
                          ? prev.filter((item) => item !== ward)
                          : [...prev, ward],
                      );
                    }}
                    activeOpacity={0.85}
                  >
                    <ThemedText
                      style={
                        isSelected
                          ? styles.modalOptionTextActive
                          : styles.modalOptionText
                      }
                    >
                      {ward}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalClearButton}
                onPress={() => setSelectedWards([])}
                activeOpacity={0.85}
              >
                <ThemedText style={styles.modalClearText}>Bỏ chọn</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalDoneButton}
                onPress={() => setShowWardModal(false)}
                activeOpacity={0.85}
              >
                <ThemedText style={styles.modalDoneText}>Xong</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showRoomModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRoomModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.roomModalContent}>
            {selectedRoom && <RoomCard room={selectedRoom} />}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowRoomModal(false)}
              activeOpacity={0.85}
            >
              <IconSymbol name="xmark" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.sectionHeader}>
        <ThemedText type="subtitle">Phòng trên bản đồ</ThemedText>
        <ThemedText style={styles.sectionHint}>
          {filteredRooms.length} phòng phù hợp với bộ lọc.
        </ThemedText>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          ref={(ref) => {
            mapRef.current = ref;
          }}
          style={styles.map}
          region={mapRegion}
          onRegionChangeComplete={(region) => setMapRegion(region)}
          showsUserLocation={!!userLocation}
        >
          {filteredRooms.map((room) => (
            <Marker
              key={room.id}
              coordinate={{
                latitude: room.latitude,
                longitude: room.longitude,
              }}
              title={room.title}
              description={`${room.price} - ${room.area}`}
              onPress={() => {
                setSelectedRoom(room);
                setShowRoomModal(true);
              }}
            />
          ))}
          {userLocation && (
            <Marker
              key="user-location"
              coordinate={userLocation}
              title="Bạn đang ở đây"
              pinColor="#0A7EA4"
            />
          )}
        </MapView>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 16,
  },
  heroContainer: {
    flexDirection: "row",
    borderRadius: 24,
    padding: 22,
    backgroundColor: "#E0F2FE",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 16,
  },
  heroText: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 28,
    lineHeight: 36,
  },
  heroSubtitle: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 24,
    color: "#475569",
  },
  heroBadge: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    shadowColor: "#0A7EA4",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  heroBadgeNumber: {
    fontSize: 22,
    color: "#0A7EA4",
  },
  heroBadgeLabel: {
    marginTop: 4,
    fontSize: 14,
    color: "#64748B",
  },
  searchCard: {
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
    marginBottom: 16,
    gap: 12,
  },
  searchInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: "#F1F5F9",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#0F172A",
  },
  filterToggle: {
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#E0F2FE",
    alignSelf: "flex-start",
    marginTop: 8,
  },
  filterToggleContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  filterToggleText: {
    color: "#0A7EA4",
    fontSize: 14,
  },
  filterGroup: {
    gap: 8,
  },
  filterGroupLabel: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 6,
  },
  filterScroll: {
    maxHeight: 44,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    paddingBottom: 4,
  },
  authCard: {
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  authRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  authGreeting: {
    fontSize: 16,
    color: "#0F172A",
  },
  authSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#475569",
  },
  authButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#0A7EA4",
  },
  authButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  authButtonSecondary: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#0A7EA4",
  },
  authButtonSecondaryText: {
    color: "#0A7EA4",
    fontWeight: "700",
  },
  authLogoutButton: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#0A7EA4",
  },
  authLogoutText: {
    color: "#0A7EA4",
    fontWeight: "700",
  },
  postButton: {
    marginTop: 12,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#0A7EA4",
  },
  postButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  manageButton: {
    marginTop: 8,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#10B981",
  },
  manageButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  filterButton: {
    minHeight: 34,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "transparent",
  },
  filterActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  locateButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#E0F2FE",
    borderWidth: 1,
    borderColor: "#0A7EA4",
  },
  profileButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#0A7EA4",
  },
  profileButtonText: {
    color: "#0A7EA4",
    fontSize: 14,
    fontWeight: "600",
  },
  avatarButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#E0F2FE",
    borderWidth: 1,
    borderColor: "#0A7EA4",
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#0A7EA4",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarSmallText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  avatarButtonText: {
    color: "#0A7EA4",
    fontSize: 13,
    fontWeight: "600",
    maxWidth: 60,
  },
  locateButtonText: {
    color: "#0A7EA4",
    fontSize: 14,
    fontWeight: "600",
  },
  filterButtonActive: {
    backgroundColor: "#0A7EA4",
    borderColor: "#0A7EA4",
  },
  filterText: {
    color: "#0F172A",
    fontSize: 13,
  },
  filterTextActive: {
    color: "#FFFFFF",
    fontSize: 13,
  },
  priceLabelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  priceRangeText: {
    fontSize: 13,
    color: "#0A7EA4",
  },
  priceInputsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  priceInputContainer: {
    flex: 1,
    gap: 4,
  },
  priceInputLabel: {
    fontSize: 12,
    color: "#64748B",
  },
  priceInput: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: "#0F172A",
    backgroundColor: "#FFFFFF",
  },
  rangeSliderWrapper: {
    width: "100%",
    height: 40,
    justifyContent: "center",
  },
  rangeSliderContainer: {
    width: "100%",
    height: 40,
    justifyContent: "center",
  },
  rangeTrackBackground: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(10, 126, 164, 0.2)",
  },
  rangeTrackActive: {
    position: "absolute",
    top: "50%",
    height: 6,
    borderRadius: 3,
    backgroundColor: "#0A7EA4",
    transform: [{ translateY: -3 }],
  },
  sliderOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 40,
  },
  rangeSlider: {
    width: "100%",
    height: 80,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(15, 23, 42, 0.35)",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "#FFFFFF",
    padding: 20,
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 14,
  },
  modalList: {
    gap: 10,
    paddingBottom: 20,
  },
  modalOption: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "transparent",
  },
  modalOptionActive: {
    backgroundColor: "#0A7EA4",
    borderColor: "#0A7EA4",
  },
  modalOptionText: {
    fontSize: 14,
    color: "#0F172A",
  },
  modalOptionTextActive: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 12,
  },
  modalClearButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
  },
  modalClearText: {
    color: "#0F172A",
    fontSize: 14,
  },
  modalDoneButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#0A7EA4",
    alignItems: "center",
  },
  modalDoneText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  sectionHeader: {
    marginBottom: 10,
    gap: 4,
  },
  sectionHint: {
    color: "#64748B",
  },
  listContent: {
    paddingBottom: 32,
  },
  separator: {
    height: 16,
  },
  card: {
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  cardImageWrapper: {
    width: "100%",
    height: 210,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardBody: {
    padding: 18,
    gap: 16,
  },
  cardTitle: {
    fontSize: 18,
    lineHeight: 24,
  },
  cardMeta: {
    marginTop: 6,
    color: "#64748B",
  },
  cardFooter: {
    gap: 10,
  },
  price: {
    color: "#0A7EA4",
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    borderRadius: 999,
    backgroundColor: "#EEF2FF",
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  emptyText: {
    textAlign: "center",
    color: "#64748B",
    marginTop: 32,
  },
  mapContainer: {
    flex: 1,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  roomModalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "#0A7EA4",
    borderRadius: 20,
    padding: 10,
  },
});
