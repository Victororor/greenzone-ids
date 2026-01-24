import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Text,
  Pressable,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import BottomBar from "../components/BottomBar";
import { apiGet } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TAB_BAR_HEIGHT = 104;

const CAT_LABELS = {
  shop: "Negozio Bio",
  farm: "Fattoria",
  restaurant: "Ristorante",
  market: "Mercato",
  cafe: "Caffetteria",
  bakery: "Panificio",
  other: "Altro",
};

const FILTERS = [
  { value: null, label: "Tutti" },
  { value: "restaurant", label: "Ristoranti" },
  { value: "shop", label: "Negozi Bio" },
  { value: "farm", label: "Fattorie" },
  { value: "market", label: "Mercati" },
  { value: "cafe", label: "Caffetterie" },
  { value: "bakery", label: "Panifici" },
  { value: "other", label: "Altro" },
  { value: "favorites", label: "Preferiti" },
];

export default function HomeScreen() {
  const [idToken, setIdToken] = useState(null);

  const [location, setLocation] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [places, setPlaces] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permesso negato", "Serve la posizione per usare la mappa");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      try {
        const idToken = await AsyncStorage.getItem("idToken");

        const res = await apiGet("/api/places");
        setPlaces(res.data.places || []);

        const favRes = await apiGet("/api/favorites/me", {
          Authorization: `Bearer ${idToken}`,
        });
        setFavorites(favRes.data.favorites || []);

        console.log("PLACES:", res.data.places);
        console.log("FAVORITES:", favRes.data.favorites);
      } catch (e) {
        console.log("ERR CARICAMENTO:", e);
      }
    })();
  }, []);

  let filteredPlaces = places;

  if (selectedFilter && selectedFilter !== "favorites") {
    filteredPlaces = places.filter((p) => p.category === selectedFilter);
  }

  if (selectedFilter === "favorites") {
    filteredPlaces = favorites;
  }

  const isReady = location && mapReady;

  return (
    <View style={styles.container}>
      {/* FILTER BUTTON */}
      <Pressable
        style={styles.filterButton}
        onPress={() => setShowFilter(true)}
      >
        <Ionicons name="filter" size={22} color="#14948B" />
      </Pressable>

      {/* POPUP SMALL */}
      <Modal
        visible={showFilter}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFilter(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setShowFilter(false)}>
          <View style={styles.filterBox}>
            {FILTERS.map((f) => (
              <Pressable
                key={f.value ?? "all"}
                style={[
                  styles.filterItem,
                  selectedFilter === f.value && styles.filterItemActive,
                ]}
                onPress={() => {
                  setSelectedFilter(f.value);
                  setShowFilter(false);
                }}
              >
                <Text
                  style={[
                    styles.filterLabel,
                    selectedFilter === f.value && styles.filterLabelActive,
                  ]}
                >
                  {f.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* MAP */}
      {location && (
        <MapView
          style={[
            StyleSheet.absoluteFillObject,
            { bottom: TAB_BAR_HEIGHT, opacity: isReady ? 1 : 0 },
          ]}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          showsUserLocation
          onMapReady={() => setMapReady(true)}
        >
          {filteredPlaces.map((place) => (
            <Marker
              key={place.id}
              coordinate={{
                latitude: place.location.latitude,
                longitude: place.location.longitude,
              }}
              title={place.name}
              description={CAT_LABELS[place.category] || place.category}
              pinColor="#14948B" // stile greenZone
            />
          ))}
        </MapView>
      )}

      {/* LOADING finché non è pronta */}
      {!isReady && (
        <View style={styles.loader}>
          <ActivityIndicator
            size="large"
            color="#14948B"
            style={{ transform: [{ scale: 2 }] }}
          />

          <Text style={styles.loaderText}>Caricamento...</Text>
        </View>
      )}

      {/* NAVBAR APP */}
      <BottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  filterButton: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 20,
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  overlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },

  filterBox: {
    marginTop: 90,
    marginLeft: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 8,
    width: 180,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
  },

  filterItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
  },

  filterItemActive: {
    backgroundColor: "#14948B20",
  },

  filterLabel: {
    fontSize: 15,
    color: "#333",
  },

  filterLabelActive: {
    fontWeight: "700",
    color: "#14948B",
  },

  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loaderText: {
    marginTop: 12,
    fontSize: 16,
    color: "#0b0e14ff",
  },
});
