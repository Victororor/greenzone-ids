import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Text,
  Pressable,
  Modal,
  Platform,
  StatusBar
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import BottomBar from "../components/BottomBar";
import { apiGet, apiPost } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles/MapStyles";

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
  const [location, setLocation] = useState(null);
  const [mapReady, setMapReady] = useState(false);

  const [places, setPlaces] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const [selectedFilter, setSelectedFilter] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  const [selectedPlace, setSelectedPlace] = useState(null);

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
        
      } catch (e) {
        console.log("ERR CARICAMENTO:", e);
      }
    })();
  }, []);

  // ====== FAVORITE IDS ======
  const favoriteIds = useMemo(() => {
    // Usiamo String() per sicurezza, anche se dal tuo JSON sembrano già stringhe
    return favorites.map((f) => String(f.id));
  }, [favorites]);

  // ====== FILTERED PLACES ======
  const filteredPlaces = useMemo(() => {
    if (selectedFilter === "favorites") {
      return places.filter((p) => favoriteIds.includes(String(p.id)));
    }
    if (selectedFilter) {
      return places.filter((p) => p.category === selectedFilter);
    }
    return places;
  }, [places, favoriteIds, selectedFilter]);

  // ====== READY STATE ======
  const isReady = location && mapReady;

  // ====== CHECK SE GIÀ NEI PREFERITI (Per la card in basso) ======
  const alreadyFav = selectedPlace && favoriteIds.includes(String(selectedPlace.id));

  async function handleAddFavorite() {
    try {
      const idToken = await AsyncStorage.getItem("idToken");

      await apiPost(`/api/favorites/${selectedPlace.id}`, {}, {
        Authorization: `Bearer ${idToken}`
      });

      setFavorites(prev => [...prev, { id: selectedPlace.id }]);
    } catch (error) {
      console.log("Errore aggiunta preferito:", error);
      Alert.alert("Errore", "Impossibile aggiungere ai preferiti al momento.");
    }
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.filterButton}
        onPress={() => setShowFilter(true)}
      >
        <Ionicons name="filter" size={22} color="#14948B" />
      </Pressable>

      <Modal visible={showFilter} transparent animationType="fade">
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

      {location && (
        <MapView
          style={[
            StyleSheet.absoluteFillObject,
            { bottom: TAB_BAR_HEIGHT, opacity: isReady ? 1 : 0 },
          ]}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          showsUserLocation
          onPress={() => setSelectedPlace(null)}
          onMapReady={() => setMapReady(true)}
        >
          {filteredPlaces.map((place) => {
            // CORREZIONE CRUCIALE: Il calcolo deve avvenire QUI, per ogni singolo posto
            const isFav = favoriteIds.includes(String(place.id));
            
            return (
              <Marker
                // Aggiungiamo isFav alla key per forzare il re-render se cambia stato
                key={`${place.id}-${isFav}`} 
                coordinate={{
                  latitude: place.location.latitude,
                  longitude: place.location.longitude,
                }}
                title={place.name}
                // Ora isFav è specifico per QUESTO marker
                pinColor={isFav ? "#FFD700" : "#14948B"} 
                onPress={() => setSelectedPlace(place)}
              />
            );
          })}
        </MapView>
      )}

      {selectedPlace && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{selectedPlace.name}</Text>
          <Text style={styles.cardSub}>
            {CAT_LABELS[selectedPlace.category]} • {selectedPlace.location.city}
          </Text>

          {!alreadyFav ? (
            <Pressable
              style={styles.favoriteButton}
              onPress={handleAddFavorite}
            >
              <Text style={styles.favoriteText}>Aggiungi ai preferiti</Text>
            </Pressable>
          ) : (
            <Text style={styles.alreadyFav}>Già nei preferiti</Text>
          )}

          <Pressable onPress={() => setSelectedPlace(null)}>
            <Text style={styles.closeText}>Chiudi</Text>
          </Pressable>
        </View>
      )}

      {!isReady && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#14948B" />
          <Text style={styles.loaderText}>Caricamento...</Text>
        </View>
      )}

      <BottomBar />
    </View>
  );
}
