import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import MapView, {
    Marker,
    PROVIDER_GOOGLE,
    type LatLng,
    type Region,
} from "react-native-maps";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/contexts/auth-context";
import { useListings } from "@/contexts/listings-context";

export default function CreatePostScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { addListing } = useListings();

  const [title, setTitle] = useState("");
  const [province, setProvince] = useState("Hà Nội");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [area, setArea] = useState("");
  const [bedrooms, setBedrooms] = useState("1");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [contact, setContact] = useState("");
  const [latitude, setLatitude] = useState("21.028");
  const [longitude, setLongitude] = useState("105.854");
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [markerLocation, setMarkerLocation] = useState<LatLng>({
    latitude: 21.028,
    longitude: 105.854,
  });
  const [mapRegion, setMapRegion] = useState<Region>({
    latitude: 21.028,
    longitude: 105.854,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  if (!user) {
    return (
      <ThemedView style={styles.pageContainer}>
        <Stack.Screen options={{ title: "Đăng bài" }} />
        <View style={styles.notLoggedInContainer}>
          <ThemedText type="title">Bạn cần đăng nhập</ThemedText>
          <ThemedText style={styles.subtitle}>
            Vui lòng đăng nhập để đăng bài cho chủ trọ.
          </ThemedText>
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.85}
            onPress={() => router.push("/login")}
          >
            <ThemedText style={styles.primaryButtonText}>Đăng nhập</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  const handleChooseImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Quyền truy cập ảnh bị từ chối",
        "Vui lòng cho phép truy cập thư viện ảnh.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setSelectedImageUri(result.assets[0].uri);
      setImageUrl("");
    }
  };

  useEffect(() => {
    if (!address.trim()) {
      return;
    }

    const timer = setTimeout(async () => {
      setIsGeocoding(true);
      try {
        const geocoded = await Location.geocodeAsync(address);
        if (geocoded.length > 0) {
          const match = geocoded[0];
          setLatitude(match.latitude.toFixed(6));
          setLongitude(match.longitude.toFixed(6));
          const region = {
            latitude: match.latitude,
            longitude: match.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          setMapRegion(region);
          setMarkerLocation({
            latitude: match.latitude,
            longitude: match.longitude,
          });
        }
      } catch {
        // ignore geocoding failures
      } finally {
        setIsGeocoding(false);
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [address]);

  useEffect(() => {
    const lat = Number(latitude);
    const lon = Number(longitude);
    if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
      setMarkerLocation({ latitude: lat, longitude: lon });
      setMapRegion((prev) => ({ ...prev, latitude: lat, longitude: lon }));
    }
  }, [latitude, longitude]);

  const handleMarkerDragEnd = async (event: any) => {
    const { latitude: lat, longitude: lon } = event.nativeEvent.coordinate;
    setLatitude(lat.toFixed(6));
    setLongitude(lon.toFixed(6));
    setMarkerLocation({ latitude: lat, longitude: lon });
    setMapRegion((prev) => ({ ...prev, latitude: lat, longitude: lon }));

    try {
      const places = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lon,
      });
      if (places.length > 0) {
        const place = places[0];
        const formatted = [
          place.name,
          place.street,
          place.subregion,
          place.city,
          place.region,
        ]
          .filter(Boolean)
          .join(", ");
        if (formatted) {
          setAddress(formatted);
        }
      }
    } catch {
      // ignore reverse geocode failures
    }
  };

  const handleSubmit = async () => {
    if (
      !title ||
      !province ||
      !district ||
      !ward ||
      !address ||
      !price ||
      !area ||
      !description ||
      !contact
    ) {
      Alert.alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const bedroomCount = Number(bedrooms) || 1;
    const parsedLatitude = Number(latitude);
    const parsedLongitude = Number(longitude);

    if (Number.isNaN(parsedLatitude) || Number.isNaN(parsedLongitude)) {
      Alert.alert("Vui lòng nhập tọa độ hợp lệ");
      return;
    }

    await addListing({
      title,
      province,
      district,
      ward,
      address,
      price,
      area,
      bedrooms: bedroomCount,
      description,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      imageUrl:
        selectedImageUri ||
        imageUrl ||
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
      contact,
      latitude: parsedLatitude,
      longitude: parsedLongitude,
      ownerEmail: user.email,
    });

    Alert.alert("Đăng bài thành công", "Phòng trọ đã được thêm vào danh sách.");
    router.push("/");
  };

  return (
    <ThemedView style={styles.pageContainer}>
      <Stack.Screen options={{ title: "Đăng bài cho chủ trọ" }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoiding}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <ThemedText type="title" style={styles.title}>
            Đăng bài cho chủ trọ
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Nhập thông tin phòng trọ để chủ trọ có thể đăng tin và kết nối với
            khách thuê.
          </ThemedText>

          <View style={styles.fieldGroup}>
            <ThemedText style={styles.fieldLabel}>Tiêu đề</ThemedText>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Tiêu đề phòng trọ"
              placeholderTextColor="#94A3B8"
              style={styles.input}
            />
          </View>
          <View style={styles.fieldGroup}>
            <ThemedText style={styles.fieldLabel}>Tỉnh / Thành phố</ThemedText>
            <TextInput
              value={province}
              onChangeText={setProvince}
              placeholder="Hà Nội"
              placeholderTextColor="#94A3B8"
              style={styles.input}
            />
          </View>
          <View style={styles.fieldGroup}>
            <ThemedText style={styles.fieldLabel}>Quận / Huyện</ThemedText>
            <TextInput
              value={district}
              onChangeText={setDistrict}
              placeholder="Quận"
              placeholderTextColor="#94A3B8"
              style={styles.input}
            />
          </View>
          <View style={styles.fieldGroup}>
            <ThemedText style={styles.fieldLabel}>Phường / Xã</ThemedText>
            <TextInput
              value={ward}
              onChangeText={setWard}
              placeholder="Phường"
              placeholderTextColor="#94A3B8"
              style={styles.input}
            />
          </View>
          <View style={styles.fieldGroup}>
            <ThemedText style={styles.fieldLabel}>Địa chỉ</ThemedText>
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Địa chỉ cụ thể"
              placeholderTextColor="#94A3B8"
              style={styles.input}
            />
          </View>
          <View style={styles.fieldGroup}>
            <ThemedText style={styles.fieldLabel}>Xác định vị trí</ThemedText>
            <ThemedText style={styles.helperText}>
              {isGeocoding
                ? "Đang tự định vị theo địa chỉ..."
                : "Bản đồ tự cập nhật theo địa chỉ, kéo điểm đỏ để chỉnh vị trí."}
            </ThemedText>
            <View style={styles.mapPreview}>
              {Platform.OS !== "web" ? (
                <MapView
                  style={styles.mapSmall}
                  provider={
                    Platform.OS === "android" ? PROVIDER_GOOGLE : undefined
                  }
                  initialRegion={mapRegion}
                  region={mapRegion}
                  onRegionChangeComplete={(region) => setMapRegion(region)}
                  scrollEnabled={false}
                  zoomEnabled={false}
                >
                  <Marker
                    coordinate={markerLocation}
                    draggable
                    onDragEnd={handleMarkerDragEnd}
                  />
                </MapView>
              ) : (
                <View style={styles.mapUnavailable}>
                  <ThemedText style={styles.mapUnavailableText}>
                    Bản đồ chỉ hiển thị trên thiết bị di động.
                  </ThemedText>
                </View>
              )}
            </View>
          </View>
          <View style={styles.fieldGroup}>
            <ThemedText style={styles.fieldLabel}>Giá</ThemedText>
            <TextInput
              value={price}
              onChangeText={setPrice}
              placeholder="4.500.000 đ/tháng"
              placeholderTextColor="#94A3B8"
              style={styles.input}
            />
          </View>
          <View style={styles.fieldGroup}>
            <ThemedText style={styles.fieldLabel}>Diện tích</ThemedText>
            <TextInput
              value={area}
              onChangeText={setArea}
              placeholder="20m²"
              placeholderTextColor="#94A3B8"
              style={styles.input}
            />
          </View>
          <View style={styles.fieldGroup}>
            <ThemedText style={styles.fieldLabel}>Số phòng</ThemedText>
            <TextInput
              value={bedrooms}
              onChangeText={setBedrooms}
              placeholder="1"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
          <View style={styles.fieldGroup}>
            <ThemedText style={styles.fieldLabel}>Mô tả</ThemedText>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Mô tả tiện nghi, vị trí..."
              placeholderTextColor="#94A3B8"
              multiline
              style={[styles.input, styles.multilineInput]}
            />
          </View>
          <View style={styles.fieldGroup}>
            <ThemedText style={styles.fieldLabel}>
              Tiện ích (ngăn cách dấu phẩy)
            </ThemedText>
            <TextInput
              value={tags}
              onChangeText={setTags}
              placeholder="WC riêng, Gần chợ, Có bếp"
              placeholderTextColor="#94A3B8"
              style={styles.input}
            />
          </View>
          <View style={styles.fieldGroup}>
            <ThemedText style={styles.fieldLabel}>Ảnh</ThemedText>
            <TouchableOpacity
              style={styles.imageSelectButton}
              activeOpacity={0.85}
              onPress={handleChooseImage}
            >
              <ThemedText style={styles.imageSelectButtonText}>
                Chọn ảnh từ thiết bị
              </ThemedText>
            </TouchableOpacity>
            {selectedImageUri ? (
              <Image
                source={{ uri: selectedImageUri }}
                style={styles.previewImage}
                contentFit="cover"
              />
            ) : null}
            <ThemedText style={styles.helperText}>
              Hoặc nhập URL ảnh nếu không muốn chọn file.
            </ThemedText>
            <TextInput
              value={imageUrl}
              onChangeText={setImageUrl}
              placeholder="URL ảnh"
              placeholderTextColor="#94A3B8"
              style={styles.input}
            />
          </View>
          <View style={styles.fieldGroup}>
            <ThemedText style={styles.fieldLabel}>Liên hệ</ThemedText>
            <TextInput
              value={contact}
              onChangeText={setContact}
              placeholder="0909 123 456"
              placeholderTextColor="#94A3B8"
              style={styles.input}
              keyboardType="phone-pad"
            />
          </View>
          <View style={styles.fieldGroupRow}>
            <View style={styles.fieldHalf}>
              <ThemedText style={styles.fieldLabel}>Vĩ độ</ThemedText>
              <TextInput
                value={latitude}
                onChangeText={setLatitude}
                placeholder="21.028"
                placeholderTextColor="#94A3B8"
                style={styles.input}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.fieldHalf}>
              <ThemedText style={styles.fieldLabel}>Kinh độ</ThemedText>
              <TextInput
                value={longitude}
                onChangeText={setLongitude}
                placeholder="105.854"
                placeholderTextColor="#94A3B8"
                style={styles.input}
                keyboardType="numeric"
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.85}
            onPress={handleSubmit}
          >
            <ThemedText style={styles.primaryButtonText}>Đăng bài</ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  keyboardAvoiding: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 18,
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: "#475569",
  },
  fieldGroup: {
    gap: 10,
  },
  fieldGroupRow: {
    flexDirection: "row",
    gap: 12,
  },
  fieldHalf: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 14,
    color: "#334155",
  },
  input: {
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#0F172A",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  multilineInput: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  primaryButton: {
    marginTop: 8,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "#0A7EA4",
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  helperText: {
    color: "#64748B",
    fontSize: 13,
    lineHeight: 20,
  },
  mapPreview: {
    width: "100%",
    height: 220,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#E2E8F0",
  },
  mapSmall: {
    width: "100%",
    flex: 1,
  },
  mapUnavailable: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  mapUnavailableText: {
    color: "#475569",
    fontSize: 14,
    textAlign: "center",
  },
  imageSelectButton: {
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#E0F2FE",
    marginBottom: 10,
  },
  imageSelectButtonText: {
    color: "#0A7EA4",
    fontWeight: "700",
  },
  previewImage: {
    width: "100%",
    height: 180,
    borderRadius: 18,
    marginBottom: 10,
  },
  notLoggedInContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 18,
  },
});
